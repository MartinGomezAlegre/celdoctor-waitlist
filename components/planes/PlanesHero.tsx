"use client";

import { motion } from "framer-motion";
import { Sparkles, BadgeDollarSign, Smartphone } from "lucide-react";

export default function PlanesHero() {
    return (
        <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-[#1e0b4b]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[150px] pointer-events-none bg-[#4C1D95]/30" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-[#a78bfa] text-[11px] font-bold uppercase tracking-wider mb-6">
                            <Sparkles size={12} /> Planes y Cobertura
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                            Tu salud digital<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] to-white">
                                al mejor precio
                            </span>
                        </h1>
                        <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
                            Elegí el plan que se adapta a vos. Consultas ilimitadas, guardia 24/7, recetas digitales y más. Sin letra chica, sin copagos sorpresa.
                        </p>
                        <a
                            href="#planes"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#2E1065] rounded-2xl font-bold text-base hover:bg-slate-100 transition-all shadow-lg hover:-translate-y-1 active:scale-95"
                        >
                            <BadgeDollarSign size={20} />
                            Elegir plan
                        </a>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-3 shadow-2xl shadow-black/20 backdrop-blur-sm">
                                <div className="bg-[#0f0525] rounded-2xl aspect-[4/3] flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#4C1D95]/15 to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0525] via-transparent to-transparent z-10" />
                                    <div className="relative z-20 text-center p-8">
                                        <div className="w-20 h-20 mx-auto bg-white/10 border border-white/15 rounded-3xl flex items-center justify-center mb-4">
                                            <Smartphone size={36} className="text-white/60" />
                                        </div>
                                        <p className="text-white/70 font-bold text-lg mb-1">Lifestyle App Image</p>
                                        <p className="text-white/40 text-sm">Placeholder</p>
                                    </div>
                                    <div className="absolute top-8 right-8 w-24 h-24 rounded-full bg-[#7C3AED]/15 blur-xl" />
                                    <div className="absolute bottom-12 left-8 w-32 h-20 rounded-2xl bg-[#4C1D95]/10 blur-lg" />
                                </div>
                            </div>
                            <div className="absolute -inset-4 bg-[#4C1D95]/10 rounded-4xl blur-2xl -z-10" />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
