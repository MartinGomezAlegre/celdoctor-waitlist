"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { MapPin, Pencil, Plus, ToggleLeft, ToggleRight } from "lucide-react"

import type { AdminFarmacia, ToastType } from "../../types"
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

type FarmaciaFormState = {
    nombre: string
    direccion: string
    localidad: string
    provincia: string
    telefono: string
    horario: string
    estado_atencion: string
    distancia_km: string
    descuento_porcentaje: string
    maps_url: string
    descripcion: string
    orden_display: string
    activo: boolean
}

const INITIAL_FORM: FarmaciaFormState = {
    nombre: "",
    direccion: "",
    localidad: "",
    provincia: "",
    telefono: "",
    horario: "",
    estado_atencion: "",
    distancia_km: "",
    descuento_porcentaje: "",
    maps_url: "",
    descripcion: "",
    orden_display: "",
    activo: true,
}

function formFromFarmacia(farmacia: AdminFarmacia): FarmaciaFormState {
    return {
        nombre: farmacia.nombre ?? "",
        direccion: farmacia.direccion ?? "",
        localidad: farmacia.localidad ?? "",
        provincia: farmacia.provincia ?? "",
        telefono: farmacia.telefono ?? "",
        horario: farmacia.horario ?? "",
        estado_atencion: farmacia.estado_atencion ?? "",
        distancia_km: typeof farmacia.distancia_km === "number" ? String(farmacia.distancia_km) : "",
        descuento_porcentaje: typeof farmacia.descuento_porcentaje === "number" ? String(farmacia.descuento_porcentaje) : "",
        maps_url: farmacia.maps_url ?? "",
        descripcion: farmacia.descripcion ?? "",
        orden_display: farmacia.orden_display ? String(farmacia.orden_display) : "",
        activo: farmacia.activo,
    }
}

export function FarmaciasTab({ token, addToast, onCatalogChange }: Props) {
    const [farmacias, setFarmacias] = useState<AdminFarmacia[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState<AdminFarmacia | null>(null)
    const [form, setForm] = useState<FarmaciaFormState>(INITIAL_FORM)
    const [saving, setSaving] = useState(false)
    const [togglingId, setTogglingId] = useState<number | null>(null)

    const fetchFarmacias = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API}${adminEndpoints.catalogoFarmacias}`, { headers: authHeaders(token) })
            const data: unknown = await res.json().catch(() => [])
            setFarmacias(Array.isArray(data) ? (data as AdminFarmacia[]) : [])
        } catch {
            setFarmacias([])
        } finally {
            setLoading(false)
        }
    }, [token])

    useEffect(() => {
        void fetchFarmacias()
    }, [fetchFarmacias])

    const filteredFarmacias = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return farmacias
        return farmacias.filter((farmacia) =>
            [
                farmacia.nombre,
                farmacia.direccion,
                farmacia.localidad,
                farmacia.provincia,
                farmacia.descripcion,
            ]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(query)),
        )
    }, [farmacias, search])

    function resetForm() {
        setForm(INITIAL_FORM)
        setEditing(null)
    }

    function openCreateModal() {
        resetForm()
        setModalOpen(true)
    }

    function openEditModal(farmacia: AdminFarmacia) {
        setEditing(farmacia)
        setForm(formFromFarmacia(farmacia))
        setModalOpen(true)
    }

    async function saveFarmacia() {
        if (!form.nombre.trim() || !form.direccion.trim()) {
            addToast("La farmacia necesita al menos nombre y direccion.", "warning")
            return
        }

        setSaving(true)
        try {
            const payload = {
                nombre: form.nombre.trim(),
                direccion: form.direccion.trim(),
                localidad: form.localidad.trim() || null,
                provincia: form.provincia.trim() || null,
                telefono: form.telefono.trim() || null,
                horario: form.horario.trim() || null,
                estado_atencion: form.estado_atencion.trim() || null,
                distancia_km: form.distancia_km.trim() ? Number(form.distancia_km) : null,
                descuento_porcentaje: form.descuento_porcentaje.trim() ? Number(form.descuento_porcentaje) : null,
                maps_url: form.maps_url.trim() || null,
                descripcion: form.descripcion.trim() || null,
                orden_display: form.orden_display.trim() ? Number(form.orden_display) : null,
                activo: form.activo,
            }

            const res = await fetch(
                `${API}${editing ? adminEndpoints.catalogoFarmacia(editing.id) : adminEndpoints.catalogoFarmacias}`,
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
                throw new Error(await getErrorMessage(res, "No pudimos guardar la farmacia"))
            }

            setModalOpen(false)
            resetForm()
            await fetchFarmacias()
            await onCatalogChange()
            addToast(editing ? "Farmacia actualizada correctamente" : "Farmacia agregada correctamente", "success")
        } catch (error) {
            addToast(error instanceof Error ? error.message : "No pudimos guardar la farmacia", "error")
        } finally {
            setSaving(false)
        }
    }

    async function toggleFarmacia(farmacia: AdminFarmacia) {
        setTogglingId(farmacia.id)
        try {
            const res = await fetch(`${API}${adminEndpoints.catalogoFarmacia(farmacia.id)}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders(token),
                },
                body: JSON.stringify({ activo: !farmacia.activo }),
            })

            if (!res.ok) {
                throw new Error(await getErrorMessage(res, "No pudimos cambiar el estado de la farmacia"))
            }

            await fetchFarmacias()
            await onCatalogChange()
            addToast(!farmacia.activo ? "Farmacia activada" : "Farmacia desactivada", "success")
        } catch (error) {
            addToast(error instanceof Error ? error.message : "No pudimos cambiar el estado de la farmacia", "error")
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
                        <h2 className="text-lg font-bold text-slate-900">Farmacias adheridas</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Mantene actualizada la red de farmacias que el cliente va a ver dentro de Beneficios.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4C1D95] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#4C1D95]/15 hover:bg-[#3b1675]"
                    >
                        <Plus size={16} />
                        Agregar farmacia
                    </button>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Buscar por nombre, direccion o localidad"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20"
                    />
                </div>

                {filteredFarmacias.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
                        No encontramos farmacias con ese criterio.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                        {filteredFarmacias.map((farmacia) => (
                            <article key={farmacia.id} className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5F0FF]">
                                            <MapPin className="h-5 w-5 text-[#5B21B6]" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900">{farmacia.nombre}</h3>
                                            <p className="mt-1 text-sm text-slate-500">{farmacia.direccion}</p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => void toggleFarmacia(farmacia)}
                                        disabled={togglingId === farmacia.id}
                                        aria-label={farmacia.activo ? "Desactivar farmacia" : "Activar farmacia"}
                                    >
                                        {farmacia.activo ? (
                                            <ToggleRight size={28} className="text-emerald-500" />
                                        ) : (
                                            <ToggleLeft size={28} className="text-slate-300" />
                                        )}
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2 text-xs">
                                    {farmacia.localidad && (
                                        <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-500">{farmacia.localidad}</span>
                                    )}
                                    {farmacia.estado_atencion && (
                                        <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-500">{farmacia.estado_atencion}</span>
                                    )}
                                    {typeof farmacia.descuento_porcentaje === "number" && (
                                        <span className="rounded-full bg-[#F3ECFF] px-3 py-1 font-semibold text-[#5B21B6]">
                                            {farmacia.descuento_porcentaje}% OFF
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2 text-sm text-slate-600">
                                    {farmacia.descripcion && <p>{farmacia.descripcion}</p>}
                                    <div className="flex flex-wrap gap-4 text-slate-500">
                                        {typeof farmacia.distancia_km === "number" && <span>{farmacia.distancia_km} km</span>}
                                        {farmacia.horario && <span>{farmacia.horario}</span>}
                                        {farmacia.telefono && <span>{farmacia.telefono}</span>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <ActiveDot activo={farmacia.activo} />
                                    <button
                                        type="button"
                                        onClick={() => openEditModal(farmacia)}
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
                title={editing ? `Editar farmacia: ${editing.nombre}` : "Agregar farmacia"}
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
                            onClick={() => void saveFarmacia()}
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
                        <span className="font-medium text-slate-700">Direccion</span>
                        <input value={form.direccion} onChange={(event) => setForm((current) => ({ ...current, direccion: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20" />
                    </label>
                    <label className="space-y-1.5 text-sm text-slate-600">
                        <span className="font-medium text-slate-700">Localidad</span>
                        <input value={form.localidad} onChange={(event) => setForm((current) => ({ ...current, localidad: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20" />
                    </label>
                    <label className="space-y-1.5 text-sm text-slate-600">
                        <span className="font-medium text-slate-700">Provincia</span>
                        <input value={form.provincia} onChange={(event) => setForm((current) => ({ ...current, provincia: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20" />
                    </label>
                    <label className="space-y-1.5 text-sm text-slate-600">
                        <span className="font-medium text-slate-700">Telefono</span>
                        <input value={form.telefono} onChange={(event) => setForm((current) => ({ ...current, telefono: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20" />
                    </label>
                    <label className="space-y-1.5 text-sm text-slate-600">
                        <span className="font-medium text-slate-700">Horario</span>
                        <input value={form.horario} onChange={(event) => setForm((current) => ({ ...current, horario: event.target.value }))} placeholder="24 hs" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20" />
                    </label>
                    <label className="space-y-1.5 text-sm text-slate-600">
                        <span className="font-medium text-slate-700">Estado atencion</span>
                        <input value={form.estado_atencion} onChange={(event) => setForm((current) => ({ ...current, estado_atencion: event.target.value }))} placeholder="Abierta 24 hs" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20" />
                    </label>
                    <label className="space-y-1.5 text-sm text-slate-600">
                        <span className="font-medium text-slate-700">Distancia aprox. (km)</span>
                        <input type="number" min={0} step="0.1" value={form.distancia_km} onChange={(event) => setForm((current) => ({ ...current, distancia_km: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20" />
                    </label>
                    <label className="space-y-1.5 text-sm text-slate-600">
                        <span className="font-medium text-slate-700">Descuento %</span>
                        <input type="number" min={0} max={100} value={form.descuento_porcentaje} onChange={(event) => setForm((current) => ({ ...current, descuento_porcentaje: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20" />
                    </label>
                    <label className="space-y-1.5 text-sm text-slate-600 md:col-span-2">
                        <span className="font-medium text-slate-700">Link de Google Maps</span>
                        <input value={form.maps_url} onChange={(event) => setForm((current) => ({ ...current, maps_url: event.target.value }))} placeholder="https://maps.google.com/..." className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20" />
                    </label>
                    <label className="space-y-1.5 text-sm text-slate-600 md:col-span-2">
                        <span className="font-medium text-slate-700">Descripcion</span>
                        <textarea value={form.descripcion} onChange={(event) => setForm((current) => ({ ...current, descripcion: event.target.value }))} rows={3} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20" />
                    </label>
                    <label className="space-y-1.5 text-sm text-slate-600">
                        <span className="font-medium text-slate-700">Orden</span>
                        <input type="number" min={0} value={form.orden_display} onChange={(event) => setForm((current) => ({ ...current, orden_display: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20" />
                    </label>
                    <label className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 md:col-span-2">
                        <input type="checkbox" checked={form.activo} onChange={(event) => setForm((current) => ({ ...current, activo: event.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-[#4C1D95] focus:ring-[#4C1D95]" />
                        Farmacia activa y visible para los clientes
                    </label>
                </div>
            </Modal>
        </>
    )
}
