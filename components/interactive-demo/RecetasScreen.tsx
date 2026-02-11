import { motion } from "framer-motion";
import { ChevronLeft, FileText, Download } from "lucide-react";

interface RecetasScreenProps {
    navigatePhone: (screen: string) => void;
}

export default function RecetasScreen({ navigatePhone }: RecetasScreenProps) {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex-1 bg-slate-50 px-5 pt-4"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigatePhone("home")}>
                    <ChevronLeft size={20} className="text-slate-500" />
                </button>
                <h3 className="text-lg font-bold text-slate-900">Mis Recetas</h3>
            </div>

            {/* Lista de Recetas */}
            <div className="space-y-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                        <FileText size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-slate-800 text-sm">
                            Ibuprofeno 600mg
                        </p>
                        <p className="text-[10px] text-slate-500">
                            Dr. Martínez • Hace 2 min
                        </p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-full text-slate-600 cursor-pointer hover:bg-[#7C3AED] hover:text-white transition-colors">
                        <Download size={16} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
