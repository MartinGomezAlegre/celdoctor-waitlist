import { ApiError, getApiUrl, getErrorDetail } from "./core";
import type { CredencialVirtual, ValidacionBeneficio } from "./types";

export async function obtenerMiCredencial(token: string): Promise<CredencialVirtual | null> {
    let res: Response;
    try {
        res = await fetch(getApiUrl("/credenciales/mia"), {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
    } catch {
        throw new Error("Error al cargar la credencial digital");
    }

    if (res.status === 401) {
        throw new ApiError("Sesion expirada. Inicia sesion nuevamente", "UNAUTHORIZED");
    }
    if (res.status === 404) {
        return null;
    }
    if (!res.ok) {
        throw new Error(await getErrorDetail(res, "No se pudo cargar la credencial digital"));
    }

    return res.json() as Promise<CredencialVirtual>;
}

export async function validarBeneficioPublico(token: string): Promise<ValidacionBeneficio> {
    let res: Response;
    try {
        res = await fetch(getApiUrl(`/validaciones/beneficios/${encodeURIComponent(token)}`), {
            cache: "no-store",
        });
    } catch {
        throw new Error("No se pudo validar la credencial");
    }

    if (!res.ok) {
        throw new Error(await getErrorDetail(res, "No se pudo validar la credencial"));
    }

    return res.json() as Promise<ValidacionBeneficio>;
}
