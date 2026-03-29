"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Estado = "idle" | "loading" | "success" | "error_expirado" | "error_generico";

function NuevaContraseniaForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [nueva, setNueva] = useState("");
    const [confirmacion, setConfirmacion] = useState("");
    const [estado, setEstado] = useState<Estado>("idle");
    const [errorLocal, setErrorLocal] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            router.replace("/login");
        }
    }, [token, router]);

    if (!token) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorLocal(null);

        if (nueva !== confirmacion) {
            setErrorLocal("Las contraseñas no coinciden");
            return;
        }

        if (nueva.length < 8) {
            setErrorLocal("La contraseña debe tener al menos 8 caracteres");
            return;
        }

        setEstado("loading");

        try {
            const res = await fetch("/api/proxy/auth/nueva-contrasenia", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, nueva_contrasenia: nueva }),
            });

            if (res.ok) {
                setEstado("success");
            } else if (res.status === 400) {
                setEstado("error_expirado");
            } else {
                setEstado("error_generico");
            }
        } catch {
            setEstado("error_generico");
        }
    }

    if (estado === "success") {
        return (
            <div className="text-center space-y-5">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto">
                    <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900 mb-2">¡Contraseña actualizada!</h1>
                    <p className="text-sm text-slate-500">Ya podés iniciar sesión con tu nueva contraseña.</p>
                </div>
                <Link
                    href="/login"
                    className="inline-block w-full py-3.5 bg-[#4C1D95] text-white rounded-xl font-bold text-sm text-center hover:bg-[#3b1675] transition-all shadow-lg shadow-[#4C1D95]/20"
                >
                    Ir al login
                </Link>
            </div>
        );
    }

    if (estado === "error_expirado") {
        return (
            <div className="text-center space-y-5">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
                    <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900 mb-2">Link expirado</h1>
                    <p className="text-sm text-slate-500">El link expiró o ya fue usado. Pedí uno nuevo.</p>
                </div>
                <Link
                    href="/recuperar-contrasenia"
                    className="inline-block w-full py-3.5 bg-[#4C1D95] text-white rounded-xl font-bold text-sm text-center hover:bg-[#3b1675] transition-all shadow-lg shadow-[#4C1D95]/20"
                >
                    Pedir nuevo link
                </Link>
            </div>
        );
    }

    return (
        <>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Crear nueva contraseña</h1>
            <p className="text-sm text-slate-500 mb-8">Ingresá tu nueva contraseña para continuar</p>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="nueva" className="block text-sm font-medium text-slate-700 mb-1.5">
                        Nueva contraseña
                    </label>
                    <input
                        id="nueva"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={8}
                        value={nueva}
                        onChange={(e) => setNueva(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] transition-colors"
                        placeholder="Mínimo 8 caracteres"
                    />
                </div>

                <div>
                    <label htmlFor="confirmacion" className="block text-sm font-medium text-slate-700 mb-1.5">
                        Confirmar contraseña
                    </label>
                    <input
                        id="confirmacion"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={confirmacion}
                        onChange={(e) => setConfirmacion(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] transition-colors"
                        placeholder="Repetí la contraseña"
                    />
                </div>

                {(errorLocal || estado === "error_generico") && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                        {errorLocal ?? "Ocurrió un error. Intentá de nuevo."}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={estado === "loading"}
                    className="w-full py-3.5 bg-[#4C1D95] text-white rounded-xl font-bold text-sm hover:bg-[#3b1675] transition-all shadow-lg shadow-[#4C1D95]/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {estado === "loading" ? "Guardando..." : "Guardar nueva contraseña"}
                </button>
            </form>
        </>
    );
}

export default function NuevaContraseniaPage() {
    return (
        <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                <Suspense fallback={<div className="h-40 flex items-center justify-center"><div className="w-6 h-6 border-2 border-[#4C1D95]/30 border-t-[#4C1D95] rounded-full animate-spin" /></div>}>
                    <NuevaContraseniaForm />
                </Suspense>
            </div>
        </div>
    );
}
