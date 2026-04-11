"use client"

import { useState } from "react"

import type { ToastType } from "../types"
import { TicketDetailModal } from "./SectionSoporte/TicketDetailModal"
import { TicketsTable } from "./SectionSoporte/TicketsTable"
import { useSupportTickets } from "./SectionSoporte/useSupportTickets"
import { TABS, type FiltroEstado } from "./SectionSoporte/utils"

interface Props {
    token: string
    addToast: (msg: string, type: ToastType) => void
}

export default function SectionSoporte({ token, addToast }: Props) {
    const [filtro, setFiltro] = useState<FiltroEstado>("todos")
    const {
        tickets,
        loading,
        cantidadAbiertos,
        ticketSeleccionado,
        respuesta,
        prioridad,
        respondiendo,
        cerrando,
        setRespuesta,
        setPrioridad,
        abrirDetalle,
        cerrarDetalle,
        responderTicket,
        cerrarTicket,
    } = useSupportTickets({ token, filtro, addToast })

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Soporte</h1>
                    <p className="mt-1 text-sm text-gray-500">Consultas de usuarios</p>
                </div>
                {cantidadAbiertos > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-sm font-bold text-red-700">
                        {cantidadAbiertos} abierto{cantidadAbiertos !== 1 ? "s" : ""}
                    </span>
                )}
            </div>

            <div className="flex w-fit gap-1 rounded-xl bg-slate-100 p-1">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setFiltro(tab.id)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                            filtro === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <TicketsTable
                tickets={tickets}
                loading={loading}
                filtroLabel={filtro !== "todos" ? filtro : undefined}
                onOpen={abrirDetalle}
            />

            <TicketDetailModal
                ticket={ticketSeleccionado}
                respuesta={respuesta}
                prioridad={prioridad}
                respondiendo={respondiendo}
                cerrando={cerrando}
                onClose={cerrarDetalle}
                onRespuestaChange={setRespuesta}
                onPrioridadChange={setPrioridad}
                onResponder={() => void responderTicket()}
                onCerrar={() => void cerrarTicket()}
            />
        </div>
    )
}
