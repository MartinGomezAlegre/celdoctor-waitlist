"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function VideollamadaCTA() {
    return (
        <section className="py-20 bg-gradient-to-br from-[#4C1D95] via-[#3b1675] to-[#2E1065] relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7C3AED]/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                        Atención médica en minutos
                    </h2>
                    <p className="text-lg text-white/70 mb-8">
                        Creá tu cuenta y accedé a videollamadas con médicos 24/7.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/registro"
                            className="px-8 py-4 bg-white text-[#2E1065] rounded-2xl font-bold text-base hover:bg-slate-100 transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                        >
                            Crear cuenta gratis
                            <ArrowRight size={16} />
                        </Link>
                        <Link
                            href="/login"
                            className="px-8 py-4 rounded-2xl font-bold text-base border border-white/20 text-white hover:bg-white/10 transition-all"
                        >
                            Iniciar sesión
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
