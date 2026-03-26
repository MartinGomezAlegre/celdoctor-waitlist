"use client"

import { useState, useEffect, useCallback } from "react"
import { ToggleLeft, ToggleRight, Plus, Tag } from "lucide-react"
import type { AdminPlan, Cupon, ToastType } from "../types"
import { API, authHeaders, fmtCurrency, fmtDate } from "../lib"
import { Skeleton } from "./shared/Skeleton"
import { ActiveDot } from "./shared/StatBadge"

type Tab = "planes" | "cupones"

interface Props {
    token: string
    addToast: (msg: string, type: ToastType) => void
}

// ─── Planes sub-section ───────────────────────────────────────────────────────

function SubPlanes({ token, addToast }: Props) {
    const [planes, setPlanes] = useState<AdminPlan[]>([])
    const [loading, setLoading] = useState(true)
    const [editPrecio, setEditPrecio] = useState<Record<number, string>>({})
    const [saving, setSaving] = useState<number | null>(null)
    const [confirmModal, setConfirmModal] = useState<{
        id: number
        campo: "activo" | "precio"
        valor: boolean | number
    } | null>(null)

    const fetchPlanes = useCallback(async () => {
        setLoading(true)
        try {
            const r = await fetch(`${API}/planes`)
            const d: unknown = await r.json()
            const lista = Array.isArray(d) ? (d as AdminPlan[]) : []
            setPlanes(lista)
            const precios: Record<number, string> = {}
            lista.forEach((p) => { precios[p.id] = String(p.precio_mensual) })
            setEditPrecio(precios)
        } catch {
            setPlanes([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchPlanes() }, [fetchPlanes])

    async function guardarCambio(id: number, activo: boolean, precio: number) {
        setSaving(id)
        try {
            await fetch(`${API}/admin/planes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify({ activo, precio_mensual: precio }),
            })
            await fetchPlanes()
            addToast("Plan actualizado correctamente", "success")
        } catch {
            addToast("Error al guardar el plan", "error")
        } finally {
            setSaving(null)
            setConfirmModal(null)
        }
    }

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48" />)}
            </div>
        )
    }

    if (planes.length === 0) {
        return <p className="text-slate-400 text-sm">No hay planes disponibles.</p>
    }

    const confirmPlan = confirmModal ? planes.find((p) => p.id === confirmModal.id) : null

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {planes.map((plan) => {
                    const precioEditable = editPrecio[plan.id] ?? String(plan.precio_mensual)
                    const precioNum = parseFloat(precioEditable)
                    const precioValido = !isNaN(precioNum) && precioNum > 0
                    return (
                        <div key={plan.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h3 className="font-bold text-slate-900">{plan.nombre}</h3>
                                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{plan.descripcion}</p>
                                </div>
                                <button
                                    onClick={() => setConfirmModal({ id: plan.id, campo: "activo", valor: !plan.activo })}
                                    className="shrink-0 mt-0.5"
                                >
                                    {plan.activo
                                        ? <ToggleRight size={28} className="text-emerald-500" />
                                        : <ToggleLeft size={28} className="text-slate-300" />}
                                </button>
                            </div>
                            {plan.suscriptores !== undefined && (
                                <p className="text-xs text-slate-500">
                                    <span className="font-semibold text-slate-700">{plan.suscriptores}</span> suscriptores
                                    {plan.revenue_mensual !== undefined && (
                                        <> · <span className="font-semibold text-slate-700">{fmtCurrency(plan.revenue_mensual)}</span>/mes</>
                                    )}
                                </p>
                            )}
                            <div>
                                <label className="text-xs font-medium text-slate-500 mb-1 block">Precio mensual (ARS)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        min={0}
                                        value={precioEditable}
                                        onChange={(e) => setEditPrecio((prev) => ({ ...prev, [plan.id]: e.target.value }))}
                                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]"
                                    />
                                    <button
                                        disabled={!precioValido || precioNum === plan.precio_mensual || saving === plan.id}
                                        onClick={() => setConfirmModal({ id: plan.id, campo: "precio", valor: precioNum })}
                                        className="px-3 py-2 bg-[#4C1D95] text-white rounded-xl text-xs font-semibold hover:bg-[#3b1675] disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {saving === plan.id ? "..." : "Guardar"}
                                    </button>
                                </div>
                            </div>
                            <ActiveDot activo={plan.activo} />
                        </div>
                    )
                })}
            </div>

            {confirmModal && confirmPlan && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full">
                        <p className="text-slate-900 font-semibold mb-6">
                            {confirmModal.campo === "activo"
                                ? `¿${confirmModal.valor ? "Activar" : "Desactivar"} el plan "${confirmPlan.nombre}"?`
                                : `¿Cambiar el precio de "${confirmPlan.nombre}" a ${fmtCurrency(confirmModal.valor as number)}?`}
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setConfirmModal(null)}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                Cancelar
                            </button>
                            <button
                                disabled={saving === confirmModal.id}
                                onClick={() => {
                                    const activo = confirmModal.campo === "activo" ? (confirmModal.valor as boolean) : confirmPlan.activo
                                    const precio = confirmModal.campo === "precio" ? (confirmModal.valor as number) : confirmPlan.precio_mensual
                                    guardarCambio(confirmPlan.id, activo, precio)
                                }}
                                className="px-4 py-2 rounded-xl bg-[#4C1D95] text-white text-sm font-semibold hover:bg-[#3b1675] disabled:opacity-60"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

// ─── Cupones sub-section ──────────────────────────────────────────────────────

function SubCupones({ token, addToast }: Props) {
    const [cupones, setCupones] = useState<Cupon[]>([])
    const [loading, setLoading] = useState(true)
    const [modalNuevo, setModalNuevo] = useState(false)
    const [guardando, setGuardando] = useState(false)
    const [form, setForm] = useState({
        codigo: "",
        descripcion: "",
        tipo_descuento: "porcentaje",
        valor: "",
        max_usos: "",
        valido_hasta: "",
        solo_nuevos: false,
    })

    const fetchCupones = useCallback(async () => {
        setLoading(true)
        try {
            const r = await fetch(`${API}/admin/cupones`, { headers: authHeaders(token) })
            const d: unknown = await r.json()
            setCupones(Array.isArray(d) ? (d as Cupon[]) : [])
        } catch {
            setCupones([])
        } finally {
            setLoading(false)
        }
    }, [token])

    useEffect(() => { fetchCupones() }, [fetchCupones])

    async function toggleActivo(cupon: Cupon) {
        try {
            const res = await fetch(`${API}/admin/cupones/${cupon.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify({ activo: !cupon.activo }),
            })
            if (!res.ok) throw new Error()
            setCupones((prev) =>
                prev.map((c) => (c.id === cupon.id ? { ...c, activo: !c.activo } : c))
            )
            addToast(`Cupón ${!cupon.activo ? "activado" : "desactivado"}`, "success")
        } catch {
            addToast("Error al actualizar el cupón", "error")
        }
    }

    async function crearCupon() {
        if (!form.codigo || !form.valor) return
        setGuardando(true)
        try {
            const res = await fetch(`${API}/admin/cupones`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify({
                    ...form,
                    valor: parseFloat(form.valor),
                    max_usos: form.max_usos ? parseInt(form.max_usos) : null,
                    valido_hasta: form.valido_hasta || null,
                }),
            })
            if (!res.ok) throw new Error()
            addToast("Cupón creado correctamente", "success")
            setModalNuevo(false)
            setForm({ codigo: "", descripcion: "", tipo_descuento: "porcentaje", valor: "", max_usos: "", valido_hasta: "", solo_nuevos: false })
            fetchCupones()
        } catch {
            addToast("Error al crear el cupón", "error")
        } finally {
            setGuardando(false)
        }
    }

    return (
        <>
            <div className="flex justify-end">
                <button
                    onClick={() => setModalNuevo(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#4C1D95] text-white rounded-xl text-sm font-semibold hover:bg-[#3b1675] transition-colors"
                >
                    <Plus size={14} /> Nuevo cupón
                </button>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
                </div>
            ) : cupones.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center text-slate-400 text-sm">
                    No hay cupones creados.
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                {["Código", "Descuento", "Usos", "Plan", "Válido hasta", "Solo nuevos", "Estado", ""].map((h) => (
                                    <th key={h} className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {cupones.map((c) => (
                                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <span className="inline-flex items-center gap-1.5 font-mono font-semibold text-slate-900">
                                            <Tag size={13} className="text-violet-500" />
                                            {c.codigo}
                                        </span>
                                        {c.descripcion && <p className="text-xs text-slate-400 mt-0.5">{c.descripcion}</p>}
                                    </td>
                                    <td className="px-5 py-3.5 font-semibold text-slate-700">
                                        {c.tipo_descuento === "porcentaje" ? `${c.valor}%` : fmtCurrency(c.valor)}
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-600">
                                        {c.usos}{c.max_usos ? ` / ${c.max_usos}` : ""}
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-600">{c.plan_nombre ?? "Todos"}</td>
                                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                                        {c.valido_hasta ? fmtDate(c.valido_hasta) : "Sin vencimiento"}
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-600">{c.solo_nuevos ? "Sí" : "No"}</td>
                                    <td className="px-5 py-3.5">
                                        <ActiveDot activo={c.activo} />
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <button
                                            onClick={() => toggleActivo(c)}
                                            className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                                        >
                                            {c.activo ? "Desactivar" : "Activar"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modalNuevo && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="font-bold text-slate-900 text-lg">Nuevo cupón</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Código *</label>
                                <input
                                    type="text"
                                    value={form.codigo}
                                    onChange={(e) => setForm((p) => ({ ...p, codigo: e.target.value.toUpperCase() }))}
                                    placeholder="PROMO20"
                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                                <input
                                    type="text"
                                    value={form.descripcion}
                                    onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
                                    placeholder="Descripción interna…"
                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de descuento</label>
                                    <select
                                        value={form.tipo_descuento}
                                        onChange={(e) => setForm((p) => ({ ...p, tipo_descuento: e.target.value }))}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                                    >
                                        <option value="porcentaje">Porcentaje (%)</option>
                                        <option value="fijo">Monto fijo (ARS)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Valor *</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={form.valor}
                                        onChange={(e) => setForm((p) => ({ ...p, valor: e.target.value }))}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Usos máximos</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={form.max_usos}
                                        onChange={(e) => setForm((p) => ({ ...p, max_usos: e.target.value }))}
                                        placeholder="Sin límite"
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Válido hasta</label>
                                    <input
                                        type="date"
                                        value={form.valido_hasta}
                                        onChange={(e) => setForm((p) => ({ ...p, valido_hasta: e.target.value }))}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                                    />
                                </div>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.solo_nuevos}
                                    onChange={(e) => setForm((p) => ({ ...p, solo_nuevos: e.target.checked }))}
                                    className="rounded border-slate-300 text-[#4C1D95] focus:ring-[#4C1D95]"
                                />
                                <span className="text-sm text-slate-700">Solo para usuarios nuevos</span>
                            </label>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex gap-3 justify-end">
                            <button
                                onClick={() => setModalNuevo(false)}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={crearCupon}
                                disabled={!form.codigo || !form.valor || guardando}
                                className="px-5 py-2 rounded-xl bg-[#4C1D95] text-white text-sm font-semibold hover:bg-[#3b1675] disabled:opacity-60"
                            >
                                {guardando ? "Creando..." : "Crear cupón"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SectionCatalogo({ token, addToast }: Props) {
    const [tab, setTab] = useState<Tab>("planes")

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Catálogo</h1>
                <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
                    {(["planes", "cupones"] as Tab[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                                tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            {t === "planes" ? "Planes" : "Cupones"}
                        </button>
                    ))}
                </div>
            </div>

            {tab === "planes" && <SubPlanes token={token} addToast={addToast} />}
            {tab === "cupones" && <SubCupones token={token} addToast={addToast} />}
        </div>
    )
}
