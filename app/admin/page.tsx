"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { CelDoctorLogo } from "@/components/CelDoctorLogo";
import { login } from "@/lib/api";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(email, contrasenia, "admin");
            localStorage.setItem("celdoctor_rol", "admin");
            localStorage.removeItem("celdoctor_token");
            localStorage.removeItem("celdoctor_admin_token");
            localStorage.removeItem("celdoctor_commercial_token");
            router.push("/admin/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error de conexion");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <CelDoctorLogo tone="purple" />
                    <p className="mt-1 text-sm text-slate-500">Panel de Administracion</p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                                placeholder="admin@celdoctor.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="contrasenia" className="mb-1.5 block text-sm font-medium text-slate-700">
                                Contrasena
                            </label>
                            <input
                                id="contrasenia"
                                type="password"
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
                            {loading ? "Ingresando..." : "Ingresar"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
