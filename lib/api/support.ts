import { ApiError, getApiUrl, getErrorDetail } from "./core";
import type { TicketUsuario } from "./types";

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
