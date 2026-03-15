"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    Monitor, Smartphone, Lock, Shield, Eye,
    FileText, CalendarCheck, Pill, Activity,
    Sparkles, ChevronLeft, ChevronRight, ArrowRight,
} from "lucide-react";

/* ══════════════════════════════════════════
   MOCK DATA
   ══════════════════════════════════════════ */

const gallerySlides = [
    { label: "Historial de consultas" },
    { label: "Recetas digitales" },
    { label: "Turnos programados" },
    { label: "Estudios y resultados" },
    { label: "Perfil de salud" },
];

const tabKeys = ["Historia Clínica", "Turnos Programados", "Recetas Digitales"] as const;
type TabKey = (typeof tabKeys)[number];
const tabIcons: Record<TabKey, React.ElementType> = {
    "Historia Clínica": FileText,
    "Turnos Programados": CalendarCheck,
    "Recetas Digitales": Pill,
};
const tabLabels: Record<TabKey, string> = {
    "Historia Clínica": "Pantalla de Historia Clínica",
    "Turnos Programados": "Pantalla de Turnos Programados",
    "Recetas Digitales": "Pantalla de Recetas Digitales",
};

/* ══════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════ */

export default function HistorialContent() {
    const [activeTab, setActiveTab] = useState<TabKey>("Historia Clínica");
    const [galleryIndex, setGalleryIndex] = useState(0);

    const prevSlide = () => setGalleryIndex((i) => (i - 1 + gallerySlides.length) % gallerySlides.length);
    const nextSlide = () => setGalleryIndex((i) => (i + 1) % gallerySlides.length);

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
                                <Sparkles size={12} /> Historial Clínico
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                                Tu Historial Médico<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] to-white">Digital</span>
                            </h1>

                            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
                                Centralizá tus consultas, recetas y turnos en un solo lugar, con seguridad y acceso rápido desde cualquier dispositivo.
                            </p>

                            <Link
                                href="/registro"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#2E1065] rounded-2xl font-bold text-base hover:bg-slate-100 transition-all shadow-lg hover:-translate-y-1 active:scale-95"
                            >
                                <Monitor size={20} />
                                Empezar ahora
                            </Link>
                        </motion.div>

                        {/* Right — Panel Screenshot Container */}
                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                            <div className="relative">
                                <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-3 shadow-2xl shadow-black/20 backdrop-blur-sm">
                                    <div className="bg-[#0f0525] rounded-2xl aspect-[16/10] flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#4C1D95]/15 to-transparent" />
                                        {/* Mock dashboard UI */}
                                        <div className="absolute inset-4 flex flex-col gap-3 z-10">
                                            {/* Top bar */}
                                            <div className="flex gap-3">
                                                <div className="w-32 h-7 bg-white/5 rounded-lg" />
                                                <div className="flex-1" />
                                                <div className="w-20 h-7 bg-white/5 rounded-lg" />
                                            </div>
                                            {/* Sidebar + Content */}
                                            <div className="flex gap-3 flex-1">
                                                <div className="w-28 space-y-2">
                                                    <div className="h-6 bg-white/8 rounded-lg" />
                                                    <div className="h-6 bg-[#4C1D95]/30 rounded-lg" />
                                                    <div className="h-6 bg-white/5 rounded-lg" />
                                                    <div className="h-6 bg-white/5 rounded-lg" />
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex gap-3">
                                                        <div className="flex-1 h-20 bg-white/5 rounded-xl" />
                                                        <div className="flex-1 h-20 bg-white/5 rounded-xl" />
                                                        <div className="flex-1 h-20 bg-white/5 rounded-xl" />
                                                    </div>
                                                    <div className="h-28 bg-white/5 rounded-xl" />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Center label */}
                                        <div className="relative z-20 text-center">
                                            <div className="w-12 h-12 mx-auto bg-[#4C1D95]/20 border border-[#4C1D95]/30 rounded-xl flex items-center justify-center mb-2">
                                                <Monitor size={24} className="text-[#a78bfa]" />
                                            </div>
                                            <p className="text-white/50 text-xs font-medium">Panel Screenshot Placeholder</p>
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
          2) SECCIÓN DE DETALLE — GALLERY + TEXTO
          ═══════════════════════════════════════════ */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left — App Carousel */}
                        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-3 relative">
                                {/* Slide */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={galleryIndex}
                                        initial={{ opacity: 0, x: 40 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -40 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-slate-50 rounded-2xl aspect-[4/3] flex items-center justify-center relative overflow-hidden"
                                    >
                                        <div className="absolute inset-3 flex flex-col gap-2 opacity-20">
                                            <div className="h-6 w-24 bg-[#4C1D95]/10 rounded-lg" />
                                            <div className="flex gap-2 flex-1">
                                                <div className="flex-1 bg-[#4C1D95]/8 rounded-xl" />
                                                <div className="flex-1 bg-[#4C1D95]/8 rounded-xl" />
                                            </div>
                                            <div className="h-12 bg-[#4C1D95]/5 rounded-xl" />
                                        </div>
                                        <div className="relative z-10 text-center">
                                            <Smartphone size={28} className="mx-auto text-[#4C1D95]/25 mb-2" />
                                            <p className="text-sm text-slate-400 font-bold">{gallerySlides[galleryIndex].label}</p>
                                            <p className="text-xs text-slate-300 mt-0.5">Captura {galleryIndex + 1} de {gallerySlides.length}</p>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Arrows */}
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-lg text-slate-500 flex items-center justify-center hover:text-[#4C1D95] hover:border-[#4C1D95]/30 transition-all z-20"
                                    aria-label="Anterior"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-lg text-slate-500 flex items-center justify-center hover:text-[#4C1D95] hover:border-[#4C1D95]/30 transition-all z-20"
                                    aria-label="Siguiente"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>

                            {/* Dots */}
                            <div className="flex gap-2 justify-center mt-4">
                                {gallerySlides.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setGalleryIndex(i)}
                                        className={`h-2 rounded-full transition-all ${i === galleryIndex ? "w-7 bg-[#4C1D95]" : "w-2 bg-slate-200 hover:bg-slate-300"}`}
                                        aria-label={`Slide ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </motion.div>

                        {/* Right — Security Text */}
                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/10 text-[#4C1D95] text-[11px] font-bold uppercase tracking-wider mb-4">
                                <Lock size={12} /> Seguridad
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-4">
                                Seguridad y almacenamiento confiable
                            </h2>
                            <p className="text-slate-500 leading-relaxed mb-6">
                                Tu información médica está protegida con los más altos estándares de seguridad. Cifrado de extremo a extremo, acceso biométrico y cumplimiento total de la normativa argentina de datos de salud.
                            </p>
                            <ul className="space-y-3.5 mb-8">
                                {[
                                    { icon: Shield, text: "Acceso seguro con biometría y PIN" },
                                    { icon: FileText, text: "Historial centralizado en un solo lugar" },
                                    { icon: Activity, text: "Trazabilidad completa de cada consulta" },
                                    { icon: Eye, text: "Control total sobre quién ve tu información" },
                                    { icon: Lock, text: "Cifrado AES-256 + TLS 1.3" },
                                ].map((b, i) => {
                                    const Icon = b.icon;
                                    return (
                                        <li key={i} className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-[#4C1D95]/5 text-[#4C1D95] flex items-center justify-center shrink-0">
                                                <Icon size={16} />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-700">{b.text}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                            <a
                                href="#"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#4C1D95]/20 text-[#4C1D95] font-bold text-sm hover:bg-[#4C1D95] hover:text-white hover:shadow-lg hover:shadow-[#4C1D95]/20 transition-all"
                            >
                                Conocer más
                                <ArrowRight size={14} />
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          3) TABS + RESUMEN + PANEL
          ═══════════════════════════════════════════ */}
            <section className="py-20 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Tab Menu — centered cards */}
                    <div className="flex flex-col sm:flex-row justify-center gap-3 mb-10">
                        {tabKeys.map((tab) => {
                            const Icon = tabIcons[tab];
                            const isActive = activeTab === tab;
                            const descriptions: Record<typeof tabKeys[number], string> = {
                                "Historia Clínica": "Consultá tu historial médico completo",
                                "Turnos Programados": "Gestioná tus próximas consultas",
                                "Recetas Digitales": "Accedé a tus recetas digitales",
                            };
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all text-left sm:min-w-[220px] ${isActive
                                        ? "bg-white border-2 border-[#4C1D95] shadow-lg shadow-[#4C1D95]/10 text-[#4C1D95]"
                                        : "bg-white border-2 border-slate-100 hover:border-[#4C1D95]/30 text-slate-700 hover:text-[#4C1D95]"
                                        }`}
                                    aria-label={tab}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isActive ? "bg-[#4C1D95] text-white" : "bg-slate-100 text-slate-500"}`}>
                                        <Icon size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm leading-tight">{tab}</p>
                                        <p className={`text-xs font-normal mt-0.5 ${isActive ? "text-[#4C1D95]/70" : "text-slate-400"}`}>{descriptions[tab]}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Software Screenshot per Tab */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-3">
                                <div className="bg-slate-50 rounded-2xl aspect-[16/8] flex items-center justify-center relative overflow-hidden">
                                    {/* Subtle UI wireframe background */}
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
                                                    <div className="flex-1 h-16 bg-[#4C1D95]/5 rounded-xl" />
                                                    <div className="flex-1 h-16 bg-[#4C1D95]/5 rounded-xl" />
                                                    <div className="flex-1 h-16 bg-[#4C1D95]/5 rounded-xl" />
                                                </div>
                                                <div className="h-20 bg-[#4C1D95]/5 rounded-xl" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative z-10 text-center">
                                        {(() => { const Icon = tabIcons[activeTab]; return <div className="w-14 h-14 mx-auto bg-[#4C1D95]/10 rounded-2xl flex items-center justify-center mb-3"><Icon size={28} className="text-[#4C1D95]/30" /></div>; })()}
                                        <p className="text-sm text-slate-400 font-bold">{tabLabels[activeTab]}</p>
                                        <p className="text-xs text-slate-300 mt-1">Captura del software · Placeholder</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          4) CTA FINAL — FULL WIDTH
          ═══════════════════════════════════════════ */}
            <section className="py-20 bg-gradient-to-br from-[#4C1D95] via-[#3b1675] to-[#2E1065] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7C3AED]/20 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                            Accedé a tu historial médico digital
                        </h2>
                        <p className="text-lg text-white/70 mb-8">
                            Creá tu cuenta en CelDoctor y centralizá toda tu información médica.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/registro"
                                className="inline-flex items-center gap-2 px-10 py-5 bg-white text-[#2E1065] rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
                            >
                                Crear cuenta gratis
                                <ArrowRight size={18} />
                            </Link>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base border border-white/20 text-white hover:bg-white/10 transition-all"
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
