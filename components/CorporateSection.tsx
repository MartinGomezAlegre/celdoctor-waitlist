"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, PieChart, Building2 } from "lucide-react";

export default function CorporateSection() {
  return (
    <section id="empresas" className="relative overflow-hidden border-t border-slate-100 bg-white py-24">
      <div className="pointer-events-none absolute left-0 top-1/2 h-200 w-200 -translate-y-1/2 rounded-full bg-[#4C1D95]/5 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10 overflow-hidden rounded-[2.5rem] border-[6px] border-white shadow-2xl shadow-slate-200/50"
            >
              <Image
                src="/empresateaser.png"
                alt="Equipo corporativo utilizando CelDoctor"
                width={600}
                height={700}
                className="h-auto w-full scale-105 object-cover transition-transform duration-700 hover:scale-100"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, type: "spring" }}
              className="absolute -bottom-8 right-10 z-20 flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 pr-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] md:-right-6"
            >
              <div className="rounded-full bg-yellow-100 p-3">
                <PieChart size={24} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Resultados</p>
                <p className="text-base font-bold text-slate-900">ROI positivo garantizado</p>
              </div>
            </motion.div>
          </div>

          <div className="order-1 space-y-8 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#4C1D95]/20 bg-[#4C1D95]/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#4C1D95]">
                <Building2 size={14} /> Soluciones corporativas
              </div>

              <h2 className="mb-6 text-4xl font-bold leading-tight text-slate-900 lg:text-5xl">
                Potencia el bienestar de tu equipo y{" "}
                <span className="bg-linear-to-r from-[#4C1D95] to-[#7C3AED] bg-clip-text text-transparent">
                  reduce el ausentismo.
                </span>
              </h2>

              <p className="max-w-xl text-lg leading-relaxed text-slate-600">
                Ofrece a tus colaboradores un beneficio de salud real y tangible. CelDoctor es la solucion corporativa que cuida a tu talento humano mientras optimiza la productividad de tu organizacion.
              </p>
            </motion.div>

            <ul className="space-y-5">
              {[
                "Aumento inmediato de la productividad.",
                "Retencion de talento clave y fidelizacion.",
                "Reduccion drastica del ausentismo laboral.",
                "Reportes de gestion y uso en tiempo real.",
              ].map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="mt-0.5 shrink-0 rounded-full bg-[#4C1D95] p-1 shadow-lg shadow-[#4C1D95]/20">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                  <span className="text-lg font-medium text-slate-700">{item}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="pt-4"
            >
              <Link
                href="/planes/corporativos#form-contacto-empresarial"
                className="inline-flex items-center justify-center rounded-xl bg-[#4C1D95] px-8 py-4 text-base font-bold text-white transition-all hover:-translate-y-1 hover:bg-[#3b1675] hover:shadow-xl hover:shadow-[#4C1D95]/30"
              >
                Contactar ventas
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
