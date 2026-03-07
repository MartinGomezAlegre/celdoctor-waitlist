"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    HelpCircle, Newspaper, BookOpen, ArrowRight,
    type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
    HelpCircle,
    Newspaper,
};

interface BlogSection {
    icon: string;
    title: string;
    description: string;
    href: string;
}

interface Article {
    title: string;
    category: string;
    date: string;
}

export default function BlogContent({
    sections,
    articles,
}: {
    sections: BlogSection[];
    articles: Article[];
}) {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-6 mb-20">
                    {sections.map((s, i) => {
                        const Icon = iconMap[s.icon] || HelpCircle;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link
                                    href={s.href}
                                    className="group block p-10 rounded-3xl border border-slate-100 hover:border-[#4C1D95]/20 hover:shadow-xl hover:shadow-[#4C1D95]/5 transition-all bg-white relative overflow-hidden"
                                >
                                    {/* Accent line */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />

                                    <div className="w-16 h-16 rounded-2xl bg-[#4C1D95]/5 text-[#4C1D95] flex items-center justify-center mb-6 group-hover:bg-[#4C1D95] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#4C1D95]/30 transition-all">
                                        <Icon size={32} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{s.title}</h3>
                                    <p className="text-slate-500 leading-relaxed mb-4">{s.description}</p>
                                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4C1D95] group-hover:gap-2.5 transition-all">
                                        Explorar <ArrowRight size={14} />
                                    </span>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                <div>
                    <div className="flex items-center gap-3 mb-8">
                        <BookOpen size={24} className="text-[#4C1D95]" />
                        <h2 className="text-2xl font-bold text-slate-900">Artículos</h2>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#4C1D95] bg-[#4C1D95]/5 px-3 py-1 rounded-full border border-[#4C1D95]/10">
                            Próximamente
                        </span>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((a, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.06 }}
                                className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-[#4C1D95]/10 hover:shadow-md transition-all"
                            >
                                <span className="inline-block text-xs font-bold text-white bg-[#4C1D95] px-2.5 py-1 rounded-lg uppercase tracking-wider">
                                    {a.category}
                                </span>
                                <h3 className="text-base font-bold text-slate-900 mt-3 mb-3">{a.title}</h3>
                                <p className="text-xs text-slate-400">{a.date}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
