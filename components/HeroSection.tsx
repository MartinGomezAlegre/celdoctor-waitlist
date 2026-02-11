"use client";

import React from "react";
import Image from "next/image";
import InteractiveDemo from "./InteractiveDemo";
import { PlayCircle, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 bg-linear-to-b from-white via-slate-50/50 to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* =========================================
              COLUMNA IZQUIERDA (TEXTO)
          ========================================= */}
          <div className="space-y-8 max-w-2xl text-center lg:text-left mx-auto lg:mx-0 z-10">

            {/* Badge Estático */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/10 text-[#4C1D95] text-[11px] font-bold uppercase tracking-wider shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="inline-flex rounded-full h-2 w-2 bg-[#4C1D95]"></span>
              </span>
              Lanzamiento 2026
            </div>

            {/* Título Principal */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
              Un hospital digital, <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#4C1D95] to-[#7C3AED]">
                en tu bolsillo.
              </span>
            </h1>

            {/* Subtítulo Persuasivo */}
            <p className="text-lg text-slate-600 leading-relaxed font-medium pr-4">
              ¿Harto de las guardias eternas? Accedé a médicos especialistas en minutos, recetas válidas y seguimiento real.
              <span className="block mt-3 text-slate-900 font-bold text-xl">
                Tu salud no tiene por qué esperar.
              </span>
            </p>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start w-full sm:w-auto">

              {/* Botón Principal (Waitlist) */}
              <a
                href="#waitlist"
                className="relative z-20 inline-flex justify-center items-center px-8 py-4 bg-[#4C1D95] text-white rounded-xl font-bold text-base hover:bg-[#3b1675] transition-all shadow-xl shadow-[#4C1D95]/20 hover:-translate-y-1 active:scale-95"
              >
                Unirme a la lista de espera
              </a>

              {/* Botón Demo Destacado */}
              <div className="flex items-center justify-center relative">
                <div className="group relative flex items-center gap-3 px-6 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold cursor-pointer hover:border-[#4C1D95] hover:text-[#4C1D95] hover:shadow-lg transition-all w-full sm:w-auto justify-center overflow-hidden">

                  {/* Elementos Visuales */}
                  <PlayCircle size={24} className="text-[#4C1D95] fill-[#4C1D95]/10 shrink-0" />
                  <span className="text-sm pointer-events-none">Ver Demo Interactiva</span>

                  <div className="absolute inset-0 opacity-0 z-10 [&_button]:w-full [&_button]:h-full [&_button]:cursor-pointer">
                    <InteractiveDemo />
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Secundario — Texto honesto sin métricas falsas */}
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-6 border-t border-slate-100/50">
              <div className="flex items-center gap-3 bg-[#4C1D95]/5 px-5 py-3 rounded-xl border border-[#4C1D95]/10">
                <ArrowRight size={18} className="text-[#4C1D95]" />
                <p className="text-sm font-bold text-slate-700">
                  Sé de los primeros en acceder a la plataforma.
                </p>
              </div>
            </div>
          </div>

          {/* =========================================
              COLUMNA DERECHA (IMAGEN ESTÁTICA)
          ========================================= */}
          <div className="relative flex justify-center lg:justify-end mt-12 lg:mt-0">

            {/* Fondo Decorativo Estático */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 lg:w-175 lg:h-175 bg-[#4C1D95]/5 rounded-full blur-[80px] -z-10" />

            {/* Imagen Estática */}
            <div className="relative z-10">
              <Image
                src="/app-hero.png"
                alt="App CelDoctor - Videoconsulta médica"
                width={400}
                height={800}
                className="drop-shadow-2xl rounded-[3rem] border-8 border-slate-900 mx-auto"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}