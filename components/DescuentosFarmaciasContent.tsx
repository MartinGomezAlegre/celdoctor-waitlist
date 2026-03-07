"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, MapPin, Clock, Percent, ChevronDown, ChevronLeft, ChevronRight,
    Pill, Heart, ShieldCheck, Star, Phone, Navigation, Tag,
    Smartphone, QrCode, CheckCircle2, Sparkles,
} from "lucide-react";

/* ══════════════════════════════════════════
   MOCK DATA
   ══════════════════════════════════════════ */

const benefitsCards = [
    { value: "2x1", desc: "En productos seleccionados", sub: "Solo con tu plan CelDoctor" },
    { value: "50%", desc: "En medicamentos crónicos", sub: "Hipertensión, diabetes y más" },
    { value: "30%", desc: "Uso general", sub: "Medicamentos recetados" },
    { value: "40%", desc: "Plan materno", sub: "Vitaminas y suplementos" },
];

const carouselSlides = [
    { title: "Descuento en crónicos", desc: "Hasta 50% en medicamentos para tratamientos prolongados.", badge: "50% OFF", color: "from-[#4C1D95] to-[#7C3AED]" },
    { title: "Plan materno", desc: "Vitaminas, ácido fólico y suplementos con descuento máximo.", badge: "40% OFF", color: "from-[#7C3AED] to-[#a78bfa]" },
    { title: "2x1 en seleccionados", desc: "Comprá uno y llevá otro gratis en productos seleccionados.", badge: "2x1", color: "from-[#2E1065] to-[#4C1D95]" },
    { title: "Delivery sin costo", desc: "Recibí tus medicamentos en tu domicilio sin cargo adicional.", badge: "GRATIS", color: "from-[#4C1D95] to-[#2E1065]" },
];

interface Farmacia {
    id: number;
    nombre: string;
    direccion: string;
    zona: string;
    horario: string;
    descuento: string;
    tipo: "cronicos" | "materno" | "general";
    rating: number;
}

const farmacias: Farmacia[] = [
    { id: 1, nombre: "Farmacia del Pueblo", direccion: "Av. Rivadavia 4521", zona: "Caballito", horario: "Lun-Sáb 8:00-21:00", descuento: "50% crónicos", tipo: "cronicos", rating: 4.8 },
    { id: 2, nombre: "FarmaSalud Central", direccion: "Av. Corrientes 3210", zona: "Almagro", horario: "Lun-Dom 24hs", descuento: "40% materno", tipo: "materno", rating: 4.9 },
    { id: 3, nombre: "Farmacia San Martín", direccion: "Calle San Martín 890", zona: "Microcentro", horario: "Lun-Vie 8:00-20:00", descuento: "30% general", tipo: "general", rating: 4.5 },
    { id: 4, nombre: "Farmacia del Sol", direccion: "Av. Santa Fe 2100", zona: "Recoleta", horario: "Lun-Sáb 9:00-22:00", descuento: "50% crónicos", tipo: "cronicos", rating: 4.7 },
    { id: 5, nombre: "Farmacia Vital", direccion: "Av. Cabildo 1560", zona: "Belgrano", horario: "Lun-Dom 24hs", descuento: "40% materno", tipo: "materno", rating: 4.6 },
    { id: 6, nombre: "Farmacia Bienestar", direccion: "Av. Libertador 6200", zona: "Núñez", horario: "Lun-Sáb 8:30-21:00", descuento: "30% general", tipo: "general", rating: 4.4 },
    { id: 7, nombre: "Farmacia Esperanza", direccion: "Av. Callao 1250", zona: "Recoleta", horario: "Lun-Vie 8:00-20:30", descuento: "50% crónicos", tipo: "cronicos", rating: 4.8 },
    { id: 8, nombre: "Farmacia Popular", direccion: "Av. La Plata 1100", zona: "Boedo", horario: "Lun-Sáb 8:00-20:00", descuento: "30% general", tipo: "general", rating: 4.5 },
];

/* ══════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════ */

export default function DescuentosFarmaciasContent() {
    const [selectedPlan, setSelectedPlan] = useState("Seleccionar plan");
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [tipoDescuento, setTipoDescuento] = useState("todos");
    const [selectedFarmacia, setSelectedFarmacia] = useState<Farmacia | null>(null);

    const filteredFarmacias = useMemo(() => {
        return farmacias.filter((f) => {
            const matchZona = searchTerm === "" || f.zona.toLowerCase().includes(searchTerm.toLowerCase()) || f.direccion.toLowerCase().includes(searchTerm.toLowerCase()) || f.nombre.toLowerCase().includes(searchTerm.toLowerCase());
            const matchTipo = tipoDescuento === "todos" || f.tipo === tipoDescuento;
            return matchZona && matchTipo;
        });
    }, [searchTerm, tipoDescuento]);

    const nextSlide = () => setCarouselIndex((i) => (i + 1) % carouselSlides.length);
    const prevSlide = () => setCarouselIndex((i) => (i - 1 + carouselSlides.length) % carouselSlides.length);

    return (
        <>
            {/* ═══════════════════════════════════════════
          1) HERO — 2 COLUMNAS
          ═══════════════════════════════════════════ */}
            <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-[#1e0b4b]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[150px] pointer-events-none bg-[#4C1D95]/30" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left — Text */}
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-[#a78bfa] text-[11px] font-bold uppercase tracking-wider mb-6">
                                <Sparkles size={12} /> Farmacias Adheridas
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                                Descuentos en<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] to-white">Farmacias</span>
                            </h1>

                            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
                                Accedé a beneficios exclusivos según tu plan y encontrá farmacias adheridas en tu zona.
                            </p>

                            {/* Plan Selector */}
                            <div className="relative inline-block">
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                                <select
                                    value={selectedPlan}
                                    onChange={(e) => setSelectedPlan(e.target.value)}
                                    className="appearance-none pl-5 pr-12 py-4 rounded-2xl bg-white/10 border border-white/15 text-white font-bold text-base backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#a78bfa]/40 cursor-pointer hover:bg-white/15 transition-all min-w-[220px]"
                                    aria-label="Seleccionar plan"
                                >
                                    <option value="Seleccionar plan" className="text-slate-900">Seleccionar plan</option>
                                    <option value="Personal" className="text-slate-900">Personal</option>
                                    <option value="Familiar" className="text-slate-900">Familiar</option>
                                    <option value="Corporativo" className="text-slate-900">Corporativo</option>
                                </select>
                            </div>
                        </motion.div>

                        {/* Right — App Screenshot Placeholder */}
                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                            <div className="relative">
                                <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-3 shadow-2xl shadow-black/20 backdrop-blur-sm">
                                    <div className="bg-[#0f0525] rounded-2xl aspect-[9/16] max-h-[520px] flex items-center justify-center relative overflow-hidden">
                                        {/* Screen mockup */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-[#4C1D95]/20 to-transparent" />
                                        <div className="relative z-10 text-center p-8">
                                            <div className="w-16 h-16 mx-auto bg-[#4C1D95] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#4C1D95]/30">
                                                <Smartphone size={32} className="text-white" />
                                            </div>
                                            <p className="text-white/80 font-bold text-lg mb-2">CelDoctor App</p>
                                            <p className="text-white/40 text-sm">Captura de pantalla</p>
                                            <p className="text-white/30 text-xs mt-1">Placeholder</p>
                                        </div>
                                        {/* Decorative UI elements */}
                                        <div className="absolute top-4 left-4 right-4 h-6 bg-white/5 rounded-full" />
                                        <div className="absolute bottom-6 left-6 right-6 space-y-2">
                                            <div className="h-10 bg-white/5 rounded-xl" />
                                            <div className="h-10 bg-white/5 rounded-xl" />
                                            <div className="h-10 bg-[#4C1D95]/30 rounded-xl" />
                                        </div>
                                    </div>
                                </div>
                                {/* Glow */}
                                <div className="absolute -inset-4 bg-[#4C1D95]/10 rounded-[2rem] blur-2xl -z-10" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          2) FILA DE BENEFICIOS — 4 TARJETAS
          ═══════════════════════════════════════════ */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {benefitsCards.map((card, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-6 lg:p-8 rounded-3xl border border-slate-100 bg-white hover:border-[#4C1D95]/20 hover:shadow-2xl hover:shadow-[#4C1D95]/10 transition-all text-center cursor-default relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[#4C1D95] to-[#7C3AED] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500" />
                                <div className="relative z-10">
                                    <p className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] mb-2">
                                        {card.value}
                                    </p>
                                    <h3 className="text-base font-bold text-slate-900 mb-1">{card.desc}</h3>
                                    <p className="text-xs text-slate-400">{card.sub}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          3) SECCIÓN INTERMEDIA — APP + QR | TEXTO
          ═══════════════════════════════════════════ */}
            <section className="py-16 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Right — Text (first on mobile) */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-1 lg:order-2"
                        >
                            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                                Tus descuentos, siempre a mano
                            </h2>
                            <p className="text-slate-500 leading-relaxed mb-6">
                                Desde la app de CelDoctor accedés en segundos a todos tus beneficios farmacéuticos. Escaneá tu código QR en cualquier farmacia adherida y el descuento se aplica automáticamente.
                            </p>
                            <ul className="space-y-3 mb-8">
                                {[
                                    "Código QR personal vinculado a tu plan",
                                    "Descuentos aplicados en tiempo real",
                                    "Historial de compras farmacéuticas",
                                    "Alertas de ofertas en tu zona",
                                    "Delivery a domicilio desde la app",
                                ].map((bullet, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-600">
                                        <CheckCircle2 size={18} className="text-[#4C1D95] mt-0.5 shrink-0" />
                                        <span className="font-medium text-sm">{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="#buscador"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#4C1D95]/20 text-[#4C1D95] font-bold text-sm hover:bg-[#4C1D95] hover:text-white hover:shadow-lg hover:shadow-[#4C1D95]/20 transition-all"
                            >
                                <Search size={16} />
                                Ver farmacias adheridas
                            </a>
                        </motion.div>

                        {/* Left — App + QR */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-2 lg:order-1"
                        >
                            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
                                {/* App Screenshot */}
                                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-3 w-56">
                                    <div className="bg-slate-50 rounded-2xl aspect-[9/16] flex items-center justify-center relative overflow-hidden">
                                        <div className="text-center p-4">
                                            <div className="w-12 h-12 mx-auto bg-[#4C1D95]/10 rounded-xl flex items-center justify-center mb-3">
                                                <Smartphone size={24} className="text-[#4C1D95]" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-600">App CelDoctor</p>
                                            <p className="text-xs text-slate-400 mt-1">Screenshot Placeholder</p>
                                        </div>
                                        <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
                                            <div className="h-8 bg-[#4C1D95]/5 rounded-lg" />
                                            <div className="h-8 bg-[#4C1D95]/5 rounded-lg" />
                                            <div className="h-8 bg-[#4C1D95]/10 rounded-lg" />
                                        </div>
                                    </div>
                                </div>

                                {/* QR Code */}
                                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 flex flex-col items-center">
                                    <div className="w-32 h-32 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center mb-3">
                                        <QrCode size={56} className="text-[#4C1D95]/30" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Escaneá tu QR</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Placeholder</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          4) CARRUSEL FULL WIDTH
          ═══════════════════════════════════════════ */}
            <section className="py-16 bg-gradient-to-br from-[#4C1D95] via-[#3b1675] to-[#2E1065] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#7C3AED]/20 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-white mb-2">Ofertas destacadas</h2>
                        <p className="text-white/60">Descuentos rotativos exclusivos para miembros CelDoctor.</p>
                    </div>

                    {/* Carousel */}
                    <div className="relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={carouselIndex}
                                initial={{ opacity: 0, x: 60 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -60 }}
                                transition={{ duration: 0.35 }}
                                className={`bg-gradient-to-br ${carouselSlides[carouselIndex].color} rounded-3xl p-10 lg:p-14 text-center border border-white/10 relative overflow-hidden`}
                            >
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                                <div className="relative z-10">
                                    <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-white text-sm font-bold mb-5 backdrop-blur-sm border border-white/10">
                                        {carouselSlides[carouselIndex].badge}
                                    </span>
                                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">{carouselSlides[carouselIndex].title}</h3>
                                    <p className="text-white/80 text-lg max-w-lg mx-auto">{carouselSlides[carouselIndex].desc}</p>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <button onClick={prevSlide} className="w-10 h-10 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center hover:bg-white/20 transition-all" aria-label="Anterior">
                                <ChevronLeft size={18} />
                            </button>
                            <div className="flex gap-2">
                                {carouselSlides.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCarouselIndex(i)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all ${i === carouselIndex ? "bg-white w-8" : "bg-white/30 hover:bg-white/50"}`}
                                        aria-label={`Slide ${i + 1}`}
                                    />
                                ))}
                            </div>
                            <button onClick={nextSlide} className="w-10 h-10 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center hover:bg-white/20 transition-all" aria-label="Siguiente">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          5) BUSCADOR + RESULTADOS + MAPA ARGENTINA
          ═══════════════════════════════════════════ */}
            <section id="buscador" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header + Search */}
                    <div className="text-center mb-10">
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Buscador de farmacias</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">Encontrá la farmacia adherida más cercana a tu ubicación.</p>
                    </div>

                    <div className="max-w-3xl mx-auto mb-12">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100/80 p-3 flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 relative">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Ingresá tu zona / ciudad"
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20 focus:border-[#4C1D95]/30 transition-all"
                                    aria-label="Buscar farmacias por zona"
                                />
                            </div>
                            <div className="relative sm:w-48">
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <select
                                    value={tipoDescuento}
                                    onChange={(e) => setTipoDescuento(e.target.value)}
                                    className="w-full appearance-none pl-4 pr-10 py-3.5 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20 focus:border-[#4C1D95]/30 transition-all cursor-pointer"
                                    aria-label="Tipo de descuento"
                                >
                                    <option value="todos">Todos</option>
                                    <option value="cronicos">Crónicos</option>
                                    <option value="materno">Materno</option>
                                    <option value="general">General</option>
                                </select>
                            </div>
                            <button className="px-8 py-3.5 bg-[#4C1D95] text-white rounded-xl font-bold text-sm hover:bg-[#3b1675] transition-all shadow-lg shadow-[#4C1D95]/20 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 shrink-0">
                                <Search size={16} /> Buscar
                            </button>
                        </div>
                        <p className="text-center text-sm text-slate-400 mt-3">{filteredFarmacias.length} farmacia{filteredFarmacias.length !== 1 ? "s" : ""} encontrada{filteredFarmacias.length !== 1 ? "s" : ""}</p>
                    </div>

                    {/* Results + Map */}
                    <div className="grid lg:grid-cols-5 gap-8">
                        {/* Left — Pharmacy List */}
                        <div className="lg:col-span-3 space-y-4 max-h-[650px] overflow-y-auto pr-2">
                            <AnimatePresence mode="popLayout">
                                {filteredFarmacias.length === 0 ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                                        <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                            <Search size={32} className="text-slate-300" />
                                        </div>
                                        <p className="text-slate-400 font-medium">No se encontraron farmacias.</p>
                                    </motion.div>
                                ) : (
                                    filteredFarmacias.map((f) => (
                                        <motion.div
                                            key={f.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className={`p-6 rounded-2xl border transition-all cursor-pointer group ${selectedFarmacia?.id === f.id
                                                    ? "border-[#4C1D95]/30 bg-[#4C1D95]/[0.02] shadow-lg shadow-[#4C1D95]/5"
                                                    : "border-slate-100 bg-white hover:border-[#4C1D95]/15 hover:shadow-md"
                                                }`}
                                            onClick={() => setSelectedFarmacia(f)}
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-3 mb-2">
                                                        <h3 className="text-lg font-bold text-slate-900">{f.nombre}</h3>
                                                        <div className="flex items-center gap-1 shrink-0">
                                                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                                            <span className="text-sm font-semibold text-slate-700">{f.rating}</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5 mb-4">
                                                        <p className="flex items-center gap-2 text-sm text-slate-500">
                                                            <MapPin size={14} className="shrink-0 text-slate-400" /> {f.direccion}, {f.zona}
                                                        </p>
                                                        <p className="flex items-center gap-2 text-sm text-slate-500">
                                                            <Clock size={14} className="shrink-0 text-slate-400" /> {f.horario}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#4C1D95]/5 text-[#4C1D95] text-xs font-bold border border-[#4C1D95]/10">
                                                            <Percent size={12} /> {f.descuento}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 text-slate-500 text-xs font-medium border border-slate-100">
                                                            <MapPin size={12} /> {f.zona}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedFarmacia(f); }}
                                                    className="sm:self-center px-4 py-2.5 rounded-xl border border-[#4C1D95]/20 text-[#4C1D95] text-sm font-bold hover:bg-[#4C1D95] hover:text-white hover:shadow-lg hover:shadow-[#4C1D95]/20 transition-all shrink-0"
                                                >
                                                    <span className="flex items-center gap-1.5"><Navigation size={14} /> Ver en mapa</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Right — Mapa Argentina */}
                        <div className="lg:col-span-2">
                            <div className="sticky top-24 rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 h-[450px] lg:h-[650px] relative shadow-xl shadow-slate-100/50">
                                {/* Background decoration */}
                                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #4C1D95 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute top-[20%] left-0 right-0 h-px bg-[#4C1D95]" />
                                    <div className="absolute top-[40%] left-0 right-0 h-px bg-[#4C1D95]" />
                                    <div className="absolute top-[60%] left-0 right-0 h-px bg-[#4C1D95]" />
                                    <div className="absolute top-[80%] left-0 right-0 h-px bg-[#4C1D95]" />
                                    <div className="absolute left-[25%] top-0 bottom-0 w-px bg-[#4C1D95]" />
                                    <div className="absolute left-[50%] top-0 bottom-0 w-px bg-[#4C1D95]" />
                                    <div className="absolute left-[75%] top-0 bottom-0 w-px bg-[#4C1D95]" />
                                </div>

                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50/50 pointer-events-none z-[1]" />

                                {/* Center content */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10">
                                    {selectedFarmacia ? (
                                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                                            <div className="w-16 h-16 mx-auto bg-[#4C1D95] rounded-full flex items-center justify-center shadow-xl shadow-[#4C1D95]/30 mb-4">
                                                <MapPin size={28} className="text-white" />
                                            </div>
                                            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-xs">
                                                <h4 className="text-lg font-bold text-slate-900 mb-1">{selectedFarmacia.nombre}</h4>
                                                <p className="text-sm text-slate-500 mb-1">{selectedFarmacia.direccion}</p>
                                                <p className="text-sm text-slate-400 mb-3">{selectedFarmacia.zona} · {selectedFarmacia.horario}</p>
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4C1D95] text-white text-xs font-bold">
                                                    <Percent size={12} /> {selectedFarmacia.descuento}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-4">Mapa de Argentina · Próximamente</p>
                                        </motion.div>
                                    ) : (
                                        <div className="text-center">
                                            <div className="w-24 h-24 mx-auto bg-[#4C1D95]/10 rounded-full flex items-center justify-center mb-4">
                                                <MapPin size={44} className="text-[#4C1D95]/30" />
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-400 mb-2">Mapa de Argentina</h4>
                                            <p className="text-sm text-slate-300 max-w-xs mx-auto">Seleccioná una farmacia del listado para ver su ubicación.</p>
                                            <p className="text-xs text-slate-300/70 mt-6">Mapa interactivo próximamente</p>
                                        </div>
                                    )}
                                </div>

                                {/* Animated pins */}
                                {!selectedFarmacia && (
                                    <>
                                        <div className="absolute top-[15%] left-[20%] w-3 h-3 rounded-full bg-[#4C1D95]/20 animate-pulse" />
                                        <div className="absolute top-[35%] right-[30%] w-3 h-3 rounded-full bg-[#7C3AED]/20 animate-pulse" style={{ animationDelay: "0.5s" }} />
                                        <div className="absolute bottom-[25%] left-[40%] w-3 h-3 rounded-full bg-[#4C1D95]/20 animate-pulse" style={{ animationDelay: "1s" }} />
                                        <div className="absolute top-[60%] right-[15%] w-3 h-3 rounded-full bg-[#7C3AED]/20 animate-pulse" style={{ animationDelay: "1.5s" }} />
                                        <div className="absolute bottom-[40%] left-[15%] w-3 h-3 rounded-full bg-[#4C1D95]/15 animate-pulse" style={{ animationDelay: "2s" }} />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
