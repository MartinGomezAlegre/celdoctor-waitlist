"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, User, Sparkles } from "lucide-react";

export default function PersonalPlanSection() {
    return (
        <section id="plan-personal" className="py-24 bg-white overflow-hidden relative border-t border-slate-100">

            {/* Decoración de fondo */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-200 h-200 bg-[#4C1D95]/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* COLUMNA IZQUIERDA: Imagen */}
                    <div className="relative order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative z-10 rounded-[2.5rem] overflow-hidden border-[6px] border-white shadow-2xl shadow-slate-200/50"
                        >
                            <Image
                                src="/personalmodelo.png"
                                alt="Plan Personal CelDoctor"
                                width={600}
                                height={700}
                                className="object-cover w-full h-auto scale-105 hover:scale-100 transition-transform duration-700"
                            />
                        </motion.div>

                        {/* Badge Flotante */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6, type: "spring" }}
                            className="absolute -bottom-8 right-10 md:-right-6 bg-white p-4 pr-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center gap-4 z-20"
                        >
                            <div className="bg-green-100 p-3 rounded-full">
                                <Sparkles size={24} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Precio</p>
                                <p className="text-base font-bold text-slate-900">$4.500/mes</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* COLUMNA DERECHA: Textos */}
                    <div className="space-y-8 order-1 lg:order-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/20 text-[#4C1D95] text-xs font-bold uppercase tracking-wider mb-6">
                                <User size={14} /> Plan Personal
                            </div>

                            {/* Título */}
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight text-slate-900">
                                Tu salud, sin vueltas ni{" "}
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#4C1D95] to-[#7C3AED]">
                                    complicaciones.
                                </span>
                            </h2>

                            {/* Precio destacado */}
                            <div className="mb-4">
                                <span className="text-4xl font-bold text-[#4C1D95]">$4.500</span>
                                <span className="text-slate-400 text-lg font-medium ml-1">/mes</span>
                            </div>

                            {/* Párrafo */}
                            <p className="text-slate-600 text-lg leading-relaxed max-w-xl">
                                Accedé a consultas médicas ilimitadas, guardia 24/7 y recetas digitales al instante. Sin copagos sorpresa ni costos ocultos. Tu cobertura médica completa desde tu celular.
                            </p>
                        </motion.div>

                        {/* Lista de Beneficios */}
                        <ul className="space-y-5">
                            {[
                                "Consultas médicas ilimitadas.",
                                "Guardia 24/7 sin espera.",
                                "Recetas digitales al instante.",
                                "Historia clínica en la App.",
                                "Sin copagos sorpresa.",
                            ].map((item, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
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
                            <Link
                                href="/registro"
                                className="inline-flex justify-center items-center px-8 py-4 bg-[#4C1D95] text-white rounded-xl font-bold text-base hover:bg-[#3b1675] hover:shadow-xl hover:shadow-[#4C1D95]/30 transition-all hover:-translate-y-1"
                            >
                                Contratar ahora
                            </Link>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
