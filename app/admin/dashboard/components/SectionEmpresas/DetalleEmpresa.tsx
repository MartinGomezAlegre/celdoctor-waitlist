"use client"
import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import type { Empresa, EmpresaAcuerdo, EventoHistorial, AdminPlan, EmpresaForm, ToastType } from "../../types"
import { EMPRESA_FORM_VACIO } from "../../types"
import { API, authHeaders, fmtCurrency, fmtDate, diasParaVencer, getApiErrorDetail } from "../../lib"
import { Skeleton } from "../shared/Skeleton"
import { StatBadge } from "../shared/StatBadge"
import { FormEmpresa } from "./FormEmpresa"
import { TabEmpleados } from "./TabEmpleados"

type TabDetalle = "info" | "empleados" | "acuerdos" | "pagos" | "historial"

const ACUERDO_FORM_VACIO = {
    tipo: "contrato",
    titulo: "",
    descripcion: "",
    estado: "vigente",
    fecha_firma: "",
    fecha_vencimiento: "",
    archivo_url: "",
    notas: "",
}

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
    currentRole: string | null
    addToast: (msg: string, type: ToastType) => void
    planes: AdminPlan[]
    onVolver: () => void
}

export function DetalleEmpresa({ empresa, token, currentRole, addToast, planes, onVolver }: Props) {
    const [tab, setTab] = useState<TabDetalle>("info")
    const [empresaLocal, setEmpresaLocal] = useState<Empresa>(empresa)
    const [historial, setHistorial] = useState<EventoHistorial[]>([])
    const [loadingHistorial, setLoadingHistorial] = useState(false)
    const [hasFetchedHistorial, setHasFetchedHistorial] = useState(false)
    const [acuerdos, setAcuerdos] = useState<EmpresaAcuerdo[]>([])
    const [loadingAcuerdos, setLoadingAcuerdos] = useState(false)
    const [hasFetchedAcuerdos, setHasFetchedAcuerdos] = useState(false)
    const [modalAcuerdo, setModalAcuerdo] = useState(false)
    const [acuerdoEditando, setAcuerdoEditando] = useState<EmpresaAcuerdo | null>(null)
    const [formAcuerdo, setFormAcuerdo] = useState(ACUERDO_FORM_VACIO)
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
        setAcuerdos([])
        setHasFetchedAcuerdos(false)
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

    useEffect(() => {
        if (currentRole !== "admin") return
        if (tab === "acuerdos" && !hasFetchedAcuerdos) {
            setHasFetchedAcuerdos(true)
            setLoadingAcuerdos(true)
            fetch(`${API}/admin/empresas/${empresaLocal.id}/acuerdos`, { headers: authHeaders(token) })
                .then((r) => r.json())
                .then((d: unknown) => setAcuerdos(Array.isArray(d) ? (d as EmpresaAcuerdo[]) : []))
                .catch(() => setAcuerdos([]))
                .finally(() => setLoadingAcuerdos(false))
        }
    }, [currentRole, tab, hasFetchedAcuerdos, empresaLocal.id, token])

    function abrirEditar() {
        setForm({
            razon_social: empresaLocal.razon_social,
            cuit: empresaLocal.cuit,
            nombre_comercial: empresaLocal.nombre_comercial ?? "",
            rubro: empresaLocal.rubro ?? "",
            direccion: empresaLocal.direccion ?? "",
            localidad: empresaLocal.localidad ?? "",
            provincia: empresaLocal.provincia ?? "",
            responsabilidad_iva: empresaLocal.responsabilidad_iva ?? "",
            contacto_nombre: empresaLocal.contacto_nombre,
            contacto_cargo: empresaLocal.contacto_cargo ?? "",
            contacto_email: empresaLocal.contacto_email,
            contacto_telefono: empresaLocal.contacto_telefono ?? "",
            admin_access_email: empresaLocal.admin_access_email ?? "",
            admin_access_password: "",
            visible_para_gestores: Boolean(empresaLocal.visible_para_gestores),
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

    function abrirNuevoAcuerdo() {
        setAcuerdoEditando(null)
        setFormAcuerdo(ACUERDO_FORM_VACIO)
        setModalAcuerdo(true)
    }

    function abrirEditarAcuerdo(acuerdo: EmpresaAcuerdo) {
        setAcuerdoEditando(acuerdo)
        setFormAcuerdo({
            tipo: acuerdo.tipo ?? "contrato",
            titulo: acuerdo.titulo ?? "",
            descripcion: acuerdo.descripcion ?? "",
            estado: acuerdo.estado ?? "vigente",
            fecha_firma: acuerdo.fecha_firma ?? "",
            fecha_vencimiento: acuerdo.fecha_vencimiento ?? "",
            archivo_url: acuerdo.archivo_url ?? "",
            notas: acuerdo.notas ?? "",
        })
        setModalAcuerdo(true)
    }

    async function guardarAcuerdo() {
        setGuardando(true)
        try {
            const payload = {
                ...formAcuerdo,
                descripcion: formAcuerdo.descripcion || null,
                fecha_firma: formAcuerdo.fecha_firma || null,
                fecha_vencimiento: formAcuerdo.fecha_vencimiento || null,
                archivo_url: formAcuerdo.archivo_url || null,
                notas: formAcuerdo.notas || null,
            }
            const endpoint = acuerdoEditando
                ? `${API}/admin/empresas/${empresaLocal.id}/acuerdos/${acuerdoEditando.id}`
                : `${API}/admin/empresas/${empresaLocal.id}/acuerdos`
            const method = acuerdoEditando ? "PUT" : "POST"
            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify(payload),
            })
            if (!res.ok) throw new Error(await getApiErrorDetail(res, "No pudimos guardar el acuerdo."))

            const saved = (await res.json()) as EmpresaAcuerdo
            setAcuerdos((prev) => acuerdoEditando ? prev.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...prev])
            addToast(acuerdoEditando ? "Acuerdo actualizado." : "Acuerdo cargado correctamente.", "success")
            setModalAcuerdo(false)
            setAcuerdoEditando(null)
            setFormAcuerdo(ACUERDO_FORM_VACIO)
        } catch (error) {
            addToast(error instanceof Error ? error.message : "No pudimos guardar el acuerdo.", "error")
        } finally {
            setGuardando(false)
        }
    }

    async function eliminarAcuerdo(acuerdo: EmpresaAcuerdo) {
        const confirmado = window.confirm(`¿Eliminar "${acuerdo.titulo}"?`)
        if (!confirmado) return

        setGuardando(true)
        try {
            const res = await fetch(`${API}/admin/empresas/${empresaLocal.id}/acuerdos/${acuerdo.id}`, {
                method: "DELETE",
                headers: authHeaders(token),
            })
            if (!res.ok) throw new Error(await getApiErrorDetail(res, "No pudimos eliminar el acuerdo."))
            setAcuerdos((prev) => prev.filter((item) => item.id !== acuerdo.id))
            addToast("Acuerdo eliminado.", "success")
        } catch (error) {
            addToast(error instanceof Error ? error.message : "No pudimos eliminar el acuerdo.", "error")
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
        ...(currentRole === "admin" ? [{ id: "acuerdos" as TabDetalle, label: "Acuerdos" }] : []),
        ...(currentRole === "admin" ? [{ id: "pagos" as TabDetalle, label: "Pagos" }] : []),
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
                        <InfoRow label="Responsabilidad IVA" value={empresaLocal.responsabilidad_iva} />
                        <InfoRow label="Direccion" value={empresaLocal.direccion} />
                        <InfoRow label="Localidad" value={empresaLocal.localidad} />
                        <InfoRow label="Provincia" value={empresaLocal.provincia} />
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                        <h3 className="font-semibold text-slate-800 text-sm">Contacto</h3>
                        <InfoRow label="Nombre" value={empresaLocal.contacto_nombre} />
                        <InfoRow label="Cargo" value={empresaLocal.contacto_cargo} />
                        <InfoRow label="Email" value={empresaLocal.contacto_email} />
                        <InfoRow label="Teléfono" value={empresaLocal.contacto_telefono} />
                        <InfoRow label="Visible para gestores" value={empresaLocal.visible_para_gestores ? "Si" : "No"} />
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                        <h3 className="font-semibold text-slate-800 text-sm">Suscripción</h3>
                        <InfoRow label="Plan" value={empresaLocal.plan_nombre} />
                        <InfoRow label="Empleados" value={`${empresaLocal.empleados_activos} activos / ${empresaLocal.cantidad_empleados} totales`} />
                        {currentRole === "admin" && (
                            <>
                                <InfoRow label="Precio por empleado" value={empresaLocal.precio_por_empleado ? fmtCurrency(empresaLocal.precio_por_empleado) : null} />
                                <InfoRow label="Precio total" value={empresaLocal.precio_total ? fmtCurrency(empresaLocal.precio_total) : null} />
                            </>
                        )}
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

            {/* Tab: Acuerdos */}
            {tab === "acuerdos" && currentRole === "admin" && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">Contratos y acuerdos</h2>
                            <p className="text-sm text-slate-500">Este bloque es visible solo para admin y sirve para centralizar convenios, contratos y notas clave.</p>
                        </div>
                        <button
                            onClick={abrirNuevoAcuerdo}
                            className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
                        >
                            Nuevo acuerdo
                        </button>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
                        {loadingAcuerdos ? (
                            <div className="space-y-3 p-5">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <Skeleton key={index} className="h-20 w-full" />
                                ))}
                            </div>
                        ) : acuerdos.length === 0 ? (
                            <div className="px-6 py-12 text-center text-sm text-slate-400">
                                Todavía no hay contratos o acuerdos cargados para esta empresa.
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {acuerdos.map((acuerdo) => (
                                    <div key={acuerdo.id} className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-start md:justify-between">
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-violet-700">
                                                    {acuerdo.tipo}
                                                </span>
                                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                                    {acuerdo.estado}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-900">{acuerdo.titulo}</h3>
                                                {acuerdo.descripcion && <p className="mt-1 text-sm text-slate-600">{acuerdo.descripcion}</p>}
                                            </div>
                                            <div className="grid grid-cols-1 gap-2 text-xs text-slate-500 md:grid-cols-2">
                                                <span>Firma: {acuerdo.fecha_firma ? fmtDate(acuerdo.fecha_firma) : "-"}</span>
                                                <span>Vencimiento: {acuerdo.fecha_vencimiento ? fmtDate(acuerdo.fecha_vencimiento) : "-"}</span>
                                                {acuerdo.archivo_url && (
                                                    <a
                                                        href={acuerdo.archivo_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="font-medium text-violet-600 hover:text-violet-700"
                                                    >
                                                        Abrir archivo
                                                    </a>
                                                )}
                                            </div>
                                            {acuerdo.notas && (
                                                <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                                                    {acuerdo.notas}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => abrirEditarAcuerdo(acuerdo)}
                                                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => void eliminarAcuerdo(acuerdo)}
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
                </div>
            )}

            {/* Tab: Pagos */}
            {tab === "pagos" && currentRole === "admin" && (
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
            {modalAcuerdo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="mx-4 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    {acuerdoEditando ? "Editar acuerdo" : "Nuevo acuerdo"}
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Cargá contratos, acuerdos, convenios y cualquier dato importante de esta empresa.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setModalAcuerdo(false)
                                    setAcuerdoEditando(null)
                                    setFormAcuerdo(ACUERDO_FORM_VACIO)
                                }}
                                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                            >
                                ×
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <label className="space-y-1.5 text-sm">
                                <span className="font-medium text-slate-700">Tipo</span>
                                <select
                                    value={formAcuerdo.tipo}
                                    onChange={(event) => setFormAcuerdo((prev) => ({ ...prev, tipo: event.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/30"
                                >
                                    <option value="contrato">Contrato</option>
                                    <option value="acuerdo">Acuerdo</option>
                                    <option value="convenio">Convenio</option>
                                    <option value="nda">NDA</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </label>

                            <label className="space-y-1.5 text-sm">
                                <span className="font-medium text-slate-700">Estado</span>
                                <select
                                    value={formAcuerdo.estado}
                                    onChange={(event) => setFormAcuerdo((prev) => ({ ...prev, estado: event.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/30"
                                >
                                    <option value="vigente">Vigente</option>
                                    <option value="borrador">Borrador</option>
                                    <option value="vencido">Vencido</option>
                                    <option value="rescindido">Rescindido</option>
                                </select>
                            </label>

                            <label className="space-y-1.5 text-sm md:col-span-2">
                                <span className="font-medium text-slate-700">Título</span>
                                <input
                                    type="text"
                                    value={formAcuerdo.titulo}
                                    onChange={(event) => setFormAcuerdo((prev) => ({ ...prev, titulo: event.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/30"
                                    placeholder="Ej: Convenio comercial 2026"
                                />
                            </label>

                            <label className="space-y-1.5 text-sm md:col-span-2">
                                <span className="font-medium text-slate-700">Descripción</span>
                                <textarea
                                    value={formAcuerdo.descripcion}
                                    onChange={(event) => setFormAcuerdo((prev) => ({ ...prev, descripcion: event.target.value }))}
                                    rows={3}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/30"
                                    placeholder="Resumen corto del acuerdo"
                                />
                            </label>

                            <label className="space-y-1.5 text-sm">
                                <span className="font-medium text-slate-700">Fecha de firma</span>
                                <input
                                    type="date"
                                    value={formAcuerdo.fecha_firma}
                                    onChange={(event) => setFormAcuerdo((prev) => ({ ...prev, fecha_firma: event.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/30"
                                />
                            </label>

                            <label className="space-y-1.5 text-sm">
                                <span className="font-medium text-slate-700">Fecha de vencimiento</span>
                                <input
                                    type="date"
                                    value={formAcuerdo.fecha_vencimiento}
                                    onChange={(event) => setFormAcuerdo((prev) => ({ ...prev, fecha_vencimiento: event.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/30"
                                />
                            </label>

                            <label className="space-y-1.5 text-sm md:col-span-2">
                                <span className="font-medium text-slate-700">URL del archivo</span>
                                <input
                                    type="url"
                                    value={formAcuerdo.archivo_url}
                                    onChange={(event) => setFormAcuerdo((prev) => ({ ...prev, archivo_url: event.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/30"
                                    placeholder="https://..."
                                />
                            </label>

                            <label className="space-y-1.5 text-sm md:col-span-2">
                                <span className="font-medium text-slate-700">Notas internas</span>
                                <textarea
                                    value={formAcuerdo.notas}
                                    onChange={(event) => setFormAcuerdo((prev) => ({ ...prev, notas: event.target.value }))}
                                    rows={3}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/30"
                                    placeholder="Observaciones o puntos a recordar"
                                />
                            </label>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setModalAcuerdo(false)
                                    setAcuerdoEditando(null)
                                    setFormAcuerdo(ACUERDO_FORM_VACIO)
                                }}
                                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => void guardarAcuerdo()}
                                disabled={guardando || !formAcuerdo.titulo.trim()}
                                className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {guardando ? "Guardando..." : acuerdoEditando ? "Guardar cambios" : "Crear acuerdo"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal editar empresa */}
            {modalEditar && (
                <FormEmpresa
                    title="Editar empresa"
                    form={form}
                    setForm={setForm}
                    planes={planes}
                    hasExistingAccess={!!empresaLocal.admin_user_id}
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
