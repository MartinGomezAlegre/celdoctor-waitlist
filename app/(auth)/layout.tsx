import type { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        template: "%s | CelDoctor",
        default: "CelDoctor",
    },
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="h-16 flex items-center px-6 border-b border-slate-100 bg-white">
                <a href="/" className="font-bold text-xl tracking-tight text-slate-900">
                    CELDOCTOR<span className="text-[#4C1D95]">.</span>
                </a>
            </header>
            <main className="flex-1 flex items-center justify-center px-4 py-12">
                {children}
            </main>
        </div>
    );
}
