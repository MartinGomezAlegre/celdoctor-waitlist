"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    LayoutDashboard, Users, Building2, CreditCard,
    Receipt, Package, BarChart2, LogOut, MessageSquare, Briefcase, Menu, X,
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
import SectionSoporte from "./components/SectionSoporte"
import SectionLeads from "./components/SectionLeads"

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
    const [sidebarAbierto, setSidebarAbierto] = useState(false)

    // Badge counts
    const [alertas, setAlertas] = useState<Alerta[]>([])
    const [metricasEmpresas, setMetricasEmpresas] = useState<MetricasEmpresas | null>(null)
    const [ticketsAbiertos, setTicketsAbiertos] = useState(0)
    const [leadsNuevos, setLeadsNuevos] = useState(0)

    useEffect(() => {
        const t = localStorage.getItem("celdoctor_admin_token")
        if (!t) { router.replace("/admin"); return }
        setToken(t)

        fetch(`${API}/admin/alertas`, { headers: authHeaders(t) })
            .then((r) => r.json())
            .then((d: unknown) => setAlertas(Array.isArray(d) ? (d as Alerta[]) : []))
            .catch(() => null)

        fetch(`${API}/admin/metricas-empresas`, { headers: authHeaders(t) })
            .then((r) => r.json())
            .then((d: MetricasEmpresas) => setMetricasEmpresas(d))
            .catch(() => null)

        fetch(`${API}/admin/soporte/tickets?estado=abierto`, { headers: authHeaders(t) })
            .then((r) => r.json())
            .then((d: unknown) => setTicketsAbiertos(Array.isArray(d) ? (d as unknown[]).length : 0))
            .catch(() => null)

        fetch(`${API}/admin/leads/empresariales?estado=nuevo`, { headers: authHeaders(t) })
            .then((r) => r.json())
            .then((d: unknown) => setLeadsNuevos(Array.isArray(d) ? (d as unknown[]).length : 0))
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

    function navegarA(s: Section) {
        setSection(s)
        setSidebarAbierto(false)
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
            label: "Comercial",
            items: [
                { id: "leads", label: "Leads", Icon: Briefcase, badge: leadsNuevos > 0 ? leadsNuevos : undefined },
                { id: "soporte", label: "Soporte", Icon: MessageSquare, badge: ticketsAbiertos > 0 ? ticketsAbiertos : undefined },
            ],
        },
        {
            label: "Análisis",
            items: [
                { id: "reportes", label: "Reportes", Icon: BarChart2 },
            ],
        },
    ]

    const SidebarContent = () => (
        <>
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
                                    onClick={() => navegarA(id)}
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
        </>
    )

    return (
        <div className="flex min-h-screen bg-slate-100">
            {/* Sidebar Desktop — siempre visible */}
            <aside className="hidden lg:flex w-60 bg-[#1e0b4b] flex-col shrink-0">
                <SidebarContent />
            </aside>

            {/* Sidebar Mobile — slide desde la izquierda */}
            <>
                {/* Overlay */}
                {sidebarAbierto && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setSidebarAbierto(false)}
                    />
                )}

                {/* Panel */}
                <aside
                    className={`fixed top-0 left-0 h-full w-70 bg-[#1e0b4b] flex flex-col z-50 transition-transform duration-300 lg:hidden ${
                        sidebarAbierto ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={() => setSidebarAbierto(false)}
                            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <SidebarContent />
                </aside>
            </>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header mobile */}
                <header className="lg:hidden flex items-center gap-4 px-4 py-3 bg-[#1e0b4b] sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarAbierto(true)}
                        className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Abrir menú"
                    >
                        <Menu size={22} />
                    </button>
                    <span className="text-lg font-black text-white tracking-tight">CELDOCTOR.</span>
                </header>

                <main className="flex-1 overflow-auto">
                    <div className="p-4 sm:p-8">
                        {section === "overview"      && <SectionOverview token={token} addToast={addToast} onNavigate={navegarA} />}
                        {section === "personas"      && <SectionPersonas token={token} addToast={addToast} />}
                        {section === "empresas"      && <SectionEmpresas token={token} addToast={addToast} />}
                        {section === "suscripciones" && <SectionSuscripciones token={token} addToast={addToast} />}
                        {section === "facturacion"   && <SectionFacturacion token={token} addToast={addToast} />}
                        {section === "catalogo"      && <SectionCatalogo token={token} addToast={addToast} />}
                        {section === "reportes"      && <SectionReportes token={token} addToast={addToast} />}
                        {section === "soporte"       && <SectionSoporte token={token} addToast={addToast} />}
                        {section === "leads"         && <SectionLeads token={token} addToast={addToast} />}
                    </div>
                </main>
            </div>

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
