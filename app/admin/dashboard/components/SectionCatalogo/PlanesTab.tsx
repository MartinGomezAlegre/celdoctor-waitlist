"use client"

import { useCallback, useEffect, useState } from "react"
import { ToggleLeft, ToggleRight } from "lucide-react"

import type { AdminPlan, ToastType } from "../../types"
import { API, authHeaders, fmtCurrency } from "../../lib"
import { adminEndpoints } from "../../admin-endpoints"
import { ConfirmModal } from "../shared/Modal"
import { Skeleton } from "../shared/Skeleton"
import { ActiveDot } from "../shared/StatBadge"
import { buildPlanPriceMap, getErrorMessage } from "./utils"

interface Props {
    token: string
    addToast: (msg: string, type: ToastType) => void
    onCatalogChange: () => Promise<void>
}

type PlanConfirmState = {
    id: number
    campo: "activo" | "precio"
    valor: boolean | number
} | null

export function PlanesTab({ token, addToast, onCatalogChange }: Props) {
    const [planes, setPlanes] = useState<AdminPlan[]>([])
    const [loading, setLoading] = useState(true)
    const [editPrecio, setEditPrecio] = useState<Record<number, string>>({})
    const [saving, setSaving] = useState<number | null>(null)
    const [confirmModal, setConfirmModal] = useState<PlanConfirmState>(null)

    const fetchPlanes = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API}${adminEndpoints.catalogoPlanes}`, { headers: authHeaders(token) })
            const data: unknown = await res.json()
            const lista = Array.isArray(data) ? (data as AdminPlan[]) : []
            setPlanes(lista)
            setEditPrecio(buildPlanPriceMap(lista))
        } catch {
            setPlanes([])
        } finally {
            setLoading(false)
        }
    }, [token])

    useEffect(() => {
        void fetchPlanes()
    }, [fetchPlanes])

    async function guardarCambio(id: number, activo: boolean, precio: number) {
        setSaving(id)
        try {
            const res = await fetch(`${API}${adminEndpoints.catalogoPlan(id)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify({ activo, precio_mensual: precio }),
            })

            if (!res.ok) {
                throw new Error(await getErrorMessage(res, "Error al guardar el plan"))
            }

            await fetchPlanes()
            await onCatalogChange()
            addToast("Plan actualizado correctamente", "success")
        } catch (error) {
            addToast(error instanceof Error ? error.message : "Error al guardar el plan", "error")
        } finally {
            setSaving(null)
            setConfirmModal(null)
        }
    }

    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-48" />
                ))}
            </div>
        )
    }

    if (planes.length === 0) {
        return <p className="text-sm text-slate-400">No hay planes disponibles.</p>
    }

    const confirmPlan = confirmModal ? planes.find((plan) => plan.id === confirmModal.id) : null

    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {planes.map((plan) => {
                    const precioEditable = editPrecio[plan.id] ?? String(plan.precio_mensual)
                    const precioNum = parseFloat(precioEditable)
                    const precioValido = !Number.isNaN(precioNum) && precioNum > 0

                    return (
                        <div key={plan.id} className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h3 className="font-bold text-slate-900">{plan.nombre}</h3>
                                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">{plan.descripcion}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setConfirmModal({ id: plan.id, campo: "activo", valor: !plan.activo })}
                                    className="mt-0.5 shrink-0"
                                    aria-label={plan.activo ? "Desactivar plan" : "Activar plan"}
                                >
                                    {plan.activo ? (
                                        <ToggleRight size={28} className="text-emerald-500" />
                                    ) : (
                                        <ToggleLeft size={28} className="text-slate-300" />
                                    )}
                                </button>
                            </div>

                            {plan.suscriptores !== undefined && (
                                <p className="text-xs text-slate-500">
                                    <span className="font-semibold text-slate-700">{plan.suscriptores}</span> suscriptores
                                    {plan.revenue_mensual !== undefined && (
                                        <>
                                            {" - "}
                                            <span className="font-semibold text-slate-700">{fmtCurrency(plan.revenue_mensual)}</span>/mes
                                        </>
                                    )}
                                </p>
                            )}

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-500">Precio mensual (ARS)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        min={0}
                                        value={precioEditable}
                                        onChange={(event) => setEditPrecio((prev) => ({ ...prev, [plan.id]: event.target.value }))}
                                        className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                                    />
                                    <button
                                        type="button"
                                        disabled={!precioValido || precioNum === plan.precio_mensual || saving === plan.id}
                                        onClick={() => setConfirmModal({ id: plan.id, campo: "precio", valor: precioNum })}
                                        className="rounded-xl bg-[#4C1D95] px-3 py-2 text-xs font-semibold text-white hover:bg-[#3b1675] disabled:cursor-not-allowed disabled:opacity-40"
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

            {confirmPlan && confirmModal && (
                <ConfirmModal
                    open
                    onClose={() => setConfirmModal(null)}
                    onConfirm={() => {
                        const activo = confirmModal.campo === "activo" ? (confirmModal.valor as boolean) : confirmPlan.activo
                        const precio = confirmModal.campo === "precio" ? (confirmModal.valor as number) : confirmPlan.precio_mensual
                        void guardarCambio(confirmPlan.id, activo, precio)
                    }}
                    title={
                        confirmModal.campo === "activo"
                            ? `${confirmModal.valor ? "Activar" : "Desactivar"} el plan "${confirmPlan.nombre}"?`
                            : `Cambiar el precio de "${confirmPlan.nombre}" a ${fmtCurrency(confirmModal.valor as number)}?`
                    }
                    loading={saving === confirmModal.id}
                />
            )}
        </>
    )
}
