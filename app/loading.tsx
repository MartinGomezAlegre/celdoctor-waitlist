export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="relative">
                {/* Spinner */}
                <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#4C1D95] animate-spin" />
            </div>
            <p className="mt-6 text-sm font-medium text-slate-400 animate-pulse">
                Cargando CelDoctor...
            </p>
        </div>
    );
}
