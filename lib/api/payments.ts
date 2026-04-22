import { ApiError, authHeaders, getApiUrl, getErrorDetail } from "./core";
import type { EstadoPagoSuscripcion, PagoIntento } from "./types";

export async function crearIntentoPago(
    suscripcionId: number,
    token?: string | null,
): Promise<PagoIntento> {
    let res: Response;
    try {
        res = await fetch(getApiUrl("/pagos/intentos"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeaders(token),
            },
            body: JSON.stringify({
                suscripcion_id: suscripcionId,
                proveedor: "mercadopago",
            }),
        });
    } catch {
        throw new Error("No se pudo preparar el pago");
    }

    if (res.status === 401) throw new ApiError("Sesion expirada. Inicia sesion nuevamente", "UNAUTHORIZED");
    if (!res.ok) throw new Error(await getErrorDetail(res, "No se pudo preparar el pago"));

    return res.json() as Promise<PagoIntento>;
}

export async function obtenerEstadoPagoSuscripcion(
    suscripcionId: number,
    token?: string | null,
): Promise<EstadoPagoSuscripcion> {
    let res: Response;
    try {
        res = await fetch(getApiUrl(`/suscripciones/${suscripcionId}/estado-pago`), {
            headers: authHeaders(token),
        });
    } catch {
        throw new Error("No se pudo consultar el estado del pago");
    }

    if (res.status === 401) throw new ApiError("Sesion expirada. Inicia sesion nuevamente", "UNAUTHORIZED");
    if (res.status === 404) throw new Error(await getErrorDetail(res, "No encontramos la suscripcion a consultar"));
    if (!res.ok) throw new Error(await getErrorDetail(res, "No se pudo consultar el estado del pago"));

    return res.json() as Promise<EstadoPagoSuscripcion>;
}
