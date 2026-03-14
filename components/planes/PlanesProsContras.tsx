"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { prosContras } from "./planes.data";

export default function PlanesProsContras() {
    return (
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
    );
}
