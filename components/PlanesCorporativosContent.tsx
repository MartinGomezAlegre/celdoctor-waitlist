"use client";

import { BenefitsSection } from "./planes-corporativos/BenefitsSection";
import { ComparisonSection } from "./planes-corporativos/ComparisonSection";
import { FaqSection } from "./planes-corporativos/FaqSection";
import { FinalCtaSection } from "./planes-corporativos/FinalCtaSection";
import { ImplementationSection } from "./planes-corporativos/ImplementationSection";
import { StatsSection } from "./planes-corporativos/StatsSection";
import { WhyCelDoctorSection } from "./planes-corporativos/WhyCelDoctorSection";

export default function PlanesCorporativosContent() {
    return (
        <>
            <StatsSection />
            <WhyCelDoctorSection />
            <BenefitsSection />
            <ImplementationSection />
            <ComparisonSection />
            <FaqSection />
            <FinalCtaSection />
        </>
    );
}
