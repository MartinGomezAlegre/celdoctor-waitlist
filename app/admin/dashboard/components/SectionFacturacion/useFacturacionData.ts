"use client"

import { useCallback, useEffect, useState } from "react"

import type { PagoFacturacion, ResumenFacturacion, ToastType } from "../../types"
import { API, authHeaders } from "../../lib"
import { adminEndpoints } from "../../admin-endpoints"

interface Params {
    token: string
    filtroEstado: string
    addToast: (msg: string, type: ToastType) => void
}

export function useFacturacionData({ token, filtroEstado, addToast }: Params) {
    const [pagos, setPagos] = useState<PagoFacturacion[]>([])
    const [resumen, setResumen] = useState<ResumenFacturacion | null>(null)
    const [loading, setLoading] = useState(true)
    const [exporting, setExporting] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [exportedIds, setExportedIds] = useState<number[]>([])

    const cargar = useCallback(async () => {
        setLoading(true)
        const qs = filtroEstado ? `?estado=${filtroEstado}` : ""

        await Promise.all([
            fetch(`${API}${adminEndpoints.pagos}${qs}`, { headers: authHeaders(token) })
                .then((response) => response.json())
                .then((data: unknown) => setPagos(Array.isArray(data) ? (data as PagoFacturacion[]) : []))
                .catch(() => setPagos([])),
            fetch(`${API}${adminEndpoints.resumenFacturacion}`, { headers: authHeaders(token) })
                .then((response) => response.json())
                .then((data: ResumenFacturacion) => setResumen(data))
                .catch(() => setResumen(null)),
        ]).finally(() => setLoading(false))
    }, [filtroEstado, token])

    useEffect(() => {
        void cargar()
    }, [cargar])

    async function exportarMediquo() {
        setExporting(true)
        try {
            const res = await fetch(`${API}${adminEndpoints.exportarMediquo}`, { headers: authHeaders(token) })
            if (!res.ok) throw new Error()
            const headerIds = res.headers.get("x-subscription-ids") ?? ""
            const parsedIds = headerIds
                .split(",")
                .map((id) => Number(id.trim()))
                .filter((id) => Number.isFinite(id) && id > 0)

            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const anchor = document.createElement("a")
            anchor.href = url
            anchor.download = `mediquo_${new Date().toISOString().split("T")[0]}.xlsx`
            document.body.appendChild(anchor)
            anchor.click()
            document.body.removeChild(anchor)
            URL.revokeObjectURL(url)

            setExportedIds(parsedIds)
            setShowConfirmModal(true)
        } catch {
            addToast("Error al exportar el archivo", "error")
        } finally {
            setExporting(false)
        }
    }

    async function marcarExportados() {
        setShowConfirmModal(false)
        if (exportedIds.length === 0) {
            addToast("No hay suscripciones exportadas para marcar", "warning")
            return
        }

        try {
            const res = await fetch(`${API}${adminEndpoints.marcarExportados}`, {
                method: "POST",
                headers: { ...authHeaders(token), "Content-Type": "application/json" },
                body: JSON.stringify({ suscripcion_ids: exportedIds }),
            })

            if (!res.ok) throw new Error()
            setExportedIds([])
            addToast("Registros marcados como exportados", "success")
        } catch {
            addToast("Error al marcar los registros", "error")
        }
    }

    return {
        pagos,
        resumen,
        loading,
        exporting,
        showConfirmModal,
        setShowConfirmModal,
        exportarMediquo,
        marcarExportados,
    }
}
