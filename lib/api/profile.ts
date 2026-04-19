import { ApiError, authHeaders, getApiUrl } from "./core";
import type { MiPerfil } from "./types";

export async function getMiPerfil(token?: string | null): Promise<MiPerfil | null> {
    let res: Response;
    try {
        res = await fetch(getApiUrl("/usuarios/mi-perfil"), {
            headers: authHeaders(token),
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

export async function editarPerfil(token: string | null | undefined, datos: Partial<MiPerfil>): Promise<MiPerfil> {
    let res: Response;
    try {
        res = await fetch(getApiUrl("/usuarios/me"), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...authHeaders(token),
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
