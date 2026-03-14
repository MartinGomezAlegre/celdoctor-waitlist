"use client";

import { motion } from "framer-motion";
import { benefitsCards } from "./descuentos.data";

export default function DescuentosBenefits() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {benefitsCards.map((card, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group p-6 lg:p-8 rounded-3xl border border-slate-100 bg-white hover:border-[#4C1D95]/20 hover:shadow-2xl hover:shadow-[#4C1D95]/10 transition-all text-center cursor-default relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#4C1D95] to-[#7C3AED] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500" />
                            <div className="relative z-10">
                                <p className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] mb-2">
                                    {card.value}
                                </p>
                                <h3 className="text-base font-bold text-slate-900 mb-1">{card.desc}</h3>
                                <p className="text-xs text-slate-400">{card.sub}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
