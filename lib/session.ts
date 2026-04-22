export type SessionScope = "customer" | "admin" | "commercial";

export const SESSION_COOKIE_NAMES: Record<SessionScope, string> = {
    customer: "celdoctor_token",
    admin: "celdoctor_admin_token",
    commercial: "celdoctor_commercial_token",
};

export const COMMERCIAL_ROLES = new Set(["broker", "direct_seller", "broker_seller"]);

export function hasCommercialRole(role?: string | null): boolean {
    return !!role && COMMERCIAL_ROLES.has(role);
}

export function isAdminRole(role?: string | null): boolean {
    return role === "admin" || role === "gestor_interno";
}

export function isCustomerRole(role?: string | null): boolean {
    return !!role && !isAdminRole(role) && !hasCommercialRole(role);
}

export function resolveSessionScopeForRole(role?: string | null): SessionScope {
    if (isAdminRole(role)) return "admin";
    if (hasCommercialRole(role)) return "commercial";
    return "customer";
}

export async function logoutSession(): Promise<void> {
    try {
        await fetch("/api/session/logout", {
            method: "POST",
            credentials: "same-origin",
        });
    } catch {
        // Silencioso: igual limpiamos estado local y redirigimos.
    }
}
