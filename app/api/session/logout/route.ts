import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAMES } from "@/lib/session";

export async function POST() {
    const response = NextResponse.json({ ok: true });

    for (const cookieName of Object.values(SESSION_COOKIE_NAMES)) {
        response.cookies.delete(cookieName);
    }

    return response;
}
