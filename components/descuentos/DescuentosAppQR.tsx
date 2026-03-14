"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Search, Smartphone, QrCode } from "lucide-react";
import { appBullets } from "./descuentos.data";

export default function DescuentosAppQR() {
    return (
        <section className="py-16 bg-slate-50 border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Right — Text (first on mobile) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="order-1 lg:order-2"
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                            Tus descuentos, siempre a mano
                        </h2>
                        <p className="text-slate-500 leading-relaxed mb-6">
                            Desde la app de CelDoctor accedés en segundos a todos tus beneficios farmacéuticos. Escaneá tu código QR en cualquier farmacia adherida y el descuento se aplica automáticamente.
                        </p>
                        <ul className="space-y-3 mb-8">
                            {appBullets.map((bullet, i) => (
                                <li key={i} className="flex items-start gap-3 text-slate-600">
                                    <CheckCircle2 size={18} className="text-[#4C1D95] mt-0.5 shrink-0" />
                                    <span className="font-medium text-sm">{bullet}</span>
                                </li>
                            ))}
                        </ul>
                        <a
                            href="#buscador"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#4C1D95]/20 text-[#4C1D95] font-bold text-sm hover:bg-[#4C1D95] hover:text-white hover:shadow-lg hover:shadow-[#4C1D95]/20 transition-all"
                        >
                            <Search size={16} />
                            Ver farmacias adheridas
                        </a>
                    </motion.div>

                    {/* Left — App + QR */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="order-2 lg:order-1"
                    >
                        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
                            {/* App Screenshot */}
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-3 w-56">
                                <div className="bg-slate-50 rounded-2xl aspect-[9/16] flex items-center justify-center relative overflow-hidden">
                                    <div className="text-center p-4">
                                        <div className="w-12 h-12 mx-auto bg-[#4C1D95]/10 rounded-xl flex items-center justify-center mb-3">
                                            <Smartphone size={24} className="text-[#4C1D95]" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-600">App CelDoctor</p>
                                        <p className="text-xs text-slate-400 mt-1">Screenshot Placeholder</p>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
                                        <div className="h-8 bg-[#4C1D95]/5 rounded-lg" />
                                        <div className="h-8 bg-[#4C1D95]/5 rounded-lg" />
                                        <div className="h-8 bg-[#4C1D95]/10 rounded-lg" />
                                    </div>
                                </div>
                            </div>

                            {/* QR Code */}
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 flex flex-col items-center">
                                <div className="w-32 h-32 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center mb-3">
                                    <QrCode size={56} className="text-[#4C1D95]/30" />
                                </div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Escaneá tu QR</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">Placeholder</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
