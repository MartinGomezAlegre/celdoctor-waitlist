"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    CheckCircle2, XCircle, User, Users, Building2, Shield,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";

const plans = [
    {
        id: "personal",
        icon: User,
        name: "Personal",
        price: "$4.500",
        priceLabel: "/mes",
        desc: "Cobertura ideal para una persona.",
        features: [
            { text: "Consultas médicas ilimitadas", included: true },
            { text: "Guardia 24/7", included: true },
            { text: "Recetas digitales", included: true },
            { text: "Historial clínico digital", included: true },
            { text: "Descuentos en farmacias", included: true },
            { text: "Hasta 4 miembros", included: false },
            { text: "Pediatría prioritaria", included: false },
            { text: "Certificados escolares", included: false },
        ],
    },
    {
        id: "familiar",
        icon: Users,
        name: "Familiar",
        price: "$12.500",
        priceLabel: "/mes",
        desc: "Protección completa para toda la familia.",
        featured: true,
        features: [
            { text: "Consultas médicas ilimitadas", included: true },
            { text: "Guardia 24/7", included: true },
            { text: "Recetas digitales", included: true },
            { text: "Historial clínico digital", included: true },
            { text: "Descuentos en farmacias", included: true },
            { text: "Hasta 4 miembros", included: true },
            { text: "Pediatría prioritaria", included: true },
            { text: "Certificados escolares", included: true },
        ],
    },
    {
        id: "corporativo",
        icon: Building2,
        name: "Corporativo",
        price: "A medida",
        priceLabel: "",
        desc: "Solución integral para empresas.",
        features: [
            { text: "Consultas médicas ilimitadas", included: true },
            { text: "Guardia 24/7", included: true },
            { text: "Recetas digitales", included: true },
            { text: "Historial clínico digital", included: true },
            { text: "Descuentos en farmacias", included: true },
            { text: "Dashboard de gestión", included: true },
            { text: "Account Manager dedicado", included: true },
            { text: "Facturación empresarial", included: true },
        ],
    },
];

export default function PlanesComparador() {
    const [selected, setSelected] = useState("familiar");

    return (
        <section id="comparador" className="py-16 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#4C1D95]/3 rounded-full blur-[120px] pointer-events-none" />
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Compará y elegí</h2>
                    <p className="text-slate-500">Encontrá el plan perfecto para vos.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {plans.map((plan, i) => {
                        const Icon = plan.icon;
                        const isSelected = selected === plan.id;
                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => setSelected(plan.id)}
                                className={`rounded-3xl p-8 cursor-pointer transition-all relative overflow-hidden ${plan.featured
                                        ? "bg-gradient-to-b from-[#4C1D95] to-[#2E1065] border-2 border-[#6D28D9] shadow-2xl shadow-[#4C1D95]/30"
                                        : isSelected
                                            ? "bg-white border-2 border-[#4C1D95]/30 shadow-xl shadow-[#4C1D95]/10"
                                            : "bg-white border border-slate-100 hover:border-[#4C1D95]/20 hover:shadow-lg"
                                    }`}
                            >
                                {plan.featured && (
                                    <div className="absolute top-0 right-0 bg-white text-[#4C1D95] text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
                                        Más popular
                                    </div>
                                )}

                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${plan.featured ? "bg-white/10 text-white border border-white/20" : "bg-[#4C1D95]/5 text-[#4C1D95]"
                                    }`}>
                                    <Icon size={28} />
                                </div>

                                <h3 className={`text-2xl font-bold mb-1 ${plan.featured ? "text-white" : "text-slate-900"}`}>{plan.name}</h3>

                                <div className="mb-2">
                                    <span className={`text-3xl font-bold ${plan.featured ? "text-white" : "text-[#4C1D95]"}`}>{plan.price}</span>
                                    {plan.priceLabel && <span className={`text-sm ml-1 ${plan.featured ? "text-white/60" : "text-slate-400"}`}>{plan.priceLabel}</span>}
                                </div>

                                <p className={`text-sm mb-6 ${plan.featured ? "text-white/70" : "text-slate-500"}`}>{plan.desc}</p>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className={`flex items-center gap-2.5 text-sm ${plan.featured ? "text-white" : "text-slate-600"}`}>
                                            {f.included ? (
                                                <CheckCircle2 size={16} className={`shrink-0 ${plan.featured ? "text-white" : "text-[#4C1D95]"}`} />
                                            ) : (
                                                <XCircle size={16} className={`shrink-0 ${plan.featured ? "text-white/30" : "text-slate-300"}`} />
                                            )}
                                            <span className={!f.included ? (plan.featured ? "text-white/40" : "text-slate-300") : ""}>{f.text}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={plan.id === "corporativo" ? "/planes/corporativos" : "/planes/personales-familiares"}
                                    className={`w-full py-3.5 text-center rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${plan.featured
                                            ? "bg-white text-[#2E1065] hover:bg-slate-100 shadow-lg"
                                            : "border border-[#4C1D95]/20 text-[#4C1D95] hover:bg-[#4C1D95] hover:text-white hover:shadow-lg hover:shadow-[#4C1D95]/20"
                                        }`}
                                >
                                    {plan.id === "corporativo" ? "Contactar" : "Elegir plan"}
                                    <ArrowRight size={14} />
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
