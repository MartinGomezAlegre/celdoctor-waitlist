import { motion } from "framer-motion";
import { ChevronLeft, Send } from "lucide-react";

interface ChatScreenProps {
    navigatePhone: (screen: string) => void;
}

export default function ChatScreen({ navigatePhone }: ChatScreenProps) {
    return (
        <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex-1 flex flex-col bg-[#f0f2f5]"
        >
            {/* Header */}
            <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center gap-3 shadow-sm z-10">
                <button onClick={() => navigatePhone("home")}>
                    <ChevronLeft size={20} className="text-slate-500" />
                </button>
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">
                    Dr
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-900">Dr. Martínez</p>
                    <p className="text-[10px] text-green-500 font-bold">● En línea</p>
                </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 p-4 space-y-3">
                <div className="flex justify-end">
                    <div className="bg-[#7C3AED] text-white p-3 rounded-2xl rounded-tr-none text-xs max-w-[85%]">
                        Hola, tengo fiebre y dolor de garganta.
                    </div>
                </div>
                <div className="flex justify-start">
                    <div className="bg-white text-slate-700 border border-slate-200 p-3 rounded-2xl rounded-tl-none text-xs max-w-[85%] shadow-sm">
                        Entiendo. ¿Tenés placas en la garganta o dificultad para tragar?
                    </div>
                </div>
                <div className="flex justify-end">
                    <div className="bg-[#7C3AED] text-white p-3 rounded-2xl rounded-tr-none text-xs max-w-[85%]">
                        Solo molestia al tragar.
                    </div>
                </div>
                <div className="flex justify-start">
                    <div className="bg-white text-slate-700 border border-slate-200 p-3 rounded-2xl rounded-tl-none text-xs max-w-[85%] shadow-sm">
                        Bien, vamos a indicarte ibuprofeno 600mg cada 8hs. Te envío la
                        receta ahora.
                    </div>
                </div>
            </div>

            {/* Input */}
            <div className="bg-white p-3 border-t border-slate-200">
                <div className="h-10 bg-slate-100 rounded-full flex items-center px-4 text-slate-400 text-xs justify-between">
                    <span>Escribir mensaje...</span>
                    <Send size={14} />
                </div>
            </div>
        </motion.div>
    );
}
