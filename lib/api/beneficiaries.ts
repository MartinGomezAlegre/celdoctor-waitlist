import { ApiError, authHeaders, getApiUrl } from "./core";
import type { Beneficiario } from "./types";

export async function obtenerBeneficiarios(token?: string | null): Promise<Beneficiario[]> {
    let res: Response;
    try {
        res = await fetch(getApiUrl("/beneficiarios"), {
            headers: authHeaders(token),
        });
    } catch {
        return [];
    }
    if (res.status === 401) throw new ApiError("Sesión expirada. Iniciá sesión nuevamente", "UNAUTHORIZED");
    if (!res.ok) return [];
    return res.json() as Promise<Beneficiario[]>;
}

export async function agregarBeneficiario(
    token: string | null | undefined,
    datos: { nombre: string; apellido: string; dni: string; fecha_nacimiento: string; relacion: string },
): Promise<Beneficiario> {
    let res: Response;
    try {
        res = await fetch(getApiUrl("/beneficiarios"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeaders(token),
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

export async function eliminarBeneficiario(token: string | null | undefined, id: number): Promise<void> {
    let res: Response;
    try {
        res = await fetch(getApiUrl(`/beneficiarios/${id}`), {
            method: "DELETE",
            headers: authHeaders(token),
        });
    } catch {
        throw new Error("Error de conexión al eliminar el beneficiario");
    }
    if (res.status === 401) throw new ApiError("Sesión expirada. Iniciá sesión nuevamente", "UNAUTHORIZED");
    if (!res.ok) throw new Error("No se pudo eliminar el beneficiario");
}
