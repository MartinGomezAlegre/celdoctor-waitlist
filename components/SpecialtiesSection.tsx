import Link from "next/link";
import {
  Stethoscope,
  Baby,
  Brain,
  Heart,
  Eye,
  Activity,
  Pill,
  Microscope,
  UserCheck,
  Ear,
  ArrowRight,
} from "lucide-react";

const allSpecialties = [
  { name: "Clinica medica", icon: Stethoscope },
  { name: "Pediatria", icon: Baby },
  { name: "Cardiologia", icon: Heart },
  { name: "Psicologia", icon: Brain },
  { name: "Oftalmologia", icon: Eye },
  { name: "Nutricion", icon: Activity },
  { name: "Dermatologia", icon: UserCheck },
  { name: "Ginecologia", icon: UserCheck },
  { name: "Traumatologia", icon: Activity },
  { name: "Otorrino", icon: Ear },
  { name: "Urologia", icon: Microscope },
  { name: "Psiquiatria", icon: Pill },
];

const visibleSpecialties = allSpecialties.slice(0, 6);

export default function SpecialtiesSection() {
  return (
    <section id="especialidades" className="relative overflow-hidden bg-[#1e0b4b] py-24">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-200 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4C1D95]/30 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#a78bfa]">
            Cartilla digital
          </span>
          <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
            Especialistas al instante.
          </h2>
          <p className="text-lg text-white/70">
            Accede a consultas programadas o de guardia sin derivaciones previas.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {visibleSpecialties.map((specialty) => (
            <div
              key={specialty.name}
              className="group flex cursor-pointer flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition-all hover:border-[#a78bfa]/50 hover:bg-white/10 hover:shadow-lg hover:shadow-[#4C1D95]/20"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/5 bg-white/10 text-[#a78bfa] transition-colors group-hover:bg-[#4C1D95] group-hover:text-white">
                <specialty.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-semibold text-white">{specialty.name}</h3>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/atencion-medica/especialidades-medicas"
            className="inline-flex items-center gap-2 rounded-xl bg-[#4C1D95] px-8 py-4 text-base font-bold text-white shadow-xl shadow-[#4C1D95]/20 transition-all hover:-translate-y-1 hover:bg-[#3b1675] active:scale-95"
          >
            Ver todas las especialidades (+6)
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
