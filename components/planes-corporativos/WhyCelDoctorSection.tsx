import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Building2, CheckCircle2, TrendingUp } from "lucide-react"

const highlights = [
    "Atencion medica inmediata - sin esperas ni traslados",
    "Reduce dias perdidos por enfermedad no atendida a tiempo",
    "Empleados mas sanos y productivos",
    "Beneficio diferencial para retener talento clave",
    "Deducible como gasto empresarial (Factura A)",
]

export function WhyCelDoctorSection() {
    return (
        <section className="relative overflow-hidden bg-white py-24">
            <div className="pointer-events-none absolute top-1/2 left-0 h-96 w-96 -translate-y-1/2 rounded-full bg-[#4C1D95]/5 blur-[100px]" />
            <div className="relative z-10 mx-auto max-w-7xl px-6">
                <div className="grid items-center gap-16 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/60">
                            <div
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                style={{ backgroundImage: "url(/empresateaser.png)" }}
                                role="img"
                                aria-label="Equipo corporativo CelDoctor"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-[#1e0b4b]/40 to-transparent" />
                            <div className="absolute right-6 bottom-6 left-6">
                                <div className="inline-flex items-center gap-3 rounded-2xl bg-white/95 px-5 py-3 shadow-xl backdrop-blur-sm">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
                                        <TrendingUp size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500">ROI comprobado</p>
                                        <p className="text-sm font-bold text-slate-900">3x retorno de inversion</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#4C1D95]/15 bg-[#4C1D95]/5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#4C1D95]">
                            <Building2 size={13} /> Por que CelDoctor
                        </div>

                        <h2 className="text-4xl font-bold leading-[1.1] text-slate-900 lg:text-5xl">
                            El ausentismo le cuesta a tu empresa{" "}
                            <span className="bg-linear-to-r from-[#4C1D95] to-[#7C3AED] bg-clip-text text-transparent">
                                mas de lo que pensas.
                            </span>
                        </h2>

                        <p className="text-lg leading-relaxed text-slate-600">
                            Cada empleado enfermo que espera turno es un dia perdido. CelDoctor da a tu equipo acceso a medicos en menos de 5 minutos, desde cualquier dispositivo, en cualquier momento.
                        </p>

                        <ul className="space-y-3.5">
                            {highlights.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#4C1D95]">
                                        <CheckCircle2 size={12} className="text-white" />
                                    </div>
                                    <span className="font-medium text-slate-700">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/planes/corporativos#form-contacto-empresarial"
                            className="inline-flex items-center gap-2 rounded-2xl bg-[#4C1D95] px-8 py-4 text-base font-bold text-white shadow-xl shadow-[#4C1D95]/20 transition-all hover:-translate-y-1 hover:bg-[#3b1675] active:scale-95"
                        >
                            Solicitar propuesta
                            <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
