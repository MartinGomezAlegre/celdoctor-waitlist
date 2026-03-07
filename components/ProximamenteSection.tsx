"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Smartphone, Bell, Zap, BarChart3 } from "lucide-react";

export default function ProximamenteSection() {
    const upcoming = [
        { icon: Smartphone, title: "App nativa iOS & Android", desc: "Experiencia nativa optimizada para cada plataforma." },
        { icon: Bell, title: "Recordatorios de medicación", desc: "Alertas inteligentes para que nunca te olvides de tu medicación." },
        { icon: Zap, title: "Triaje con IA", desc: "Evaluación inicial inteligente antes de la consulta." },
        { icon: BarChart3, title: "Seguimiento de signos vitales", desc: "Registrá presión, peso, glucemia y más desde la app." },
    ];

    return (
        <section className="py-16 bg-slate-50 border-y border-slate-100">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/10 text-[#4C1D95] text-xs font-bold uppercase tracking-wider mb-4">
                        <Sparkles size={12} />
                        Próximamente
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Funciones en desarrollo</h2>
                    <p className="text-slate-500">Estamos trabajando en estas funcionalidades para lanzarlas pronto.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {upcoming.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-4 p-6 rounded-2xl border border-dashed border-[#4C1D95]/15 bg-white hover:border-[#4C1D95]/30 hover:shadow-md transition-all"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#4C1D95]/5 text-[#4C1D95] flex items-center justify-center shrink-0">
                                    <Icon size={22} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                                    <p className="text-sm text-slate-500">{item.desc}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
