export const benefitsCards = [
    { value: "2x1", desc: "En productos seleccionados", sub: "Solo con tu plan CelDoctor" },
    { value: "50%", desc: "En medicamentos crónicos", sub: "Hipertensión, diabetes y más" },
    { value: "30%", desc: "Uso general", sub: "Medicamentos recetados" },
    { value: "40%", desc: "Plan materno", sub: "Vitaminas y suplementos" },
];

export const carouselSlides = [
    { title: "Descuento en crónicos", desc: "Hasta 50% en medicamentos para tratamientos prolongados.", badge: "50% OFF", color: "from-[#4C1D95] to-[#7C3AED]" },
    { title: "Plan materno", desc: "Vitaminas, ácido fólico y suplementos con descuento máximo.", badge: "40% OFF", color: "from-[#7C3AED] to-[#a78bfa]" },
    { title: "2x1 en seleccionados", desc: "Comprá uno y llevá otro gratis en productos seleccionados.", badge: "2x1", color: "from-[#2E1065] to-[#4C1D95]" },
    { title: "Delivery sin costo", desc: "Recibí tus medicamentos en tu domicilio sin cargo adicional.", badge: "GRATIS", color: "from-[#4C1D95] to-[#2E1065]" },
];

export const appBullets = [
    "Código QR personal vinculado a tu plan",
    "Descuentos aplicados en tiempo real",
    "Historial de compras farmacéuticas",
    "Alertas de ofertas en tu zona",
    "Delivery a domicilio desde la app",
];

export interface Farmacia {
    id: number;
    nombre: string;
    direccion: string;
    zona: string;
    horario: string;
    descuento: string;
    tipo: "cronicos" | "materno" | "general";
    rating: number;
}

export const farmacias: Farmacia[] = [
    { id: 1, nombre: "Farmacia del Pueblo", direccion: "Av. Rivadavia 4521", zona: "Caballito", horario: "Lun-Sáb 8:00-21:00", descuento: "50% crónicos", tipo: "cronicos", rating: 4.8 },
    { id: 2, nombre: "FarmaSalud Central", direccion: "Av. Corrientes 3210", zona: "Almagro", horario: "Lun-Dom 24hs", descuento: "40% materno", tipo: "materno", rating: 4.9 },
    { id: 3, nombre: "Farmacia San Martín", direccion: "Calle San Martín 890", zona: "Microcentro", horario: "Lun-Vie 8:00-20:00", descuento: "30% general", tipo: "general", rating: 4.5 },
    { id: 4, nombre: "Farmacia del Sol", direccion: "Av. Santa Fe 2100", zona: "Recoleta", horario: "Lun-Sáb 9:00-22:00", descuento: "50% crónicos", tipo: "cronicos", rating: 4.7 },
    { id: 5, nombre: "Farmacia Vital", direccion: "Av. Cabildo 1560", zona: "Belgrano", horario: "Lun-Dom 24hs", descuento: "40% materno", tipo: "materno", rating: 4.6 },
    { id: 6, nombre: "Farmacia Bienestar", direccion: "Av. Libertador 6200", zona: "Núñez", horario: "Lun-Sáb 8:30-21:00", descuento: "30% general", tipo: "general", rating: 4.4 },
    { id: 7, nombre: "Farmacia Esperanza", direccion: "Av. Callao 1250", zona: "Recoleta", horario: "Lun-Vie 8:00-20:30", descuento: "50% crónicos", tipo: "cronicos", rating: 4.8 },
    { id: 8, nombre: "Farmacia Popular", direccion: "Av. La Plata 1100", zona: "Boedo", horario: "Lun-Sáb 8:00-20:00", descuento: "30% general", tipo: "general", rating: 4.5 },
];
