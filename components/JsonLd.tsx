export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CelDoctor",
    "applicationCategory": "MedicalApplication",
    "operatingSystem": "iOS, Android, Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "ARS"
    },
    "description": "Aplicación de telemedicina para consultas médicas inmediatas y recetas digitales en Argentina.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "2000"
    },
    "author": {
      "@type": "Organization",
      "name": "CelDoctor Argentina",
      "url": "https://celdoctor.com"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}