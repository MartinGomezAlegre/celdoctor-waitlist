"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, User } from "lucide-react";
import { type Plan } from "@/lib/api";
import { getPlanPurchaseState } from "@/lib/plan-purchase";
import { useCurrentSubscription } from "@/lib/use-current-subscription";

const PLAN_INDIVIDUAL: Plan = {
    id: 1,
    nombre: "Individual",
    descripcion: "Plan para una persona",
    precio_mensual: 5000,
    max_beneficiarios: 1,
};

const FEATURES = [
    "Consultas medicas ilimitadas.",
    "Guardia 24/7 sin espera.",
    "Recetas digitales al instante.",
    "Historia clinica en la app.",
    "Sin copagos sorpresa.",
];

export default function PersonalPlanSection() {
    const { isAuthenticated, sessionChecked, suscripcion } = useCurrentSubscription();
    const action = getPlanPurchaseState(PLAN_INDIVIDUAL, suscripcion, isAuthenticated, sessionChecked);

    return (
        <section id="plan-personal" className="relative overflow-hidden border-t border-slate-100 bg-white py-24">
            <div className="pointer-events-none absolute top-1/2 left-0 h-200 w-200 -translate-y-1/2 rounded-full bg-[#4C1D95]/5 blur-[150px]" />

            <div className="relative z-10 mx-auto max-w-7xl px-6">
                <div className="grid items-center gap-16 lg:grid-cols-2">
                    <div className="relative order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative z-10 overflow-hidden rounded-[2.5rem] border-[6px] border-white shadow-2xl shadow-slate-200/50"
                        >
                            <Image
                                src="/personalmodelo.png"
                                alt="Plan individual CelDoctor"
                                width={600}
                                height={700}
                                className="h-auto w-full object-cover transition-transform duration-700 hover:scale-100"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6, type: "spring" }}
                            className="absolute -bottom-8 right-10 z-20 flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 pr-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] md:-right-6"
                        >
                            <div className="rounded-full bg-green-100 p-3">
                                <Sparkles size={24} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Precio</p>
                                <p className="text-base font-bold text-slate-900">$5.000/mes</p>
                            </div>
                        </motion.div>
                    </div>

                    <div className="order-1 space-y-8 lg:order-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#4C1D95]/20 bg-[#4C1D95]/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#4C1D95]">
                                <User size={14} /> Plan individual
                            </div>

                            <h2 className="mb-6 text-4xl font-bold leading-tight text-slate-900 lg:text-5xl">
                                Tu salud, sin vueltas ni{" "}
                                <span className="bg-linear-to-r from-[#4C1D95] to-[#7C3AED] bg-clip-text text-transparent">
                                    complicaciones.
                                </span>
                            </h2>

                            <div className="mb-4">
                                <span className="text-4xl font-bold text-[#4C1D95]">$5.000</span>
                                <span className="ml-1 text-lg font-medium text-slate-400">/mes</span>
                            </div>

                            <p className="max-w-xl text-lg leading-relaxed text-slate-600">
                                Accede a consultas medicas ilimitadas, guardia 24/7 y recetas digitales al instante.
                                Sin copagos sorpresa ni costos ocultos.
                            </p>
                        </motion.div>

                        <ul className="space-y-5">
                            {FEATURES.map((item, index) => (
                                <motion.li
                                    key={item}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start gap-4"
                                >
                                    <div className="mt-0.5 rounded-full bg-[#4C1D95] p-1 shadow-lg shadow-[#4C1D95]/20">
                                        <CheckCircle2 size={16} className="text-white" />
                                    </div>
                                    <span className="text-lg font-medium text-slate-700">{item}</span>
                                </motion.li>
                            ))}
                        </ul>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="pt-4"
                        >
                            {action.disabled || !action.href ? (
                                <span className="inline-flex min-w-52 justify-center rounded-xl border border-slate-200 bg-slate-100 px-8 py-4 text-base font-bold text-slate-500">
                                    {action.label}
                                </span>
                            ) : (
                                <Link
                                    href={action.href}
                                    className="inline-flex justify-center rounded-xl bg-[#4C1D95] px-8 py-4 text-base font-bold text-white transition-all hover:-translate-y-1 hover:bg-[#3b1675] hover:shadow-xl hover:shadow-[#4C1D95]/30"
                                >
                                    {action.label}
                                </Link>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
