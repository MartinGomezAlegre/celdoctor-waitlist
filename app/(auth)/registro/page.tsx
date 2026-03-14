"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registrarUsuario } from "@/lib/api";

export default function RegistroPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        fecha_nacimiento: "",
        contrasenia: "",
    });
    const [aceptaTerminos, setAceptaTerminos] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function validate(): string | null {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) return "El email no es válido.";
        if (form.contrasenia.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
        if (!aceptaTerminos) return "Debés aceptar los términos y condiciones.";
        return null;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            await registrarUsuario(form);
            router.push("/login?success=1");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error de conexión");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-lg">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Crear cuenta</h1>
                <p className="text-sm text-slate-500 mb-8">
                    ¿Ya tenés cuenta?{" "}
                    <Link href="/login" className="text-[#4C1D95] font-semibold hover:underline">
                        Iniciar sesión
                    </Link>
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-1.5">
                                Nombre
                            </label>
                            <input
                                id="nombre"
                                name="nombre"
                                type="text"
                                required
                                autoComplete="given-name"
                                value={form.nombre}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] transition-colors"
                                placeholder="Juan"
                            />
                        </div>
                        <div>
                            <label htmlFor="apellido" className="block text-sm font-medium text-slate-700 mb-1.5">
                                Apellido
                            </label>
                            <input
                                id="apellido"
                                name="apellido"
                                type="text"
                                required
                                autoComplete="family-name"
                                value={form.apellido}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] transition-colors"
                                placeholder="Pérez"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] transition-colors"
                            placeholder="tu@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="telefono" className="block text-sm font-medium text-slate-700 mb-1.5">
                            Teléfono / WhatsApp
                        </label>
                        <input
                            id="telefono"
                            name="telefono"
                            type="tel"
                            required
                            autoComplete="tel"
                            value={form.telefono}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] transition-colors"
                            placeholder="+54 9 11 1234-5678"
                        />
                    </div>

                    <div>
                        <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-slate-700 mb-1.5">
                            Fecha de nacimiento
                        </label>
                        <input
                            id="fecha_nacimiento"
                            name="fecha_nacimiento"
                            type="date"
                            required
                            value={form.fecha_nacimiento}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] transition-colors"
                        />
                    </div>

                    <div>
                        <label htmlFor="contrasenia" className="block text-sm font-medium text-slate-700 mb-1.5">
                            Contraseña
                        </label>
                        <input
                            id="contrasenia"
                            name="contrasenia"
                            type="password"
                            required
                            autoComplete="new-password"
                            minLength={8}
                            value={form.contrasenia}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] transition-colors"
                            placeholder="Mínimo 8 caracteres"
                        />
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={aceptaTerminos}
                            onChange={(e) => setAceptaTerminos(e.target.checked)}
                            className="mt-0.5 accent-[#4C1D95]"
                        />
                        <span className="text-sm text-slate-600">
                            Acepto los{" "}
                            <Link href="/terminos" target="_blank" className="text-[#4C1D95] underline">
                                Términos y Condiciones
                            </Link>{" "}
                            y la{" "}
                            <Link href="/privacidad" target="_blank" className="text-[#4C1D95] underline">
                                Política de Privacidad
                            </Link>
                            .
                        </span>
                    </label>

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
                        {loading ? "Creando cuenta..." : "Crear cuenta"}
                    </button>
                </form>
            </div>
        </div>
    );
}
