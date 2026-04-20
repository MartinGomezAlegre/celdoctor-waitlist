import { useState, useEffect, useCallback } from "react"
import type { Empresa, PaginatedResponse } from "../../../types"
import { API, authHeaders } from "../../../lib"

export function useEmpresas(token: string, buscar: string, page: number, perPage: number) {
    const [empresas, setEmpresas] = useState<Empresa[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const fetchEmpresas = useCallback(() => {
        setLoading(true)
        setError(false)
        const params = new URLSearchParams({
            limit: String(perPage),
            offset: String((page - 1) * perPage),
        })
        if (buscar.trim()) params.set("buscar", buscar.trim())

        fetch(`${API}/admin/empresas?${params.toString()}`, { headers: authHeaders(token) })
            .then((r) => r.json())
            .then((d: unknown) => {
                const payload = d as PaginatedResponse<Empresa>
                if (payload && Array.isArray(payload.items)) {
                    setEmpresas(payload.items)
                    setTotal(payload.total ?? 0)
                    return
                }
                setEmpresas([])
                setTotal(0)
                setError(true)
            })
            .catch(() => {
                setEmpresas([])
                setTotal(0)
                setError(true)
            })
            .finally(() => setLoading(false))
    }, [buscar, page, perPage, token])

    useEffect(() => {
        let cancelled = false

        const params = new URLSearchParams({
            limit: String(perPage),
            offset: String((page - 1) * perPage),
        })
        if (buscar.trim()) params.set("buscar", buscar.trim())

        fetch(`${API}/admin/empresas?${params.toString()}`, { headers: authHeaders(token) })
            .then((r) => r.json())
            .then((d: unknown) => {
                if (cancelled) return
                const payload = d as PaginatedResponse<Empresa>
                if (payload && Array.isArray(payload.items)) {
                    setEmpresas(payload.items)
                    setTotal(payload.total ?? 0)
                    return
                }
                setEmpresas([])
                setTotal(0)
                setError(true)
            })
            .catch(() => {
                if (!cancelled) {
                    setEmpresas([])
                    setTotal(0)
                    setError(true)
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [buscar, page, perPage, token])

    return { empresas, total, loading, error, refetch: fetchEmpresas }
}
