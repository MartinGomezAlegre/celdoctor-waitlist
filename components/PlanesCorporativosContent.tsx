"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    CheckCircle2, TrendingUp, Users, Building2, BarChart3,
    Headphones, FileText, Zap, Shield, Clock, ArrowRight,
    ChevronDown, XCircle,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const stats = [
    { value: "40%", label: "Reducción de ausentismo" },
    { value: "98%", label: "Satisfacción de empleados" },
    { value: "3x", label: "Retorno de inversión" },
    { value: "24h", label: "Activación del servicio" },
];

const beneficios = [
    {
        icon: BarChart3,
        title: "Dashboard de gestión en tiempo real",
        desc: "Monitoré ausentismo, uso de la plataforma y ROI desde un panel intuitivo. Reportes automáticos mensuales para presentar a dirección.",
    },
    {
        icon: Headphones,
        title: "Account Manager dedicado",
        desc: "Un asesor exclusivo que conoce tu empresa. Disponible para altas, bajas y soporte sin colas ni tiempos de espera.",
    },
    {
        icon: FileText,
        title: "Factura A discriminada",
        desc: "Emitimos comprobante A para que puedas deducir el gasto como beneficio corporativo en tu declaración impositiva.",
    },
    {
        icon: Zap,
        title: "Altas y bajas en 1 click",
        desc: "Gestioná tu nómina en segundos desde el panel de control. Sin papelería, sin demoras, sin burocracia.",
    },
    {
        icon: Shield,
        title: "Cobertura complementaria a la obra social",
        desc: "No reemplaza la obra social: la potencia. Tu equipo accede a especialistas en minutos, no en días.",
    },
    {
        icon: Clock,
        title: "Chequeo anual ejecutivo incluido",
        desc: "Evaluación médica integral anual para cada empleado. Sin costo adicional en todos los planes corporativos.",
    },
];

const pasos = [
    {
        num: "01",
        title: "Cotizá sin compromiso",
        desc: "Contactanos con el tamaño de tu empresa. Te enviamos una propuesta personalizada en menos de 24hs hábiles.",
    },
    {
        num: "02",
        title: "Configuramos todo por vos",
        desc: "Tu Account Manager configura el dashboard, carga la nómina y activa las cuentas de todos tus empleados.",
    },
    {
        num: "03",
        title: "Tu equipo tiene cobertura",
        desc: "En 48hs tu equipo puede consultar especialistas, obtener recetas y acceder a guardia desde cualquier dispositivo.",
    },
];

const comparativa = [
    { concepto: "Consultas médicas", sin: "3–7 días de espera", con: "Menos de 5 minutos" },
    { concepto: "Ausentismo laboral", sin: "Sin control ni reducción", con: "Reducción de hasta el 40%" },
    { concepto: "Costo por consulta", sin: "$15.000 – $40.000 c/u", con: "Incluido en el plan" },
    { concepto: "Acceso a especialistas", sin: "Requiere derivación previa", con: "Directo, sin derivación" },
    { concepto: "Seguimiento de salud", sin: "Historial fragmentado", con: "Historial digital unificado" },
    { concepto: "Reportes de gestión HR", sin: "No disponibles", con: "Dashboard en tiempo real" },
];

const faqItems = [
    { q: "¿Cuál es la cantidad mínima de empleados?", a: "No hay mínimo. Desde startups de 2 personas hasta corporaciones de 500+. Cada empresa recibe una propuesta completamente a medida." },
    { q: "¿Puedo personalizar la cobertura?", a: "Sí. Armamos paquetes según las necesidades de tu organización: cobertura básica, con especialistas o cobertura ejecutiva integral." },
    { q: "¿CelDoctor reemplaza a la obra social?", a: "No. Es un beneficio complementario que potencia la cobertura existente. Tu equipo mantiene su obra social y suma atención digital inmediata." },
    { q: "¿Cómo se factura?", a: "Factura A discriminada, con reportes mensuales de uso y facturación centralizada. Podés deducir el gasto en tu declaración impositiva." },
    { q: "¿Qué pasa si un empleado se va de la empresa?", a: "Podés dar de baja una cuenta en 1 click desde el dashboard. Sin penalidades ni períodos de carencia." },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PlanesCorporativosContent() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <>
            {/* ════════════════════════════════════════════════════════
                1) STATS — métricas que impactan
            ════════════════════════════════════════════════════════ */}
            <section className="py-16 bg-[#1e0b4b] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                        {stats.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <p className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-[#a78bfa] to-white mb-2">
                                    {s.value}
                                </p>
                                <p className="text-sm font-medium text-white/60">{s.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════
                2) IMAGEN + TEXTO — el argumento principal
            ════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#4C1D95]/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Imagen */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl shadow-slate-200/60 border border-slate-100">
                                <div
                                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                    style={{ backgroundImage: "url(/empresateaser.png)" }}
                                    role="img"
                                    aria-label="Equipo corporativo CelDoctor"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-[#1e0b4b]/40 to-transparent" />
                                {/* Floating badge */}
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="inline-flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-xl">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
                                            <TrendingUp size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-semibold">ROI comprobado</p>
                                            <p className="text-sm font-bold text-slate-900">3x retorno de inversión</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Texto */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/15 text-[#4C1D95] text-xs font-bold uppercase tracking-wider">
                                <Building2 size={13} /> Por qué CelDoctor
                            </div>

                            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-[1.1]">
                                El ausentismo le cuesta a tu empresa{" "}
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#4C1D95] to-[#7C3AED]">
                                    más de lo que pensás.
                                </span>
                            </h2>

                            <p className="text-lg text-slate-600 leading-relaxed">
                                Cada empleado enfermo que espera turno es un día perdido. CelDoctor da a tu equipo acceso a médicos en menos de 5 minutos, desde cualquier dispositivo, en cualquier momento.
                            </p>

                            <ul className="space-y-3.5">
                                {[
                                    "Atención médica inmediata — sin esperas ni traslados",
                                    "Reduce días perdidos por enfermedad no atendida a tiempo",
                                    "Empleados más sanos y productivos",
                                    "Beneficio diferencial para retener talento clave",
                                    "Deducible como gasto empresarial (Factura A)",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-[#4C1D95] flex items-center justify-center shrink-0 mt-0.5">
                                            <CheckCircle2 size={12} className="text-white" />
                                        </div>
                                        <span className="text-slate-700 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/planes/corporativos#form-contacto-empresarial"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[#4C1D95] text-white rounded-2xl font-bold text-base hover:bg-[#3b1675] transition-all shadow-xl shadow-[#4C1D95]/20 hover:-translate-y-1 active:scale-95"
                            >
                                Solicitar propuesta
                                <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════
                3) 6 BENEFICIOS CORPORATIVOS
            ════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/15 text-[#4C1D95] text-xs font-bold uppercase tracking-wider mb-5">
                            <Users size={13} /> Beneficios del plan
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                            Todo lo que incluye el Plan Corporativo
                        </h2>
                        <p className="text-slate-500 text-lg">
                            Diseñado para que los equipos de RRHH gestionen la salud de su nómina sin fricciones.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {beneficios.map((b, i) => {
                            const Icon = b.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08 }}
                                    className="bg-white rounded-3xl p-7 border border-slate-100 hover:border-[#4C1D95]/20 hover:shadow-xl hover:shadow-[#4C1D95]/5 transition-all group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-[#4C1D95]/5 text-[#4C1D95] flex items-center justify-center mb-5 group-hover:bg-[#4C1D95] group-hover:text-white transition-all border border-[#4C1D95]/10 group-hover:shadow-lg group-hover:shadow-[#4C1D95]/25">
                                        <Icon size={24} />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 mb-2">{b.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════
                4) IMAGEN + CÓMO FUNCIONA (3 pasos)
            ════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-[#4C1D95]/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Texto */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="space-y-10"
                        >
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/15 text-[#4C1D95] text-xs font-bold uppercase tracking-wider mb-5">
                                    <Zap size={13} /> Activación rápida
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-[1.1]">
                                    Implementación{" "}
                                    <span className="text-transparent bg-clip-text bg-linear-to-r from-[#4C1D95] to-[#7C3AED]">
                                        en 48 horas.
                                    </span>
                                </h2>
                                <p className="text-lg text-slate-600 leading-relaxed mt-4">
                                    Sin instalaciones, sin hardware, sin burocracia. Tu equipo empieza a usar CelDoctor en menos de dos días.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {pasos.map((paso, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.15 }}
                                        className="flex gap-5"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-[#4C1D95] text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-lg shadow-[#4C1D95]/25">
                                            {paso.num}
                                        </div>
                                        <div className="pt-1">
                                            <h3 className="text-base font-bold text-slate-900 mb-1">{paso.title}</h3>
                                            <p className="text-sm text-slate-500 leading-relaxed">{paso.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Imagen */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl shadow-slate-200/60 border border-slate-100">
                                <div
                                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                    style={{ backgroundImage: "url(/Medicos.jpeg)" }}
                                    role="img"
                                    aria-label="Equipo médico CelDoctor"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-[#1e0b4b]/50 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="inline-flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-xl">
                                        <div className="w-10 h-10 rounded-xl bg-[#4C1D95] flex items-center justify-center shrink-0">
                                            <Clock size={18} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-semibold">Tiempo de activación</p>
                                            <p className="text-sm font-bold text-slate-900">48hs desde la firma</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════
                5) COMPARATIVA — CelDoctor vs Sin beneficio
            ════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-[#1e0b4b] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4C1D95]/30 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                            Con vs. sin CelDoctor
                        </h2>
                        <p className="text-white/60 text-lg">
                            La diferencia que hace tu empresa cuando invertís en salud digital.
                        </p>
                    </div>

                    <div className="rounded-3xl overflow-hidden border border-white/10">
                        {/* Header */}
                        <div className="grid grid-cols-3 bg-white/5 p-4 border-b border-white/10">
                            <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Criterio</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Sin beneficio</span>
                            <span className="text-xs font-bold text-[#a78bfa] uppercase tracking-wider text-center">Con CelDoctor</span>
                        </div>
                        {comparativa.map((row, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.07 }}
                                className={`grid grid-cols-3 p-4 items-center ${i < comparativa.length - 1 ? "border-b border-white/5" : ""} hover:bg-white/5 transition-colors`}
                            >
                                <span className="text-sm text-white/80 font-medium">{row.concepto}</span>
                                <div className="flex items-center justify-center gap-2">
                                    <XCircle size={14} className="text-red-400/60 shrink-0" />
                                    <span className="text-sm text-white/40 text-center">{row.sin}</span>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <CheckCircle2 size={14} className="text-[#a78bfa] shrink-0" />
                                    <span className="text-sm text-white font-semibold text-center">{row.con}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════
                6) FAQ
            ════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">Preguntas frecuentes</h2>
                        <p className="text-slate-500">Todo lo que necesitás saber antes de contratar.</p>
                    </div>

                    <div className="space-y-3">
                        {faqItems.map((item, i) => (
                            <div key={i} className="rounded-2xl border border-slate-100 overflow-hidden bg-white shadow-sm">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/50 transition-colors"
                                    aria-expanded={openFaq === i}
                                >
                                    <span className="text-sm font-bold text-slate-900 pr-4">{item.q}</span>
                                    <ChevronDown
                                        size={16}
                                        className={`text-slate-400 shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                                    />
                                </button>
                                {openFaq === i && (
                                    <div className="px-5 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-50">
                                        <p className="pt-4">{item.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════
                7) CTA FINAL — urgencia y acción
            ════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-linear-to-br from-[#4C1D95] via-[#3b1675] to-[#2E1065] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7C3AED]/20 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-xs font-bold uppercase tracking-wider mb-6">
                            <Building2 size={12} /> Planes desde cualquier tamaño de empresa
                        </div>

                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                            Tu equipo lo merece.
                            <br />
                            <span className="text-[#c4b5fd]">Empezá hoy.</span>
                        </h2>

                        <p className="text-xl text-white/70 mb-10 leading-relaxed">
                            Propuesta a medida en menos de 24hs. Sin mínimo de empleados.
                            <br />
                            <span className="text-white font-semibold">Sin compromiso para cotizar.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/planes/corporativos#form-contacto-empresarial"
                                className="px-10 py-4 bg-white text-[#2E1065] rounded-2xl font-bold text-base hover:bg-slate-100 transition-all shadow-2xl hover:-translate-y-1 active:scale-95 flex items-center gap-2"
                            >
                                Solicitar propuesta gratuita
                                <ArrowRight size={18} />
                            </Link>
                            <Link
                                href="/planes"
                                className="px-8 py-4 rounded-2xl font-bold text-base border border-white/25 text-white hover:bg-white/10 transition-all"
                            >
                                Ver todos los planes
                            </Link>
                        </div>

                        <p className="text-white/40 text-xs mt-8">
                            Sin tarjeta de crédito · Propuesta personalizada · Respuesta en 24hs
                        </p>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
