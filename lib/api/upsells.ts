import { ApiError, getApiUrl, getErrorDetail } from "./core";
import type { UpsellSeguro } from "./types";

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

export async function registrarDecisionUpsellSeguro(token: string, acepta: boolean): Promise<UpsellSeguro> {
    let res: Response;
    try {
        res = await fetch(getApiUrl("/upsells/seguro"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ acepta }),
        });
    } catch {
        throw new Error("No se pudo registrar tu decision sobre el seguro medico");
    }

    if (res.status === 401) throw new ApiError("Sesion expirada. Inicia sesion nuevamente", "UNAUTHORIZED");
    if (!res.ok) throw new Error(await getErrorDetail(res, "No se pudo registrar tu decision sobre el seguro medico"));
    return res.json() as Promise<UpsellSeguro>;
}

export async function solicitarUpsellSeguro(token: string): Promise<UpsellSeguro> {
    return registrarDecisionUpsellSeguro(token, true);
}

export async function rechazarUpsellSeguro(token: string): Promise<UpsellSeguro> {
    return registrarDecisionUpsellSeguro(token, false);
}
