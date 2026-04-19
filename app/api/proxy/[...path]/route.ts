import { NextRequest, NextResponse } from 'next/server'

import { SESSION_COOKIE_NAMES } from '@/lib/session'

if (!process.env.BACKEND_URL && process.env.NODE_ENV === 'production') {
    throw new Error(
        'BACKEND_URL no esta configurada. Agregala en Vercel: ' +
        'Settings -> Environment Variables -> BACKEND_URL'
    )
}

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:8000'

type Context = { params: Promise<{ path: string[] }> }

function resolveSessionCookieNameForRequest(req: NextRequest, path: string[]) {
    const scopeHeader = req.headers.get('x-session-scope')
    if (scopeHeader === 'admin') return SESSION_COOKIE_NAMES.admin
    if (scopeHeader === 'commercial') return SESSION_COOKIE_NAMES.commercial
    if (path[0] === 'admin') return SESSION_COOKIE_NAMES.admin
    if (path[0] === 'comercial') return SESSION_COOKIE_NAMES.commercial
    return SESSION_COOKIE_NAMES.customer
}

async function proxy(req: NextRequest, ctx: Context) {
    const { path } = await ctx.params
    const url = `${BACKEND}/${path.join('/')}${req.nextUrl.search}`

    const body =
        req.method === 'GET' || req.method === 'HEAD'
            ? undefined
            : await req.text()

    const headers = new Headers()
    const contentType = req.headers.get('Content-Type')
    const accept = req.headers.get('Accept')

    if (body !== undefined) {
        headers.set('Content-Type', contentType ?? 'application/json')
    }
    if (accept) headers.set('Accept', accept)

    const auth = req.headers.get('Authorization')
    const sessionToken = req.cookies.get(resolveSessionCookieNameForRequest(req, path))?.value
    if (auth) {
        headers.set('Authorization', auth)
    } else if (sessionToken) {
        headers.set('Authorization', `Bearer ${sessionToken}`)
    }

    const forwardedFor = req.headers.get('x-forwarded-for')
    const realIp = req.headers.get('x-real-ip')
    const forwardedProto = req.headers.get('x-forwarded-proto')
    const forwardedHost = req.headers.get('x-forwarded-host')

    if (forwardedFor) headers.set('X-Forwarded-For', forwardedFor)
    if (realIp) headers.set('X-Real-IP', realIp)
    if (forwardedProto) headers.set('X-Forwarded-Proto', forwardedProto)
    if (forwardedHost) headers.set('X-Forwarded-Host', forwardedHost)

    const res = await fetch(url, {
        method: req.method,
        headers,
        body,
        cache: 'no-store',
    }).catch(() => null)

    if (!res) {
        return NextResponse.json({ detail: 'Backend no disponible' }, { status: 503 })
    }

    const bytes = await res.arrayBuffer()
    const outHeaders = new Headers()
    for (const [key, value] of res.headers.entries()) {
        const normalizedKey = key.toLowerCase()
        if (
            normalizedKey === 'content-length' ||
            normalizedKey === 'transfer-encoding' ||
            normalizedKey === 'connection'
        ) {
            continue
        }
        outHeaders.set(key, value)
    }

    return new NextResponse(bytes, {
        status: res.status,
        headers: outHeaders,
    })
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE }
