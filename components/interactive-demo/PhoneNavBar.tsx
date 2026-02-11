import { Home, MessageSquare, User } from "lucide-react";

interface PhoneNavBarProps {
    currentScreen: string;
    navigatePhone: (screen: string) => void;
}

export default function PhoneNavBar({
    currentScreen,
    navigatePhone,
}: PhoneNavBarProps) {
    const items = [
        { screen: "home", icon: Home, label: "Inicio" },
        { screen: "chat", icon: MessageSquare, label: "Chat" },
        { screen: "profile", icon: User, label: "Perfil" },
    ];

    return (
        <div className="absolute bottom-0 w-full h-16 bg-[#1e293b] border-t border-white/5 flex items-center justify-around pb-2 z-40 text-slate-400">
            {items.map((item) => (
                <button
                    key={item.screen}
                    onClick={() => navigatePhone(item.screen)}
                    className={`flex flex-col items-center gap-1 ${currentScreen === item.screen ? "text-white" : "text-slate-500"
                        }`}
                >
                    <item.icon size={20} />
                    <span className="text-[9px]">{item.label}</span>
                </button>
            ))}
        </div>
    );
}
