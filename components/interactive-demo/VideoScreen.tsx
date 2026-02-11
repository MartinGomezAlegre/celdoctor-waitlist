import { motion } from "framer-motion";
import { User, Mic, Video as VideoIcon, PhoneOff } from "lucide-react";

interface VideoScreenProps {
    callDuration: number;
    navigatePhone: (screen: string) => void;
}

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function VideoScreen({
    callDuration,
    navigatePhone,
}: VideoScreenProps) {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex-1 bg-slate-900 relative flex flex-col"
        >
            <div className="absolute inset-0 bg-linear-to-b from-slate-700 to-slate-900 flex items-center justify-center">
                <User size={80} className="text-slate-600 opacity-20" />
            </div>

            <div className="relative z-10 flex-1 flex flex-col justify-between p-6">
                {/* Top bar */}
                <div className="flex justify-between items-start pt-2">
                    <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                        {formatTime(callDuration)}
                    </div>
                    <div className="w-24 h-32 bg-black/50 rounded-xl border border-white/10 shadow-lg" />
                </div>

                {/* Doctor info + controls */}
                <div className="flex flex-col items-center gap-6 pb-4">
                    <div className="text-center">
                        <h3 className="text-white font-bold text-lg">Dr. Martínez</h3>
                        <p className="text-white/60 text-xs">Clínica Médica</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                            <Mic size={20} />
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                            <VideoIcon size={20} />
                        </div>
                        <div
                            onClick={() => navigatePhone("home")}
                            className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center text-white cursor-pointer hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                        >
                            <PhoneOff size={24} fill="currentColor" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
