import type { SessionScope } from "../session";
import { getApiUrl, getErrorDetail } from "./core";
import type { LoginResponse, Usuario } from "./types";

export interface InvitationPreview {
    email: string;
    role: string;
    full_name: string;
    expires_at?: string | null;
    accepted: boolean;
    expired: boolean;
}

export async function login(
    email: string,
    contrasenia: string,
    scope: SessionScope = "customer",
): Promise<LoginResponse> {
    let res: Response;
    try {
        res = await fetch("/api/session/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, contrasenia, scope }),
            credentials: "same-origin",
        });
    } catch {
        throw new Error("Error de conexion");
    }

    if (res.status === 401) throw new Error("Email o contrasena incorrectos");
    if (res.status === 400 || res.status === 403) {
        const data = await res.json().catch(() => null) as { detail?: string } | null;
        throw new Error(data?.detail || "No tenes permisos para ingresar");
    }
    if (!res.ok) throw new Error("Error de conexion");

    return res.json() as Promise<LoginResponse>;
}

export async function logout(): Promise<void> {
    try {
        await fetch("/api/session/logout", {
            method: "POST",
            credentials: "same-origin",
        });
    } catch {
        // Ignorado: el cliente limpia su estado local igual.
    }
}

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
        throw new Error("Error de conexion");
    }

    if (res.status === 400) {
        throw new Error(await getErrorDetail(res, "Este email ya esta registrado"));
    }
    if (res.status === 422) {
        throw new Error(await getErrorDetail(res, "Revisa los datos del formulario"));
    }
    if (!res.ok) throw new Error(await getErrorDetail(res, "Error de conexion"));

    return res.json() as Promise<Usuario>;
}

export async function getInvitation(token: string): Promise<InvitationPreview> {
    let res: Response;
    try {
        res = await fetch(getApiUrl(`/auth/invitaciones/${encodeURIComponent(token)}`), {
            cache: "no-store",
        });
    } catch {
        throw new Error("Error de conexion");
    }

    const data = await res.json().catch(() => null) as { detail?: string } | InvitationPreview | null;

    if (!res.ok) {
        const detail = data && "detail" in data && typeof data.detail === "string"
            ? data.detail
            : "No pudimos validar la invitacion";
        throw new Error(detail);
    }

    return data as InvitationPreview;
}

export async function activateInvitation(token: string, nuevaContrasenia: string): Promise<LoginResponse> {
    let res: Response;
    try {
        res = await fetch("/api/session/activate-invitation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, nueva_contrasenia: nuevaContrasenia }),
            credentials: "same-origin",
        });
    } catch {
        throw new Error("Error de conexion");
    }

    const data = await res.json().catch(() => null) as { detail?: string } | LoginResponse | null;

    if (!res.ok) {
        const detail = data && "detail" in data && typeof data.detail === "string"
            ? data.detail
            : "No pudimos activar la cuenta";
        throw new Error(detail);
    }

    return data as LoginResponse;
}
