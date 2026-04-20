import { NextRequest, NextResponse } from "next/server";

import {
    SESSION_COOKIE_NAMES,
    type SessionScope,
    hasCommercialRole,
    isAdminRole,
    isCustomerRole,
} from "@/lib/session";

if (!process.env.BACKEND_URL && process.env.NODE_ENV === "production") {
    throw new Error(
        "BACKEND_URL no esta configurada. Agregala en Vercel: " +
        "Settings -> Environment Variables -> BACKEND_URL",
    );
}

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8000";

type BackendProfile = {
    id: number;
    nombre: string;
    apellido?: string | null;
    email: string;
    rol?: string | null;
};

function detailResponse(detail: string, status: number) {
    return NextResponse.json({ detail }, { status });
}

function isScopeAllowed(scope: SessionScope, role?: string | null) {
    if (scope === "admin") return isAdminRole(role);
    if (scope === "commercial") return hasCommercialRole(role);
    return isCustomerRole(role);
}

function roleError(scope: SessionScope) {
    if (scope === "admin") return "Sin permisos de administrador.";
    if (scope === "commercial") return "Este acceso es exclusivo para brokers y vendedores autorizados.";
    return "Este acceso es solo para clientes.";
}

export async function GET(request: NextRequest) {
    const scopeParam = request.nextUrl.searchParams.get("scope");
    const scope: SessionScope =
        scopeParam === "admin" || scopeParam === "commercial" || scopeParam === "customer"
            ? scopeParam
            : "customer";

    const token = request.cookies.get(SESSION_COOKIE_NAMES[scope])?.value;
    if (!token) {
        return detailResponse("Sesion no encontrada", 401);
    }

    const backendResponse = await fetch(`${BACKEND}/usuarios/me`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    }).catch(() => null);

    if (!backendResponse) {
        return detailResponse("Backend no disponible", 503);
    }

    const data = await backendResponse.json().catch(() => null) as BackendProfile | { detail?: string } | null;

    if (!backendResponse.ok) {
        const detail =
            data && "detail" in data && typeof data.detail === "string" && data.detail.trim()
                ? data.detail
                : "No pudimos validar la sesion";
        return detailResponse(detail, backendResponse.status);
    }

    const profile = data as BackendProfile;
    if (!isScopeAllowed(scope, profile.rol)) {
        return detailResponse(roleError(scope), 403);
    }

    return NextResponse.json({
        usuario: {
            id: profile.id,
            nombre: profile.nombre,
            apellido: profile.apellido ?? null,
            email: profile.email,
            rol: profile.rol ?? null,
        },
    });
}
