"use client"

import { useCallback, useEffect, useState } from "react"
import { Plus, Tag } from "lucide-react"

import type { Cupon, ToastType } from "../../types"
import { API, authHeaders, fmtCurrency, fmtDate } from "../../lib"
import { adminEndpoints } from "../../admin-endpoints"
import { Modal } from "../shared/Modal"
import { Skeleton } from "../shared/Skeleton"
import { ActiveDot } from "../shared/StatBadge"
import { CuponFormState, getCuponUsage, getErrorMessage, INITIAL_CUPON_FORM } from "./utils"

interface Props {
    token: string
    addToast: (msg: string, type: ToastType) => void
    onCatalogChange: () => Promise<void>
}

export function CuponesTab({ token, addToast, onCatalogChange }: Props) {
    const [cupones, setCupones] = useState<Cupon[]>([])
    const [loading, setLoading] = useState(true)
    const [modalNuevo, setModalNuevo] = useState(false)
    const [guardando, setGuardando] = useState(false)
    const [form, setForm] = useState<CuponFormState>(INITIAL_CUPON_FORM)

    const fetchCupones = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API}${adminEndpoints.cupones}`, { headers: authHeaders(token) })
            const data: unknown = await res.json()
            setCupones(Array.isArray(data) ? (data as Cupon[]) : [])
        } catch {
            setCupones([])
        } finally {
            setLoading(false)
        }
    }, [token])

    useEffect(() => {
        void fetchCupones()
    }, [fetchCupones])

    async function toggleActivo(cupon: Cupon) {
        try {
            const res = await fetch(`${API}${adminEndpoints.cuponEstado(cupon.id)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify({ activo: !cupon.activo }),
            })

            if (!res.ok) {
                throw new Error(await getErrorMessage(res, "Error al actualizar el cupon"))
            }

            setCupones((prev) =>
                prev.map((current) => (current.id === cupon.id ? { ...current, activo: !current.activo } : current))
            )
            await onCatalogChange()
            addToast(`Cupon ${!cupon.activo ? "activado" : "desactivado"}`, "success")
        } catch (error) {
            addToast(error instanceof Error ? error.message : "Error al actualizar el cupon", "error")
        }
    }

    async function crearCupon() {
        if (!form.codigo.trim() || !form.valor.trim()) {
            return
        }

        setGuardando(true)
        try {
            const res = await fetch(`${API}${adminEndpoints.cupones}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify({
                    codigo: form.codigo.trim().toUpperCase(),
                    descripcion: form.descripcion.trim() || null,
                    tipo_descuento: form.tipo_descuento,
                    valor: parseFloat(form.valor),
                    max_usos: form.max_usos ? parseInt(form.max_usos, 10) : null,
                    valido_desde: new Date().toISOString().slice(0, 10),
                    valido_hasta: form.valido_hasta || null,
                    solo_nuevos_usuarios: form.solo_nuevos,
                }),
            })

            if (!res.ok) {
                throw new Error(await getErrorMessage(res, "Error al crear el cupon"))
            }

            addToast("Cupon creado correctamente", "success")
            setModalNuevo(false)
            setForm(INITIAL_CUPON_FORM)
            await fetchCupones()
            await onCatalogChange()
        } catch (error) {
            addToast(error instanceof Error ? error.message : "Error al crear el cupon", "error")
        } finally {
            setGuardando(false)
        }
    }

    const canSubmit = Boolean(form.codigo.trim() && form.valor.trim())

    return (
        <>
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => setModalNuevo(true)}
                    className="flex items-center gap-2 rounded-xl bg-[#4C1D95] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3b1675]"
                >
                    <Plus size={14} /> Nuevo cupon
                </button>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton key={index} className="h-16" />
                    ))}
                </div>
            ) : cupones.length === 0 ? (
                <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-400 shadow-sm">
                    No hay cupones creados.
                </div>
            ) : (
                <div className="overflow-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                {["Codigo", "Descuento", "Usos", "Plan", "Valido hasta", "Solo nuevos", "Estado", ""].map((header) => (
                                    <th key={header} className="whitespace-nowrap px-5 py-3.5 text-left font-semibold text-slate-600">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {cupones.map((cupon) => (
                                <tr key={cupon.id} className="border-b border-slate-50 transition-colors hover:bg-slate-50/50">
                                    <td className="px-5 py-3.5">
                                        <span className="inline-flex items-center gap-1.5 font-mono font-semibold text-slate-900">
                                            <Tag size={13} className="text-violet-500" />
                                            {cupon.codigo}
                                        </span>
                                        {cupon.descripcion && <p className="mt-0.5 text-xs text-slate-400">{cupon.descripcion}</p>}
                                    </td>
                                    <td className="px-5 py-3.5 font-semibold text-slate-700">
                                        {cupon.tipo_descuento === "porcentaje" ? `${cupon.valor}%` : fmtCurrency(cupon.valor)}
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-600">
                                        {getCuponUsage(cupon)}
                                        {cupon.max_usos ? ` / ${cupon.max_usos}` : ""}
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-600">{cupon.plan_nombre ?? "Todos"}</td>
                                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-500">
                                        {cupon.valido_hasta ? fmtDate(cupon.valido_hasta) : "Sin vencimiento"}
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-600">{cupon.solo_nuevos ? "Si" : "No"}</td>
                                    <td className="px-5 py-3.5">
                                        <ActiveDot activo={cupon.activo} />
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <button
                                            type="button"
                                            onClick={() => void toggleActivo(cupon)}
                                            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                                        >
                                            {cupon.activo ? "Desactivar" : "Activar"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal
                open={modalNuevo}
                onClose={() => setModalNuevo(false)}
                title="Nuevo cupon"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setModalNuevo(false)}
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={() => void crearCupon()}
                            disabled={!canSubmit || guardando}
                            className="rounded-xl bg-[#4C1D95] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3b1675] disabled:opacity-60"
                        >
                            {guardando ? "Creando..." : "Crear cupon"}
                        </button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Codigo *</label>
                        <input
                            type="text"
                            value={form.codigo}
                            onChange={(event) => setForm((prev) => ({ ...prev, codigo: event.target.value.toUpperCase() }))}
                            placeholder="PROMO20"
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Descripcion</label>
                        <input
                            type="text"
                            value={form.descripcion}
                            onChange={(event) => setForm((prev) => ({ ...prev, descripcion: event.target.value }))}
                            placeholder="Descripcion interna..."
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Tipo de descuento</label>
                            <select
                                value={form.tipo_descuento}
                                onChange={(event) => setForm((prev) => ({ ...prev, tipo_descuento: event.target.value }))}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            >
                                <option value="porcentaje">Porcentaje (%)</option>
                                <option value="fijo">Monto fijo (ARS)</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Valor *</label>
                            <input
                                type="number"
                                min={0}
                                value={form.valor}
                                onChange={(event) => setForm((prev) => ({ ...prev, valor: event.target.value }))}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Usos maximos</label>
                            <input
                                type="number"
                                min={1}
                                value={form.max_usos}
                                onChange={(event) => setForm((prev) => ({ ...prev, max_usos: event.target.value }))}
                                placeholder="Sin limite"
                                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Valido hasta</label>
                            <input
                                type="date"
                                value={form.valido_hasta}
                                onChange={(event) => setForm((prev) => ({ ...prev, valido_hasta: event.target.value }))}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            />
                        </div>
                    </div>

                    <label className="flex cursor-pointer items-center gap-2">
                        <input
                            type="checkbox"
                            checked={form.solo_nuevos}
                            onChange={(event) => setForm((prev) => ({ ...prev, solo_nuevos: event.target.checked }))}
                            className="rounded border-slate-300 text-[#4C1D95] focus:ring-[#4C1D95]"
                        />
                        <span className="text-sm text-slate-700">Solo para usuarios nuevos</span>
                    </label>
                </div>
            </Modal>
        </>
    )
}
