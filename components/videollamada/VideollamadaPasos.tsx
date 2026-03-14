"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { steps } from "./videollamada.data";

export default function VideollamadaPasos() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
                    {/* Left — Title */}
                    <div className="lg:col-span-2">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/10 text-[#4C1D95] text-[11px] font-bold uppercase tracking-wider mb-4">
                                <Sparkles size={12} /> Proceso
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-4">
                                Pasos para tu consulta
                            </h2>
                            <p className="text-slate-500 leading-relaxed">
                                El proceso es simple, seguro y toma menos de 5 minutos de principio a fin.
                            </p>
                        </motion.div>
                    </div>

                    {/* Right — 3 Step Cards */}
                    <div className="lg:col-span-3 grid sm:grid-cols-3 gap-5">
                        {steps.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.12 }}
                                    className="group p-7 rounded-3xl border border-slate-100 bg-white hover:border-[#4C1D95]/20 hover:shadow-2xl hover:shadow-[#4C1D95]/10 transition-all text-center relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#4C1D95] to-[#7C3AED] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500" />
                                    <div className="relative z-10">
                                        <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] mb-4">
                                            {step.num}
                                        </p>
                                        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#4C1D95]/5 text-[#4C1D95] flex items-center justify-center mb-4 group-hover:bg-[#4C1D95] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#4C1D95]/30 transition-all">
                                            <Icon size={26} strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
