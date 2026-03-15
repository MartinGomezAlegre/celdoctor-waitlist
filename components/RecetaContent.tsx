"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, FileText, Shield, Smartphone, QrCode, RefreshCw, ShieldCheck, User, Stethoscope, Pill, Calendar } from "lucide-react";

export default function RecetaContent() {
    return (
        <>
            {/* ─── HERO 2 COLUMNAS ─── */}
            <section className="py-20 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left — Text */}
                        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/10 text-[#4C1D95] text-[11px] font-bold uppercase tracking-wider mb-5">
                                <FileText size={12} /> Recetas 100% digitales
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4">
                                Tu receta médica,<br />donde estés
                            </h2>
                            <p className="text-lg text-slate-500 leading-relaxed mb-6">
                                Obtené recetas válidas en toda Argentina en minutos. Sin papel, sin traslados.
                            </p>
                            <ul className="space-y-3 mb-8">
                                {[
                                    "Válidas en todas las farmacias del país",
                                    "Disponibles al instante después de la consulta",
                                    "Guardadas en tu historia clínica",
                                    "Podés compartirlas desde el celular",
                                ].map((b, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                        <CheckCircle2 size={18} className="text-[#4C1D95] shrink-0" />
                                        {b}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/registro"
                                className="inline-flex items-center px-8 py-4 bg-[#4C1D95] text-white rounded-xl font-bold hover:bg-[#3b1675] transition-all shadow-lg shadow-[#4C1D95]/20 hover:-translate-y-0.5"
                            >
                                Solicitar consulta
                            </Link>
                        </motion.div>

                        {/* Right — Receta Card Visual */}
                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <div className="max-w-sm mx-auto">
                                <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/60 p-7 relative">
                                    {/* Valid badge */}
                                    <div className="absolute top-5 right-5">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            Válida
                                        </span>
                                    </div>
                                    {/* Logo */}
                                    <div className="mb-6">
                                        <span className="font-bold text-lg text-slate-900 tracking-tight">CELDOCTOR</span>
                                        <p className="text-xs text-slate-400">Receta médica digital</p>
                                    </div>
                                    {/* Fields */}
                                    <div className="space-y-4">
                                        {[
                                            { icon: User, label: "Paciente", value: "Juan García" },
                                            { icon: Stethoscope, label: "Médico", value: "Dra. María López — MN 12345" },
                                            { icon: Pill, label: "Medicamento", value: "Ibuprofeno 400mg" },
                                            { icon: ShieldCheck, label: "Dosis", value: "1 comprimido cada 8 horas" },
                                            { icon: Calendar, label: "Fecha", value: "14 de marzo de 2026" },
                                        ].map(({ icon: Icon, label, value }, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-[#4C1D95]/5 flex items-center justify-center shrink-0 mt-0.5">
                                                    <Icon size={14} className="text-[#4C1D95]" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                                                    <p className="text-sm font-semibold text-slate-800">{value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* QR placeholder */}
                                    <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                                        <div className="w-14 h-14 rounded-xl bg-slate-100 grid grid-cols-3 gap-0.5 p-1.5">
                                            {Array.from({ length: 9 }).map((_, i) => (
                                                <div key={i} className={`rounded-sm ${[0, 2, 4, 6, 8].includes(i) ? "bg-slate-700" : "bg-slate-200"}`} />
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-slate-400 text-right max-w-[120px]">Verificá esta receta en cualquier farmacia</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

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
