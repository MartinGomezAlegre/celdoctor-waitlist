import { motion } from "framer-motion";
import {
    User, MessageSquare, Video, FileText, ChevronRight,
} from "lucide-react";

interface HomeScreenProps {
    navigatePhone: (screen: string) => void;
}

export default function HomeScreen({ navigatePhone }: HomeScreenProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 overflow-y-auto px-5 pt-2 no-scrollbar"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">
                        Plan Corporativo
                    </p>
                    <h3 className="text-xl font-bold text-slate-900">Hola, Lucas 👋</h3>
                </div>
                <div
                    onClick={() => navigatePhone("profile")}
                    className="w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm cursor-pointer"
                >
                    <User size={18} className="text-slate-400" />
                </div>
            </div>

            {/* CTA Principal */}
            <div
                onClick={() => navigatePhone("chat")}
                className="bg-[#7C3AED] rounded-3xl p-5 text-white shadow-lg shadow-[#7C3AED]/30 mb-6 relative overflow-hidden cursor-pointer active:scale-95 transition-transform"
            >
                <div className="absolute -right-5 -top-5 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <p className="text-[10px] font-bold bg-white/20 w-fit px-2 py-0.5 rounded text-white mb-2">
                    Atención Inmediata
                </p>
                <h4 className="text-xl font-bold mb-4 leading-tight">
                    ¿Qué necesitás consultar
                    <br />
                    hoy?
                </h4>
                <button className="bg-white text-[#7C3AED] w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                    <MessageSquare size={16} /> Iniciar Chat Médico
                </button>
            </div>

            {/* Grid de Acciones */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div
                    onClick={() => navigatePhone("video")}
                    className="bg-[#1e293b] p-4 rounded-2xl text-white flex flex-col gap-2 cursor-pointer active:scale-95 transition-transform"
                >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <Video size={16} />
                    </div>
                    <div>
                        <p className="text-xs font-bold">Videollamada</p>
                        <p className="text-[10px] text-slate-400">Turnos programados</p>
                    </div>
                </div>
                <div
                    onClick={() => navigatePhone("recetas")}
                    className="bg-[#1e293b] p-4 rounded-2xl text-white flex flex-col gap-2 cursor-pointer active:scale-95 transition-transform"
                >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <FileText size={16} />
                    </div>
                    <div>
                        <p className="text-xs font-bold">Recetas</p>
                        <p className="text-[10px] text-slate-400">Historial y vigentes</p>
                    </div>
                </div>
            </div>

            {/* Lista de Especialidades */}
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                Especialidades
            </h5>
            <div className="space-y-2">
                {["Clínica Médica", "Pediatría", "Nutrición", "Psicología"].map(
                    (s, i) => (
                        <div
                            key={i}
                            className="bg-[#1e293b] p-3 rounded-xl border border-white/5 flex justify-between items-center text-white cursor-pointer hover:bg-[#283547]"
                        >
                            <span className="text-xs font-medium">{s}</span>
                            <ChevronRight size={14} className="text-slate-500" />
                        </div>
                    )
                )}
            </div>
        </motion.div>
    );
}
