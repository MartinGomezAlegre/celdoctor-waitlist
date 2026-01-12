"use client";

import React from "react";
import InteractiveDemo from "./InteractiveDemo"; 
import { Play } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-100 z-50 h-20 transition-all">
        <div className="max-w-7xl mx-auto px-6 w-full h-full flex items-center justify-between">
          
          {/* Logo (Grande y sin punto) */}
          <div className="flex items-center gap-2 cursor-pointer select-none">
            <span className="font-bold text-2xl md:text-3xl tracking-tight text-slate-900">
              CELDOCTOR
            </span>
          </div>
          
          {/* Menú Desktop */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#especialidades" className="hover:text-[#4C1D95] transition-colors">Especialidades</a>
            <a href="#como-funciona" className="hover:text-[#4C1D95] transition-colors">Cómo funciona</a>
            <a href="#planes" className="hover:text-[#4C1D95] transition-colors">Planes</a>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center gap-3">
             <div className="hidden md:block">
                <InteractiveDemo />
             </div>
             
            <a 
              href="#waitlist" 
              className="bg-[#4C1D95] text-white px-6 py-2.5 rounded-lg text-xs font-bold hover:bg-[#2E1065] transition-all shadow-lg shadow-[#4C1D95]/25 hover:-translate-y-0.5"
            >
              Unirme a la lista de espera
            </a>
          </div>
        </div>
      </nav>
  );
}