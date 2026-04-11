import { motion } from "framer-motion"
import { CheckCircle2, XCircle } from "lucide-react"

import { comparativa } from "./data"

export function ComparisonSection() {
    return (
        <section className="relative overflow-hidden bg-[#1e0b4b] py-24">
            <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-[#4C1D95]/30 blur-[150px]" />
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }}
            />

            <div className="relative z-10 mx-auto max-w-5xl px-6">
                <div className="mb-14 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">Con vs. sin CelDoctor</h2>
                    <p className="text-lg text-white/60">
                        La diferencia que hace tu empresa cuando invertis en salud digital.
                    </p>
                </div>

                <div className="overflow-hidden rounded-3xl border border-white/10">
                    <div className="grid grid-cols-3 border-b border-white/10 bg-white/5 p-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-white/50">Criterio</span>
                        <span className="text-center text-xs font-bold uppercase tracking-wider text-slate-400">Sin beneficio</span>
                        <span className="text-center text-xs font-bold uppercase tracking-wider text-[#a78bfa]">Con CelDoctor</span>
                    </div>

                    {comparativa.map((row, index) => (
                        <motion.div
                            key={row.concepto}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.07 }}
                            className={`grid grid-cols-3 items-center p-4 transition-colors hover:bg-white/5 ${
                                index < comparativa.length - 1 ? "border-b border-white/5" : ""
                            }`}
                        >
                            <span className="text-sm font-medium text-white/80">{row.concepto}</span>
                            <div className="flex items-center justify-center gap-2">
                                <XCircle size={14} className="shrink-0 text-red-400/60" />
                                <span className="text-center text-sm text-white/40">{row.sin}</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <CheckCircle2 size={14} className="shrink-0 text-[#a78bfa]" />
                                <span className="text-center text-sm font-semibold text-white">{row.con}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
