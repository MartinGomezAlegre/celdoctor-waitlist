import { ApiError, getApiUrl } from "./core";
import type { Beneficiario } from "./types";

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

export async function agregarBeneficiario(
    token: string,
    datos: { nombre: string; apellido: string; dni: string; fecha_nacimiento: string; relacion: string },
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
