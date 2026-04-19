import type { SessionScope } from "../session";

const BASE_URL = "/api/proxy";

export function getApiUrl(path: string): string {
    return `${BASE_URL}${path}`;
}

export function authHeaders(token?: string | null, scope?: SessionScope): Record<string, string> {
    const headers: Record<string, string> = {};

    if (token) headers.Authorization = `Bearer ${token}`;
    if (scope) headers["X-Session-Scope"] = scope;

    return headers;
}

export async function getErrorDetail(res: Response, fallback: string): Promise<string> {
    try {
        const data = await res.json() as { detail?: unknown };

        if (typeof data.detail === "string" && data.detail.trim()) {
            return data.detail;
        }
    } catch {
        // Ignorado: usamos el fallback
    }

    return fallback;
}

export class ApiError extends Error {
    constructor(
        message: string,
        public readonly code: string,
    ) {
        super(message);
        this.name = "ApiError";
    }
}
