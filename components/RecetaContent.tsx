"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, FileText, Shield, Smartphone, QrCode, RefreshCw } from "lucide-react";

export default function RecetaContent() {
    return (
        <>
            {/* ─── QUÉ INCLUYE ─── */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">¿Qué incluye tu receta digital?</h2>
                        <p className="text-slate-500">Todo lo que necesitás, validado y al instante.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: FileText, title: "Prescripción completa", checks: ["Nombre genérico y comercial", "Dosis y posología", "Duración del tratamiento"] },
                            { icon: Shield, title: "Firma digital certificada", checks: ["Matrícula del profesional", "Firma electrónica válida", "Cumple Ley 27.553"] },
                            { icon: QrCode, title: "Código QR verificable", checks: ["Verificación en farmacia", "Anti-fraude integrado", "Validación de descuento"] },
                            { icon: Smartphone, title: "Acceso permanente", checks: ["Disponible en la app", "Envío por email", "Descarga en PDF"] },
                            { icon: RefreshCw, title: "Renovación simplificada", checks: ["Consulta express de renovación", "Sin burocracia", "En menos de 5 minutos"] },
                            { icon: CheckCircle2, title: "Válida en todo el país", checks: ["5.000+ farmacias adheridas", "Cadenas e independientes", "Descuentos automáticos"] },
                        ].map((card, i) => {
                            const Icon = card.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08 }}
                                    className="p-8 rounded-2xl border border-slate-100 bg-white hover:border-[#4C1D95]/20 hover:shadow-xl hover:shadow-[#4C1D95]/5 transition-all group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-[#4C1D95]/5 text-[#4C1D95] flex items-center justify-center mb-5 group-hover:bg-[#4C1D95] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#4C1D95]/30 transition-all">
                                        <Icon size={28} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">{card.title}</h3>
                                    <ul className="space-y-2.5">
                                        {card.checks.map((c, j) => (
                                            <li key={j} className="flex items-center gap-2.5 text-sm text-slate-600">
                                                <CheckCircle2 size={15} className="text-[#4C1D95] shrink-0" />
                                                {c}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ─── PROCESO DE VALIDACIÓN ─── */}
            <section className="py-16 bg-slate-50 border-y border-slate-100">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Proceso de validación</h2>
                        <p className="text-slate-500">Cada receta pasa por un proceso seguro y transparente.</p>
                    </div>

                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-10 top-0 bottom-0 w-px bg-[#4C1D95]/10" />

                        <div className="space-y-0">
                            {[
                                { step: "01", title: "Consulta médica", desc: "El profesional evalúa tu situación durante la videollamada HD." },
                                { step: "02", title: "Prescripción", desc: "El médico indica la medicación, dosis y duración del tratamiento." },
                                { step: "03", title: "Firma digital", desc: "La receta se firma electrónicamente con la matrícula del profesional." },
                                { step: "04", title: "Validación legal", desc: "El sistema verifica el cumplimiento de la normativa vigente (Ley 27.553)." },
                                { step: "05", title: "Entrega", desc: "Recibís la receta al instante en la app y por email. Lista para usar en farmacias." },
                            ].map((s, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.12, duration: 0.5 }}
                                    className={`flex gap-8 items-start py-8 relative ${i < 4 ? "border-b border-slate-100" : ""}`}
                                >
                                    <div className="shrink-0 relative z-10">
                                        <div className="w-20 h-20 bg-[#4C1D95] text-white rounded-3xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-[#4C1D95]/20">
                                            {s.step}
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">{s.title}</h3>
                                        <p className="text-slate-500 leading-relaxed">{s.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
