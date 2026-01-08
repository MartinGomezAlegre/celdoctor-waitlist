"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SpecialtiesSection from "@/components/SpecialtiesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import BenefitsSection from "@/components/BenefitsSection";
import PlansSection from "@/components/PlansSection";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm"; // Importamos el form aquí o creamos una sección separada

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-white selection:bg-[#4C1D95]/30">
      
      <Navbar />

      <main className="flex-1">
        
        <HeroSection />

        <SpecialtiesSection />

        <HowItWorksSection />

        <BenefitsSection />

        <PlansSection />

        {/* Sección Waitlist (Puede ir en su propio componente también, pero como es corto lo dejamos aquí o lo movemos) */}
        <section id="waitlist" className="py-24 bg-[#2E1065] relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4C1D95] rounded-full blur-[150px] opacity-30 pointer-events-none"/>
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900 rounded-full blur-[150px] opacity-20 pointer-events-none"/>

           <div className="max-w-6xl mx-auto px-6 relative z-10">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                 <div className="text-white">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold uppercase tracking-wider mb-6 border border-white/10">
                       <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
                       Early Adopters 2026
                    </div>
                    <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                       El futuro de la salud <br/>
                       <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] to-white">
                         comienza aquí.
                       </span>
                    </h3>
                    <p className="text-white/70 leading-relaxed mb-10 text-lg">
                      Estamos finalizando los detalles para el lanzamiento. Dejanos tus datos para recibir acceso prioritario y beneficios exclusivos.
                    </p>
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