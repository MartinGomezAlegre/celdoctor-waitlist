"use client";

import Link from "next/link";
import {
  Stethoscope, Baby, Brain, Heart, Eye, Activity,
  Pill, Microscope, UserCheck, Ear, ArrowRight
} from "lucide-react";

export default function SpecialtiesSection() {
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

  // Show first 6 on the homepage cards
  const visibleSpecialties = allSpecialties.slice(0, 6);

  return (
    <section id="especialidades" className="bg-[#1e0b4b] py-24 relative overflow-hidden">

      {/* Decoración de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-[#4C1D95]/30 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#a78bfa] font-bold text-xs uppercase tracking-wider mb-2 block">Cartilla Digital</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Especialistas al instante.
          </h2>
          <p className="text-white/70 text-lg">
            Accedé a consultas programadas o de guardia sin derivaciones previas.
          </p>
        </div>

        {/* GRID DE ESPECIALIDADES */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {visibleSpecialties.map((esp, i) => (
            <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-[#a78bfa]/50 hover:bg-white/10 hover:shadow-lg hover:shadow-[#4C1D95]/20 transition-all group cursor-pointer text-center flex flex-col items-center gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-[#a78bfa] group-hover:text-white group-hover:bg-[#4C1D95] transition-colors border border-white/5">
                <esp.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-white text-sm">{esp.name}</h3>
            </div>
          ))}
        </div>

        {/* CTA ÚNICO */}
        <div className="mt-12 text-center">
          <Link
            href="/atencion-medica/especialidades-medicas"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#4C1D95] text-white rounded-xl font-bold text-base hover:bg-[#3b1675] transition-all shadow-xl shadow-[#4C1D95]/20 hover:-translate-y-1 active:scale-95"
          >
            Ver todas las especialidades (+6)
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}