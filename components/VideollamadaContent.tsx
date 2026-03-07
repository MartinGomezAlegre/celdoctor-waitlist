"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Video, Smartphone, LogIn, ShieldCheck, Wifi,
    Clock, FileText, MapPinOff, Sparkles,
    ChevronLeft, ChevronRight, ArrowRight, Mail,
} from "lucide-react";

/* ══════════════════════════════════════════
   MOCK DATA
   ══════════════════════════════════════════ */

const steps = [
    { num: "01", icon: LogIn, title: "Ingreso", desc: "Abrí la app, elegí la especialidad y solicitá atención." },
    { num: "02", icon: ShieldCheck, title: "Validación", desc: "Validamos tu identidad y plan en segundos." },
    { num: "03", icon: Wifi, title: "Conexión", desc: "Te conectamos con un médico por videollamada HD." },
];

const carouselSlides = [
    { label: "Llamada activa con médico" },
    { label: "Historial post-consulta" },
    { label: "Receta digital generada" },
    { label: "Seguimiento médico" },
    { label: "Evaluación del servicio" },
];

/* ══════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════ */

export default function VideollamadaContent() {
    const [slideIndex, setSlideIndex] = useState(0);
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const prevSlide = () => setSlideIndex((i) => (i - 1 + carouselSlides.length) % carouselSlides.length);
    const nextSlide = () => setSlideIndex((i) => (i + 1) % carouselSlides.length);

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
                                <Sparkles size={12} /> Videollamada Médica
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                                Médico Online<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] to-white">en Minutos</span>
                            </h1>

                            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
                                Consultá con un profesional médico certificado por videollamada HD, desde cualquier lugar y en cualquier momento. Sin esperas, sin traslados.
                            </p>

                            <a
                                href="/#waitlist"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#2E1065] rounded-2xl font-bold text-base hover:bg-slate-100 transition-all shadow-lg hover:-translate-y-1 active:scale-95"
                            >
                                <Video size={20} />
                                Iniciar consulta
                            </a>
                        </motion.div>

                        {/* Right — App Interface Placeholder */}
                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                            <div className="relative">
                                <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-3 shadow-2xl shadow-black/20 backdrop-blur-sm">
                                    <div className="bg-[#0f0525] rounded-2xl aspect-[9/16] max-h-[520px] flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-b from-[#4C1D95]/20 to-transparent" />
                                        {/* Mock call interface */}
                                        <div className="absolute top-4 left-4 right-4 h-6 bg-white/5 rounded-full" />
                                        <div className="absolute top-14 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-white/5 border-2 border-white/10" />
                                        <div className="relative z-10 text-center mt-16">
                                            <div className="w-16 h-16 mx-auto bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-4">
                                                <Video size={32} className="text-emerald-400" />
                                            </div>
                                            <p className="text-white/80 font-bold text-lg mb-1">CelDoctor App</p>
                                            <p className="text-white/40 text-sm">App Interface Placeholder</p>
                                        </div>
                                        {/* Bottom call controls */}
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

            {/* ═══════════════════════════════════════════
          2) CÓMO FUNCIONA — TÍTULO + 3 PASOS
          ═══════════════════════════════════════════ */}
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

            {/* ═══════════════════════════════════════════
          3) SECCIÓN DE ACCIÓN — APP + BENEFICIOS
          ═══════════════════════════════════════════ */}
            <section className="py-20 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left — Videocall Interface Placeholder */}
                        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <div className="max-w-xs mx-auto lg:mx-0">
                                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-3">
                                    <div className="bg-slate-50 rounded-2xl aspect-[9/16] flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-b from-[#4C1D95]/5 to-transparent" />
                                        {/* Mock video UI */}
                                        <div className="absolute top-4 left-4 right-4 h-5 bg-[#4C1D95]/5 rounded-full" />
                                        <div className="absolute top-14 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/10" />
                                        <div className="text-center p-8 relative z-10 mt-12">
                                            <div className="w-16 h-16 mx-auto bg-[#4C1D95]/10 rounded-2xl flex items-center justify-center mb-3">
                                                <Video size={28} className="text-[#4C1D95]" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-600">Videocall Interface</p>
                                            <p className="text-xs text-slate-400 mt-1">Placeholder</p>
                                        </div>
                                        {/* Mock controls */}
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
                                {[
                                    { icon: Clock, title: "Atención 24hs", desc: "Disponible las 24 horas, los 365 días del año. Incluido feriados y madrugadas." },
                                    { icon: FileText, title: "Recetas digitales post-llamada", desc: "Al finalizar, recibís receta digital válida en cualquier farmacia adherida." },
                                    { icon: MapPinOff, title: "Sin traslados", desc: "Consultá desde tu casa, oficina o donde estés. Sin ir a un consultorio." },
                                    { icon: ShieldCheck, title: "Videollamada cifrada", desc: "Comunicación segura con cifrado de extremo a extremo. Tu privacidad ante todo." },
                                ].map((b, i) => {
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

            {/* ═══════════════════════════════════════════
          4) GALERÍA / CARRUSEL DE FUNCIONALIDADES
          ═══════════════════════════════════════════ */}
            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/10 text-[#4C1D95] text-[11px] font-bold uppercase tracking-wider mb-4">
                            <Smartphone size={12} /> Funcionalidades
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Mirá todo lo que podés hacer</h2>
                        <p className="text-slate-500">Explorá las funciones de videollamada de CelDoctor.</p>
                    </div>

                    {/* Carousel */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-3 relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={slideIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="bg-slate-50 rounded-2xl aspect-[16/8] flex items-center justify-center relative overflow-hidden"
                            >
                                {/* Subtle wireframe */}
                                <div className="absolute inset-4 flex flex-col gap-3 opacity-15">
                                    <div className="flex gap-3">
                                        <div className="w-28 h-7 bg-[#4C1D95]/10 rounded-lg" />
                                        <div className="flex-1" />
                                        <div className="w-20 h-7 bg-[#4C1D95]/10 rounded-lg" />
                                    </div>
                                    <div className="flex gap-3 flex-1">
                                        <div className="w-24 space-y-2">
                                            <div className="h-5 bg-[#4C1D95]/8 rounded" />
                                            <div className="h-5 bg-[#4C1D95]/15 rounded" />
                                            <div className="h-5 bg-[#4C1D95]/8 rounded" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex gap-2">
                                                <div className="flex-1 h-20 bg-[#4C1D95]/5 rounded-xl" />
                                                <div className="flex-1 h-20 bg-[#4C1D95]/5 rounded-xl" />
                                            </div>
                                            <div className="h-16 bg-[#4C1D95]/5 rounded-xl" />
                                        </div>
                                    </div>
                                </div>
                                <div className="relative z-10 text-center">
                                    <div className="w-14 h-14 mx-auto bg-[#4C1D95]/10 rounded-2xl flex items-center justify-center mb-3">
                                        <Smartphone size={28} className="text-[#4C1D95]/30" />
                                    </div>
                                    <p className="text-sm text-slate-400 font-bold">{carouselSlides[slideIndex].label}</p>
                                    <p className="text-xs text-slate-300 mt-1">Feature Screenshot {slideIndex + 1}</p>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Arrows */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-lg text-slate-500 flex items-center justify-center hover:text-[#4C1D95] hover:border-[#4C1D95]/30 transition-all z-20"
                            aria-label="Anterior"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-lg text-slate-500 flex items-center justify-center hover:text-[#4C1D95] hover:border-[#4C1D95]/30 transition-all z-20"
                            aria-label="Siguiente"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    {/* Dots */}
                    <div className="flex gap-2 justify-center mt-5">
                        {carouselSlides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setSlideIndex(i)}
                                className={`h-2.5 rounded-full transition-all ${i === slideIndex ? "w-8 bg-[#4C1D95]" : "w-2.5 bg-slate-200 hover:bg-slate-300"}`}
                                aria-label={`Slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          5) LISTA DE ESPERA — CTA FINAL
          ═══════════════════════════════════════════ */}
            <section className="py-20 bg-gradient-to-br from-[#4C1D95] via-[#3b1675] to-[#2E1065] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7C3AED]/20 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                            Sumate a la lista de espera
                        </h2>
                        <p className="text-lg text-white/70 mb-8">
                            Sé de los primeros en usar la videollamada médica de CelDoctor.
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
                                    Quiero unirme
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
