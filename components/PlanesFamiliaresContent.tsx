"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Users, CheckCircle2, Heart, Baby, Stethoscope,
    ArrowRight, Shield,
} from "lucide-react";

/* ══════════════════════════════════════════
   MOCK DATA
   ══════════════════════════════════════════ */

const familiarFeatures = [
    "Hasta 4 integrantes incluidos",
    "Pediatría prioritaria",
    "Certificados escolares y deportivos",
    "Consultas simultáneas",
    "Guardia familiar 24/7",
    "Recetas digitales para todos",
    "Historial clínico por integrante",
    "Todo lo del Plan Personal incluido",
];

const beneficios = [
    { icon: Users, title: "Hasta 4 miembros", desc: "Incluí a tu pareja, hijos o dependientes con una sola suscripción." },
    { icon: Baby, title: "Pediatría prioritaria", desc: "Pediatras de guardia las 24hs para la tranquilidad de toda la familia." },
    { icon: Stethoscope, title: "Consultas simultáneas", desc: "Varios miembros pueden consultar al mismo tiempo, cada uno con su médico." },
    { icon: Shield, title: "Historial independiente", desc: "Cada integrante tiene su propio historial clínico privado dentro de la app." },
];

/* ══════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════ */

export default function PlanesFamiliaresContent() {

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
                                <Users size={12} /> Planes Familiares
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                                Protección completa para<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] to-white">toda tu familia.</span>
                            </h1>

                            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
                                Incluí hasta 4 integrantes con una sola suscripción. Pediatría prioritaria, consultas simultáneas y la tranquilidad de tener un médico 24/7 para todos.
                            </p>

                            <a
                                href="#plan-familiar"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#2E1065] rounded-2xl font-bold text-base hover:bg-slate-100 transition-all shadow-lg hover:-translate-y-1 active:scale-95"
                            >
                                <Heart size={20} />
                                Ver plan familiar
                            </a>
                        </motion.div>

                        {/* Right — Lifestyle Placeholder */}
                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                            <div className="relative">
                                <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-3 shadow-2xl shadow-black/20 backdrop-blur-sm">
                                    <div className="rounded-2xl aspect-[4/3] relative overflow-hidden">
                                        <Image
                                            src="/familiamodelo.png"
                                            alt="Familia usando CelDoctor"
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
          2) PLAN FAMILIAR — CARD
          ═══════════════════════════════════════════ */}
            <section id="plan-familiar" className="py-24 bg-white border-t border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#4C1D95]/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Plan Familiar</h2>
                        <p className="text-slate-500">Una sola suscripción para toda tu familia.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-3xl mx-auto">
                        {/* Info card (white — same as Basic personal) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-[#4C1D95]/30 hover:shadow-xl hover:shadow-[#4C1D95]/5 transition-all flex flex-col group"
                        >
                            <div className="mb-6">
                                <div className="w-14 h-14 bg-[#4C1D95]/5 rounded-2xl flex items-center justify-center text-[#4C1D95] mb-4 group-hover:bg-[#4C1D95] group-hover:text-white transition-colors border border-[#4C1D95]/10">
                                    <Users size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">Plan Familiar</h3>
                                <p className="text-slate-500 text-sm mt-2">Protección total para toda tu familia.</p>
                                <div className="mt-4">
                                    <span className="text-3xl font-bold text-[#4C1D95]">$12.500</span>
                                    <span className="text-slate-400 text-sm ml-1">/mes</span>
                                </div>
                            </div>
                            <div className="flex-1 mb-8">
                                <ul className="space-y-3">
                                    {familiarFeatures.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                            <CheckCircle2 size={18} className="text-[#4C1D95] shrink-0 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Link
                                href="/registro"
                                className="w-full py-4 text-center border border-[#4C1D95]/20 text-[#4C1D95] rounded-xl font-bold hover:bg-[#4C1D95] hover:text-white hover:shadow-lg hover:shadow-[#4C1D95]/20 transition-all block"
                            >
                                Empezar ahora
                            </Link>
                        </motion.div>

                        {/* Image / visual (same style as premium personal right card) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm min-h-[300px] relative"
                        >
                            <Image
                                src="/familiamodelo.png"
                                alt="Familia usando CelDoctor"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1e0b4b]/60 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <p className="text-white font-bold text-lg leading-snug">Salud para toda tu familia, en un solo lugar</p>
                                <p className="text-white/70 text-sm mt-1">Consultas simultáneas · Pediatría 24/7</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          3) BENEFICIOS EXCLUSIVOS FAMILIAR
          ═══════════════════════════════════════════ */}
            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">¿Por qué el Plan Familiar?</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">Beneficios pensados para que toda la familia esté cubierta.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {beneficios.map((b, i) => {
                            const Icon = b.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-7 rounded-3xl border border-slate-100 bg-white hover:border-[#4C1D95]/20 hover:shadow-xl hover:shadow-[#4C1D95]/5 transition-all group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-[#4C1D95]/5 text-[#4C1D95] flex items-center justify-center mb-4 group-hover:bg-[#4C1D95] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#4C1D95]/30 transition-all">
                                        <Icon size={26} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{b.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
                                </motion.div>
                            );
                        })}
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
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">La salud de tu familia merece lo mejor</h2>
                        <p className="text-lg text-white/70 mb-8">Creá tu cuenta y empezá hoy mismo con cobertura médica digital para todos.</p>
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
