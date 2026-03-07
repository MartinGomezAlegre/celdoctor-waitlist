"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    User, Users, Building2, Shield, CheckCircle2,
    type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
    User, Users, Building2, Shield,
};

interface Plan {
    icon: string;
    title: string;
    desc: string;
    price?: string;
    priceLabel?: string;
    features: string[];
    href: string;
    featured: boolean;
}

export default function PlansGrid({ plans }: { plans: Plan[] }) {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className={`grid md:grid-cols-2 ${plans.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-6`}>
                    {plans.map((plan, i) => {
                        const Icon = iconMap[plan.icon] || User;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link
                                    href={plan.href}
                                    className={`group block p-8 rounded-3xl border h-full flex flex-col transition-all relative overflow-hidden ${plan.featured
                                        ? "bg-linear-to-b from-[#4C1D95] to-[#2E1065] border-[#6D28D9] shadow-2xl shadow-[#4C1D95]/30 hover:scale-[1.02]"
                                        : "bg-white border-slate-100 hover:border-[#4C1D95]/20 hover:shadow-xl hover:shadow-[#4C1D95]/5"
                                        }`}
                                >
                                    {/* Popular badge */}
                                    {plan.featured && (
                                        <div className="absolute top-0 right-0 bg-white text-[#4C1D95] text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
                                            Más popular
                                        </div>
                                    )}

                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all ${plan.featured
                                        ? "bg-white/10 text-white border border-white/20"
                                        : "bg-[#4C1D95]/5 text-[#4C1D95] group-hover:bg-[#4C1D95] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#4C1D95]/30"
                                        }`}>
                                        <Icon size={28} />
                                    </div>

                                    <h3 className={`text-2xl font-bold mb-1 ${plan.featured ? "text-white" : "text-slate-900"}`}>
                                        {plan.title}
                                    </h3>

                                    {/* Price */}
                                    {plan.price && (
                                        <div className="mb-3">
                                            <span className={`text-2xl font-bold ${plan.featured ? "text-white" : "text-[#4C1D95]"}`}>
                                                {plan.price}
                                            </span>
                                            {plan.priceLabel && (
                                                <span className={`text-sm ml-1 ${plan.featured ? "text-white/60" : "text-slate-400"}`}>
                                                    {plan.priceLabel}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <p className={`text-sm mb-6 ${plan.featured ? "text-white/80" : "text-slate-500"}`}>
                                        {plan.desc}
                                    </p>

                                    <ul className="space-y-3 flex-1 mb-6">
                                        {plan.features.map((f, j) => (
                                            <li key={j} className={`flex items-start gap-2 text-sm ${plan.featured ? "text-white" : "text-slate-600"}`}>
                                                <CheckCircle2 size={16} className={`mt-0.5 shrink-0 ${plan.featured ? "text-white" : "text-[#4C1D95]"}`} />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>

                                    <span className={`w-full py-3 text-center rounded-xl font-bold text-sm transition-all block ${plan.featured
                                        ? "bg-white text-[#2E1065] hover:bg-slate-100 shadow-lg"
                                        : "border border-slate-200 text-slate-700 group-hover:border-[#4C1D95] group-hover:text-[#4C1D95] group-hover:bg-[#4C1D95]/5"
                                        }`}>
                                        Ver detalles
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
