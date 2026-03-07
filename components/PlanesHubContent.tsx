"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Smartphone, Sparkles, ArrowRight, Mail,
    CheckCircle2, XCircle, ThumbsUp, ThumbsDown,
    ShieldCheck, Clock, FileText, Stethoscope,
    Video, Pill, HeartPulse, BadgeDollarSign,
    ChevronDown, HelpCircle,
} from "lucide-react";

/* ══════════════════════════════════════════
   MOCK DATA
   ══════════════════════════════════════════ */

const planBasic = {
    name: "Basic",
    price: "$4.500",
    period: "/mes",
    desc: "Cobertura esencial para empezar.",
    features: [
        { text: "Consultas médicas (hasta 4/mes)", included: true },
        { text: "Guardia de urgencias", included: true },
        { text: "Recetas digitales", included: true },
        { text: "Historial clínico básico", included: true },
        { text: "Atención 24hs prioritaria", included: false },
        { text: "Historial ilimitado", included: false },
        { text: "Descuentos exclusivos en farmacias", included: false },
        { text: "Account Manager dedicado", included: false },
    ],
};

const planPremium = {
    name: "Premium",
    price: "$12.500",
    period: "/mes",
    badge: "Más elegido",
    desc: "La experiencia completa de CelDoctor.",
    features: [
        { text: "Consultas médicas ilimitadas", included: true },
        { text: "Guardia de urgencias 24/7", included: true },
        { text: "Recetas digitales al instante", included: true },
        { text: "Historial clínico ilimitado", included: true },
        { text: "Atención 24hs prioritaria", included: true },
        { text: "Descuentos exclusivos en farmacias", included: true },
        { text: "Videollamada HD cifrada", included: true },
        { text: "Soporte prioritario", included: true },
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
    { q: "¿Puedo cambiar de plan en cualquier momento?", a: "Sí. Podés hacer upgrade o downgrade en cualquier momento sin penalidades ni períodos de carencia." },
    { q: "¿Hay período de prueba?", a: "Estamos preparando ofertas especiales de lanzamiento para los primeros usuarios de la lista de espera." },
    { q: "¿CelDoctor reemplaza a mi obra social?", a: "No. CelDoctor es un servicio complementario a tu cobertura de salud existente." },
    { q: "¿Los médicos están certificados?", a: "Todos los profesionales están matriculados y pasan por un proceso de selección riguroso." },
    { q: "¿Funciona en todo el país?", a: "Sí. CelDoctor funciona en toda Argentina, Uruguay y Paraguay con conexión a internet." },
];

const ahorroData = [
    { concepto: "Consulta clínica", tradicional: "$15.000 – $25.000", celDoctor: "Incluida en tu plan" },
    { concepto: "Consulta de urgencia", tradicional: "$20.000 – $40.000", celDoctor: "Incluida en tu plan" },
    { concepto: "Receta digital", tradicional: "+ costo de consulta", celDoctor: "Incluida" },
    { concepto: "Traslado al consultorio", tradicional: "$2.000 – $5.000", celDoctor: "$0 (desde tu casa)" },
];

/* ══════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════ */

export default function PlanesHubContent() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        setSubscribed(true);
    };

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
                                <Sparkles size={12} /> Planes y Cobertura
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                                Tu salud digital<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] to-white">al mejor precio</span>
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

                        {/* Right — Lifestyle Image Placeholder */}
                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                            <div className="relative">
                                <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-3 shadow-2xl shadow-black/20 backdrop-blur-sm">
                                    <div className="bg-[#0f0525] rounded-2xl aspect-[4/3] flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#4C1D95]/15 to-transparent" />
                                        {/* Lifestyle placeholder */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0525] via-transparent to-transparent z-10" />
                                        <div className="relative z-20 text-center p-8">
                                            <div className="w-20 h-20 mx-auto bg-white/10 border border-white/15 rounded-3xl flex items-center justify-center mb-4">
                                                <Smartphone size={36} className="text-white/60" />
                                            </div>
                                            <p className="text-white/70 font-bold text-lg mb-1">Lifestyle App Image</p>
                                            <p className="text-white/40 text-sm">Placeholder</p>
                                        </div>
                                        {/* Decorative blobs */}
                                        <div className="absolute top-8 right-8 w-24 h-24 rounded-full bg-[#7C3AED]/15 blur-xl" />
                                        <div className="absolute bottom-12 left-8 w-32 h-20 rounded-2xl bg-[#4C1D95]/10 blur-lg" />
                                    </div>
                                </div>
                                <div className="absolute -inset-4 bg-[#4C1D95]/10 rounded-[2rem] blur-2xl -z-10" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          2) SECCIÓN DE PLANES — BASIC / PREMIUM
          ═══════════════════════════════════════════ */}
            <section id="planes" className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/10 text-[#4C1D95] text-[11px] font-bold uppercase tracking-wider mb-4">
                            <Sparkles size={12} /> Planes Personales
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">Elegí tu plan ideal</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">Dos opciones pensadas para vos. Sin copagos, sin letra chica.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                        {/* Basic */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="rounded-3xl p-8 lg:p-10 border border-slate-200 bg-white hover:border-[#4C1D95]/20 hover:shadow-xl transition-all"
                        >
                            <h3 className="text-2xl font-bold text-slate-900 mb-1">{planBasic.name}</h3>
                            <p className="text-sm text-slate-500 mb-5">{planBasic.desc}</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-[#4C1D95]">{planBasic.price}</span>
                                <span className="text-sm text-slate-400 ml-1">{planBasic.period}</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {planBasic.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-2.5 text-sm">
                                        {f.included
                                            ? <CheckCircle2 size={16} className="text-[#4C1D95] shrink-0" />
                                            : <XCircle size={16} className="text-slate-300 shrink-0" />
                                        }
                                        <span className={f.included ? "text-slate-700" : "text-slate-300"}>{f.text}</span>
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="/#waitlist"
                                className="block w-full py-3.5 text-center rounded-xl border border-[#4C1D95]/20 text-[#4C1D95] font-bold text-sm hover:bg-[#4C1D95] hover:text-white hover:shadow-lg hover:shadow-[#4C1D95]/20 transition-all"
                            >
                                Elegir Basic
                            </a>
                        </motion.div>

                        {/* Premium */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="rounded-3xl p-8 lg:p-10 bg-gradient-to-b from-[#4C1D95] to-[#2E1065] border-2 border-[#6D28D9] shadow-2xl shadow-[#4C1D95]/30 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 bg-white text-[#4C1D95] text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
                                {planPremium.badge}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">{planPremium.name}</h3>
                            <p className="text-sm text-white/60 mb-5">{planPremium.desc}</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">{planPremium.price}</span>
                                <span className="text-sm text-white/50 ml-1">{planPremium.period}</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {planPremium.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-2.5 text-sm text-white">
                                        <CheckCircle2 size={16} className="text-white shrink-0" />
                                        <span>{f.text}</span>
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="/#waitlist"
                                className="block w-full py-3.5 text-center rounded-xl bg-white text-[#2E1065] font-bold text-sm hover:bg-slate-100 transition-all shadow-lg"
                            >
                                Elegir Premium
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          3) PROS vs CONTRAS
          ═══════════════════════════════════════════ */}
            <section className="py-20 bg-slate-50 border-y border-slate-100">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">¿Por qué CelDoctor?</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">Comparamos nuestra atención digital con el modelo de salud tradicional.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Pros */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="rounded-3xl p-8 lg:p-10 bg-white border border-slate-100 shadow-sm"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                    <ThumbsUp size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">CelDoctor</h3>
                                    <p className="text-xs text-emerald-500 font-bold uppercase tracking-wider">Atención digital</p>
                                </div>
                            </div>
                            <ul className="space-y-3.5">
                                {prosContras.pros.map((pro, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                        <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                        <span className="font-medium">{pro}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Contras */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="rounded-3xl p-8 lg:p-10 bg-white border border-slate-100 shadow-sm"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                                    <ThumbsDown size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Modelo Tradicional</h3>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Consulta presencial</p>
                                </div>
                            </div>
                            <ul className="space-y-3.5">
                                {prosContras.contras.map((contra, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                                        <XCircle size={16} className="text-slate-300 mt-0.5 shrink-0" />
                                        <span className="font-medium">{contra}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          4) FAQ + COMPARATIVA DE AHORRO
          ═══════════════════════════════════════════ */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* A) FAQ */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/10 text-[#4C1D95] text-[11px] font-bold uppercase tracking-wider mb-4">
                                <HelpCircle size={12} /> FAQ
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Preguntas Frecuentes</h2>
                            <div className="space-y-3">
                                {faqItems.map((item, i) => (
                                    <div key={i} className="rounded-2xl border border-slate-100 overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/50 transition-colors"
                                            aria-expanded={openFaq === i}
                                        >
                                            <span className="text-sm font-bold text-slate-900 pr-4">{item.q}</span>
                                            <ChevronDown size={16} className={`text-slate-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                                        </button>
                                        <AnimatePresence>
                                            {openFaq === i && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <p className="px-5 pb-5 text-sm text-slate-500 leading-relaxed">{item.a}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* B) Comparativa de ahorro */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/10 text-[#4C1D95] text-[11px] font-bold uppercase tracking-wider mb-4">
                                <BadgeDollarSign size={12} /> Ahorro real
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Compará y ahorrá</h2>

                            <div className="rounded-3xl border border-slate-100 overflow-hidden bg-white shadow-sm">
                                {/* Header */}
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

                            {/* Savings highlight */}
                            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-[#4C1D95]/5 to-[#7C3AED]/5 border border-[#4C1D95]/10">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-[#4C1D95] text-white flex items-center justify-center shadow-lg shadow-[#4C1D95]/30">
                                        <BadgeDollarSign size={28} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-[#4C1D95]">Hasta 70% de ahorro</p>
                                        <p className="text-sm text-slate-500">vs. consultas médicas tradicionales</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          5) LISTA DE ESPERA — CTA FINAL
          ═══════════════════════════════════════════ */}
            <section className="py-20 bg-gradient-to-br from-[#4C1D95] via-[#3b1675] to-[#2E1065] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7C3AED]/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#4C1D95]/20 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                            Asegurá tu lugar en el lanzamiento para Argentina, Uruguay y Paraguay
                        </h2>
                        <p className="text-lg text-white/70 mb-8">
                            Sé de los primeros en acceder a CelDoctor cuando lancemos.
                        </p>

                        {subscribed ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-3 px-8 py-5 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-sm"
                            >
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                                    <ShieldCheck size={20} className="text-emerald-400" />
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-bold">¡Inscripción recibida!</p>
                                    <p className="text-white/60 text-sm">Te avisaremos cuando lancemos.</p>
                                </div>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                                <div className="flex-1 relative">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Tu email"
                                        className="w-full pl-11 pr-4 py-4 bg-white/10 border border-white/15 rounded-2xl text-white placeholder:text-white/40 text-base focus:outline-none focus:ring-2 focus:ring-[#a78bfa]/40 focus:border-white/30 backdrop-blur-sm transition-all"
                                        aria-label="Email"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-8 py-4 bg-white text-[#2E1065] rounded-2xl font-bold text-base hover:bg-slate-100 transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 shrink-0"
                                >
                                    Quiero registrarme
                                    <ArrowRight size={16} />
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </section>
        </>
    );
}
