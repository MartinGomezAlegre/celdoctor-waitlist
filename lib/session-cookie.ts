function getCookieSuffix() {
    if (typeof window === "undefined") return "Path=/; SameSite=Lax";
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    return `Path=/; SameSite=Lax${secure}`;
}

export function setSessionCookie(name: string, value: string, maxAgeSeconds = 60 * 60 * 24 * 7) {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; ${getCookieSuffix()}`;
}

export function clearSessionCookie(name: string) {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; Max-Age=0; ${getCookieSuffix()}`;
}
