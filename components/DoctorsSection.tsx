"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp } from "lucide-react";

export default function DoctorsSection() {
  return (
    <section className="py-24 bg-[#2E1065] overflow-hidden relative">
      {/* Fondo decorativo sutil (Glow) */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4C1D95] rounded-full blur-[150px] opacity-20 pointer-events-none"/>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* COLUMNA IZQUIERDA: Imagen y Badge flotante */}
          <div className="relative order-2 lg:order-1">
            <motion.div
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="relative z-10 rounded-[2.5rem] overflow-hidden border-[6px] border-white/10 shadow-2xl"
            >
               {/* IMPORTANTE: Asegurate de tener esta imagen en la carpeta public */}
               <Image 
                  src="/DoctoraESPECIALIDADES.png" 
                  alt="Médica utilizando CelDoctor" 
                  width={600} 
                  height={700}
                  className="object-cover w-full h-auto"
               />
            </motion.div>

            {/* Badge Flotante "Optimiza tus ingresos" (Como en la foto) */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute -bottom-6 -right-6 md:right-10 bg-[#1e0b4b] p-4 rounded-2xl shadow-xl border border-white/10 flex items-center gap-3 z-20 backdrop-blur-md"
             >
                <div className="bg-green-500/20 p-2.5 rounded-full">
                  <TrendingUp size={24} className="text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Optimiza tus ingresos</p>
                  <p className="text-xs text-white/60">Pagos garantizados</p>
                </div>
             </motion.div>
          </div>

          {/* COLUMNA DERECHA: Textos de la imagen */}
          <div className="order-1 lg:order-2 text-white space-y-8">
            <div>
                <span className="text-[#a78bfa] font-bold tracking-widest text-xs uppercase mb-4 block">
                    Profesionales de la Salud
                </span>
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                   Digitaliza tu consultorio y sé parte de la <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] to-white">red médica del futuro.</span>
                </h2>
                <p className="text-white/70 text-lg leading-relaxed max-w-xl">
                   Únete a CelDoctor y accede a miles de pacientes sin barreras geográficas. Gestiona tu agenda con total libertad, reduce el ausentismo y garantiza el cobro de tus honorarios. Nosotros nos ocupamos de la tecnología; tú, de curar.
                </p>
            </div>

            {/* Lista de beneficios (Checkmarks violetas) */}
            <ul className="space-y-5">
                {[
                    "Flexibilidad horaria total (tú eliges cuándo atender).",
                    "Plataforma intuitiva con Historia Clínica Digital integrada.",
                    "Pagos garantizados y transparentes."
                ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                        <div className="bg-[#4C1D95] rounded-full p-1 mt-0.5 shrink-0">
                             <CheckCircle2 size={16} className="text-white" />
                        </div>
                        <span className="text-white/90 font-medium text-lg">{item}</span>
                    </li>
                ))}
            </ul>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
               <a 
                href="#waitlist"
                className="inline-flex justify-center items-center px-8 py-4 bg-gradient-to-r from-[#4C1D95] to-[#6D28D9] text-white rounded-full font-bold text-base hover:shadow-lg hover:shadow-[#4C1D95]/40 transition-all hover:-translate-y-1"
               >
                Postularme ahora
               </a>
               
               <a 
                 href="#como-funciona"
                 className="inline-flex justify-center items-center px-8 py-4 rounded-full font-bold text-base border border-white/20 text-white hover:bg-white/10 transition-all"
               >
                 Más información
               </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}