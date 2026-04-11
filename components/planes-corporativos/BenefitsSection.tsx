import { motion } from "framer-motion"
import { Users } from "lucide-react"

import { beneficios } from "./data"

export function BenefitsSection() {
    return (
        <section className="border-y border-slate-100 bg-slate-50 py-24">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#4C1D95]/15 bg-[#4C1D95]/5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#4C1D95]">
                        <Users size={13} /> Beneficios del plan
                    </div>
                    <h2 className="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">
                        Todo lo que incluye el Plan Corporativo
                    </h2>
                    <p className="text-lg text-slate-500">
                        Disenado para que los equipos de RRHH gestionen la salud de su nomina sin fricciones.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {beneficios.map((beneficio, index) => {
                        const Icon = beneficio.icon
                        return (
                            <motion.div
                                key={beneficio.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08 }}
                                className="group rounded-3xl border border-slate-100 bg-white p-7 transition-all hover:border-[#4C1D95]/20 hover:shadow-xl hover:shadow-[#4C1D95]/5"
                            >
                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#4C1D95]/10 bg-[#4C1D95]/5 text-[#4C1D95] transition-all group-hover:bg-[#4C1D95] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#4C1D95]/25">
                                    <Icon size={24} />
                                </div>
                                <h3 className="mb-2 text-base font-bold text-slate-900">{beneficio.title}</h3>
                                <p className="text-sm leading-relaxed text-slate-500">{beneficio.desc}</p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
