"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { planBasic, planPremium } from "./planes.data";
import { obtenerPlanes, type Plan } from "@/lib/api";

export default function PlanesCards() {
    const [token] = useState<string | null>(() => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("celdoctor_token");
    });
    // IDs reales de la API para armar el href de checkout
    const [planesApi, setPlanesApi] = useState<Plan[]>([]);

    useEffect(() => {
        obtenerPlanes().then(setPlanesApi);
    }, []);

    // Asumimos que el primer plan de la API corresponde a Basic y el segundo a Premium
    const idBasic = planesApi[0]?.id ?? null;
    const idPremium = planesApi[1]?.id ?? null;

    function ctaHref(planApiId: number | null): string {
        if (token && planApiId !== null) return `/checkout/${planApiId}`;
        return "/registro";
    }

    return (
        <section id="planes" className="py-20 bg-white">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/10 text-[#4C1D95] text-[11px] font-bold uppercase tracking-wider mb-4">
                        <Sparkles size={12} /> Planes Personales
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">Elegí tu plan ideal</h2>
                    <p className="text-slate-500 max-w-xl mx-auto">Dos opciones pensadas para vos. Sin copagos, sin letra chica.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                    {/* Basic */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-3xl p-8 lg:p-10 border border-slate-200 bg-white hover:border-[#4C1D95]/20 hover:shadow-xl transition-all"
                    >
                        <h3 className="text-2xl font-bold text-slate-900 mb-1">{planBasic.name}</h3>
                        <p className="text-sm text-slate-500 mb-5">{planBasic.desc}</p>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-[#4C1D95]">{planBasic.price}</span>
                            <span className="text-sm text-slate-400 ml-1">{planBasic.period}</span>
                        </div>
                        <ul className="space-y-3 mb-8">
                            {planBasic.features.map((f, i) => (
                                <li key={i} className="flex items-center gap-2.5 text-sm">
                                    {f.included
                                        ? <CheckCircle2 size={16} className="text-[#4C1D95] shrink-0" />
                                        : <XCircle size={16} className="text-slate-300 shrink-0" />
                                    }
                                    <span className={f.included ? "text-slate-700" : "text-slate-300"}>{f.text}</span>
                                </li>
                            ))}
                        </ul>
                        <Link
                            href={ctaHref(idBasic)}
                            className="block w-full py-3.5 text-center rounded-xl border border-[#4C1D95]/20 text-[#4C1D95] font-bold text-sm hover:bg-[#4C1D95] hover:text-white hover:shadow-lg hover:shadow-[#4C1D95]/20 transition-all"
                        >
                            Elegir Basic
                        </Link>
                    </motion.div>

                    {/* Premium */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="rounded-3xl p-8 lg:p-10 bg-gradient-to-b from-[#4C1D95] to-[#2E1065] border-2 border-[#6D28D9] shadow-2xl shadow-[#4C1D95]/30 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 bg-white text-[#4C1D95] text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
                            {planPremium.badge}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">{planPremium.name}</h3>
                        <p className="text-sm text-white/60 mb-5">{planPremium.desc}</p>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-white">{planPremium.price}</span>
                            <span className="text-sm text-white/50 ml-1">{planPremium.period}</span>
                        </div>
                        <ul className="space-y-3 mb-8">
                            {planPremium.features.map((f, i) => (
                                <li key={i} className="flex items-center gap-2.5 text-sm text-white">
                                    <CheckCircle2 size={16} className="text-white shrink-0" />
                                    <span>{f.text}</span>
                                </li>
                            ))}
                        </ul>
                        <Link
                            href={ctaHref(idPremium)}
                            className="block w-full py-3.5 text-center rounded-xl bg-white text-[#2E1065] font-bold text-sm hover:bg-slate-100 transition-all shadow-lg"
                        >
                            Elegir Premium
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
