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

export interface FeatureItem {
    icon: string;
    title: string;
    description: string;
    bullets?: string[];
    image?: string;
}

interface FeatureShowcaseProps {
    title?: string;
    subtitle?: string;
    features: FeatureItem[];
}

export default function FeatureShowcase({
    title,
    subtitle,
    features,
}: FeatureShowcaseProps) {
    return (
        <section className="py-20 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {(title || subtitle) && (
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        {title && (
                            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="text-slate-500">{subtitle}</p>
                        )}
                    </div>
                )}

                <div className="space-y-8 lg:space-y-0">
                    {features.map((feature, i) => {
                        const Icon = iconMap[feature.icon] || Stethoscope;
                        const isReversed = i % 2 === 1;

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center py-12 lg:py-16 ${i < features.length - 1 ? "border-b border-slate-100" : ""
                                    }`}
                            >
                                {/* Icon / Visual side */}
                                <div className={`${isReversed ? "lg:order-2" : "lg:order-1"}`}>
                                    {feature.image ? (
                                        <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                                style={{ backgroundImage: `url(${feature.image})` }}
                                                role="img"
                                                aria-label={feature.title}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#1e0b4b]/30 to-transparent" />
                                            <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center text-sm font-bold text-[#4C1D95]">
                                                {String(i + 1).padStart(2, "0")}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={`relative rounded-3xl p-12 lg:p-16 ${i % 4 === 0 ? "bg-gradient-to-br from-[#4C1D95]/5 to-[#7C3AED]/10" :
                                                i % 4 === 1 ? "bg-gradient-to-br from-slate-50 to-[#4C1D95]/5" :
                                                    i % 4 === 2 ? "bg-gradient-to-br from-[#7C3AED]/5 to-[#4C1D95]/10" :
                                                        "bg-gradient-to-br from-[#4C1D95]/10 to-slate-50"
                                            }`}>
                                            <div className="flex items-center justify-center">
                                                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-[#4C1D95] rounded-3xl flex items-center justify-center shadow-xl shadow-[#4C1D95]/20 group">
                                                    <Icon size={56} className="text-white" strokeWidth={1.5} />
                                                </div>
                                            </div>
                                            <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-[#4C1D95]/5" />
                                            <div className="absolute bottom-8 left-8 w-8 h-8 rounded-full bg-[#7C3AED]/10" />
                                            <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center text-sm font-bold text-[#4C1D95]">
                                                {String(i + 1).padStart(2, "0")}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Text side */}
                                <div className={`space-y-5 ${isReversed ? "lg:order-1" : "lg:order-2"}`}>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/15 text-[#4C1D95] text-xs font-bold uppercase tracking-wider">
                                        <Icon size={12} />
                                        {feature.title}
                                    </div>

                                    <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-tight">
                                        {feature.title}
                                    </h3>

                                    <p className="text-slate-600 text-lg leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {feature.bullets && feature.bullets.length > 0 && (
                                        <ul className="space-y-3 pt-2">
                                            {feature.bullets.map((bullet, j) => (
                                                <li key={j} className="flex items-start gap-3">
                                                    <div className="bg-[#4C1D95] rounded-full p-0.5 mt-1 shrink-0">
                                                        <CheckCircle2 size={14} className="text-white" />
                                                    </div>
                                                    <span className="text-slate-600 font-medium">{bullet}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
