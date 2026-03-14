"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ChevronDown, Smartphone } from "lucide-react";

export default function DescuentosHero() {
    const [selectedPlan, setSelectedPlan] = useState("Seleccionar plan");

    return (
        <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-[#1e0b4b]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[150px] pointer-events-none bg-[#4C1D95]/30" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left — Text */}
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-[#a78bfa] text-[11px] font-bold uppercase tracking-wider mb-6">
                            <Sparkles size={12} /> Farmacias Adheridas
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                            Descuentos en<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] to-white">Farmacias</span>
                        </h1>

                        <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
                            Accedé a beneficios exclusivos según tu plan y encontrá farmacias adheridas en tu zona.
                        </p>

                        {/* Plan Selector */}
                        <div className="relative inline-block">
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                            <select
                                value={selectedPlan}
                                onChange={(e) => setSelectedPlan(e.target.value)}
                                className="appearance-none pl-5 pr-12 py-4 rounded-2xl bg-white/10 border border-white/15 text-white font-bold text-base backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#a78bfa]/40 cursor-pointer hover:bg-white/15 transition-all min-w-[220px]"
                                aria-label="Seleccionar plan"
                            >
                                <option value="Seleccionar plan" className="text-slate-900">Seleccionar plan</option>
                                <option value="Personal" className="text-slate-900">Personal</option>
                                <option value="Familiar" className="text-slate-900">Familiar</option>
                                <option value="Corporativo" className="text-slate-900">Corporativo</option>
                            </select>
                        </div>
                    </motion.div>

                    {/* Right — App Screenshot Placeholder */}
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-3 shadow-2xl shadow-black/20 backdrop-blur-sm">
                                <div className="bg-[#0f0525] rounded-2xl aspect-[9/16] max-h-[520px] flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#4C1D95]/20 to-transparent" />
                                    <div className="relative z-10 text-center p-8">
                                        <div className="w-16 h-16 mx-auto bg-[#4C1D95] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#4C1D95]/30">
                                            <Smartphone size={32} className="text-white" />
                                        </div>
                                        <p className="text-white/80 font-bold text-lg mb-2">CelDoctor App</p>
                                        <p className="text-white/40 text-sm">Captura de pantalla</p>
                                        <p className="text-white/30 text-xs mt-1">Placeholder</p>
                                    </div>
                                    <div className="absolute top-4 left-4 right-4 h-6 bg-white/5 rounded-full" />
                                    <div className="absolute bottom-6 left-6 right-6 space-y-2">
                                        <div className="h-10 bg-white/5 rounded-xl" />
                                        <div className="h-10 bg-white/5 rounded-xl" />
                                        <div className="h-10 bg-[#4C1D95]/30 rounded-xl" />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -inset-4 bg-[#4C1D95]/10 rounded-[2rem] blur-2xl -z-10" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
