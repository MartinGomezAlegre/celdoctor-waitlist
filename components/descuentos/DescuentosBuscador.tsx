"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Pill, Lock } from "lucide-react";

interface Medicamento {
    nombre: string;
    laboratorio: string;
    presentacion: string;
    precio: string;
    categoria: string;
}

const MEDICAMENTOS: Medicamento[] = [
    { nombre: "Ibuprofeno 400mg", laboratorio: "Laboratorio Bagó", presentacion: "Comprimidos x 20", precio: "$3.200", categoria: "Analgésico" },
    { nombre: "Amoxicilina 500mg", laboratorio: "Roemmers", presentacion: "Cápsulas x 21", precio: "$8.500", categoria: "Antibiótico" },
    { nombre: "Omeprazol 20mg", laboratorio: "Gador", presentacion: "Cápsulas x 14", precio: "$4.100", categoria: "Gastro" },
    { nombre: "Losartán 50mg", laboratorio: "Elea", presentacion: "Comprimidos x 30", precio: "$6.800", categoria: "Cardiovascular" },
    { nombre: "Metformina 850mg", laboratorio: "Montpellier", presentacion: "Comprimidos x 60", precio: "$5.200", categoria: "Diabetes" },
    { nombre: "Atorvastatina 20mg", laboratorio: "Pfizer", presentacion: "Comprimidos x 30", precio: "$9.400", categoria: "Cardiovascular" },
    { nombre: "Paracetamol 500mg", laboratorio: "Bayer", presentacion: "Comprimidos x 24", precio: "$2.800", categoria: "Analgésico" },
    { nombre: "Clonazepam 0.5mg", laboratorio: "Roche", presentacion: "Comprimidos x 30", precio: "$7.600", categoria: "Neurológico" },
    { nombre: "Enalapril 10mg", laboratorio: "Gador", presentacion: "Comprimidos x 30", precio: "$4.900", categoria: "Cardiovascular" },
    { nombre: "Azitromicina 500mg", laboratorio: "Pfizer", presentacion: "Comprimidos x 3", precio: "$12.400", categoria: "Antibiótico" },
    { nombre: "Salbutamol", laboratorio: "GlaxoSmithKline", presentacion: "Aerosol x 200 dosis", precio: "$8.900", categoria: "Respiratorio" },
    { nombre: "Diclofenac 50mg", laboratorio: "Novartis", presentacion: "Comprimidos x 20", precio: "$3.600", categoria: "Antiinflamatorio" },
    { nombre: "Sertralina 50mg", laboratorio: "Roemmers", presentacion: "Comprimidos x 30", precio: "$11.200", categoria: "Psiquiátrico" },
    { nombre: "Levotiroxina 100mcg", laboratorio: "Elea", presentacion: "Comprimidos x 30", precio: "$6.100", categoria: "Hormonal" },
    { nombre: "Ranitidina 150mg", laboratorio: "Bagó", presentacion: "Comprimidos x 20", precio: "$3.800", categoria: "Gastro" },
];

const CATEGORIA_COLORS: Record<string, string> = {
    "Analgésico": "bg-orange-50 text-orange-700 border-orange-100",
    "Antibiótico": "bg-blue-50 text-blue-700 border-blue-100",
    "Gastro": "bg-green-50 text-green-700 border-green-100",
    "Cardiovascular": "bg-red-50 text-red-700 border-red-100",
    "Diabetes": "bg-purple-50 text-purple-700 border-purple-100",
    "Neurológico": "bg-indigo-50 text-indigo-700 border-indigo-100",
    "Respiratorio": "bg-cyan-50 text-cyan-700 border-cyan-100",
    "Antiinflamatorio": "bg-yellow-50 text-yellow-700 border-yellow-100",
    "Psiquiátrico": "bg-violet-50 text-violet-700 border-violet-100",
    "Hormonal": "bg-pink-50 text-pink-700 border-pink-100",
};

export default function DescuentosBuscador() {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const q = query.toLowerCase();
        if (q === "") return MEDICAMENTOS;
        return MEDICAMENTOS.filter(
            (m) => m.nombre.toLowerCase().includes(q) || m.laboratorio.toLowerCase().includes(q)
        );
    }, [query]);

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">Vademécum de medicamentos</h2>
                    <p className="text-slate-500 max-w-xl mx-auto">Consultá precios y disponibilidad en farmacias argentinas.</p>
                </div>

                {/* Search */}
                <div className="max-w-lg mx-auto mb-10">
                    <div className="relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscá por nombre o laboratorio..."
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20 focus:border-[#4C1D95]/40 transition-all shadow-sm"
                            aria-label="Buscar medicamento"
                        />
                    </div>
                </div>

                {/* Grid */}
                {filtered.length === 0 ? (
                    <div className="text-center py-16 max-w-md mx-auto">
                        <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Search size={28} className="text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-medium mb-4">
                            No encontramos ese medicamento en la vista previa.<br />
                            Suscribite para acceder al vademécum completo.
                        </p>
                        <Link
                            href="/planes"
                            className="inline-flex items-center px-6 py-3 bg-[#4C1D95] text-white rounded-xl text-sm font-bold hover:bg-[#3b1675] transition-all shadow-lg shadow-[#4C1D95]/20"
                        >
                            Ver planes
                        </Link>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                        {filtered.map((med, i) => {
                            const badgeClass = CATEGORIA_COLORS[med.categoria] ?? "bg-slate-50 text-slate-600 border-slate-100";
                            return (
                                <div
                                    key={i}
                                    className="p-5 rounded-2xl border border-slate-100 bg-white hover:border-[#4C1D95]/20 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#4C1D95]/5 flex items-center justify-center shrink-0">
                                            <Pill size={18} className="text-[#4C1D95]" />
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[11px] font-bold ${badgeClass}`}>
                                            {med.categoria}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-900 mb-0.5">{med.nombre}</h3>
                                    <p className="text-xs text-slate-400 mb-1">{med.laboratorio}</p>
                                    <p className="text-xs text-slate-500 mb-3">{med.presentacion}</p>
                                    <p className="text-lg font-bold text-[#4C1D95]">{med.precio}</p>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Paywall */}
                <div className="rounded-3xl bg-gradient-to-br from-[#4C1D95] to-[#2E1065] p-8 md:p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
                    <div className="relative z-10">
                        <div className="w-14 h-14 mx-auto bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center mb-5">
                            <Lock size={24} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Accedé al vademécum completo</h3>
                        <p className="text-white/70 max-w-xl mx-auto mb-6">
                            Más de 5.000 medicamentos con precios actualizados, disponibilidad en farmacias cercanas y alternativas genéricas.
                            Solo para suscriptores de CelDoctor.
                        </p>
                        <Link
                            href="/planes"
                            className="inline-flex items-center px-8 py-4 bg-white text-[#2E1065] rounded-xl font-bold hover:bg-slate-100 transition-all shadow-lg"
                        >
                            Suscribirme ahora
                        </Link>
                        <p className="mt-4 text-sm text-white/50">
                            ¿Ya tenés cuenta?{" "}
                            <Link href="/login" className="text-white/80 underline hover:text-white transition-colors">
                                Iniciá sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
