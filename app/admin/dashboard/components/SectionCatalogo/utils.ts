import type { AdminPlan, Cupon } from "../../types"

export const INITIAL_CUPON_FORM = {
    codigo: "",
    descripcion: "",
    tipo_descuento: "porcentaje",
    valor: "",
    max_usos: "",
    valido_hasta: "",
    solo_nuevos: false,
}

export type CuponFormState = typeof INITIAL_CUPON_FORM

export async function getErrorMessage(res: Response, fallback: string) {
    try {
        const data = (await res.json()) as { detail?: string }
        if (typeof data.detail === "string" && data.detail.trim()) {
            return data.detail
        }
    } catch {
        // Si el backend no devuelve JSON valido, usamos el fallback.
    }

    return fallback
}

export function buildPlanPriceMap(planes: AdminPlan[]) {
    const precios: Record<number, string> = {}
    planes.forEach((plan) => {
        precios[plan.id] = String(plan.precio_mensual)
    })
    return precios
}

export function getCuponUsage(cupon: Cupon) {
    return cupon.usos_actuales ?? cupon.usos ?? 0
}
