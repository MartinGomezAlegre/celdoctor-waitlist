export const planBasic = {
    name: "Basic",
    price: "$4.500",
    period: "/mes",
    desc: "Cobertura esencial para empezar.",
    features: [
        { text: "Consultas médicas (hasta 4/mes)", included: true },
        { text: "Guardia de urgencias", included: true },
        { text: "Recetas digitales", included: true },
        { text: "Historial clínico básico", included: true },
        { text: "Atención 24hs prioritaria", included: false },
        { text: "Historial ilimitado", included: false },
        { text: "Descuentos exclusivos en farmacias", included: false },
        { text: "Account Manager dedicado", included: false },
    ],
};

export const planPremium = {
    name: "Premium",
    price: "$12.500",
    period: "/mes",
    badge: "Más elegido",
    desc: "La experiencia completa de CelDoctor.",
    features: [
        { text: "Consultas médicas ilimitadas", included: true },
        { text: "Guardia de urgencias 24/7", included: true },
        { text: "Recetas digitales al instante", included: true },
        { text: "Historial clínico ilimitado", included: true },
        { text: "Atención 24hs prioritaria", included: true },
        { text: "Descuentos exclusivos en farmacias", included: true },
        { text: "Videollamada HD cifrada", included: true },
        { text: "Soporte prioritario", included: true },
    ],
};

export const prosContras = {
    pros: [
        "Atención inmediata en < 5 minutos",
        "Sin traslados ni salas de espera",
        "Recetas digitales válidas en toda Argentina",
        "Historial médico siempre accesible",
        "Consultas desde cualquier dispositivo",
        "Precio fijo mensual sin copagos",
    ],
    contras: [
        "Turnos con demoras de horas o días",
        "Traslado obligatorio al consultorio",
        "Recetas en papel fáciles de perder",
        "Historial fragmentado entre médicos",
        "Limitado a ubicación geográfica",
        "Copagos y costos sorpresa",
    ],
};

export const faqItems = [
    { q: "¿Puedo cambiar de plan en cualquier momento?", a: "Sí. Podés hacer upgrade o downgrade en cualquier momento sin penalidades ni períodos de carencia." },
    { q: "¿Hay período de prueba?", a: "Estamos preparando ofertas especiales de lanzamiento para los primeros usuarios de la lista de espera." },
    { q: "¿CelDoctor reemplaza a mi obra social?", a: "No. CelDoctor es un servicio complementario a tu cobertura de salud existente." },
    { q: "¿Los médicos están certificados?", a: "Todos los profesionales están matriculados y pasan por un proceso de selección riguroso." },
    { q: "¿Funciona en todo el país?", a: "Sí. CelDoctor funciona en toda Argentina, Uruguay y Paraguay con conexión a internet." },
];

export const ahorroData = [
    { concepto: "Consulta clínica", tradicional: "$15.000 – $25.000", celDoctor: "Incluida en tu plan" },
    { concepto: "Consulta de urgencia", tradicional: "$20.000 – $40.000", celDoctor: "Incluida en tu plan" },
    { concepto: "Receta digital", tradicional: "+ costo de consulta", celDoctor: "Incluida" },
    { concepto: "Traslado al consultorio", tradicional: "$2.000 – $5.000", celDoctor: "$0 (desde tu casa)" },
];