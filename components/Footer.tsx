import React from "react";
import Link from "next/link";

export default function Footer() {
   return (
      <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8 text-sm" role="contentinfo">
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
                  <h4 className="font-bold text-slate-900 mb-5">Atención Médica</h4>
                  <ul className="space-y-3 text-slate-500 text-xs md:text-sm">
                     <li><Link href="/atencion-medica/especialidades-medicas" className="hover:text-[#4C1D95] transition-colors">Especialidades Médicas</Link></li>
                     <li><Link href="/atencion-medica/videollamada-inmediata" className="hover:text-[#4C1D95] transition-colors">Videollamada Inmediata</Link></li>
                     <li><Link href="/atencion-medica/receta-medica" className="hover:text-[#4C1D95] transition-colors">Receta Digital</Link></li>
                     <li><Link href="/atencion-medica/descuentos-farmacias" className="hover:text-[#4C1D95] transition-colors">Descuentos en Farmacias</Link></li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-bold text-slate-900 mb-5">Planes</h4>
                  <ul className="space-y-3 text-slate-500 text-xs md:text-sm">
                     <li><Link href="/planes/personales-familiares" className="hover:text-[#4C1D95] transition-colors">Planes Personales</Link></li>
                     <li><Link href="/planes/familiares" className="hover:text-[#4C1D95] transition-colors">Planes Familiares</Link></li>
                     <li><Link href="/planes/corporativos" className="hover:text-[#4C1D95] transition-colors">Planes Corporativos</Link></li>
                     <li><Link href="/app/como-funciona" className="hover:text-[#4C1D95] transition-colors">Cómo Funciona</Link></li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-bold text-slate-900 mb-5">Blog & Contacto</h4>
                  <ul className="space-y-3 text-slate-500 text-xs md:text-sm">
                     <li><Link href="/blog/preguntas-frecuentes" className="hover:text-[#4C1D95] transition-colors">Preguntas Frecuentes</Link></li>
                     <li><Link href="/blog/noticias" className="hover:text-[#4C1D95] transition-colors">Noticias</Link></li>
                     <li><a href="mailto:info@celdoctor.com" className="hover:text-[#4C1D95] transition-colors">info@celdoctor.com</a></li>
                     <li><Link href="/registro" className="hover:text-[#4C1D95] transition-colors">Crear cuenta</Link></li>
                  </ul>
               </div>
            </div>
            <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
               <div className="text-slate-400 text-xs text-center md:text-left">
                  <p>© {new Date().getFullYear()} CelDoctor Argentina S.A. Todos los derechos reservados.</p>
               </div>
               <div className="flex gap-6 text-xs text-slate-400">
                  <Link href="/privacidad" className="hover:text-[#4C1D95] transition-colors">Privacidad</Link>
                  <Link href="/terminos" className="hover:text-[#4C1D95] transition-colors">Términos</Link>
               </div>
            </div>
         </div>
      </footer>
   );
}