"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Pencil, Plus, ToggleLeft, ToggleRight } from "lucide-react"

import type { AdminPlan, AdminService, ToastType } from "../../types"
import { API, authHeaders, fmtCurrency } from "../../lib"
import { adminEndpoints } from "../../admin-endpoints"
import { Modal } from "../shared/Modal"
import { Skeleton } from "../shared/Skeleton"
import { ActiveDot } from "../shared/StatBadge"
import { getErrorMessage } from "./utils"

interface Props {
    token: string
    addToast: (msg: string, type: ToastType) => void
    onCatalogChange: () => Promise<void>
}

type PlanFormState = {
    nombre: string
    descripcion: string
    tipo: "b2c" | "b2b" | "convenio"
    precio_mensual: string
    precio_anual: string
    max_beneficiarios: string
    badge: string
    activo: boolean
    service_ids: number[]
}

const PLAN_FORM_INITIAL: PlanFormState = {
    nombre: "",
    descripcion: "",
    tipo: "b2c",
    precio_mensual: "",
    precio_anual: "",
    max_beneficiarios: "",
    badge: "",
    activo: true,
    service_ids: [],
}

function normalizePlanType(tipo?: string | null): "b2c" | "b2b" | "convenio" {
    const value = (tipo ?? "").toLowerCase()
    if (value.includes("convenio")) return "convenio"
    if (value.includes("b2b") || value.includes("empresa") || value.includes("corporativo")) return "b2b"
    return "b2c"
}

function buildFormFromPlan(plan: AdminPlan): PlanFormState {
    return {
        nombre: plan.nombre ?? "",
        descripcion: plan.descripcion ?? "",
        tipo: normalizePlanType(plan.tipo),
        precio_mensual: String(plan.precio_mensual ?? ""),
        precio_anual: plan.precio_anual ? String(plan.precio_anual) : "",
        max_beneficiarios: plan.max_beneficiarios ? String(plan.max_beneficiarios) : "",
        badge: plan.badge ?? "",
        activo: plan.activo,
        service_ids: plan.service_ids ?? plan.services?.map((service) => service.id) ?? [],
    }
}

export function PlanesTab({ token, addToast, onCatalogChange }: Props) {
    const [planes, setPlanes] = useState<AdminPlan[]>([])
    const [services, setServices] = useState<AdminService[]>([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingPlan, setEditingPlan] = useState<AdminPlan | null>(null)
    const [form, setForm] = useState<PlanFormState>(PLAN_FORM_INITIAL)
    const [saving, setSaving] = useState(false)
    const [togglingPlanId, setTogglingPlanId] = useState<number | null>(null)

    const fetchCatalog = useCallback(async () => {
        setLoading(true)
        try {
            const [planesRes, servicesRes] = await Promise.all([
                fetch(`${API}${adminEndpoints.catalogoPlanes}`, { headers: authHeaders(token) }),
                fetch(`${API}${adminEndpoints.catalogoServices}`, { headers: authHeaders(token) }),
            ])

            const planesData: unknown = await planesRes.json().catch(() => [])
            const servicesData: unknown = await servicesRes.json().catch(() => [])

            setPlanes(Array.isArray(planesData) ? (planesData as AdminPlan[]) : [])
            setServices(Array.isArray(servicesData) ? (servicesData as AdminService[]) : [])
        } catch {
            setPlanes([])
            setServices([])
        } finally {
            setLoading(false)
        }
    }, [token])

    useEffect(() => {
        void fetchCatalog()
    }, [fetchCatalog])

    const activeServices = useMemo(
        () => services.filter((service) => service.activo),
        [services],
    )

    function resetForm() {
        setForm(PLAN_FORM_INITIAL)
        setEditingPlan(null)
    }

    function openCreateModal() {
        resetForm()
        setModalOpen(true)
    }

    function openEditModal(plan: AdminPlan) {
        setEditingPlan(plan)
        setForm(buildFormFromPlan(plan))
        setModalOpen(true)
    }

    function toggleService(serviceId: number) {
        setForm((current) => ({
            ...current,
            service_ids: current.service_ids.includes(serviceId)
                ? current.service_ids.filter((id) => id !== serviceId)
                : [...current.service_ids, serviceId],
        }))
    }

    async function savePlan() {
        if (!form.nombre.trim()) {
            addToast("El plan necesita un nombre.", "warning")
            return
        }

        const precioMensual = Number(form.precio_mensual)
        if (!Number.isFinite(precioMensual) || precioMensual <= 0) {
            addToast("Cargá un precio mensual válido.", "warning")
            return
        }

        if (form.service_ids.length === 0) {
            addToast("Seleccioná al menos un servicio para el plan.", "warning")
            return
        }

        setSaving(true)
        try {
            const payload = {
                nombre: form.nombre.trim(),
                descripcion: form.descripcion.trim(),
                tipo: form.tipo,
                precio_mensual: precioMensual,
                precio_anual: form.precio_anual.trim() ? Number(form.precio_anual) : null,
                max_beneficiarios: form.max_beneficiarios.trim() ? Number(form.max_beneficiarios) : null,
                badge: form.badge.trim() || null,
                activo: form.activo,
                service_ids: form.service_ids,
            }

            const res = await fetch(
                `${API}${editingPlan ? adminEndpoints.catalogoPlan(editingPlan.id) : adminEndpoints.catalogoPlanes}`,
                {
                    method: editingPlan ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...authHeaders(token),
                    },
                    body: JSON.stringify(payload),
                },
            )

            if (!res.ok) {
                throw new Error(await getErrorMessage(res, "No pudimos guardar el plan"))
            }

            setModalOpen(false)
            resetForm()
            await fetchCatalog()
            await onCatalogChange()
            addToast(editingPlan ? "Plan actualizado correctamente" : "Plan creado correctamente", "success")
        } catch (error) {
            addToast(error instanceof Error ? error.message : "No pudimos guardar el plan", "error")
        } finally {
            setSaving(false)
        }
    }

    async function togglePlanStatus(plan: AdminPlan) {
        setTogglingPlanId(plan.id)
        try {
            const res = await fetch(`${API}${adminEndpoints.catalogoPlan(plan.id)}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders(token),
                },
                body: JSON.stringify({ activo: !plan.activo }),
            })

            if (!res.ok) {
                throw new Error(await getErrorMessage(res, "No pudimos cambiar el estado del plan"))
            }

            await fetchCatalog()
            await onCatalogChange()
            addToast(
                !plan.activo ? "Plan activado correctamente" : "Plan desactivado correctamente",
                "success",
            )
        } catch (error) {
            addToast(error instanceof Error ? error.message : "No pudimos cambiar el estado del plan", "error")
        } finally {
            setTogglingPlanId(null)
        }
    }

    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-56" />
                ))}
            </div>
        )
    }

    return (
        <>
            <div className="space-y-5">
                <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Constructor de planes</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Armá planes B2C, B2B o convenios combinando libremente los servicios del catálogo.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4C1D95] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#4C1D95]/15 hover:bg-[#3b1675]"
                    >
                        <Plus size={16} />
                        Crear plan
                    </button>
                </div>

                {planes.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
                        Todavía no hay planes configurados.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {planes.map((plan) => (
                            <article key={plan.id} className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-lg font-bold text-slate-900">{plan.nombre}</h3>
                                            {plan.badge && (
                                                <span className="rounded-full bg-[#F3ECFF] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6D28D9]">
                                                    {plan.badge}
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1 text-sm text-slate-500">{plan.descripcion}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => void togglePlanStatus(plan)}
                                        className="shrink-0"
                                        aria-label={plan.activo ? "Desactivar plan" : "Activar plan"}
                                        disabled={togglingPlanId === plan.id}
                                    >
                                        {plan.activo ? (
                                            <ToggleRight size={28} className="text-emerald-500" />
                                        ) : (
                                            <ToggleLeft size={28} className="text-slate-300" />
                                        )}
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 text-sm">
                                    <div>
                                        <p className="text-slate-500">Tipo</p>
                                        <p className="font-semibold uppercase tracking-wide text-slate-900">{normalizePlanType(plan.tipo)}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Precio mensual</p>
                                        <p className="font-semibold text-slate-900">{fmtCurrency(plan.precio_mensual)}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Beneficiarios</p>
                                        <p className="font-semibold text-slate-900">{plan.max_beneficiarios ?? 1}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Suscriptores</p>
                                        <p className="font-semibold text-slate-900">{plan.suscriptores ?? 0}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Servicios incluidos</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(plan.services ?? []).map((service) => (
                                            <span
                                                key={service.id}
                                                className="rounded-full border border-[#E9D8FD] bg-[#F8F4FF] px-3 py-1 text-xs font-medium text-[#5B21B6]"
                                            >
                                                {service.nombre}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <ActiveDot activo={plan.activo} />
                                    <button
                                        type="button"
                                        onClick={() => openEditModal(plan)}
                                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                    >
                                        <Pencil size={14} />
                                        Editar
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false)
                    resetForm()
                }}
                title={editingPlan ? `Editar plan: ${editingPlan.nombre}` : "Crear nuevo plan"}
                size="lg"
                footer={(
                    <>
                        <button
                            type="button"
                            onClick={() => {
                                setModalOpen(false)
                                resetForm()
                            }}
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={() => void savePlan()}
                            disabled={saving}
                            className="rounded-xl bg-[#4C1D95] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3b1675] disabled:opacity-50"
                        >
                            {saving ? "Guardando..." : editingPlan ? "Guardar cambios" : "Crear plan"}
                        </button>
                    </>
                )}
            >
                <div className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-1.5 text-sm text-slate-600">
                            <span className="font-medium text-slate-700">Nombre del plan</span>
                            <input
                                type="text"
                                value={form.nombre}
                                onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20"
                                placeholder="Plan Integral"
                            />
                        </label>

                        <label className="space-y-1.5 text-sm text-slate-600">
                            <span className="font-medium text-slate-700">Tipo</span>
                            <select
                                value={form.tipo}
                                onChange={(event) => setForm((current) => ({ ...current, tipo: event.target.value as PlanFormState["tipo"] }))}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20"
                            >
                                <option value="b2c">B2C</option>
                                <option value="b2b">B2B</option>
                                <option value="convenio">Convenio</option>
                            </select>
                        </label>
                    </div>

                    <label className="space-y-1.5 text-sm text-slate-600">
                        <span className="font-medium text-slate-700">Descripcion</span>
                        <textarea
                            value={form.descripcion}
                            onChange={(event) => setForm((current) => ({ ...current, descripcion: event.target.value }))}
                            rows={3}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20"
                            placeholder="Describe el enfoque del plan y para quién está pensado."
                        />
                    </label>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <label className="space-y-1.5 text-sm text-slate-600">
                            <span className="font-medium text-slate-700">Precio mensual</span>
                            <input
                                type="number"
                                min={0}
                                value={form.precio_mensual}
                                onChange={(event) => setForm((current) => ({ ...current, precio_mensual: event.target.value }))}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20"
                                placeholder="9500"
                            />
                        </label>

                        <label className="space-y-1.5 text-sm text-slate-600">
                            <span className="font-medium text-slate-700">Precio anual</span>
                            <input
                                type="number"
                                min={0}
                                value={form.precio_anual}
                                onChange={(event) => setForm((current) => ({ ...current, precio_anual: event.target.value }))}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20"
                                placeholder="114000"
                            />
                        </label>

                        <label className="space-y-1.5 text-sm text-slate-600">
                            <span className="font-medium text-slate-700">Beneficiarios max.</span>
                            <input
                                type="number"
                                min={1}
                                value={form.max_beneficiarios}
                                onChange={(event) => setForm((current) => ({ ...current, max_beneficiarios: event.target.value }))}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20"
                                placeholder="1"
                            />
                        </label>

                        <label className="space-y-1.5 text-sm text-slate-600">
                            <span className="font-medium text-slate-700">Badge</span>
                            <input
                                type="text"
                                value={form.badge}
                                onChange={(event) => setForm((current) => ({ ...current, badge: event.target.value }))}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20"
                                placeholder="Mas elegido"
                            />
                        </label>
                    </div>

                    <label className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            checked={form.activo}
                            onChange={(event) => setForm((current) => ({ ...current, activo: event.target.checked }))}
                            className="h-4 w-4 rounded border-slate-300 text-[#4C1D95] focus:ring-[#4C1D95]"
                        />
                        Plan activo y visible para nuevas contrataciones
                    </label>

                    <div className="space-y-3">
                        <div>
                            <p className="text-sm font-medium text-slate-700">Servicios incluidos</p>
                            <p className="mt-1 text-xs text-slate-500">
                                Seleccioná qué beneficios forman parte del plan.
                            </p>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            {activeServices.map((service) => {
                                const checked = form.service_ids.includes(service.id)
                                return (
                                    <label
                                        key={service.id}
                                        className={`rounded-2xl border p-4 transition-colors ${
                                            checked
                                                ? "border-[#C4B5FD] bg-[#F8F4FF]"
                                                : "border-slate-200 bg-white hover:border-slate-300"
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => toggleService(service.id)}
                                                className="mt-1 h-4 w-4 rounded border-slate-300 text-[#4C1D95] focus:ring-[#4C1D95]"
                                            />
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="font-semibold text-slate-900">{service.nombre}</p>
                                                    <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-500">
                                                        {service.proveedor}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-sm text-slate-500">{service.descripcion}</p>
                                            </div>
                                        </div>
                                    </label>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}
