import { useState, useEffect, useCallback } from "react"
import type { Empresa } from "../../../types"
import { API, authHeaders } from "../../../lib"

export function useEmpresas(token: string) {
    const [empresas, setEmpresas] = useState<Empresa[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const fetchEmpresas = useCallback(() => {
        setLoading(true)
        setError(false)
        fetch(`${API}/admin/empresas`, { headers: authHeaders(token) })
            .then((r) => r.json())
            .then((d: unknown) => setEmpresas(Array.isArray(d) ? (d as Empresa[]) : []))
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [token])

    useEffect(() => {
        let cancelled = false

        fetch(`${API}/admin/empresas`, { headers: authHeaders(token) })
            .then((r) => r.json())
            .then((d: unknown) => {
                if (!cancelled) setEmpresas(Array.isArray(d) ? (d as Empresa[]) : [])
            })
            .catch(() => {
                if (!cancelled) setError(true)
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [token])

    return { empresas, loading, error, refetch: fetchEmpresas }
}
