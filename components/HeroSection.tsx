import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

const highlights = [
  {
    icon: Clock3,
    title: "Consultas en minutos",
    description: "Sin esperas",
  },
  {
    icon: BadgeCheck,
    title: "Medicos verificados",
    description: "Especialistas reales",
  },
  {
    icon: ShieldCheck,
    title: "100% seguro",
    description: "Tus datos protegidos",
  },
];

const floatingBenefits = [
  { label: "Atencion rapida", top: "14%", right: "-3%" },
  { label: "Seguridad y confianza", top: "45%", right: "-6%" },
  { label: "Cuidado cercano", top: "77%", right: "-1%" },
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.09),_transparent_28%),linear-gradient(180deg,#ffffff_0%,#f8f7ff_46%,#ffffff_100%)] pt-18 pb-20 lg:pt-28 lg:pb-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(circle_at_72%_28%,rgba(124,58,237,0.14),transparent_26%),radial-gradient(circle_at_70%_75%,rgba(124,58,237,0.12),transparent_21%)]" />
      <div className="absolute left-1/2 top-[8rem] hidden h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#7C3AED]/6 blur-3xl lg:block" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
          <div className="relative z-10 mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#4C1D95]/10 bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#5B21B6] shadow-sm shadow-[#4C1D95]/5 backdrop-blur">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#7C3AED]/10 text-[#6D28D9]">
                <Sparkles size={12} />
              </span>
              Lanzamiento 2026
            </div>

            <h1 className="mt-7 text-5xl font-bold leading-[1.02] tracking-tight text-slate-950 sm:text-6xl lg:text-[4.7rem]">
              Un hospital digital,
              <br />
              <span className="bg-linear-to-r from-[#4C1D95] via-[#6D28D9] to-[#7C3AED] bg-clip-text text-transparent">
                en tu bolsillo.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg font-medium leading-relaxed text-slate-600 lg:text-[1.15rem]">
              Accede a medicos especialistas en minutos, recetas validas y
              seguimiento real desde la comodidad de tu hogar.
              <span className="mt-3 block text-xl font-bold text-slate-900">
                Tu salud no tiene por que esperar.
              </span>
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Link
                href="/registro"
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-[#5B21B6] px-8 py-4 text-base font-bold text-white shadow-[0_16px_38px_-18px_rgba(91,33,182,0.65)] transition-all hover:-translate-y-0.5 hover:bg-[#4C1D95]"
              >
                Empezar ahora
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-[#7C3AED]/25 bg-white/80 px-8 py-4 text-base font-bold text-[#5B21B6] shadow-sm shadow-[#4C1D95]/5 transition-all hover:bg-[#7C3AED]/5"
              >
                <UserRound size={18} />
                Iniciar sesion
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-start justify-center gap-x-7 gap-y-4 border-t border-slate-200/80 pt-6 lg:justify-start">
              {highlights.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex min-w-[170px] items-start gap-3">
                  <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#7C3AED]/10 text-[#6D28D9]">
                    <Icon size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900">{title}</p>
                    <p className="text-sm text-slate-500">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-6 flex justify-center lg:mt-0 lg:justify-end">
            <div className="absolute inset-x-6 bottom-4 top-4 rounded-[3.2rem] bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.12),transparent_64%)] blur-2xl lg:inset-x-0" />
            <div className="absolute left-10 right-0 top-8 hidden h-[86%] rounded-[50%] bg-[#7C3AED]/6 lg:block" />

            {floatingBenefits.map(({ label, top, right }) => (
              <div
                key={label}
                className="absolute z-20 hidden w-44 rounded-3xl border border-white/80 bg-white/92 px-5 py-4 text-sm font-semibold text-slate-700 shadow-[0_22px_60px_-30px_rgba(91,33,182,0.35)] backdrop-blur lg:block"
                style={{ top, right }}
              >
                {label}
              </div>
            ))}

            <div className="relative z-10 mx-auto max-w-[660px]">
              <Image
                src="/HEROIMAGE.png"
                alt="Interfaz de CelDoctor en celular mostrando consultas, beneficios y estudios"
                width={1365}
                height={1194}
                className="mx-auto w-full max-w-[640px] drop-shadow-[0_32px_80px_rgba(76,29,149,0.2)]"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
