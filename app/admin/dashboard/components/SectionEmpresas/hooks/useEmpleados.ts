import { useState, useEffect, useCallback } from "react"
import type { EmpleadoEmpresa } from "../../../types"
import { API, authHeaders } from "../../../lib"

export function useEmpleados(empresaId: number, token: string) {
    const [empleados, setEmpleados] = useState<EmpleadoEmpresa[]>([])
    const [loading, setLoading] = useState(false)
    const [hasFetched, setHasFetched] = useState(false)

    const fetchEmpleados = useCallback(() => {
        setLoading(true)
        fetch(`${API}/admin/empresas/${empresaId}/empleados`, { headers: authHeaders(token) })
            .then((r) => r.json())
            .then((d: unknown) => setEmpleados(Array.isArray(d) ? (d as EmpleadoEmpresa[]) : []))
            .catch(() => setEmpleados([]))
            .finally(() => {
                setLoading(false)
                setHasFetched(true)
            })
    }, [empresaId, token])

    // Resetear cuando cambia la empresa para forzar re-fetch al volver a este detalle
    useEffect(() => {
        setEmpleados([])
        setHasFetched(false)
    }, [empresaId])

    return { empleados, setEmpleados, loading, hasFetched, fetchEmpleados }
}
