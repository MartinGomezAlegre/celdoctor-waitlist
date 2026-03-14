"use client";

import { motion } from "framer-motion";
import { Video } from "lucide-react";
import { benefits } from "./videollamada.data";

export default function VideollamadaBeneficios() {
    return (
        <section className="py-20 bg-slate-50 border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left — Videocall Interface Placeholder */}
                    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <div className="max-w-xs mx-auto lg:mx-0">
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-3">
                                <div className="bg-slate-50 rounded-2xl aspect-[9/16] flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#4C1D95]/5 to-transparent" />
                                    <div className="absolute top-4 left-4 right-4 h-5 bg-[#4C1D95]/5 rounded-full" />
                                    <div className="absolute top-14 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/10" />
                                    <div className="text-center p-8 relative z-10 mt-12">
                                        <div className="w-16 h-16 mx-auto bg-[#4C1D95]/10 rounded-2xl flex items-center justify-center mb-3">
                                            <Video size={28} className="text-[#4C1D95]" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-600">Videocall Interface</p>
                                        <p className="text-xs text-slate-400 mt-1">Placeholder</p>
                                    </div>
                                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200" />
                                        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20" />
                                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right — Benefits */}
                    <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/10 text-[#4C1D95] text-[11px] font-bold uppercase tracking-wider mb-4">
                            <Video size={12} /> Ventajas
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-4">
                            Beneficios del Servicio
                        </h2>
                        <p className="text-slate-500 leading-relaxed mb-8">
                            Cada videollamada está diseñada para darte la mejor experiencia médica digital posible.
                        </p>

                        <div className="space-y-4">
                            {benefits.map((b, i) => {
                                const Icon = b.icon;
                                return (
                                    <div key={i} className="flex gap-4 p-5 rounded-2xl border border-slate-100 bg-white hover:border-[#4C1D95]/20 hover:shadow-md transition-all group">
                                        <div className="w-12 h-12 rounded-xl bg-[#4C1D95]/5 text-[#4C1D95] flex items-center justify-center shrink-0 group-hover:bg-[#4C1D95] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#4C1D95]/30 transition-all">
                                            <Icon size={22} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 mb-1">{b.title}</h4>
                                            <p className="text-xs text-slate-500 leading-relaxed">{b.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
