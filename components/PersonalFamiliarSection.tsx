"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, Shield, User, Users, Heart } from "lucide-react";

export default function PersonalFamiliarSection() {
    return (
        <section id="planes-personales" className="py-24 bg-white overflow-hidden relative border-t border-slate-100">

            {/* Decoración de fondo */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-200 h-200 bg-[#4C1D95]/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* COLUMNA IZQUIERDA: Textos */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/20 text-[#4C1D95] text-xs font-bold uppercase tracking-wider mb-6">
                                <Heart size={14} /> Planes para Vos y tu Familia
                            </div>

                            {/* Título */}
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight text-slate-900">
                                Cuidá tu salud y la de los tuyos con{" "}
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#4C1D95] to-[#7C3AED]">
                                    cobertura real.
                                </span>
                            </h2>

                            {/* Párrafo */}
                            <p className="text-slate-600 text-lg leading-relaxed max-w-xl">
                                Ya sea que busques atención médica de calidad para vos o protección completa para toda tu familia, nuestros planes se adaptan a tus necesidades. Accedé a consultas ilimitadas, guardia 24/7 y recetas digitales sin complicaciones.
                            </p>
                        </motion.div>

                        {/* Planes con precios */}
                        <div className="space-y-4">
                            {[
                                {
                                    icon: User,
                                    name: "Plan Personal",
                                    price: "$4.500",
                                    desc: "Consultas ilimitadas, guardia 24/7 y recetas digitales.",
                                },
                                {
                                    icon: Users,
                                    name: "Plan Familiar",
                                    price: "$12.500",
                                    desc: "Hasta 4 integrantes. Incluye pediatría prioritaria.",
                                },
                            ].map((plan, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#4C1D95]/20 hover:shadow-md transition-all"
                                >
                                    <div className="bg-[#4C1D95] rounded-xl p-2.5 shrink-0 shadow-lg shadow-[#4C1D95]/20">
                                        <plan.icon size={20} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-baseline justify-between gap-2 flex-wrap">
                                            <h4 className="text-slate-900 font-bold text-lg">{plan.name}</h4>
                                            <span className="text-[#4C1D95] font-bold text-xl">{plan.price}<span className="text-slate-400 text-sm font-medium">/mes</span></span>
                                        </div>
                                        <p className="text-slate-500 text-sm mt-1">{plan.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Lista de Beneficios */}
                        <ul className="space-y-5">
                            {[
                                "Sin copagos sorpresa ni costos ocultos.",
                                "Historia clínica digital en tu App.",
                                "Recetas válidas al instante.",
                                "Acceso a más de 12 especialidades.",
                            ].map((item, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="flex items-start gap-4"
                                >
                                    <div className="bg-[#4C1D95] rounded-full p-1 mt-0.5 shrink-0 shadow-lg shadow-[#4C1D95]/20">
                                        <CheckCircle2 size={16} className="text-white" />
                                    </div>
                                    <span className="text-slate-700 font-medium text-lg">{item}</span>
                                </motion.li>
                            ))}
                        </ul>

                        {/* Botón CTA */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="pt-4"
                        >
                            <a
                                href="#waitlist"
                                className="inline-flex justify-center items-center px-8 py-4 bg-[#4C1D95] text-white rounded-xl font-bold text-base hover:bg-[#3b1675] hover:shadow-xl hover:shadow-[#4C1D95]/30 transition-all hover:-translate-y-1"
                            >
                                Inscribirme ahora
                            </a>
                        </motion.div>
                    </div>

                    {/* COLUMNA DERECHA: Imagen y Badge */}
                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative z-10 rounded-[2.5rem] overflow-hidden border-[6px] border-white shadow-2xl shadow-slate-200/50"
                        >
                            <Image
                                src="/familiamodelo.png"
                                alt="App CelDoctor - Plan Personal y Familiar"
                                width={400}
                                height={800}
                                className="object-cover w-full h-auto scale-105 hover:scale-100 transition-transform duration-700"
                            />
                        </motion.div>

                        {/* Badge Flotante */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6, type: "spring" }}
                            className="absolute -bottom-8 left-10 md:-left-6 bg-white p-4 pr-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center gap-4 z-20"
                        >
                            <div className="bg-green-100 p-3 rounded-full">
                                <Shield size={24} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Cobertura</p>
                                <p className="text-base font-bold text-slate-900">Sin letra chica</p>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
