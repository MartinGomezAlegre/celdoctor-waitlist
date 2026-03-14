"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function PlanesCTA() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        setSubscribed(true);
    };

    return (
        <section className="py-20 bg-gradient-to-br from-[#4C1D95] via-[#3b1675] to-[#2E1065] relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7C3AED]/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#4C1D95]/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                        Asegurá tu lugar en el lanzamiento para Argentina, Uruguay y Paraguay
                    </h2>
                    <p className="text-lg text-white/70 mb-8">
                        Sé de los primeros en acceder a CelDoctor cuando lancemos.
                    </p>

                    {subscribed ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 px-8 py-5 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-sm"
                        >
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                                <ShieldCheck size={20} className="text-emerald-400" />
                            </div>
                            <div className="text-left">
                                <p className="text-white font-bold">¡Inscripción recibida!</p>
                                <p className="text-white/60 text-sm">Te avisaremos cuando lancemos.</p>
                            </div>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                            <div className="flex-1 relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Tu email"
                                    className="w-full pl-11 pr-4 py-4 bg-white/10 border border-white/15 rounded-2xl text-white placeholder:text-white/40 text-base focus:outline-none focus:ring-2 focus:ring-[#a78bfa]/40 focus:border-white/30 backdrop-blur-sm transition-all"
                                    aria-label="Email"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-8 py-4 bg-white text-[#2E1065] rounded-2xl font-bold text-base hover:bg-slate-100 transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 shrink-0"
                            >
                                Quiero registrarme
                                <ArrowRight size={16} />
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
