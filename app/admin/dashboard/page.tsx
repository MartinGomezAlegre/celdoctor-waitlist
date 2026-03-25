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
    Clock, AlertTriangle,
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

type Section = "dashboard" | "usuarios" | "suscripciones" | "planes";
type ToastType = "success" | "error" | "warning";

interface Toast {
    id: number;
    msg: string;
    type: ToastType;
}

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
        { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
        { id: "usuarios", label: "Usuarios", Icon: Users },
        { id: "suscripciones", label: "Suscripciones", Icon: CreditCard },
        { id: "planes", label: "Planes", Icon: Package },
    ];

    return (
        <div className="flex min-h-screen bg-slate-100">
            {/* Sidebar */}
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

            {/* Main */}
            <main className="flex-1 overflow-auto p-8">
                {section === "dashboard"     && <SectionDashboard token={token} addToast={addToast} />}
                {section === "usuarios"      && <SectionUsuarios token={token} addToast={addToast} />}
                {section === "suscripciones" && <SectionSuscripciones token={token} addToast={addToast} />}
                {section === "planes"        && <SectionPlanes token={token} addToast={addToast} />}
            </main>

            {/* Toasts */}
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

function SectionDashboard({ token, addToast }: { token: string; addToast: (msg: string, type: ToastType) => void }) {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
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
    }, [token]);

    async function exportarExcel() {
        setExporting(true);
        try {
            const res = await fetch(`${API}/admin/exportar-excel`, {
                headers: authHeaders(token),
            });
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

    const kpiFila1 = [
        {
            label: "MRR",
            sub: "Ingresos mensuales",
            value: metrics ? fmtCurrency(metrics.mrr) : null,
            Icon: TrendingUp,
            color: "text-violet-600",
            highlight: false,
        },
        {
            label: "ARR",
            sub: "Ingresos anuales proyectados",
            value: metrics ? fmtCurrency(metrics.arr) : null,
            Icon: TrendingUp,
            color: "text-indigo-600",
            highlight: false,
        },
        {
            label: "Suscriptores activos",
            sub: "",
            value: metrics ? String(metrics.suscriptores_activos) : null,
            Icon: Users,
            color: "text-emerald-600",
            highlight: false,
        },
    ];

    const kpiFila2 = [
        {
            label: "Tasa de conversión",
            sub: "",
            value: metrics ? `${metrics.tasa_conversion}%` : null,
            Icon: TrendingUp,
            color: "text-blue-600",
            highlight: false,
        },
        {
            label: "Pendientes de pago",
            sub: "",
            value: metrics ? String(metrics.pendientes_pago) : null,
            Icon: Clock,
            color: "text-amber-600",
            highlight: (metrics?.pendientes_pago ?? 0) > 0,
        },
        {
            label: "Churn rate",
            sub: "",
            value: metrics ? `${metrics.churn_rate}%` : null,
            Icon: TrendingUp,
            color: "text-red-500",
            highlight: false,
        },
    ];

    function KpiCard({ label, sub, value, Icon, color, highlight }: {
        label: string; sub: string; value: string | null;
        Icon: React.ElementType; color: string; highlight: boolean;
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
        pendientes_pago: { bg: "bg-amber-50",  border: "border-amber-300",  Icon: Clock },
        sin_convertir:   { bg: "bg-blue-50",   border: "border-blue-300",   Icon: Users },
        exportar_mediquo:{ bg: "bg-violet-50", border: "border-violet-300", Icon: Download },
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

            {/* KPIs fila 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {kpiFila1.map((k) => <KpiCard key={k.label} {...k} />)}
            </div>

            {/* KPIs fila 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {kpiFila2.map((k) => <KpiCard key={k.label} {...k} />)}
            </div>

            {/* Alertas */}
            {alertas.length > 0 && (
                <div className="space-y-2">
                    {alertas.map((alerta, i) => {
                        const cfg = alertaConfig[alerta.tipo];
                        return (
                            <div
                                key={i}
                                className={`flex items-center gap-4 px-5 py-4 rounded-2xl border ${cfg.bg} ${cfg.border}`}
                            >
                                <cfg.Icon size={18} className="text-slate-600 shrink-0" />
                                <p className="text-sm text-slate-700 flex-1">{alerta.mensaje}</p>
                                {alerta.tipo === "exportar_mediquo" && (
                                    <button
                                        onClick={exportarExcel}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4C1D95] text-white rounded-xl text-xs font-semibold hover:bg-[#3b1675] transition-colors shrink-0"
                                    >
                                        Exportar ahora
                                        <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">
                                            {alerta.cantidad}
                                        </span>
                                    </button>
                                )}
                                {alerta.tipo !== "exportar_mediquo" && alerta.cantidad > 0 && (
                                    <span className="bg-white/60 border border-slate-200 px-2.5 py-1 rounded-full text-xs font-bold text-slate-700 shrink-0">
                                        {alerta.cantidad}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Gráfico de línea */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h2 className="text-base font-semibold text-slate-800 mb-6">
                    Nuevas suscripciones (últimos 30 días)
                </h2>
                {loadingGrafico ? (
                    <Skeleton className="h-64 w-full" />
                ) : graficoData.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                        Sin datos suficientes para mostrar el gráfico
                    </div>
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

            {/* Gráfico de barras — Revenue por plan */}
            {!loadingMetrics && revenuePlan.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <h2 className="text-base font-semibold text-slate-800 mb-6">Revenue por plan</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={revenuePlan}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="plan" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                            <Tooltip
                                formatter={(v: unknown) => [fmtCurrency(v as number), "Revenue"]}
                                contentStyle={{ borderRadius: "12px", fontSize: 13 }}
                            />
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
                                    <span className="text-sm font-bold text-[#4C1D95]">
                                        {s.usuario_nombre.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">{s.usuario_nombre}</p>
                                    <p className="text-xs text-slate-400 truncate">{s.usuario_email}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ESTADO_BADGE[s.estado] ?? "bg-slate-100 text-slate-600"}`}>
                                        {s.plan_nombre}
                                    </span>
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
        setLoading(true);
        setError(false);
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
            setProcesando(false);
            setModalBaja(null);
            setMotivoBaja("");
        }
    }

    const filtrados = usuarios.filter((u) => {
        const q = buscar.toLowerCase();
        return (
            u.nombre.toLowerCase().includes(q) ||
            u.apellido.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>
                <input
                    type="search"
                    placeholder="Buscar por nombre o email..."
                    value={buscar}
                    onChange={(e) => setBuscar(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] w-72"
                />
            </div>

            {error ? (
                <div className="bg-red-50 border border-red-100 rounded-2xl px-6 py-4 text-sm text-red-600">
                    Error al cargar usuarios
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Nombre</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Email</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">DNI</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Teléfono</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Rol</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Estado</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Registro</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading
                                ? Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i} className="border-b border-slate-50">
                                        {Array.from({ length: 8 }).map((_, j) => (
                                            <td key={j} className="px-5 py-3.5">
                                                <Skeleton className="h-4 w-full" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                                : filtrados.map((u) => (
                                    <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-3.5 font-medium text-slate-900">{u.nombre} {u.apellido}</td>
                                        <td className="px-5 py-3.5 text-slate-600">{u.email}</td>
                                        <td className="px-5 py-3.5 text-slate-600">{u.dni ?? "—"}</td>
                                        <td className="px-5 py-3.5 text-slate-600">{u.telefono}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.rol === "admin" ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-600"}`}>
                                                {u.rol}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${u.activo ? "text-emerald-600" : "text-red-500"}`}>
                                                <span className={`w-2 h-2 rounded-full ${u.activo ? "bg-emerald-500" : "bg-red-400"}`} />
                                                {u.activo ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-500">{fmtDate(u.created_at)}</td>
                                        <td className="px-5 py-3.5">
                                            <button
                                                onClick={() => setModalBaja(u)}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                                                    u.activo
                                                        ? "border-red-200 text-red-600 hover:bg-red-50"
                                                        : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                                }`}
                                            >
                                                {u.activo ? "Dar de baja" : "Dar de alta"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {!loading && filtrados.length === 0 && (
                        <p className="text-center text-slate-400 py-12 text-sm">No se encontraron usuarios.</p>
                    )}
                </div>
            )}

            {/* Modal baja/alta */}
            {modalBaja && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4 space-y-4">
                        <h3 className="font-bold text-slate-900">
                            {modalBaja.activo ? "Dar de baja" : "Dar de alta"} a {modalBaja.nombre}
                        </h3>
                        <textarea
                            placeholder="Motivo (opcional)"
                            value={motivoBaja}
                            onChange={(e) => setMotivoBaja(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                        />
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => { setModalBaja(null); setMotivoBaja(""); }}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => cambiarEstadoUsuario(modalBaja, !modalBaja.activo)}
                                disabled={procesando}
                                className={`px-4 py-2 rounded-xl text-white text-sm font-semibold disabled:opacity-60 transition-colors ${
                                    modalBaja.activo ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"
                                }`}
                            >
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
        setLoading(true);
        setError(false);
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
            setSuscripciones((prev) =>
                prev.map((s) => s.id === modalGestion.id ? { ...s, estado: nuevoEstado } : s)
            );
            addToast("Suscripción actualizada correctamente", "success");
        } catch {
            addToast("Error al actualizar la suscripción", "error");
        } finally {
            setProcesando(false);
            setModalGestion(null);
            setNuevoEstado("");
            setMotivoGestion("");
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
                <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]"
                >
                    <option value="">Todos los estados</option>
                    <option value="activa">Activa</option>
                    <option value="pendiente_pago">Pendiente de pago</option>
                    <option value="cancelada">Cancelada</option>
                </select>
            </div>

            {error ? (
                <div className="bg-red-50 border border-red-100 rounded-2xl px-6 py-4 text-sm text-red-600">
                    Error al cargar suscripciones
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Usuario</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Email</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Plan</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Estado</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Precio</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Fecha</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading
                                ? Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i} className="border-b border-slate-50">
                                        {Array.from({ length: 7 }).map((_, j) => (
                                            <td key={j} className="px-5 py-3.5">
                                                <Skeleton className="h-4 w-full" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                                : suscripciones.map((s) => (
                                    <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-3.5 font-medium text-slate-900">{s.nombre_completo}</td>
                                        <td className="px-5 py-3.5 text-slate-600">{s.email}</td>
                                        <td className="px-5 py-3.5 text-slate-700">{s.plan_nombre}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ESTADO_BADGE[s.estado] ?? "bg-slate-100 text-slate-600"}`}>
                                                {s.estado.replace(/_/g, " ")}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-700">{fmtCurrency(s.precio_pagado)}</td>
                                        <td className="px-5 py-3.5 text-slate-500">{fmtDate(s.fecha_inicio)}</td>
                                        <td className="px-5 py-3.5">
                                            <button
                                                onClick={() => { setModalGestion(s); setNuevoEstado(""); setMotivoGestion(""); }}
                                                className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                                            >
                                                Gestionar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {!loading && suscripciones.length === 0 && (
                        <p className="text-center text-slate-400 py-12 text-sm">No hay suscripciones.</p>
                    )}
                </div>
            )}

            {/* Modal gestión */}
            {modalGestion && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4 space-y-4">
                        <h3 className="font-bold text-slate-900">
                            Gestionar suscripción de {modalGestion.nombre_completo}
                        </h3>
                        <p className="text-sm text-slate-500">
                            Plan: {modalGestion.plan_nombre} · Estado actual:{" "}
                            <span className={`font-semibold ${
                                modalGestion.estado === "activa" ? "text-emerald-600" :
                                modalGestion.estado === "pendiente_pago" ? "text-amber-600" :
                                "text-red-600"
                            }`}>
                                {modalGestion.estado.replace(/_/g, " ")}
                            </span>
                        </p>
                        <select
                            value={nuevoEstado}
                            onChange={(e) => setNuevoEstado(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                        >
                            <option value="">Seleccionar nuevo estado</option>
                            {modalGestion.estado !== "activa" && (
                                <option value="activa">✓ Activar suscripción</option>
                            )}
                            {modalGestion.estado !== "pendiente_pago" && (
                                <option value="pendiente_pago">⏳ Marcar como pendiente</option>
                            )}
                            {modalGestion.estado !== "cancelada" && (
                                <option value="cancelada">✗ Cancelar suscripción</option>
                            )}
                        </select>
                        <textarea
                            placeholder="Motivo del cambio (opcional)"
                            value={motivoGestion}
                            onChange={(e) => setMotivoGestion(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                        />
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => { setModalGestion(null); setNuevoEstado(""); setMotivoGestion(""); }}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={cambiarEstadoSuscripcion}
                                disabled={!nuevoEstado || procesando}
                                className="px-4 py-2 rounded-xl bg-[#4C1D95] text-white text-sm font-semibold hover:bg-[#3b1675] transition-colors disabled:opacity-60"
                            >
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
    const [confirmModal, setConfirmModal] = useState<{
        id: number;
        campo: "activo" | "precio";
        valor: boolean | number;
    } | null>(null);
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
        } catch {
            setPlanes([]);
        } finally {
            setLoading(false);
        }
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
        } catch {
            addToast("Error al guardar el plan", "error");
        } finally {
            setSaving(null);
            setConfirmModal(null);
        }
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
                        const precioSinCambios = precioNum === plan.precio_mensual;

                        return (
                            <div key={plan.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-base">{plan.nombre}</h3>
                                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{plan.descripcion}</p>
                                    </div>
                                    <button
                                        onClick={() => setConfirmModal({ id: plan.id, campo: "activo", valor: !plan.activo })}
                                        className="shrink-0 mt-0.5"
                                        title={plan.activo ? "Desactivar plan" : "Activar plan"}
                                    >
                                        {plan.activo
                                            ? <ToggleRight size={28} className="text-emerald-500" />
                                            : <ToggleLeft size={28} className="text-slate-300" />}
                                    </button>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-500 mb-1 block">Precio mensual (ARS)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            min={0}
                                            value={precioEditable}
                                            onChange={(e) =>
                                                setEditPrecio((prev) => ({ ...prev, [plan.id]: e.target.value }))
                                            }
                                            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95]"
                                        />
                                        <button
                                            disabled={!precioValido || precioSinCambios || saving === plan.id}
                                            onClick={() => setConfirmModal({ id: plan.id, campo: "precio", valor: precioNum })}
                                            className="px-3 py-2 bg-[#4C1D95] text-white rounded-xl text-xs font-semibold hover:bg-[#3b1675] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
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

            {/* Modal confirmación */}
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
                                <button
                                    onClick={() => setConfirmModal(null)}
                                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => {
                                        const activo = confirmModal.campo === "activo"
                                            ? (confirmModal.valor as boolean)
                                            : plan.activo;
                                        const precio = confirmModal.campo === "precio"
                                            ? (confirmModal.valor as number)
                                            : plan.precio_mensual;
                                        guardarCambio(plan.id, activo, precio);
                                    }}
                                    disabled={saving === plan.id}
                                    className="px-4 py-2 rounded-xl bg-[#4C1D95] text-white text-sm font-semibold hover:bg-[#3b1675] transition-colors disabled:opacity-60"
                                >
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
