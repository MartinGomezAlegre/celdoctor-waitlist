"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, User } from "lucide-react";
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

export default function PlanesPersonalesContent() {
    const [token, , tokenHydrated] = useLocalStorageValue("celdoctor_token");
    const [planIndividual, setPlanIndividual] = useState<Plan>(PLAN_INDIVIDUAL_FALLBACK);

    useEffect(() => {
        if (!tokenHydrated) {
            return;
        }

        const fetchPlanes = token ? obtenerPlanesUsuario() : obtenerPlanes();
        fetchPlanes.then((planes) => {
            const plan = planes.find((item) => {
                const nombre = item.nombre.toLowerCase();
                return nombre.includes("individual") || nombre.includes("personal");
            });

            if (plan) {
                setPlanIndividual(plan);
            }
        });
    }, [token, tokenHydrated]);

    const ctaHref = useMemo(() => {
        if (!tokenHydrated) {
            return "/registro";
        }

        return token ? `/checkout/${planIndividual.id}` : "/registro";
    }, [planIndividual.id, token, tokenHydrated]);

    return (
        <>
            <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-[#1e0b4b]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[150px] pointer-events-none bg-[#4C1D95]/30" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-[#c4b5fd] text-[11px] font-bold uppercase tracking-wider mb-6">
                                <User size={12} /> Plan Individual
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                                Atención médica inmediata,
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c4b5fd] to-white">sin letra chica.</span>
                            </h1>

                            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
                                Un solo plan, claro y simple: cobertura digital para una persona con consultas ilimitadas, guardia 24/7 y recetas al instante.
                            </p>

                            <a
                                href="#plan-individual"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#2E1065] rounded-2xl font-bold text-base hover:bg-slate-100 transition-all shadow-lg hover:-translate-y-1 active:scale-95"
                            >
                                Ver plan
                            </a>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                            <div className="relative">
                                <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-3 shadow-2xl shadow-black/20 backdrop-blur-sm">
                                    <div className="rounded-2xl aspect-[4/3] relative overflow-hidden">
                                        <Image
                                            src="/personalmodelo.png"
                                            alt="Plan individual CelDoctor"
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1e0b4b]/40 to-transparent" />
                                    </div>
                                </div>
                                <div className="absolute -inset-4 bg-[#4C1D95]/10 rounded-[2rem] blur-2xl -z-10" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section id="plan-individual" className="py-24 bg-white border-t border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#4C1D95]/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Plan Individual</h2>
                        <p className="text-slate-500">La opción correcta para una persona. Sin comparativas falsas ni planes duplicados.</p>
                    </div>

                    <div className="max-w-md mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-[2rem] bg-gradient-to-b from-[#34106D] to-[#25084E] border border-[#5f2ec4] shadow-2xl shadow-[#4C1D95]/30 flex flex-col"
                        >
                            <div className="mb-8">
                                <h3 className="text-4xl font-bold text-white mb-2">{planIndividual.nombre || "Individual"}</h3>
                                <p className="text-white/70 text-lg">{planIndividual.descripcion || "Plan para una persona"}</p>
                                <div className="mt-8">
                                    <span className="text-5xl font-bold text-white">
                                        ${planIndividual.precio_mensual.toLocaleString("es-AR")}
                                    </span>
                                    <span className="text-xl text-white/70 ml-2">/mes</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                {FEATURES.map((item) => (
                                    <li key={item} className="flex items-start gap-3 text-white text-lg">
                                        <CheckCircle2 size={18} className="text-[#c4b5fd] shrink-0 mt-1" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={ctaHref}
                                className="w-full py-4 text-center border border-white/20 text-white rounded-2xl font-bold text-xl hover:bg-white hover:text-[#2E1065] transition-all block"
                            >
                                Contratar ahora
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
}
