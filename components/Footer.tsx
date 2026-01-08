import React from "react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8 text-sm">
       <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
             <div className="lg:col-span-1">
                <div className="flex items-center gap-2 mb-6 select-none">
                   <span className="font-bold text-xl tracking-tight text-slate-900">
                     CelDoctor<span className="text-[#4C1D95]">.</span>
                   </span>
                </div>
                <p className="text-slate-500 leading-relaxed mb-6 text-xs md:text-sm">
                    Conectamos tecnología y medicina para democratizar el acceso a la salud de calidad en toda la región.
                </p>
                
             </div>
             <div>
                <h4 className="font-bold text-slate-900 mb-5">Plataforma</h4>
                <ul className="space-y-3 text-slate-500 text-xs md:text-sm">
                   <li><a href="#especialidades" className="hover:text-[#4C1D95] transition-colors">Especialidades Médicas</a></li>
                   <li><a href="#planes" className="hover:text-[#4C1D95] transition-colors">Planes Corporativos</a></li>
                   <li><a href="#waitlist" className="hover:text-[#4C1D95] transition-colors">Solicitar Demo</a></li>
                </ul>
             </div>
             <div>
                <h4 className="font-bold text-slate-900 mb-5">Empresa</h4>
                <ul className="space-y-3 text-slate-500 text-xs md:text-sm">
                   <li><a href="#" className="hover:text-[#4C1D95] transition-colors">Sobre Nosotros</a></li>
                   <li><a href="#" className="hover:text-[#4C1D95] transition-colors">Prensa y Medios</a></li>
                   <li><a href="#" className="hover:text-[#4C1D95] transition-colors">Inversores</a></li>
                </ul>
             </div>
             <div>
                <h4 className="font-bold text-slate-900 mb-5">Soporte</h4>
                <ul className="space-y-3 text-slate-500 text-xs md:text-sm">
                   <li><a href="#" className="hover:text-[#4C1D95] transition-colors">Centro de Ayuda</a></li>
                   <li><a href="#" className="hover:text-[#4C1D95] transition-colors">Defensa al Consumidor</a></li>
                </ul>
             </div>
          </div>
          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
               <div className="text-slate-400 text-xs text-center md:text-left">
                  <p>© 2026 CelDoctor Argentina S.A.</p>
               </div>
               <div className="flex gap-6 text-xs text-slate-400">
                  <a href="#" className="hover:text-[#4C1D95] transition-colors">Privacidad</a>
                  <a href="#" className="hover:text-[#4C1D95] transition-colors">Términos</a>
               </div>
          </div>
       </div>
    </footer>
  );
}