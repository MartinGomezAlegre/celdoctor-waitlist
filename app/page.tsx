"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SpecialtiesSection from "@/components/SpecialtiesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import PlansSection from "@/components/PlansSection";
import CorporateSection from "@/components/CorporateSection"; // <--- IMPORTAR NUEVO
import DoctorsSection from "@/components/DoctorsSection";
import WaitlistForm from "@/components/WaitlistForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-white selection:bg-[#4C1D95]/30">
      
      <Navbar />

      <main className="flex-1">
        
        {/* 1. HERO */}
        <HeroSection />

        {/* 2. ESPECIALIDADES */}
        <SpecialtiesSection />

        {/* 3. CÓMO FUNCIONA */}
        <HowItWorksSection />

        {/* 4. PLANES (Público General) */}
        <PlansSection />

        {/* 5. EMPRESAS (NUEVO DISEÑO OSCURO) */}
        <CorporateSection />

        {/* 6. MÉDICOS (DISEÑO OSCURO) */}
        {/* Al estar pegados, crean un bloque visual fuerte */}
        <DoctorsSection />

        {/* 7. FORMULARIO FINAL */}
        <section id="waitlist" className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#4C1D95]/5 rounded-full blur-[120px] pointer-events-none -z-10"/>

           <div className="max-w-6xl mx-auto px-6 relative z-10">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                 
                 <div className="text-slate-900">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4C1D95]/10 text-[#4C1D95] text-[11px] font-bold uppercase tracking-wider mb-6 border border-[#4C1D95]/10">
                       <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
                       Inscripciones Abiertas
                    </div>
                    <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                       El futuro de la salud <br/>
                       <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4C1D95] to-[#7C3AED]">
                         comienza con vos.
                       </span>
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-10 text-lg">
                      Ya sea que busques cobertura para tu familia, potenciar tu empresa o digitalizar tu consultorio. Este es el lugar.
                    </p>
                    
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                            <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</div>
                            Sin tarjetas de crédito requeridas hoy.
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                            <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</div>
                            Acceso prioritario al lanzamiento Beta.
                        </div>
                    </div>
                 </div>
                 
                 <div className="h-full">
                    <WaitlistForm />
                 </div>
              </div>
           </div>
        </section>

        <Footer />

      </main>
    </div>
  );
}