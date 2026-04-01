"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { obtenerPlanes, obtenerPlanesUsuario, type Plan } from "@/lib/api";
import { getPlanPurchaseState } from "@/lib/plan-purchase";
import { useCurrentSubscription } from "@/lib/use-current-subscription";

const PLAN_INDIVIDUAL_FALLBACK: Plan = {
    id: 1,
    nombre: "Individual",
    descripcion: "Plan para una persona",
    precio_mensual: 5000,
    max_beneficiarios: 1,
};

const FEATURES = [
    "1 beneficiario",
    "Consultas medicas ilimitadas",
    "Guardia 24/7 sin espera",
    "Recetas digitales al instante",
    "Historia clinica digital",
    "Sin copagos sorpresa",
];

export default function PlanesCards() {
    const { token, tokenHydrated, suscripcion } = useCurrentSubscription();
    const [plan, setPlan] = useState<Plan>(PLAN_INDIVIDUAL_FALLBACK);

    useEffect(() => {
        if (!tokenHydrated) {
            return;
        }

        const fetchPlanes = token ? obtenerPlanesUsuario() : obtenerPlanes();
        fetchPlanes.then((planes) => {
            const individual = planes.find((item) => {
                const nombre = item.nombre.toLowerCase();
                return nombre.includes("individual") || nombre.includes("personal");
            });

            if (individual) {
                setPlan(individual);
            }
        });
    }, [token, tokenHydrated]);

    const action = getPlanPurchaseState(plan, suscripcion, token, tokenHydrated);

    return (
        <section id="planes" className="bg-white py-20">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mb-14 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#4C1D95]/10 bg-[#4C1D95]/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#4C1D95]">
                        <Sparkles size={12} /> Plan individual
                    </div>
                    <h2 className="mb-3 text-3xl font-bold text-slate-900 lg:text-4xl">Una sola opcion, bien definida</h2>
                    <p className="mx-auto max-w-xl text-slate-500">Dejamos un unico plan personal, claro y consistente con el producto real.</p>
                </div>

                <div className="mx-auto max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-3xl border-2 border-[#6D28D9] bg-gradient-to-b from-[#4C1D95] to-[#2E1065] p-8 shadow-2xl shadow-[#4C1D95]/30 lg:p-10"
                    >
                        <h3 className="mb-1 text-3xl font-bold text-white">{plan.nombre || "Individual"}</h3>
                        <p className="mb-6 text-base text-white/70">{plan.descripcion || "Plan para una persona"}</p>
                        <div className="mb-8">
                            <span className="text-5xl font-bold text-white">${plan.precio_mensual.toLocaleString("es-AR")}</span>
                            <span className="ml-1 text-base text-white/60">/mes</span>
                        </div>

                        <ul className="mb-8 space-y-4">
                            {FEATURES.map((feature) => (
                                <li key={feature} className="flex items-center gap-2.5 text-base text-white">
                                    <CheckCircle2 size={16} className="shrink-0 text-white" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        {action.disabled || !action.href ? (
                            <span className="block w-full rounded-xl bg-white/15 py-3.5 text-center text-lg font-bold text-white/70">
                                {action.label}
                            </span>
                        ) : (
                            <Link
                                href={action.href}
                                className="block w-full rounded-xl bg-white py-3.5 text-center text-lg font-bold text-[#2E1065] shadow-lg transition-all hover:bg-slate-100"
                            >
                                {action.label}
                            </Link>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
