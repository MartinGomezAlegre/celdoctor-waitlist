"use client"
import { useState, useEffect } from "react"
import { Plus, Download, Upload } from "lucide-react"
import type { Empresa, EmpleadoEmpresa, EmpleadoForm, ToastType } from "../../types"
import { EMPLEADO_FORM_VACIO } from "../../types"
import { API, authHeaders, fmtDate } from "../../lib"
import { Skeleton } from "../shared/Skeleton"
import { ActiveDot } from "../shared/StatBadge"
import { ConfirmModal, Modal } from "../shared/Modal"
import { BulkEmpleados } from "./BulkEmpleados"
import { useEmpleados } from "./hooks/useEmpleados"

interface Props {
    empresa: Empresa
    token: string
    addToast: (msg: string, type: ToastType) => void
}

export function TabEmpleados({ empresa, token, addToast }: Props) {
    const { empleados, setEmpleados, loading, fetchEmpleados } = useEmpleados(empresa.id, token)
    const [modalAgregar, setModalAgregar] = useState(false)
    const [modalBulk, setModalBulk] = useState(false)
    const [confirmBaja, setConfirmBaja] = useState<EmpleadoEmpresa | null>(null)
    const [empleadoForm, setEmpleadoForm] = useState<EmpleadoForm>(EMPLEADO_FORM_VACIO)
    const [procesando, setProcesando] = useState(false)
    const [exportando, setExportando] = useState(false)

    // Fetch on mount (component only mounts when tab is active)
    useEffect(() => { fetchEmpleados() }, [fetchEmpleados])

    const hoy = new Date().toISOString().split("T")[0]
    const empleadosActivos = empleados.filter((e) => e.activo).length

    async function agregarEmpleado() {
        setProcesando(true)
        try {
            const res = await fetch(`${API}/admin/empresas/${empresa.id}/empleados`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify(empleadoForm),
            })
            if (!res.ok) throw new Error()
            addToast("Empleado agregado correctamente", "success")
            setModalAgregar(false)
            setEmpleadoForm(EMPLEADO_FORM_VACIO)
            fetchEmpleados()
        } catch {
            addToast("Error al agregar el empleado", "error")
        } finally {
            setProcesando(false)
        }
    }

    async function cambiarEstadoEmpleado(empleado: EmpleadoEmpresa, activo: boolean) {
        try {
            const res = await fetch(`${API}/admin/empresas/${empresa.id}/empleados/${empleado.id}/estado`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify({ activo }),
            })
            if (!res.ok) throw new Error()
            setEmpleados((prev) => prev.map((e) => (e.id === empleado.id ? { ...e, activo } : e)))
            addToast(`Empleado ${activo ? "activado" : "desactivado"}`, "success")
        } catch {
            addToast("Error al cambiar estado del empleado", "error")
        } finally {
            setConfirmBaja(null)
        }
    }

    async function eliminarEmpleado(empleado: EmpleadoEmpresa) {
        try {
            await fetch(`${API}/admin/empresas/${empresa.id}/empleados/${empleado.id}`, {
                method: "DELETE",
                headers: authHeaders(token),
            })
            fetchEmpleados()
        } catch {
            addToast("Error al eliminar el empleado", "error")
        }
    }

    async function exportarEmpleados() {
        setExportando(true)
        try {
            const res = await fetch(`${API}/admin/empresas/${empresa.id}/exportar-excel`, {
                headers: authHeaders(token),
            })
            if (!res.ok) throw new Error()
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `empleados_${empresa.cuit}.xlsx`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
            addToast("Excel exportado correctamente", "success")
        } catch {
            addToast("Error al exportar", "error")
        } finally {
            setExportando(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <p className="text-sm text-slate-600 font-medium">
                    <span className="text-slate-900 font-bold">{empleadosActivos}</span> activos de{" "}
                    <span className="font-bold">{empleados.length}</span> totales
                </p>
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={exportarEmpleados}
                        disabled={exportando}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-60"
                    >
                        <Download size={14} /> {exportando ? "Exportando..." : "Exportar Excel"}
                    </button>
                    <button
                        onClick={() => setModalBulk(true)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        <Upload size={14} /> Carga masiva
                    </button>
                    <button
                        onClick={() => { setEmpleadoForm(EMPLEADO_FORM_VACIO); setModalAgregar(true) }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#4C1D95] text-white rounded-xl text-sm font-semibold hover:bg-[#3b1675] transition-colors"
                    >
                        <Plus size={14} /> Agregar empleado
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                            {["Nombre", "DNI", "Email", "Cargo", "Estado", "Fecha alta", "Acciones"].map((h) => (
                                <th key={h} className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <tr key={i} className="border-b border-slate-50">
                                    {Array.from({ length: 7 }).map((_, j) => (
                                        <td key={j} className="px-5 py-3.5"><Skeleton className="h-4 w-full" /></td>
                                    ))}
                                </tr>
                            ))
                        ) : empleados.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center text-slate-400 py-12 text-sm">
                                    No hay empleados registrados.
                                </td>
                            </tr>
                        ) : (
                            empleados.map((emp) => (
                                <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                    <td className="px-5 py-3.5 font-medium text-slate-900 whitespace-nowrap">{emp.nombre} {emp.apellido}</td>
                                    <td className="px-5 py-3.5 text-slate-600">{emp.dni}</td>
                                    <td className="px-5 py-3.5 text-slate-600">{emp.email}</td>
                                    <td className="px-5 py-3.5 text-slate-500">{emp.cargo ?? "—"}</td>
                                    <td className="px-5 py-3.5"><ActiveDot activo={emp.activo} /></td>
                                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{fmtDate(emp.fecha_alta)}</td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setConfirmBaja(emp)}
                                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${emp.activo ? "border-red-200 text-red-600 hover:bg-red-50" : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"}`}
                                            >
                                                {emp.activo ? "Dar de baja" : "Dar de alta"}
                                            </button>
                                            {emp.fecha_alta.startsWith(hoy) && (
                                                <button
                                                    onClick={() => eliminarEmpleado(emp)}
                                                    className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50"
                                                >
                                                    Eliminar
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal agregar empleado */}
            <Modal
                open={modalAgregar}
                onClose={() => setModalAgregar(false)}
                title="Agregar empleado"
                footer={
                    <>
                        <button
                            onClick={() => setModalAgregar(false)}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={agregarEmpleado}
                            disabled={!empleadoForm.nombre || !empleadoForm.apellido || !empleadoForm.dni || !empleadoForm.email || procesando}
                            className="px-5 py-2 rounded-xl bg-[#4C1D95] text-white text-sm font-semibold hover:bg-[#3b1675] disabled:opacity-60"
                        >
                            {procesando ? "Guardando..." : "Guardar"}
                        </button>
                    </>
                }
            >
                <div className="grid grid-cols-2 gap-4">
                    {(["nombre", "apellido", "dni", "email", "cargo"] as (keyof EmpleadoForm)[]).map((field) => (
                        <div key={field} className={field === "email" || field === "cargo" ? "col-span-2" : ""}>
                            <label className="block text-sm font-medium text-slate-700 mb-1 capitalize">{field}</label>
                            <input
                                type={field === "email" ? "email" : "text"}
                                value={empleadoForm[field]}
                                onChange={(e) => setEmpleadoForm((p) => ({ ...p, [field]: e.target.value }))}
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            />
                        </div>
                    ))}
                </div>
            </Modal>

            {/* Modal carga masiva */}
            {modalBulk && (
                <BulkEmpleados
                    empresaId={empresa.id}
                    token={token}
                    addToast={addToast}
                    onClose={() => setModalBulk(false)}
                    onSuccess={fetchEmpleados}
                />
            )}

            {/* Confirmación dar de baja/alta empleado (MEJORA 2) */}
            <ConfirmModal
                open={!!confirmBaja}
                onClose={() => setConfirmBaja(null)}
                onConfirm={() => confirmBaja && cambiarEstadoEmpleado(confirmBaja, !confirmBaja.activo)}
                title={`${confirmBaja?.activo ? "Dar de baja" : "Dar de alta"} empleado`}
                description={`¿Seguro que querés ${confirmBaja?.activo ? "dar de baja" : "dar de alta"} a ${confirmBaja?.nombre} ${confirmBaja?.apellido}?`}
                confirmLabel={confirmBaja?.activo ? "Dar de baja" : "Dar de alta"}
                confirmClass={confirmBaja?.activo ? "bg-red-500" : "bg-emerald-500"}
            />
        </div>
    )
}
