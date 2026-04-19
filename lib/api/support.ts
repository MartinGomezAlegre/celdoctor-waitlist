import type { SessionScope } from "../session";
import { ApiError, authHeaders, getApiUrl, getErrorDetail } from "./core";
import type { TicketUsuario } from "./types";

export async function obtenerMisTickets(
    token?: string | null,
    scope: SessionScope = "customer",
): Promise<TicketUsuario[]> {
    let res: Response;
    try {
        res = await fetch(getApiUrl("/soporte/mis-tickets"), {
            headers: authHeaders(token, scope),
        });
    } catch {
        return [];
    }
    if (res.status === 401) throw new ApiError("Sesión expirada. Iniciá sesión nuevamente", "UNAUTHORIZED");
    if (!res.ok) return [];
    return res.json() as Promise<TicketUsuario[]>;
}

export async function crearTicket(
    token: string | null | undefined,
    asunto: string,
    mensaje: string,
    scope: SessionScope = "customer",
): Promise<TicketUsuario> {
    let res: Response;
    try {
        res = await fetch(getApiUrl("/soporte/tickets"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeaders(token, scope),
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
