import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:8000'

type Context = { params: Promise<{ path: string[] }> }

async function proxy(req: NextRequest, ctx: Context) {
    const { path } = await ctx.params
    const url = `${BACKEND}/${path.join('/')}${req.nextUrl.search}`

    const body = req.method === 'GET' || req.method === 'HEAD'
        ? undefined
        : await req.text()

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    }
    const auth = req.headers.get('Authorization')
    if (auth) headers['Authorization'] = auth

    const res = await fetch(url, {
        method: req.method,
        headers,
        body,
    }).catch(() => null)

    if (!res) {
        return NextResponse.json({ detail: 'Backend no disponible' }, { status: 503 })
    }

    const text = await res.text()
    return new NextResponse(text, {
        status: res.status,
        headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
    })
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE }
