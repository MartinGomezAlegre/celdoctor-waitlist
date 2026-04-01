"use client";

import { useState } from "react";

const FORM_VACIO = {
    nombre_contacto: "",
    email: "",
    telefono: "",
    razon_social: "",
    cantidad_empleados: "",
    mensaje: "",
};

type Estado = "idle" | "loading" | "success" | "error";

function validar(form: typeof FORM_VACIO): string | null {
    if (form.nombre_contacto.trim().length < 2) return "El nombre debe tener al menos 2 caracteres";
    if (form.razon_social.trim().length < 2) return "La razón social debe tener al menos 2 caracteres";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return "El email no es válido";
    const telefonoLimpio = form.telefono.replace(/\D/g, "");
    if (telefonoLimpio.length < 8) return "El teléfono debe tener al menos 8 dígitos";
    const cantidadEmpleados = Number(form.cantidad_empleados);
    if (!Number.isInteger(cantidadEmpleados) || cantidadEmpleados <= 0) {
        return "Indicá la cantidad de empleados con un número válido";
    }
    return null;
}

export default function FormContactoEmpresarial() {
    const [form, setForm] = useState(FORM_VACIO);
    const [estado, setEstado] = useState<Estado>("idle");
    const [error, setError] = useState<string | null>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const validationError = validar(form);
        if (validationError) {
            setError(validationError);
            return;
        }

        setEstado("loading");

        try {
            const body = {
                nombre_contacto: form.nombre_contacto.trim(),
                email: form.email.trim(),
                telefono: form.telefono.trim(),
                razon_social: form.razon_social.trim(),
                cantidad_empleados: Number(form.cantidad_empleados),
                mensaje: form.mensaje.trim() || undefined,
            };

            const res = await fetch("/api/proxy/leads/empresarial", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setEstado("success");
                setForm(FORM_VACIO);
            } else {
                const detail = await res.json().catch(() => null) as { detail?: string } | null;
                setEstado("error");
                setError(detail?.detail || "No se pudo enviar el formulario. Intentá de nuevo.");
            }
        } catch {
            setEstado("error");
            setError("Error de conexión. Verificá tu internet e intentá de nuevo.");
        }
    }

    return (
        <section id="form-contacto-empresarial" className="py-20 px-6 bg-slate-50 scroll-mt-28">
            <div className="max-w-2xl mx-auto">

                {estado === "success" ? (
                    <div className="text-center space-y-6 py-12">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">¡Gracias!</h3>
                            <p className="text-slate-500">Tu solicitud ya ingresó al tablero comercial y te contactamos dentro de las próximas 24 horas hábiles.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Hablemos de tu empresa</h2>
                            <p className="text-slate-500">Completá el formulario y te contactamos en menos de 24 horas hábiles</p>
                        </div>

                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-5">
                            <div>
                                <label htmlFor="nombre_contacto" className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Nombre y apellido <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="nombre_contacto"
                                    name="nombre_contacto"
                                    type="text"
                                    required
                                    value={form.nombre_contacto}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] transition-colors"
                                    placeholder="Juan Pérez"
                                />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Email corporativo <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] transition-colors"
                                        placeholder="juan@empresa.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="telefono" className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Teléfono <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="telefono"
                                        name="telefono"
                                        type="tel"
                                        required
                                        value={form.telefono}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] transition-colors"
                                        placeholder="+54 9 11 1234-5678"
                                    />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="razon_social" className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Razón social <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="razon_social"
                                        name="razon_social"
                                        type="text"
                                        required
                                        value={form.razon_social}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] transition-colors"
                                        placeholder="Mi Empresa S.A."
                                    />
                                </div>
                                <div>
                                    <label htmlFor="cantidad_empleados" className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Cantidad de empleados <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="cantidad_empleados"
                                        name="cantidad_empleados"
                                        type="number"
                                        min="1"
                                        inputMode="numeric"
                                        required
                                        value={form.cantidad_empleados}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] transition-colors bg-white"
                                        placeholder="Ej: 35"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="mensaje" className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Mensaje
                                </label>
                                <textarea
                                    id="mensaje"
                                    name="mensaje"
                                    rows={4}
                                    value={form.mensaje}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/30 focus:border-[#4C1D95] transition-colors"
                                    placeholder="¿En qué podemos ayudarte?"
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={estado === "loading"}
                                className="w-full py-3.5 bg-[#4C1D95] text-white rounded-xl font-bold text-sm hover:bg-[#3b1675] transition-all shadow-lg shadow-[#4C1D95]/20 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {estado === "loading" ? "Enviando..." : "Solicitar información"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </section>
    );
}
