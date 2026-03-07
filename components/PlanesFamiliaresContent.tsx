"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, CheckCircle2, Heart, Baby, Stethoscope,
    Sparkles, ArrowRight, Mail, ShieldCheck,
    ChevronDown, HelpCircle, BadgeDollarSign, Shield,
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

const faqItems = [
    { q: "¿Cuántos miembros puedo incluir?", a: "El plan incluye hasta 4 miembros: titular + 3 adicionales (pareja, hijos o dependientes)." },
    { q: "¿Los menores pueden usar la app solos?", a: "Los menores de 18 necesitan la autorización del adulto titular. Las consultas pediátricas se hacen con presencia virtual del padre o tutor." },
    { q: "¿Puedo agregar más miembros?", a: "Sí. Podés agregar miembros adicionales con un costo por persona. Contactanos para más detalles." },
    { q: "¿Cada miembro tiene su propio historial?", a: "Sí. Cada integrante tiene historial clínico independiente y privado." },
    { q: "¿Hay copagos o costos extras?", a: "No. El precio mensual incluye todo para todos los miembros. Sin sorpresas." },
];

/* ══════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════ */

export default function PlanesFamiliaresContent() {
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
                                    <div className="bg-[#0f0525] rounded-2xl aspect-[4/3] flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#4C1D95]/15 to-transparent" />
                                        <div className="absolute top-8 right-8 w-24 h-24 rounded-full bg-[#7C3AED]/15 blur-xl" />
                                        <div className="absolute bottom-12 left-8 w-32 h-20 rounded-2xl bg-[#4C1D95]/10 blur-lg" />
                                        <div className="relative z-20 text-center p-8">
                                            <div className="w-20 h-20 mx-auto bg-white/10 border border-white/15 rounded-3xl flex items-center justify-center mb-4">
                                                <Users size={36} className="text-white/60" />
                                            </div>
                                            <p className="text-white/70 font-bold text-lg mb-1">Familia usando CelDoctor</p>
                                            <p className="text-white/40 text-sm">Lifestyle Placeholder</p>
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
          2) PLAN FAMILIAR — CARD ÚNICA DESTACADA
          ═══════════════════════════════════════════ */}
            <section id="plan-familiar" className="py-24 bg-white border-t border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#4C1D95]/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-3xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Plan Familiar</h2>
                        <p className="text-slate-500">Una sola suscripción para toda tu familia.</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-10 rounded-3xl bg-gradient-to-b from-[#4C1D95] to-[#2E1065] border border-[#6D28D9] shadow-2xl shadow-[#4C1D95]/40 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 bg-white text-[#4C1D95] text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
                            Recomendado
                        </div>

                        <div className="flex flex-col md:flex-row md:items-start md:gap-12">
                            {/* Plan info */}
                            <div className="flex-1 mb-8 md:mb-0">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-4 border border-white/20">
                                    <Users size={28} />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2">Familiar</h3>
                                <p className="text-white/80 text-sm mb-4">Protección total para tus seres queridos.</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-white">$12.500</span>
                                    <span className="text-white/60 text-sm ml-1">/mes</span>
                                </div>
                                <a href="/#waitlist" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#2E1065] rounded-xl font-bold text-base hover:bg-slate-100 transition-all shadow-lg">
                                    Cotizar Familia
                                    <ArrowRight size={16} />
                                </a>
                            </div>

                            {/* Features */}
                            <div className="flex-1">
                                <ul className="space-y-3">
                                    {familiarFeatures.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-white">
                                            <CheckCircle2 size={18} className="text-white shrink-0 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
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
          4) FAQ
          ═══════════════════════════════════════════ */}
            <section className="py-20 bg-slate-50 border-y border-slate-100">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/10 text-[#4C1D95] text-[11px] font-bold uppercase tracking-wider mb-4"><HelpCircle size={12} /> FAQ</div>
                        <h2 className="text-2xl font-bold text-slate-900">Preguntas Frecuentes</h2>
                    </div>
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
            </section>

            {/* ═══════════════════════════════════════════
          5) LISTA DE ESPERA
          ═══════════════════════════════════════════ */}
            <section className="py-20 bg-gradient-to-br from-[#4C1D95] via-[#3b1675] to-[#2E1065] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7C3AED]/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">La salud de tu familia merece lo mejor</h2>
                        <p className="text-lg text-white/70 mb-8">Inscribite y asegurá cobertura médica digital para todos.</p>
                        {subscribed ? (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-3 px-8 py-5 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-sm">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center"><ShieldCheck size={20} className="text-emerald-400" /></div>
                                <div className="text-left"><p className="text-white font-bold">¡Inscripción recibida!</p><p className="text-white/60 text-sm">Te avisaremos cuando lancemos.</p></div>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                                <div className="flex-1 relative">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Tu email" className="w-full pl-11 pr-4 py-4 bg-white/10 border border-white/15 rounded-2xl text-white placeholder:text-white/40 text-base focus:outline-none focus:ring-2 focus:ring-[#a78bfa]/40 focus:border-white/30 backdrop-blur-sm transition-all" aria-label="Email" />
                                </div>
                                <button type="submit" className="px-8 py-4 bg-white text-[#2E1065] rounded-2xl font-bold text-base hover:bg-slate-100 transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 shrink-0">
                                    Quiero registrarme <ArrowRight size={16} />
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </section>
        </>
    );
}
