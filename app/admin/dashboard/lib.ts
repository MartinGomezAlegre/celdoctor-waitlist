export const API = "/api/proxy"

export function authHeaders(token?: string | null): Record<string, string> {
    if (!token) return {}
    return { Authorization: `Bearer ${token}` }
}

export function fmtCurrency(n: number): string {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n)
}

export function fmtDate(iso: string): string {
    return new Date(iso).toLocaleDateString("es-AR")
}

export function tiempoRelativo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `hace ${mins} min`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `hace ${hrs}h`
    return new Date(iso).toLocaleDateString("es-AR")
}

export function diasParaVencer(fecha: string): number {
    return Math.ceil((new Date(fecha).getTime() - Date.now()) / 86400000)
}

export async function getApiErrorDetail(res: Response, fallback: string): Promise<string> {
    try {
        const data = await res.json() as { detail?: unknown }
        if (typeof data.detail === "string" && data.detail.trim()) {
            return data.detail
        }
    } catch {
        // Ignorado: usamos el fallback
    }

    return fallback
}

export const ESTADO_BADGE: Record<string, string> = {
    activa: "bg-emerald-100 text-emerald-800",
    cancelacion_programada: "bg-blue-100 text-blue-800",
    pendiente_pago: "bg-yellow-100 text-amber-700",
    cancelada: "bg-red-100 text-red-800",
    aprobado: "bg-emerald-100 text-emerald-800",
    rechazado: "bg-red-100 text-red-800",
    pendiente: "bg-yellow-100 text-amber-700",
    activo: "bg-emerald-100 text-emerald-800",
    inactivo: "bg-slate-100 text-slate-600",
    sin_plan: "bg-slate-100 text-slate-600",
    abierto: "bg-amber-100 text-amber-800",
    respondido: "bg-blue-100 text-blue-800",
    cerrado: "bg-slate-100 text-slate-600",
    nuevo: "bg-amber-100 text-amber-800",
}
