"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    LayoutDashboard, Users, Building2, CreditCard,
    Receipt, Package, BarChart2, LogOut,
} from "lucide-react"
import type { Section, Toast, ToastType, Alerta, MetricasEmpresas } from "./types"
import { API, authHeaders } from "./lib"
import SectionOverview from "./components/SectionOverview"
import SectionPersonas from "./components/SectionPersonas"
import SectionEmpresas from "./components/SectionEmpresas"
import SectionSuscripciones from "./components/SectionSuscripciones"
import SectionFacturacion from "./components/SectionFacturacion"
import SectionCatalogo from "./components/SectionCatalogo"
import SectionReportes from "./components/SectionReportes"

// ─── Sidebar nav structure ────────────────────────────────────────────────────

interface NavItem {
    id: Section
    label: string
    Icon: React.ElementType
    badge?: number
}

interface NavGroup {
    label?: string
    items: NavItem[]
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
    const router = useRouter()
    const [token, setToken] = useState<string | null>(null)
    const [section, setSection] = useState<Section>("overview")
    const [toasts, setToasts] = useState<Toast[]>([])

    // Badge counts
    const [alertas, setAlertas] = useState<Alerta[]>([])
    const [metricasEmpresas, setMetricasEmpresas] = useState<MetricasEmpresas | null>(null)

    useEffect(() => {
        const t = localStorage.getItem("celdoctor_admin_token")
        if (!t) { router.replace("/admin"); return }
        setToken(t)

        // Load badge counts
        fetch(`${API}/admin/alertas`, { headers: authHeaders(t) })
            .then((r) => r.json())
            .then((d: unknown) => setAlertas(Array.isArray(d) ? (d as Alerta[]) : []))
            .catch(() => null)

        fetch(`${API}/admin/metricas-empresas`, { headers: authHeaders(t) })
            .then((r) => r.json())
            .then((d: MetricasEmpresas) => setMetricasEmpresas(d))
            .catch(() => null)
    }, [router])

    function addToast(msg: string, type: ToastType) {
        const id = Date.now()
        setToasts((prev) => [...prev, { id, msg, type }])
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
    }

    function logout() {
        localStorage.removeItem("celdoctor_admin_token")
        router.replace("/admin")
    }

    if (!token) return null

    // Compute badge counts
    const pendientesPago = alertas.find((a) => a.tipo === "pendientes_pago")?.cantidad ?? 0
    const sinConvertir = alertas.find((a) => a.tipo === "sin_convertir")?.cantidad ?? 0
    const empresasAlerta = (metricasEmpresas?.empresas_vencen_esta_semana ?? 0) + (metricasEmpresas?.empresas_pendiente_pago ?? 0)
    const totalAlertas = pendientesPago + sinConvertir + empresasAlerta

    const NAV_GROUPS: NavGroup[] = [
        {
            items: [
                { id: "overview", label: "Inicio", Icon: LayoutDashboard, badge: totalAlertas > 0 ? totalAlertas : undefined },
            ],
        },
        {
            label: "Usuarios",
            items: [
                { id: "personas", label: "Personas", Icon: Users, badge: sinConvertir > 0 ? sinConvertir : undefined },
                { id: "empresas", label: "Empresas", Icon: Building2, badge: empresasAlerta > 0 ? empresasAlerta : undefined },
            ],
        },
        {
            label: "Negocio",
            items: [
                { id: "suscripciones", label: "Suscripciones", Icon: CreditCard, badge: pendientesPago > 0 ? pendientesPago : undefined },
                { id: "facturacion", label: "Facturación", Icon: Receipt },
                { id: "catalogo", label: "Catálogo", Icon: Package },
            ],
        },
        {
            label: "Análisis",
            items: [
                { id: "reportes", label: "Reportes", Icon: BarChart2 },
            ],
        },
    ]

    return (
        <div className="flex min-h-screen bg-slate-100">
            {/* Sidebar */}
            <aside className="w-60 bg-[#1e0b4b] flex flex-col shrink-0">
                <div className="px-6 py-6 border-b border-white/10">
                    <span className="text-xl font-black text-white tracking-tight">CELDOCTOR.</span>
                    <p className="text-white/40 text-xs mt-0.5">Panel de administración</p>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
                    {NAV_GROUPS.map((group, gi) => (
                        <div key={gi}>
                            {group.label && (
                                <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-white/30">
                                    {group.label}
                                </p>
                            )}
                            <div className="space-y-0.5">
                                {group.items.map(({ id, label, Icon, badge }) => (
                                    <button
                                        key={id}
                                        onClick={() => setSection(id)}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                            section === id
                                                ? "bg-white/15 text-white"
                                                : "text-white/60 hover:text-white hover:bg-white/10"
                                        }`}
                                    >
                                        <span className="flex items-center gap-2.5">
                                            <Icon size={15} />
                                            {label}
                                        </span>
                                        {badge !== undefined && badge > 0 && (
                                            <span className="min-w-4.5 h-4.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1">
                                                {badge > 99 ? "99+" : badge}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="px-3 py-4 border-t border-white/10">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <LogOut size={15} />
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    {section === "overview"      && <SectionOverview token={token} addToast={addToast} onNavigate={setSection} />}
                    {section === "personas"      && <SectionPersonas token={token} addToast={addToast} />}
                    {section === "empresas"      && <SectionEmpresas token={token} addToast={addToast} />}
                    {section === "suscripciones" && <SectionSuscripciones token={token} addToast={addToast} />}
                    {section === "facturacion"   && <SectionFacturacion token={token} addToast={addToast} />}
                    {section === "catalogo"      && <SectionCatalogo token={token} addToast={addToast} />}
                    {section === "reportes"      && <SectionReportes token={token} addToast={addToast} />}
                </div>
            </main>

            {/* Toast notifications */}
            <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
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
    )
}
