"use client"

import { useEffect, useState } from "react"

import type { AdminSuscripcion, PaginatedResponse, ToastType } from "../types"
import { API, authHeaders, fmtCurrency, fmtDate } from "../lib"
import { adminEndpoints } from "../admin-endpoints"
import { TableSkeleton } from "./shared/Skeleton"
import { StatBadge } from "./shared/StatBadge"
import { Pagination } from "./shared/Pagination"

interface Props {
    token: string
    addToast: (msg: string, type: ToastType) => void
}

const PER_PAGE = 25

const ESTADOS_GESTIONABLES = [
    { value: "activa", label: "Activar" },
    { value: "cancelacion_programada", label: "Programar baja" },
    { value: "pendiente_pago", label: "Pendiente de pago" },
    { value: "cancelada", label: "Cancelar definitivamente" },
]

export default function SectionSuscripciones({ token, addToast }: Props) {
    const [suscripciones, setSuscripciones] = useState<AdminSuscripcion[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [filtroEstado, setFiltroEstado] = useState("")
    const [buscar, setBuscar] = useState("")
    const [page, setPage] = useState(1)
    const [modalGestion, setModalGestion] = useState<AdminSuscripcion | null>(null)
    const [nuevoEstado, setNuevoEstado] = useState("")
    const [motivoGestion, setMotivoGestion] = useState("")
    const [procesando, setProcesando] = useState(false)

    useEffect(() => {
        let cancelled = false
        const params = new URLSearchParams({
            limit: String(PER_PAGE),
            offset: String((page - 1) * PER_PAGE),
        })
        if (filtroEstado) params.set("estado", filtroEstado)
        if (buscar.trim()) params.set("buscar", buscar.trim())

        setLoading(true)
        setError(false)

        fetch(`${API}${adminEndpoints.suscripciones}?${params.toString()}`, { headers: authHeaders(token) })
            .then((r) => r.json())
            .then((d: unknown) => {
                if (cancelled) return
                const payload = d as PaginatedResponse<AdminSuscripcion>
                if (payload && Array.isArray(payload.items)) {
                    setSuscripciones(payload.items)
                    setTotal(payload.total ?? 0)
                    return
                }
                setSuscripciones([])
                setTotal(0)
                setError(true)
            })
            .catch(() => {
                if (!cancelled) {
                    setSuscripciones([])
                    setTotal(0)
                    setError(true)
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [buscar, filtroEstado, page, token])

    async function cambiarEstado() {
        if (!modalGestion || !nuevoEstado) return
        setProcesando(true)
        try {
            const res = await fetch(`${API}${adminEndpoints.suscripcionEstado(modalGestion.id)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify({ estado: nuevoEstado, motivo: motivoGestion }),
            })
            if (!res.ok) throw new Error()
            setSuscripciones((prev) =>
                prev.map((s) => (s.id === modalGestion.id ? { ...s, estado: nuevoEstado } : s))
            )
            addToast("Suscripcion actualizada correctamente", "success")
        } catch {
            addToast("Error al actualizar la suscripcion", "error")
        } finally {
            setProcesando(false)
            setModalGestion(null)
            setNuevoEstado("")
            setMotivoGestion("")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-bold text-slate-900">Suscripciones</h1>
                    {!loading && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                            {total} resultados
                        </span>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o plan..."
                        value={buscar}
                        onChange={(e) => {
                            setBuscar(e.target.value)
                            setPage(1)
                        }}
                        className="w-64 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                    />
                    <select
                        value={filtroEstado}
                        onChange={(e) => {
                            setFiltroEstado(e.target.value)
                            setPage(1)
                        }}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                    >
                        <option value="">Todos los estados</option>
                        <option value="activa">Activa</option>
                        <option value="cancelacion_programada">Baja programada</option>
                        <option value="pendiente_pago">Pendiente de pago</option>
                        <option value="cancelada">Cancelada</option>
                        <option value="vencida">Vencida</option>
                    </select>
                </div>
            </div>

            {error ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-4 text-sm text-red-600">
                    Error al cargar suscripciones.
                </div>
            ) : (
                <div className="overflow-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                {["Usuario", "Email", "Plan", "Estado", "Precio", "Inicio", "Acciones"].map((h) => (
                                    <th key={h} className="whitespace-nowrap px-5 py-3.5 text-left font-semibold text-slate-600">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <TableSkeleton rows={6} cols={7} />
                            ) : suscripciones.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                                        No hay suscripciones para este filtro.
                                    </td>
                                </tr>
                            ) : (
                                suscripciones.map((s) => (
                                    <tr key={s.id} className="border-b border-slate-50 transition-colors hover:bg-slate-50/50">
                                        <td className="whitespace-nowrap px-5 py-3.5 font-medium text-slate-900">{s.nombre_completo}</td>
                                        <td className="px-5 py-3.5 text-slate-600">{s.email}</td>
                                        <td className="px-5 py-3.5 text-slate-700">{s.plan_nombre}</td>
                                        <td className="px-5 py-3.5">
                                            <StatBadge estado={s.estado} />
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-3.5 text-slate-700">{fmtCurrency(s.precio_pagado)}</td>
                                        <td className="whitespace-nowrap px-5 py-3.5 text-slate-500">{fmtDate(s.fecha_inicio)}</td>
                                        <td className="px-5 py-3.5">
                                            <button
                                                onClick={() => { setModalGestion(s); setNuevoEstado(""); setMotivoGestion("") }}
                                                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                                            >
                                                Gestionar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {!loading && total > PER_PAGE && (
                        <div className="px-5 pb-4">
                            <Pagination total={total} page={page} perPage={PER_PAGE} onPageChange={setPage} />
                        </div>
                    )}
                </div>
            )}

            {modalGestion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="font-bold text-slate-900">Gestionar suscripcion</h3>
                        <p className="text-sm text-slate-600">
                            <span className="font-medium">{modalGestion.nombre_completo}</span> - {modalGestion.plan_nombre}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            Estado actual: <StatBadge estado={modalGestion.estado} />
                        </div>
                        <select
                            value={nuevoEstado}
                            onChange={(e) => setNuevoEstado(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                        >
                            <option value="">Seleccionar nuevo estado...</option>
                            {ESTADOS_GESTIONABLES
                                .filter((estado) => estado.value !== modalGestion.estado)
                                .map((estado) => (
                                    <option key={estado.value} value={estado.value}>{estado.label}</option>
                                ))}
                        </select>
                        <textarea
                            rows={3}
                            placeholder="Motivo del cambio (opcional)..."
                            value={motivoGestion}
                            onChange={(e) => setMotivoGestion(e.target.value)}
                            className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => { setModalGestion(null); setNuevoEstado(""); setMotivoGestion("") }}
                                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={cambiarEstado}
                                disabled={!nuevoEstado || procesando}
                                className="rounded-xl bg-[#4C1D95] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3b1675] disabled:opacity-60"
                            >
                                {procesando ? "Procesando..." : "Confirmar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
