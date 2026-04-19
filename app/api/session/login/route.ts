import { NextRequest, NextResponse } from "next/server";

import {
    SESSION_COOKIE_NAMES,
    type SessionScope,
    hasCommercialRole,
    isAdminRole,
    isCustomerRole,
    resolveSessionScopeForRole,
} from "@/lib/session";

if (!process.env.BACKEND_URL && process.env.NODE_ENV === "production") {
    throw new Error(
        "BACKEND_URL no esta configurada. Agregala en Vercel: " +
        "Settings -> Environment Variables -> BACKEND_URL",
    );
}

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8000";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

type LoginPayload = {
    email?: string;
    contrasenia?: string;
    scope?: SessionScope;
};

type BackendLoginResponse = {
    access_token: string;
    token_type: string;
    usuario: {
        id: number;
        nombre: string;
        email: string;
        rol?: string | null;
    };
};

function detailResponse(detail: string, status: number) {
    return NextResponse.json({ detail }, { status });
}

function isRoleAllowed(scope: SessionScope, role?: string | null) {
    if (scope === "admin") return isAdminRole(role);
    if (scope === "commercial") return hasCommercialRole(role);
    return isCustomerRole(role);
}

function roleError(scope: SessionScope) {
    if (scope === "admin") return "Sin permisos de administrador.";
    if (scope === "commercial") return "Este acceso es exclusivo para brokers y vendedores autorizados.";
    return "Este acceso es solo para clientes.";
}

export async function POST(request: NextRequest) {
    const payload = await request.json().catch(() => null) as LoginPayload | null;
    const email = payload?.email?.trim();
    const contrasenia = payload?.contrasenia;
    const scope = payload?.scope ?? "customer";

    if (!email || !contrasenia || !["customer", "admin", "commercial"].includes(scope)) {
        return detailResponse("Datos de acceso invalidos.", 400);
    }

    const backendResponse = await fetch(`${BACKEND}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ email, contrasenia }),
        cache: "no-store",
    }).catch(() => null);

    if (!backendResponse) {
        return detailResponse("Backend no disponible", 503);
    }

    const data = await backendResponse.json().catch(() => null) as BackendLoginResponse | { detail?: string } | null;

    if (!backendResponse.ok) {
        const errorData = data as { detail?: string } | null;
        const detail = typeof errorData?.detail === "string" && errorData.detail.trim()
            ? errorData.detail
            : "No pudimos iniciar sesion";
        return detailResponse(detail, backendResponse.status);
    }

    const loginData = data as BackendLoginResponse;

    if (!isRoleAllowed(scope, loginData.usuario.rol)) {
        return detailResponse(roleError(scope), 403);
    }

    const response = NextResponse.json({
        usuario: loginData.usuario,
    });

    for (const cookieName of Object.values(SESSION_COOKIE_NAMES)) {
        response.cookies.delete(cookieName);
    }

    const cookieScope = resolveSessionScopeForRole(loginData.usuario.rol);

    response.cookies.set(SESSION_COOKIE_NAMES[cookieScope], loginData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: COOKIE_MAX_AGE,
    });

    return response;
}
