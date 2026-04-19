import { NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE_NAMES, resolveSessionScopeForRole } from "@/lib/session";

if (!process.env.BACKEND_URL && process.env.NODE_ENV === "production") {
    throw new Error(
        "BACKEND_URL no esta configurada. Agregala en Vercel: " +
        "Settings -> Environment Variables -> BACKEND_URL",
    );
}

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8000";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

type ActivationPayload = {
    token?: string;
    nueva_contrasenia?: string;
};

type ActivationResponse = {
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

export async function POST(request: NextRequest) {
    const payload = await request.json().catch(() => null) as ActivationPayload | null;
    const token = payload?.token?.trim();
    const nuevaContrasenia = payload?.nueva_contrasenia;

    if (!token || !nuevaContrasenia) {
        return detailResponse("Datos de activacion invalidos.", 400);
    }

    const backendResponse = await fetch(`${BACKEND}/auth/invitaciones/activar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ token, nueva_contrasenia: nuevaContrasenia }),
        cache: "no-store",
    }).catch(() => null);

    if (!backendResponse) {
        return detailResponse("Backend no disponible", 503);
    }

    const data = await backendResponse.json().catch(() => null) as ActivationResponse | { detail?: string } | null;

    if (!backendResponse.ok) {
        const errorData = data as { detail?: string } | null;
        const detail = typeof errorData?.detail === "string" && errorData.detail.trim()
            ? errorData.detail
            : "No pudimos activar la cuenta";
        return detailResponse(detail, backendResponse.status);
    }

    const activationData = data as ActivationResponse;
    const cookieScope = resolveSessionScopeForRole(activationData.usuario.rol);
    const response = NextResponse.json({ usuario: activationData.usuario });

    for (const cookieName of Object.values(SESSION_COOKIE_NAMES)) {
        response.cookies.delete(cookieName);
    }

    response.cookies.set(SESSION_COOKIE_NAMES[cookieScope], activationData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: COOKIE_MAX_AGE,
    });

    return response;
}
