"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, BadgeDollarSign, ChevronDown } from "lucide-react";
import { faqItems, ahorroData } from "./planes.data";

export default function PlanesFaqYAhorro() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* A) FAQ */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/10 text-[#4C1D95] text-[11px] font-bold uppercase tracking-wider mb-4">
                            <HelpCircle size={12} /> FAQ
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Preguntas Frecuentes</h2>
                        <div className="space-y-3">
                            {faqItems.map((item, i) => (
                                <div key={i} className="rounded-2xl border border-slate-100 overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/50 transition-colors"
                                        aria-expanded={openFaq === i}
                                    >
                                        <span className="text-sm font-bold text-slate-900 pr-4">{item.q}</span>
                                        <ChevronDown size={16} className={`text-slate-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === i && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <p className="px-5 pb-5 text-sm text-slate-500 leading-relaxed">{item.a}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* B) Comparativa de ahorro */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/10 text-[#4C1D95] text-[11px] font-bold uppercase tracking-wider mb-4">
                            <BadgeDollarSign size={12} /> Ahorro real
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Compará y ahorrá</h2>

                        <div className="rounded-3xl border border-slate-100 overflow-hidden bg-white shadow-sm">
                            <div className="grid grid-cols-3 bg-slate-50 p-4 border-b border-slate-100">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Concepto</span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Tradicional</span>
                                <span className="text-xs font-bold text-[#4C1D95] uppercase tracking-wider text-center">CelDoctor</span>
                            </div>
                            {ahorroData.map((row, i) => (
                                <div key={i} className={`grid grid-cols-3 p-4 items-center ${i < ahorroData.length - 1 ? "border-b border-slate-50" : ""} hover:bg-slate-50/50 transition-colors`}>
                                    <span className="text-sm text-slate-700 font-medium">{row.concepto}</span>
                                    <span className="text-sm text-slate-400 text-center line-through decoration-slate-300">{row.tradicional}</span>
                                    <span className="text-sm text-[#4C1D95] font-bold text-center">{row.celDoctor}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-[#4C1D95]/5 to-[#7C3AED]/5 border border-[#4C1D95]/10">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-[#4C1D95] text-white flex items-center justify-center shadow-lg shadow-[#4C1D95]/30">
                                    <BadgeDollarSign size={28} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-[#4C1D95]">Hasta 70% de ahorro</p>
                                    <p className="text-sm text-slate-500">vs. consultas médicas tradicionales</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
