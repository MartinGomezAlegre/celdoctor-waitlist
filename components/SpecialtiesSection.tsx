import Link from "next/link";
import {
  Stethoscope, Baby, Brain, Heart, Eye, Activity,
  Pill, Microscope, UserCheck, Ear, ArrowRight
} from "lucide-react";

const allSpecialties = [
  { name: "Clínica Médica", icon: Stethoscope, image: "/MedicoClinico.jpeg" },
  { name: "Pediatría", icon: Baby, image: "/Pediatra.jpeg" },
  { name: "Cardiología", icon: Heart, image: null },
  { name: "Psicología", icon: Brain, image: "/Psicologo.jpeg" },
  { name: "Oftalmología", icon: Eye, image: null },
  { name: "Nutrición", icon: Activity, image: "/Nutricionista.jpeg" },
  { name: "Dermatología", icon: UserCheck, image: "/Dermatologo.jpeg" },
  { name: "Ginecología", icon: UserCheck, image: "/Ginecologa.jpeg" },
  { name: "Traumatología", icon: Activity, image: null },
  { name: "Otorrino", icon: Ear, image: null },
  { name: "Urología", icon: Microscope, image: null },
  { name: "Psiquiatría", icon: Pill, image: null },
];

const visibleSpecialties = allSpecialties.slice(0, 6);

export default function SpecialtiesSection() {
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
                {esp.image ? (
                <div
                  className="w-14 h-14 rounded-full border border-white/10 shrink-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${esp.image})` }}
                  role="img"
                  aria-label={esp.name}
                />
              ) : (
                <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-[#a78bfa] group-hover:text-white group-hover:bg-[#4C1D95] transition-colors border border-white/5">
                  <esp.icon size={28} strokeWidth={1.5} />
                </div>
              )}
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
