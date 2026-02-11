"use server";

import { z } from "zod";
import { headers } from "next/headers";

// ============================================================
// 1. ESQUEMA DE VALIDACIÓN CON ZOD
// ============================================================
const WaitlistSchema = z.object({
  tipo: z.enum(["paciente", "medico", "empresa"], {
    error: "Tipo de usuario inválido.",
  }),
  detalle: z
    .string()
    .min(1, "El detalle es obligatorio.")
    .max(200, "El detalle no puede superar los 200 caracteres.")
    .trim(),
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(100, "El nombre no puede superar los 100 caracteres.")
    .trim(),
  edad: z
    .coerce
    .number("La edad debe ser un número.")
    .int("La edad debe ser un número entero.")
    .min(1, "La edad debe ser al menos 1.")
    .max(9999, "Valor de edad/empleados no válido."),
  email: z
    .string()
    .email("El correo electrónico no es válido.")
    .max(254, "El email es demasiado largo."),
  whatsapp: z
    .string()
    .min(7, "El número de WhatsApp es muy corto.")
    .max(20, "El número de WhatsApp es muy largo.")
    .regex(/^[\d\s()+-]+$/, "El número de WhatsApp contiene caracteres inválidos."),
  provincia: z
    .string()
    .max(50, "La provincia no puede superar los 50 caracteres.")
    .optional()
    .default("No especificada"),
});

// ============================================================
// 2. SANITIZACIÓN ANTI-FORMULA INJECTION
// ============================================================
// Google Sheets interpreta celdas que empiezan con =, +, -, @, \t, \r
// como fórmulas. Prefijamos con apóstrofe para neutralizarlas.
function sanitizeForSheets(value: string): string {
  const dangerousChars = ["=", "+", "-", "@", "\t", "\r", "\n"];
  if (dangerousChars.some((char) => value.startsWith(char))) {
    return `'${value}`;
  }
  return value;
}

function sanitizeAllFields(
  data: Record<string, string | number>
): Record<string, string> {
  const sanitized: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    sanitized[key] =
      typeof value === "string" ? sanitizeForSheets(value) : String(value);
  }
  return sanitized;
}

// ============================================================
// 3. RATE LIMITING IN-MEMORY
// ============================================================
// Estructura preparada para reemplazar por @upstash/ratelimit + Redis
// en producción. En este MVP usa un Map en memoria.
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 60 segundos
const RATE_LIMIT_MAX_REQUESTS = 3; // 3 envíos por ventana

function checkRateLimit(identifier: string): {
  allowed: boolean;
  retryAfterMs?: number;
} {
  const now = Date.now();
  const timestamps = rateLimitMap.get(identifier) ?? [];

  // Limpiar timestamps fuera de la ventana
  const recentTimestamps = timestamps.filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS
  );

  if (recentTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    const oldestInWindow = recentTimestamps[0];
    const retryAfterMs = RATE_LIMIT_WINDOW_MS - (now - oldestInWindow);
    return { allowed: false, retryAfterMs };
  }

  recentTimestamps.push(now);
  rateLimitMap.set(identifier, recentTimestamps);
  return { allowed: true };
}

// Limpieza periódica del Map para evitar memory leaks
// (En producción, Redis maneja esto automáticamente)
if (typeof globalThis !== "undefined") {
  const CLEANUP_INTERVAL_MS = 5 * 60_000; // cada 5 min
  setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of rateLimitMap.entries()) {
      const recent = timestamps.filter(
        (ts) => now - ts < RATE_LIMIT_WINDOW_MS
      );
      if (recent.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, recent);
      }
    }
  }, CLEANUP_INTERVAL_MS);
}

// ============================================================
// 4. SERVER ACTION PRINCIPAL
// ============================================================
export async function submitToWaitlist(prevState: unknown, formData: FormData) {
  const GOOGLE_URL = process.env.GOOGLE_SHEETS_URL;

  if (!GOOGLE_URL) {
    return { success: false, message: "Error de configuración del servidor." };
  }

  // --- HONEYPOT ---
  const honeypot = formData.get("website_url");
  if (honeypot) {
    // Devolvemos success simulado para no dar pistas al bot
    return { success: true, message: "Datos guardados." };
  }

  // --- RATE LIMITING (IP + Email) ---
  // Usamos la IP como identificador primario para que no se pueda bypassear
  // cambiando el email en cada request.
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown-ip";
  const emailRaw = (formData.get("email") as string) ?? "unknown";

  // Verificamos rate limit por IP (más restrictivo)
  const ipCheck = checkRateLimit(`ip:${ip}`);
  if (!ipCheck.allowed) {
    const retrySeconds = Math.ceil((ipCheck.retryAfterMs ?? 60_000) / 1000);
    return {
      success: false,
      message: `Demasiados intentos. Esperá ${retrySeconds} segundos antes de reintentar.`,
    };
  }

  // También verificamos por email como capa adicional
  const emailCheck = checkRateLimit(`email:${emailRaw.toLowerCase()}`);
  if (!emailCheck.allowed) {
    const retrySeconds = Math.ceil((emailCheck.retryAfterMs ?? 60_000) / 1000);
    return {
      success: false,
      message: `Demasiados intentos. Esperá ${retrySeconds} segundos antes de reintentar.`,
    };
  }

  // --- VALIDACIÓN CON ZOD ---
  const rawInput = {
    tipo: formData.get("tipo_usuario"),
    detalle: formData.get("detalle"),
    nombre: formData.get("nombre"),
    edad: formData.get("edad"),
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp"),
    provincia: formData.get("provincia") || "No especificada",
  };

  const parsed = WaitlistSchema.safeParse(rawInput);

  if (!parsed.success) {
    // Devolvemos el primer error para UX clara
    const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos.";
    return { success: false, message: firstError };
  }

  try {
    // --- SANITIZACIÓN ---
    const sanitizedData = sanitizeAllFields({
      ...parsed.data,
      fecha: new Date().toISOString(),
    });

    // --- ENVÍO A GOOGLE SHEETS ---
    const params = new URLSearchParams();
    Object.entries(sanitizedData).forEach(([key, value]) => {
      params.append(key, value);
    });

    const response = await fetch(GOOGLE_URL, {
      method: "POST",
      body: params,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();

    if (result.result === "success") {
      return { success: true, message: "Datos guardados." };
    } else {
      return {
        success: false,
        message: "No se pudieron guardar los datos. Intentá de nuevo.",
      };
    }
  } catch {
    return {
      success: false,
      message: "Error interno del servidor. Intentá de nuevo más tarde.",
    };
  }
}