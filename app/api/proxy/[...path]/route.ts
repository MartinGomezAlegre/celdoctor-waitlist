import { NextRequest, NextResponse } from 'next/server'

if (!process.env.BACKEND_URL && process.env.NODE_ENV === 'production') {
    throw new Error(
        'BACKEND_URL no está configurada. Agregála en Vercel: ' +
        'Settings → Environment Variables → BACKEND_URL'
    )
}

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:8000'

type Context = { params: Promise<{ path: string[] }> }

async function proxy(req: NextRequest, ctx: Context) {
    const { path } = await ctx.params
    const url = `${BACKEND}/${path.join('/')}${req.nextUrl.search}`

    const body = req.method === 'GET' || req.method === 'HEAD'
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
    if (auth) headers.set('Authorization', auth)

    const res = await fetch(url, {
        method: req.method,
        headers,
        body,
        cache: 'no-store',
    }).catch(() => null)

    if (!res) {
        return NextResponse.json({ detail: 'Backend no disponible' }, { status: 503 })
    }

    // Preservar el body binario sin convertir a texto
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
