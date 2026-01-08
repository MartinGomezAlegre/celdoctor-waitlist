"use client";

import React, { useActionState } from "react";
import { submitToWaitlist } from "@/app/actions";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Loader2, Phone, MapPin, User, Mail, ChevronDown } from "lucide-react";

const initialState = {
  success: false,
  message: ""
};

export default function WaitlistForm() {
  const [state, formAction, isPending] = useActionState(submitToWaitlist, initialState);
  const [planType, setPlanType] = React.useState("personal");

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
          Tus datos están seguros. Nos pondremos en contacto pronto.
        </p>
      </motion.div>
    );
  }

  return (
    <form action={formAction} className="space-y-5 bg-white p-8 md:p-10 rounded-3xl shadow-xl h-full border border-slate-100">
      
      <div className="mb-6">
        <h4 className="text-xl font-bold text-slate-900">Formulario de Alta</h4>
        <p className="text-slate-500 text-sm">Completá tus datos para la validación.</p>
      </div>

      {/* HONEYPOT (Anti-bot) */}
      <input 
        type="text" 
        name="website_url" 
        style={{ display: 'none' }} 
        tabIndex={-1} 
        autoComplete="off"
      />

      {/* TIPO DE COBERTURA */}
      <div className="space-y-1.5 relative group">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
          Tipo de Cobertura
        </label>
        <div className="relative">
          <select 
            name="plan" 
            value={planType}
            onChange={(e) => setPlanType(e.target.value)}
            className="w-full appearance-none pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-[#4C1D95] focus:ring-1 focus:ring-[#4C1D95] outline-none transition-all cursor-pointer"
          >
            <option value="Personal">Plan Personal</option>
            <option value="Familiar">Plan Familiar</option>
            <option value="Empresa">Plan Corporativo</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
        </div>
      </div>

      {/* DATOS PERSONALES */}
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 relative group">
            <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-[#4C1D95] transition-colors" size={18} />
            <input required name="nombre" type="text" placeholder="Nombre completo" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#4C1D95] focus:ring-1 focus:ring-[#4C1D95] outline-none transition-all placeholder:text-slate-400" />
          </div>
          <div className="relative group">
            <input required name="edad" type="number" placeholder="Edad" min="18" max="99" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-center text-slate-900 focus:bg-white focus:border-[#4C1D95] focus:ring-1 focus:ring-[#4C1D95] outline-none transition-all placeholder:text-slate-400" />
          </div>
        </div>

        <div className="relative group">
          <Mail className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-[#4C1D95] transition-colors" size={18} />
          <input required name="email" type="email" placeholder="Correo electrónico profesional" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#4C1D95] focus:ring-1 focus:ring-[#4C1D95] outline-none transition-all placeholder:text-slate-400" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative group">
            <Phone className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-[#4C1D95] transition-colors" size={18} />
            <input required name="whatsapp" type="tel" placeholder="WhatsApp" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#4C1D95] focus:ring-1 focus:ring-[#4C1D95] outline-none transition-all placeholder:text-slate-400" />
          </div>
          <div className="relative group">
            <MapPin className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-[#4C1D95] transition-colors" size={18} />
            <select name="provincia" className="w-full pl-11 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:bg-white focus:border-[#4C1D95] focus:ring-1 focus:ring-[#4C1D95] outline-none transition-all appearance-none cursor-pointer">
              <option value="" disabled selected>Provincia...</option>
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

      {/* Mensaje de Error (si el servidor devuelve success: false) */}
      {state.success === false && state.message && (
          <p className="text-red-500 text-xs text-center font-bold bg-red-50 p-2 rounded-lg border border-red-100">
            {state.message}
          </p>
      )}

      <button 
        disabled={isPending} 
        type="submit" 
        className="w-full mt-2 bg-[#4C1D95] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#4C1D95]/30 hover:bg-[#3b1675] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
      >
        {isPending && <Loader2 className="animate-spin" size={20} />}
        Unirme a la lista
        {!isPending && <ArrowRight size={20} />}
      </button>

      <div className="text-center pt-2 border-t border-slate-100 mt-4">
         <p className="text-[10px] text-slate-400 mt-3">
           Tus datos viajan seguros a través de nuestros servidores encriptados.
         </p>
      </div>
    </form>
  );
}