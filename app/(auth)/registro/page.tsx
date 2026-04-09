"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { registrarUsuario } from "@/lib/api";

export default function RegistroPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        dni: "",
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
        if (!emailRegex.test(form.email)) return "El email no es valido.";
        const dniRegex = /^\d{7,8}$/;
        if (!dniRegex.test(form.dni)) return "Ingresa un DNI valido (7-8 digitos).";
        if (form.contrasenia.length < 8) return "La contrasena debe tener al menos 8 caracteres.";
        if (!aceptaTerminos) return "Debes aceptar los terminos y condiciones.";
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
            setError(err instanceof Error ? err.message : "Error de conexion");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-2xl">
            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
                <h1 className="mb-1 text-2xl font-bold text-slate-900">Crear cuenta</h1>
                <p className="mb-8 text-sm text-slate-500">
                    Ya tenes cuenta?{" "}
                    <Link href="/login" className="font-semibold text-[#4C1D95] hover:underline">
                        Iniciar sesion
                    </Link>
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="nombre" className="mb-1.5 block text-sm font-medium text-slate-700">
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
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                                placeholder="Juan"
                            />
                        </div>
                        <div>
                            <label htmlFor="apellido" className="mb-1.5 block text-sm font-medium text-slate-700">
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
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                                placeholder="Perez"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
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
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            placeholder="tu@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="telefono" className="mb-1.5 block text-sm font-medium text-slate-700">
                            Telefono / WhatsApp
                        </label>
                        <input
                            id="telefono"
                            name="telefono"
                            type="tel"
                            required
                            autoComplete="tel"
                            value={form.telefono}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            placeholder="+54 9 11 1234-5678"
                        />
                    </div>

                    <div>
                        <label htmlFor="dni" className="mb-1.5 block text-sm font-medium text-slate-700">
                            DNI
                        </label>
                        <input
                            id="dni"
                            name="dni"
                            type="text"
                            required
                            inputMode="numeric"
                            value={form.dni}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            placeholder="12345678"
                        />
                    </div>

                    <div>
                        <label htmlFor="fecha_nacimiento" className="mb-1.5 block text-sm font-medium text-slate-700">
                            Fecha de nacimiento
                        </label>
                        <input
                            id="fecha_nacimiento"
                            name="fecha_nacimiento"
                            type="date"
                            required
                            value={form.fecha_nacimiento}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 transition-colors focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                        />
                    </div>

                    <div>
                        <label htmlFor="contrasenia" className="mb-1.5 block text-sm font-medium text-slate-700">
                            Contrasena
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
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30"
                            placeholder="Minimo 8 caracteres"
                        />
                    </div>

                    <div className="rounded-2xl border border-[#4C1D95]/10 bg-[#4C1D95]/5 px-4 py-3 text-sm text-slate-600">
                        Despues de iniciar sesion te vamos a pedir tus datos fiscales y de domicilio para habilitar la contratacion de planes.
                    </div>

                    <label className="flex cursor-pointer items-start gap-3">
                        <input
                            type="checkbox"
                            checked={aceptaTerminos}
                            onChange={(e) => setAceptaTerminos(e.target.checked)}
                            className="mt-0.5 accent-[#4C1D95]"
                        />
                        <span className="text-sm text-slate-600">
                            Acepto los{" "}
                            <Link href="/terminos" target="_blank" className="text-[#4C1D95] underline">
                                Terminos y Condiciones
                            </Link>{" "}
                            y la{" "}
                            <Link href="/privacidad" target="_blank" className="text-[#4C1D95] underline">
                                Politica de Privacidad
                            </Link>
                            .
                        </span>
                    </label>

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
                        {loading ? "Creando cuenta..." : "Crear cuenta"}
                    </button>
                </form>
            </div>
        </div>
    );
}
