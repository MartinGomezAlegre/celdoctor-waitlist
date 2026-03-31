"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { setSessionCookie } from "@/lib/session-cookie";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await login(email, contrasenia);
            if (res.usuario.rol !== "admin") {
                setError("Sin permisos de administrador.");
                return;
            }
            localStorage.setItem("celdoctor_admin_token", res.access_token);
            setSessionCookie("celdoctor_admin_token", res.access_token);
            router.push("/admin/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error de conexión");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <span className="text-2xl font-black text-[#4C1D95] tracking-tight">CELDOCTOR.</span>
                    <p className="text-slate-500 text-sm mt-1">Panel de Administración</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] transition-colors"
                                placeholder="admin@celdoctor.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="contrasenia" className="block text-sm font-medium text-slate-700 mb-1.5">
                                Contraseña
                            </label>
                            <input
                                id="contrasenia"
                                type="password"
                                required
                                value={contrasenia}
                                onChange={(e) => setContrasenia(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] transition-colors"
                                placeholder="Contraseña"
                            />
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
        </div>
    );
}
