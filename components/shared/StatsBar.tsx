"use client";

import React from "react";
import { motion } from "framer-motion";

interface Stat {
    value: string;
    label: string;
}

interface StatsBarProps {
    stats: Stat[];
    variant?: "light" | "dark";
}

export default function StatsBar({ stats, variant = "dark" }: StatsBarProps) {
    const isDark = variant === "dark";

    return (
        <section className={`py-20 relative overflow-hidden ${isDark ? "bg-[#1e0b4b]" : "bg-slate-50 border-y border-slate-100"}`}>
            {isDark && (
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#4C1D95]/20 rounded-full blur-[150px] pointer-events-none" />
            )}
            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <div className={`grid grid-cols-2 md:grid-cols-${stats.length > 4 ? 4 : stats.length} gap-8 lg:gap-12`}>
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                            className="text-center"
                        >
                            <p
                                className={`text-4xl lg:text-5xl font-bold mb-2 ${isDark
                                        ? "text-transparent bg-clip-text bg-linear-to-r from-[#a78bfa] to-white"
                                        : "text-transparent bg-clip-text bg-linear-to-r from-[#4C1D95] to-[#7C3AED]"
                                    }`}
                            >
                                {stat.value}
                            </p>
                            <p className={`text-sm font-medium ${isDark ? "text-white/60" : "text-slate-500"}`}>
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
