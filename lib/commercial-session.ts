import { clearSessionCookie, setSessionCookie } from "@/lib/session-cookie";

export const COMMERCIAL_ROLES = new Set(["broker", "direct_seller", "broker_seller"]);
export const COMMERCIAL_TOKEN_KEY = "celdoctor_commercial_token";
export const COMMERCIAL_NAME_KEY = "celdoctor_commercial_nombre";
export const COMMERCIAL_EMAIL_KEY = "celdoctor_commercial_email";
export const COMMERCIAL_ROLE_KEY = "celdoctor_commercial_rol";

export function hasCommercialRole(role?: string | null): boolean {
    return !!role && COMMERCIAL_ROLES.has(role);
}

export function setCommercialSession(accessToken: string, usuario: {
    nombre: string;
    email: string;
    rol?: string | null;
}) {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(COMMERCIAL_NAME_KEY, usuario.nombre);
    window.localStorage.setItem(COMMERCIAL_EMAIL_KEY, usuario.email);
    window.localStorage.setItem(COMMERCIAL_ROLE_KEY, usuario.rol ?? "broker_seller");
    window.localStorage.setItem(COMMERCIAL_TOKEN_KEY, accessToken);
    setSessionCookie(COMMERCIAL_TOKEN_KEY, accessToken);
}

export function clearCommercialSession() {
    if (typeof window === "undefined") return;

    window.localStorage.removeItem(COMMERCIAL_TOKEN_KEY);
    window.localStorage.removeItem(COMMERCIAL_NAME_KEY);
    window.localStorage.removeItem(COMMERCIAL_EMAIL_KEY);
    window.localStorage.removeItem(COMMERCIAL_ROLE_KEY);
    clearSessionCookie(COMMERCIAL_TOKEN_KEY);
}
