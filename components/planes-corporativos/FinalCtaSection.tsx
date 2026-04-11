import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Building2 } from "lucide-react"

export function FinalCtaSection() {
    return (
        <section className="relative overflow-hidden bg-linear-to-br from-[#4C1D95] via-[#3b1675] to-[#2E1065] py-24">
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
            />
            <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-[#7C3AED]/20 blur-[120px]" />

            <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white/80">
                        <Building2 size={12} /> Planes desde cualquier tamano de empresa
                    </div>

                    <h2 className="mb-4 text-4xl font-bold leading-tight text-white lg:text-5xl">
                        Tu equipo lo merece.
                        <br />
                        <span className="text-[#c4b5fd]">Empeza hoy.</span>
                    </h2>

                    <p className="mb-10 text-xl leading-relaxed text-white/70">
                        Propuesta a medida en menos de 24 horas. Sin minimo de empleados.
                        <br />
                        <span className="font-semibold text-white">Sin compromiso para cotizar.</span>
                    </p>

                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/planes/corporativos#form-contacto-empresarial"
                            className="flex items-center gap-2 rounded-2xl bg-white px-10 py-4 text-base font-bold text-[#2E1065] shadow-2xl transition-all hover:-translate-y-1 hover:bg-slate-100 active:scale-95"
                        >
                            Solicitar propuesta gratuita
                            <ArrowRight size={18} />
                        </Link>
                        <Link
                            href="/planes"
                            className="rounded-2xl border border-white/25 px-8 py-4 text-base font-bold text-white transition-all hover:bg-white/10"
                        >
                            Ver todos los planes
                        </Link>
                    </div>

                    <p className="mt-8 text-xs text-white/40">
                        Sin tarjeta de credito - Propuesta personalizada - Respuesta en 24 horas
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
