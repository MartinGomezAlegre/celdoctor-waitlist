"use client";

import React, { useActionState, useState } from "react";
import { submitToWaitlist } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, ArrowRight, Loader2, Phone, MapPin, 
  User, Mail, ChevronDown, Stethoscope, Building2, HeartPulse 
} from "lucide-react";

const initialState = {
  success: false,
  message: ""
};

export default function WaitlistForm() {
  const [state, formAction, isPending] = useActionState(submitToWaitlist, initialState);
  const [userType, setUserType] = useState<"paciente" | "medico" | "empresa">("paciente");

  if (state.success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="text-center py-16 px-4 bg-white rounded-3xl h-full flex flex-col items-center justify-center border border-slate-100"
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-sm">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Solicitud Recibida</h3>
        <p className="text-slate-500 max-w-xs mx-auto text-sm">
          {userType === "paciente" && "Tus datos están seguros. Te avisaremos al lanzar."}
          {userType === "medico" && "Gracias Doctor/a. Nuestro equipo médico lo contactará."}
          {userType === "empresa" && "Un asesor corporativo se pondrá en contacto pronto."}
        </p>
      </motion.div>
    );
  }

  return (
    <form action={formAction} className="bg-white p-8 md:p-10 rounded-3xl shadow-xl h-full border border-slate-100 flex flex-col relative overflow-hidden">
      
      <input type="hidden" name="tipo_usuario" value={userType} />
      <input type="text" name="website_url" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

      <div className="mb-6">
        <h4 className="text-xl font-bold text-slate-900">Formulario de Alta</h4>
        <p className="text-slate-500 text-sm">Los campos con asterisco (*) son obligatorios.</p>
      </div>

      {/* --- SWITCH DE 3 OPCIONES --- */}
      <div className="bg-slate-100 p-1 rounded-xl flex mb-8 relative">
        <motion.div 
           className="absolute top-1 bottom-1 bg-white rounded-lg shadow-sm z-0"
           initial={false}
           animate={{ 
             x: userType === "paciente" ? "0%" : userType === "medico" ? "100%" : "200%",
             left: userType === "paciente" ? 4 : 0, 
             width: "calc(33.33% - 4px)" 
            }}
           transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        
        <button type="button" onClick={() => setUserType("paciente")} className={`flex-1 py-2.5 text-[10px] sm:text-xs font-bold rounded-lg relative z-10 transition-colors flex flex-col sm:flex-row items-center justify-center gap-1.5 ${userType === "paciente" ? "text-[#4C1D95]" : "text-slate-500 hover:text-slate-700"}`}>
          <User size={16} /> Paciente
        </button>
        <button type="button" onClick={() => setUserType("medico")} className={`flex-1 py-2.5 text-[10px] sm:text-xs font-bold rounded-lg relative z-10 transition-colors flex flex-col sm:flex-row items-center justify-center gap-1.5 ${userType === "medico" ? "text-[#4C1D95]" : "text-slate-500 hover:text-slate-700"}`}>
          <Stethoscope size={16} /> Médico
        </button>
        <button type="button" onClick={() => setUserType("empresa")} className={`flex-1 py-2.5 text-[10px] sm:text-xs font-bold rounded-lg relative z-10 transition-colors flex flex-col sm:flex-row items-center justify-center gap-1.5 ${userType === "empresa" ? "text-[#4C1D95]" : "text-slate-500 hover:text-slate-700"}`}>
          <Building2 size={16} /> Empresa
        </button>
      </div>

      <div className="space-y-4 flex-1">
        
        <AnimatePresence mode="wait">
          
          {/* PACIENTE */}
          {userType === "paciente" && (
            <motion.div 
              key="paciente-fields"
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
              className="space-y-1.5 relative group"
            >
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Tipo de Cobertura <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select name="detalle" className="w-full appearance-none pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-[#4C1D95] outline-none transition-all cursor-pointer">
                  <option value="Plan Personal">Plan Personal</option>
                  <option value="Plan Familiar">Plan Familiar</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              </div>
            </motion.div>
          )}

          {/* MÉDICO */}
          {userType === "medico" && (
            <motion.div 
              key="medico-fields"
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
              className="relative group pt-1"
            >
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">
                Especialidad Médica <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                 <HeartPulse className="absolute left-4 top-3.5 text-slate-400" size={18} />
                 <input required name="detalle" type="text" placeholder="Ej: Cardiología..." className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#4C1D95] outline-none transition-all" />
              </div>
            </motion.div>
          )}

          {/* EMPRESA */}
          {userType === "empresa" && (
            <motion.div 
              key="empresa-fields"
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
              className="relative group pt-1"
            >
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">
                Nombre de la Empresa <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                 <Building2 className="absolute left-4 top-3.5 text-slate-400" size={18} />
                 <input required name="detalle" type="text" placeholder="Razón Social" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#4C1D95] outline-none transition-all" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DATOS COMUNES */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 relative group">
            <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input required name="nombre" type="text" placeholder={userType === "empresa" ? "Nombre de contacto *" : "Nombre completo *"} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-[#4C1D95] outline-none transition-all" />
          </div>
          
          <div className="relative group">
             {userType === "empresa" ? (
                <input required name="edad" type="number" placeholder="Emp. *" title="Cantidad de empleados" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-center text-slate-900 focus:border-[#4C1D95] outline-none transition-all" />
             ) : (
                <input required name="edad" type="number" placeholder="Edad *" min="18" max="99" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-center text-slate-900 focus:border-[#4C1D95] outline-none transition-all" />
             )}
          </div>
        </div>

        <div className="relative group">
          <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input required name="email" type="email" placeholder="Correo electrónico *" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-[#4C1D95] outline-none transition-all" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative group">
            <Phone className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input required name="whatsapp" type="tel" placeholder="WhatsApp *" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-[#4C1D95] outline-none transition-all" />
          </div>
          <div className="relative group">
            <MapPin className="absolute left-4 top-3.5 text-slate-400" size={18} />
            
            {/* CORRECCIÓN APLICADA AQUÍ 👇 */}
            <select 
              name="provincia" 
              defaultValue="" 
              className="w-full pl-11 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:border-[#4C1D95] outline-none appearance-none cursor-pointer"
            >
              <option value="" disabled>Provincia *</option>
              <option value="Buenos Aires">Buenos Aires</option>
              <option value="CABA">CABA</option>
              <option value="Catamarca">Catamarca</option>
              <option value="Chaco">Chaco</option>
              <option value="Chubut">Chubut</option>
              <option value="Córdoba">Córdoba</option>
              <option value="Corrientes">Corrientes</option>
              <option value="Entre Ríos">Entre Ríos</option>
              <option value="Formosa">Formosa</option>
              <option value="Jujuy">Jujuy</option>
              <option value="La Pampa">La Pampa</option>
              <option value="La Rioja">La Rioja</option>
              <option value="Mendoza">Mendoza</option>
              <option value="Misiones">Misiones</option>
              <option value="Neuquén">Neuquén</option>
              <option value="Río Negro">Río Negro</option>
              <option value="Salta">Salta</option>
              <option value="San Juan">San Juan</option>
              <option value="San Luis">San Luis</option>
              <option value="Santa Cruz">Santa Cruz</option>
              <option value="Santa Fe">Santa Fe</option>
              <option value="Santiago del Estero">Santiago del Estero</option>
              <option value="Tierra del Fuego">Tierra del Fuego</option>
              <option value="Tucumán">Tucumán</option>
            </select>
          </div>
        </div>
      </div>

      {state.success === false && state.message && (
          <p className="text-red-500 text-xs text-center mt-3 bg-red-50 p-2 rounded border border-red-100">{state.message}</p>
      )}

      <button 
        disabled={isPending} 
        type="submit" 
        className="w-full mt-6 bg-[#4C1D95] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#4C1D95]/30 hover:bg-[#3b1675] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {isPending && <Loader2 className="animate-spin" size={20} />}
        {userType === "paciente" && "Unirme como Paciente"}
        {userType === "medico" && "Postularme como Médico"}
        {userType === "empresa" && "Solicitar Contacto"}
        {!isPending && <ArrowRight size={20} />}
      </button>

    </form>
  );
}