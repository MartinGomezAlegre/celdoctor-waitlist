"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"

import type { Empresa, PaginatedResponse, PersonalInterno, ToastType } from "../types"
import { API, authHeaders, fmtDate, getApiErrorDetail } from "../lib"
import { adminEndpoints } from "../admin-endpoints"
import { Pagination } from "./shared/Pagination"
import { TableSkeleton } from "./shared/Skeleton"

const PER_PAGE = 20
const EMPTY_FORM = {
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    contrasenia: "",
    nueva_contrasenia: "",
    rol: "gestor_interno",
    area: "",
    cargo: "",
    responsabilidades: "",
    empresa_ids: [] as number[],
}

interface Props {
    token: string
    addToast: (msg: string, type: ToastType) => void
}

export default function SectionPersonal({ token, addToast }: Props) {
    const [items, setItems] = useState<PersonalInterno[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [buscar, setBuscar] = useState("")
    const [filtro, setFiltro] = useState("todos")
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [companyOptions, setCompanyOptions] = useState<Empresa[]>([])
    const [loadingCompanies, setLoadingCompanies] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState<PersonalInterno | null>(null)
    const [guardando, setGuardando] = useState(false)
    const [form, setForm] = useState(EMPTY_FORM)

    useEffect(() => {
        let cancelled = false

        async function fetchPersonal() {
            setLoading(true)
            setError(false)
            try {
                const params = new URLSearchParams({
                    limit: String(PER_PAGE),
                    offset: String((page - 1) * PER_PAGE),
                })
                if (buscar.trim()) params.set("buscar", buscar.trim())
                if (filtro !== "todos") params.set("filtro", filtro)

                const res = await fetch(`${API}${adminEndpoints.personal}?${params.toString()}`, {
                    headers: authHeaders(token),
                })
                const data = (await res.json().catch(() => null)) as PaginatedResponse<PersonalInterno> | null
                if (cancelled) return

                if (!res.ok || !data || !Array.isArray(data.items)) {
                    setItems([])
                    setTotal(0)
                    setError(true)
                    return
                }

                setItems(data.items)
                setTotal(data.total ?? 0)
            } catch {
                if (!cancelled) {
                    setItems([])
                    setTotal(0)
                    setError(true)
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        void fetchPersonal()
        return () => {
            cancelled = true
        }
    }, [buscar, filtro, page, token])

    useEffect(() => {
        let cancelled = false

        async function fetchCompanies() {
            setLoadingCompanies(true)
            try {
                const params = new URLSearchParams({
                    limit: "500",
                    offset: "0",
                })
                const res = await fetch(`${API}${adminEndpoints.empresas}?${params.toString()}`, {
                    headers: authHeaders(token),
                })
                const data = (await res.json().catch(() => null)) as PaginatedResponse<Empresa> | null
                if (cancelled) return
                if (res.ok && data && Array.isArray(data.items)) {
                    setCompanyOptions(data.items)
                } else {
                    setCompanyOptions([])
                }
            } catch {
                if (!cancelled) setCompanyOptions([])
            } finally {
                if (!cancelled) setLoadingCompanies(false)
            }
        }

        void fetchCompanies()
        return () => {
            cancelled = true
        }
    }, [token])

    const resumen = useMemo(() => {
        const activos = items.filter((item) => item.activo).length
        const admins = items.filter((item) => item.rol === "admin").length
        const gestores = items.filter((item) => item.rol === "gestor_interno").length
        return { activos, admins, gestores }
    }, [items])

    function openCreate() {
        setEditing(null)
        setForm({ ...EMPTY_FORM })
        setModalOpen(true)
    }

    function openEdit(item: PersonalInterno) {
        setEditing(item)
        setForm({
            nombre: item.nombre,
            apellido: item.apellido,
            email: item.email,
            telefono: item.telefono ?? "",
            contrasenia: "",
            nueva_contrasenia: "",
            rol: item.rol,
            area: item.area ?? "",
            cargo: item.cargo ?? "",
            responsabilidades: item.responsabilidades ?? "",
            empresa_ids: [...(item.empresa_ids ?? [])],
        })
        setModalOpen(true)
    }

    function closeModal() {
        setModalOpen(false)
        setEditing(null)
        setForm({ ...EMPTY_FORM })
    }

    function toggleCompany(empresaId: number) {
        setForm((prev) => {
            const selected = new Set(prev.empresa_ids)
            if (selected.has(empresaId)) {
                selected.delete(empresaId)
            } else {
                selected.add(empresaId)
            }
            return { ...prev, empresa_ids: Array.from(selected).sort((a, b) => a - b) }
        })
    }

    async function savePersonal() {
        setGuardando(true)
        try {
            const payload = editing
                ? {
                    nombre: form.nombre,
                    apellido: form.apellido,
                    email: form.email,
                    telefono: form.telefono || null,
                    rol: form.rol,
                    area: form.area || null,
                    cargo: form.cargo || null,
                    responsabilidades: form.responsabilidades || null,
                    nueva_contrasenia: form.nueva_contrasenia || null,
                    empresa_ids: form.rol === "gestor_interno" ? form.empresa_ids : [],
                }
                : {
                    nombre: form.nombre,
                    apellido: form.apellido,
                    email: form.email,
                    telefono: form.telefono || null,
                    contrasenia: form.contrasenia,
                    rol: form.rol,
                    area: form.area || null,
                    cargo: form.cargo || null,
                    responsabilidades: form.responsabilidades || null,
                    empresa_ids: form.rol === "gestor_interno" ? form.empresa_ids : [],
                }

            const endpoint = editing ? `${API}${adminEndpoints.personalItem(editing.id)}` : `${API}${adminEndpoints.personal}`
            const method = editing ? "PUT" : "POST"

            const res = await fetch(endpoint, {
                method,
                headers: { ...authHeaders(token), "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                throw new Error(await getApiErrorDetail(res, "No pudimos guardar el miembro del personal."))
            }

            const saved = (await res.json()) as PersonalInterno
            setItems((prev) => (editing ? prev.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...prev]))
            addToast(editing ? "Personal actualizado." : "Cuenta interna creada.", "success")
            closeModal()
        } catch (error) {
            addToast(error instanceof Error ? error.message : "No pudimos guardar el personal.", "error")
        } finally {
            setGuardando(false)
        }
    }

    async function toggleEstado(item: PersonalInterno) {
        try {
            const res = await fetch(`${API}${adminEndpoints.usuarioEstado(item.id)}`, {
                method: "PUT",
                headers: { ...authHeaders(token), "Content-Type": "application/json" },
                body: JSON.stringify({ activo: !item.activo, motivo: null }),
            })
            if (!res.ok) {
                throw new Error(await getApiErrorDetail(res, "No pudimos actualizar el estado."))
            }

            setItems((prev) => prev.map((current) => (current.id === item.id ? { ...current, activo: !item.activo } : current)))
            addToast(item.activo ? "Cuenta dada de baja." : "Cuenta reactivada.", "success")
        } catch (error) {
            addToast(error instanceof Error ? error.message : "No pudimos actualizar el estado.", "error")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Personal</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Gestiona el equipo interno de CELDOCTOR, sus accesos, responsabilidades y, para los gestores internos, las empresas que pueden ver.
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
                >
                    Nuevo integrante
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <ResumenCard label="Activos" value={resumen.activos} />
                <ResumenCard label="Admins" value={resumen.admins} />
                <ResumenCard label="Gestores internos" value={resumen.gestores} />
            </div>

            <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow sm:flex-row sm:items-center sm:justify-between">
                <input
                    type="text"
                    placeholder="Buscar por nombre, email, area, cargo o empresa..."
                    value={buscar}
                    onChange={(event) => {
                        setBuscar(event.target.value)
                        setPage(1)
                    }}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/30 sm:max-w-md"
                />
                <select
                    value={filtro}
                    onChange={(event) => {
                        setFiltro(event.target.value)
                        setPage(1)
                    }}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/30"
                >
                    <option value="todos">Todo el personal</option>
                    <option value="activos">Solo activos</option>
                    <option value="inactivos">Solo inactivos</option>
                    <option value="admins">Solo admins</option>
                    <option value="gestores">Solo gestores</option>
                </select>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow">
                {error ? (
                    <div className="m-6 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm font-medium text-red-700">
                        No pudimos cargar el personal interno.
                    </div>
                ) : loading ? (
                    <div className="p-6">
                        <TableSkeleton rows={5} cols={7} />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    {["Nombre", "Rol", "Area y cargo", "Empresas visibles", "Responsabilidades", "Estado", "Acciones"].map((label) => (
                                        <th key={label} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            {label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                                            Todavia no hay personal interno cargado.
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="font-medium text-slate-900">{item.nombre} {item.apellido}</p>
                                                    <p className="text-xs text-slate-500">{item.email}</p>
                                                    <p className="text-xs text-slate-400">
                                                        {item.created_at ? `Alta ${fmtDate(item.created_at)}` : "Sin fecha"}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700">
                                                    {item.rol === "admin" ? "Admin" : "Gestor interno"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">
                                                <p className="font-medium text-slate-800">{item.area ?? "-"}</p>
                                                <p className="text-xs text-slate-500">{item.cargo ?? "Sin cargo definido"}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                {item.rol !== "gestor_interno" ? (
                                                    <span className="text-xs text-slate-400">No aplica</span>
                                                ) : item.empresas_visibles_count ? (
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-semibold text-slate-700">
                                                            {item.empresas_visibles_count} empresa{item.empresas_visibles_count === 1 ? "" : "s"}
                                                        </p>
                                                        <div className="flex max-w-xs flex-wrap gap-1">
                                                            {(item.empresas_visibles ?? []).slice(0, 3).map((empresa) => (
                                                                <span key={empresa} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                                                                    {empresa}
                                                                </span>
                                                            ))}
                                                            {(item.empresas_visibles?.length ?? 0) > 3 && (
                                                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                                                                    +{(item.empresas_visibles?.length ?? 0) - 3}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-amber-600">Sin empresas asignadas</span>
                                                )}
                                            </td>
                                            <td className="max-w-sm px-4 py-3 text-slate-600">
                                                <p className="line-clamp-3 whitespace-pre-wrap">{item.responsabilidades ?? "-"}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.activo ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                                                    {item.activo ? "Activo" : "Inactivo"}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openEdit(item)}
                                                        className="rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 transition-colors hover:bg-violet-100"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => void toggleEstado(item)}
                                                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${item.activo ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`}
                                                    >
                                                        {item.activo ? "Dar de baja" : "Reactivar"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {!loading && !error && total > PER_PAGE && (
                <div className="rounded-2xl bg-white px-6 py-4 shadow">
                    <Pagination total={total} page={page} perPage={PER_PAGE} onPageChange={setPage} />
                </div>
            )}

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="mx-4 w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    {editing ? "Editar integrante" : "Nuevo integrante del personal"}
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Crea cuentas internas con acceso al panel y deja documentado su alcance operativo.
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
                            <Field label="Nombre">
                                <input value={form.nombre} onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))} className={inputClass} />
                            </Field>
                            <Field label="Apellido">
                                <input value={form.apellido} onChange={(e) => setForm((prev) => ({ ...prev, apellido: e.target.value }))} className={inputClass} />
                            </Field>
                            <Field label="Email">
                                <input type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} className={inputClass} />
                            </Field>
                            <Field label="Telefono">
                                <input value={form.telefono} onChange={(e) => setForm((prev) => ({ ...prev, telefono: e.target.value }))} className={inputClass} />
                            </Field>
                            <Field label="Rol del sistema">
                                <select
                                    value={form.rol}
                                    onChange={(e) => {
                                        const nextRole = e.target.value
                                        setForm((prev) => ({
                                            ...prev,
                                            rol: nextRole,
                                            empresa_ids: nextRole === "gestor_interno" ? prev.empresa_ids : [],
                                        }))
                                    }}
                                    className={inputClass}
                                >
                                    <option value="gestor_interno">Gestor interno</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </Field>
                            <Field label="Area">
                                <input value={form.area} onChange={(e) => setForm((prev) => ({ ...prev, area: e.target.value }))} className={inputClass} placeholder="Ej: Comercial" />
                            </Field>
                            <Field label="Cargo">
                                <input value={form.cargo} onChange={(e) => setForm((prev) => ({ ...prev, cargo: e.target.value }))} className={inputClass} placeholder="Ej: Gestor comercial" />
                            </Field>
                            <Field label={editing ? "Nueva contrasena (opcional)" : "Contrasena inicial"}>
                                <input
                                    type="password"
                                    value={editing ? form.nueva_contrasenia : form.contrasenia}
                                    onChange={(e) => setForm((prev) => (editing ? { ...prev, nueva_contrasenia: e.target.value } : { ...prev, contrasenia: e.target.value }))}
                                    className={inputClass}
                                />
                            </Field>
                            <Field label="Responsabilidades" className="md:col-span-2">
                                <textarea
                                    value={form.responsabilidades}
                                    onChange={(e) => setForm((prev) => ({ ...prev, responsabilidades: e.target.value }))}
                                    rows={4}
                                    className={inputClass}
                                    placeholder="Describi que puede hacer esta persona, que area cubre y que seguimiento lleva."
                                />
                            </Field>
                            {form.rol === "gestor_interno" && (
                                <Field label="Empresas visibles" className="md:col-span-2">
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <p className="mb-3 text-xs text-slate-500">
                                            El gestor interno solo podra ver y operar sobre las empresas que marques aca.
                                        </p>
                                        {loadingCompanies ? (
                                            <p className="text-sm text-slate-500">Cargando empresas...</p>
                                        ) : companyOptions.length === 0 ? (
                                            <p className="text-sm text-slate-500">No hay empresas disponibles para asignar.</p>
                                        ) : (
                                            <div className="grid max-h-56 gap-2 overflow-y-auto pr-1 md:grid-cols-2">
                                                {companyOptions.map((empresa) => {
                                                    const checked = form.empresa_ids.includes(empresa.id)
                                                    return (
                                                        <label
                                                            key={empresa.id}
                                                            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                                                                checked
                                                                    ? "border-violet-300 bg-violet-50 text-violet-900"
                                                                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                                                            }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={checked}
                                                                onChange={() => toggleCompany(empresa.id)}
                                                                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                                                            />
                                                            <span className="min-w-0">
                                                                <span className="block font-medium">{empresa.razon_social}</span>
                                                                <span className="block truncate text-xs text-slate-500">
                                                                    {empresa.nombre_comercial ?? empresa.cuit}
                                                                </span>
                                                            </span>
                                                        </label>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </Field>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => void savePersonal()}
                                disabled={guardando || !form.nombre.trim() || !form.apellido.trim() || !form.email.trim() || (!editing && !form.contrasenia.trim())}
                                className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {guardando ? "Guardando..." : editing ? "Guardar cambios" : "Crear cuenta"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function ResumenCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
    )
}

function Field({
    label,
    children,
    className = "",
}: {
    label: string
    children: ReactNode
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
    "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/30"
