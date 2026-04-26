"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { resolveAccountRoute } from "@/lib/account-route";
import { login } from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const expired = searchParams.get("expired") === "1";
    const success = searchParams.get("success") === "1";

    const [email, setEmail] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await login(email, contrasenia, "customer");
            const role = data.usuario.rol ?? "cliente";

            localStorage.setItem("celdoctor_nombre", data.usuario.nombre);
            localStorage.setItem("celdoctor_email", data.usuario.email);
            localStorage.setItem("celdoctor_rol", role);
            localStorage.removeItem("celdoctor_token");
            localStorage.removeItem("celdoctor_admin_token");
            localStorage.removeItem("celdoctor_commercial_token");

            router.push(resolveAccountRoute(role));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error de conexion");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md">
            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
                <h1 className="mb-1 text-2xl font-bold text-slate-900">Iniciar sesion</h1>
                <p className="mb-8 text-sm text-slate-500">
                    Ingresá con tu cuenta de cliente, empresa o afiliado. No tenes cuenta?{" "}
                    <Link href="/registro" className="font-semibold text-[#4C1D95] hover:underline">
                        Crear cuenta
                    </Link>
                </p>

                {expired && (
                    <p className="mb-6 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        Tu sesion expiro. Inicia sesion nuevamente.
                    </p>
                )}
                {success && (
                    <p className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        Cuenta creada. Ya podes iniciar sesion.
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
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
                            placeholder="tu@email.com"
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
                            placeholder="********"
                        />
                    </div>

                    <div className="-mt-2 flex justify-end">
                        <Link href="/recuperar-contrasenia" className="text-sm text-[#4C1D95] hover:underline">
                            Olvidaste tu contrasena?
                        </Link>
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
                        {loading ? "Ingresando..." : "Ingresar"}
                    </button>
                </form>
            </div>
        </div>
    );
}
