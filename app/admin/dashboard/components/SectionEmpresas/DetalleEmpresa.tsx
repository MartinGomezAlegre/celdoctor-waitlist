"use client"
import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import type { Empresa, EventoHistorial, AdminPlan, EmpresaForm, ToastType } from "../../types"
import { EMPRESA_FORM_VACIO } from "../../types"
import { API, authHeaders, fmtCurrency, fmtDate, diasParaVencer, getApiErrorDetail } from "../../lib"
import { Skeleton } from "../shared/Skeleton"
import { StatBadge } from "../shared/StatBadge"
import { FormEmpresa } from "./FormEmpresa"
import { TabEmpleados } from "./TabEmpleados"

type TabDetalle = "info" | "empleados" | "pagos" | "historial"

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
    if (!value) return null
    return (
        <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</span>
            <p className="text-sm text-slate-800 mt-0.5">{value}</p>
        </div>
    )
}

interface Props {
    empresa: Empresa
    token: string
    addToast: (msg: string, type: ToastType) => void
    planes: AdminPlan[]
    onVolver: () => void
}

export function DetalleEmpresa({ empresa, token, addToast, planes, onVolver }: Props) {
    const [tab, setTab] = useState<TabDetalle>("info")
    const [empresaLocal, setEmpresaLocal] = useState<Empresa>(empresa)
    const [historial, setHistorial] = useState<EventoHistorial[]>([])
    const [loadingHistorial, setLoadingHistorial] = useState(false)
    const [hasFetchedHistorial, setHasFetchedHistorial] = useState(false)
    const [modalEditar, setModalEditar] = useState(false)
    const [modalBaja, setModalBaja] = useState(false)
    const [motivoBaja, setMotivoBaja] = useState("")
    const [form, setForm] = useState<EmpresaForm>(EMPRESA_FORM_VACIO)
    const [guardando, setGuardando] = useState(false)

    // Al cambiar de empresa (navegación back → nueva empresa), resetear todo
    useEffect(() => {
        setEmpresaLocal(empresa)
        setHistorial([])
        setHasFetchedHistorial(false)
        setTab("info")
    }, [empresa.id]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (tab === "historial" && !hasFetchedHistorial) {
            setHasFetchedHistorial(true)
            setLoadingHistorial(true)
            fetch(`${API}/admin/empresas/${empresaLocal.id}`, { headers: authHeaders(token) })
                .then((r) => r.json())
                .then((d: unknown) => {
                    const emp = d as Empresa
                    setHistorial(Array.isArray(emp?.auditoria) ? emp.auditoria : [])
                })
                .catch(() => setHistorial([]))
                .finally(() => setLoadingHistorial(false))
        }
    }, [tab, hasFetchedHistorial, empresaLocal.id, token])

    function abrirEditar() {
        setForm({
            razon_social: empresaLocal.razon_social,
            cuit: empresaLocal.cuit,
            nombre_comercial: empresaLocal.nombre_comercial ?? "",
            rubro: empresaLocal.rubro ?? "",
            contacto_nombre: empresaLocal.contacto_nombre,
            contacto_cargo: empresaLocal.contacto_cargo ?? "",
            contacto_email: empresaLocal.contacto_email,
            contacto_telefono: empresaLocal.contacto_telefono ?? "",
            plan_id: empresaLocal.plan_id ? String(empresaLocal.plan_id) : "",
            cantidad_empleados: String(empresaLocal.cantidad_empleados),
            precio_por_empleado: empresaLocal.precio_por_empleado ? String(empresaLocal.precio_por_empleado) : "",
            periodicidad: empresaLocal.periodicidad ?? "mensual",
        })
        setModalEditar(true)
    }

    async function guardarEdicion() {
        setGuardando(true)
        try {
            const res = await fetch(`${API}/admin/empresas/${empresaLocal.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify(form),
            })
            if (!res.ok) throw new Error(await getApiErrorDetail(res, "Error al guardar la empresa"))
            // Re-fetch para obtener datos actualizados del backend
            const refreshRes = await fetch(`${API}/admin/empresas/${empresaLocal.id}`, {
                headers: authHeaders(token),
            })
            if (refreshRes.ok) {
                const updated = (await refreshRes.json()) as Empresa
                setEmpresaLocal(updated)
            }
            addToast("Empresa actualizada correctamente", "success")
            setModalEditar(false)
        } catch (error) {
            addToast(error instanceof Error ? error.message : "Error al guardar la empresa", "error")
        } finally {
            setGuardando(false)
        }
    }

    async function confirmarBaja() {
        setGuardando(true)
        try {
            const res = await fetch(`${API}/admin/empresas/${empresaLocal.id}/estado`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify({ activo: false, motivo: motivoBaja }),
            })
            if (!res.ok) throw new Error()
            addToast("Empresa dada de baja correctamente", "success")
            onVolver()
        } catch {
            addToast("Error al dar de baja la empresa", "error")
        } finally {
            setGuardando(false)
            setModalBaja(false)
            setMotivoBaja("")
        }
    }

    const TABS: { id: TabDetalle; label: string }[] = [
        { id: "info", label: "Información" },
        { id: "empleados", label: "Empleados" },
        { id: "pagos", label: "Pagos" },
        { id: "historial", label: "Historial" },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
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
                            <h1 className="text-2xl font-bold text-slate-900">{empresaLocal.razon_social}</h1>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${empresaLocal.activo ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                                {empresaLocal.activo ? "Activa" : "Inactiva"}
                            </span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">CUIT: {empresaLocal.cuit}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={abrirEditar}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            Editar empresa
                        </button>
                        {empresaLocal.activo && (
                            <button
                                onClick={() => setModalBaja(true)}
                                className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
                            >
                                Dar de baja
                            </button>
                        )}
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

            {/* Tab: Información */}
            {tab === "info" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                        <h3 className="font-semibold text-slate-800 text-sm">Datos comerciales</h3>
                        <InfoRow label="Razón social" value={empresaLocal.razon_social} />
                        <InfoRow label="CUIT" value={empresaLocal.cuit} />
                        <InfoRow label="Nombre comercial" value={empresaLocal.nombre_comercial} />
                        <InfoRow label="Rubro" value={empresaLocal.rubro} />
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                        <h3 className="font-semibold text-slate-800 text-sm">Contacto</h3>
                        <InfoRow label="Nombre" value={empresaLocal.contacto_nombre} />
                        <InfoRow label="Cargo" value={empresaLocal.contacto_cargo} />
                        <InfoRow label="Email" value={empresaLocal.contacto_email} />
                        <InfoRow label="Teléfono" value={empresaLocal.contacto_telefono} />
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                        <h3 className="font-semibold text-slate-800 text-sm">Suscripción</h3>
                        <InfoRow label="Plan" value={empresaLocal.plan_nombre} />
                        <InfoRow label="Empleados" value={`${empresaLocal.empleados_activos} activos / ${empresaLocal.cantidad_empleados} totales`} />
                        <InfoRow label="Precio por empleado" value={empresaLocal.precio_por_empleado ? fmtCurrency(empresaLocal.precio_por_empleado) : null} />
                        <InfoRow label="Precio total" value={empresaLocal.precio_total ? fmtCurrency(empresaLocal.precio_total) : null} />
                        <InfoRow label="Periodicidad" value={empresaLocal.periodicidad} />
                        <InfoRow label="Inicio" value={empresaLocal.fecha_inicio_suscripcion ? fmtDate(empresaLocal.fecha_inicio_suscripcion) : null} />
                        <InfoRow label="Vencimiento" value={empresaLocal.fecha_vencimiento ? fmtDate(empresaLocal.fecha_vencimiento) : null} />
                        {empresaLocal.fecha_vencimiento && (
                            <InfoRow label="Días para vencer" value={`${diasParaVencer(empresaLocal.fecha_vencimiento)} días`} />
                        )}
                        {empresaLocal.estado_suscripcion && <StatBadge estado={empresaLocal.estado_suscripcion} />}
                    </div>
                </div>
            )}

            {/* Tab: Empleados */}
            {tab === "empleados" && (
                <TabEmpleados empresa={empresaLocal} token={token} addToast={addToast} />
            )}

            {/* Tab: Pagos */}
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

            {/* Tab: Historial */}
            {tab === "historial" && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h2 className="text-base font-semibold text-slate-800 mb-4">Timeline de eventos</h2>
                    {loadingHistorial ? (
                        <div className="space-y-4">
                            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                        </div>
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

            {/* Modal editar empresa */}
            {modalEditar && (
                <FormEmpresa
                    title="Editar empresa"
                    form={form}
                    setForm={setForm}
                    planes={planes}
                    guardando={guardando}
                    onClose={() => setModalEditar(false)}
                    onSave={guardarEdicion}
                />
            )}

            {/* Modal baja empresa */}
            {modalBaja && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4 space-y-4">
                        <h3 className="font-bold text-slate-900">¿Dar de baja a {empresaLocal.razon_social}?</h3>
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
                            <button
                                onClick={() => { setModalBaja(false); setMotivoBaja("") }}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarBaja}
                                disabled={guardando}
                                className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60"
                            >
                                {guardando ? "Procesando..." : "Confirmar baja"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
