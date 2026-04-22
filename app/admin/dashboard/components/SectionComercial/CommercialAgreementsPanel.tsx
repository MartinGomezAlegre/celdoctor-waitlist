"use client"

import { useEffect, useState } from "react"

import type { ComercialAcuerdo, ToastType } from "../../types"
import { API, authHeaders, fmtDate, getApiErrorDetail } from "../../lib"
import { Skeleton } from "../shared/Skeleton"

const EMPTY_FORM = {
    tipo: "contrato",
    titulo: "",
    descripcion: "",
    estado: "vigente",
    fecha_firma: "",
    fecha_vencimiento: "",
    archivo_url: "",
    notas: "",
}

interface Props {
    token: string
    addToast: (msg: string, type: ToastType) => void
    listEndpoint: string
    itemEndpoint: (acuerdoId: number) => string
    title: string
    description: string
    emptyMessage: string
}

export function CommercialAgreementsPanel({
    token,
    addToast,
    listEndpoint,
    itemEndpoint,
    title,
    description,
    emptyMessage,
}: Props) {
    const [items, setItems] = useState<ComercialAcuerdo[]>([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState<ComercialAcuerdo | null>(null)
    const [guardando, setGuardando] = useState(false)
    const [form, setForm] = useState(EMPTY_FORM)

    useEffect(() => {
        let cancelled = false

        async function fetchAgreements() {
            setLoading(true)
            try {
                const res = await fetch(`${API}${listEndpoint}`, { headers: authHeaders(token) })
                const data = (await res.json().catch(() => null)) as ComercialAcuerdo[] | null
                if (cancelled) return
                if (res.ok && Array.isArray(data)) {
                    setItems(data)
                } else {
                    setItems([])
                }
            } catch {
                if (!cancelled) setItems([])
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        void fetchAgreements()
        return () => {
            cancelled = true
        }
    }, [listEndpoint, token])

    function openCreate() {
        setEditing(null)
        setForm(EMPTY_FORM)
        setModalOpen(true)
    }

    function openEdit(item: ComercialAcuerdo) {
        setEditing(item)
        setForm({
            tipo: item.tipo ?? "contrato",
            titulo: item.titulo ?? "",
            descripcion: item.descripcion ?? "",
            estado: item.estado ?? "vigente",
            fecha_firma: item.fecha_firma ?? "",
            fecha_vencimiento: item.fecha_vencimiento ?? "",
            archivo_url: item.archivo_url ?? "",
            notas: item.notas ?? "",
        })
        setModalOpen(true)
    }

    function closeModal() {
        setModalOpen(false)
        setEditing(null)
        setForm(EMPTY_FORM)
    }

    async function saveAgreement() {
        setGuardando(true)
        try {
            const payload = {
                ...form,
                descripcion: form.descripcion || null,
                fecha_firma: form.fecha_firma || null,
                fecha_vencimiento: form.fecha_vencimiento || null,
                archivo_url: form.archivo_url || null,
                notas: form.notas || null,
            }
            const endpoint = editing ? itemEndpoint(editing.id) : listEndpoint
            const res = await fetch(`${API}${endpoint}`, {
                method: editing ? "PUT" : "POST",
                headers: { ...authHeaders(token), "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            if (!res.ok) {
                throw new Error(await getApiErrorDetail(res, "No pudimos guardar el acuerdo."))
            }

            const saved = (await res.json()) as ComercialAcuerdo
            setItems((prev) => (editing ? prev.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...prev]))
            addToast(editing ? "Acuerdo actualizado." : "Acuerdo cargado.", "success")
            closeModal()
        } catch (error) {
            addToast(error instanceof Error ? error.message : "No pudimos guardar el acuerdo.", "error")
        } finally {
            setGuardando(false)
        }
    }

    async function deleteAgreement(item: ComercialAcuerdo) {
        const confirmed = window.confirm(`Eliminar "${item.titulo}"?`)
        if (!confirmed) return

        setGuardando(true)
        try {
            const res = await fetch(`${API}${itemEndpoint(item.id)}`, {
                method: "DELETE",
                headers: authHeaders(token),
            })
            if (!res.ok) {
                throw new Error(await getApiErrorDetail(res, "No pudimos eliminar el acuerdo."))
            }
            setItems((prev) => prev.filter((current) => current.id !== item.id))
            addToast("Acuerdo eliminado.", "success")
        } catch (error) {
            addToast(error instanceof Error ? error.message : "No pudimos eliminar el acuerdo.", "error")
        } finally {
            setGuardando(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <div>
                    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                    <p className="text-sm text-slate-500">{description}</p>
                </div>
                <button
                    onClick={openCreate}
                    className="rounded-xl bg-[#4C1D95] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3b1675]"
                >
                    Nuevo acuerdo
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {loading ? (
                    <div className="space-y-3 p-5">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton key={index} className="h-24 w-full rounded-xl" />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="px-6 py-12 text-center text-sm text-slate-400">{emptyMessage}</div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {items.map((item) => (
                            <div key={item.id} className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-start md:justify-between">
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-violet-700">
                                            {item.tipo}
                                        </span>
                                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                            {item.estado}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900">{item.titulo}</h4>
                                        {item.descripcion && <p className="mt-1 text-sm text-slate-600">{item.descripcion}</p>}
                                    </div>
                                    <div className="grid grid-cols-1 gap-2 text-xs text-slate-500 md:grid-cols-2">
                                        <span>Firma: {item.fecha_firma ? fmtDate(item.fecha_firma) : "-"}</span>
                                        <span>Vencimiento: {item.fecha_vencimiento ? fmtDate(item.fecha_vencimiento) : "-"}</span>
                                        {item.archivo_url && (
                                            <a
                                                href={item.archivo_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="font-medium text-violet-600 hover:text-violet-700"
                                            >
                                                Abrir archivo
                                            </a>
                                        )}
                                    </div>
                                    {item.notas && (
                                        <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                                            {item.notas}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEdit(item)}
                                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => void deleteAgreement(item)}
                                        className="rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="mx-4 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    {editing ? "Editar acuerdo" : "Nuevo acuerdo"}
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Guarda contratos, acuerdos comerciales y notas de seguimiento de forma centralizada.
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                            >
                                ×
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Field label="Tipo">
                                <select
                                    value={form.tipo}
                                    onChange={(event) => setForm((prev) => ({ ...prev, tipo: event.target.value }))}
                                    className={inputClass}
                                >
                                    <option value="contrato">Contrato</option>
                                    <option value="acuerdo">Acuerdo</option>
                                    <option value="convenio">Convenio</option>
                                    <option value="nda">NDA</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </Field>

                            <Field label="Estado">
                                <select
                                    value={form.estado}
                                    onChange={(event) => setForm((prev) => ({ ...prev, estado: event.target.value }))}
                                    className={inputClass}
                                >
                                    <option value="vigente">Vigente</option>
                                    <option value="borrador">Borrador</option>
                                    <option value="vencido">Vencido</option>
                                    <option value="rescindido">Rescindido</option>
                                </select>
                            </Field>

                            <Field label="Titulo" className="md:col-span-2">
                                <input
                                    type="text"
                                    value={form.titulo}
                                    onChange={(event) => setForm((prev) => ({ ...prev, titulo: event.target.value }))}
                                    className={inputClass}
                                    placeholder="Ej: Acuerdo comercial anual"
                                />
                            </Field>

                            <Field label="Descripcion" className="md:col-span-2">
                                <textarea
                                    value={form.descripcion}
                                    onChange={(event) => setForm((prev) => ({ ...prev, descripcion: event.target.value }))}
                                    rows={3}
                                    className={inputClass}
                                    placeholder="Resumen corto del acuerdo"
                                />
                            </Field>

                            <Field label="Fecha de firma">
                                <input
                                    type="date"
                                    value={form.fecha_firma}
                                    onChange={(event) => setForm((prev) => ({ ...prev, fecha_firma: event.target.value }))}
                                    className={inputClass}
                                />
                            </Field>

                            <Field label="Fecha de vencimiento">
                                <input
                                    type="date"
                                    value={form.fecha_vencimiento}
                                    onChange={(event) => setForm((prev) => ({ ...prev, fecha_vencimiento: event.target.value }))}
                                    className={inputClass}
                                />
                            </Field>

                            <Field label="URL del archivo" className="md:col-span-2">
                                <input
                                    type="url"
                                    value={form.archivo_url}
                                    onChange={(event) => setForm((prev) => ({ ...prev, archivo_url: event.target.value }))}
                                    className={inputClass}
                                    placeholder="https://..."
                                />
                            </Field>

                            <Field label="Notas internas" className="md:col-span-2">
                                <textarea
                                    value={form.notas}
                                    onChange={(event) => setForm((prev) => ({ ...prev, notas: event.target.value }))}
                                    rows={3}
                                    className={inputClass}
                                    placeholder="Condiciones especiales, compromisos o puntos a revisar."
                                />
                            </Field>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => void saveAgreement()}
                                disabled={guardando || !form.titulo.trim()}
                                className="rounded-xl bg-[#4C1D95] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3b1675] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {guardando ? "Guardando..." : editing ? "Guardar cambios" : "Crear acuerdo"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function Field({
    label,
    children,
    className = "",
}: {
    label: string
    children: React.ReactNode
    className?: string
}) {
    return (
        <label className={`space-y-1.5 text-sm ${className}`}>
            <span className="font-medium text-slate-700">{label}</span>
            {children}
        </label>
    )
}

const inputClass =
    "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#4C1D95]/15"
