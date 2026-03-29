"use client"

import { useState, useEffect, useCallback } from "react"
import { X } from "lucide-react"
import type { LeadEmpresarial, ToastType } from "../types"
import { API, authHeaders, fmtDate } from "../lib"
import { Skeleton } from "./shared/Skeleton"

type FiltroEstado = "todos" | "nuevo" | "contactado" | "convertido" | "descartado"

interface Props {
    token: string
    addToast: (msg: string, type: ToastType) => void
}

const TABS: { id: FiltroEstado; label: string }[] = [
    { id: "todos", label: "Todos" },
    { id: "nuevo", label: "Nuevos" },
    { id: "contactado", label: "Contactados" },
    { id: "convertido", label: "Convertidos" },
    { id: "descartado", label: "Descartados" },
]

const ESTADO_COLORS: Record<string, string> = {
    nuevo: "bg-blue-100 text-blue-700",
    contactado: "bg-amber-100 text-amber-700",
    convertido: "bg-emerald-100 text-emerald-700",
    descartado: "bg-slate-100 text-slate-500",
}

function EstadoBadge({ estado }: { estado: string }) {
    const color = ESTADO_COLORS[estado] ?? "bg-slate-100 text-slate-600"
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${color}`}>
            {estado}
        </span>
    )
}

export default function SectionLeads({ token, addToast }: Props) {
    const [leads, setLeads] = useState<LeadEmpresarial[]>([])
    const [loading, setLoading] = useState(true)
    const [filtro, setFiltro] = useState<FiltroEstado>("todos")
    const [leadSeleccionado, setLeadSeleccionado] = useState<LeadEmpresarial | null>(null)
    const [cantidadNuevos, setCantidadNuevos] = useState(0)

    // Panel de detalle
    const [nota, setNota] = useState("")
    const [estadoForm, setEstadoForm] = useState<LeadEmpresarial["estado"]>("nuevo")
    const [guardando, setGuardando] = useState(false)

    const cargarLeads = useCallback((estado: FiltroEstado) => {
        setLoading(true)
        const url = estado === "todos"
            ? `${API}/admin/leads/empresariales`
            : `${API}/admin/leads/empresariales?estado=${estado}`
        fetch(url, { headers: authHeaders(token) })
            .then((r) => r.json())
            .then((d: unknown) => {
                const lista = Array.isArray(d) ? (d as LeadEmpresarial[]) : []
                setLeads(lista)
                if (estado === "todos" || estado === "nuevo") {
                    setCantidadNuevos(lista.filter((l) => l.estado === "nuevo").length)
                }
            })
            .catch(() => addToast("Error al cargar leads", "error"))
            .finally(() => setLoading(false))
    }, [token, addToast])

    useEffect(() => {
        cargarLeads(filtro)
    }, [filtro, cargarLeads])

    function abrirDetalle(lead: LeadEmpresarial) {
        setLeadSeleccionado(lead)
        setNota(lead.nota_admin ?? "")
        setEstadoForm(lead.estado)
    }

    function cerrarDetalle() {
        setLeadSeleccionado(null)
        setNota("")
        setEstadoForm("nuevo")
    }

    async function handleGuardar(e: React.FormEvent) {
        e.preventDefault()
        if (!leadSeleccionado) return
        setGuardando(true)
        try {
            const res = await fetch(`${API}/admin/leads/empresariales/${leadSeleccionado.id}`, {
                method: "PUT",
                headers: { ...authHeaders(token), "Content-Type": "application/json" },
                body: JSON.stringify({ estado: estadoForm, nota_admin: nota }),
            })
            if (!res.ok) throw new Error()
            addToast("Lead actualizado", "success")
            cerrarDetalle()
            cargarLeads(filtro)
        } catch {
            addToast("Error al actualizar el lead", "error")
        } finally {
            setGuardando(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Leads Empresariales</h1>
                    <p className="mt-1 text-sm text-gray-500">Contactos interesados en planes corporativos</p>
                </div>
                {cantidadNuevos > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                        {cantidadNuevos} nuevo{cantidadNuevos !== 1 ? "s" : ""}
                    </span>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit overflow-x-auto">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setFiltro(t.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
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
                ) : leads.length === 0 ? (
                    <div className="flex h-40 items-center justify-center text-sm text-gray-400">
                        No hay leads {filtro !== "todos" ? `con estado "${filtro}"` : ""}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Empresa</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contacto</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Teléfono</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Empleados</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Fecha</th>
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {leads.map((lead) => (
                                    <tr
                                        key={lead.id}
                                        onClick={() => abrirDetalle(lead)}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-900">{lead.razon_social ?? "—"}</p>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">{lead.nombre_contacto}</td>
                                        <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{lead.email}</td>
                                        <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{lead.telefono}</td>
                                        <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                                            {lead.cantidad_empleados ?? "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <EstadoBadge estado={lead.estado} />
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell whitespace-nowrap">
                                            {fmtDate(lead.created_at)}
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
            {leadSeleccionado && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-3">
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">
                                    {leadSeleccionado.razon_social ?? leadSeleccionado.nombre_contacto}
                                </h3>
                                <EstadoBadge estado={leadSeleccionado.estado} />
                            </div>
                            <button onClick={cerrarDetalle} className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Datos del lead */}
                            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl text-sm">
                                <div>
                                    <p className="text-xs text-slate-500 mb-0.5">Contacto</p>
                                    <p className="font-medium text-slate-900">{leadSeleccionado.nombre_contacto}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-0.5">Email</p>
                                    <p className="text-slate-700 break-all">{leadSeleccionado.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-0.5">Teléfono</p>
                                    <p className="text-slate-700">{leadSeleccionado.telefono}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-0.5">Empleados</p>
                                    <p className="text-slate-700">{leadSeleccionado.cantidad_empleados ?? "—"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-0.5">Fecha</p>
                                    <p className="text-slate-700">{fmtDate(leadSeleccionado.created_at)}</p>
                                </div>
                            </div>

                            {/* Mensaje del lead */}
                            {leadSeleccionado.mensaje && (
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Mensaje</p>
                                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{leadSeleccionado.mensaje}</p>
                                </div>
                            )}

                            {/* Form de gestión */}
                            <form onSubmit={handleGuardar} className="space-y-4 border-t border-slate-100 pt-5">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Estado</label>
                                    <select
                                        value={estadoForm}
                                        onChange={(e) => setEstadoForm(e.target.value as LeadEmpresarial["estado"])}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] bg-white"
                                    >
                                        <option value="nuevo">Nuevo</option>
                                        <option value="contactado">Contactado</option>
                                        <option value="convertido">Convertido</option>
                                        <option value="descartado">Descartado</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Nota interna</label>
                                    <textarea
                                        rows={3}
                                        value={nota}
                                        onChange={(e) => setNota(e.target.value)}
                                        placeholder="Notas internas sobre este lead..."
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]"
                                    />
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <button type="button" onClick={cerrarDetalle}
                                        className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">
                                        Cancelar
                                    </button>
                                    <button type="submit" disabled={guardando}
                                        className="px-4 py-2 rounded-xl bg-[#4C1D95] text-white text-sm font-semibold hover:bg-[#3b1675] disabled:opacity-60">
                                        {guardando ? "Guardando..." : "Guardar"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
