"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Stethoscope, Baby, Brain, Heart, Eye, Activity,
    UserCheck, Ear, Pill, Microscope, Percent, MapPin,
    ShieldCheck, Tag, Truck, Phone, Clock, Shield,
    HeartPulse, Zap, FileText, QrCode, RefreshCw,
    Smartphone, Video, Lock, Monitor, Wifi, Users,
    ClipboardList, Share2, Search, Download, Bell,
    CheckCircle2, Building2, PieChart, TrendingUp,
    Plug, Layers, Code, Headphones, BarChart3,
    type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
    Stethoscope, Baby, Brain, Heart, Eye, Activity,
    UserCheck, Ear, Pill, Microscope, Percent, MapPin,
    ShieldCheck, Tag, Truck, Phone, Clock, Shield,
    HeartPulse, Zap, FileText, QrCode, RefreshCw,
    Smartphone, Video, Lock, Monitor, Wifi, Users,
    ClipboardList, Share2, Search, Download, Bell,
    CheckCircle2, Building2, PieChart, TrendingUp,
    Plug, Layers, Code, Headphones, BarChart3,
};

export interface BenefitItem {
    icon: string;
    title: string;
    description: string;
}

interface BenefitsGridProps {
    title?: string;
    subtitle?: string;
    items: BenefitItem[];
    columns?: 2 | 3 | 4;
    variant?: "light" | "dark";
    numbered?: boolean;
}

export default function BenefitsGrid({
    title,
    subtitle,
    items,
    columns = 3,
    variant = "light",
    numbered = false,
}: BenefitsGridProps) {
    const isDark = variant === "dark";

    const colsClass =
        columns === 4
            ? "md:grid-cols-2 lg:grid-cols-4"
            : columns === 2
                ? "md:grid-cols-2"
                : "md:grid-cols-2 lg:grid-cols-3";

    return (
        <section
            className={`py-20 relative overflow-hidden ${isDark ? "bg-[#1e0b4b]" : "bg-white"}`}
        >
            {isDark && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4C1D95]/20 rounded-full blur-[150px] pointer-events-none" />
            )}

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {(title || subtitle) && (
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        {title && (
                            <h2 className={`text-3xl lg:text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className={isDark ? "text-white/60" : "text-slate-500"}>
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}

                <div className={`grid ${colsClass} gap-6`}>
                    {items.map((item, i) => {
                        const Icon = iconMap[item.icon] || Stethoscope;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className={`p-8 rounded-2xl border transition-all group relative ${isDark
                                    ? "bg-white/5 border-white/10 hover:border-[#a78bfa]/50 hover:bg-white/10"
                                    : "bg-white border-slate-100 hover:border-[#4C1D95]/20 hover:shadow-xl hover:shadow-[#4C1D95]/5"
                                    }`}
                            >
                                {/* Number badge */}
                                {numbered && (
                                    <div className={`absolute top-4 right-4 text-xs font-bold ${isDark ? "text-white/10" : "text-slate-100"} text-2xl`}>
                                        {String(i + 1).padStart(2, "0")}
                                    </div>
                                )}

                                <div
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all ${isDark
                                        ? "bg-white/10 text-[#a78bfa] border border-white/5 group-hover:bg-[#4C1D95] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#4C1D95]/30"
                                        : "bg-[#4C1D95]/5 text-[#4C1D95] group-hover:bg-[#4C1D95] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#4C1D95]/30"
                                        }`}
                                >
                                    <Icon size={28} strokeWidth={1.5} />
                                </div>
                                <h3 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                                    {item.title}
                                </h3>
                                <p className={`text-sm leading-relaxed ${isDark ? "text-white/60" : "text-slate-500"}`}>
                                    {item.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
