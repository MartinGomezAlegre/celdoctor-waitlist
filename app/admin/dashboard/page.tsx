"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Building2,
    CreditCard,
    Receipt,
    Package,
    BarChart2,
    LogOut,
    MessageSquare,
    Briefcase,
    ShieldPlus,
    Network,
    Menu,
    X,
} from "lucide-react";
import { logout } from "@/lib/api";
import type { Section, Toast, ToastType, Alerta, MetricasEmpresas } from "./types";
import { API, authHeaders } from "./lib";
import { adminEndpoints } from "./admin-endpoints";
import SectionOverview from "./components/SectionOverview";
import SectionPersonas from "./components/SectionPersonas";
import SectionEmpresas from "./components/SectionEmpresas";
import SectionSuscripciones from "./components/SectionSuscripciones";
import SectionFacturacion from "./components/SectionFacturacion";
import SectionCatalogo from "./components/SectionCatalogo";
import SectionReportes from "./components/SectionReportes";
import SectionSoporte from "./components/SectionSoporte";
import SectionLeads from "./components/SectionLeads";
import SectionUpsells from "./components/SectionUpsells";
import SectionComercial from "./components/SectionComercial";

interface NavItem {
    id: Section;
    label: string;
    Icon: React.ElementType;
    badge?: number;
}

interface NavGroup {
    label?: string;
    items: NavItem[];
}

interface SidebarContentProps {
    navGroups: NavGroup[];
    section: Section;
    onNavigate: (section: Section) => void;
    onLogout: () => void;
}

function SidebarContent({ navGroups, section, onNavigate, onLogout }: SidebarContentProps) {
    return (
        <>
            <div className="border-b border-white/10 px-6 py-6">
                <span className="text-xl font-black tracking-tight text-white">CELDOCTOR.</span>
                <p className="mt-0.5 text-xs text-white/40">Panel de administracion</p>
            </div>

            <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
                {navGroups.map((group, groupIndex) => (
                    <div key={groupIndex}>
                        {group.label && (
                            <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-white/30">
                                {group.label}
                            </p>
                        )}

                        <div className="space-y-0.5">
                            {group.items.map(({ id, label, Icon, badge }) => (
                                <button
                                    key={id}
                                    onClick={() => onNavigate(id)}
                                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                                        section === id
                                            ? "bg-white/15 text-white"
                                            : "text-white/60 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    <span className="flex items-center gap-2.5">
                                        <Icon size={15} />
                                        {label}
                                    </span>
                                    {badge !== undefined && badge > 0 && (
                                        <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                            {badge > 99 ? "99+" : badge}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="border-t border-white/10 px-3 py-4">
                <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                    <LogOut size={15} />
                    Cerrar sesion
                </button>
            </div>
        </>
    );
}

export default function AdminDashboardPage() {
    const router = useRouter();
    const [section, setSection] = useState<Section>("overview");
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [sidebarAbierto, setSidebarAbierto] = useState(false);
    const [alertas, setAlertas] = useState<Alerta[]>([]);
    const [metricasEmpresas, setMetricasEmpresas] = useState<MetricasEmpresas | null>(null);
    const [ticketsAbiertos, setTicketsAbiertos] = useState(0);
    const [leadsNuevos, setLeadsNuevos] = useState(0);
    const [upsellsNuevos, setUpsellsNuevos] = useState(0);
    const token = "";

    useEffect(() => {
        fetch(`${API}${adminEndpoints.alertas}`, { headers: authHeaders(token) })
            .then((response) => response.json())
            .then((data: unknown) => setAlertas(Array.isArray(data) ? (data as Alerta[]) : []))
            .catch(() => null);

        fetch(`${API}${adminEndpoints.metricasEmpresas}`, { headers: authHeaders(token) })
            .then((response) => response.json())
            .then((data: MetricasEmpresas) => setMetricasEmpresas(data))
            .catch(() => null);

        fetch(`${API}${adminEndpoints.tickets}?estado=abierto`, { headers: authHeaders(token) })
            .then((response) => response.json())
            .then((data: unknown) => setTicketsAbiertos(Array.isArray(data) ? (data as unknown[]).length : 0))
            .catch(() => null);

        fetch(`${API}${adminEndpoints.leads}?estado=nuevo`, { headers: authHeaders(token) })
            .then((response) => response.json())
            .then((data: unknown) => setLeadsNuevos(Array.isArray(data) ? (data as unknown[]).length : 0))
            .catch(() => null);

        fetch(`${API}${adminEndpoints.upsellsSeguro}?estado=nuevo`, { headers: authHeaders(token) })
            .then((response) => response.json())
            .then((data: unknown) => setUpsellsNuevos(Array.isArray(data) ? (data as unknown[]).length : 0))
            .catch(() => null);
    }, [router, token]);

    function addToast(msg: string, type: ToastType) {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, msg, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 4000);
    }

    function handleLogout() {
        localStorage.removeItem("celdoctor_admin_token");
        localStorage.removeItem("celdoctor_rol");
        void logout();
        router.replace("/admin");
    }

    function navegarA(nextSection: Section) {
        setSection(nextSection);
        setSidebarAbierto(false);
    }

    const pendientesPago = alertas.find((alerta) => alerta.tipo === "pendientes_pago")?.cantidad ?? 0;
    const sinConvertir = alertas.find((alerta) => alerta.tipo === "sin_convertir")?.cantidad ?? 0;
    const empresasAlerta =
        (metricasEmpresas?.empresas_vencen_esta_semana ?? 0) + (metricasEmpresas?.empresas_pendiente_pago ?? 0);
    const totalAlertas = pendientesPago + sinConvertir + empresasAlerta;

    const navGroups: NavGroup[] = [
        {
            items: [
                {
                    id: "overview",
                    label: "Inicio",
                    Icon: LayoutDashboard,
                    badge: totalAlertas > 0 ? totalAlertas : undefined,
                },
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
                {
                    id: "suscripciones",
                    label: "Suscripciones",
                    Icon: CreditCard,
                    badge: pendientesPago > 0 ? pendientesPago : undefined,
                },
                { id: "facturacion", label: "Facturacion", Icon: Receipt },
                { id: "catalogo", label: "Catalogo", Icon: Package },
            ],
        },
        {
            label: "Comercial",
            items: [
                { id: "leads", label: "Leads", Icon: Briefcase, badge: leadsNuevos > 0 ? leadsNuevos : undefined },
                { id: "comercial", label: "Canal ventas", Icon: Network },
                { id: "upsells", label: "Seguro medico", Icon: ShieldPlus, badge: upsellsNuevos > 0 ? upsellsNuevos : undefined },
                { id: "soporte", label: "Soporte", Icon: MessageSquare, badge: ticketsAbiertos > 0 ? ticketsAbiertos : undefined },
            ],
        },
        {
            label: "Analisis",
            items: [{ id: "reportes", label: "Reportes", Icon: BarChart2 }],
        },
    ];

    return (
        <div className="flex min-h-screen bg-slate-100">
            <aside className="hidden w-60 shrink-0 flex-col bg-[#1e0b4b] lg:flex">
                        <SidebarContent navGroups={navGroups} section={section} onNavigate={navegarA} onLogout={handleLogout} />
            </aside>

            <>
                {sidebarAbierto && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        onClick={() => setSidebarAbierto(false)}
                    />
                )}

                <aside
                    className={`fixed top-0 left-0 z-50 flex h-full w-70 flex-col bg-[#1e0b4b] transition-transform duration-300 lg:hidden ${
                        sidebarAbierto ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={() => setSidebarAbierto(false)}
                            className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <SidebarContent navGroups={navGroups} section={section} onNavigate={navegarA} onLogout={handleLogout} />
                </aside>
            </>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-30 flex items-center gap-4 bg-[#1e0b4b] px-4 py-3 lg:hidden">
                    <button
                        onClick={() => setSidebarAbierto(true)}
                        className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                        aria-label="Abrir menu"
                    >
                        <Menu size={22} />
                    </button>
                    <span className="text-lg font-black tracking-tight text-white">CELDOCTOR.</span>
                </header>

                <main className="flex-1 overflow-auto">
                    <div className="p-4 sm:p-8">
                        {section === "overview" && <SectionOverview token={token} addToast={addToast} onNavigate={navegarA} />}
                        {section === "personas" && <SectionPersonas token={token} addToast={addToast} />}
                        {section === "empresas" && <SectionEmpresas token={token} addToast={addToast} />}
                        {section === "suscripciones" && <SectionSuscripciones token={token} addToast={addToast} />}
                        {section === "facturacion" && <SectionFacturacion token={token} addToast={addToast} />}
                        {section === "catalogo" && <SectionCatalogo token={token} addToast={addToast} />}
                        {section === "comercial" && <SectionComercial token={token} addToast={addToast} />}
                        {section === "reportes" && <SectionReportes token={token} addToast={addToast} />}
                        {section === "soporte" && <SectionSoporte token={token} addToast={addToast} />}
                        {section === "leads" && <SectionLeads token={token} addToast={addToast} />}
                        {section === "upsells" && <SectionUpsells token={token} addToast={addToast} />}
                    </div>
                </main>
            </div>

            <div className="pointer-events-none fixed right-4 bottom-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${
                            toast.type === "success"
                                ? "bg-emerald-500 text-white"
                                : toast.type === "error"
                                  ? "bg-red-500 text-white"
                                  : "bg-amber-500 text-white"
                        }`}
                    >
                        {toast.type === "success" ? "OK" : toast.type === "error" ? "X" : "!"}
                        {toast.msg}
                    </div>
                ))}
            </div>
        </div>
    );
}
