"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Play } from "lucide-react";

// Sub-componentes del teléfono
import PhoneStatusBar from "./interactive-demo/PhoneStatusBar";
import HomeScreen from "./interactive-demo/HomeScreen";
import ChatScreen from "./interactive-demo/ChatScreen";
import VideoScreen from "./interactive-demo/VideoScreen";
import RecetasScreen from "./interactive-demo/RecetasScreen";
import ProfileScreen from "./interactive-demo/ProfileScreen";
import PhoneNavBar from "./interactive-demo/PhoneNavBar";

// ============================================================
// DATOS DEL TOUR
// ============================================================
const tourSteps = [
  {
    id: 0,
    screen: "home",
    title: "Central de Bienestar",
    desc: "Tus empleados ven esto al entrar: opciones claras, sin fricción. Pueden elegir atención inmediata o agendar.",
    benefit: "Experiencia de usuario = Mayor adopción.",
  },
  {
    id: 1,
    screen: "chat",
    title: "Chat Médico IA + Humano",
    desc: "Inician consulta en segundos. Un triaje inteligente los deriva al especialista correcto sin esperas.",
    benefit: "Resolución del 70% de casos en < 15 min.",
  },
  {
    id: 2,
    screen: "video",
    title: "Videoconsulta HD",
    desc: "Para diagnósticos que requieren inspección visual. Calidad estable y segura.",
    benefit: "Consultorio real, pero en el bolsillo.",
  },
  {
    id: 3,
    screen: "recetas",
    title: "Recetas Legales",
    desc: "Historial completo de prescripciones. Descarga en PDF válida para cualquier farmacia.",
    benefit: "Adiós a perder recetas en papel.",
  },
  {
    id: 4,
    screen: "profile",
    title: "Historia Clínica Digital",
    desc: "Datos centralizados y portables. Antecedentes, alergias y registro de todas las atenciones previas.",
    benefit: "Continuidad médica garantizada.",
  },
];

// ============================================================
// COMPONENTE: Pantalla del teléfono según el step actual
// ============================================================
function PhoneScreenRenderer({
  screen,
  callDuration,
  navigatePhone,
}: {
  screen: string;
  callDuration: number;
  navigatePhone: (screen: string) => void;
}) {
  switch (screen) {
    case "home":
      return <HomeScreen navigatePhone={navigatePhone} />;
    case "chat":
      return <ChatScreen navigatePhone={navigatePhone} />;
    case "video":
      return (
        <VideoScreen
          callDuration={callDuration}
          navigatePhone={navigatePhone}
        />
      );
    case "recetas":
      return <RecetasScreen navigatePhone={navigatePhone} />;
    case "profile":
      return <ProfileScreen navigatePhone={navigatePhone} />;
    default:
      return <HomeScreen navigatePhone={navigatePhone} />;
  }
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function InteractiveDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Bloquear scroll cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Contador de duración de videollamada
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (tourSteps[currentStep].screen === "video") {
      interval = setInterval(() => setCallDuration((p) => p + 1), 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentStep]);

  const nextStep = useCallback(() => {
    if (currentStep < tourSteps.length - 1) setCurrentStep((c) => c + 1);
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) setCurrentStep((c) => c - 1);
  }, [currentStep]);

  const navigatePhone = useCallback((screenName: string) => {
    const stepIndex = tourSteps.findIndex((s) => s.screen === screenName);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex);
    }
  }, []);

  // FIX CRÍTICO: El check de `mounted` debe estar ANTES del createPortal
  // para evitar errores de hidratación y referencia a `document` en SSR.
  if (!mounted) return null;

  const currentScreen = tourSteps[currentStep].screen;

  return (
    <>
      {/* Botón que abre el modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="group relative flex items-center gap-3 px-6 py-2.5 rounded-full bg-white border border-slate-200 shadow-sm hover:border-[#7C3AED]/50 hover:shadow-md transition-all active:scale-95"
      >
        <div className="w-8 h-8 rounded-full bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED] group-hover:scale-110 transition-transform">
          <Play size={12} fill="currentColor" />
        </div>
        <div className="text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Demo
          </p>
          <p className="text-sm font-bold text-slate-800 leading-none">
            Ver Tour
          </p>
        </div>
      </button>

      {/* Modal via Portal */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-99999 flex items-center justify-center font-sans">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#06040F] bg-opacity-95 backdrop-blur-xl"
                onClick={() => setIsOpen(false)}
              />

              {/* Contenido */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative z-10 w-full max-w-6xl p-6 flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-32"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Botón cerrar */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-0 right-4 text-white/40 hover:text-white bg-white/5 p-2 rounded-full transition-colors z-50"
                >
                  <X size={24} />
                </button>

                {/* --- PANEL IZQUIERDO (NARRATIVA) --- */}
                <div className="hidden md:block w-full max-w-sm text-left space-y-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/30 text-[#a78bfa] text-[10px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
                    Modo Interactivo
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                        {tourSteps[currentStep].title}
                      </h2>
                      <p className="text-slate-400 text-lg leading-relaxed">
                        {tourSteps[currentStep].desc}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  <div className="p-4 rounded-xl bg-[#7C3AED]/10 border-l-4 border-[#7C3AED]">
                    <p className="text-xs text-[#a78bfa] font-bold uppercase mb-1">
                      Beneficio Clave
                    </p>
                    <p className="text-white text-sm italic">
                      &quot;{tourSteps[currentStep].benefit}&quot;
                    </p>
                  </div>

                  {/* Controles del Tour */}
                  <div className="flex items-center gap-4 pt-4">
                    <button
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/10 disabled:opacity-30 transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <div className="flex gap-2">
                      {tourSteps.map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep
                              ? "w-8 bg-[#7C3AED]"
                              : "w-1.5 bg-white/20"
                            }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={nextStep}
                      disabled={currentStep === tourSteps.length - 1}
                      className="w-10 h-10 rounded-full bg-white text-[#06040F] flex items-center justify-center hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                {/* --- PANEL DERECHO (CELULAR) --- */}
                <div className="relative w-[320px] h-165 bg-black rounded-[3.5rem] shadow-2xl border-8 border-[#1a1a1a] overflow-hidden select-none shrink-0 ring-1 ring-white/10">
                  <PhoneStatusBar />

                  <div className="w-full h-full bg-slate-50 relative flex flex-col pt-14 pb-20 overflow-hidden">
                    <PhoneScreenRenderer
                      screen={currentScreen}
                      callDuration={callDuration}
                      navigatePhone={navigatePhone}
                    />

                    <PhoneNavBar
                      currentScreen={currentScreen}
                      navigatePhone={navigatePhone}
                    />

                    {/* Home Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50 pointer-events-none" />
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}