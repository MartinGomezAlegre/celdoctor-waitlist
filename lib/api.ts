const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
 * GET /suscripciones/mia
 * Requiere token Bearer. Devuelve null si no hay suscripción (404) o si falla.
 */
export async function obtenerMiSuscripcion(
    token: string
): Promise<Suscripcion | null> {
    try {
        const res = await fetch(`${BASE_URL}/suscripciones/mia`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 404) return null;
        if (!res.ok) return null;
        return res.json() as Promise<Suscripcion>;
    } catch {
        return null;
    }
}
