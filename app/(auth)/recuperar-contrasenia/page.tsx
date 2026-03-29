"use client";

import { useState } from "react";
import Link from "next/link";

type Estado = "idle" | "loading" | "success";

export default function RecuperarContraseniaPage() {
    const [email, setEmail] = useState("");
    const [estado, setEstado] = useState<Estado>("idle");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setEstado("loading");

        try {
            await fetch("/api/proxy/auth/recuperar-contrasenia", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
        } catch {
            // Ignorar errores — siempre mostrar éxito (no revelar si el email existe)
        }

        setEstado("success");
    }

    return (
        <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                {estado === "success" ? (
                    <div className="text-center space-y-5">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto">
                            <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 mb-2">Revisá tu casilla de email</h1>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Si el correo está registrado, te enviamos el link para recuperar tu contraseña.
                            </p>
                        </div>
                        <Link
                            href="/login"
                            className="inline-block w-full py-3.5 bg-[#4C1D95] text-white rounded-xl font-bold text-sm text-center hover:bg-[#3b1675] transition-all shadow-lg shadow-[#4C1D95]/20"
                        >
                            Volver al login
                        </Link>
                    </div>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold text-slate-900 mb-1">Recuperar contraseña</h1>
                        <p className="text-sm text-slate-500 mb-8">
                            Ingresá tu email y te enviamos las instrucciones
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] transition-colors"
                                    placeholder="tu@email.com"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={estado === "loading"}
                                className="w-full py-3.5 bg-[#4C1D95] text-white rounded-xl font-bold text-sm hover:bg-[#3b1675] transition-all shadow-lg shadow-[#4C1D95]/20 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {estado === "loading" ? "Enviando..." : "Enviar instrucciones"}
                            </button>
                        </form>

                        <div className="mt-5 text-center">
                            <Link href="/login" className="text-sm text-[#4C1D95] hover:underline">
                                ← Volver al inicio de sesión
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
