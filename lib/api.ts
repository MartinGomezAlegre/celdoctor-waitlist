const BASE_URL = '/api/proxy'

export function getApiUrl(path: string): string {
    return `${BASE_URL}${path}`;
}

async function getErrorDetail(res: Response, fallback: string): Promise<string> {
    try {
        const data = await res.json() as { detail?: unknown };

        if (typeof data.detail === "string" && data.detail.trim()) {
            return data.detail;
        }
    } catch {
        // Ignorado: usamos el fallback
    }

    return fallback;
}

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
    rol?: string;
}

export interface Suscripcion {
    id: number;
    plan_id: number;
    estado: string;
    fecha_inicio: string;
    fecha_vencimiento?: string;
    precio_pagado: number;
    nombre_plan?: string;
    descripcion_plan?: string;
    fue_exportado?: boolean;
    max_beneficiarios?: number | null;
    tipo_plan?: string | null;
}

export interface MiPerfil {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    dni?: string;
    cuit?: string;
    direccion?: string;
    localidad?: string;
    codigo_postal?: string;
    provincia?: string;
    pais?: string;
    fecha_nacimiento?: string;
    rol?: string;
    perfil_completo_facturacion?: boolean;
}

export interface CancelacionSuscripcionResponse {
    ok: boolean;
    mensaje: string;
    fecha_vencimiento?: string | null;
}

export interface UpsellSeguro {
    id: number;
    usuario_id: number;
    suscripcion_id: number;
    plan_nombre: string;
    precio_ofertado: number;
    estado: string;
    nota_admin?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
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
        const res = await fetch(getApiUrl("/planes"));
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
        res = await fetch(getApiUrl("/auth/login"), {
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
    dni: string;
    fecha_nacimiento: string;
    contrasenia: string;
}): Promise<Usuario> {
    let res: Response;
    try {
        res = await fetch(getApiUrl("/usuarios"), {
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
        res = await fetch(getApiUrl("/suscripciones"), {
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

    if (res.status === 400) throw new Error(await getErrorDetail(res, "No se pudo contratar el plan"));
    if (res.status === 401) throw new Error("Sesión expirada. Iniciá sesión nuevamente");
    if (!res.ok) throw new Error("Error al contratar el plan");

    return res.json() as Promise<Suscripcion>;
}

export async function cancelarMiSuscripcion(token: string): Promise<CancelacionSuscripcionResponse> {
    let res: Response;
    try {
        res = await fetch(getApiUrl("/suscripciones/mia/cancelar"), {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch {
        throw new Error("Error al solicitar la baja del plan");
    }

    if (res.status === 401) throw new ApiError("Sesion expirada. Inicia sesion nuevamente", "UNAUTHORIZED");
    if (res.status === 404) throw new Error(await getErrorDetail(res, "No encontramos una suscripcion para dar de baja"));
    if (!res.ok) throw new Error(await getErrorDetail(res, "No se pudo dar de baja el plan"));

    return res.json() as Promise<CancelacionSuscripcionResponse>;
}

/**
 * GET /usuarios/me
 * Requiere token Bearer.
 * - 401 → lanza ApiError con code "UNAUTHORIZED"
 * - otros errores → devuelve null
 */
export async function getMiPerfil(token: string): Promise<MiPerfil | null> {
    let res: Response;
    try {
        res = await fetch(getApiUrl("/usuarios/mi-perfil"), {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch {
        return null;
    }

    if (res.status === 401) {
        throw new ApiError("Sesión expirada. Iniciá sesión nuevamente", "UNAUTHORIZED");
    }
    if (!res.ok) return null;

    return res.json() as Promise<MiPerfil>;
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
        res = await fetch(getApiUrl("/suscripciones/mia"), {
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

// ─── Nuevos tipos ──────────────────────────────────────────────────────────────

export interface TicketUsuario {
    id: number;
    asunto: string;
    estado: "abierto" | "respondido" | "cerrado";
    prioridad: string;
    respuesta: string | null;
    created_at: string;
    respondido_en: string | null;
}

export interface Beneficiario {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    fecha_nacimiento: string;
    relacion: string;
}

// ─── Planes filtrados para usuarios (sin corporativo) ─────────────────────────

/**
 * GET /planes?tipo=personal — solo planes personal y familiar
 */
export async function obtenerPlanesUsuario(): Promise<Plan[]> {
    try {
        const res = await fetch(getApiUrl("/planes?tipo=personal"));
        if (!res.ok) return [];
        return res.json() as Promise<Plan[]>;
    } catch {
        return [];
    }
}

// ─── Tickets del usuario ──────────────────────────────────────────────────────

/**
 * GET /soporte/mis-tickets
 * Requiere token Bearer.
 */
export async function obtenerMisTickets(token: string): Promise<TicketUsuario[]> {
    let res: Response;
    try {
        res = await fetch(getApiUrl("/soporte/mis-tickets"), {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch {
        return [];
    }
    if (res.status === 401) throw new ApiError("Sesión expirada. Iniciá sesión nuevamente", "UNAUTHORIZED");
    if (!res.ok) return [];
    return res.json() as Promise<TicketUsuario[]>;
}

/**
 * POST /soporte/tickets
 * Requiere token Bearer.
 */
export async function crearTicket(token: string, asunto: string, mensaje: string): Promise<TicketUsuario> {
    let res: Response;
    try {
        res = await fetch(getApiUrl("/soporte/tickets"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ asunto, mensaje }),
        });
    } catch {
        throw new Error("Error de conexión al crear el ticket");
    }
    if (res.status === 401) throw new ApiError("Sesión expirada. Iniciá sesión nuevamente", "UNAUTHORIZED");
    if (!res.ok) throw new Error(await getErrorDetail(res, "No se pudo crear el ticket"));
    return res.json() as Promise<TicketUsuario>;
}

// ─── Beneficiarios ────────────────────────────────────────────────────────────

/**
 * GET /beneficiarios
 * Requiere token Bearer.
 */
export async function obtenerBeneficiarios(token: string): Promise<Beneficiario[]> {
    let res: Response;
    try {
        res = await fetch(getApiUrl("/beneficiarios"), {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch {
        return [];
    }
    if (res.status === 401) throw new ApiError("Sesión expirada. Iniciá sesión nuevamente", "UNAUTHORIZED");
    if (!res.ok) return [];
    return res.json() as Promise<Beneficiario[]>;
}

/**
 * POST /beneficiarios
 * Requiere token Bearer.
 */
export async function agregarBeneficiario(
    token: string,
    datos: { nombre: string; apellido: string; dni: string; fecha_nacimiento: string; relacion: string }
): Promise<Beneficiario> {
    let res: Response;
    try {
        res = await fetch(getApiUrl("/beneficiarios"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(datos),
        });
    } catch {
        throw new Error("Error de conexión al agregar el beneficiario");
    }
    if (res.status === 401) throw new ApiError("Sesión expirada. Iniciá sesión nuevamente", "UNAUTHORIZED");
    if (res.status === 400) throw new Error("Datos inválidos. Verificá los campos ingresados");
    if (!res.ok) throw new Error("No se pudo agregar el beneficiario");
    return res.json() as Promise<Beneficiario>;
}

/**
 * DELETE /beneficiarios/{id}
 * Requiere token Bearer.
 */
export async function eliminarBeneficiario(token: string, id: number): Promise<void> {
    let res: Response;
    try {
        res = await fetch(getApiUrl(`/beneficiarios/${id}`), {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch {
        throw new Error("Error de conexión al eliminar el beneficiario");
    }
    if (res.status === 401) throw new ApiError("Sesión expirada. Iniciá sesión nuevamente", "UNAUTHORIZED");
    if (!res.ok) throw new Error("No se pudo eliminar el beneficiario");
}

// ─── Editar perfil ────────────────────────────────────────────────────────────

/**
 * PUT /usuarios/me
 * Requiere token Bearer.
 */
export async function editarPerfil(token: string, datos: Partial<MiPerfil>): Promise<MiPerfil> {
    let res: Response;
    try {
        res = await fetch(getApiUrl("/usuarios/me"), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(datos),
        });
    } catch {
        throw new Error("Error de conexión al guardar los cambios");
    }
    if (res.status === 401) throw new ApiError("Sesión expirada. Iniciá sesión nuevamente", "UNAUTHORIZED");
    if (res.status === 400) throw new Error("Datos inválidos. Verificá los campos ingresados");
    if (!res.ok) throw new Error("No se pudo actualizar el perfil");
    return res.json() as Promise<MiPerfil>;
}

export async function obtenerMiUpsellSeguro(token: string): Promise<UpsellSeguro | null> {
    let res: Response;
    try {
        res = await fetch(getApiUrl("/upsells/seguro/mio"), {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch {
        return null;
    }

    if (res.status === 401) throw new ApiError("Sesion expirada. Inicia sesion nuevamente", "UNAUTHORIZED");
    if (!res.ok) return null;
    return res.json() as Promise<UpsellSeguro | null>;
}

export async function solicitarUpsellSeguro(token: string): Promise<UpsellSeguro> {
    let res: Response;
    try {
        res = await fetch(getApiUrl("/upsells/seguro"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ acepta: true }),
        });
    } catch {
        throw new Error("No se pudo registrar tu interes en el seguro medico");
    }

    if (res.status === 401) throw new ApiError("Sesion expirada. Inicia sesion nuevamente", "UNAUTHORIZED");
    if (!res.ok) throw new Error(await getErrorDetail(res, "No se pudo registrar tu interes en el seguro medico"));
    return res.json() as Promise<UpsellSeguro>;
}
