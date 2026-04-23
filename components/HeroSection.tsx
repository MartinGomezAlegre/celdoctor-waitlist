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

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-white pt-18 pb-20 lg:pt-28 lg:pb-28"
    >
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:gap-4">
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

            <div className="mt-10 grid gap-x-7 gap-y-4 border-t border-slate-200/80 pt-6 sm:grid-cols-2 lg:grid-cols-3">
              {highlights.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex min-w-0 items-start gap-3">
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

          <div className="relative mt-2 flex justify-center lg:mt-0 lg:justify-end">
            <div className="relative z-10 mx-auto max-w-[1100px] translate-x-2 sm:translate-x-6 lg:translate-x-20 xl:translate-x-28">
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[19rem] w-[19rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7C3AED]/16 blur-3xl sm:h-[23rem] sm:w-[23rem] lg:h-[28rem] lg:w-[28rem]" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.12)_0%,rgba(124,58,237,0.07)_34%,rgba(124,58,237,0.03)_52%,transparent_70%)] sm:h-[34rem] sm:w-[34rem] lg:h-[40rem] lg:w-[40rem]" />
              <Image
                src="/app-hero.png"
                alt="Interfaz de CelDoctor en celular mostrando consultas, beneficios y estudios"
                width={2160}
                height={3840}
                className="mx-auto w-full max-w-[800px] drop-shadow-[0_54px_140px_rgba(76,29,149,0.28)] lg:max-w-[1860px]"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
