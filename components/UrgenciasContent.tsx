"use client";

import Link from "next/link";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
    Phone, Headphones, Stethoscope,
    Clock, Shield, MapPin, Star, ChevronLeft, ChevronRight,
    Sparkles, Video, Zap, HeartPulse,
} from "lucide-react";

/* ══════════════════════════════════════════
   MOCK DATA
   ══════════════════════════════════════════ */

const steps = [
    { num: "01", icon: Phone, title: "Solicitar ayuda", desc: "Abrí la app CelDoctor y tocá el botón de urgencias." },
    { num: "02", icon: Headphones, title: "Contacto inmediato", desc: "Un médico se conecta en menos de 5 minutos." },
    { num: "03", icon: Stethoscope, title: "Atención médica", desc: "Recibís diagnóstico, recetas y orientación." },
];

const testimonios = [
    { nombre: "María G.", comentario: "Me atendieron a las 3am cuando mi hijo tenía fiebre alta. En 4 minutos ya estaba hablando con un pediatra. Increíble.", rating: 5 },
    { nombre: "Carlos R.", comentario: "Tuve una reacción alérgica y no sabía qué hacer. El médico me guió paso a paso y me tranquilizó al instante.", rating: 5 },
    { nombre: "Lucía M.", comentario: "Viajando en el interior del país, mi mamá se sintió mal. CelDoctor fue nuestra salvación. Atención rápida y profesional.", rating: 5 },
    { nombre: "Martín D.", comentario: "Como empresa, saber que nuestros empleados tienen guardia 24/7 nos da mucha tranquilidad. Un servicio excepcional.", rating: 4 },
    { nombre: "Ana P.", comentario: "Me encanta que puedo consultar por mis hijos a cualquier hora. Los pediatras son muy amables y pacientes.", rating: 5 },
];

/* ══════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════ */

export default function UrgenciasContent() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollTestimonios = (dir: "left" | "right") => {
        if (!scrollRef.current) return;
        const amount = 340;
        scrollRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
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
                                <Sparkles size={12} /> Urgencias 24/7
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                                Llamadas de urgencia<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] to-white">médicas</span>
                            </h1>

                            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
                                Atención médica inmediata las 24 horas, los 365 días del año. Un profesional te atiende en menos de 5 minutos, sin salir de tu casa.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/#waitlist"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#2E1065] rounded-2xl font-bold text-base hover:bg-slate-100 transition-all shadow-lg hover:-translate-y-1 active:scale-95"
                                >
                                    <Phone size={20} />
                                    Contactar urgencias
                                </Link>
                            </div>
                        </motion.div>

                        {/* Right — App Screenshot Container */}
                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                            <div className="relative">
                                <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-3 shadow-2xl shadow-black/20 backdrop-blur-sm">
                                    <div className="bg-[#0f0525] rounded-2xl aspect-[9/16] max-h-[520px] flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-b from-[#4C1D95]/20 to-transparent" />
                                        <div className="relative z-10 text-center p-8">
                                            <div className="w-16 h-16 mx-auto bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center mb-4">
                                                <Phone size={32} className="text-red-400" />
                                            </div>
                                            <p className="text-white/80 font-bold text-lg mb-2">CelDoctor App</p>
                                            <p className="text-white/40 text-sm">Pantalla de Urgencias</p>
                                            <p className="text-white/30 text-xs mt-1">Captura de pantalla</p>
                                        </div>
                                        {/* Decorative UI elements */}
                                        <div className="absolute top-4 left-4 right-4 h-6 bg-white/5 rounded-full" />
                                        <div className="absolute bottom-6 left-6 right-6 space-y-2">
                                            <div className="h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                                                <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30" />
                                            </div>
                                            <div className="h-10 bg-white/5 rounded-xl" />
                                            <div className="h-10 bg-white/5 rounded-xl" />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -inset-4 bg-[#4C1D95]/10 rounded-[2rem] blur-2xl -z-10" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          2) CÓMO FUNCIONA — TÍTULO + 3 CARDS
          ═══════════════════════════════════════════ */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
                        {/* Left — Title */}
                        <div className="lg:col-span-2">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/10 text-[#4C1D95] text-[11px] font-bold uppercase tracking-wider mb-4">
                                    <Zap size={12} /> Proceso
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-4">
                                    Cómo funciona
                                </h2>
                                <p className="text-slate-500 leading-relaxed">
                                    En tres simples pasos tenés un médico atendiéndote. Sin esperas, sin burocracia, sin salir de tu casa.
                                </p>
                            </motion.div>
                        </div>

                        {/* Right — 3 Cards */}
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

            {/* ═══════════════════════════════════════════
          3) SECCIÓN DE ACCIÓN — APP + TEXTO
          ═══════════════════════════════════════════ */}
            <section className="py-20 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left — App Container */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="max-w-xs mx-auto lg:mx-0">
                                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-3">
                                    <div className="bg-slate-50 rounded-2xl aspect-[9/16] flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-b from-[#4C1D95]/5 to-transparent" />
                                        <div className="text-center p-8 relative z-10">
                                            <div className="w-16 h-16 mx-auto bg-[#4C1D95]/10 rounded-2xl flex items-center justify-center mb-4">
                                                <Video size={28} className="text-[#4C1D95]" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-600">Videollamada de urgencia</p>
                                            <p className="text-xs text-slate-400 mt-1">Captura de pantalla</p>
                                        </div>
                                        {/* Mock UI */}
                                        <div className="absolute top-4 left-4 right-4 h-5 bg-[#4C1D95]/5 rounded-full" />
                                        <div className="absolute bottom-6 left-6 right-6 space-y-2">
                                            <div className="h-12 bg-[#4C1D95]/5 rounded-xl" />
                                            <div className="flex gap-2">
                                                <div className="flex-1 h-10 bg-red-500/10 rounded-xl" />
                                                <div className="flex-1 h-10 bg-emerald-500/10 rounded-xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right — Text */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/10 text-[#4C1D95] text-[11px] font-bold uppercase tracking-wider mb-4">
                                <HeartPulse size={12} /> Urgencias
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-4">
                                Atención inmediata por videollamada
                            </h2>
                            <p className="text-slate-500 leading-relaxed mb-6">
                                Nuestro sistema de urgencias conecta directamente con médicos de guardia disponibles las 24 horas. La videollamada se inicia en menos de 5 minutos.
                            </p>

                            <div className="space-y-4 mb-8">
                                {[
                                    { icon: Clock, title: "Tiempo de respuesta < 5 min", desc: "Un médico se conecta rápidamente a tu llamada." },
                                    { icon: Shield, title: "Disponible 24/7 / 365 días", desc: "Incluido feriados, fines de semana y madrugadas." },
                                    { icon: MapPin, title: "Cobertura nacional al 100%", desc: "Funciona en cualquier punto del país con internet." },
                                    { icon: Stethoscope, title: "Médicos certificados", desc: "Todos los profesionales están matriculados y verificados." },
                                ].map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="w-10 h-10 rounded-xl bg-[#4C1D95]/5 text-[#4C1D95] flex items-center justify-center shrink-0">
                                                <Icon size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                                                <p className="text-xs text-slate-500">{item.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <Link
                                href="/#waitlist"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#4C1D95] text-white font-bold text-sm hover:bg-[#3b1675] transition-all shadow-lg shadow-[#4C1D95]/20 hover:-translate-y-0.5 active:scale-95"
                            >
                                <Video size={16} />
                                Iniciar llamada
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          4) BANNER DE TESTIMONIOS
          ═══════════════════════════════════════════ */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/10 text-[#4C1D95] text-[11px] font-bold uppercase tracking-wider mb-4">
                                <Star size={12} /> Testimonios
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900">Lo que dicen nuestros usuarios</h2>
                        </div>
                        <div className="hidden sm:flex gap-2">
                            <button
                                onClick={() => scrollTestimonios("left")}
                                className="w-10 h-10 rounded-full border border-slate-200 text-slate-500 flex items-center justify-center hover:border-[#4C1D95]/30 hover:text-[#4C1D95] transition-all"
                                aria-label="Anterior"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => scrollTestimonios("right")}
                                className="w-10 h-10 rounded-full border border-slate-200 text-slate-500 flex items-center justify-center hover:border-[#4C1D95]/30 hover:text-[#4C1D95] transition-all"
                                aria-label="Siguiente"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Horizontal scroll */}
                    <div
                        ref={scrollRef}
                        className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {testimonios.map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="min-w-[300px] max-w-[320px] p-7 rounded-3xl border border-slate-100 bg-white hover:border-[#4C1D95]/20 hover:shadow-xl hover:shadow-[#4C1D95]/5 transition-all snap-start shrink-0"
                            >
                                {/* Rating */}
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: 5 }).map((_, j) => (
                                        <Star
                                            key={j}
                                            size={14}
                                            className={j < t.rating ? "text-yellow-500 fill-yellow-500" : "text-slate-200"}
                                        />
                                    ))}
                                </div>

                                <p className="text-sm text-slate-600 leading-relaxed mb-5 italic">
                                    &ldquo;{t.comentario}&rdquo;
                                </p>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#4C1D95]/10 text-[#4C1D95] flex items-center justify-center font-bold text-sm">
                                        {t.nombre.charAt(0)}
                                    </div>
                                    <span className="text-sm font-bold text-slate-900">{t.nombre}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
