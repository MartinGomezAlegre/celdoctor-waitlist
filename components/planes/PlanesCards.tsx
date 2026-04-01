"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { obtenerPlanes, obtenerPlanesUsuario, type Plan } from "@/lib/api";
import { useLocalStorageValue } from "@/lib/use-local-storage-value";

const PLAN_INDIVIDUAL_FALLBACK: Plan = {
    id: 1,
    nombre: "Individual",
    descripcion: "Plan para una persona",
    precio_mensual: 5000,
    max_beneficiarios: 1,
};

const FEATURES = [
    "1 beneficiario",
    "Consultas médicas ilimitadas",
    "Guardia 24/7 sin espera",
    "Recetas digitales al instante",
    "Historia clínica digital",
    "Sin copagos sorpresa",
];

export default function PlanesCards() {
    const [token] = useLocalStorageValue("celdoctor_token");
    const [plan, setPlan] = useState<Plan>(PLAN_INDIVIDUAL_FALLBACK);

    useEffect(() => {
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
    }, [token]);

    const href = useMemo(() => {
        return token ? `/checkout/${plan.id}` : "/registro";
    }, [plan.id, token]);

    return (
        <section id="planes" className="py-20 bg-white">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/10 text-[#4C1D95] text-[11px] font-bold uppercase tracking-wider mb-4">
                        <Sparkles size={12} /> Plan Individual
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">Una sola opción, bien definida</h2>
                    <p className="text-slate-500 max-w-xl mx-auto">Dejamos un único plan personal, claro y consistente con el producto real.</p>
                </div>

                <div className="max-w-md mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-3xl p-8 lg:p-10 bg-gradient-to-b from-[#4C1D95] to-[#2E1065] border-2 border-[#6D28D9] shadow-2xl shadow-[#4C1D95]/30"
                    >
                        <h3 className="text-3xl font-bold text-white mb-1">{plan.nombre || "Individual"}</h3>
                        <p className="text-base text-white/70 mb-6">{plan.descripcion || "Plan para una persona"}</p>
                        <div className="mb-8">
                            <span className="text-5xl font-bold text-white">${plan.precio_mensual.toLocaleString("es-AR")}</span>
                            <span className="text-base text-white/60 ml-1">/mes</span>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {FEATURES.map((feature) => (
                                <li key={feature} className="flex items-center gap-2.5 text-base text-white">
                                    <CheckCircle2 size={16} className="text-white shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Link
                            href={href}
                            className="block w-full py-3.5 text-center rounded-xl bg-white text-[#2E1065] font-bold text-lg hover:bg-slate-100 transition-all shadow-lg"
                        >
                            Contratar ahora
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
