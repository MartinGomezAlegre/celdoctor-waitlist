"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Stethoscope, Pill, Phone, Video, FileText, ClipboardList,
    ArrowRight,
    type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
    Stethoscope, Pill, Phone, Video, FileText, ClipboardList,
};

interface Service {
    icon: string;
    title: string;
    description: string;
    href: string;
}

export default function ServicesGrid({ services }: { services: Service[] }) {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                        Nuestros servicios
                    </h2>
                    <p className="text-slate-500">
                        Explorá todas las formas en que CelDoctor puede ayudarte.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((s, i) => {
                        const Icon = iconMap[s.icon] || Stethoscope;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                            >
                                <Link
                                    href={s.href}
                                    className="group block p-8 rounded-2xl border border-slate-100 hover:border-[#4C1D95]/20 hover:shadow-xl hover:shadow-[#4C1D95]/5 transition-all bg-white relative overflow-hidden"
                                >
                                    {/* Accent line */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />

                                    <div className="w-14 h-14 rounded-2xl bg-[#4C1D95]/5 text-[#4C1D95] flex items-center justify-center mb-5 group-hover:bg-[#4C1D95] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#4C1D95]/30 transition-all">
                                        <Icon size={28} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed mb-4">{s.description}</p>
                                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4C1D95] opacity-0 group-hover:opacity-100 transition-all transform translate-x-0 group-hover:translate-x-1">
                                        Ver más <ArrowRight size={14} />
                                    </span>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
