"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Users, CheckCircle2, Baby, Heart, Stethoscope, Clock, FileText, Smartphone, Video, Shield } from "lucide-react";

export default function PersonalFamiliarSelector() {
    const [tab, setTab] = useState<"personal" | "familiar">("personal");

    const personalFeatures = [
        { icon: Stethoscope, text: "Consultas médicas ilimitadas" },
        { icon: Clock, text: "Guardia 24/7 sin espera" },
        { icon: FileText, text: "Recetas digitales al instante" },
        { icon: Smartphone, text: "App intuitiva y completa" },
        { icon: Video, text: "Videollamada HD cifrada" },
        { icon: Shield, text: "Sin copagos ni costos extra" },
    ];

    const familiarExtras = [
        { icon: Users, text: "Hasta 4 miembros incluidos" },
        { icon: Baby, text: "Pediatría prioritaria" },
        { icon: Heart, text: "Certificados escolares y deportivos" },
        { icon: CheckCircle2, text: "Consultas simultáneas (2 a la vez)" },
    ];

    const comparison = [
        { feature: "Consultas ilimitadas", personal: true, familiar: true },
        { feature: "Guardia 24/7", personal: true, familiar: true },
        { feature: "Recetas digitales", personal: true, familiar: true },
        { feature: "Historial clínico", personal: true, familiar: true },
        { feature: "Descuentos en farmacias", personal: true, familiar: true },
        { feature: "Hasta 4 miembros", personal: false, familiar: true },
        { feature: "Pediatría prioritaria", personal: false, familiar: true },
        { feature: "Certificados escolares", personal: false, familiar: true },
        { feature: "Consultas simultáneas", personal: false, familiar: true },
    ];

    return (
        <>
            {/* ─── TAB SELECTOR ─── */}
            <section className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    {/* Tabs */}
                    <div className="flex items-center justify-center gap-3 mb-12">
                        <button
                            onClick={() => setTab("personal")}
                            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all ${tab === "personal"
                                    ? "bg-[#4C1D95] text-white shadow-xl shadow-[#4C1D95]/20"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            <User size={20} />
                            Personal — $4.500/mes
                        </button>
                        <button
                            onClick={() => setTab("familiar")}
                            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all ${tab === "familiar"
                                    ? "bg-[#4C1D95] text-white shadow-xl shadow-[#4C1D95]/20"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            <Users size={20} />
                            Familiar — $12.500/mes
                        </button>
                    </div>

                    {/* Features */}
                    <motion.div
                        key={tab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                            {personalFeatures.map((f, i) => {
                                const Icon = f.icon;
                                return (
                                    <div
                                        key={i}
                                        className="flex items-center gap-4 p-5 rounded-2xl border border-slate-100 bg-white hover:border-[#4C1D95]/20 hover:shadow-md transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-[#4C1D95]/5 text-[#4C1D95] flex items-center justify-center shrink-0">
                                            <Icon size={20} />
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700">{f.text}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {tab === "familiar" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Users size={20} className="text-[#4C1D95]" />
                                    Extras del Plan Familiar
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {familiarExtras.map((f, i) => {
                                        const Icon = f.icon;
                                        return (
                                            <div
                                                key={i}
                                                className="flex items-center gap-4 p-5 rounded-2xl border border-[#4C1D95]/10 bg-[#4C1D95]/[0.02] hover:shadow-md transition-all"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-[#4C1D95] text-white flex items-center justify-center shrink-0">
                                                    <Icon size={20} />
                                                </div>
                                                <span className="text-sm font-semibold text-slate-700">{f.text}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* ─── COMPARISON TABLE ─── */}
            <section className="py-16 bg-slate-50 border-y border-slate-100">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Comparativa detallada</h2>
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        {/* Header */}
                        <div className="grid grid-cols-3 bg-slate-50 p-4 border-b border-slate-100">
                            <span className="text-sm font-bold text-slate-500">Característica</span>
                            <span className="text-sm font-bold text-[#4C1D95] text-center">Personal</span>
                            <span className="text-sm font-bold text-[#4C1D95] text-center">Familiar</span>
                        </div>
                        {comparison.map((row, i) => (
                            <div key={i} className={`grid grid-cols-3 p-4 items-center ${i < comparison.length - 1 ? "border-b border-slate-50" : ""} hover:bg-slate-50/50 transition-colors`}>
                                <span className="text-sm text-slate-700 font-medium">{row.feature}</span>
                                <div className="flex justify-center">
                                    {row.personal ? <CheckCircle2 size={18} className="text-[#4C1D95]" /> : <span className="w-4 h-px bg-slate-200 rounded" />}
                                </div>
                                <div className="flex justify-center">
                                    {row.familiar ? <CheckCircle2 size={18} className="text-[#4C1D95]" /> : <span className="w-4 h-px bg-slate-200 rounded" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
