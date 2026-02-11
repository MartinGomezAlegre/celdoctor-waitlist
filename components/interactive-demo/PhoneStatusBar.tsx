import { Signal, Wifi, Battery } from "lucide-react";

export default function PhoneStatusBar() {
    return (
        <div className="absolute top-0 inset-x-0 h-14 z-30 flex justify-between items-end px-7 pb-2 text-white text-[12px] font-medium pointer-events-none">
            <span>9:41</span>
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-22.5 h-6.5 bg-black rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1c1c1e] ml-auto mr-3" />
            </div>
            <div className="flex gap-1.5 items-center">
                <Signal size={14} />
                <Wifi size={14} />
                <Battery size={14} />
            </div>
        </div>
    );
}
