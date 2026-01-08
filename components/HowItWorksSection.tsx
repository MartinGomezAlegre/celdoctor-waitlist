import React from "react";
import { Smartphone, Video, CheckCircle2 } from "lucide-react";

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-24 bg-white overflow-hidden">
       <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-slate-900">Simple, rápido y humano</h2>
          </div>
          <div className="relative grid md:grid-cols-3 gap-12">
             <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-slate-200 z-0"/>
             {[
               { icon: Smartphone, title: "1. Autogestión", desc: "Ingresá a la app y solicitá atención inmediata o programada." },
               { icon: Video, title: "2. Videoconsulta", desc: "El médico te atiende por videollamada de alta definición." },
               { icon: CheckCircle2, title: "3. Solución", desc: "Recibí tu diagnóstico, recetas y órdenes al instante." }
             ].map((step, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center bg-white p-4">
                   <div className="w-24 h-24 bg-white border border-slate-100 shadow-xl rounded-2xl flex items-center justify-center text-[#4C1D95] mb-8 rotate-3 hover:rotate-0 transition-transform duration-300">
                      <step.icon size={36} strokeWidth={1.5} />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                   <p className="text-slate-500 text-sm leading-relaxed max-w-[250px]">{step.desc}</p>
                </div>
             ))}
          </div>
       </div>
    </section>
  );
}