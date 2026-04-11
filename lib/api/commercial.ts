import { ApiError, getApiUrl } from "./core";
import type { CommercialDashboardData } from "./types";

export async function getCommercialDashboard(token: string): Promise<CommercialDashboardData> {
    let res: Response;
    try {
        res = await fetch(getApiUrl("/comercial/dashboard"), {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch {
        throw new Error("Error de conexión");
    }

    if (res.status === 401) {
        throw new ApiError("Sesión expirada. Iniciá sesión nuevamente", "UNAUTHORIZED");
    }

    if (res.status === 403) {
        throw new Error("Tu usuario no tiene acceso al panel comercial");
    }

    if (res.status === 404) {
        const data = await res.json().catch(() => null) as { detail?: string } | null;
        throw new Error(data?.detail || "Tu cuenta comercial todavía no está vinculada");
    }

    if (!res.ok) {
        const data = await res.json().catch(() => null) as { detail?: string } | null;
        throw new Error(data?.detail || "No pudimos cargar el panel comercial");
    }

    return res.json() as Promise<CommercialDashboardData>;
}
