"use client";

import React from "react";
import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";

export default function BenefitsSection() {
  return (
    <section className="py-24 bg-[#2E1065] border-y border-[#3b1675]">
       <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             
             {/* COLUMNA IZQUIERDA: Textos y Lista */}
             <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight text-white">
                   Infraestructura médica <br/>
                   <span className="text-[#a78bfa]">digital y escalable.</span>
                </h2>
                <div className="space-y-6">
                   {[
                      {title: "Recetas Legales", desc: "Válidas en todas las farmacias del país (Ley 27.553)."},
                      {title: "Descuentos en Farmacias", desc: "Accedé a precios preferenciales en medicamentos."},
                      {title: "Historia Clínica Unificada", desc: "Tus antecedentes médicos seguros y accesibles."},
                      {title: "Reducción de Costos", desc: "Planes corporativos que optimizan la inversión."}
                   ].map((item, i) => (
                      <div key={i} className="flex gap-4 group">
                         <div className="mt-1 w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-[#4C1D95] transition-colors">
                            <CheckCircle2 size={16} className="text-white"/>
                         </div>
                         <div>
                            <h4 className="font-bold text-lg text-white">{item.title}</h4>
                            <p className="text-white/60 text-sm">{item.desc}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
             
             {/* COLUMNA DERECHA: Tarjetas de Datos */}
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 shadow-lg hover:bg-white/10 transition-all">
                   <Clock className="text-[#a78bfa] mb-4" size={32}/>
                   <h4 className="font-bold text-2xl text-white">15 min</h4>
                   <p className="text-white/60 text-sm">Tiempo de espera</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 shadow-lg hover:bg-white/10 transition-all">
                   <ShieldCheck className="text-green-400 mb-4" size={32}/>
                   <h4 className="font-bold text-2xl text-white">AES-256</h4>
                   <p className="text-white/60 text-sm">Encriptación bancaria</p>
                </div>
                <div className="col-span-2 bg-gradient-to-r from-[#4C1D95] to-[#6D28D9] p-8 rounded-3xl shadow-xl shadow-black/20 border border-white/10">
                   <h4 className="font-bold text-xl mb-2 text-white">Para PyMEs y Corporaciones</h4>
                   <p className="text-white/80 text-sm mb-4">Planes flexibles que se adaptan a la nómina de tu empresa.</p>
                   <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full text-white backdrop-blur-md">
                     Dashboard RRHH incluido
                   </span>
                </div>
             </div>
          </div>
       </div>
    </section>
  );
}