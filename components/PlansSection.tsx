import React from "react";
import { User, CheckCircle2, Users, Building2 } from "lucide-react";

export default function PlansSection() {
  return (
    <section id="planes" className="py-24 bg-white">
       <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-slate-900">Elegí tu cobertura</h2>
             <p className="text-slate-500 mt-2">Planes flexibles diseñados para cada etapa.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
             
             {/* 1. PLAN PERSONAL */}
             <div className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-[#4C1D95]/30 hover:shadow-xl transition-all flex flex-col group">
                <div className="mb-6">
                   <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#4C1D95] mb-4 group-hover:bg-[#4C1D95] group-hover:text-white transition-colors">
                      <User size={28}/>
                   </div>
                   <h3 className="text-2xl font-bold text-slate-900">Personal</h3>
                   <p className="text-slate-500 text-sm mt-2">Cobertura ágil para vos. Sin vueltas.</p>
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
                         <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                            <CheckCircle2 size={18} className="text-[#4C1D95] shrink-0 mt-0.5"/> 
                            {item}
                         </li>
                      ))}
                   </ul>
                </div>
                <a href="#waitlist" className="w-full py-4 text-center bg-[#4C1D95] text-white rounded-xl font-bold hover:bg-[#2E1065] transition-all shadow-lg shadow-[#4C1D95]/20">
                   Solicitar Alta
                </a>
             </div>

             {/* 2. PLAN FAMILIAR */}
             <div className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-[#4C1D95]/30 hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
                <div className="mb-6">
                   <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#4C1D95] mb-4 group-hover:bg-[#4C1D95] group-hover:text-white transition-colors">
                      <Users size={28}/> 
                   </div>
                   <h3 className="text-2xl font-bold text-slate-900">Familiar</h3>
                   <p className="text-slate-500 text-sm mt-2">Protección total para tus seres queridos.</p>
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
                         <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                            <CheckCircle2 size={18} className="text-[#4C1D95] shrink-0 mt-0.5"/> 
                            {item}
                         </li>
                      ))}
                   </ul>
                </div>
                <a href="#waitlist" className="w-full py-4 text-center bg-[#4C1D95] text-white rounded-xl font-bold hover:bg-[#2E1065] transition-all shadow-lg shadow-[#4C1D95]/20">
                   Cotizar Familia
                </a>
             </div>

             {/* 3. PLAN CORPORATIVO */}
             <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-[#4C1D95]/30 hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#4C1D95] text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">Empresas</div>
                
                <div className="mb-6">
                   <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#4C1D95] mb-4 group-hover:bg-[#4C1D95] group-hover:text-white transition-colors shadow-sm">
                      <Building2 size={28}/>
                   </div>
                   <h3 className="text-2xl font-bold text-slate-900">Corporativo</h3>
                   <p className="text-slate-500 text-sm mt-2">Potenciá la salud de tu equipo.</p>
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
                         <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                            <CheckCircle2 size={18} className="text-[#4C1D95] shrink-0 mt-0.5"/> 
                            {item}
                         </li>
                      ))}
                   </ul>
                </div>
                <a href="#waitlist" className="w-full py-4 text-center bg-[#4C1D95] text-white rounded-xl font-bold hover:bg-[#2E1065] transition-all shadow-lg shadow-[#4C1D95]/20">
                   Cotizar Empresa
                </a>
             </div>
          </div>
       </div>
    </section>
  );
}