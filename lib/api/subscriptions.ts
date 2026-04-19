import { ApiError, authHeaders, getApiUrl, getErrorDetail } from "./core";
import type { CancelacionSuscripcionResponse, Suscripcion } from "./types";
import { clearStoredReferralCode, getStoredReferralCode } from "../referral";

export async function contratarPlan(plan_id: number, token?: string | null): Promise<Suscripcion> {
    const referralCode = getStoredReferralCode();
    const payload: {
        plan_id: number;
        beneficiarios: [];
        referral_code?: string;
    } = {
        plan_id,
        beneficiarios: [],
    };

    if (referralCode) {
        payload.referral_code = referralCode;
    }

    let res: Response;
    try {
        res = await fetch(getApiUrl("/suscripciones"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeaders(token),
            },
            body: JSON.stringify(payload),
        });
    } catch {
        throw new Error("Error al contratar el plan");
    }

    if (res.status === 400) throw new Error(await getErrorDetail(res, "No se pudo contratar el plan"));
    if (res.status === 401) throw new Error("Sesión expirada. Iniciá sesión nuevamente");
    if (!res.ok) throw new Error("Error al contratar el plan");

    const data = await res.json() as Suscripcion;
    clearStoredReferralCode();
    return data;
}

export async function cancelarMiSuscripcion(token?: string | null): Promise<CancelacionSuscripcionResponse> {
    let res: Response;
    try {
        res = await fetch(getApiUrl("/suscripciones/mia/cancelar"), {
            method: "PUT",
            headers: authHeaders(token),
        });
    } catch {
        throw new Error("Error al solicitar la baja del plan");
    }

    if (res.status === 401) throw new ApiError("Sesion expirada. Inicia sesion nuevamente", "UNAUTHORIZED");
    if (res.status === 404) throw new Error(await getErrorDetail(res, "No encontramos una suscripcion para dar de baja"));
    if (!res.ok) throw new Error(await getErrorDetail(res, "No se pudo dar de baja el plan"));

    return res.json() as Promise<CancelacionSuscripcionResponse>;
}

export async function obtenerMiSuscripcion(token?: string | null): Promise<Suscripcion | null> {
    let res: Response;
    try {
        res = await fetch(getApiUrl("/suscripciones/mia"), {
            headers: authHeaders(token),
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
