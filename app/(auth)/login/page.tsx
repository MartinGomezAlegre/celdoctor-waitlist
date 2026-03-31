"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api";
import { setSessionCookie } from "@/lib/session-cookie";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const expired = searchParams.get("expired") === "1";
    const success = searchParams.get("success") === "1";

    const [email, setEmail] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await login(email, contrasenia);
            localStorage.setItem("celdoctor_token", data.access_token);
            localStorage.setItem("celdoctor_nombre", data.usuario.nombre);
            localStorage.setItem("celdoctor_email", data.usuario.email);
            setSessionCookie("celdoctor_token", data.access_token);
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error de conexión");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Iniciar sesión</h1>
                <p className="text-sm text-slate-500 mb-8">
                    ¿No tenés cuenta?{" "}
                    <Link href="/registro" className="text-[#4C1D95] font-semibold hover:underline">
                        Crear cuenta
                    </Link>
                </p>

                {expired && (
                    <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-6">
                        Tu sesión expiró. Iniciá sesión nuevamente.
                    </p>
                )}
                {success && (
                    <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 mb-6">
                        ¡Cuenta creada! Ya podés iniciar sesión.
                    </p>
                )}

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

                    <div>
                        <label htmlFor="contrasenia" className="block text-sm font-medium text-slate-700 mb-1.5">
                            Contraseña
                        </label>
                        <input
                            id="contrasenia"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={contrasenia}
                            onChange={(e) => setContrasenia(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex justify-end -mt-2">
                        <Link href="/recuperar-contrasenia" className="text-sm text-[#4C1D95] hover:underline">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-[#4C1D95] text-white rounded-xl font-bold text-sm hover:bg-[#3b1675] transition-all shadow-lg shadow-[#4C1D95]/20 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "Ingresando..." : "Ingresar"}
                    </button>
                </form>
            </div>
        </div>
    );
}
