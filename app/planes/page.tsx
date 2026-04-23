"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Users, Building2, User } from "lucide-react";
import { obtenerPlanes, obtenerPlanesUsuario, type Plan, type Suscripcion } from "@/lib/api";
import { getPlanPurchaseState, isCorporatePlan } from "@/lib/plan-purchase";
import { useCurrentSubscription } from "@/lib/use-current-subscription";

// ─── Beneficios por tipo ───────────────────────────────────────────────────────
const BENEFICIOS_PERSONAL = [
    "Consultas médicas ilimitadas",
    "Guardia 24/7 sin espera",
    "Recetas digitales al instante",
    "Historia clínica digital",
    "Sin copagos sorpresa",
];
const BENEFICIOS_FAMILIAR = [
    "Todo lo del plan personal",
    "Titular + 3 integrantes incluidos",
    "Pediatría prioritaria",
    "Certificados escolares y deportivos",
    "Consultas simultáneas",
];
const BENEFICIOS_EMPRESARIAL = [
    "Todo lo del plan familiar",
    "Dashboard de gestión empresarial",
    "Factura A discriminada",
    "Account Manager dedicado",
    "Altas y bajas en 1 click",
];

function getBeneficios(nombre: string): string[] {
    const n = nombre.toLowerCase();
    if (n.includes("empresa") || n.includes("corporat")) return BENEFICIOS_EMPRESARIAL;
    if (n.includes("familiar") || n.includes("familia")) return BENEFICIOS_FAMILIAR;
    return BENEFICIOS_PERSONAL;
}

// ─── Fallback ─────────────────────────────────────────────────────────────────
const FALLBACK_PLANES: Plan[] = [
    { id: 1, nombre: "Individual", descripcion: "Plan para una persona.", precio_mensual: 5000, max_beneficiarios: 1 },
    { id: 2, nombre: "Familiar", descripcion: "Protección total para tus seres queridos.", precio_mensual: 12500, max_beneficiarios: 4 },
    { id: 3, nombre: "Corporativo", descripcion: "Potenciá la salud de tu equipo.", precio_mensual: 0, max_beneficiarios: null },
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 animate-pulse space-y-4">
            <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
            <div className="h-6 bg-slate-200 rounded w-1/2" />
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-8 bg-slate-200 rounded w-1/3" />
            <div className="space-y-2.5 pt-2">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-3.5 bg-slate-200 rounded w-full" />)}
            </div>
            <div className="h-12 bg-slate-200 rounded-xl" />
        </div>
    );
}

// ─── Plan card ────────────────────────────────────────────────────────────────
function PlanCard({
    plan,
    isAuthenticated,
    sessionChecked,
    suscripcion,
    destacado,
}: {
    plan: Plan;
    isAuthenticated: boolean;
    sessionChecked: boolean;
    suscripcion: Suscripcion | null | undefined;
    destacado?: boolean;
}) {
    const beneficios = getBeneficios(plan.nombre);
    const action = getPlanPurchaseState(plan, suscripcion, isAuthenticated, sessionChecked);
    const esCorporativo = isCorporatePlan(plan);

    if (destacado) {
        return (
            <div className="relative p-8 rounded-3xl bg-linear-to-b from-[#4C1D95] to-[#2E1065] border border-[#6D28D9] shadow-2xl shadow-[#4C1D95]/30 flex flex-col">
                <div className="absolute top-0 right-0 bg-white text-[#4C1D95] text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
                    Más popular
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-5 border border-white/20">
                    <User size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{plan.nombre}</h3>
                <p className="text-white/70 text-sm mb-4">{plan.descripcion}</p>
                <p className="text-3xl font-bold text-white mb-6">
                    ${plan.precio_mensual.toLocaleString("es-AR")}
                    <span className="text-base font-normal text-white/60 ml-1">/mes</span>
                </p>
                <ul className="space-y-2.5 mb-8 flex-1">
                    {beneficios.map((b, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-sm text-white">
                            <CheckCircle2 size={15} className="text-white shrink-0" /> {b}
                        </li>
                    ))}
                </ul>
                {action.disabled || !action.href ? (
                    <span className="block w-full rounded-xl bg-white/20 py-4 text-center font-bold text-white/70">
                        {action.label}
                    </span>
                ) : (
                    <Link
                        href={action.href}
                        className="block w-full rounded-xl bg-white py-4 text-center font-bold text-[#2E1065] shadow-lg transition-all hover:bg-slate-100"
                    >
                        {action.label}
                    </Link>
                )}
            </div>
        );
    }

    return (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-[#4C1D95]/30 hover:shadow-xl hover:shadow-[#4C1D95]/5 transition-all flex flex-col group">
            <div className="w-12 h-12 bg-[#4C1D95]/5 rounded-2xl flex items-center justify-center text-[#4C1D95] mb-5 border border-[#4C1D95]/10 group-hover:bg-[#4C1D95] group-hover:text-white transition-colors">
                {esCorporativo ? <Building2 size={22} /> : plan.max_beneficiarios && plan.max_beneficiarios > 1 ? <Users size={22} /> : <User size={22} />}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">{plan.nombre}</h3>
            <p className="text-slate-500 text-sm mb-4">{plan.descripcion}</p>
            {esCorporativo ? (
                <p className="text-3xl font-bold text-[#4C1D95] mb-6">A medida</p>
            ) : (
                <p className="text-3xl font-bold text-[#4C1D95] mb-6">
                    ${plan.precio_mensual.toLocaleString("es-AR")}
                    <span className="text-base font-normal text-slate-400 ml-1">/mes</span>
                </p>
            )}
            <ul className="space-y-2.5 mb-8 flex-1">
                {beneficios.map((b, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                        <CheckCircle2 size={15} className="text-[#4C1D95] shrink-0" /> {b}
                    </li>
                ))}
            </ul>
            {action.disabled || !action.href ? (
                <span className="block w-full rounded-xl border border-slate-200 bg-slate-100 py-4 text-center font-bold text-slate-500">
                    {action.label}
                </span>
            ) : (
                <Link
                    href={action.href}
                    className="block w-full rounded-xl border border-[#4C1D95]/20 py-4 text-center font-bold text-[#4C1D95] transition-all hover:bg-[#4C1D95] hover:text-white"
                >
                    {action.label}
                </Link>
            )}
        </div>
    );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
type TabId = "personal" | "familiar" | "corporativo";

const TABS: { id: TabId; label: string }[] = [
    { id: "personal", label: "Personal" },
    { id: "familiar", label: "Familiar" },
    { id: "corporativo", label: "Corporativo" },
];

// ─── Página ───────────────────────────────────────────────────────────────────
export default function PlanesPage() {
    const [tab, setTab] = useState<TabId>("personal");
    const [planes, setPlanes] = useState<Plan[]>([]);
    const [cargando, setCargando] = useState(true);
    const { isAuthenticated, sessionChecked, suscripcion } = useCurrentSubscription();

    useEffect(() => {
        if (!sessionChecked) {
            return;
        }

        const fetchPlanes = isAuthenticated ? obtenerPlanesUsuario() : obtenerPlanes();
        fetchPlanes.then((data) => {
            setPlanes(data.length > 0 ? data : FALLBACK_PLANES);
            setCargando(false);
        });
    }, [isAuthenticated, sessionChecked]);

    const planesPersonal = planes.filter((p) => {
        const n = p.nombre.toLowerCase();
        return n.includes("individual") || n.includes("basic") || n.includes("personal");
    });

    const planesFamiliar = planes.filter((p) => {
        const n = p.nombre.toLowerCase();
        return n.includes("familiar") || n.includes("familia");
    });

    const planesCorporativo = planes.filter((p) => {
        const n = p.nombre.toLowerCase();
        return n.includes("empresa") || n.includes("corporat");
    });

    // Fallback: if filtering gives nothing (e.g. backend used unexpected names),
    // distribute plans evenly by index
    const efectivoPersonal = planesPersonal.length > 0 ? planesPersonal : planes.slice(0, 1);
    const efectivoFamiliar = planesFamiliar.length > 0 ? planesFamiliar : planes.slice(1, 2);
    const efectivoCorporativo = planesCorporativo.length > 0 ? planesCorporativo : planes.slice(2, 3);

    // For personal: the most expensive one is "destacado"
    const planDestacadoId =
        efectivoPersonal.length > 1
            ? efectivoPersonal.reduce((prev, curr) =>
                  curr.precio_mensual > prev.precio_mensual ? curr : prev
              ).id
            : null;

    return (
        <div className="min-h-screen bg-white">
            {/* ── Header ── */}
            <div className="pt-16 pb-10 text-center px-6">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Nuestros planes</h1>
                <p className="text-slate-500 text-lg">Elegí la cobertura que mejor se adapta a vos</p>

                {/* Tabs */}
                <div className="flex items-center justify-center gap-2 mt-8 overflow-x-auto pb-1">
                    {TABS.filter((t) => !(isAuthenticated && t.id === "corporativo")).map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                                tab === t.id
                                    ? "bg-[#4C1D95] text-white shadow-lg shadow-[#4C1D95]/20"
                                    : "border border-slate-200 text-slate-600 hover:border-[#4C1D95]/30 hover:text-[#4C1D95]"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Content ── */}
            <div className="max-w-6xl mx-auto px-6 pb-20">

                {/* ── Tab: Personal ── */}
                {tab === "personal" && (
                    <div>
                        {cargando ? (
                            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                                <SkeletonCard />
                                <SkeletonCard />
                            </div>
                        ) : efectivoPersonal.length === 1 ? (
                            <div className="max-w-sm mx-auto">
                                <PlanCard
                                    plan={efectivoPersonal[0]}
                                    isAuthenticated={isAuthenticated}
                                    sessionChecked={sessionChecked}
                                    suscripcion={suscripcion}
                                />
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                                {efectivoPersonal.map((plan) => (
                                    <PlanCard
                                        key={plan.id}
                                        plan={plan}
                                        isAuthenticated={isAuthenticated}
                                        sessionChecked={sessionChecked}
                                        suscripcion={suscripcion}
                                        destacado={plan.id === planDestacadoId}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Tab: Familiar ── */}
                {tab === "familiar" && (
                    <div>
                        {cargando ? (
                            <div className="max-w-xl mx-auto">
                                <SkeletonCard />
                            </div>
                        ) : (
                            <div className="grid lg:grid-cols-2 gap-8 max-w-3xl mx-auto items-center">
                                {efectivoFamiliar.length > 0 ? (
                                    <PlanCard
                                        plan={efectivoFamiliar[0]}
                                        isAuthenticated={isAuthenticated}
                                        sessionChecked={sessionChecked}
                                        suscripcion={suscripcion}
                                    />
                                ) : (
                                    <PlanCard
                                        plan={FALLBACK_PLANES[1]}
                                        isAuthenticated={isAuthenticated}
                                        sessionChecked={sessionChecked}
                                        suscripcion={suscripcion}
                                    />
                                )}
                                {/* Decorative image */}
                                <div className="hidden lg:block rounded-3xl overflow-hidden aspect-4/3 relative">
                                    <Image
                                        src="/familiamodelo.png"
                                        alt="Familia usando CelDoctor"
                                        fill
                                        sizes="(max-width: 1024px) 0vw, 50vw"
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-[#1e0b4b]/50 to-transparent" />
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <p className="text-white font-bold">Salud para toda tu familia</p>
                                        <p className="text-white/70 text-sm mt-0.5">Hasta 5 integrantes · Pediatría 24/7</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Tab: Corporativo ── */}
                {tab === "corporativo" && (
                    <div className="max-w-2xl mx-auto">
                        {cargando ? (
                            <SkeletonCard />
                        ) : (
                            <>
                                {efectivoCorporativo.length > 0 ? (
                                    <PlanCard
                                        plan={efectivoCorporativo[0]}
                                        isAuthenticated={isAuthenticated}
                                        sessionChecked={sessionChecked}
                                        suscripcion={suscripcion}
                                    />
                                ) : (
                                    <PlanCard
                                        plan={FALLBACK_PLANES[2]}
                                        isAuthenticated={isAuthenticated}
                                        sessionChecked={sessionChecked}
                                        suscripcion={suscripcion}
                                    />
                                )}

                                {/* Características empresariales */}
                                <div className="mt-10">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Incluye para tu empresa:</h3>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {[
                                            { icon: "📊", title: "Dashboard de gestión", desc: "Monitoreá el ausentismo y uso de la plataforma en tiempo real." },
                                            { icon: "🧾", title: "Factura A discriminada", desc: "Emitimos comprobante A para que deduzcas el gasto empresarial." },
                                            { icon: "👤", title: "Account Manager dedicado", desc: "Un asesor exclusivo para gestionar tu cuenta corporativa." },
                                            { icon: "⚡", title: "Altas y bajas en 1 click", desc: "Gestioná tu nómina de empleados desde el panel de control." },
                                            { icon: "🩺", title: "Chequeo anual ejecutivo", desc: "Evaluación médica integral anual para cada empleado." },
                                        ].map((f, i) => (
                                            <div key={i} className="p-5 rounded-2xl border border-slate-100 bg-white hover:border-[#4C1D95]/20 transition-all">
                                                <p className="text-2xl mb-2">{f.icon}</p>
                                                <p className="font-bold text-slate-900 text-sm mb-1">{f.title}</p>
                                                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
