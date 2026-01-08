"use client";

import { useState } from "react";
import { 
  Stethoscope, Baby, Brain, Heart, Eye, Activity, 
  ChevronDown, ChevronUp, Pill, Microscope, 
  UserCheck, Ear
} from "lucide-react";

export default function SpecialtiesSection() {
  const [showAll, setShowAll] = useState(false);

  const allSpecialties = [
    { name: "Clínica Médica", icon: Stethoscope },
    { name: "Pediatría", icon: Baby },
    { name: "Cardiología", icon: Heart },
    { name: "Psicología", icon: Brain },
    { name: "Oftalmología", icon: Eye },
    { name: "Nutrición", icon: Activity },
    { name: "Dermatología", icon: UserCheck },
    { name: "Ginecología", icon: UserCheck },
    { name: "Traumatología", icon: Activity },
    { name: "Otorrino", icon: Ear },
    { name: "Urología", icon: Microscope },
    { name: "Psiquiatría", icon: Pill },
  ];

  const visibleSpecialties = showAll ? allSpecialties : allSpecialties.slice(0, 6);

  return (
    // CAMBIO 1: Fondo violeta oscuro y quitamos los bordes grises
    <section id="especialidades" className="bg-[#1e0b4b] py-24 relative overflow-hidden">
      
      {/* Decoración opcional de fondo (luz sutil) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#4C1D95]/30 rounded-full blur-[150px] pointer-events-none"/>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          {/* CAMBIO 2: Textos en blanco y violeta claro */}
          <span className="text-[#a78bfa] font-bold text-xs uppercase tracking-wider mb-2 block">Cartilla Digital</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Especialistas al instante.
          </h2>
          <p className="text-white/70 text-lg">
            Accedé a consultas programadas o de guardia sin derivaciones previas.
          </p>
        </div>

        {/* GRID INTERACTIVO */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {visibleSpecialties.map((esp, i) => (
            // CAMBIO 3: Tarjetas oscuras translúcidas
            <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-[#a78bfa]/50 hover:bg-white/10 hover:shadow-lg hover:shadow-[#4C1D95]/20 transition-all group cursor-pointer text-center flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
              {/* Icono: Fondo claro sutil, se prende en violeta al pasar el mouse */}
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-[#a78bfa] group-hover:text-white group-hover:bg-[#4C1D95] transition-colors border border-white/5">
                <esp.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-white text-sm">{esp.name}</h3>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
           {/* CAMBIO 4: Botón estilo "Outline" blanco */}
           <button 
             onClick={() => setShowAll(!showAll)}
             className="inline-flex items-center gap-2 text-white font-semibold text-sm hover:bg-white/10 transition-colors bg-transparent px-6 py-3 rounded-full border border-white/20 hover:border-white"
           >
             {showAll ? (
               <>Ver menos especialidades <ChevronUp size={16}/></>
             ) : (
               <>Ver todas las especialidades (+6) <ChevronDown size={16}/></>
             )}
           </button>
        </div>
      </div>
    </section>
  );
}