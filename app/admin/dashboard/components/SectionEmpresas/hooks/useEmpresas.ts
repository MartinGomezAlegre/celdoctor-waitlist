import { useState, useEffect, useCallback } from "react"
import type { Empresa, PaginatedResponse } from "../../../types"
import { API, authHeaders } from "../../../lib"

export function useEmpresas(token: string, buscar: string, page: number, perPage: number) {
    const [empresas, setEmpresas] = useState<Empresa[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const cargar = useCallback(
        async (shouldIgnore: () => boolean) => {
            const params = new URLSearchParams({
                limit: String(perPage),
                offset: String((page - 1) * perPage),
            })
            if (buscar.trim()) params.set("buscar", buscar.trim())

            try {
                const response = await fetch(`${API}/admin/empresas?${params.toString()}`, {
                    headers: authHeaders(token),
                })
                const data = await response.json().catch(() => null) as
                    | PaginatedResponse<Empresa>
                    | { detail?: string }
                    | null

                if (response.status === 401 || response.status === 403) {
                    if (!shouldIgnore()) {
                        window.location.href = "/admin?expired=1"
                    }
                    return
                }

                if (!response.ok) {
                    throw new Error(
                        data && "detail" in data && typeof data.detail === "string"
                            ? data.detail
                            : "No pudimos cargar las empresas",
                    )
                }

                if (!shouldIgnore() && data && "items" in data && Array.isArray(data.items)) {
                    setEmpresas(data.items)
                    setTotal(data.total ?? 0)
                    setError(false)
                    return
                }

                if (!shouldIgnore()) {
                    setEmpresas([])
                    setTotal(0)
                    setError(true)
                }
            } catch (err) {
                if (!shouldIgnore()) {
                    console.error("Error al cargar empresas:", err)
                    setEmpresas([])
                    setTotal(0)
                    setError(true)
                }
            } finally {
                if (!shouldIgnore()) {
                    setLoading(false)
                }
            }
        },
        [buscar, page, perPage, token],
    )

    const fetchEmpresas = useCallback(() => {
        setLoading(true)
        setError(false)
        void cargar(() => false)
    }, [cargar])

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        setError(false)
        void cargar(() => cancelled)

        return () => {
            cancelled = true
        }
    }, [cargar])

    return { empresas, total, loading, error, refetch: fetchEmpresas }
}
