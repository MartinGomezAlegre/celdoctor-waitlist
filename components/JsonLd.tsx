import { faqItems } from "./planes/planes.data";

const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL || "https://celdoctor.com";

const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CelDoctor",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    sameAs: [],
    contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        availableLanguage: "Spanish",
        areaServed: ["AR", "UY", "PY"],
    },
    description:
        "Plataforma de telemedicina argentina con consultas médicas inmediatas, recetas digitales y atención 24/7.",
};

const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CelDoctor",
    applicationCategory: "MedicalApplication",
    operatingSystem: "iOS, Android, Web",
    offers: [
        {
            "@type": "Offer",
            name: "Plan Basic",
            price: "4500",
            priceCurrency: "ARS",
            billingIncrement: "P1M",
        },
        {
            "@type": "Offer",
            name: "Plan Premium",
            price: "12500",
            priceCurrency: "ARS",
            billingIncrement: "P1M",
        },
    ],
    description:
        "Aplicación de telemedicina para consultas médicas inmediatas y recetas digitales en Argentina.",
    author: {
        "@type": "Organization",
        name: "CelDoctor",
        url: BASE_URL,
    },
};

const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
        },
    })),
};

export default function JsonLd() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(softwareApplication),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
            />
        </>
    );
}
