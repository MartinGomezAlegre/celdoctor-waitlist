"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, ChevronRight, ChevronLeft, Play, Send, 
  Wifi, Battery, Signal, 
  Home, MessageSquare, User, Video, FileText, PhoneOff, Mic, Video as VideoIcon, Download,
  ClipboardList, AlertCircle, Calendar, ShieldCheck
} from "lucide-react";

export default function InteractiveDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // CONTROL DEL TOUR
  const [currentStep, setCurrentStep] = useState(0);
  
  // ESTADOS INTERNOS DE LA APP
  const [callDuration, setCallDuration] = useState(0);

  // DATOS DEL TOUR
  const tourSteps = [
    {
      id: 0,
      screen: "home",
      title: "Central de Bienestar",
      desc: "Tus empleados ven esto al entrar: opciones claras, sin fricción. Pueden elegir atención inmediata o agendar.",
      benefit: "Experiencia de usuario = Mayor adopción."
    },
    {
      id: 1,
      screen: "chat",
      title: "Chat Médico IA + Humano",
      desc: "Inician consulta en segundos. Un triaje inteligente los deriva al especialista correcto sin esperas.",
      benefit: "Resolución del 70% de casos en < 15 min."
    },
    {
      id: 2,
      screen: "video",
      title: "Videoconsulta HD",
      desc: "Para diagnósticos que requieren inspección visual. Calidad estable y segura.",
      benefit: "Consultorio real, pero en el bolsillo."
    },
    {
      id: 3,
      screen: "recetas",
      title: "Recetas Legales",
      desc: "Historial completo de prescripciones. Descarga en PDF válida para cualquier farmacia.",
      benefit: "Adiós a perder recetas en papel."
    },
    {
      id: 4, // NUEVO PASO
      screen: "profile",
      title: "Historia Clínica Digital",
      desc: "Datos centralizados y portables. Antecedentes, alergias y registro de todas las atenciones previas.",
      benefit: "Continuidad médica garantizada."
    }
  ];

  useEffect(() => { setMounted(true); }, []);
  
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  // CONTADOR DE LLAMADA
  useEffect(() => {
    let interval: any;
    if (tourSteps[currentStep].screen === "video") {
      interval = setInterval(() => setCallDuration(p => p + 1), 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [currentStep]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) setCurrentStep(c => c + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(c => c - 1);
  };

  const navigatePhone = (screenName: string) => {
    const stepIndex = tourSteps.findIndex(s => s.screen === screenName);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center font-sans">
          
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#06040F] bg-opacity-95 backdrop-blur-xl"
            onClick={() => setIsOpen(false)}
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 w-full max-w-6xl p-6 flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-32"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setIsOpen(false)} className="absolute top-0 right-4 text-white/40 hover:text-white bg-white/5 p-2 rounded-full transition-colors z-50">
              <X size={24} />
            </button>

            {/* --- PANEL IZQUIERDO (NARRATIVA) --- */}
            <div className="hidden md:block w-full max-w-sm text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/30 text-[#a78bfa] text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse"/>
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
                <p className="text-xs text-[#a78bfa] font-bold uppercase mb-1">Beneficio Clave</p>
                <p className="text-white text-sm italic">"{tourSteps[currentStep].benefit}"</p>
              </div>

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
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? "w-8 bg-[#7C3AED]" : "w-1.5 bg-white/20"}`} />
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
            <div className="relative w-[320px] h-[660px] bg-black rounded-[3.5rem] shadow-2xl border-[8px] border-[#1a1a1a] overflow-hidden select-none shrink-0 ring-1 ring-white/10">
              
              <div className="absolute top-0 inset-x-0 h-14 z-30 flex justify-between items-end px-7 pb-2 text-white text-[12px] font-medium pointer-events-none">
                <span>9:41</span>
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[90px] h-[26px] bg-black rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1c1c1e] ml-auto mr-3"/>
                </div>
                <div className="flex gap-1.5 items-center">
                  <Signal size={14} />
                  <Wifi size={14} />
                  <Battery size={14} />
                </div>
              </div>

              <div className="w-full h-full bg-slate-50 relative flex flex-col pt-14 pb-20 overflow-hidden">

                {/* --- PANTALLA: HOME --- */}
                {tourSteps[currentStep].screen === "home" && (
                  <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex-1 overflow-y-auto px-5 pt-2 no-scrollbar">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Plan Corporativo</p>
                        <h3 className="text-xl font-bold text-slate-900">Hola, Lucas 👋</h3>
                      </div>
                      <div onClick={() => navigatePhone('profile')} className="w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm cursor-pointer">
                        <User size={18} className="text-slate-400"/>
                      </div>
                    </div>

                    <div onClick={() => navigatePhone('chat')} className="bg-[#7C3AED] rounded-[1.5rem] p-5 text-white shadow-lg shadow-[#7C3AED]/30 mb-6 relative overflow-hidden cursor-pointer active:scale-95 transition-transform">
                       <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl"/>
                       <p className="text-[10px] font-bold bg-white/20 w-fit px-2 py-0.5 rounded text-white mb-2">Atención Inmediata</p>
                       <h4 className="text-xl font-bold mb-4 leading-tight">¿Qué necesitás consultar<br/>hoy?</h4>
                       <button className="bg-white text-[#7C3AED] w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                         <MessageSquare size={16} /> Iniciar Chat Médico
                       </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                       <div onClick={() => navigatePhone('video')} className="bg-[#1e293b] p-4 rounded-2xl text-white flex flex-col gap-2 cursor-pointer active:scale-95 transition-transform">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><Video size={16}/></div>
                          <div>
                            <p className="text-xs font-bold">Videollamada</p>
                            <p className="text-[10px] text-slate-400">Turnos programados</p>
                          </div>
                       </div>
                       <div onClick={() => navigatePhone('recetas')} className="bg-[#1e293b] p-4 rounded-2xl text-white flex flex-col gap-2 cursor-pointer active:scale-95 transition-transform">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><FileText size={16}/></div>
                          <div>
                            <p className="text-xs font-bold">Recetas</p>
                            <p className="text-[10px] text-slate-400">Historial y vigentes</p>
                          </div>
                       </div>
                    </div>

                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Especialidades</h5>
                    <div className="space-y-2">
                      {['Clínica Médica', 'Pediatría', 'Nutrición', 'Psicología'].map((s,i) => (
                        <div key={i} className="bg-[#1e293b] p-3 rounded-xl border border-white/5 flex justify-between items-center text-white cursor-pointer hover:bg-[#283547]">
                           <span className="text-xs font-medium">{s}</span>
                           <ChevronRight size={14} className="text-slate-500"/>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* --- PANTALLA: CHAT --- */}
                {tourSteps[currentStep].screen === "chat" && (
                  <motion.div initial={{x: 20, opacity:0}} animate={{x: 0, opacity:1}} className="flex-1 flex flex-col bg-[#f0f2f5]">
                    <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center gap-3 shadow-sm z-10">
                       <button onClick={() => navigatePhone('home')}><ChevronLeft size={20} className="text-slate-500"/></button>
                       <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">Dr</div>
                       <div>
                          <p className="text-xs font-bold text-slate-900">Dr. Martínez</p>
                          <p className="text-[10px] text-green-500 font-bold">● En línea</p>
                       </div>
                    </div>
                    <div className="flex-1 p-4 space-y-3">
                       <div className="flex justify-end"><div className="bg-[#7C3AED] text-white p-3 rounded-2xl rounded-tr-none text-xs max-w-[85%]">Hola, tengo fiebre y dolor de garganta.</div></div>
                       <div className="flex justify-start"><div className="bg-white text-slate-700 border border-slate-200 p-3 rounded-2xl rounded-tl-none text-xs max-w-[85%] shadow-sm">Entiendo. ¿Tenés placas en la garganta o dificultad para tragar?</div></div>
                       <div className="flex justify-end"><div className="bg-[#7C3AED] text-white p-3 rounded-2xl rounded-tr-none text-xs max-w-[85%]">Solo molestia al tragar.</div></div>
                       <div className="flex justify-start"><div className="bg-white text-slate-700 border border-slate-200 p-3 rounded-2xl rounded-tl-none text-xs max-w-[85%] shadow-sm">Bien, vamos a indicarte ibuprofeno 600mg cada 8hs. Te envío la receta ahora.</div></div>
                    </div>
                    <div className="bg-white p-3 border-t border-slate-200">
                      <div className="h-10 bg-slate-100 rounded-full flex items-center px-4 text-slate-400 text-xs justify-between">
                        <span>Escribir mensaje...</span><Send size={14}/>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* --- PANTALLA: VIDEO --- */}
                {tourSteps[currentStep].screen === "video" && (
                  <motion.div initial={{scale: 0.9, opacity:0}} animate={{scale: 1, opacity:1}} className="flex-1 bg-slate-900 relative flex flex-col">
                     <div className="absolute inset-0 bg-gradient-to-b from-slate-700 to-slate-900 flex items-center justify-center">
                        <User size={80} className="text-slate-600 opacity-20"/>
                     </div>
                     <div className="relative z-10 flex-1 flex flex-col justify-between p-6">
                        <div className="flex justify-between items-start pt-2">
                           <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"/>
                              {formatTime(callDuration)}
                           </div>
                           <div className="w-24 h-32 bg-black/50 rounded-xl border border-white/10 shadow-lg"/>
                        </div>
                        <div className="flex flex-col items-center gap-6 pb-4">
                           <div className="text-center">
                              <h3 className="text-white font-bold text-lg">Dr. Martínez</h3>
                              <p className="text-white/60 text-xs">Clínica Médica</p>
                           </div>
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white"><Mic size={20}/></div>
                              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white"><VideoIcon size={20}/></div>
                              <div onClick={() => navigatePhone('home')} className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center text-white cursor-pointer hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"><PhoneOff size={24} fill="currentColor"/></div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                )}

                {/* --- PANTALLA: RECETAS --- */}
                {tourSteps[currentStep].screen === "recetas" && (
                  <motion.div initial={{y: 20, opacity:0}} animate={{y: 0, opacity:1}} className="flex-1 bg-slate-50 px-5 pt-4">
                     <div className="flex items-center gap-3 mb-6">
                        <button onClick={() => navigatePhone('home')}><ChevronLeft size={20} className="text-slate-500"/></button>
                        <h3 className="text-lg font-bold text-slate-900">Mis Recetas</h3>
                     </div>
                     
                     <div className="space-y-3">
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                           <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500"><FileText size={20}/></div>
                           <div className="flex-1">
                              <p className="font-bold text-slate-800 text-sm">Ibuprofeno 600mg</p>
                              <p className="text-[10px] text-slate-500">Dr. Martínez • Hace 2 min</p>
                           </div>
                           <div className="p-2 bg-slate-50 rounded-full text-slate-600 cursor-pointer hover:bg-[#7C3AED] hover:text-white transition-colors"><Download size={16}/></div>
                        </div>
                     </div>
                  </motion.div>
                )}

                {/* --- PANTALLA: PERFIL (NUEVO) --- */}
                {tourSteps[currentStep].screen === "profile" && (
                  <motion.div initial={{x: 20, opacity:0}} animate={{x: 0, opacity:1}} className="flex-1 bg-slate-50 px-0 pt-0 overflow-y-auto no-scrollbar">
                     
                     {/* Header Perfil */}
                     <div className="bg-white pb-6 pt-4 px-5 border-b border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                           <button onClick={() => navigatePhone('home')}><ChevronLeft size={20} className="text-slate-500"/></button>
                           <h3 className="text-lg font-bold text-slate-900">Mi Perfil</h3>
                           <div className="w-5"/> {/* Spacer */}
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="w-16 h-16 bg-slate-200 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                              <User size={32} className="text-slate-400"/>
                           </div>
                           <div>
                              <h3 className="text-lg font-bold text-slate-900">Lucas Fernández</h3>
                              <p className="text-xs text-slate-500 mb-1">DNI: 42.123.456</p>
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#7C3AED]/10 text-[#7C3AED] rounded-md text-[10px] font-bold uppercase">
                                 <ShieldCheck size={10}/> Plan Premium
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="p-5 space-y-5">
                        {/* Alertas Médicas */}
                        <div>
                           <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Datos Críticos</h5>
                           <div className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-start gap-3">
                              <AlertCircle size={18} className="text-red-500 mt-0.5"/>
                              <div>
                                 <p className="text-xs font-bold text-red-700">Alergia: Penicilina</p>
                                 <p className="text-[10px] text-red-500">Registrado por Dr. Martínez (2024)</p>
                              </div>
                           </div>
                        </div>

                        {/* Historia Clínica Timeline */}
                        <div>
                           <div className="flex items-center justify-between mb-2">
                              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Historia Clínica</h5>
                              <span className="text-[10px] text-[#7C3AED] font-bold">Ver todo</span>
                           </div>
                           
                           <div className="space-y-0 relative">
                              {/* Linea vertical */}
                              <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-200"/>

                              {/* Item 1 */}
                              <div className="relative flex gap-4 mb-4">
                                 <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#7C3AED] relative z-10 shadow-sm">
                                    <ClipboardList size={18}/>
                                 </div>
                                 <div className="bg-white p-3 rounded-xl border border-slate-100 flex-1 shadow-sm">
                                    <p className="text-xs font-bold text-slate-800">Guardia Clínica</p>
                                    <p className="text-[10px] text-slate-500 mb-1">Diag: Faringitis Aguda</p>
                                    <div className="flex gap-2 text-[9px] text-slate-400">
                                       <span className="flex items-center gap-1"><Calendar size={10}/> Hoy</span>
                                       <span>• Dr. Martínez</span>
                                    </div>
                                 </div>
                              </div>

                              {/* Item 2 */}
                              <div className="relative flex gap-4">
                                 <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-green-500 relative z-10 shadow-sm">
                                    <FileText size={18}/>
                                 </div>
                                 <div className="bg-white p-3 rounded-xl border border-slate-100 flex-1 shadow-sm opacity-70">
                                    <p className="text-xs font-bold text-slate-800">Apto Físico</p>
                                    <p className="text-[10px] text-slate-500 mb-1">Cardiología - Dr. López</p>
                                    <div className="flex gap-2 text-[9px] text-slate-400">
                                       <span className="flex items-center gap-1"><Calendar size={10}/> 12 Oct</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                )}

                {/* Bottom Navigation */}
                <div className="absolute bottom-0 w-full h-16 bg-[#1e293b] border-t border-white/5 flex items-center justify-around pb-2 z-40 text-slate-400">
                   <button onClick={() => navigatePhone('home')} className={`flex flex-col items-center gap-1 ${tourSteps[currentStep].screen === 'home'?'text-white':'text-slate-500'}`}><Home size={20}/><span className="text-[9px]">Inicio</span></button>
                   <button onClick={() => navigatePhone('chat')} className={`flex flex-col items-center gap-1 ${tourSteps[currentStep].screen === 'chat'?'text-white':'text-slate-500'}`}><MessageSquare size={20}/><span className="text-[9px]">Chat</span></button>
                   <button onClick={() => navigatePhone('profile')} className={`flex flex-col items-center gap-1 ${tourSteps[currentStep].screen === 'profile'?'text-white':'text-slate-500'}`}><User size={20}/><span className="text-[9px]">Perfil</span></button>
                </div>
                
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50 pointer-events-none" />
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="group relative flex items-center gap-3 px-6 py-2.5 rounded-full bg-white border border-slate-200 shadow-sm hover:border-[#7C3AED]/50 hover:shadow-md transition-all active:scale-95"
      >
        <div className="w-8 h-8 rounded-full bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED] group-hover:scale-110 transition-transform">
          <Play size={12} fill="currentColor" />
        </div>
        <div className="text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demo</p>
          <p className="text-sm font-bold text-slate-800 leading-none">Ver Tour</p>
        </div>
      </button>
      {createPortal(modalContent, document.body)}
    </>
  );
}