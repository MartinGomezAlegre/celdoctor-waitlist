"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, PieChart, Building2 } from "lucide-react";

export default function CorporateSection() {
  return (
    // CAMBIO 1: Fondo blanco y borde superior sutil en gris claro
    <section id="empresas" className="py-24 bg-white overflow-hidden relative border-t border-slate-100">
      
      {/* CAMBIO 2: Decoración de fondo más sutil y clara */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] bg-[#4C1D95]/5 rounded-full blur-[150px] pointer-events-none"/>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* COLUMNA IZQUIERDA: Textos (Adaptados a fondo claro) */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
                {/* Badge: Fondo claro, texto y borde violeta */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/20 text-[#4C1D95] text-xs font-bold uppercase tracking-wider mb-6">
                   <Building2 size={14} /> Soluciones Corporativas
                </div>
                
                {/* Título: Texto oscuro (slate-900) */}
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight text-slate-900">
                   Potencia el bienestar de tu equipo y <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4C1D95] to-[#7C3AED]">reduce el ausentismo.</span>
                </h2>
                
                {/* Párrafo: Texto gris (slate-600) */}
                <p className="text-slate-600 text-lg leading-relaxed max-w-xl">
                   Ofrece a tus colaboradores un beneficio de salud real y tangible. CelDoctor es la solución corporativa que cuida a tu talento humano mientras optimiza la productividad de tu organización.
                </p>
            </motion.div>

            {/* Lista de Beneficios */}
            <ul className="space-y-5">
                {[
                    "Aumento inmediato de la productividad.",
                    "Retención de talento clave y fidelización.",
                    "Reducción drástica del ausentismo laboral.",
                    "Reportes de gestión y uso en tiempo real."
                ].map((item, i) => (
                    <motion.li 
                      key={i} 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-4"
                    >
                        {/* Checkmark: Fondo violeta */}
                        <div className="bg-[#4C1D95] rounded-full p-1 mt-0.5 shrink-0 shadow-lg shadow-[#4C1D95]/20">
                             <CheckCircle2 size={16} className="text-white" />
                        </div>
                        {/* Texto de lista: Gris oscuro */}
                        <span className="text-slate-700 font-medium text-lg">{item}</span>
                    </motion.li>
                ))}
            </ul>

            {/* Botón CTA */}
            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.5 }}
               className="pt-4"
            >
               <a 
                href="#waitlist"
                // Botón: Mantiene el estilo violeta porque contrasta bien con el blanco
                className="inline-flex justify-center items-center px-8 py-4 bg-[#4C1D95] text-white rounded-xl font-bold text-base hover:bg-[#3b1675] hover:shadow-xl hover:shadow-[#4C1D95]/30 transition-all hover:-translate-y-1"
               >
                Descubrir solución corporativa
               </a>
            </motion.div>
          </div>

          {/* COLUMNA DERECHA: Imagen y Badge ROI */}
          <div className="relative">
            <motion.div
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               // Imagen: Borde más claro y sombra suave
               className="relative z-10 rounded-[2.5rem] overflow-hidden border-[6px] border-white shadow-2xl shadow-slate-200/50"
            >
               <Image 
                  src="/empresateaser.png" 
                  alt="Equipo corporativo utilizando CelDoctor" 
                  width={600} 
                  height={700}
                  className="object-cover w-full h-auto scale-105 hover:scale-100 transition-transform duration-700"
               />
            </motion.div>

            {/* Badge Flotante "ROI Positivo" */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, type: "spring" }}
                // Badge: Fondo blanco, borde gris, texto oscuro
                className="absolute -bottom-8 left-10 md:-left-6 bg-white p-4 pr-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center gap-4 z-20"
             >
                <div className="bg-yellow-100 p-3 rounded-full">
                  <PieChart size={24} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Resultados</p>
                  <p className="text-base font-bold text-slate-900">ROI Positivo garantizado</p>
                </div>
             </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}