"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { login } from "@/lib/api";
import {
    clearCommercialSession,
    COMMERCIAL_ROLE_KEY,
    COMMERCIAL_TOKEN_KEY,
    hasCommercialRole,
    setCommercialSession,
} from "@/lib/commercial-session";

export default function ComercialLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const expired = searchParams.get("expired") === "1";

    const [email, setEmail] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const token = localStorage.getItem(COMMERCIAL_TOKEN_KEY);
        const role = localStorage.getItem(COMMERCIAL_ROLE_KEY);
        if (token && hasCommercialRole(role)) {
            router.replace("/comercial/dashboard");
        }
    }, [router]);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await login(email, contrasenia);
            if (!hasCommercialRole(res.usuario.rol ?? "")) {
                setError("Este acceso es exclusivo para brokers y vendedores autorizados.");
                return;
            }

            clearCommercialSession();
            setCommercialSession(res.access_token, res.usuario);

            router.push("/comercial/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "No pudimos iniciar sesion");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <span className="text-2xl font-black tracking-tight text-[#4C1D95]">CELDOCTOR.</span>
                    <p className="mt-1 text-sm text-slate-500">Canal comercial</p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-900">Ingreso comercial</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Acceso para brokers, vendedores directos y equipos autorizados.
                    </p>

                    {expired && (
                        <p className="mt-6 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                            Tu sesion comercial expiro. Inicia sesion nuevamente.
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                                placeholder="equipo@celdoctor.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="contrasenia" className="mb-1.5 block text-sm font-medium text-slate-700">
                                Contrasena
                            </label>
                            <input
                                id="contrasenia"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={contrasenia}
                                onChange={(event) => setContrasenia(event.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                                placeholder="Contrasena"
                            />
                        </div>

                        {error && (
                            <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-[#4C1D95] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4C1D95]/20 transition-all hover:bg-[#3b1675] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Ingresando..." : "Ingresar al panel"}
                        </button>
                    </form>
                </div>

                <div className="mt-4 text-center text-sm text-slate-500">
                    <Link href="/login" className="font-semibold text-[#4C1D95] hover:underline">
                        Acceso clientes
                    </Link>
                </div>
            </div>
        </div>
    );
}
