"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export interface FAQItem {
    question: string;
    answer: string;
}

interface FAQAccordionProps {
    title?: string;
    subtitle?: string;
    items: FAQItem[];
}

export default function FAQAccordion({
    title = "Preguntas Frecuentes",
    subtitle,
    items,
}: FAQAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-20 bg-white">
            <div className="max-w-3xl mx-auto px-6">
                {(title || subtitle) && (
                    <div className="text-center mb-12">
                        {title && (
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">
                                {title}
                            </h2>
                        )}
                        {subtitle && <p className="text-slate-500">{subtitle}</p>}
                    </div>
                )}

                <div className="space-y-3">
                    {items.map((item, i) => {
                        const isOpen = openIndex === i;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className={`rounded-2xl overflow-hidden transition-all border ${isOpen
                                        ? "border-[#4C1D95]/20 shadow-lg shadow-[#4C1D95]/5 bg-white"
                                        : "border-slate-100 hover:border-[#4C1D95]/10 bg-white"
                                    }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : i)}
                                    className="w-full flex items-center gap-4 px-6 py-5 text-left transition-colors"
                                    aria-expanded={isOpen}
                                >
                                    {/* Number */}
                                    <span className={`text-xs font-bold w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isOpen
                                            ? "bg-[#4C1D95] text-white"
                                            : "bg-slate-100 text-slate-400"
                                        }`}>
                                        {String(i + 1).padStart(2, "0")}
                                    </span>

                                    <span className={`flex-1 font-semibold text-[15px] transition-colors ${isOpen ? "text-[#4C1D95]" : "text-slate-900 hover:text-[#4C1D95]"
                                        }`}>
                                        {item.question}
                                    </span>

                                    <ChevronDown
                                        size={20}
                                        className={`shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#4C1D95]" : ""
                                            }`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="px-6 pb-5 ml-11 text-slate-500 text-sm leading-relaxed border-l-2 border-[#4C1D95]/10">
                                                {item.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
