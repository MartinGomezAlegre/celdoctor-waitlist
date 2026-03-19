import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:8000'

async function handler(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params
    const endpoint = path.join('/')
    const qs = req.nextUrl.search

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    }
    const auth = req.headers.get('Authorization')
    if (auth) headers['Authorization'] = auth

    const fetchOptions: RequestInit = { method: req.method, headers }
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        fetchOptions.body = await req.text()
    }

    const upstream = await fetch(`${BACKEND}/${endpoint}${qs}`, fetchOptions)
    const body = await upstream.text()

    return new NextResponse(body, {
        status: upstream.status,
        headers: { 'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json' },
    })
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler
