"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, User } from "lucide-react";
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

export default function PlanesPersonalesContent() {
    const { isAuthenticated, sessionChecked, suscripcion } = useCurrentSubscription();
    const [planIndividual, setPlanIndividual] = useState<Plan>(PLAN_INDIVIDUAL_FALLBACK);

    useEffect(() => {
        if (!sessionChecked) {
            return;
        }

        const fetchPlanes = isAuthenticated ? obtenerPlanesUsuario() : obtenerPlanes();
        fetchPlanes.then((planes) => {
            const plan = planes.find((item) => {
                const nombre = item.nombre.toLowerCase();
                return nombre.includes("individual") || nombre.includes("personal");
            });

            if (plan) {
                setPlanIndividual(plan);
            }
        });
    }, [isAuthenticated, sessionChecked]);

    const action = getPlanPurchaseState(planIndividual, suscripcion, isAuthenticated, sessionChecked);

    return (
        <>
            <section className="relative overflow-hidden bg-[#1e0b4b] pt-28 pb-20 lg:pt-36 lg:pb-28">
                <div className="pointer-events-none absolute top-1/2 left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4C1D95]/30 blur-[150px]" />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }}
                />

                <div className="relative z-10 mx-auto max-w-7xl px-6">
                    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#c4b5fd]">
                                <User size={12} /> Plan individual
                            </div>

                            <h1 className="mb-6 text-4xl leading-[1.1] font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                                Atencion medica inmediata,
                                <br />
                                <span className="bg-gradient-to-r from-[#c4b5fd] to-white bg-clip-text text-transparent">
                                    sin letra chica.
                                </span>
                            </h1>

                            <p className="mb-8 max-w-lg text-lg leading-relaxed text-white/70">
                                Un solo plan, claro y simple: cobertura digital para una persona con consultas ilimitadas,
                                guardia 24/7 y recetas al instante.
                            </p>

                            <a
                                href="#plan-individual"
                                className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-[#2E1065] shadow-lg transition-all hover:-translate-y-1 hover:bg-slate-100 active:scale-95"
                            >
                                Ver plan
                            </a>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                            <div className="relative">
                                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-3 shadow-2xl shadow-black/20 backdrop-blur-sm">
                                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
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
                                <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-[#4C1D95]/10 blur-2xl" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section id="plan-individual" className="relative overflow-hidden border-t border-slate-100 bg-white py-24">
                <div className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-[#4C1D95]/5 blur-[120px]" />

                <div className="relative z-10 mx-auto max-w-5xl px-6">
                    <div className="mb-14 text-center">
                        <h2 className="mb-2 text-3xl font-bold text-slate-900">Plan individual</h2>
                        <p className="text-slate-500">Una sola opcion clara y consistente con el producto real.</p>
                    </div>

                    <div className="mx-auto max-w-md">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex flex-col rounded-[2rem] border border-[#5f2ec4] bg-gradient-to-b from-[#34106D] to-[#25084E] p-8 shadow-2xl shadow-[#4C1D95]/30"
                        >
                            <div className="mb-8">
                                <h3 className="mb-2 text-4xl font-bold text-white">{planIndividual.nombre || "Individual"}</h3>
                                <p className="text-lg text-white/70">{planIndividual.descripcion || "Plan para una persona"}</p>
                                <div className="mt-8">
                                    <span className="text-5xl font-bold text-white">
                                        ${planIndividual.precio_mensual.toLocaleString("es-AR")}
                                    </span>
                                    <span className="ml-2 text-xl text-white/70">/mes</span>
                                </div>
                            </div>

                            <ul className="mb-10 flex-1 space-y-4">
                                {FEATURES.map((item) => (
                                    <li key={item} className="flex items-start gap-3 text-lg text-white">
                                        <CheckCircle2 size={18} className="mt-1 shrink-0 text-[#c4b5fd]" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            {action.disabled || !action.href ? (
                                <span className="block w-full rounded-2xl border border-white/10 bg-white/15 py-4 text-center text-xl font-bold text-white/70">
                                    {action.label}
                                </span>
                            ) : (
                                <Link
                                    href={action.href}
                                    className="block w-full rounded-2xl border border-white/20 py-4 text-center text-xl font-bold text-white transition-all hover:bg-white hover:text-[#2E1065]"
                                >
                                    {action.label}
                                </Link>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
}
