"use client"

import { useState, useEffect, useCallback } from "react"
import { X } from "lucide-react"
import type { Ticket, ToastType } from "../types"
import { API, authHeaders, fmtDate } from "../lib"
import { Skeleton } from "./shared/Skeleton"

type FiltroEstado = "todos" | "abierto" | "respondido" | "cerrado"

interface Props {
    token: string
    addToast: (msg: string, type: ToastType) => void
}

const TABS: { id: FiltroEstado; label: string }[] = [
    { id: "todos", label: "Todos" },
    { id: "abierto", label: "Abiertos" },
    { id: "respondido", label: "Respondidos" },
    { id: "cerrado", label: "Cerrados" },
]

function EstadoBadge({ estado }: { estado: string }) {
    if (estado === "abierto") return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Abierto</span>
    if (estado === "respondido") return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Respondido</span>
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">Cerrado</span>
}

function PrioridadBadge({ prioridad }: { prioridad: string }) {
    if (prioridad === "alta") return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Alta</span>
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">Normal</span>
}

export default function SectionSoporte({ token, addToast }: Props) {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)
    const [filtro, setFiltro] = useState<FiltroEstado>("todos")
    const [ticketSeleccionado, setTicketSeleccionado] = useState<Ticket | null>(null)
    const [cantidadAbiertos, setCantidadAbiertos] = useState(0)

    // Panel de detalle
    const [respuesta, setRespuesta] = useState("")
    const [prioridad, setPrioridad] = useState<"normal" | "alta">("normal")
    const [respondiendo, setRespondiendo] = useState(false)
    const [cerrando, setCerrando] = useState(false)

    const cargarTickets = useCallback((estado: FiltroEstado) => {
        setLoading(true)
        const url = estado === "todos"
            ? `${API}/admin/soporte/tickets`
            : `${API}/admin/soporte/tickets?estado=${estado}`
        fetch(url, { headers: authHeaders(token) })
            .then((r) => r.json())
            .then((d: unknown) => {
                const lista = Array.isArray(d) ? (d as Ticket[]) : []
                setTickets(lista)
                if (estado === "todos" || estado === "abierto") {
                    setCantidadAbiertos(lista.filter((t) => t.estado === "abierto").length)
                }
            })
            .catch(() => addToast("Error al cargar tickets", "error"))
            .finally(() => setLoading(false))
    }, [token, addToast])

    useEffect(() => {
        cargarTickets(filtro)
    }, [filtro, cargarTickets])

    function abrirDetalle(ticket: Ticket) {
        setTicketSeleccionado(ticket)
        setRespuesta(ticket.respuesta ?? "")
        setPrioridad(ticket.prioridad)
    }

    function cerrarDetalle() {
        setTicketSeleccionado(null)
        setRespuesta("")
        setPrioridad("normal")
    }

    async function handleResponder(e: React.FormEvent) {
        e.preventDefault()
        if (!ticketSeleccionado) return
        setRespondiendo(true)
        try {
            const res = await fetch(`${API}/admin/soporte/tickets/${ticketSeleccionado.id}/responder`, {
                method: "PUT",
                headers: { ...authHeaders(token), "Content-Type": "application/json" },
                body: JSON.stringify({ respuesta, prioridad }),
            })
            if (!res.ok) throw new Error()
            addToast("Respuesta enviada", "success")
            cerrarDetalle()
            cargarTickets(filtro)
        } catch {
            addToast("Error al enviar la respuesta", "error")
        } finally {
            setRespondiendo(false)
        }
    }

    async function handleCerrar() {
        if (!ticketSeleccionado) return
        setCerrando(true)
        try {
            const res = await fetch(`${API}/admin/soporte/tickets/${ticketSeleccionado.id}/estado`, {
                method: "PUT",
                headers: { ...authHeaders(token), "Content-Type": "application/json" },
                body: JSON.stringify({ estado: "cerrado" }),
            })
            if (!res.ok) throw new Error()
            addToast("Ticket cerrado", "success")
            cerrarDetalle()
            cargarTickets(filtro)
        } catch {
            addToast("Error al cerrar el ticket", "error")
        } finally {
            setCerrando(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Soporte</h1>
                    <p className="mt-1 text-sm text-gray-500">Consultas de usuarios</p>
                </div>
                {cantidadAbiertos > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-sm font-bold">
                        {cantidadAbiertos} abierto{cantidadAbiertos !== 1 ? "s" : ""}
                    </span>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setFiltro(t.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filtro === t.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Tabla */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-6"><Skeleton /></div>
                ) : tickets.length === 0 ? (
                    <div className="flex h-40 items-center justify-center text-sm text-gray-400">
                        No hay tickets {filtro !== "todos" ? `con estado "${filtro}"` : ""}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#ID</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuario</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Asunto</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Prioridad</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Fecha</th>
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {tickets.map((ticket) => (
                                    <tr
                                        key={ticket.id}
                                        onClick={() => abrirDetalle(ticket)}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">#{ticket.id}</td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-900">{ticket.usuario_nombre}</p>
                                            <p className="text-xs text-gray-500">{ticket.usuario_email}</p>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <p className="text-gray-700 max-w-xs truncate">{ticket.asunto}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <EstadoBadge estado={ticket.estado} />
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <PrioridadBadge prioridad={ticket.prioridad} />
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell whitespace-nowrap">
                                            {fmtDate(ticket.created_at)}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button className="text-xs text-violet-600 font-medium hover:underline whitespace-nowrap">
                                                Ver detalle
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Panel de detalle */}
            {ticketSeleccionado && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-3">
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">{ticketSeleccionado.asunto}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <EstadoBadge estado={ticketSeleccionado.estado} />
                                    <PrioridadBadge prioridad={ticketSeleccionado.prioridad} />
                                </div>
                            </div>
                            <button onClick={cerrarDetalle} className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Datos del usuario */}
                            <div className="p-4 bg-slate-50 rounded-xl text-sm">
                                <p className="font-semibold text-slate-900">{ticketSeleccionado.usuario_nombre}</p>
                                <p className="text-slate-500">{ticketSeleccionado.usuario_email}</p>
                                <p className="text-slate-400 text-xs mt-1">{fmtDate(ticketSeleccionado.created_at)}</p>
                            </div>

                            {/* Mensaje del usuario */}
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Mensaje</p>
                                <p className="text-sm text-slate-700 whitespace-pre-wrap">{ticketSeleccionado.mensaje}</p>
                            </div>

                            {/* Respuesta existente */}
                            {ticketSeleccionado.respuesta && (
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Respuesta enviada</p>
                                    <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl p-4 whitespace-pre-wrap">
                                        {ticketSeleccionado.respuesta}
                                    </p>
                                    {ticketSeleccionado.respondido_en && (
                                        <p className="text-xs text-slate-400 mt-1">{fmtDate(ticketSeleccionado.respondido_en)}</p>
                                    )}
                                </div>
                            )}

                            {/* Form de respuesta (solo si está abierto) */}
                            {ticketSeleccionado.estado === "abierto" && (
                                <form onSubmit={handleResponder} className="space-y-4 border-t border-slate-100 pt-5">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Responder</p>
                                    <div>
                                        <textarea
                                            required
                                            rows={4}
                                            value={respuesta}
                                            onChange={(e) => setRespuesta(e.target.value)}
                                            placeholder="Escribí tu respuesta..."
                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Prioridad</label>
                                        <select
                                            value={prioridad}
                                            onChange={(e) => setPrioridad(e.target.value as "normal" | "alta")}
                                            className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] bg-white"
                                        >
                                            <option value="normal">Normal</option>
                                            <option value="alta">Alta</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-3 justify-end">
                                        <button type="button" onClick={cerrarDetalle}
                                            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">
                                            Cancelar
                                        </button>
                                        <button type="submit" disabled={respondiendo}
                                            className="px-4 py-2 rounded-xl bg-[#4C1D95] text-white text-sm font-semibold hover:bg-[#3b1675] disabled:opacity-60">
                                            {respondiendo ? "Enviando..." : "Responder"}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Botón cerrar ticket */}
                            {ticketSeleccionado.estado === "respondido" && (
                                <div className="border-t border-slate-100 pt-5 flex justify-end">
                                    <button
                                        onClick={handleCerrar}
                                        disabled={cerrando}
                                        className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                                    >
                                        {cerrando ? "Cerrando..." : "Cerrar ticket"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
