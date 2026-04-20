const COMMERCIAL_ROLES = new Set(["broker", "direct_seller", "broker_seller"])

export function isCommercialRole(rol?: string | null): boolean {
    return !!rol && COMMERCIAL_ROLES.has(rol)
}

export function resolveAccountRoute(rol?: string | null): string {
    if (rol === "admin") return "/admin/dashboard"
    if (rol === "empresa_admin") return "/empresa/dashboard"
    if (isCommercialRole(rol)) return "/comercial/dashboard"
    return "/dashboard"
}
