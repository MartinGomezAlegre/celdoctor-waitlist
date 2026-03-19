"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    User, CheckCircle2, XCircle, Crown,
    ArrowRight,
    ChevronDown, HelpCircle, BadgeDollarSign,
    ThumbsUp, ThumbsDown,
} from "lucide-react";

/* ══════════════════════════════════════════
   MOCK DATA
   ══════════════════════════════════════════ */

const planBasic = {
    name: "Basic",
    price: "$4.500",
    period: "/mes",
    desc: "Cobertura ágil para vos. Sin vueltas.",
    features: [
        "Consultas médicas (hasta 4/mes)",
        "Guardia de urgencias",
        "Recetas digitales",
        "Historia clínica en la App",
        "Sin copagos sorpresa",
    ],
};

const planPremium = {
    name: "Premium",
    price: "$8.900",
    period: "/mes",
    badge: "Más elegido",
    desc: "La experiencia personal completa.",
    features: [
        "Consultas médicas ilimitadas",
        "Guardia 24/7 sin espera",
        "Recetas digitales al instante",
        "Historial clínico ilimitado",
        "Atención 24hs prioritaria",
        "Videollamada HD cifrada",
        "Descuentos en farmacias",
        "Soporte prioritario",
    ],
};

const prosContras = {
    pros: [
        "Atención inmediata en < 5 minutos",
        "Sin traslados ni salas de espera",
        "Recetas digitales válidas en toda Argentina",
        "Historial médico siempre accesible",
        "Consultas desde cualquier dispositivo",
        "Precio fijo mensual sin copagos",
    ],
    contras: [
        "Turnos con demoras de horas o días",
        "Traslado obligatorio al consultorio",
        "Recetas en papel fáciles de perder",
        "Historial fragmentado entre médicos",
        "Limitado a ubicación geográfica",
        "Copagos y costos sorpresa",
    ],
};

const faqItems = [
    { q: "¿Puedo hacer upgrade a Premium en cualquier momento?", a: "Sí. Podés cambiar de Basic a Premium cuando quieras, sin penalidades ni períodos de carencia." },
    { q: "¿Y si después quiero pasar al Plan Familiar?", a: "También. Podés migrar al Plan Familiar manteniendo tu historial y beneficios." },
    { q: "¿CelDoctor reemplaza a mi obra social?", a: "No. Es un servicio complementario a tu cobertura de salud existente." },
    { q: "¿Los médicos están certificados?", a: "Todos los profesionales están matriculados y pasan por un proceso de selección riguroso." },
    { q: "¿Funciona en todo el país?", a: "Sí. CelDoctor funciona en Argentina, Uruguay y Paraguay con conexión a internet." },
];

const ahorroData = [
    { concepto: "Consulta clínica", tradicional: "$15.000 – $25.000", celDoctor: "Incluida" },
    { concepto: "Consulta de urgencia", tradicional: "$20.000 – $40.000", celDoctor: "Incluida" },
    { concepto: "Receta digital", tradicional: "+ costo consulta", celDoctor: "Incluida" },
    { concepto: "Traslado", tradicional: "$2.000 – $5.000", celDoctor: "$0" },
];

/* ══════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════ */

export default function PlanesPersonalesContent() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <>
            {/* ═══════════════════════════════════════════
          1) HERO — 2 COLUMNAS
          ═══════════════════════════════════════════ */}
            <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-[#1e0b4b]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[150px] pointer-events-none bg-[#4C1D95]/30" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left — Text */}
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-[#a78bfa] text-[11px] font-bold uppercase tracking-wider mb-6">
                                <User size={12} /> Planes Personales
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                                Tu salud, sin vueltas ni<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] to-white">complicaciones.</span>
                            </h1>

                            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
                                Elegí el plan personal que se adapta a vos. Consultas ilimitadas, guardia 24/7, recetas digitales. Sin letra chica, sin copagos.
                            </p>

                            <a
                                href="#planes"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#2E1065] rounded-2xl font-bold text-base hover:bg-slate-100 transition-all shadow-lg hover:-translate-y-1 active:scale-95"
                            >
                                <BadgeDollarSign size={20} />
                                Elegir plan
                            </a>
                        </motion.div>

                        {/* Right — Lifestyle Placeholder */}
                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                            <div className="relative">
                                <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-3 shadow-2xl shadow-black/20 backdrop-blur-sm">
                                    <div className="rounded-2xl aspect-[4/3] relative overflow-hidden">
                                        <Image
                                            src="/personalmodelo.png"
                                            alt="Persona usando CelDoctor"
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1e0b4b]/40 to-transparent" />
                                    </div>
                                </div>
                                <div className="absolute -inset-4 bg-[#4C1D95]/10 rounded-[2rem] blur-2xl -z-10" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          2) PLANES BASIC / PREMIUM (estilo Home)
          ═══════════════════════════════════════════ */}
            <section id="planes" className="py-24 bg-white border-t border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#4C1D95]/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Planes Personales</h2>
                        <p className="text-slate-500">Dos opciones pensadas para vos. Sin copagos, sin letra chica.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                        {/* ── Basic ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-[#4C1D95]/30 hover:shadow-xl hover:shadow-[#4C1D95]/5 transition-all flex flex-col group"
                        >
                            <div className="mb-6">
                                <div className="w-14 h-14 bg-[#4C1D95]/5 rounded-2xl flex items-center justify-center text-[#4C1D95] mb-4 group-hover:bg-[#4C1D95] group-hover:text-white transition-colors border border-[#4C1D95]/10">
                                    <User size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">{planBasic.name}</h3>
                                <p className="text-slate-500 text-sm mt-2">{planBasic.desc}</p>
                                <div className="mt-4">
                                    <span className="text-3xl font-bold text-[#4C1D95]">{planBasic.price}</span>
                                    <span className="text-slate-400 text-sm ml-1">{planBasic.period}</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8 flex-1">
                                <ul className="space-y-3">
                                    {planBasic.features.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                            <CheckCircle2 size={18} className="text-[#4C1D95] shrink-0 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <a href="/registro" className="w-full py-4 text-center border border-[#4C1D95]/20 text-[#4C1D95] rounded-xl font-bold hover:bg-[#4C1D95] hover:text-white hover:shadow-lg hover:shadow-[#4C1D95]/20 transition-all block">
                                Solicitar Alta
                            </a>
                        </motion.div>

                        {/* ── Premium (Destacado) ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="p-8 rounded-3xl bg-gradient-to-b from-[#4C1D95] to-[#2E1065] border border-[#6D28D9] shadow-2xl shadow-[#4C1D95]/40 hover:scale-[1.02] transition-all flex flex-col group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 bg-white text-[#4C1D95] text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
                                {planPremium.badge}
                            </div>
                            <div className="mb-6">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-4 transition-colors border border-white/20">
                                    <Crown size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-white">{planPremium.name}</h3>
                                <p className="text-white/80 text-sm mt-2">{planPremium.desc}</p>
                                <div className="mt-4">
                                    <span className="text-3xl font-bold text-white">{planPremium.price}</span>
                                    <span className="text-white/60 text-sm ml-1">{planPremium.period}</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8 flex-1">
                                <ul className="space-y-3">
                                    {planPremium.features.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-white">
                                            <CheckCircle2 size={18} className="text-white shrink-0 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <a href="/registro" className="w-full py-4 text-center bg-white text-[#2E1065] rounded-xl font-bold hover:bg-slate-100 transition-all shadow-lg block">
                                Elegir Premium
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          3) PROS vs CONTRAS
          ═══════════════════════════════════════════ */}
            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">¿Por qué CelDoctor?</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">Comparamos nuestra atención digital con el modelo de salud tradicional.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-3xl p-8 lg:p-10 bg-white border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center"><ThumbsUp size={24} /></div>
                                <div><h3 className="text-lg font-bold text-slate-900">CelDoctor</h3><p className="text-xs text-emerald-500 font-bold uppercase tracking-wider">Atención digital</p></div>
                            </div>
                            <ul className="space-y-3.5">
                                {prosContras.pros.map((pro, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700"><CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" /><span className="font-medium">{pro}</span></li>
                                ))}
                            </ul>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-3xl p-8 lg:p-10 bg-white border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center"><ThumbsDown size={24} /></div>
                                <div><h3 className="text-lg font-bold text-slate-900">Modelo Tradicional</h3><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Consulta presencial</p></div>
                            </div>
                            <ul className="space-y-3.5">
                                {prosContras.contras.map((contra, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-400"><XCircle size={16} className="text-slate-300 mt-0.5 shrink-0" /><span className="font-medium">{contra}</span></li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          4) FAQ + COMPARATIVA DE AHORRO
          ═══════════════════════════════════════════ */}
            <section className="py-20 bg-slate-50 border-y border-slate-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* FAQ */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/10 text-[#4C1D95] text-[11px] font-bold uppercase tracking-wider mb-4"><HelpCircle size={12} /> FAQ</div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Preguntas Frecuentes</h2>
                            <div className="space-y-3">
                                {faqItems.map((item, i) => (
                                    <div key={i} className="rounded-2xl border border-slate-100 overflow-hidden bg-white">
                                        <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/50 transition-colors" aria-expanded={openFaq === i}>
                                            <span className="text-sm font-bold text-slate-900 pr-4">{item.q}</span>
                                            <ChevronDown size={16} className={`text-slate-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                                        </button>
                                        <AnimatePresence>
                                            {openFaq === i && (
                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                                    <p className="px-5 pb-5 text-sm text-slate-500 leading-relaxed">{item.a}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Ahorro */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/10 text-[#4C1D95] text-[11px] font-bold uppercase tracking-wider mb-4"><BadgeDollarSign size={12} /> Ahorro real</div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Compará y ahorrá</h2>
                            <div className="rounded-3xl border border-slate-100 overflow-hidden bg-white shadow-sm">
                                <div className="grid grid-cols-3 bg-slate-50 p-4 border-b border-slate-100">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Concepto</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Tradicional</span>
                                    <span className="text-xs font-bold text-[#4C1D95] uppercase tracking-wider text-center">CelDoctor</span>
                                </div>
                                {ahorroData.map((row, i) => (
                                    <div key={i} className={`grid grid-cols-3 p-4 items-center ${i < ahorroData.length - 1 ? "border-b border-slate-50" : ""} hover:bg-slate-50/50 transition-colors`}>
                                        <span className="text-sm text-slate-700 font-medium">{row.concepto}</span>
                                        <span className="text-sm text-slate-400 text-center line-through decoration-slate-300">{row.tradicional}</span>
                                        <span className="text-sm text-[#4C1D95] font-bold text-center">{row.celDoctor}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-[#4C1D95]/5 to-[#7C3AED]/5 border border-[#4C1D95]/10">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-[#4C1D95] text-white flex items-center justify-center shadow-lg shadow-[#4C1D95]/30"><BadgeDollarSign size={28} /></div>
                                    <div><p className="text-2xl font-bold text-[#4C1D95]">Hasta 70% de ahorro</p><p className="text-sm text-slate-500">vs. consultas médicas tradicionales</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          5) CTA FINAL
          ═══════════════════════════════════════════ */}
            <section className="py-20 bg-gradient-to-br from-[#4C1D95] via-[#3b1675] to-[#2E1065] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7C3AED]/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">Tu salud, sin complicaciones</h2>
                        <p className="text-lg text-white/70 mb-8">Creá tu cuenta y empezá hoy mismo con atención médica digital.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/registro"
                                className="px-8 py-4 bg-white text-[#2E1065] rounded-2xl font-bold text-base hover:bg-slate-100 transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                            >
                                Crear cuenta gratis
                                <ArrowRight size={16} />
                            </Link>
                            <Link
                                href="/login"
                                className="px-8 py-4 rounded-2xl font-bold text-base border border-white/20 text-white hover:bg-white/10 transition-all"
                            >
                                Iniciar sesión
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
