import { motion } from "framer-motion"
import { Clock, Zap } from "lucide-react"

import { pasos } from "./data"

export function ImplementationSection() {
    return (
        <section className="relative overflow-hidden bg-white py-24">
            <div className="pointer-events-none absolute top-1/2 right-0 h-96 w-96 -translate-y-1/2 rounded-full bg-[#4C1D95]/5 blur-[100px]" />
            <div className="relative z-10 mx-auto max-w-7xl px-6">
                <div className="grid items-center gap-16 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="space-y-10"
                    >
                        <div>
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#4C1D95]/15 bg-[#4C1D95]/5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#4C1D95]">
                                <Zap size={13} /> Activacion rapida
                            </div>
                            <h2 className="text-4xl font-bold leading-[1.1] text-slate-900 lg:text-5xl">
                                Implementacion{" "}
                                <span className="bg-linear-to-r from-[#4C1D95] to-[#7C3AED] bg-clip-text text-transparent">
                                    en 48 horas.
                                </span>
                            </h2>
                            <p className="mt-4 text-lg leading-relaxed text-slate-600">
                                Sin instalaciones, sin hardware, sin burocracia. Tu equipo empieza a usar CelDoctor en menos de dos dias.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {pasos.map((paso, index) => (
                                <motion.div
                                    key={paso.num}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15 }}
                                    className="flex gap-5"
                                >
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#4C1D95] text-sm font-bold text-white shadow-lg shadow-[#4C1D95]/25">
                                        {paso.num}
                                    </div>
                                    <div className="pt-1">
                                        <h3 className="mb-1 text-base font-bold text-slate-900">{paso.title}</h3>
                                        <p className="text-sm leading-relaxed text-slate-500">{paso.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/60">
                            <div
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                style={{ backgroundImage: "url(/Medicos.jpeg)" }}
                                role="img"
                                aria-label="Equipo medico CelDoctor"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-[#1e0b4b]/50 to-transparent" />
                            <div className="absolute right-6 bottom-6 left-6">
                                <div className="inline-flex items-center gap-3 rounded-2xl bg-white/95 px-5 py-3 shadow-xl backdrop-blur-sm">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4C1D95]">
                                        <Clock size={18} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500">Tiempo de activacion</p>
                                        <p className="text-sm font-bold text-slate-900">48 horas desde la firma</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
