"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import type { Empresa, AdminPlan, EmpresaForm, ToastType } from "../../types"
import { EMPRESA_FORM_VACIO } from "../../types"
import { API, authHeaders, fmtDate, diasParaVencer, getApiErrorDetail } from "../../lib"
import { Skeleton } from "../shared/Skeleton"
import { StatBadge } from "../shared/StatBadge"
import { Pagination } from "../shared/Pagination"
import { FormEmpresa } from "./FormEmpresa"

interface Props {
    empresas: Empresa[]
    total: number
    page: number
    perPage: number
    onPageChange: (page: number) => void
    loading: boolean
    error: boolean
    buscar: string
    onBuscar: (v: string) => void
    token: string
    addToast: (msg: string, type: ToastType) => void
    planes: AdminPlan[]
    onSeleccionar: (e: Empresa) => void
    onRefetch: () => void
}

export function ListaEmpresas({
    empresas,
    total,
    page,
    perPage,
    onPageChange,
    loading,
    error,
    buscar,
    onBuscar,
    token,
    addToast,
    planes,
    onSeleccionar,
    onRefetch,
}: Props) {
    const [modalNueva, setModalNueva] = useState(false)
    const [form, setForm] = useState<EmpresaForm>(EMPRESA_FORM_VACIO)
    const [guardando, setGuardando] = useState(false)

    async function guardarNueva() {
        setGuardando(true)
        try {
            const empresaPayload = {
                razon_social: form.razon_social.trim(),
                cuit: form.cuit.trim(),
                nombre_comercial: form.nombre_comercial.trim() || undefined,
                rubro: form.rubro.trim() || undefined,
                direccion: form.direccion.trim() || undefined,
                localidad: form.localidad.trim() || undefined,
                provincia: form.provincia.trim() || undefined,
                responsabilidad_iva: form.responsabilidad_iva || undefined,
                contacto_nombre: form.contacto_nombre.trim(),
                contacto_cargo: form.contacto_cargo.trim() || undefined,
                contacto_email: form.contacto_email.trim(),
                contacto_telefono: form.contacto_telefono.trim() || undefined,
                admin_access_email: form.admin_access_email.trim() || undefined,
                admin_access_password: form.admin_access_password.trim() || undefined,
            }

            const res = await fetch(`${API}/admin/empresas`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify(empresaPayload),
            })
            if (!res.ok) throw new Error(await getApiErrorDetail(res, "Error al crear la empresa"))
            const empresaCreada = await res.json() as { id: number }

            if (form.plan_id && form.cantidad_empleados && form.precio_por_empleado) {
                const suscripcionRes = await fetch(`${API}/admin/empresas/${empresaCreada.id}/suscripcion`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", ...authHeaders(token) },
                    body: JSON.stringify({
                        plan_id: Number(form.plan_id),
                        cantidad_empleados: Number(form.cantidad_empleados),
                        precio_por_empleado: Number(form.precio_por_empleado),
                        periodicidad: form.periodicidad,
                        fecha_inicio: new Date().toISOString().slice(0, 10),
                    }),
                })

                if (!suscripcionRes.ok) {
                    throw new Error(await getApiErrorDetail(suscripcionRes, "La empresa se creo, pero no se pudo generar la suscripcion inicial"))
                }
            }

            addToast("Empresa creada correctamente", "success")
            setModalNueva(false)
            setForm(EMPRESA_FORM_VACIO)
            onRefetch()
        } catch (error) {
            addToast(error instanceof Error ? error.message : "Error al crear la empresa", "error")
        } finally {
            setGuardando(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="text-2xl font-bold text-slate-900">Empresas</h1>
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Buscar por razon social o CUIT..."
                        value={buscar}
                        onChange={(e) => onBuscar(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] w-64"
                    />
                    <button
                        onClick={() => { setForm(EMPRESA_FORM_VACIO); setModalNueva(true) }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#4C1D95] text-white rounded-xl text-sm font-semibold hover:bg-[#3b1675] transition-colors"
                    >
                        <Plus size={15} /> Nueva empresa
                    </button>
                </div>
            </div>

            {error ? (
                <div className="bg-red-50 border border-red-100 rounded-2xl px-6 py-4 text-sm text-red-600">
                    Error al cargar empresas.
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                {["Empresa", "Contacto", "Empleados", "Plan", "Estado", "Prox. cobro", "Acciones"].map((h) => (
                                    <th key={h} className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="border-b border-slate-50">
                                        {Array.from({ length: 7 }).map((_, j) => (
                                            <td key={j} className="px-5 py-3.5"><Skeleton className="h-4 w-full" /></td>
                                        ))}
                                    </tr>
                                ))
                            ) : empresas.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center text-slate-400 py-12 text-sm">
                                        No hay empresas registradas.
                                    </td>
                                </tr>
                            ) : (
                                empresas.map((emp) => (
                                    <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <p className="font-medium text-slate-900 whitespace-nowrap">{emp.razon_social}</p>
                                            <p className="text-xs text-slate-400">{emp.cuit}</p>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <p className="text-slate-700 whitespace-nowrap">{emp.contacto_nombre}</p>
                                            <p className="text-xs text-slate-400">{emp.contacto_email}</p>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                                {emp.empleados_activos}/{emp.cantidad_empleados}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-700">{emp.plan_nombre ?? "—"}</td>
                                        <td className="px-5 py-3.5">
                                            <StatBadge estado={emp.estado_suscripcion ?? undefined} />
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                                            {emp.fecha_vencimiento ? (
                                                <span className={diasParaVencer(emp.fecha_vencimiento) <= 7 ? "text-orange-600 font-semibold" : ""}>
                                                    {fmtDate(emp.fecha_vencimiento)}
                                                </span>
                                            ) : "—"}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <button
                                                onClick={() => onSeleccionar(emp)}
                                                className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#4C1D95]/30 text-[#4C1D95] hover:bg-[#4C1D95]/5 transition-colors"
                                            >
                                                Ver detalle
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {!loading && total > perPage && (
                        <div className="px-5 pb-4">
                            <Pagination
                                total={total}
                                page={page}
                                perPage={perPage}
                                onPageChange={onPageChange}
                            />
                        </div>
                    )}
                </div>
            )}

            {modalNueva && (
                <FormEmpresa
                    title="Nueva empresa"
                    form={form}
                    setForm={setForm}
                    planes={planes}
                    hasExistingAccess={false}
                    guardando={guardando}
                    onClose={() => { setModalNueva(false); setForm(EMPRESA_FORM_VACIO) }}
                    onSave={guardarNueva}
                />
            )}
        </div>
    )
}
