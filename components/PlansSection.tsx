"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { obtenerPlanes, type Plan } from "@/lib/api";
import { useLocalStorageValue } from "@/lib/use-local-storage-value";

// ─── Fallback hardcodeado (se usa si la API no responde) ──────────────────────
const FALLBACK_PLANES: Plan[] = [
    {
        id: 1,
        nombre: "Individual",
        descripcion: "Cobertura ágil para vos. Sin vueltas.",
        precio_mensual: 5000,
        max_beneficiarios: 1,
    },
    {
        id: 2,
        nombre: "Familiar",
        descripcion: "Protección total para tus seres queridos.",
        precio_mensual: 12500,
        max_beneficiarios: 4,
    },
    {
        id: 3,
        nombre: "Corporativo",
        descripcion: "Potenciá la salud de tu equipo.",
        precio_mensual: 0,
        max_beneficiarios: null,
    },
];

// ─── Beneficios por tipo de plan ──────────────────────────────────────────────
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatBeneficiarios(max: number | null): string {
    if (max === null) return "Beneficiarios ilimitados";
    if (max === 1) return "1 beneficiario";
    return `${max} personas en total`;
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonPlanCard() {
    return (
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col animate-pulse">
            <div className="w-14 h-14 bg-white/10 rounded-2xl mb-4" />
            <div className="h-6 bg-white/10 rounded w-1/2 mb-2" />
            <div className="h-4 bg-white/10 rounded w-3/4 mb-6" />
            <div className="h-10 bg-white/10 rounded w-1/3 mb-6" />
            <div className="space-y-3 flex-1">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-4 bg-white/10 rounded w-full" />
                ))}
            </div>
            <div className="h-12 bg-white/10 rounded-xl mt-8" />
        </div>
    );
}

// ─── Card de plan dinámico ────────────────────────────────────────────────────
function PlanCard({
    plan,
    destacado,
    token,
}: {
    plan: Plan;
    destacado?: boolean;
    token: string | null;
}) {
    const baseCard = destacado
        ? "bg-linear-to-b from-[#4C1D95] to-[#2E1065] border-[#6D28D9] border shadow-2xl shadow-[#4C1D95]/40 hover:scale-[1.02]"
        : "bg-white/5 border border-white/10 hover:border-[#a78bfa]/50 hover:bg-white/10";

    const esCorporativo =
        plan.precio_mensual === 0 ||
        plan.nombre.toLowerCase().includes("corporat") ||
        plan.nombre.toLowerCase().includes("empresa");
    const ctaHref = esCorporativo
        ? "/planes/corporativos#form-contacto-empresarial"
        : token ? `/checkout/${plan.id}` : "/registro";

    return (
        <div className={`p-8 rounded-3xl transition-all flex flex-col group ${baseCard}`}>
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-1">{plan.nombre}</h3>
                <p className={`text-sm mt-1 ${destacado ? "text-white/80" : "text-white/60"}`}>
                    {plan.descripcion}
                </p>
                <div className="mt-4">
                    {plan.precio_mensual === 0 ? (
                        <span className="text-2xl font-bold text-[#a78bfa]">A consultar</span>
                    ) : (
                        <>
                            <span className="text-3xl font-bold text-white">
                                ${plan.precio_mensual.toLocaleString("es-AR")}
                            </span>
                            <span className={`text-sm ml-1 ${destacado ? "text-white/60" : "text-white/50"}`}>
                                /mes
                            </span>
                        </>
                    )}
                </div>
            </div>

            <div className="flex-1 mb-8 space-y-2.5">
                <p className={`text-sm flex items-center gap-2 ${destacado ? "text-white" : "text-white/80"}`}>
                    <CheckCircle2
                        size={16}
                        className={destacado ? "text-white shrink-0" : "text-[#a78bfa] shrink-0"}
                    />
                    {formatBeneficiarios(plan.max_beneficiarios)}
                </p>
                {getBeneficios(plan.nombre).map((b, i) => (
                    <p key={i} className={`text-sm flex items-center gap-2 ${destacado ? "text-white" : "text-white/80"}`}>
                        <CheckCircle2
                            size={16}
                            className={destacado ? "text-white shrink-0" : "text-[#a78bfa] shrink-0"}
                        />
                        {b}
                    </p>
                ))}
            </div>

            <Link
                href={ctaHref}
                className={`w-full py-4 text-center rounded-xl font-bold block transition-all ${
                    destacado
                        ? "bg-white text-[#2E1065] hover:bg-slate-100 shadow-lg"
                        : "border border-white/20 text-white hover:bg-white hover:text-[#2E1065]"
                }`}
            >
                {esCorporativo ? "Solicitar propuesta" : "Contratar ahora"}
            </Link>
        </div>
    );
}

// ─── Sección principal ────────────────────────────────────────────────────────
export default function PlansSection() {
    const [planes, setPlanes] = useState<Plan[]>([]);
    const [cargando, setCargando] = useState(true);
    const [token] = useLocalStorageValue("celdoctor_token");

    useEffect(() => {
        obtenerPlanes().then((data) => {
            setPlanes(data.length > 0 ? data : FALLBACK_PLANES);
            setCargando(false);
        });
    }, []);

    // El plan del medio (índice 1) se muestra destacado
    const planDestacadoId = planes[1]?.id;

    return (
        <section id="planes" className="py-24 bg-[#1e0b4b] border-t border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-150 bg-[#4C1D95]/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white">Elegí tu cobertura</h2>
                    <p className="text-white/60 mt-2">Planes flexibles diseñados para cada etapa.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {cargando
                        ? [1, 2, 3].map((i) => <SkeletonPlanCard key={i} />)
                        : planes.map((plan) => (
                              <PlanCard
                                  key={plan.id}
                                  plan={plan}
                                  destacado={plan.id === planDestacadoId}
                                  token={token}
                              />
                          ))}
                </div>
            </div>
        </section>
    );
}
