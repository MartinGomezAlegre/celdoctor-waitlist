"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Video } from "lucide-react";

export default function VideollamadaHero() {
    return (
        <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-[#1e0b4b]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[150px] pointer-events-none bg-[#4C1D95]/30" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left — Text */}
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-[#a78bfa] text-[11px] font-bold uppercase tracking-wider mb-6">
                            <Sparkles size={12} /> Videollamada Médica
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                            Médico Online<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] to-white">en Minutos</span>
                        </h1>

                        <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
                            Consultá con un profesional médico certificado por videollamada HD, desde cualquier lugar y en cualquier momento. Sin esperas, sin traslados.
                        </p>

                        <Link
                            href="/#waitlist"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#2E1065] rounded-2xl font-bold text-base hover:bg-slate-100 transition-all shadow-lg hover:-translate-y-1 active:scale-95"
                        >
                            <Video size={20} />
                            Iniciar consulta
                        </Link>
                    </motion.div>

                    {/* Right — App Interface Placeholder */}
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-3 shadow-2xl shadow-black/20 backdrop-blur-sm">
                                <div className="bg-[#0f0525] rounded-2xl aspect-[9/16] max-h-[520px] flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#4C1D95]/20 to-transparent" />
                                    <div className="absolute top-4 left-4 right-4 h-6 bg-white/5 rounded-full" />
                                    <div className="absolute top-14 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-white/5 border-2 border-white/10" />
                                    <div className="relative z-10 text-center mt-16">
                                        <div className="w-16 h-16 mx-auto bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-4">
                                            <Video size={32} className="text-emerald-400" />
                                        </div>
                                        <p className="text-white/80 font-bold text-lg mb-1">CelDoctor App</p>
                                        <p className="text-white/40 text-sm">App Interface Placeholder</p>
                                    </div>
                                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10" />
                                        <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/30" />
                                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10" />
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
