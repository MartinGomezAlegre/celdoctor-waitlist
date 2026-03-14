import React from "react";
import HeroSection from "@/components/HeroSection";
import SpecialtiesSection from "@/components/SpecialtiesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import PlansSection from "@/components/PlansSection";
import PersonalPlanSection from "@/components/PersonalPlanSection";
import FamilyPlanSection from "@/components/FamilyPlanSection";
import CorporateSection from "@/components/CorporateSection";

export default function Home() {
   return (
      <>
         {/* 1. HERO */}
         <HeroSection />

         {/* 2. ESPECIALIDADES */}
         <SpecialtiesSection />

         {/* 3. CÓMO FUNCIONA */}
         <HowItWorksSection />

         {/* 4. PLANES (Público General) */}
         <PlansSection />

         {/* 5. PLAN PERSONAL */}
         <PersonalPlanSection />

         {/* 6. PLAN FAMILIAR */}
         <FamilyPlanSection />

         {/* 7. EMPRESAS */}
         <CorporateSection />
      </>
   );
}
