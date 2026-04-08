"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FaqItem {
    question: string;
    answer: string;
    category: string;
}

const CATEGORIAS = [
    "Planes y precios",
    "Consultas médicas",
    "Pagos y facturación",
    "Cuenta y acceso",
    "Técnico",
] as const;

const FAQ_ITEMS: FaqItem[] = [
    { category: "Planes y precios", question: "¿Puedo cambiar de plan en cualquier momento?", answer: "Sí. Podés pasar a otra alternativa según tu suscripción y tus necesidades actuales." },
    { category: "Planes y precios", question: "¿CelDoctor reemplaza a mi obra social?", answer: "No. CelDoctor funciona como un servicio complementario de salud digital." },
    { category: "Planes y precios", question: "¿Hay período de prueba?", answer: "Estamos trabajando con condiciones especiales de lanzamiento para nuevos usuarios y empresas." },
    { category: "Planes y precios", question: "¿Cuántas personas puedo tener en el plan familiar?", answer: "El plan familiar contempla hasta 4 personas en total, incluyendo al titular." },
    { category: "Planes y precios", question: "¿El plan empresarial tiene precio fijo?", answer: "No. El valor se define según la cantidad de empleados y el alcance del servicio." },

    { category: "Consultas médicas", question: "¿Cuándo puedo consultar?", answer: "Podés acceder al servicio todos los días, según la disponibilidad del equipo médico y del servicio contratado." },
    { category: "Consultas médicas", question: "¿Qué especialidades hay disponibles?", answer: "CelDoctor ofrece acceso a distintas especialidades médicas según el plan y la disponibilidad vigente." },
    { category: "Consultas médicas", question: "¿Los médicos están certificados?", answer: "Sí. Los profesionales son matriculados y forman parte de una red validada por el servicio." },
    { category: "Consultas médicas", question: "¿Puedo obtener recetas digitales?", answer: "Sí. Las recetas digitales se gestionan dentro del circuito médico correspondiente." },
    { category: "Consultas médicas", question: "¿Cómo me conecto con el médico?", answer: "El acceso se realiza desde la plataforma y, cuando corresponda, a través de la integración disponible." },

    { category: "Pagos y facturación", question: "¿Cómo se cobra la suscripción?", answer: "La suscripción se procesa desde la pasarela de pago configurada para tu cuenta." },
    { category: "Pagos y facturación", question: "¿Puedo cancelar cuando quiera?", answer: "Sí. Podés gestionar la baja desde tu panel o solicitarla mediante soporte." },
    { category: "Pagos y facturación", question: "¿Emiten factura?", answer: "Sí. Por eso pedimos tus datos de facturación al crear la cuenta." },
    { category: "Pagos y facturación", question: "¿Puedo aplicar un cupón?", answer: "Cuando haya promociones activas, vas a poder cargar el cupón durante el proceso de contratación." },

    { category: "Cuenta y acceso", question: "¿Cómo creo mi cuenta?", answer: "Completás tus datos personales, fiscales y de domicilio desde el registro y tu cuenta queda lista para contratar un plan." },
    { category: "Cuenta y acceso", question: "¿Olvidé mi contraseña, qué hago?", answer: "Podés recuperarla desde la opción correspondiente en el inicio de sesión." },
    { category: "Cuenta y acceso", question: "¿Puedo usar CelDoctor desde el celular?", answer: "Sí. La plataforma funciona desde dispositivos móviles y computadoras." },
    { category: "Cuenta y acceso", question: "¿Mis datos están protegidos?", answer: "Sí. CelDoctor gestiona la información bajo criterios de privacidad y resguardo de datos." },

    { category: "Técnico", question: "¿Necesito descargar alguna app?", answer: "No necesariamente. Gran parte de la experiencia se puede usar desde el navegador." },
    { category: "Técnico", question: "¿Qué necesito para usar videollamadas o consultas?", answer: "Una conexión estable a internet y un dispositivo actualizado con navegador moderno." },
    { category: "Técnico", question: "¿Funciona en todos los navegadores?", answer: "Sí, en los navegadores modernos más utilizados y actualizados." },
];

export default function PreguntasFrecuentesPage() {
    const [openKey, setOpenKey] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto max-w-4xl px-6 py-16">
                <div className="mb-14 text-center">
                    <h1 className="mb-2 text-4xl font-bold text-slate-900">Centro de ayuda</h1>
                    <p className="text-slate-500">
                        Respuestas ordenadas por temática para entender cómo funciona CelDoctor.
                    </p>
                </div>

                <div className="space-y-10">
                    {CATEGORIAS.map((categoria) => {
                        const items = FAQ_ITEMS.filter((item) => item.category === categoria);

                        return (
                            <section
                                key={categoria}
                                className="overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-sm shadow-slate-200/60"
                            >
                                <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-5">
                                    <h2 className="text-lg font-bold text-slate-900">{categoria}</h2>
                                </div>

                                <div className="divide-y divide-slate-100">
                                    {items.map((item, index) => {
                                        const itemKey = `${categoria}-${index}`;
                                        const isOpen = openKey === itemKey;

                                        return (
                                            <div key={itemKey}>
                                                <button
                                                    onClick={() => setOpenKey(isOpen ? null : itemKey)}
                                                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-50"
                                                    aria-expanded={isOpen}
                                                >
                                                    <span className="text-sm font-semibold text-slate-900">
                                                        {item.question}
                                                    </span>
                                                    <ChevronDown
                                                        size={18}
                                                        className={`shrink-0 text-slate-400 transition-transform ${
                                                            isOpen ? "rotate-180 text-[#4C1D95]" : ""
                                                        }`}
                                                    />
                                                </button>

                                                <AnimatePresence initial={false}>
                                                    {isOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <p className="px-6 pb-5 text-sm leading-relaxed text-slate-600">
                                                                {item.answer}
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
