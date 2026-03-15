const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Error tipado para que los componentes puedan distinguir causas
export class ApiError extends Error {
    constructor(
        message: string,
        public readonly code: string
    ) {
        super(message);
        this.name = "ApiError";
    }
}

// ─── Interfaces ────────────────────────────────────────────────────────────────

export interface Plan {
    id: number;
    nombre: string;
    descripcion: string;
    precio_mensual: number;
    max_beneficiarios: number | null;
}

export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
}

export interface Suscripcion {
    id: number;
    plan_id: number;
    estado: string;
    fecha_inicio: string;
    precio_pagado: number;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    usuario: Usuario;
}

// ─── Funciones ─────────────────────────────────────────────────────────────────

/**
 * GET /planes — sin autenticación.
 * Si falla, devuelve [] para no romper la UI.
 */
export async function obtenerPlanes(): Promise<Plan[]> {
    try {
        const res = await fetch(`${BASE_URL}/planes`);
        if (!res.ok) return [];
        return res.json() as Promise<Plan[]>;
    } catch {
        return [];
    }
}

/**
 * POST /auth/login
 * Lanza error descriptivo en 401 o en fallo de red.
 */
export async function login(
    email: string,
    contrasenia: string
): Promise<LoginResponse> {
    let res: Response;
    try {
        res = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, contrasenia }),
        });
    } catch {
        throw new Error("Error de conexión");
    }

    if (res.status === 401) throw new Error("Email o contraseña incorrectos");
    if (!res.ok) throw new Error("Error de conexión");

    return res.json() as Promise<LoginResponse>;
}

/**
 * POST /usuarios
 * Lanza error descriptivo en 400 (email duplicado) o en fallo de red.
 */
export async function registrarUsuario(datos: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    fecha_nacimiento: string;
    contrasenia: string;
}): Promise<Usuario> {
    let res: Response;
    try {
        res = await fetch(`${BASE_URL}/usuarios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });
    } catch {
        throw new Error("Error de conexión");
    }

    if (res.status === 400) throw new Error("Este email ya está registrado");
    if (!res.ok) throw new Error("Error de conexión");

    return res.json() as Promise<Usuario>;
}

/**
 * POST /suscripciones
 * Requiere token Bearer. Lanza error descriptivo en 400, 401 o fallo de red.
 */
export async function contratarPlan(
    plan_id: number,
    token: string
): Promise<Suscripcion> {
    let res: Response;
    try {
        res = await fetch(`${BASE_URL}/suscripciones`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ plan_id, beneficiarios: [] }),
        });
    } catch {
        throw new Error("Error al contratar el plan");
    }

    if (res.status === 400) throw new Error("Ya tenés una suscripción activa");
    if (res.status === 401) throw new Error("Sesión expirada. Iniciá sesión nuevamente");
    if (!res.ok) throw new Error("Error al contratar el plan");

    return res.json() as Promise<Suscripcion>;
}

/**
 * GET /suscripciones/mia
 * Requiere token Bearer.
 * - 401 → lanza ApiError con code "UNAUTHORIZED" (token expirado/inválido)
 * - 404 → devuelve null (sin suscripción activa)
 * - otros errores → devuelve null (no rompe la UI)
 */
export async function obtenerMiSuscripcion(
    token: string
): Promise<Suscripcion | null> {
    let res: Response;
    try {
        res = await fetch(`${BASE_URL}/suscripciones/mia`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch {
        return null;
    }

    if (res.status === 401) {
        throw new ApiError("Sesión expirada. Iniciá sesión nuevamente", "UNAUTHORIZED");
    }
    if (res.status === 404) return null;
    if (!res.ok) return null;

    return res.json() as Promise<Suscripcion>;
}
