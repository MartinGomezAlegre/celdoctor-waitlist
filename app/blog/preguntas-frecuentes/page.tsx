"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import type { Metadata } from "next";

// Note: metadata must be in a server component; using a wrapper layout or
// the page is client-only so we declare it inline as a constant for reference.
// The page title is set via the parent layout template.

interface FaqItem {
    question: string;
    answer: string;
    category: string;
}

const CATEGORIAS = ["Todas", "Planes y precios", "Consultas médicas", "Pagos y facturación", "Cuenta y acceso", "Técnico"] as const;

const FAQ_ITEMS: FaqItem[] = [
    // Planes y precios
    { category: "Planes y precios", question: "¿Puedo cambiar de plan en cualquier momento?", answer: "Sí. Podés hacer upgrade o downgrade sin penalidades ni períodos de carencia." },
    { category: "Planes y precios", question: "¿CelDoctor reemplaza a mi obra social?", answer: "No. Es un servicio complementario a tu cobertura de salud existente." },
    { category: "Planes y precios", question: "¿Hay período de prueba?", answer: "Estamos preparando ofertas especiales de lanzamiento para nuestros primeros usuarios." },
    { category: "Planes y precios", question: "¿Cuántos integrantes puedo agregar al plan familiar?", answer: "Hasta 5 integrantes en el plan familiar." },
    { category: "Planes y precios", question: "¿El plan empresarial tiene precio fijo?", answer: "El plan corporativo tiene precio a medida según la cantidad de empleados. Contactanos para una cotización." },

    // Consultas médicas
    { category: "Consultas médicas", question: "¿Cuándo puedo consultar?", answer: "Las 24 horas, los 7 días de la semana, incluyendo feriados." },
    { category: "Consultas médicas", question: "¿Qué especialidades hay disponibles?", answer: "Medicina general, pediatría, nutrición, psicología y más." },
    { category: "Consultas médicas", question: "¿Los médicos están certificados?", answer: "Todos están matriculados y pasan por un proceso de selección riguroso." },
    { category: "Consultas médicas", question: "¿Puedo obtener recetas digitales?", answer: "Sí. Las recetas son válidas en todas las farmacias de Argentina." },
    { category: "Consultas médicas", question: "¿Funciona en todo el país?", answer: "Sí. En Argentina, Uruguay y Paraguay con conexión a internet." },
    { category: "Consultas médicas", question: "¿Cómo me conecto con el médico?", answer: "Por videollamada o chat desde la app, sin descargar nada extra." },

    // Pagos y facturación
    { category: "Pagos y facturación", question: "¿Cómo se cobra la suscripción?", answer: "Se cobra mensualmente de forma automática." },
    { category: "Pagos y facturación", question: "¿Puedo cancelar cuando quiera?", answer: "Sí, podés cancelar en cualquier momento sin penalidades." },
    { category: "Pagos y facturación", question: "¿Emiten factura?", answer: "Sí. Emitimos factura A y B según corresponda." },
    { category: "Pagos y facturación", question: "¿Qué medios de pago aceptan?", answer: "Tarjeta de crédito, débito y transferencia bancaria." },

    // Cuenta y acceso
    { category: "Cuenta y acceso", question: "¿Cómo creo mi cuenta?", answer: "Entrá a /registro, completá tus datos y listo. Solo lleva un minuto." },
    { category: "Cuenta y acceso", question: "¿Olvidé mi contraseña, qué hago?", answer: "Usá la opción \"¿Olvidaste tu contraseña?\" en el login." },
    { category: "Cuenta y acceso", question: "¿Puedo usar CelDoctor desde el celular?", answer: "Sí. Funciona desde cualquier dispositivo con navegador." },
    { category: "Cuenta y acceso", question: "¿Mis datos médicos están protegidos?", answer: "Sí. Cumplimos con la Ley 25.326 de protección de datos personales." },

    // Técnico
    { category: "Técnico", question: "¿Necesito descargar alguna app?", answer: "No. Funciona directo desde el navegador sin instalaciones." },
    { category: "Técnico", question: "¿Qué velocidad de internet necesito?", answer: "Una conexión estándar de 5 Mbps es suficiente para videollamadas." },
    { category: "Técnico", question: "¿Funciona en todos los navegadores?", answer: "Sí. Chrome, Firefox, Safari y Edge en sus versiones recientes." },
];

export default function PreguntasFrecuentesPage() {
    const [query, setQuery] = useState("");
    const [categoria, setCategoria] = useState<string>("Todas");
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const filtered = useMemo(() => {
        const q = query.toLowerCase();
        return FAQ_ITEMS.filter((item) => {
            const matchCat = categoria === "Todas" || item.category === categoria;
            const matchQ = q === "" || item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
            return matchCat && matchQ;
        });
    }, [query, categoria]);

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-3xl mx-auto px-6 py-16">
                {/* Title */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Centro de ayuda</h1>
                    <p className="text-slate-500">Respuestas rápidas a tus dudas sobre CelDoctor.</p>
                </div>

                {/* Search */}
                <div className="relative mb-8">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setOpenIndex(null); }}
                        placeholder="¿En qué podemos ayudarte?"
                        className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-200 text-slate-900 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] transition-colors shadow-sm"
                        aria-label="Buscar preguntas"
                    />
                </div>

                {/* Category pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {CATEGORIAS.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => { setCategoria(cat); setOpenIndex(null); }}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                categoria === cat
                                    ? "bg-[#4C1D95] text-white shadow-lg shadow-[#4C1D95]/20"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Counter */}
                <p className="text-sm text-slate-400 mb-6 font-medium">
                    {filtered.length} {filtered.length === 1 ? "pregunta encontrada" : "preguntas encontradas"}
                </p>

                {/* Accordion */}
                {filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-slate-400 font-medium">No encontramos resultados para &ldquo;{query}&rdquo;.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((item, i) => (
                            <div key={i} className="rounded-2xl border border-slate-100 overflow-hidden">
                                <button
                                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                    className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                                    aria-expanded={openIndex === i}
                                >
                                    <div className="pr-4">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#4C1D95] block mb-0.5">{item.category}</span>
                                        <span className="text-sm font-bold text-slate-900">{item.question}</span>
                                    </div>
                                    <ChevronDown
                                        size={16}
                                        className={`text-slate-400 shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {openIndex === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="px-5 pb-5 text-sm text-slate-500 leading-relaxed">{item.answer}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
