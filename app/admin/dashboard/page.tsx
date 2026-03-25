"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    LineChart, Line, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
    LayoutDashboard, Users, CreditCard, Package,
    LogOut, TrendingUp, Download, ToggleLeft, ToggleRight,
    Clock, Building2, ArrowLeft, Plus, Upload,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Alerta {
    tipo: "pendientes_pago" | "sin_convertir" | "exportar_mediquo";
    cantidad: number;
    mensaje: string;
}

interface UltimaSuscripcion {
    id: number;
    usuario_nombre: string;
    usuario_email: string;
    plan_nombre: string;
    estado: string;
    created_at: string;
}

interface RevenuePlan {
    plan: string;
    suscriptores: number;
    revenue: number;
}

interface DashboardMetrics {
    mrr: number;
    arr: number;
    suscriptores_activos: number;
    nuevos_hoy: number;
    churn_rate: number;
    tasa_conversion: number;
    pendientes_pago: number;
    revenue_por_plan: RevenuePlan[];
    nuevos_registros_hoy: number;
    ultimas_suscripciones: UltimaSuscripcion[];
}

interface MetricasEmpresas {
    empresas_activas: number;
    empleados_activos: number;
    mrr_empresarial: number;
    empresas_vencen_esta_semana: number;
    empresas_pendiente_pago: number;
}

interface GraficoPoint {
    fecha: string;
    nuevas: number;
    total_acumulado: number;
}

interface AdminUsuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    dni: string | null;
    fecha_nacimiento: string;
    rol: string;
    activo: boolean;
    created_at: string;
}

interface AdminSuscripcion {
    id: number;
    nombre_completo: string;
    email: string;
    plan_nombre: string;
    precio_pagado: number;
    estado: string;
    fecha_inicio: string;
    created_at: string;
}

interface AdminPlan {
    id: number;
    nombre: string;
    precio_mensual: number;
    activo: boolean;
    descripcion: string;
}

interface Empresa {
    id: number;
    razon_social: string;
    nombre_comercial: string | null;
    cuit: string;
    rubro: string | null;
    contacto_nombre: string;
    contacto_cargo: string | null;
    contacto_email: string;
    contacto_telefono: string | null;
    activo: boolean;
    created_at: string;
    plan_nombre: string | null;
    plan_id: number | null;
    cantidad_empleados: number;
    precio_por_empleado: number | null;
    precio_total: number | null;
    periodicidad: string | null;
    estado_suscripcion: string | null;
    fecha_inicio_suscripcion: string | null;
    fecha_vencimiento: string | null;
    empleados_activos: number;
    empleados_total: number;
    historial?: EventoHistorial[];
}

interface EmpleadoEmpresa {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    cargo: string | null;
    activo: boolean;
    fecha_alta: string;
}

interface EventoHistorial {
    descripcion: string;
    fecha: string;
}

interface ResultadoBulk {
    cargados: number;
    fallidos: number;
    errores: string[];
}

type Section = "dashboard" | "usuarios" | "suscripciones" | "planes" | "empresas";
type ToastType = "success" | "error" | "warning";

interface Toast {
    id: number;
    msg: string;
    type: ToastType;
}

const EMPRESA_FORM_VACIO = {
    razon_social: "",
    cuit: "",
    nombre_comercial: "",
    rubro: "",
    contacto_nombre: "",
    contacto_cargo: "",
    contacto_email: "",
    contacto_telefono: "",
    plan_id: "",
    cantidad_empleados: "",
    precio_por_empleado: "",
    periodicidad: "mensual",
};
type EmpresaForm = typeof EMPRESA_FORM_VACIO;

const EMPLEADO_FORM_VACIO = {
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    cargo: "",
};
type EmpleadoForm = typeof EMPLEADO_FORM_VACIO;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const API = "/api/proxy";

function authHeaders(token: string): Record<string, string> {
    return { Authorization: `Bearer ${token}` };
}

function fmtCurrency(n: number) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency", currency: "ARS", maximumFractionDigits: 0,
    }).format(n);
}

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-AR");
}

function tiempoRelativo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `hace ${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `hace ${hrs}h`;
    return new Date(iso).toLocaleDateString("es-AR");
}

function diasParaVencer(fecha: string): number {
    return Math.ceil((new Date(fecha).getTime() - Date.now()) / 86400000);
}

const ESTADO_BADGE: Record<string, string> = {
    activa: "bg-emerald-100 text-emerald-800",
    pendiente_pago: "bg-yellow-100 text-amber-700",
    cancelada: "bg-red-100 text-red-800",
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse bg-slate-200 rounded-lg ${className ?? ""}`} />;
}

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [section, setSection] = useState<Section>("dashboard");
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        const t = localStorage.getItem("celdoctor_admin_token");
        if (!t) { router.replace("/admin"); return; }
        setToken(t);
    }, [router]);

    function addToast(msg: string, type: ToastType) {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, msg, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }

    function logout() {
        localStorage.removeItem("celdoctor_admin_token");
        router.replace("/admin");
    }

    if (!token) return null;

    const NAV: { id: Section; label: string; Icon: React.ElementType }[] = [
        { id: "dashboard",     label: "Dashboard",      Icon: LayoutDashboard },
        { id: "usuarios",      label: "Usuarios",       Icon: Users },
        { id: "suscripciones", label: "Suscripciones",  Icon: CreditCard },
        { id: "planes",        label: "Planes",         Icon: Package },
        { id: "empresas",      label: "Empresas",       Icon: Building2 },
    ];

    return (
        <div className="flex min-h-screen bg-slate-100">
            <aside className="w-60 bg-[#1e0b4b] flex flex-col shrink-0">
                <div className="px-6 py-6 border-b border-white/10">
                    <span className="text-xl font-black text-white tracking-tight">CELDOCTOR.</span>
                    <p className="text-white/40 text-xs mt-0.5">Admin Panel</p>
                </div>
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {NAV.map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            onClick={() => setSection(id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                section === id
                                    ? "bg-white/15 text-white"
                                    : "text-white/60 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            <Icon size={16} />
                            {label}
                        </button>
                    ))}
                </nav>
                <div className="px-3 py-4 border-t border-white/10">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <LogOut size={16} />
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-auto p-8">
                {section === "dashboard"     && <SectionDashboard token={token} addToast={addToast} onNavigate={setSection} />}
                {section === "usuarios"      && <SectionUsuarios token={token} addToast={addToast} />}
                {section === "suscripciones" && <SectionSuscripciones token={token} addToast={addToast} />}
                {section === "planes"        && <SectionPlanes token={token} addToast={addToast} />}
                {section === "empresas"      && <SectionEmpresas token={token} addToast={addToast} />}
            </main>

            <div className="fixed bottom-4 right-4 z-50 space-y-2">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${
                            t.type === "success" ? "bg-emerald-500 text-white" :
                            t.type === "error"   ? "bg-red-500 text-white" :
                                                   "bg-amber-500 text-white"
                        }`}
                    >
                        {t.type === "success" ? "✓" : t.type === "error" ? "✗" : "⚠"}
                        {t.msg}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Section: Dashboard ───────────────────────────────────────────────────────

function SectionDashboard({
    token, addToast, onNavigate,
}: {
    token: string;
    addToast: (msg: string, type: ToastType) => void;
    onNavigate: (s: Section) => void;
}) {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [metricasEmpresas, setMetricasEmpresas] = useState<MetricasEmpresas | null>(null);
    const [grafico, setGrafico] = useState<GraficoPoint[]>([]);
    const [alertas, setAlertas] = useState<Alerta[]>([]);
    const [loadingMetrics, setLoadingMetrics] = useState(true);
    const [loadingGrafico, setLoadingGrafico] = useState(true);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        fetch(`${API}/admin/dashboard`, { headers: authHeaders(token) })
            .then((r) => r.json())
            .then((d: DashboardMetrics) => setMetrics(d))
            .catch(() => null)
            .finally(() => setLoadingMetrics(false));

        fetch(`${API}/admin/metricas-grafico`, { headers: authHeaders(token) })
            .then((r) => r.json())
            .then((d: unknown) => setGrafico(Array.isArray(d) ? (d as GraficoPoint[]) : []))
            .catch(() => setGrafico([]))
            .finally(() => setLoadingGrafico(false));

        fetch(`${API}/admin/alertas`, { headers: authHeaders(token) })
            .then((r) => r.json())
            .then((d: unknown) => setAlertas(Array.isArray(d) ? (d as Alerta[]) : []))
            .catch(() => setAlertas([]));

        fetch(`${API}/admin/metricas-empresas`, { headers: authHeaders(token) })
            .then((r) => r.json())
            .then((d: MetricasEmpresas) => setMetricasEmpresas(d))
            .catch(() => null);
    }, [token]);

    async function exportarExcel() {
        setExporting(true);
        try {
            const res = await fetch(`${API}/admin/exportar-excel`, { headers: authHeaders(token) });
            if (res.ok) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                const fecha = new Date().toISOString().split("T")[0];
                a.href = url;
                a.download = `suscriptores_${fecha}.xlsx`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                addToast("Excel exportado correctamente", "success");
            } else {
                addToast("Error al exportar el archivo", "error");
            }
        } catch {
            addToast("Error al exportar el archivo", "error");
        } finally {
            setExporting(false);
        }
    }

    const graficoData = Array.isArray(grafico) ? grafico : [];
    const revenuePlan = Array.isArray(metrics?.revenue_por_plan) ? metrics!.revenue_por_plan : [];
    const ultimasSubs = Array.isArray(metrics?.ultimas_suscripciones) ? metrics!.ultimas_suscripciones : [];

    function KpiCard({ label, sub, value, Icon, color, highlight }: {
        label: string; sub?: string; value: string | null;
        Icon: React.ElementType; color: string; highlight?: boolean;
    }) {
        return (
            <div className={`bg-white rounded-2xl border p-6 shadow-sm ${highlight ? "border-amber-300 bg-amber-50/40" : "border-slate-100"}`}>
                <div className={`inline-flex p-2 rounded-xl bg-slate-50 mb-3 ${color}`}>
                    <Icon size={18} />
                </div>
                {loadingMetrics || value === null ? (
                    <Skeleton className="h-8 w-24 mb-1" />
                ) : (
                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                )}
                <p className="text-sm font-medium text-slate-700 mt-1">{label}</p>
                {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
            </div>
        );
    }

    const alertaConfig: Record<Alerta["tipo"], { bg: string; border: string; Icon: React.ElementType }> = {
        pendientes_pago:  { bg: "bg-amber-50",  border: "border-amber-300",  Icon: Clock },
        sin_convertir:    { bg: "bg-blue-50",   border: "border-blue-300",   Icon: Users },
        exportar_mediquo: { bg: "bg-violet-50", border: "border-violet-300", Icon: Download },
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <button
                    onClick={exportarExcel}
                    disabled={exporting}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#4C1D95] text-white rounded-xl text-sm font-semibold hover:bg-[#3b1675] transition-colors disabled:opacity-60"
                >
                    <Download size={15} />
                    {exporting ? "Exportando..." : "Exportar suscriptores de hoy"}
                </button>
            </div>

            {/* KPIs B2C — fila 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <KpiCard label="MRR" sub="Ingresos mensuales" value={metrics ? fmtCurrency(metrics.mrr) : null} Icon={TrendingUp} color="text-violet-600" />
                <KpiCard label="ARR" sub="Ingresos anuales proyectados" value={metrics ? fmtCurrency(metrics.arr) : null} Icon={TrendingUp} color="text-indigo-600" />
                <KpiCard label="Suscriptores activos" value={metrics ? String(metrics.suscriptores_activos) : null} Icon={Users} color="text-emerald-600" />
            </div>

            {/* KPIs B2C — fila 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <KpiCard label="Tasa de conversión" value={metrics ? `${metrics.tasa_conversion}%` : null} Icon={TrendingUp} color="text-blue-600" />
                <KpiCard label="Pendientes de pago" value={metrics ? String(metrics.pendientes_pago) : null} Icon={Clock} color="text-amber-600" highlight={(metrics?.pendientes_pago ?? 0) > 0} />
                <KpiCard label="Churn rate" value={metrics ? `${metrics.churn_rate}%` : null} Icon={TrendingUp} color="text-red-500" />
            </div>

            {/* KPIs B2B — empresas */}
            <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Empresas B2B</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <KpiCard label="Empresas activas" value={metricasEmpresas ? String(metricasEmpresas.empresas_activas) : null} Icon={Building2} color="text-indigo-600" />
                    <KpiCard label="Empleados activos" value={metricasEmpresas ? String(metricasEmpresas.empleados_activos) : null} Icon={Users} color="text-blue-600" />
                    <KpiCard label="MRR Empresarial" value={metricasEmpresas ? fmtCurrency(metricasEmpresas.mrr_empresarial) : null} Icon={TrendingUp} color="text-violet-600" />
                </div>
            </div>

            {/* Alertas del sistema */}
            {alertas.length > 0 && (
                <div className="space-y-2">
                    {alertas.map((alerta, i) => {
                        const cfg = alertaConfig[alerta.tipo];
                        return (
                            <div key={i} className={`flex items-center gap-4 px-5 py-4 rounded-2xl border ${cfg.bg} ${cfg.border}`}>
                                <cfg.Icon size={18} className="text-slate-600 shrink-0" />
                                <p className="text-sm text-slate-700 flex-1">{alerta.mensaje}</p>
                                {alerta.tipo === "exportar_mediquo" && (
                                    <button onClick={exportarExcel} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4C1D95] text-white rounded-xl text-xs font-semibold hover:bg-[#3b1675] transition-colors shrink-0">
                                        Exportar ahora
                                        <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">{alerta.cantidad}</span>
                                    </button>
                                )}
                                {alerta.tipo !== "exportar_mediquo" && alerta.cantidad > 0 && (
                                    <span className="bg-white/60 border border-slate-200 px-2.5 py-1 rounded-full text-xs font-bold text-slate-700 shrink-0">{alerta.cantidad}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Alertas B2B */}
            {metricasEmpresas && (metricasEmpresas.empresas_vencen_esta_semana > 0 || metricasEmpresas.empresas_pendiente_pago > 0) && (
                <div className="space-y-2">
                    {metricasEmpresas.empresas_vencen_esta_semana > 0 && (
                        <div className="flex items-center gap-4 px-5 py-4 rounded-2xl border bg-orange-50 border-orange-300">
                            <Clock size={18} className="text-orange-600 shrink-0" />
                            <p className="text-sm text-slate-700 flex-1">
                                <strong>{metricasEmpresas.empresas_vencen_esta_semana}</strong> empresa{metricasEmpresas.empresas_vencen_esta_semana > 1 ? "s" : ""} vencen esta semana
                            </p>
                            <button onClick={() => onNavigate("empresas")} className="px-3 py-1.5 bg-orange-500 text-white rounded-xl text-xs font-semibold hover:bg-orange-600 transition-colors shrink-0">
                                Ver empresas
                            </button>
                        </div>
                    )}
                    {metricasEmpresas.empresas_pendiente_pago > 0 && (
                        <div className="flex items-center gap-4 px-5 py-4 rounded-2xl border bg-amber-50 border-amber-300">
                            <Clock size={18} className="text-amber-600 shrink-0" />
                            <p className="text-sm text-slate-700 flex-1">
                                <strong>{metricasEmpresas.empresas_pendiente_pago}</strong> empresa{metricasEmpresas.empresas_pendiente_pago > 1 ? "s" : ""} con pago pendiente
                            </p>
                            <span className="bg-white/60 border border-slate-200 px-2.5 py-1 rounded-full text-xs font-bold text-slate-700 shrink-0">{metricasEmpresas.empresas_pendiente_pago}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Gráfico de línea */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h2 className="text-base font-semibold text-slate-800 mb-6">Nuevas suscripciones (últimos 30 días)</h2>
                {loadingGrafico ? (
                    <Skeleton className="h-64 w-full" />
                ) : graficoData.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-slate-400 text-sm">Sin datos suficientes para mostrar el gráfico</div>
                ) : (
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={graficoData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="fecha" tick={{ fontSize: 12 }} tickFormatter={(v: string) => v.slice(5)} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 13 }} />
                            <Line type="monotone" dataKey="nuevas" stroke="#4C1D95" strokeWidth={2.5} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Gráfico de barras */}
            {!loadingMetrics && revenuePlan.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <h2 className="text-base font-semibold text-slate-800 mb-6">Revenue por plan</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={revenuePlan}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="plan" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                            <Tooltip formatter={(v: unknown) => [fmtCurrency(v as number), "Revenue"]} contentStyle={{ borderRadius: "12px", fontSize: 13 }} />
                            <Bar dataKey="revenue" fill="#4C1D95" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Actividad reciente */}
            {!loadingMetrics && ultimasSubs.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <h2 className="text-base font-semibold text-slate-800 mb-4">Actividad reciente</h2>
                    <div className="space-y-4">
                        {ultimasSubs.slice(0, 5).map((s) => (
                            <div key={s.id} className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-full bg-[#4C1D95]/10 flex items-center justify-center shrink-0">
                                    <span className="text-sm font-bold text-[#4C1D95]">{s.usuario_nombre.charAt(0).toUpperCase()}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">{s.usuario_nombre}</p>
                                    <p className="text-xs text-slate-400 truncate">{s.usuario_email}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ESTADO_BADGE[s.estado] ?? "bg-slate-100 text-slate-600"}`}>{s.plan_nombre}</span>
                                    <p className="text-xs text-slate-400 mt-1">{tiempoRelativo(s.created_at)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Section: Usuarios ────────────────────────────────────────────────────────

function SectionUsuarios({ token, addToast }: { token: string; addToast: (msg: string, type: ToastType) => void }) {
    const [usuarios, setUsuarios] = useState<AdminUsuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [buscar, setBuscar] = useState("");
    const [modalBaja, setModalBaja] = useState<AdminUsuario | null>(null);
    const [motivoBaja, setMotivoBaja] = useState("");
    const [procesando, setProcesando] = useState(false);

    useEffect(() => {
        setLoading(true); setError(false);
        fetch(`${API}/admin/usuarios`, { headers: authHeaders(token) })
            .then((r) => r.json())
            .then((d: unknown) => setUsuarios(Array.isArray(d) ? (d as AdminUsuario[]) : []))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [token]);

    async function cambiarEstadoUsuario(usuario: AdminUsuario, activo: boolean) {
        setProcesando(true);
        try {
            const res = await fetch(`${API}/admin/usuarios/${usuario.id}/estado`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify({ activo, motivo: motivoBaja }),
            });
            if (!res.ok) throw new Error();
            setUsuarios((prev) => prev.map((u) => u.id === usuario.id ? { ...u, activo } : u));
            addToast(`Usuario ${usuario.nombre} ${activo ? "dado de alta" : "dado de baja"} correctamente`, "success");
        } catch {
            addToast("Error al cambiar el estado del usuario", "error");
        } finally {
            setProcesando(false); setModalBaja(null); setMotivoBaja("");
        }
    }

    const filtrados = usuarios.filter((u) => {
        const q = buscar.toLowerCase();
        return u.nombre.toLowerCase().includes(q) || u.apellido.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>
                <input type="search" placeholder="Buscar por nombre o email..." value={buscar} onChange={(e) => setBuscar(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] w-72" />
            </div>

            {error ? (
                <div className="bg-red-50 border border-red-100 rounded-2xl px-6 py-4 text-sm text-red-600">Error al cargar usuarios</div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                {["Nombre", "Email", "DNI", "Teléfono", "Rol", "Estado", "Registro", "Acciones"].map((h) => (
                                    <th key={h} className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading
                                ? Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i} className="border-b border-slate-50">
                                        {Array.from({ length: 8 }).map((_, j) => <td key={j} className="px-5 py-3.5"><Skeleton className="h-4 w-full" /></td>)}
                                    </tr>
                                ))
                                : filtrados.map((u) => (
                                    <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-3.5 font-medium text-slate-900 whitespace-nowrap">{u.nombre} {u.apellido}</td>
                                        <td className="px-5 py-3.5 text-slate-600">{u.email}</td>
                                        <td className="px-5 py-3.5 text-slate-600">{u.dni ?? "—"}</td>
                                        <td className="px-5 py-3.5 text-slate-600">{u.telefono}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.rol === "admin" ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-600"}`}>{u.rol}</span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${u.activo ? "text-emerald-600" : "text-red-500"}`}>
                                                <span className={`w-2 h-2 rounded-full ${u.activo ? "bg-emerald-500" : "bg-red-400"}`} />
                                                {u.activo ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{fmtDate(u.created_at)}</td>
                                        <td className="px-5 py-3.5">
                                            <button onClick={() => setModalBaja(u)}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${u.activo ? "border-red-200 text-red-600 hover:bg-red-50" : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"}`}>
                                                {u.activo ? "Dar de baja" : "Dar de alta"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {!loading && filtrados.length === 0 && <p className="text-center text-slate-400 py-12 text-sm">No se encontraron usuarios.</p>}
                </div>
            )}

            {modalBaja && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4 space-y-4">
                        <h3 className="font-bold text-slate-900">{modalBaja.activo ? "Dar de baja" : "Dar de alta"} a {modalBaja.nombre}</h3>
                        <textarea placeholder="Motivo (opcional)" value={motivoBaja} onChange={(e) => setMotivoBaja(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30" />
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => { setModalBaja(null); setMotivoBaja(""); }}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancelar</button>
                            <button onClick={() => cambiarEstadoUsuario(modalBaja, !modalBaja.activo)} disabled={procesando}
                                className={`px-4 py-2 rounded-xl text-white text-sm font-semibold disabled:opacity-60 ${modalBaja.activo ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"}`}>
                                {procesando ? "Procesando..." : "Confirmar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Section: Suscripciones ───────────────────────────────────────────────────

function SectionSuscripciones({ token, addToast }: { token: string; addToast: (msg: string, type: ToastType) => void }) {
    const [suscripciones, setSuscripciones] = useState<AdminSuscripcion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [filtroEstado, setFiltroEstado] = useState("");
    const [modalGestion, setModalGestion] = useState<AdminSuscripcion | null>(null);
    const [nuevoEstado, setNuevoEstado] = useState("");
    const [motivoGestion, setMotivoGestion] = useState("");
    const [procesando, setProcesando] = useState(false);

    useEffect(() => {
        setLoading(true); setError(false);
        const qs = filtroEstado ? `?estado=${filtroEstado}` : "";
        fetch(`${API}/admin/suscripciones${qs}`, { headers: authHeaders(token) })
            .then((r) => r.json())
            .then((d: unknown) => setSuscripciones(Array.isArray(d) ? (d as AdminSuscripcion[]) : []))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [token, filtroEstado]);

    async function cambiarEstadoSuscripcion() {
        if (!modalGestion || !nuevoEstado) return;
        setProcesando(true);
        try {
            const res = await fetch(`${API}/admin/suscripciones/${modalGestion.id}/estado`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify({ estado: nuevoEstado, motivo: motivoGestion }),
            });
            if (!res.ok) throw new Error();
            setSuscripciones((prev) => prev.map((s) => s.id === modalGestion.id ? { ...s, estado: nuevoEstado } : s));
            addToast("Suscripción actualizada correctamente", "success");
        } catch {
            addToast("Error al actualizar la suscripción", "error");
        } finally {
            setProcesando(false); setModalGestion(null); setNuevoEstado(""); setMotivoGestion("");
        }
    }

    const activas = suscripciones.filter((s) => s.estado === "activa").length;
    const pendientes = suscripciones.filter((s) => s.estado === "pendiente_pago").length;
    const canceladas = suscripciones.filter((s) => s.estado === "cancelada").length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold text-slate-900">Suscripciones</h1>
                    {!loading && (
                        <>
                            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">{activas} Activas</span>
                            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 text-amber-700">{pendientes} Pendientes</span>
                            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">{canceladas} Canceladas</span>
                        </>
                    )}
                </div>
                <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]">
                    <option value="">Todos los estados</option>
                    <option value="activa">Activa</option>
                    <option value="pendiente_pago">Pendiente de pago</option>
                    <option value="cancelada">Cancelada</option>
                </select>
            </div>

            {error ? (
                <div className="bg-red-50 border border-red-100 rounded-2xl px-6 py-4 text-sm text-red-600">Error al cargar suscripciones</div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                {["Usuario", "Email", "Plan", "Estado", "Precio", "Fecha", "Acciones"].map((h) => (
                                    <th key={h} className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading
                                ? Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i} className="border-b border-slate-50">
                                        {Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-5 py-3.5"><Skeleton className="h-4 w-full" /></td>)}
                                    </tr>
                                ))
                                : suscripciones.map((s) => (
                                    <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-3.5 font-medium text-slate-900 whitespace-nowrap">{s.nombre_completo}</td>
                                        <td className="px-5 py-3.5 text-slate-600">{s.email}</td>
                                        <td className="px-5 py-3.5 text-slate-700">{s.plan_nombre}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ESTADO_BADGE[s.estado] ?? "bg-slate-100 text-slate-600"}`}>
                                                {s.estado.replace(/_/g, " ")}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-700 whitespace-nowrap">{fmtCurrency(s.precio_pagado)}</td>
                                        <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{fmtDate(s.fecha_inicio)}</td>
                                        <td className="px-5 py-3.5">
                                            <button onClick={() => { setModalGestion(s); setNuevoEstado(""); setMotivoGestion(""); }}
                                                className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                                                Gestionar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {!loading && suscripciones.length === 0 && <p className="text-center text-slate-400 py-12 text-sm">No hay suscripciones.</p>}
                </div>
            )}

            {modalGestion && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4 space-y-4">
                        <h3 className="font-bold text-slate-900">Gestionar suscripción de {modalGestion.nombre_completo}</h3>
                        <p className="text-sm text-slate-500">
                            Plan: {modalGestion.plan_nombre} · Estado actual:{" "}
                            <span className={`font-semibold ${modalGestion.estado === "activa" ? "text-emerald-600" : modalGestion.estado === "pendiente_pago" ? "text-amber-600" : "text-red-600"}`}>
                                {modalGestion.estado.replace(/_/g, " ")}
                            </span>
                        </p>
                        <select value={nuevoEstado} onChange={(e) => setNuevoEstado(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30">
                            <option value="">Seleccionar nuevo estado</option>
                            {modalGestion.estado !== "activa" && <option value="activa">✓ Activar suscripción</option>}
                            {modalGestion.estado !== "pendiente_pago" && <option value="pendiente_pago">⏳ Marcar como pendiente</option>}
                            {modalGestion.estado !== "cancelada" && <option value="cancelada">✗ Cancelar suscripción</option>}
                        </select>
                        <textarea placeholder="Motivo del cambio (opcional)" value={motivoGestion} onChange={(e) => setMotivoGestion(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30" />
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => { setModalGestion(null); setNuevoEstado(""); setMotivoGestion(""); }}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancelar</button>
                            <button onClick={cambiarEstadoSuscripcion} disabled={!nuevoEstado || procesando}
                                className="px-4 py-2 rounded-xl bg-[#4C1D95] text-white text-sm font-semibold hover:bg-[#3b1675] disabled:opacity-60">
                                {procesando ? "Procesando..." : "Confirmar cambio"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Section: Planes ──────────────────────────────────────────────────────────

function SectionPlanes({ token, addToast }: { token: string; addToast: (msg: string, type: ToastType) => void }) {
    const [planes, setPlanes] = useState<AdminPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [editPrecio, setEditPrecio] = useState<Record<number, string>>({});
    const [confirmModal, setConfirmModal] = useState<{ id: number; campo: "activo" | "precio"; valor: boolean | number } | null>(null);
    const [saving, setSaving] = useState<number | null>(null);

    const fetchPlanes = useCallback(async () => {
        setLoading(true);
        try {
            const r = await fetch(`${API}/planes`);
            const d: unknown = await r.json();
            const lista = Array.isArray(d) ? (d as AdminPlan[]) : [];
            setPlanes(lista);
            const precios: Record<number, string> = {};
            lista.forEach((p) => { precios[p.id] = String(p.precio_mensual); });
            setEditPrecio(precios);
        } catch { setPlanes([]); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchPlanes(); }, [fetchPlanes]);

    async function guardarCambio(id: number, activo: boolean, precio: number) {
        setSaving(id);
        try {
            await fetch(`${API}/admin/planes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify({ activo, precio_mensual: precio }),
            });
            await fetchPlanes();
            addToast("Plan actualizado correctamente", "success");
        } catch { addToast("Error al guardar el plan", "error"); }
        finally { setSaving(null); setConfirmModal(null); }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Planes</h1>
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48" />)}
                </div>
            ) : planes.length === 0 ? (
                <p className="text-slate-400 text-sm">No hay planes disponibles.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {planes.map((plan) => {
                        const precioEditable = editPrecio[plan.id] ?? String(plan.precio_mensual);
                        const precioNum = parseFloat(precioEditable);
                        const precioValido = !isNaN(precioNum) && precioNum > 0;
                        return (
                            <div key={plan.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-base">{plan.nombre}</h3>
                                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{plan.descripcion}</p>
                                    </div>
                                    <button onClick={() => setConfirmModal({ id: plan.id, campo: "activo", valor: !plan.activo })} className="shrink-0 mt-0.5">
                                        {plan.activo ? <ToggleRight size={28} className="text-emerald-500" /> : <ToggleLeft size={28} className="text-slate-300" />}
                                    </button>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500 mb-1 block">Precio mensual (ARS)</label>
                                    <div className="flex gap-2">
                                        <input type="number" min={0} value={precioEditable}
                                            onChange={(e) => setEditPrecio((prev) => ({ ...prev, [plan.id]: e.target.value }))}
                                            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]" />
                                        <button disabled={!precioValido || precioNum === plan.precio_mensual || saving === plan.id}
                                            onClick={() => setConfirmModal({ id: plan.id, campo: "precio", valor: precioNum })}
                                            className="px-3 py-2 bg-[#4C1D95] text-white rounded-xl text-xs font-semibold hover:bg-[#3b1675] disabled:opacity-40 disabled:cursor-not-allowed">
                                            {saving === plan.id ? "..." : "Guardar"}
                                        </button>
                                    </div>
                                </div>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-block ${plan.activo ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                                    {plan.activo ? "Activo" : "Inactivo"}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}

            {confirmModal && (() => {
                const plan = planes.find((p) => p.id === confirmModal.id);
                if (!plan) return null;
                const msg = confirmModal.campo === "activo"
                    ? `¿${confirmModal.valor ? "Activar" : "Desactivar"} el plan "${plan.nombre}"?`
                    : `¿Cambiar el precio de "${plan.nombre}" a ${fmtCurrency(confirmModal.valor as number)}?`;
                return (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4">
                            <p className="text-slate-900 font-semibold mb-6">{msg}</p>
                            <div className="flex gap-3 justify-end">
                                <button onClick={() => setConfirmModal(null)} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancelar</button>
                                <button onClick={() => {
                                    const activo = confirmModal.campo === "activo" ? (confirmModal.valor as boolean) : plan.activo;
                                    const precio = confirmModal.campo === "precio" ? (confirmModal.valor as number) : plan.precio_mensual;
                                    guardarCambio(plan.id, activo, precio);
                                }} disabled={saving === plan.id} className="px-4 py-2 rounded-xl bg-[#4C1D95] text-white text-sm font-semibold hover:bg-[#3b1675] disabled:opacity-60">
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}

// ─── Section: Empresas ────────────────────────────────────────────────────────

function SectionEmpresas({ token, addToast }: { token: string; addToast: (msg: string, type: ToastType) => void }) {
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [buscar, setBuscar] = useState("");
    const [vistaDetalle, setVistaDetalle] = useState<Empresa | null>(null);
    const [modalNueva, setModalNueva] = useState(false);
    const [modalEditar, setModalEditar] = useState<Empresa | null>(null);
    const [modalBaja, setModalBaja] = useState<Empresa | null>(null);
    const [motivoBaja, setMotivoBaja] = useState("");
    const [form, setForm] = useState<EmpresaForm>(EMPRESA_FORM_VACIO);
    const [planes, setPlanes] = useState<AdminPlan[]>([]);
    const [guardando, setGuardando] = useState(false);

    const fetchEmpresas = useCallback(() => {
        setLoading(true); setError(false);
        fetch(`${API}/admin/empresas`, { headers: authHeaders(token) })
            .then((r) => r.json())
            .then((d: unknown) => setEmpresas(Array.isArray(d) ? (d as Empresa[]) : []))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [token]);

    useEffect(() => {
        fetchEmpresas();
        fetch(`${API}/planes`)
            .then((r) => r.json())
            .then((d: unknown) => setPlanes(Array.isArray(d) ? (d as AdminPlan[]) : []))
            .catch(() => null);
    }, [fetchEmpresas]);

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
        });
        setModalEditar(empresa);
    }

    async function guardarEmpresa() {
        setGuardando(true);
        const esEdicion = modalEditar !== null;
        const url = esEdicion ? `${API}/admin/empresas/${modalEditar!.id}` : `${API}/admin/empresas`;
        try {
            const res = await fetch(url, {
                method: esEdicion ? "PUT" : "POST",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error();
            addToast(`Empresa ${esEdicion ? "actualizada" : "creada"} correctamente`, "success");
            setModalNueva(false); setModalEditar(null); setForm(EMPRESA_FORM_VACIO);
            fetchEmpresas();
        } catch {
            addToast("Error al guardar la empresa", "error");
        } finally { setGuardando(false); }
    }

    async function darDeBaja() {
        if (!modalBaja) return;
        setGuardando(true);
        try {
            const res = await fetch(`${API}/admin/empresas/${modalBaja.id}/estado`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify({ activo: false, motivo: motivoBaja }),
            });
            if (!res.ok) throw new Error();
            addToast("Empresa dada de baja correctamente", "success");
            setModalBaja(null); setMotivoBaja(""); fetchEmpresas();
            if (vistaDetalle?.id === modalBaja.id) setVistaDetalle(null);
        } catch {
            addToast("Error al dar de baja la empresa", "error");
        } finally { setGuardando(false); }
    }

    const filtradas = empresas.filter((e) => {
        const q = buscar.toLowerCase();
        return e.razon_social.toLowerCase().includes(q) || e.cuit.includes(q);
    });

    if (vistaDetalle) {
        return (
            <DetalleEmpresa
                empresa={vistaDetalle}
                token={token}
                addToast={addToast}
                onVolver={() => setVistaDetalle(null)}
                onEditar={abrirEditar}
                onBaja={(emp) => { setModalBaja(emp); }}
                planes={planes}
            />
        );
    }

    function CampoForm({ label, name, placeholder, required, tipo }: { label: string; name: keyof EmpresaForm; placeholder?: string; required?: boolean; tipo?: string }) {
        return (
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{label}{required && " *"}</label>
                <input
                    type={tipo ?? "text"}
                    value={form[name]}
                    onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]"
                />
            </div>
        );
    }

    const modalAbierto = modalNueva || modalEditar !== null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="text-2xl font-bold text-slate-900">Empresas</h1>
                <div className="flex gap-3">
                    <input type="search" placeholder="Buscar por razón social o CUIT..." value={buscar} onChange={(e) => setBuscar(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] w-64" />
                    <button onClick={() => { setForm(EMPRESA_FORM_VACIO); setModalNueva(true); }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#4C1D95] text-white rounded-xl text-sm font-semibold hover:bg-[#3b1675] transition-colors">
                        <Plus size={15} /> Nueva empresa
                    </button>
                </div>
            </div>

            {error ? (
                <div className="bg-red-50 border border-red-100 rounded-2xl px-6 py-4 text-sm text-red-600">Error al cargar empresas</div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                {["Empresa", "Contacto", "Empleados", "Plan", "Estado", "Próximo cobro", "Acciones"].map((h) => (
                                    <th key={h} className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading
                                ? Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="border-b border-slate-50">
                                        {Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-5 py-3.5"><Skeleton className="h-4 w-full" /></td>)}
                                    </tr>
                                ))
                                : filtradas.map((emp) => (
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
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${emp.estado_suscripcion ? (ESTADO_BADGE[emp.estado_suscripcion] ?? "bg-slate-100 text-slate-600") : "bg-slate-100 text-slate-600"}`}>
                                                {emp.estado_suscripcion ? emp.estado_suscripcion.replace(/_/g, " ") : "Sin suscripción"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                                            {emp.fecha_vencimiento ? (
                                                <span className={diasParaVencer(emp.fecha_vencimiento) <= 7 ? "text-orange-600 font-semibold" : ""}>
                                                    {fmtDate(emp.fecha_vencimiento)}
                                                </span>
                                            ) : "—"}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <button onClick={() => setVistaDetalle(emp)}
                                                className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#4C1D95]/30 text-[#4C1D95] hover:bg-[#4C1D95]/5 transition-colors">
                                                Ver detalle
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {!loading && filtradas.length === 0 && <p className="text-center text-slate-400 py-12 text-sm">No hay empresas registradas.</p>}
                </div>
            )}

            {/* Modal nueva/editar empresa */}
            {modalAbierto && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="font-bold text-slate-900 text-lg">{modalEditar ? "Editar empresa" : "Nueva empresa"}</h3>
                        </div>
                        <div className="p-6 space-y-5">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Datos comerciales</p>
                            <div className="grid grid-cols-2 gap-4">
                                <CampoForm label="Razón social" name="razon_social" required />
                                <CampoForm label="CUIT" name="cuit" placeholder="20-12345678-9" required />
                                <CampoForm label="Nombre comercial" name="nombre_comercial" />
                                <CampoForm label="Rubro" name="rubro" />
                            </div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pt-2">Contacto</p>
                            <div className="grid grid-cols-2 gap-4">
                                <CampoForm label="Nombre contacto" name="contacto_nombre" required />
                                <CampoForm label="Cargo" name="contacto_cargo" />
                                <CampoForm label="Email contacto" name="contacto_email" tipo="email" required />
                                <CampoForm label="Teléfono" name="contacto_telefono" />
                            </div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pt-2">Suscripción (opcional)</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Plan</label>
                                    <select value={form.plan_id} onChange={(e) => setForm((p) => ({ ...p, plan_id: e.target.value }))}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30">
                                        <option value="">Sin plan</option>
                                        {planes.map((pl) => <option key={pl.id} value={pl.id}>{pl.nombre}</option>)}
                                    </select>
                                </div>
                                <CampoForm label="Cantidad empleados" name="cantidad_empleados" tipo="number" />
                                <CampoForm label="Precio por empleado (ARS)" name="precio_por_empleado" tipo="number" />
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Periodicidad</label>
                                    <select value={form.periodicidad} onChange={(e) => setForm((p) => ({ ...p, periodicidad: e.target.value }))}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30">
                                        <option value="mensual">Mensual</option>
                                        <option value="trimestral">Trimestral</option>
                                        <option value="anual">Anual</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex gap-3 justify-end">
                            <button onClick={() => { setModalNueva(false); setModalEditar(null); setForm(EMPRESA_FORM_VACIO); }}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancelar</button>
                            <button onClick={guardarEmpresa} disabled={!form.razon_social || !form.cuit || !form.contacto_nombre || !form.contacto_email || guardando}
                                className="px-5 py-2 rounded-xl bg-[#4C1D95] text-white text-sm font-semibold hover:bg-[#3b1675] disabled:opacity-60">
                                {guardando ? "Guardando..." : modalEditar ? "Guardar cambios" : "Crear empresa"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal dar de baja empresa */}
            {modalBaja && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4 space-y-4">
                        <h3 className="font-bold text-slate-900">¿Dar de baja a {modalBaja.razon_social}?</h3>
                        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                            ⚠️ Esta acción dará de baja a <strong>TODOS</strong> los empleados activos de esta empresa y cancelará su suscripción.
                        </div>
                        <input type="text" placeholder="Motivo de la baja" value={motivoBaja} onChange={(e) => setMotivoBaja(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30" />
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => { setModalBaja(null); setMotivoBaja(""); }}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancelar</button>
                            <button onClick={darDeBaja} disabled={guardando}
                                className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60">
                                {guardando ? "Procesando..." : "Confirmar baja"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Detalle de Empresa ───────────────────────────────────────────────────────

type TabDetalle = "info" | "empleados" | "pagos" | "historial";

function DetalleEmpresa({
    empresa, token, addToast, onVolver, onEditar, onBaja, planes,
}: {
    empresa: Empresa;
    token: string;
    addToast: (msg: string, type: ToastType) => void;
    onVolver: () => void;
    onEditar: (emp: Empresa) => void;
    onBaja: (emp: Empresa) => void;
    planes: AdminPlan[];
}) {
    const [tab, setTab] = useState<TabDetalle>("info");
    const [empleados, setEmpleados] = useState<EmpleadoEmpresa[]>([]);
    const [historial, setHistorial] = useState<EventoHistorial[]>([]);
    const [loadingEmpleados, setLoadingEmpleados] = useState(false);
    const [loadingHistorial, setLoadingHistorial] = useState(false);
    const [modalAgregarEmpleado, setModalAgregarEmpleado] = useState(false);
    const [modalBulk, setModalBulk] = useState(false);
    const [empleadoForm, setEmpleadoForm] = useState<EmpleadoForm>(EMPLEADO_FORM_VACIO);
    const [textoBulk, setTextoBulk] = useState("");
    const [resultadoBulk, setResultadoBulk] = useState<ResultadoBulk | null>(null);
    const [procesando, setProcesando] = useState(false);
    const [modalBajaEmpleado, setModalBajaEmpleado] = useState<EmpleadoEmpresa | null>(null);
    const [exportando, setExportando] = useState(false);

    const fetchEmpleados = useCallback(() => {
        setLoadingEmpleados(true);
        fetch(`${API}/admin/empresas/${empresa.id}/empleados`, { headers: authHeaders(token) })
            .then((r) => r.json())
            .then((d: unknown) => setEmpleados(Array.isArray(d) ? (d as EmpleadoEmpresa[]) : []))
            .catch(() => setEmpleados([]))
            .finally(() => setLoadingEmpleados(false));
    }, [empresa.id, token]);

    useEffect(() => {
        if (tab === "empleados" && empleados.length === 0) fetchEmpleados();
        if (tab === "historial" && historial.length === 0) {
            setLoadingHistorial(true);
            fetch(`${API}/admin/empresas/${empresa.id}`, { headers: authHeaders(token) })
                .then((r) => r.json())
                .then((d: unknown) => {
                    const emp = d as Empresa;
                    setHistorial(Array.isArray(emp?.historial) ? emp.historial : []);
                })
                .catch(() => setHistorial([]))
                .finally(() => setLoadingHistorial(false));
        }
    }, [tab, empresa.id, token, empleados.length, historial.length, fetchEmpleados]);

    async function agregarEmpleado() {
        setProcesando(true);
        try {
            const res = await fetch(`${API}/admin/empresas/${empresa.id}/empleados`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify(empleadoForm),
            });
            if (!res.ok) throw new Error();
            addToast("Empleado agregado correctamente", "success");
            setModalAgregarEmpleado(false); setEmpleadoForm(EMPLEADO_FORM_VACIO);
            fetchEmpleados();
        } catch { addToast("Error al agregar el empleado", "error"); }
        finally { setProcesando(false); }
    }

    async function cargaMasiva() {
        setProcesando(true); setResultadoBulk(null);
        try {
            const res = await fetch(`${API}/admin/empresas/${empresa.id}/empleados/bulk`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify({ datos: textoBulk }),
            });
            const data = await res.json() as ResultadoBulk;
            setResultadoBulk(data);
            if (data.cargados > 0) { addToast(`${data.cargados} empleados cargados correctamente`, "success"); fetchEmpleados(); }
            if (data.fallidos > 0) addToast(`${data.fallidos} filas con error`, "warning");
        } catch { addToast("Error en la carga masiva", "error"); }
        finally { setProcesando(false); }
    }

    async function cambiarEstadoEmpleado(empleado: EmpleadoEmpresa, activo: boolean) {
        try {
            const res = await fetch(`${API}/admin/empresas/${empresa.id}/empleados/${empleado.id}/estado`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify({ activo }),
            });
            if (!res.ok) throw new Error();
            setEmpleados((prev) => prev.map((e) => e.id === empleado.id ? { ...e, activo } : e));
            addToast(`Empleado ${activo ? "activado" : "desactivado"}`, "success");
        } catch { addToast("Error al cambiar estado del empleado", "error"); }
        finally { setModalBajaEmpleado(null); }
    }

    async function exportarEmpleados() {
        setExportando(true);
        try {
            const res = await fetch(`${API}/admin/empresas/${empresa.id}/exportar-excel`, { headers: authHeaders(token) });
            if (res.ok) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = `empleados_${empresa.cuit}.xlsx`;
                document.body.appendChild(a); a.click(); document.body.removeChild(a);
                URL.revokeObjectURL(url);
                addToast("Excel exportado correctamente", "success");
            } else { addToast("Error al exportar", "error"); }
        } catch { addToast("Error al exportar", "error"); }
        finally { setExportando(false); }
    }

    const hoy = new Date().toISOString().split("T")[0];
    const empleadosActivos = empleados.filter((e) => e.activo).length;
    const lineasBulk = textoBulk.trim().split("\n").filter((l) => l.trim()).length;

    const TABS: { id: TabDetalle; label: string }[] = [
        { id: "info", label: "Información" },
        { id: "empleados", label: "Empleados" },
        { id: "pagos", label: "Pagos" },
        { id: "historial", label: "Historial" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <button onClick={onVolver} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors">
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
                        <button onClick={() => onEditar(empresa)} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                            Editar empresa
                        </button>
                        <button onClick={() => onBaja(empresa)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${empresa.activo ? "bg-red-500 text-white hover:bg-red-600" : "bg-emerald-500 text-white hover:bg-emerald-600"}`}>
                            {empresa.activo ? "Dar de baja" : "Dar de alta"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-slate-200">
                {TABS.map(({ id, label }) => (
                    <button key={id} onClick={() => setTab(id)}
                        className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === id ? "border-[#4C1D95] text-[#4C1D95]" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
                        {label}
                    </button>
                ))}
            </div>

            {/* TAB: Información */}
            {tab === "info" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                        <h3 className="font-semibold text-slate-800 text-sm">Datos comerciales</h3>
                        <InfoRow label="CUIT" value={empresa.cuit} />
                        <InfoRow label="Razón social" value={empresa.razon_social} />
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
                        {empresa.estado_suscripcion && (
                            <div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ESTADO_BADGE[empresa.estado_suscripcion] ?? "bg-slate-100 text-slate-600"}`}>
                                    {empresa.estado_suscripcion.replace(/_/g, " ")}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB: Empleados */}
            {tab === "empleados" && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <p className="text-sm text-slate-600 font-medium">
                            <span className="text-slate-900 font-bold">{empleadosActivos}</span> empleados activos de <span className="font-bold">{empleados.length}</span> totales
                        </p>
                        <div className="flex gap-2">
                            <button onClick={exportarEmpleados} disabled={exportando}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-60">
                                <Download size={14} /> {exportando ? "Exportando..." : "Exportar Excel"}
                            </button>
                            <button onClick={() => { setModalBulk(true); setTextoBulk(""); setResultadoBulk(null); }}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                                <Upload size={14} /> Carga masiva
                            </button>
                            <button onClick={() => { setEmpleadoForm(EMPLEADO_FORM_VACIO); setModalAgregarEmpleado(true); }}
                                className="flex items-center gap-1.5 px-4 py-2 bg-[#4C1D95] text-white rounded-xl text-sm font-semibold hover:bg-[#3b1675] transition-colors">
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
                                {loadingEmpleados
                                    ? Array.from({ length: 4 }).map((_, i) => (
                                        <tr key={i} className="border-b border-slate-50">
                                            {Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-5 py-3.5"><Skeleton className="h-4 w-full" /></td>)}
                                        </tr>
                                    ))
                                    : empleados.map((emp) => (
                                        <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                            <td className="px-5 py-3.5 font-medium text-slate-900 whitespace-nowrap">{emp.nombre} {emp.apellido}</td>
                                            <td className="px-5 py-3.5 text-slate-600">{emp.dni}</td>
                                            <td className="px-5 py-3.5 text-slate-600">{emp.email}</td>
                                            <td className="px-5 py-3.5 text-slate-500">{emp.cargo ?? "—"}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${emp.activo ? "text-emerald-600" : "text-red-500"}`}>
                                                    <span className={`w-2 h-2 rounded-full ${emp.activo ? "bg-emerald-500" : "bg-red-400"}`} />
                                                    {emp.activo ? "Activo" : "Inactivo"}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{fmtDate(emp.fecha_alta)}</td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex gap-2">
                                                    <button onClick={() => setModalBajaEmpleado(emp)}
                                                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${emp.activo ? "border-red-200 text-red-600 hover:bg-red-50" : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"}`}>
                                                        {emp.activo ? "Dar de baja" : "Dar de alta"}
                                                    </button>
                                                    {emp.fecha_alta.startsWith(hoy) && (
                                                        <button onClick={async () => {
                                                            if (!confirm(`¿Eliminar a ${emp.nombre}?`)) return;
                                                            await fetch(`${API}/admin/empresas/${empresa.id}/empleados/${emp.id}`, { method: "DELETE", headers: authHeaders(token) });
                                                            fetchEmpleados();
                                                        }} className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50">
                                                            Eliminar
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {!loadingEmpleados && empleados.length === 0 && <p className="text-center text-slate-400 py-12 text-sm">No hay empleados registrados.</p>}
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
                            <button onClick={() => setModalAgregarEmpleado(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancelar</button>
                            <button onClick={agregarEmpleado} disabled={!empleadoForm.nombre || !empleadoForm.apellido || !empleadoForm.dni || !empleadoForm.email || procesando}
                                className="px-5 py-2 rounded-xl bg-[#4C1D95] text-white text-sm font-semibold hover:bg-[#3b1675] disabled:opacity-60">
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
                            {lineasBulk > 0 && <p className="text-sm text-slate-500">Se van a cargar <strong>{lineasBulk}</strong> empleados</p>}
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
                            <button onClick={() => { setModalBulk(false); setTextoBulk(""); setResultadoBulk(null); }}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Cerrar</button>
                            <button onClick={cargaMasiva} disabled={lineasBulk === 0 || procesando}
                                className="px-5 py-2 rounded-xl bg-[#4C1D95] text-white text-sm font-semibold hover:bg-[#3b1675] disabled:opacity-60">
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
                            <button onClick={() => setModalBajaEmpleado(null)} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancelar</button>
                            <button onClick={() => cambiarEstadoEmpleado(modalBajaEmpleado, !modalBajaEmpleado.activo)}
                                className={`px-4 py-2 rounded-xl text-white text-sm font-semibold ${modalBajaEmpleado.activo ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"}`}>
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── InfoRow helper ───────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
    return (
        <div className="flex justify-between gap-2 text-sm">
            <span className="text-slate-500">{label}</span>
            <span className="text-slate-800 font-medium text-right">{value ?? "—"}</span>
        </div>
    );
}
