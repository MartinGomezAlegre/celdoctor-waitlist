import { X } from "lucide-react"

import type { Ticket } from "../../types"
import { fmtDate } from "../../lib"
import { EstadoBadge, PrioridadBadge } from "./utils"

interface Props {
    ticket: Ticket | null
    respuesta: string
    prioridad: "normal" | "alta"
    respondiendo: boolean
    cerrando: boolean
    onClose: () => void
    onRespuestaChange: (value: string) => void
    onPrioridadChange: (value: "normal" | "alta") => void
    onResponder: () => void
    onCerrar: () => void
}

export function TicketDetailModal({
    ticket,
    respuesta,
    prioridad,
    respondiendo,
    cerrando,
    onClose,
    onRespuestaChange,
    onPrioridadChange,
    onResponder,
    onCerrar,
}: Props) {
    if (!ticket) {
        return null
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">{ticket.asunto}</h3>
                        <div className="mt-1 flex items-center gap-2">
                            <EstadoBadge estado={ticket.estado} />
                            <PrioridadBadge prioridad={ticket.prioridad} />
                        </div>
                    </div>
                    <button type="button" onClick={onClose} className="shrink-0 text-slate-400 transition-colors hover:text-slate-600">
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-5 p-6">
                    <div className="rounded-xl bg-slate-50 p-4 text-sm">
                        <p className="font-semibold text-slate-900">{ticket.usuario_nombre}</p>
                        <p className="text-slate-500">{ticket.usuario_email}</p>
                        <p className="mt-1 text-xs text-slate-400">{fmtDate(ticket.created_at)}</p>
                    </div>

                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Mensaje</p>
                        <p className="whitespace-pre-wrap text-sm text-slate-700">{ticket.mensaje}</p>
                    </div>

                    {ticket.respuesta && (
                        <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Respuesta enviada</p>
                            <p className="whitespace-pre-wrap rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
                                {ticket.respuesta}
                            </p>
                            {ticket.respondido_en && (
                                <p className="mt-1 text-xs text-slate-400">{fmtDate(ticket.respondido_en)}</p>
                            )}
                        </div>
                    )}

                    {ticket.estado === "abierto" && (
                        <div className="space-y-4 border-t border-slate-100 pt-5">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Responder</p>
                            <textarea
                                required
                                rows={4}
                                value={respuesta}
                                onChange={(event) => onRespuestaChange(event.target.value)}
                                placeholder="Escribi tu respuesta..."
                                className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            />
                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-700">Prioridad</label>
                                <select
                                    value={prioridad}
                                    onChange={(event) => onPrioridadChange(event.target.value as "normal" | "alta")}
                                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                                >
                                    <option value="normal">Normal</option>
                                    <option value="alta">Alta</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    disabled={respondiendo || !respuesta.trim()}
                                    onClick={onResponder}
                                    className="rounded-xl bg-[#4C1D95] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3b1675] disabled:opacity-60"
                                >
                                    {respondiendo ? "Enviando..." : "Responder"}
                                </button>
                            </div>
                        </div>
                    )}

                    {ticket.estado === "respondido" && (
                        <div className="flex justify-end border-t border-slate-100 pt-5">
                            <button
                                type="button"
                                onClick={onCerrar}
                                disabled={cerrando}
                                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                            >
                                {cerrando ? "Cerrando..." : "Cerrar ticket"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
