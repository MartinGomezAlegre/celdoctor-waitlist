"use client"

import { useState, useEffect } from "react"
import type { AdminSuscripcion, ToastType } from "../types"
import { API, authHeaders, fmtCurrency, fmtDate, ESTADO_BADGE } from "../lib"
import { TableSkeleton } from "./shared/Skeleton"
import { StatBadge } from "./shared/StatBadge"

interface Props {
    token: string
    addToast: (msg: string, type: ToastType) => void
}

export default function SectionSuscripciones({ token, addToast }: Props) {
    const [suscripciones, setSuscripciones] = useState<AdminSuscripcion[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [filtroEstado, setFiltroEstado] = useState("")
    const [buscar, setBuscar] = useState("")
    const [modalGestion, setModalGestion] = useState<AdminSuscripcion | null>(null)
    const [nuevoEstado, setNuevoEstado] = useState("")
    const [motivoGestion, setMotivoGestion] = useState("")
    const [procesando, setProcesando] = useState(false)

    useEffect(() => {
        setLoading(true)
        setError(false)
        fetch(`${API}/admin/suscripciones`, { headers: authHeaders(token) })
            .then((r) => r.json())
            .then((d: unknown) => setSuscripciones(Array.isArray(d) ? (d as AdminSuscripcion[]) : []))
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [token])

    async function cambiarEstado() {
        if (!modalGestion || !nuevoEstado) return
        setProcesando(true)
        try {
            const res = await fetch(`${API}/admin/suscripciones/${modalGestion.id}/estado`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify({ estado: nuevoEstado, motivo: motivoGestion }),
            })
            if (!res.ok) throw new Error()
            setSuscripciones((prev) =>
                prev.map((s) => (s.id === modalGestion.id ? { ...s, estado: nuevoEstado } : s))
            )
            addToast("Suscripción actualizada correctamente", "success")
        } catch {
            addToast("Error al actualizar la suscripción", "error")
        } finally {
            setProcesando(false)
            setModalGestion(null)
            setNuevoEstado("")
            setMotivoGestion("")
        }
    }

    const filtradas = suscripciones.filter((s) => {
        const q = buscar.toLowerCase()
        const coincideEstado = !filtroEstado || s.estado === filtroEstado
        return (
            coincideEstado &&
            (
                !q ||
                s.nombre_completo.toLowerCase().includes(q) ||
                s.email.toLowerCase().includes(q) ||
                s.plan_nombre.toLowerCase().includes(q)
            )
        )
    })

    const activas = suscripciones.filter((s) => s.estado === "activa").length
    const pendientes = suscripciones.filter((s) => s.estado === "pendiente_pago").length
    const canceladas = suscripciones.filter((s) => s.estado === "cancelada").length

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold text-slate-900">Suscripciones</h1>
                    {!loading && (
                        <>
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">{activas} Activas</span>
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-amber-700">{pendientes} Pendientes</span>
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">{canceladas} Canceladas</span>
                        </>
                    )}
                </div>
                <div className="flex gap-2 flex-wrap">
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o plan…"
                        value={buscar}
                        onChange={(e) => setBuscar(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] w-64"
                    />
                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]"
                    >
                        <option value="">Todos los estados</option>
                        <option value="activa">Activa</option>
                        <option value="pendiente_pago">Pendiente de pago</option>
                        <option value="cancelada">Cancelada</option>
                    </select>
                </div>
            </div>

            {error ? (
                <div className="bg-red-50 border border-red-100 rounded-2xl px-6 py-4 text-sm text-red-600">
                    Error al cargar suscripciones.
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                {["Usuario", "Email", "Plan", "Estado", "Precio", "Inicio", "Acciones"].map((h) => (
                                    <th key={h} className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <TableSkeleton rows={6} cols={7} />
                            ) : filtradas.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                                        No hay suscripciones.
                                    </td>
                                </tr>
                            ) : (
                                filtradas.map((s) => (
                                    <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-3.5 font-medium text-slate-900 whitespace-nowrap">{s.nombre_completo}</td>
                                        <td className="px-5 py-3.5 text-slate-600">{s.email}</td>
                                        <td className="px-5 py-3.5 text-slate-700">{s.plan_nombre}</td>
                                        <td className="px-5 py-3.5">
                                            <StatBadge estado={s.estado} />
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-700 whitespace-nowrap">{fmtCurrency(s.precio_pagado)}</td>
                                        <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{fmtDate(s.fecha_inicio)}</td>
                                        <td className="px-5 py-3.5">
                                            <button
                                                onClick={() => { setModalGestion(s); setNuevoEstado(""); setMotivoGestion("") }}
                                                className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                                            >
                                                Gestionar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {modalGestion && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full space-y-4">
                        <h3 className="font-bold text-slate-900">Gestionar suscripción</h3>
                        <p className="text-sm text-slate-600">
                            <span className="font-medium">{modalGestion.nombre_completo}</span> —{" "}
                            {modalGestion.plan_nombre}
                        </p>
                        <p className="text-xs text-slate-500">
                            Estado actual:{" "}
                            <span className={`font-semibold ${
                                ESTADO_BADGE[modalGestion.estado]?.includes("emerald") ? "text-emerald-700" :
                                ESTADO_BADGE[modalGestion.estado]?.includes("yellow") ? "text-amber-700" :
                                "text-red-700"
                            }`}>
                                {modalGestion.estado.replace(/_/g, " ")}
                            </span>
                        </p>
                        <select
                            value={nuevoEstado}
                            onChange={(e) => setNuevoEstado(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                        >
                            <option value="">Seleccionar nuevo estado…</option>
                            {modalGestion.estado !== "activa" && <option value="activa">✓ Activar</option>}
                            {modalGestion.estado !== "pendiente_pago" && <option value="pendiente_pago">⏳ Pendiente de pago</option>}
                            {modalGestion.estado !== "cancelada" && <option value="cancelada">✗ Cancelar</option>}
                        </select>
                        <textarea
                            rows={3}
                            placeholder="Motivo del cambio (opcional)…"
                            value={motivoGestion}
                            onChange={(e) => setMotivoGestion(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                        />
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => { setModalGestion(null); setNuevoEstado(""); setMotivoGestion("") }}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={cambiarEstado}
                                disabled={!nuevoEstado || procesando}
                                className="px-4 py-2 rounded-xl bg-[#4C1D95] text-white text-sm font-semibold hover:bg-[#3b1675] disabled:opacity-60"
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
