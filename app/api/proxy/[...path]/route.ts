import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:8000'

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    return proxyRequest(req, context)
}

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    return proxyRequest(req, context)
}

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    return proxyRequest(req, context)
}

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    return proxyRequest(req, context)
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    return proxyRequest(req, context)
}

async function proxyRequest(
    req: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const { path } = await context.params
    const endpoint = path.join('/')
    const qs = req.nextUrl.search

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    }

    const auth = req.headers.get('Authorization')
    if (auth) headers['Authorization'] = auth

    const fetchOptions: RequestInit = {
        method: req.method,
        headers,
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
        fetchOptions.body = await req.text()
    }

    const backendUrl = `${BACKEND.replace(/\/$/, '')}/${endpoint}${qs}`
    console.log('Proxy URL:', backendUrl)

    try {
        const upstream = await fetch(backendUrl, fetchOptions)
        const body = await upstream.text()

        return new NextResponse(body, {
            status: upstream.status,
            headers: {
                'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
            },
        })
    } catch {
        return NextResponse.json(
            { detail: 'Error de conexión con el servidor' },
            { status: 503 }
        )
    }
}
