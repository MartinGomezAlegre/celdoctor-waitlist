"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowLeft, Plus, Download, Upload } from "lucide-react"
import type {
    Empresa, AdminPlan, EmpleadoEmpresa, EventoHistorial,
    ResultadoBulk, EmpresaForm, EmpleadoForm, ToastType,
} from "../types"
import { EMPRESA_FORM_VACIO, EMPLEADO_FORM_VACIO } from "../types"
import {
    API, authHeaders, fmtCurrency, fmtDate, diasParaVencer,
} from "../lib"
import { Skeleton } from "./shared/Skeleton"
import { ActiveDot, StatBadge } from "./shared/StatBadge"

interface Props {
    token: string
    addToast: (msg: string, type: ToastType) => void
}

// ─── Helper: import constants from lib ───────────────────────────────────────
// Re-export so DetalleEmpresa can access them from this module scope

// ─── InfoRow ─────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
    if (!value) return null
    return (
        <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</span>
            <p className="text-sm text-slate-800 mt-0.5">{value}</p>
        </div>
    )
}

// ─── VISTA: DETALLE DE EMPRESA ────────────────────────────────────────────────

type TabDetalle = "info" | "empleados" | "pagos" | "historial"

function DetalleEmpresa({
    empresa, token, addToast, onVolver, onEditar, onBaja,
}: {
    empresa: Empresa
    token: string
    addToast: (msg: string, type: ToastType) => void
    onVolver: () => void
    onEditar: (emp: Empresa) => void
    onBaja: (emp: Empresa) => void
}) {
    const [tab, setTab] = useState<TabDetalle>("info")
    const [empleados, setEmpleados] = useState<EmpleadoEmpresa[]>([])
    const [historial, setHistorial] = useState<EventoHistorial[]>([])
    const [loadingEmpleados, setLoadingEmpleados] = useState(false)
    const [loadingHistorial, setLoadingHistorial] = useState(false)
    const [modalAgregarEmpleado, setModalAgregarEmpleado] = useState(false)
    const [modalBulk, setModalBulk] = useState(false)
    const [empleadoForm, setEmpleadoForm] = useState<EmpleadoForm>(EMPLEADO_FORM_VACIO)
    const [textoBulk, setTextoBulk] = useState("")
    const [resultadoBulk, setResultadoBulk] = useState<ResultadoBulk | null>(null)
    const [procesando, setProcesando] = useState(false)
    const [modalBajaEmpleado, setModalBajaEmpleado] = useState<EmpleadoEmpresa | null>(null)
    const [exportando, setExportando] = useState(false)

    const fetchEmpleados = useCallback(() => {
        setLoadingEmpleados(true)
        fetch(`${API}/admin/empresas/${empresa.id}/empleados`, { headers: authHeaders(token) })
            .then((r) => r.json())
            .then((d: unknown) => setEmpleados(Array.isArray(d) ? (d as EmpleadoEmpresa[]) : []))
            .catch(() => setEmpleados([]))
            .finally(() => setLoadingEmpleados(false))
    }, [empresa.id, token])

    useEffect(() => {
        if (tab === "empleados" && empleados.length === 0) fetchEmpleados()
        if (tab === "historial" && historial.length === 0) {
            setLoadingHistorial(true)
            fetch(`${API}/admin/empresas/${empresa.id}`, { headers: authHeaders(token) })
                .then((r) => r.json())
                .then((d: unknown) => {
                    const emp = d as Empresa
                    setHistorial(Array.isArray(emp?.auditoria) ? emp.auditoria : [])
                })
                .catch(() => setHistorial([]))
                .finally(() => setLoadingHistorial(false))
        }
    }, [tab, empresa.id, token, empleados.length, historial.length, fetchEmpleados])

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
            setModalAgregarEmpleado(false)
            setEmpleadoForm(EMPLEADO_FORM_VACIO)
            fetchEmpleados()
        } catch {
            addToast("Error al agregar el empleado", "error")
        } finally {
            setProcesando(false)
        }
    }

    async function cargaMasiva() {
        setProcesando(true)
        setResultadoBulk(null)
        try {
            const res = await fetch(`${API}/admin/empresas/${empresa.id}/empleados/bulk`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify({ datos: textoBulk }),
            })
            const data = (await res.json()) as ResultadoBulk
            setResultadoBulk(data)
            if (data.cargados > 0) {
                addToast(`${data.cargados} empleados cargados correctamente`, "success")
                fetchEmpleados()
            }
            if (data.fallidos > 0) addToast(`${data.fallidos} filas con error`, "warning")
        } catch {
            addToast("Error en la carga masiva", "error")
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
            setModalBajaEmpleado(null)
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

    const hoy = new Date().toISOString().split("T")[0]
    const empleadosActivos = empleados.filter((e) => e.activo).length
    const lineasBulk = textoBulk.trim().split("\n").filter((l) => l.trim()).length

    const TABS: { id: TabDetalle; label: string }[] = [
        { id: "info", label: "Información" },
        { id: "empleados", label: "Empleados" },
        { id: "pagos", label: "Pagos" },
        { id: "historial", label: "Historial" },
    ]

    return (
        <div className="space-y-6">
            <div>
                <button
                    onClick={onVolver}
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors"
                >
                    <ArrowLeft size={15} /> Volver a empresas
                </button>
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900">{empresa.razon_social}</h1>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${empresa.activo ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                                {empresa.activo ? "Activa" : "Inactiva"}
                            </span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">CUIT: {empresa.cuit}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEditar(empresa)}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            Editar empresa
                        </button>
                        <button
                            onClick={() => onBaja(empresa)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${empresa.activo ? "bg-red-500 text-white hover:bg-red-600" : "bg-emerald-500 text-white hover:bg-emerald-600"}`}
                        >
                            {empresa.activo ? "Dar de baja" : "Dar de alta"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-slate-200">
                {TABS.map(({ id, label }) => (
                    <button
                        key={id}
                        onClick={() => setTab(id)}
                        className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === id ? "border-[#4C1D95] text-[#4C1D95]" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* ─── TAB: INFORMACIÓN ──────────────────────────────────────────────── */}
            {tab === "info" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                        <h3 className="font-semibold text-slate-800 text-sm">Datos comerciales</h3>
                        <InfoRow label="Razón social" value={empresa.razon_social} />
                        <InfoRow label="CUIT" value={empresa.cuit} />
                        <InfoRow label="Nombre comercial" value={empresa.nombre_comercial} />
                        <InfoRow label="Rubro" value={empresa.rubro} />
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                        <h3 className="font-semibold text-slate-800 text-sm">Contacto</h3>
                        <InfoRow label="Nombre" value={empresa.contacto_nombre} />
                        <InfoRow label="Cargo" value={empresa.contacto_cargo} />
                        <InfoRow label="Email" value={empresa.contacto_email} />
                        <InfoRow label="Teléfono" value={empresa.contacto_telefono} />
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                        <h3 className="font-semibold text-slate-800 text-sm">Suscripción</h3>
                        <InfoRow label="Plan" value={empresa.plan_nombre} />
                        <InfoRow label="Empleados" value={`${empresa.empleados_activos} activos / ${empresa.cantidad_empleados} totales`} />
                        <InfoRow label="Precio por empleado" value={empresa.precio_por_empleado ? fmtCurrency(empresa.precio_por_empleado) : null} />
                        <InfoRow label="Precio total" value={empresa.precio_total ? fmtCurrency(empresa.precio_total) : null} />
                        <InfoRow label="Periodicidad" value={empresa.periodicidad} />
                        <InfoRow label="Inicio" value={empresa.fecha_inicio_suscripcion ? fmtDate(empresa.fecha_inicio_suscripcion) : null} />
                        <InfoRow label="Vencimiento" value={empresa.fecha_vencimiento ? fmtDate(empresa.fecha_vencimiento) : null} />
                        {empresa.fecha_vencimiento && (
                            <InfoRow label="Días para vencer" value={`${diasParaVencer(empresa.fecha_vencimiento)} días`} />
                        )}
                        {empresa.estado_suscripcion && <StatBadge estado={empresa.estado_suscripcion} />}
                    </div>
                </div>
            )}

            {/* ─── TAB: EMPLEADOS ────────────────────────────────────────────────── */}
            {tab === "empleados" && (
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
                                onClick={() => { setModalBulk(true); setTextoBulk(""); setResultadoBulk(null) }}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                <Upload size={14} /> Carga masiva
                            </button>
                            <button
                                onClick={() => { setEmpleadoForm(EMPLEADO_FORM_VACIO); setModalAgregarEmpleado(true) }}
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
                                {loadingEmpleados ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <tr key={i} className="border-b border-slate-50">
                                            {Array.from({ length: 7 }).map((_, j) => (
                                                <td key={j} className="px-5 py-3.5"><Skeleton className="h-4 w-full" /></td>
                                            ))}
                                        </tr>
                                    ))
                                ) : empleados.length === 0 ? (
                                    <tr><td colSpan={7} className="text-center text-slate-400 py-12 text-sm">No hay empleados registrados.</td></tr>
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
                                                        onClick={() => setModalBajaEmpleado(emp)}
                                                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${emp.activo ? "border-red-200 text-red-600 hover:bg-red-50" : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"}`}
                                                    >
                                                        {emp.activo ? "Dar de baja" : "Dar de alta"}
                                                    </button>
                                                    {emp.fecha_alta.startsWith(hoy) && (
                                                        <button
                                                            onClick={async () => {
                                                                if (!confirm(`¿Eliminar a ${emp.nombre}?`)) return
                                                                await fetch(`${API}/admin/empresas/${empresa.id}/empleados/${emp.id}`, {
                                                                    method: "DELETE",
                                                                    headers: authHeaders(token),
                                                                })
                                                                fetchEmpleados()
                                                            }}
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
                </div>
            )}

            {/* TAB: Pagos */}
            {tab === "pagos" && (
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl px-6 py-5 text-sm text-blue-700">
                        Los pagos se registrarán aquí cuando se integre <strong>Mercado Pago</strong> y <strong>Payway</strong>.
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                    {["Fecha", "Monto", "Método", "Estado"].map((h) => (
                                        <th key={h} className="text-left px-5 py-3.5 font-semibold text-slate-600">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td colSpan={4} className="text-center text-slate-400 py-12 text-sm">Sin pagos registrados.</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB: Historial */}
            {tab === "historial" && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h2 className="text-base font-semibold text-slate-800 mb-4">Timeline de eventos</h2>
                    {loadingHistorial ? (
                        <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
                    ) : historial.length === 0 ? (
                        <p className="text-slate-400 text-sm">Sin eventos registrados.</p>
                    ) : (
                        <div className="space-y-4">
                            {historial.map((ev, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="w-2 h-2 rounded-full bg-[#4C1D95] mt-1.5 shrink-0" />
                                    <div>
                                        <p className="text-sm text-slate-800">{ev.descripcion}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{fmtDate(ev.fecha)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Modal agregar empleado */}
            {modalAgregarEmpleado && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="font-bold text-slate-900">Agregar empleado</h3>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-4">
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
                        <div className="p-6 border-t border-slate-100 flex gap-3 justify-end">
                            <button
                                onClick={() => setModalAgregarEmpleado(false)}
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
                        </div>
                    </div>
                </div>
            )}

            {/* Modal carga masiva */}
            {modalBulk && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="font-bold text-slate-900">Carga masiva de empleados</h3>
                            <p className="text-xs text-slate-400 mt-1">Formato: Nombre,Apellido,DNI,Email,Cargo (una por línea)</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <textarea
                                value={textoBulk}
                                onChange={(e) => setTextoBulk(e.target.value)}
                                placeholder={"Juan,Pérez,12345678,juan@empresa.com,Desarrollador\nMaría,López,87654321,maria@empresa.com,Diseñadora"}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none h-40 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 font-mono"
                            />
                            {lineasBulk > 0 && (
                                <p className="text-sm text-slate-500">Se van a cargar <strong>{lineasBulk}</strong> empleados</p>
                            )}
                            {resultadoBulk && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-emerald-600">✓ {resultadoBulk.cargados} cargados</p>
                                    {resultadoBulk.fallidos > 0 && (
                                        <>
                                            <p className="text-sm font-medium text-red-600">✗ {resultadoBulk.fallidos} fallidos</p>
                                            <ul className="text-xs text-red-500 list-disc pl-4 space-y-1">
                                                {resultadoBulk.errores.map((e, i) => <li key={i}>{e}</li>)}
                                            </ul>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t border-slate-100 flex gap-3 justify-end">
                            <button
                                onClick={() => { setModalBulk(false); setTextoBulk(""); setResultadoBulk(null) }}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                Cerrar
                            </button>
                            <button
                                onClick={cargaMasiva}
                                disabled={lineasBulk === 0 || procesando}
                                className="px-5 py-2 rounded-xl bg-[#4C1D95] text-white text-sm font-semibold hover:bg-[#3b1675] disabled:opacity-60"
                            >
                                {procesando ? "Cargando..." : `Cargar ${lineasBulk} empleados`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal baja empleado */}
            {modalBajaEmpleado && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4">
                        <p className="font-semibold text-slate-900 mb-6">
                            ¿{modalBajaEmpleado.activo ? "Dar de baja" : "Dar de alta"} a {modalBajaEmpleado.nombre} {modalBajaEmpleado.apellido}?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setModalBajaEmpleado(null)}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => cambiarEstadoEmpleado(modalBajaEmpleado, !modalBajaEmpleado.activo)}
                                className={`px-4 py-2 rounded-xl text-white text-sm font-semibold ${modalBajaEmpleado.activo ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"}`}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// ─── VISTA: LISTA DE EMPRESAS ─────────────────────────────────────────────────

export default function SectionEmpresas({ token, addToast }: Props) {
    const [empresas, setEmpresas] = useState<Empresa[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [buscar, setBuscar] = useState("")
    const [vistaDetalle, setVistaDetalle] = useState<Empresa | null>(null)
    const [modalNueva, setModalNueva] = useState(false)
    const [modalEditar, setModalEditar] = useState<Empresa | null>(null)
    const [modalBaja, setModalBaja] = useState<Empresa | null>(null)
    const [motivoBaja, setMotivoBaja] = useState("")
    const [form, setForm] = useState<EmpresaForm>(EMPRESA_FORM_VACIO)
    const [planes, setPlanes] = useState<AdminPlan[]>([])
    const [guardando, setGuardando] = useState(false)

    const fetchEmpresas = useCallback(() => {
        setLoading(true)
        setError(false)
        fetch(`${API}/admin/empresas`, { headers: authHeaders(token) })
            .then((r) => r.json())
            .then((d: unknown) => setEmpresas(Array.isArray(d) ? (d as Empresa[]) : []))
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [token])

    useEffect(() => {
        fetchEmpresas()
        fetch(`${API}/planes`)
            .then((r) => r.json())
            .then((d: unknown) => setPlanes(Array.isArray(d) ? (d as AdminPlan[]) : []))
            .catch(() => null)
    }, [fetchEmpresas])

    function abrirEditar(empresa: Empresa) {
        setForm({
            razon_social: empresa.razon_social,
            cuit: empresa.cuit,
            nombre_comercial: empresa.nombre_comercial ?? "",
            rubro: empresa.rubro ?? "",
            contacto_nombre: empresa.contacto_nombre,
            contacto_cargo: empresa.contacto_cargo ?? "",
            contacto_email: empresa.contacto_email,
            contacto_telefono: empresa.contacto_telefono ?? "",
            plan_id: empresa.plan_id ? String(empresa.plan_id) : "",
            cantidad_empleados: String(empresa.cantidad_empleados),
            precio_por_empleado: empresa.precio_por_empleado ? String(empresa.precio_por_empleado) : "",
            periodicidad: empresa.periodicidad ?? "mensual",
        })
        setModalEditar(empresa)
    }

    async function guardarEmpresa() {
        setGuardando(true)
        const esEdicion = modalEditar !== null
        const url = esEdicion ? `${API}/admin/empresas/${modalEditar!.id}` : `${API}/admin/empresas`
        try {
            const res = await fetch(url, {
                method: esEdicion ? "PUT" : "POST",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify(form),
            })
            if (!res.ok) throw new Error()
            addToast(`Empresa ${esEdicion ? "actualizada" : "creada"} correctamente`, "success")
            setModalNueva(false)
            setModalEditar(null)
            setForm(EMPRESA_FORM_VACIO)
            fetchEmpresas()
        } catch {
            addToast("Error al guardar la empresa", "error")
        } finally {
            setGuardando(false)
        }
    }

    async function confirmarBaja() {
        if (!modalBaja) return
        setGuardando(true)
        try {
            const res = await fetch(`${API}/admin/empresas/${modalBaja.id}/estado`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify({ activo: false, motivo: motivoBaja }),
            })
            if (!res.ok) throw new Error()
            addToast("Empresa dada de baja correctamente", "success")
            if (vistaDetalle?.id === modalBaja.id) setVistaDetalle(null)
            setModalBaja(null)
            setMotivoBaja("")
            fetchEmpresas()
        } catch {
            addToast("Error al dar de baja la empresa", "error")
        } finally {
            setGuardando(false)
        }
    }

    const filtradas = empresas.filter((e) => {
        const q = buscar.toLowerCase()
        return e.razon_social.toLowerCase().includes(q) || e.cuit.includes(q)
    })

    // Vista detalle
    if (vistaDetalle) {
        return (
            <>
                <DetalleEmpresa
                    empresa={vistaDetalle}
                    token={token}
                    addToast={addToast}
                    onVolver={() => setVistaDetalle(null)}
                    onEditar={abrirEditar}
                    onBaja={(emp) => setModalBaja(emp)}
                />
                {/* Modal baja empresa (puede abrirse desde detalle) */}
                {modalBaja && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4 space-y-4">
                            <h3 className="font-bold text-slate-900">¿Dar de baja a {modalBaja.razon_social}?</h3>
                            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                                ⚠️ Esta acción dará de baja a <strong>TODOS</strong> los empleados activos y cancelará la suscripción.
                            </div>
                            <input
                                type="text"
                                placeholder="Motivo de la baja"
                                value={motivoBaja}
                                onChange={(e) => setMotivoBaja(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            />
                            <div className="flex gap-3 justify-end">
                                <button onClick={() => { setModalBaja(null); setMotivoBaja("") }} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancelar</button>
                                <button onClick={confirmarBaja} disabled={guardando} className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60">
                                    {guardando ? "Procesando..." : "Confirmar baja"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Modal editar (puede abrirse desde detalle) */}
                {modalEditar && (
                    <EmpresaFormModal
                        title="Editar empresa"
                        form={form}
                        setForm={setForm}
                        planes={planes}
                        guardando={guardando}
                        onClose={() => { setModalEditar(null); setForm(EMPRESA_FORM_VACIO) }}
                        onSave={guardarEmpresa}
                    />
                )}
            </>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="text-2xl font-bold text-slate-900">Empresas</h1>
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Buscar por razón social o CUIT…"
                        value={buscar}
                        onChange={(e) => setBuscar(e.target.value)}
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
                <div className="bg-red-50 border border-red-100 rounded-2xl px-6 py-4 text-sm text-red-600">Error al cargar empresas.</div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                {["Empresa", "Contacto", "Empleados", "Plan", "Estado", "Próx. cobro", "Acciones"].map((h) => (
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
                            ) : filtradas.length === 0 ? (
                                <tr><td colSpan={7} className="text-center text-slate-400 py-12 text-sm">No hay empresas registradas.</td></tr>
                            ) : (
                                filtradas.map((emp) => (
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
                                                onClick={() => setVistaDetalle(emp)}
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
                </div>
            )}

            {/* Modal nueva empresa */}
            {modalNueva && (
                <EmpresaFormModal
                    title="Nueva empresa"
                    form={form}
                    setForm={setForm}
                    planes={planes}
                    guardando={guardando}
                    onClose={() => { setModalNueva(false); setForm(EMPRESA_FORM_VACIO) }}
                    onSave={guardarEmpresa}
                />
            )}

            {/* Modal baja empresa */}
            {modalBaja && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4 space-y-4">
                        <h3 className="font-bold text-slate-900">¿Dar de baja a {modalBaja.razon_social}?</h3>
                        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                            ⚠️ Esta acción dará de baja a <strong>TODOS</strong> los empleados activos y cancelará la suscripción.
                        </div>
                        <input
                            type="text"
                            placeholder="Motivo de la baja"
                            value={motivoBaja}
                            onChange={(e) => setMotivoBaja(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                        />
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => { setModalBaja(null); setMotivoBaja("") }} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancelar</button>
                            <button onClick={confirmarBaja} disabled={guardando} className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60">
                                {guardando ? "Procesando..." : "Confirmar baja"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// ─── EmpresaFormModal helper ──────────────────────────────────────────────────

function EmpresaFormModal({ title, form, setForm, planes, guardando, onClose, onSave }: {
    title: string
    form: EmpresaForm
    setForm: React.Dispatch<React.SetStateAction<EmpresaForm>>
    planes: AdminPlan[]
    guardando: boolean
    onClose: () => void
    onSave: () => void
}) {
    function Campo({ label, name, tipo, required }: { label: string; name: keyof EmpresaForm; tipo?: string; required?: boolean }) {
        return (
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{label}{required && " *"}</label>
                <input
                    type={tipo ?? "text"}
                    value={form[name]}
                    onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]"
                />
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
                </div>
                <div className="p-6 space-y-5">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Datos comerciales</p>
                    <div className="grid grid-cols-2 gap-4">
                        <Campo label="Razón social" name="razon_social" required />
                        <Campo label="CUIT" name="cuit" required />
                        <Campo label="Nombre comercial" name="nombre_comercial" />
                        <Campo label="Rubro" name="rubro" />
                    </div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pt-2">Contacto</p>
                    <div className="grid grid-cols-2 gap-4">
                        <Campo label="Nombre contacto" name="contacto_nombre" required />
                        <Campo label="Cargo" name="contacto_cargo" />
                        <Campo label="Email contacto" name="contacto_email" tipo="email" required />
                        <Campo label="Teléfono" name="contacto_telefono" />
                    </div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pt-2">Suscripción (opcional)</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Plan</label>
                            <select
                                value={form.plan_id}
                                onChange={(e) => setForm((p) => ({ ...p, plan_id: e.target.value }))}
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            >
                                <option value="">Sin plan</option>
                                {planes.map((pl) => <option key={pl.id} value={pl.id}>{pl.nombre}</option>)}
                            </select>
                        </div>
                        <Campo label="Cantidad empleados" name="cantidad_empleados" tipo="number" />
                        <Campo label="Precio por empleado (ARS)" name="precio_por_empleado" tipo="number" />
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Periodicidad</label>
                            <select
                                value={form.periodicidad}
                                onChange={(e) => setForm((p) => ({ ...p, periodicidad: e.target.value }))}
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            >
                                <option value="mensual">Mensual</option>
                                <option value="trimestral">Trimestral</option>
                                <option value="anual">Anual</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-slate-100 flex gap-3 justify-end">
                    <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancelar</button>
                    <button
                        onClick={onSave}
                        disabled={!form.razon_social || !form.cuit || !form.contacto_nombre || !form.contacto_email || guardando}
                        className="px-5 py-2 rounded-xl bg-[#4C1D95] text-white text-sm font-semibold hover:bg-[#3b1675] disabled:opacity-60"
                    >
                        {guardando ? "Guardando..." : title === "Nueva empresa" ? "Crear empresa" : "Guardar cambios"}
                    </button>
                </div>
            </div>
        </div>
    )
}
