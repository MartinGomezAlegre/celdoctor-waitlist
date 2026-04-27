"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Pencil, Pill, Plus, ToggleLeft, ToggleRight } from "lucide-react"

import type { AdminMedicamento, ToastType } from "../../types"
import { API, authHeaders } from "../../lib"
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

type MedicamentoFormState = {
    nombre: string
    principio_activo: string
    presentacion: string
    laboratorio: string
    descripcion: string
    cobertura_resumen: string
    descuento_porcentaje: string
    keywords: string
    orden_display: string
    activo: boolean
}

const INITIAL_FORM: MedicamentoFormState = {
    nombre: "",
    principio_activo: "",
    presentacion: "",
    laboratorio: "",
    descripcion: "",
    cobertura_resumen: "",
    descuento_porcentaje: "",
    keywords: "",
    orden_display: "",
    activo: true,
}

function formFromMedicamento(medicamento: AdminMedicamento): MedicamentoFormState {
    return {
        nombre: medicamento.nombre ?? "",
        principio_activo: medicamento.principio_activo ?? "",
        presentacion: medicamento.presentacion ?? "",
        laboratorio: medicamento.laboratorio ?? "",
        descripcion: medicamento.descripcion ?? "",
        cobertura_resumen: medicamento.cobertura_resumen ?? "",
        descuento_porcentaje: medicamento.descuento_porcentaje ? String(medicamento.descuento_porcentaje) : "",
        keywords: medicamento.keywords ?? "",
        orden_display: medicamento.orden_display ? String(medicamento.orden_display) : "",
        activo: medicamento.activo,
    }
}

export function MedicamentosTab({ token, addToast, onCatalogChange }: Props) {
    const [medicamentos, setMedicamentos] = useState<AdminMedicamento[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState<AdminMedicamento | null>(null)
    const [form, setForm] = useState<MedicamentoFormState>(INITIAL_FORM)
    const [saving, setSaving] = useState(false)
    const [togglingId, setTogglingId] = useState<number | null>(null)

    const fetchMedicamentos = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API}${adminEndpoints.catalogoMedicamentos}`, { headers: authHeaders(token) })
            const data: unknown = await res.json().catch(() => [])
            setMedicamentos(Array.isArray(data) ? (data as AdminMedicamento[]) : [])
        } catch {
            setMedicamentos([])
        } finally {
            setLoading(false)
        }
    }, [token])

    useEffect(() => {
        void fetchMedicamentos()
    }, [fetchMedicamentos])

    const filteredMedicamentos = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return medicamentos
        return medicamentos.filter((medicamento) =>
            [
                medicamento.nombre,
                medicamento.principio_activo,
                medicamento.presentacion,
                medicamento.laboratorio,
                medicamento.keywords,
            ]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(query)),
        )
    }, [medicamentos, search])

    function resetForm() {
        setForm(INITIAL_FORM)
        setEditing(null)
    }

    function openCreateModal() {
        resetForm()
        setModalOpen(true)
    }

    function openEditModal(medicamento: AdminMedicamento) {
        setEditing(medicamento)
        setForm(formFromMedicamento(medicamento))
        setModalOpen(true)
    }

    async function saveMedicamento() {
        if (!form.nombre.trim()) {
            addToast("El medicamento necesita un nombre.", "warning")
            return
        }

        setSaving(true)
        try {
            const payload = {
                nombre: form.nombre.trim(),
                principio_activo: form.principio_activo.trim() || null,
                presentacion: form.presentacion.trim() || null,
                laboratorio: form.laboratorio.trim() || null,
                descripcion: form.descripcion.trim() || null,
                cobertura_resumen: form.cobertura_resumen.trim() || null,
                descuento_porcentaje: form.descuento_porcentaje.trim() ? Number(form.descuento_porcentaje) : null,
                keywords: form.keywords.trim() || null,
                orden_display: form.orden_display.trim() ? Number(form.orden_display) : null,
                activo: form.activo,
            }

            const res = await fetch(
                `${API}${editing ? adminEndpoints.catalogoMedicamento(editing.id) : adminEndpoints.catalogoMedicamentos}`,
                {
                    method: editing ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...authHeaders(token),
                    },
                    body: JSON.stringify(payload),
                },
            )

            if (!res.ok) {
                throw new Error(await getErrorMessage(res, "No pudimos guardar el medicamento"))
            }

            setModalOpen(false)
            resetForm()
            await fetchMedicamentos()
            await onCatalogChange()
            addToast(editing ? "Medicamento actualizado correctamente" : "Medicamento agregado correctamente", "success")
        } catch (error) {
            addToast(error instanceof Error ? error.message : "No pudimos guardar el medicamento", "error")
        } finally {
            setSaving(false)
        }
    }

    async function toggleMedicamento(medicamento: AdminMedicamento) {
        setTogglingId(medicamento.id)
        try {
            const res = await fetch(`${API}${adminEndpoints.catalogoMedicamento(medicamento.id)}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders(token),
                },
                body: JSON.stringify({ activo: !medicamento.activo }),
            })

            if (!res.ok) {
                throw new Error(await getErrorMessage(res, "No pudimos cambiar el estado del medicamento"))
            }

            await fetchMedicamentos()
            await onCatalogChange()
            addToast(!medicamento.activo ? "Medicamento activado" : "Medicamento desactivado", "success")
        } catch (error) {
            addToast(error instanceof Error ? error.message : "No pudimos cambiar el estado del medicamento", "error")
        } finally {
            setTogglingId(null)
        }
    }

    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-44" />
                ))}
            </div>
        )
    }

    return (
        <>
            <div className="space-y-5">
                <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Vademecum</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Carga y actualiza los medicamentos que se mostraran en Beneficios para que el usuario pueda buscar descuentos y cobertura.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4C1D95] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#4C1D95]/15 hover:bg-[#3b1675]"
                    >
                        <Plus size={16} />
                        Agregar medicamento
                    </button>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Buscar por nombre, principio activo o laboratorio"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20"
                    />
                </div>

                {filteredMedicamentos.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
                        No encontramos medicamentos con ese criterio.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                        {filteredMedicamentos.map((medicamento) => (
                            <article key={medicamento.id} className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5F0FF]">
                                            <Pill className="h-5 w-5 text-[#5B21B6]" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900">{medicamento.nombre}</h3>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {medicamento.principio_activo || "Principio activo sin cargar"}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => void toggleMedicamento(medicamento)}
                                        disabled={togglingId === medicamento.id}
                                        aria-label={medicamento.activo ? "Desactivar medicamento" : "Activar medicamento"}
                                    >
                                        {medicamento.activo ? (
                                            <ToggleRight size={28} className="text-emerald-500" />
                                        ) : (
                                            <ToggleLeft size={28} className="text-slate-300" />
                                        )}
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2 text-xs">
                                    {medicamento.presentacion && (
                                        <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-500">{medicamento.presentacion}</span>
                                    )}
                                    {medicamento.laboratorio && (
                                        <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-500">{medicamento.laboratorio}</span>
                                    )}
                                    {typeof medicamento.descuento_porcentaje === "number" && (
                                        <span className="rounded-full bg-[#F3ECFF] px-3 py-1 font-semibold text-[#5B21B6]">
                                            {medicamento.descuento_porcentaje}% OFF
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2 text-sm text-slate-600">
                                    {medicamento.descripcion && <p>{medicamento.descripcion}</p>}
                                    {medicamento.cobertura_resumen && (
                                        <p className="rounded-2xl bg-slate-50 px-3 py-2 text-slate-500">{medicamento.cobertura_resumen}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <ActiveDot activo={medicamento.activo} />
                                    <button
                                        type="button"
                                        onClick={() => openEditModal(medicamento)}
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
                title={editing ? `Editar medicamento: ${editing.nombre}` : "Agregar medicamento"}
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
                            onClick={() => void saveMedicamento()}
                            disabled={saving}
                            className="rounded-xl bg-[#4C1D95] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3b1675] disabled:opacity-50"
                        >
                            {saving ? "Guardando..." : editing ? "Guardar cambios" : "Agregar"}
                        </button>
                    </>
                )}
            >
                <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-1.5 text-sm text-slate-600">
                        <span className="font-medium text-slate-700">Nombre</span>
                        <input value={form.nombre} onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20" />
                    </label>
                    <label className="space-y-1.5 text-sm text-slate-600">
                        <span className="font-medium text-slate-700">Principio activo</span>
                        <input value={form.principio_activo} onChange={(event) => setForm((current) => ({ ...current, principio_activo: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20" />
                    </label>
                    <label className="space-y-1.5 text-sm text-slate-600">
                        <span className="font-medium text-slate-700">Presentacion</span>
                        <input value={form.presentacion} onChange={(event) => setForm((current) => ({ ...current, presentacion: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20" />
                    </label>
                    <label className="space-y-1.5 text-sm text-slate-600">
                        <span className="font-medium text-slate-700">Laboratorio</span>
                        <input value={form.laboratorio} onChange={(event) => setForm((current) => ({ ...current, laboratorio: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20" />
                    </label>
                    <label className="space-y-1.5 text-sm text-slate-600 md:col-span-2">
                        <span className="font-medium text-slate-700">Descripcion</span>
                        <textarea value={form.descripcion} onChange={(event) => setForm((current) => ({ ...current, descripcion: event.target.value }))} rows={3} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20" />
                    </label>
                    <label className="space-y-1.5 text-sm text-slate-600 md:col-span-2">
                        <span className="font-medium text-slate-700">Cobertura / descuento</span>
                        <input value={form.cobertura_resumen} onChange={(event) => setForm((current) => ({ ...current, cobertura_resumen: event.target.value }))} placeholder="Hasta 40% de descuento en farmacias adheridas." className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20" />
                    </label>
                    <label className="space-y-1.5 text-sm text-slate-600">
                        <span className="font-medium text-slate-700">Descuento %</span>
                        <input type="number" min={0} max={100} value={form.descuento_porcentaje} onChange={(event) => setForm((current) => ({ ...current, descuento_porcentaje: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20" />
                    </label>
                    <label className="space-y-1.5 text-sm text-slate-600">
                        <span className="font-medium text-slate-700">Orden</span>
                        <input type="number" min={0} value={form.orden_display} onChange={(event) => setForm((current) => ({ ...current, orden_display: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20" />
                    </label>
                    <label className="space-y-1.5 text-sm text-slate-600 md:col-span-2">
                        <span className="font-medium text-slate-700">Keywords</span>
                        <input value={form.keywords} onChange={(event) => setForm((current) => ({ ...current, keywords: event.target.value }))} placeholder="dolor fiebre analgesico..." className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20" />
                    </label>
                    <label className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 md:col-span-2">
                        <input type="checkbox" checked={form.activo} onChange={(event) => setForm((current) => ({ ...current, activo: event.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-[#4C1D95] focus:ring-[#4C1D95]" />
                        Medicamento activo y visible para los clientes
                    </label>
                </div>
            </Modal>
        </>
    )
}
