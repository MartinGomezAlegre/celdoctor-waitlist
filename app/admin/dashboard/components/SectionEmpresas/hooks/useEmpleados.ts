import { useState, useEffect, useCallback } from "react"
import type { EmpleadoEmpresa } from "../../../types"
import { API, authHeaders } from "../../../lib"

export function useEmpleados(empresaId: number, token: string) {
    const [empleados, setEmpleados] = useState<EmpleadoEmpresa[]>([])
    const [loading, setLoading] = useState(true)
    const [loadedEmpresaId, setLoadedEmpresaId] = useState<number | null>(null)

    const fetchEmpleados = useCallback(() => {
        setLoading(true)
        fetch(`${API}/admin/empresas/${empresaId}/empleados`, { headers: authHeaders(token) })
            .then((r) => r.json())
            .then((d: unknown) => setEmpleados(Array.isArray(d) ? (d as EmpleadoEmpresa[]) : []))
            .catch(() => setEmpleados([]))
            .finally(() => {
                setLoading(false)
                setLoadedEmpresaId(empresaId)
            })
    }, [empresaId, token])

    useEffect(() => {
        let cancelled = false

        fetch(`${API}/admin/empresas/${empresaId}/empleados`, { headers: authHeaders(token) })
            .then((r) => r.json())
            .then((d: unknown) => {
                if (!cancelled) setEmpleados(Array.isArray(d) ? (d as EmpleadoEmpresa[]) : [])
            })
            .catch(() => {
                if (!cancelled) setEmpleados([])
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false)
                    setLoadedEmpresaId(empresaId)
                }
            })

        return () => {
            cancelled = true
        }
    }, [empresaId, token])

    return {
        empleados: loadedEmpresaId === empresaId ? empleados : [],
        setEmpleados,
        loading: loading || loadedEmpresaId !== empresaId,
        hasFetched: loadedEmpresaId === empresaId,
        fetchEmpleados,
    }
}
