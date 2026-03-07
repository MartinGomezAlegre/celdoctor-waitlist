"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Briefcase, Send, CheckCircle2 } from "lucide-react";

export default function CorporativoForm() {
    const [formData, setFormData] = useState({ empresa: "", empleados: "", industria: "", email: "", telefono: "" });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <section className="py-16 bg-white">
            <div className="max-w-5xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left — Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Cotizá para tu empresa</h2>
                        <p className="text-slate-500 mb-8">Completá el formulario y un asesor te contactará en menos de 24hs.</p>

                        {submitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-10 rounded-2xl border border-emerald-200 bg-emerald-50 text-center"
                            >
                                <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-4" />
                                <h3 className="text-xl font-bold text-slate-900 mb-2">¡Solicitud enviada!</h3>
                                <p className="text-slate-500">Un asesor se contactará con vos en menos de 24 horas hábiles.</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Empresa</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.empresa}
                                        onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                                        placeholder="Nombre de tu empresa"
                                        className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20 focus:border-[#4C1D95]/30 transition-all"
                                    />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cantidad de empleados</label>
                                        <select
                                            required
                                            value={formData.empleados}
                                            onChange={(e) => setFormData({ ...formData, empleados: e.target.value })}
                                            className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20 focus:border-[#4C1D95]/30 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Seleccionar</option>
                                            <option value="1-10">1 - 10</option>
                                            <option value="11-50">11 - 50</option>
                                            <option value="51-200">51 - 200</option>
                                            <option value="200+">200+</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Industria</label>
                                        <select
                                            required
                                            value={formData.industria}
                                            onChange={(e) => setFormData({ ...formData, industria: e.target.value })}
                                            className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20 focus:border-[#4C1D95]/30 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Seleccionar</option>
                                            <option value="tecnologia">Tecnología</option>
                                            <option value="salud">Salud</option>
                                            <option value="educacion">Educación</option>
                                            <option value="finanzas">Finanzas</option>
                                            <option value="retail">Retail</option>
                                            <option value="otro">Otro</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email corporativo</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="contacto@empresa.com"
                                            className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20 focus:border-[#4C1D95]/30 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Teléfono</label>
                                        <input
                                            type="tel"
                                            value={formData.telefono}
                                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                            placeholder="011-XXXX-XXXX"
                                            className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20 focus:border-[#4C1D95]/30 transition-all"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-[#4C1D95] text-white rounded-xl font-bold text-base hover:bg-[#3b1675] transition-all shadow-xl shadow-[#4C1D95]/20 hover:-translate-y-0.5 active:scale-95"
                                >
                                    <Send size={18} />
                                    Solicitar cotización
                                </button>
                            </form>
                        )}
                    </motion.div>

                    {/* Right — Benefits */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Beneficios para tu empresa</h3>
                        <div className="space-y-4">
                            {[
                                { icon: Building2, title: "Dashboard de gestión HR", desc: "Panel en tiempo real con métricas de uso, ausentismo y ROI." },
                                { icon: Users, title: "Reducción de ausentismo", desc: "Las empresas reportan hasta un 40% menos de ausentismo laboral." },
                                { icon: Briefcase, title: "Account Manager dedicado", desc: "Un gestor exclusivo para soporte y consultas corporativas." },
                            ].map((b, i) => {
                                const Icon = b.icon;
                                return (
                                    <div key={i} className="flex gap-4 p-5 rounded-2xl border border-slate-100 hover:border-[#4C1D95]/20 hover:shadow-md transition-all">
                                        <div className="w-12 h-12 rounded-xl bg-[#4C1D95]/5 text-[#4C1D95] flex items-center justify-center shrink-0">
                                            <Icon size={22} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 mb-1">{b.title}</h4>
                                            <p className="text-xs text-slate-500 leading-relaxed">{b.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
