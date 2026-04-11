"use client"

import { useState } from "react"

import type { ToastType } from "../types"
import { LeadDetailModal } from "./SectionLeads/LeadDetailModal"
import { LeadsTable } from "./SectionLeads/LeadsTable"
import { useLeadAdmin } from "./SectionLeads/useLeadAdmin"
import { TABS, type FiltroEstado } from "./SectionLeads/utils"

interface Props {
    token: string
    addToast: (msg: string, type: ToastType) => void
}

export default function SectionLeads({ token, addToast }: Props) {
    const [filtro, setFiltro] = useState<FiltroEstado>("todos")
    const {
        leads,
        loading,
        cantidadNuevos,
        leadSeleccionado,
        nota,
        estadoForm,
        guardando,
        setNota,
        setEstadoForm,
        abrirDetalle,
        cerrarDetalle,
        guardarLead,
    } = useLeadAdmin({ token, filtro, addToast })

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Leads Empresariales</h1>
                    <p className="mt-1 text-sm text-gray-500">Contactos interesados en planes corporativos</p>
                </div>
                {cantidadNuevos > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-bold text-blue-700">
                        {cantidadNuevos} nuevo{cantidadNuevos !== 1 ? "s" : ""}
                    </span>
                )}
            </div>

            <div className="flex w-fit gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setFiltro(tab.id)}
                        className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                            filtro === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <LeadsTable
                leads={leads}
                loading={loading}
                filtroLabel={filtro !== "todos" ? filtro : undefined}
                onOpen={abrirDetalle}
            />

            <LeadDetailModal
                lead={leadSeleccionado}
                nota={nota}
                estado={estadoForm}
                guardando={guardando}
                onClose={cerrarDetalle}
                onNotaChange={setNota}
                onEstadoChange={setEstadoForm}
                onGuardar={() => void guardarLead()}
            />
        </div>
    )
}
