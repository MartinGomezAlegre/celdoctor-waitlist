"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { obtenerPlanes, type Plan, type Suscripcion } from "@/lib/api";
import { getPlanPurchaseState, isCorporatePlan } from "@/lib/plan-purchase";
import { useCurrentSubscription } from "@/lib/use-current-subscription";

const FALLBACK_PLANES: Plan[] = [
    {
        id: 1,
        nombre: "Individual",
        descripcion: "Cobertura agil para vos. Sin vueltas.",
        precio_mensual: 9500,
        max_beneficiarios: 1,
    },
    {
        id: 2,
        nombre: "Familiar",
        descripcion: "Proteccion total para tus seres queridos.",
        precio_mensual: 18000,
        max_beneficiarios: 4,
    },
    {
        id: 3,
        nombre: "Corporativo",
        descripcion: "Potencia la salud de tu equipo.",
        precio_mensual: 0,
        max_beneficiarios: null,
    },
];

const BENEFICIOS_PERSONAL = [
    "Consultas medicas ilimitadas",
    "Guardia 24/7 sin espera",
    "Recetas digitales al instante",
    "Historia clinica digital",
    "Sin copagos sorpresa",
];

const BENEFICIOS_FAMILIAR = [
    "Todo lo del plan personal",
    "Titular + 3 integrantes incluidos",
    "Pediatria prioritaria",
    "Certificados escolares y deportivos",
    "Consultas simultaneas",
];

const BENEFICIOS_EMPRESARIAL = [
    "Todo lo del plan familiar",
    "Dashboard de gestion empresarial",
    "Factura A discriminada",
    "Account Manager dedicado",
    "Altas y bajas en 1 click",
];

function getBeneficios(nombre: string): string[] {
    const n = nombre.toLowerCase();

    if (n.includes("empresa") || n.includes("corporat")) {
        return BENEFICIOS_EMPRESARIAL;
    }

    if (n.includes("familiar") || n.includes("familia")) {
        return BENEFICIOS_FAMILIAR;
    }

    return BENEFICIOS_PERSONAL;
}

function normalizeHomePlan(plan: Plan): Plan {
    const nombre = plan.nombre.toLowerCase();

    if (nombre.includes("individual") || nombre.includes("personal")) {
        return { ...plan, precio_mensual: 9500 };
    }

    if (nombre.includes("familiar") || nombre.includes("familia")) {
        return { ...plan, precio_mensual: 18000 };
    }

    return plan;
}

function formatBeneficiarios(max: number | null): string {
    if (max === null) return "Beneficiarios ilimitados";
    if (max === 1) return "1 beneficiario";
    return `${max} personas en total`;
}

function SkeletonPlanCard() {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 animate-pulse">
            <div className="mb-4 h-8 w-1/2 rounded bg-white/10" />
            <div className="mb-6 h-4 w-3/4 rounded bg-white/10" />
            <div className="mb-6 h-10 w-1/3 rounded bg-white/10" />
            <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="h-4 rounded bg-white/10" />
                ))}
            </div>
            <div className="mt-8 h-12 rounded-xl bg-white/10" />
        </div>
    );
}

function PlanActionButton({
    plan,
    destacado,
    isAuthenticated,
    sessionChecked,
    suscripcion,
}: {
    plan: Plan;
    destacado?: boolean;
    isAuthenticated: boolean;
    sessionChecked: boolean;
    suscripcion: Suscripcion | null | undefined;
}) {
    const action = getPlanPurchaseState(plan, suscripcion, isAuthenticated, sessionChecked);
    const enabledClass = destacado
        ? "bg-white text-[#2E1065] hover:bg-slate-100 shadow-lg"
        : "border border-white/20 text-white hover:bg-white hover:text-[#2E1065]";
    const disabledClass = destacado
        ? "bg-white/25 text-white/70 cursor-not-allowed"
        : "border border-white/10 text-white/40 cursor-not-allowed";

    if (action.disabled || !action.href) {
        return (
            <span
                aria-disabled="true"
                className={`block w-full rounded-xl py-4 text-center font-bold ${disabledClass}`}
            >
                {action.label}
            </span>
        );
    }

    return (
        <Link
            href={action.href}
            className={`block w-full rounded-xl py-4 text-center font-bold transition-all ${enabledClass}`}
        >
            {action.label}
        </Link>
    );
}

function PlanCard({
    plan,
    destacado,
    isAuthenticated,
    sessionChecked,
    suscripcion,
}: {
    plan: Plan;
    destacado?: boolean;
    isAuthenticated: boolean;
    sessionChecked: boolean;
    suscripcion: Suscripcion | null | undefined;
}) {
    const baseCard = destacado
        ? "bg-linear-to-b from-[#4C1D95] to-[#2E1065] border border-[#6D28D9] shadow-2xl shadow-[#4C1D95]/40"
        : "bg-white/5 border border-white/10 hover:border-[#a78bfa]/50 hover:bg-white/10";
    const esCorporativo = isCorporatePlan(plan);

    return (
        <div className={`flex flex-col rounded-3xl p-8 transition-all ${baseCard}`}>
            <div className="mb-6">
                <h3 className="mb-1 text-2xl font-bold text-white">{plan.nombre}</h3>
                <p className={`mt-1 text-sm ${destacado ? "text-white/80" : "text-white/60"}`}>
                    {plan.descripcion}
                </p>
                <div className="mt-4">
                    {esCorporativo ? (
                        <span className="text-2xl font-bold text-[#a78bfa]">A consultar</span>
                    ) : (
                        <>
                            <span className="text-3xl font-bold text-white">
                                ${plan.precio_mensual.toLocaleString("es-AR")}
                            </span>
                            <span className={`ml-1 text-sm ${destacado ? "text-white/60" : "text-white/50"}`}>
                                /mes
                            </span>
                        </>
                    )}
                </div>
            </div>

            <div className="mb-8 flex-1 space-y-2.5">
                <p className={`flex items-center gap-2 text-sm ${destacado ? "text-white" : "text-white/80"}`}>
                    <CheckCircle2
                        size={16}
                        className={destacado ? "shrink-0 text-white" : "shrink-0 text-[#a78bfa]"}
                    />
                    {formatBeneficiarios(plan.max_beneficiarios)}
                </p>

                {getBeneficios(plan.nombre).map((beneficio) => (
                    <p
                        key={beneficio}
                        className={`flex items-center gap-2 text-sm ${destacado ? "text-white" : "text-white/80"}`}
                    >
                        <CheckCircle2
                            size={16}
                            className={destacado ? "shrink-0 text-white" : "shrink-0 text-[#a78bfa]"}
                        />
                        {beneficio}
                    </p>
                ))}
            </div>

            <PlanActionButton
                plan={plan}
                destacado={destacado}
                isAuthenticated={isAuthenticated}
                sessionChecked={sessionChecked}
                suscripcion={suscripcion}
            />
        </div>
    );
}

export default function PlansSection() {
    const [planes, setPlanes] = useState<Plan[]>([]);
    const [cargando, setCargando] = useState(true);
    const { isAuthenticated, sessionChecked, suscripcion } = useCurrentSubscription();

    useEffect(() => {
        obtenerPlanes()
            .then((data) => {
                const source = data.length > 0 ? data : FALLBACK_PLANES;
                setPlanes(source.map(normalizeHomePlan));
            })
            .finally(() => setCargando(false));
    }, []);

    const planDestacadoId = planes[1]?.id;

    return (
        <section id="planes" className="relative overflow-hidden border-t border-white/5 bg-[#1e0b4b] py-24">
            <div className="pointer-events-none absolute top-0 left-1/2 h-150 w-250 -translate-x-1/2 rounded-full bg-[#4C1D95]/20 blur-[120px]" />

            <div className="relative z-10 mx-auto max-w-7xl px-6">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-bold text-white">Elegi tu cobertura</h2>
                    <p className="mt-2 text-white/60">Planes flexibles disenados para cada etapa.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
                    {cargando
                        ? [1, 2, 3].map((item) => <SkeletonPlanCard key={item} />)
                        : planes.map((plan) => (
                              <PlanCard
                                  key={plan.id}
                                  plan={plan}
                                  destacado={plan.id === planDestacadoId}
                                  isAuthenticated={isAuthenticated}
                                  sessionChecked={sessionChecked}
                                  suscripcion={suscripcion}
                              />
                          ))}
                </div>
            </div>
        </section>
    );
}
