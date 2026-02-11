import { motion } from "framer-motion";
import {
    ChevronLeft, User, ShieldCheck, AlertCircle,
    ClipboardList, FileText, Calendar,
} from "lucide-react";

interface ProfileScreenProps {
    navigatePhone: (screen: string) => void;
}

export default function ProfileScreen({ navigatePhone }: ProfileScreenProps) {
    return (
        <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex-1 bg-slate-50 px-0 pt-0 overflow-y-auto no-scrollbar"
        >
            {/* Header Perfil */}
            <div className="bg-white pb-6 pt-4 px-5 border-b border-slate-100">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => navigatePhone("home")}>
                        <ChevronLeft size={20} className="text-slate-500" />
                    </button>
                    <h3 className="text-lg font-bold text-slate-900">Mi Perfil</h3>
                    <div className="w-5" /> {/* Spacer */}
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-200 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                        <User size={32} className="text-slate-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">
                            Lucas Fernández
                        </h3>
                        <p className="text-xs text-slate-500 mb-1">DNI: 42.123.456</p>
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#7C3AED]/10 text-[#7C3AED] rounded-md text-[10px] font-bold uppercase">
                            <ShieldCheck size={10} /> Plan Premium
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-5 space-y-5">
                {/* Alertas Médicas */}
                <div>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                        Datos Críticos
                    </h5>
                    <div className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-start gap-3">
                        <AlertCircle size={18} className="text-red-500 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-red-700">
                                Alergia: Penicilina
                            </p>
                            <p className="text-[10px] text-red-500">
                                Registrado por Dr. Martínez (2024)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Historia Clínica Timeline */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                            Historia Clínica
                        </h5>
                        <span className="text-[10px] text-[#7C3AED] font-bold">
                            Ver todo
                        </span>
                    </div>

                    <div className="space-y-0 relative">
                        {/* Línea vertical */}
                        <div className="absolute left-4.75 top-2 bottom-2 w-0.5 bg-slate-200" />

                        {/* Item 1 */}
                        <div className="relative flex gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#7C3AED] relative z-10 shadow-sm">
                                <ClipboardList size={18} />
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-100 flex-1 shadow-sm">
                                <p className="text-xs font-bold text-slate-800">
                                    Guardia Clínica
                                </p>
                                <p className="text-[10px] text-slate-500 mb-1">
                                    Diag: Faringitis Aguda
                                </p>
                                <div className="flex gap-2 text-[9px] text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={10} /> Hoy
                                    </span>
                                    <span>• Dr. Martínez</span>
                                </div>
                            </div>
                        </div>

                        {/* Item 2 */}
                        <div className="relative flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-green-500 relative z-10 shadow-sm">
                                <FileText size={18} />
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-100 flex-1 shadow-sm opacity-70">
                                <p className="text-xs font-bold text-slate-800">Apto Físico</p>
                                <p className="text-[10px] text-slate-500 mb-1">
                                    Cardiología - Dr. López
                                </p>
                                <div className="flex gap-2 text-[9px] text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={10} /> 12 Oct
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
