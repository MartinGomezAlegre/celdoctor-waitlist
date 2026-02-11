import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
            {/* Decoración de fondo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-[#4C1D95]/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="relative z-10 space-y-6 max-w-md">
                <p className="text-8xl font-bold text-transparent bg-clip-text bg-linear-to-r from-[#4C1D95] to-[#7C3AED]">
                    404
                </p>
                <h1 className="text-3xl font-bold text-slate-900">
                    Página no encontrada
                </h1>
                <p className="text-slate-500 text-lg leading-relaxed">
                    La página que buscás no existe o fue movida. Pero tranquilo, tu salud
                    sigue en buenas manos.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#4C1D95] text-white rounded-xl font-bold text-base hover:bg-[#3b1675] transition-all shadow-xl shadow-[#4C1D95]/20 hover:-translate-y-1 active:scale-95"
                >
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}
