"use client";

import React from "react";
import { motion } from "framer-motion";

interface Step {
    step: string;
    title: string;
    desc: string;
}

interface StepsTimelineProps {
    title?: string;
    subtitle?: string;
    steps: Step[];
    variant?: "horizontal" | "vertical";
    theme?: "light" | "dark";
}

export default function StepsTimeline({
    title,
    subtitle,
    steps,
    variant = "horizontal",
    theme = "light",
}: StepsTimelineProps) {
    const isDark = theme === "dark";

    if (variant === "vertical") {
        return (
            <section className={`py-20 relative overflow-hidden ${isDark ? "bg-[#1e0b4b]" : "bg-slate-50"}`}>
                {isDark && (
                    <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#4C1D95]/20 rounded-full blur-[150px] pointer-events-none" />
                )}
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    {(title || subtitle) && (
                        <div className="text-center mb-16">
                            {title && (
                                <h2 className={`text-3xl lg:text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                                    {title}
                                </h2>
                            )}
                            {subtitle && (
                                <p className={isDark ? "text-white/60" : "text-slate-500"}>{subtitle}</p>
                            )}
                        </div>
                    )}

                    <div className="relative">
                        {/* Vertical line */}
                        <div className={`absolute left-10 top-0 bottom-0 w-px ${isDark ? "bg-white/10" : "bg-[#4C1D95]/10"}`} />

                        <div className="space-y-0">
                            {steps.map((s, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15, duration: 0.5 }}
                                    className={`flex gap-8 items-start py-10 relative ${i < steps.length - 1
                                            ? isDark ? "border-b border-white/5" : "border-b border-slate-100"
                                            : ""
                                        }`}
                                >
                                    {/* Step number */}
                                    <div className="shrink-0 relative z-10">
                                        <div className="w-20 h-20 bg-[#4C1D95] text-white rounded-3xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-[#4C1D95]/20">
                                            {s.step}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="pt-2">
                                        <h3 className={`text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                                            {s.title}
                                        </h3>
                                        <p className={`text-lg leading-relaxed max-w-xl ${isDark ? "text-white/60" : "text-slate-500"}`}>
                                            {s.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Horizontal variant
    return (
        <section className={`py-20 relative overflow-hidden ${isDark ? "bg-[#1e0b4b]" : "bg-slate-50"}`}>
            {isDark && (
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4C1D95]/20 rounded-full blur-[120px] pointer-events-none" />
            )}
            <div className="max-w-5xl mx-auto px-6 relative z-10">
                {(title || subtitle) && (
                    <div className="text-center mb-16">
                        {title && (
                            <h2 className={`text-3xl lg:text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className={isDark ? "text-white/60" : "text-slate-500"}>{subtitle}</p>
                        )}
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connecting line (desktop) */}
                    <div className={`hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-px ${isDark ? "bg-white/10" : "bg-[#4C1D95]/10"}`} />

                    {steps.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, duration: 0.5 }}
                            className="text-center relative"
                        >
                            <div className="w-20 h-20 mx-auto bg-[#4C1D95] text-white rounded-3xl flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-[#4C1D95]/20 relative z-10">
                                {s.step}
                            </div>
                            <h3 className={`text-xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                                {s.title}
                            </h3>
                            <p className={`text-sm leading-relaxed ${isDark ? "text-white/60" : "text-slate-500"}`}>
                                {s.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
