"use client"

import { useState } from "react"

import type { ToastType } from "../types"
import { ExportMediquoTab } from "./SectionFacturacion/ExportMediquoTab"
import { MarkExportedModal } from "./SectionFacturacion/MarkExportedModal"
import { PagosTab } from "./SectionFacturacion/PagosTab"
import { useFacturacionData } from "./SectionFacturacion/useFacturacionData"

type Tab = "pagos" | "exportar"

interface Props {
    token: string
    addToast: (msg: string, type: ToastType) => void
}

export default function SectionFacturacion({ token, addToast }: Props) {
    const [tab, setTab] = useState<Tab>("pagos")
    const [filtroEstado, setFiltroEstado] = useState("")
    const {
        pagos,
        resumen,
        loading,
        exporting,
        showConfirmModal,
        setShowConfirmModal,
        exportarMediquo,
        marcarExportados,
    } = useFacturacionData({ token, filtroEstado, addToast })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Facturacion</h1>
                <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
                    {(["pagos", "exportar"] as Tab[]).map((currentTab) => (
                        <button
                            key={currentTab}
                            type="button"
                            onClick={() => setTab(currentTab)}
                            className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                                tab === currentTab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            {currentTab === "pagos" ? "Pagos" : "Exportar Mediquo"}
                        </button>
                    ))}
                </div>
            </div>

            {tab === "pagos" && (
                <PagosTab
                    pagos={pagos}
                    resumen={resumen}
                    loading={loading}
                    filtroEstado={filtroEstado}
                    onFiltroEstadoChange={setFiltroEstado}
                />
            )}

            {tab === "exportar" && <ExportMediquoTab exporting={exporting} onExport={() => void exportarMediquo()} />}

            <MarkExportedModal
                open={showConfirmModal}
                onSkip={() => {
                    setShowConfirmModal(false)
                    addToast("Exportacion completada", "success")
                }}
                onConfirm={() => void marcarExportados()}
            />
        </div>
    )
}
