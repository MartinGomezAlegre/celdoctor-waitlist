"use client";

import React from "react";
import { User, CheckCircle2, Users, Building2 } from "lucide-react";
import { motion } from "framer-motion";

export default function PlansSection() {
  return (
    // CAMBIO 1: Fondo violeta oscuro y borde superior sutil
    <section id="planes" className="py-24 bg-[#1e0b4b] border-t border-white/5 relative overflow-hidden">
      
      {/* Decoración de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#4C1D95]/20 rounded-full blur-[120px] pointer-events-none"/>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
           {/* CAMBIO 2: Textos en blanco y violeta claro */}
           <h2 className="text-3xl font-bold text-white">Elegí tu cobertura</h2>
           <p className="text-white/60 mt-2">Planes flexibles diseñados para cada etapa.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
           
           {/* 1. PLAN PERSONAL */}
           {/* Tarjeta: Fondo oscuro translúcido con borde sutil */}
           <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#a78bfa]/50 hover:bg-white/10 transition-all flex flex-col group">
              <div className="mb-6">
                 <div className="w-14 h-14 bg-[#4C1D95]/30 rounded-2xl flex items-center justify-center text-[#a78bfa] mb-4 group-hover:bg-[#4C1D95] group-hover:text-white transition-colors border border-white/10">
                    <User size={28}/>
                 </div>
                 <h3 className="text-2xl font-bold text-white">Personal</h3>
                 <p className="text-white/60 text-sm mt-2">Cobertura ágil para vos. Sin vueltas.</p>
              </div>
              
              <div className="space-y-4 mb-8 flex-1">
                 <ul className="space-y-3">
                    {[
                      "Consultas médicas ilimitadas",
                      "Guardia 24/7 sin espera",
                      "Recetas digitales al instante",
                      "Historia clínica en la App",
                      "Sin copagos sorpresa"
                    ].map((item, i) => (
                       <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                          <CheckCircle2 size={18} className="text-[#a78bfa] shrink-0 mt-0.5"/> 
                          {item}
                       </li>
                    ))}
                 </ul>
              </div>
              {/* Botón: Borde blanco (Outline) */}
              <a href="#waitlist" className="w-full py-4 text-center border border-white/20 text-white rounded-xl font-bold hover:bg-white hover:text-[#2E1065] transition-all">
                 Solicitar Alta
              </a>
           </div>

           {/* 2. PLAN FAMILIAR (Destacado) */}
           <div className="p-8 rounded-3xl bg-gradient-to-b from-[#4C1D95] to-[#2E1065] border border-[#6D28D9] shadow-2xl shadow-[#4C1D95]/40 hover:scale-[1.02] transition-all flex flex-col group relative overflow-hidden">
              <div className="mb-6">
                 <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-4 transition-colors border border-white/20">
                    <Users size={28}/> 
                 </div>
                 <h3 className="text-2xl font-bold text-white">Familiar</h3>
                 <p className="text-white/80 text-sm mt-2">Protección total para tus seres queridos.</p>
              </div>
              
              <div className="space-y-4 mb-8 flex-1">
                 <ul className="space-y-3">
                    {[
                      "Hasta 4 integrantes incluidos",
                      "Pediatría prioritaria",
                      "Certificados escolares/deportivos",
                      "Consultas simultáneas",
                      "Todo lo del plan personal"
                    ].map((item, i) => (
                       <li key={i} className="flex items-start gap-3 text-sm text-white">
                          <CheckCircle2 size={18} className="text-white shrink-0 mt-0.5"/> 
                          {item}
                       </li>
                    ))}
                 </ul>
              </div>
              {/* Botón: Blanco sólido */}
              <a href="#waitlist" className="w-full py-4 text-center bg-white text-[#2E1065] rounded-xl font-bold hover:bg-slate-100 transition-all shadow-lg">
                 Cotizar Familia
              </a>
           </div>

           {/* 3. PLAN CORPORATIVO */}
           <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#a78bfa]/50 hover:bg-white/10 transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#4C1D95] text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider border-l border-b border-white/10">Empresas</div>
              
              <div className="mb-6">
                 <div className="w-14 h-14 bg-[#4C1D95]/30 rounded-2xl flex items-center justify-center text-[#a78bfa] mb-4 group-hover:bg-[#4C1D95] group-hover:text-white transition-colors border border-white/10">
                    <Building2 size={28}/>
                 </div>
                 <h3 className="text-2xl font-bold text-white">Corporativo</h3>
                 <p className="text-white/60 text-sm mt-2">Potenciá la salud de tu equipo.</p>
              </div>
              
              <div className="space-y-4 mb-8 flex-1">
                 <ul className="space-y-3">
                    {[
                      "Dashboard de gestión de ausentismo",
                      "Factura A discriminada",
                      "Account Manager dedicado",
                      "Chequeo anual ejecutivo",
                      "Altas y bajas en 1 click"
                    ].map((item, i) => (
                       <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                          <CheckCircle2 size={18} className="text-[#a78bfa] shrink-0 mt-0.5"/> 
                          {item}
                       </li>
                    ))}
                 </ul>
              </div>
              {/* Botón: Borde blanco (Outline) */}
              <a href="#waitlist" className="w-full py-4 text-center border border-white/20 text-white rounded-xl font-bold hover:bg-white hover:text-[#2E1065] transition-all">
                 Cotizar Empresa
              </a>
           </div>

        </div>
      </div>
    </section>
  );
}