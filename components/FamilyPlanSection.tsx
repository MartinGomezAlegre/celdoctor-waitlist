"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Heart, Users } from "lucide-react";
import { type Plan } from "@/lib/api";
import { getPlanPurchaseState } from "@/lib/plan-purchase";
import { useCurrentSubscription } from "@/lib/use-current-subscription";

const PLAN_FAMILIAR: Plan = {
    id: 2,
    nombre: "Familiar",
    descripcion: "Proteccion completa para tu familia",
    precio_mensual: 18000,
    max_beneficiarios: 4,
};

const FEATURES = [
    "Titular + 3 integrantes adicionales.",
    "Pediatria prioritaria.",
    "Certificados escolares y deportivos.",
    "Consultas simultaneas.",
    "Todo lo del plan individual incluido.",
];

export default function FamilyPlanSection() {
    const { isAuthenticated, sessionChecked, suscripcion } = useCurrentSubscription();
    const action = getPlanPurchaseState(PLAN_FAMILIAR, suscripcion, isAuthenticated, sessionChecked);

    return (
        <section id="plan-familiar" className="relative overflow-hidden border-t border-slate-100 bg-slate-50 py-24">
            <div className="pointer-events-none absolute top-1/2 right-0 h-200 w-200 -translate-y-1/2 rounded-full bg-[#4C1D95]/5 blur-[150px]" />

            <div className="relative z-10 mx-auto max-w-7xl px-6">
                <div className="grid items-center gap-16 lg:grid-cols-2">
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#4C1D95]/20 bg-[#4C1D95]/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#4C1D95]">
                                <Users size={14} /> Plan familiar
                            </div>

                            <h2 className="mb-6 text-4xl font-bold leading-tight text-slate-900 lg:text-5xl">
                                Proteccion completa para{" "}
                                <span className="bg-linear-to-r from-[#4C1D95] to-[#7C3AED] bg-clip-text text-transparent">
                                    toda tu familia.
                                </span>
                            </h2>

                            <div className="mb-4">
                                <span className="text-4xl font-bold text-[#4C1D95]">$18.000</span>
                                <span className="ml-1 text-lg font-medium text-slate-400">/mes</span>
                            </div>

                            <p className="max-w-xl text-lg leading-relaxed text-slate-600">
                                Inclui hasta 4 personas en total con una sola suscripcion. Nadie se queda sin atencion,
                                y el titular puede gestionar a los integrantes desde su dashboard.
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
                                <span className="inline-flex min-w-56 justify-center rounded-xl border border-slate-200 bg-slate-100 px-8 py-4 text-base font-bold text-slate-500">
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

                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative z-10 overflow-hidden rounded-[2.5rem] border-[6px] border-white shadow-2xl shadow-slate-200/50"
                        >
                            <Image
                                src="/familiamodelo.png"
                                alt="Plan familiar CelDoctor"
                                width={400}
                                height={800}
                                className="h-auto w-full object-cover transition-transform duration-700 hover:scale-100"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6, type: "spring" }}
                            className="absolute -bottom-8 left-10 z-20 flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 pr-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] md:-left-6"
                        >
                            <div className="rounded-full bg-purple-100 p-3">
                                <Heart size={24} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Familia</p>
                                <p className="text-base font-bold text-slate-900">4 personas en total</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
