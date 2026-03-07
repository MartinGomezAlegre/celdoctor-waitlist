"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface CTABannerProps {
    title: string;
    subtitle?: string;
    buttonText?: string;
    buttonHref?: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
}

export default function CTABanner({
    title,
    subtitle,
    buttonText = "Unirme a la lista de espera",
    buttonHref = "/#waitlist",
    secondaryButtonText,
    secondaryButtonHref,
}: CTABannerProps) {
    return (
        <section className="py-20 bg-linear-to-br from-[#4C1D95] via-[#3b1675] to-[#2E1065] relative overflow-hidden">
            {/* Decoración */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7C3AED]/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#4C1D95]/30 rounded-full blur-[100px] pointer-events-none" />

            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />

            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    {/* Trust badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/80 text-xs font-bold uppercase tracking-wider">
                        <Sparkles size={12} className="text-[#a78bfa]" />
                        Inscripciones abiertas
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-white/70 text-lg max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    )}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link
                            href={buttonHref}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#2E1065] rounded-xl font-bold text-base hover:bg-slate-100 transition-all shadow-lg hover:-translate-y-1 active:scale-95"
                        >
                            {buttonText}
                            <ArrowRight size={18} />
                        </Link>
                        {secondaryButtonText && secondaryButtonHref && (
                            <Link
                                href={secondaryButtonHref}
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base border border-white/20 text-white hover:bg-white/10 transition-all"
                            >
                                {secondaryButtonText}
                            </Link>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
