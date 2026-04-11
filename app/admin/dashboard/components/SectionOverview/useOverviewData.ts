"use client"

import { useEffect, useState } from "react"

import type {
    Alerta,
    DashboardMetrics,
    GraficoPoint,
    MetricasEmpresas,
    ToastType,
} from "../../types"
import { API, authHeaders } from "../../lib"
import { adminEndpoints } from "../../admin-endpoints"

interface Params {
    token: string
    addToast: (msg: string, type: ToastType) => void
}

export function useOverviewData({ token, addToast }: Params) {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
    const [loadingMetrics, setLoadingMetrics] = useState(true)
    const [graficoData, setGraficoData] = useState<GraficoPoint[]>([])
    const [loadingGrafico, setLoadingGrafico] = useState(true)
    const [alertas, setAlertas] = useState<Alerta[]>([])
    const [metricasEmpresas, setMetricasEmpresas] = useState<MetricasEmpresas | null>(null)
    const [exporting, setExporting] = useState(false)

    useEffect(() => {
        let ignore = false

        fetch(`${API}${adminEndpoints.dashboard}`, { headers: authHeaders(token) })
            .then((response) => response.json())
            .then((data: DashboardMetrics) => {
                if (!ignore) {
                    setMetrics(data)
                }
            })
            .catch(() => addToast("Error al cargar metricas del dashboard", "error"))
            .finally(() => {
                if (!ignore) {
                    setLoadingMetrics(false)
                }
            })

        fetch(`${API}${adminEndpoints.metricasGrafico}`, { headers: authHeaders(token) })
            .then((response) => response.json())
            .then((data: unknown) => {
                if (!ignore) {
                    setGraficoData(Array.isArray(data) ? (data as GraficoPoint[]) : [])
                }
            })
            .catch(() => addToast("Error al cargar datos del grafico", "error"))
            .finally(() => {
                if (!ignore) {
                    setLoadingGrafico(false)
                }
            })

        fetch(`${API}${adminEndpoints.alertas}`, { headers: authHeaders(token) })
            .then((response) => response.json())
            .then((data: unknown) => {
                if (!ignore) {
                    setAlertas(Array.isArray(data) ? (data as Alerta[]) : [])
                }
            })
            .catch(() => {
                if (!ignore) {
                    setAlertas([])
                }
            })

        fetch(`${API}${adminEndpoints.metricasEmpresas}`, { headers: authHeaders(token) })
            .then((response) => response.json())
            .then((data: MetricasEmpresas) => {
                if (!ignore) {
                    setMetricasEmpresas(data)
                }
            })
            .catch(() => {
                // Si empresas falla, seguimos con las metricas generales.
            })

        return () => {
            ignore = true
        }
    }, [token, addToast])

    async function exportarExcel() {
        setExporting(true)
        try {
            const res = await fetch(`${API}${adminEndpoints.exportarExcel}`, {
                headers: authHeaders(token),
            })
            if (!res.ok) throw new Error("Export failed")
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const anchor = document.createElement("a")
            anchor.href = url
            anchor.download = `suscriptores_${new Date().toISOString().split("T")[0]}.xlsx`
            document.body.appendChild(anchor)
            anchor.click()
            document.body.removeChild(anchor)
            URL.revokeObjectURL(url)
            addToast("Exportacion completada", "success")
        } catch {
            addToast("Error al exportar el archivo", "error")
        } finally {
            setExporting(false)
        }
    }

    return {
        metrics,
        loadingMetrics,
        graficoData,
        loadingGrafico,
        alertas,
        metricasEmpresas,
        exporting,
        exportarExcel,
    }
}
