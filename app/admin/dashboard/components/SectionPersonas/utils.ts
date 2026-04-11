import type { AdminUsuario, AdminUsuarioDetalle } from "../../types"

export type Filtro = "todos" | "activos" | "inactivos" | "con_plan" | "sin_plan"

export const PERSONAS_FILTERS: Array<{ value: Filtro; label: string }> = [
    { value: "todos", label: "Todos" },
    { value: "activos", label: "Solo activos" },
    { value: "inactivos", label: "Solo inactivos" },
    { value: "con_plan", label: "Con plan" },
    { value: "sin_plan", label: "Sin plan" },
]

export function situacionUsuario(usuario: AdminUsuario | AdminUsuarioDetalle) {
    return usuario.estado_suscripcion ?? "sin_plan"
}

export function matchUsuario(usuario: AdminUsuario, buscar: string, filtro: Filtro) {
    const query = buscar.trim().toLowerCase()
    const matchBuscar =
        !query ||
        usuario.nombre.toLowerCase().includes(query) ||
        usuario.apellido.toLowerCase().includes(query) ||
        usuario.email.toLowerCase().includes(query)

    let matchFiltro = true
    if (filtro === "activos") matchFiltro = usuario.activo
    else if (filtro === "inactivos") matchFiltro = !usuario.activo
    else if (filtro === "con_plan") matchFiltro = Boolean(usuario.estado_suscripcion)
    else if (filtro === "sin_plan") matchFiltro = !usuario.estado_suscripcion

    return matchBuscar && matchFiltro
}

export function formatFullName(usuario?: Pick<AdminUsuario, "nombre" | "apellido"> | null) {
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : "-"
}

export function safeText(value?: string | null) {
    return value && value.trim() ? value : "-"
}

export function shouldShowBeneficiarios(detalle?: AdminUsuarioDetalle | null) {
    return Boolean(detalle && (detalle.max_beneficiarios ?? 0) > 1)
}
