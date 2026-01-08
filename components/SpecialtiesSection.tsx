"use client";

import { useState } from "react";
import { 
  Stethoscope, Baby, Brain, Heart, Eye, Activity, 
  ChevronDown, ChevronUp, Pill, Microscope, 
  Smile, UserCheck, Syringe, Ear
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
    { name: "Dermatología", icon: UserCheck }, // Extras
    { name: "Ginecología", icon: UserCheck },
    { name: "Traumatología", icon: Activity },
    { name: "Otorrino", icon: Ear },
    { name: "Urología", icon: Microscope },
    { name: "Psiquiatría", icon: Pill },
  ];

  // Mostramos solo 6 al principio, o todas si showAll es true
  const visibleSpecialties = showAll ? allSpecialties : allSpecialties.slice(0, 6);

  return (
    <section id="especialidades" className="bg-slate-50 border-y border-slate-200 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#7C3AED] font-bold text-xs uppercase tracking-wider mb-2 block">Cartilla Digital</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Especialistas al instante.
          </h2>
          <p className="text-slate-600 text-lg">
            Accedé a consultas programadas o de guardia sin derivaciones previas.
          </p>
        </div>

        {/* GRID INTERACTIVO */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {visibleSpecialties.map((esp, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#7C3AED] hover:shadow-lg transition-all group cursor-pointer text-center flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
              <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-500 group-hover:text-[#7C3AED] group-hover:bg-[#7C3AED]/5 transition-colors">
                <esp.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm">{esp.name}</h3>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
           <button 
             onClick={() => setShowAll(!showAll)}
             className="inline-flex items-center gap-2 text-slate-600 font-semibold text-sm hover:text-[#7C3AED] transition-colors bg-white px-6 py-3 rounded-full border border-slate-200 hover:border-[#7C3AED]"
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