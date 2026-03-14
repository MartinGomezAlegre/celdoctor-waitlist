"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Clock, Percent, ChevronDown, Star, Navigation } from "lucide-react";
import { farmacias, type Farmacia } from "./descuentos.data";

export default function DescuentosBuscador() {
    const [searchTerm, setSearchTerm] = useState("");
    const [tipoDescuento, setTipoDescuento] = useState("todos");
    const [selectedFarmacia, setSelectedFarmacia] = useState<Farmacia | null>(null);

    const filteredFarmacias = useMemo(() => {
        return farmacias.filter((f) => {
            const matchZona = searchTerm === "" || f.zona.toLowerCase().includes(searchTerm.toLowerCase()) || f.direccion.toLowerCase().includes(searchTerm.toLowerCase()) || f.nombre.toLowerCase().includes(searchTerm.toLowerCase());
            const matchTipo = tipoDescuento === "todos" || f.tipo === tipoDescuento;
            return matchZona && matchTipo;
        });
    }, [searchTerm, tipoDescuento]);

    return (
        <section id="buscador" className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header + Search */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Buscador de farmacias</h2>
                    <p className="text-slate-500 max-w-xl mx-auto">Encontrá la farmacia adherida más cercana a tu ubicación.</p>
                </div>

                <div className="max-w-3xl mx-auto mb-12">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100/80 p-3 flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Ingresá tu zona / ciudad"
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20 focus:border-[#4C1D95]/30 transition-all"
                                aria-label="Buscar farmacias por zona"
                            />
                        </div>
                        <div className="relative sm:w-48">
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <select
                                value={tipoDescuento}
                                onChange={(e) => setTipoDescuento(e.target.value)}
                                className="w-full appearance-none pl-4 pr-10 py-3.5 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20 focus:border-[#4C1D95]/30 transition-all cursor-pointer"
                                aria-label="Tipo de descuento"
                            >
                                <option value="todos">Todos</option>
                                <option value="cronicos">Crónicos</option>
                                <option value="materno">Materno</option>
                                <option value="general">General</option>
                            </select>
                        </div>
                        <button className="px-8 py-3.5 bg-[#4C1D95] text-white rounded-xl font-bold text-sm hover:bg-[#3b1675] transition-all shadow-lg shadow-[#4C1D95]/20 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 shrink-0">
                            <Search size={16} /> Buscar
                        </button>
                    </div>
                    <p className="text-center text-sm text-slate-400 mt-3">{filteredFarmacias.length} farmacia{filteredFarmacias.length !== 1 ? "s" : ""} encontrada{filteredFarmacias.length !== 1 ? "s" : ""}</p>
                </div>

                {/* Results + Map */}
                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Left — Pharmacy List */}
                    <div className="lg:col-span-3 space-y-4 max-h-[650px] overflow-y-auto pr-2">
                        <AnimatePresence mode="popLayout">
                            {filteredFarmacias.length === 0 ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                                    <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                        <Search size={32} className="text-slate-300" />
                                    </div>
                                    <p className="text-slate-400 font-medium">No se encontraron farmacias.</p>
                                </motion.div>
                            ) : (
                                filteredFarmacias.map((f) => (
                                    <motion.div
                                        key={f.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className={`p-6 rounded-2xl border transition-all cursor-pointer group ${selectedFarmacia?.id === f.id
                                                ? "border-[#4C1D95]/30 bg-[#4C1D95]/[0.02] shadow-lg shadow-[#4C1D95]/5"
                                                : "border-slate-100 bg-white hover:border-[#4C1D95]/15 hover:shadow-md"
                                            }`}
                                        onClick={() => setSelectedFarmacia(f)}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                    <h3 className="text-lg font-bold text-slate-900">{f.nombre}</h3>
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                                        <span className="text-sm font-semibold text-slate-700">{f.rating}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5 mb-4">
                                                    <p className="flex items-center gap-2 text-sm text-slate-500">
                                                        <MapPin size={14} className="shrink-0 text-slate-400" /> {f.direccion}, {f.zona}
                                                    </p>
                                                    <p className="flex items-center gap-2 text-sm text-slate-500">
                                                        <Clock size={14} className="shrink-0 text-slate-400" /> {f.horario}
                                                    </p>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#4C1D95]/5 text-[#4C1D95] text-xs font-bold border border-[#4C1D95]/10">
                                                        <Percent size={12} /> {f.descuento}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 text-slate-500 text-xs font-medium border border-slate-100">
                                                        <MapPin size={12} /> {f.zona}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedFarmacia(f); }}
                                                className="sm:self-center px-4 py-2.5 rounded-xl border border-[#4C1D95]/20 text-[#4C1D95] text-sm font-bold hover:bg-[#4C1D95] hover:text-white hover:shadow-lg hover:shadow-[#4C1D95]/20 transition-all shrink-0"
                                            >
                                                <span className="flex items-center gap-1.5"><Navigation size={14} /> Ver en mapa</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right — Mapa Argentina */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-24 rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 h-[450px] lg:h-[650px] relative shadow-xl shadow-slate-100/50">
                            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #4C1D95 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute top-[20%] left-0 right-0 h-px bg-[#4C1D95]" />
                                <div className="absolute top-[40%] left-0 right-0 h-px bg-[#4C1D95]" />
                                <div className="absolute top-[60%] left-0 right-0 h-px bg-[#4C1D95]" />
                                <div className="absolute top-[80%] left-0 right-0 h-px bg-[#4C1D95]" />
                                <div className="absolute left-[25%] top-0 bottom-0 w-px bg-[#4C1D95]" />
                                <div className="absolute left-[50%] top-0 bottom-0 w-px bg-[#4C1D95]" />
                                <div className="absolute left-[75%] top-0 bottom-0 w-px bg-[#4C1D95]" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50/50 pointer-events-none z-[1]" />

                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10">
                                {selectedFarmacia ? (
                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                                        <div className="w-16 h-16 mx-auto bg-[#4C1D95] rounded-full flex items-center justify-center shadow-xl shadow-[#4C1D95]/30 mb-4">
                                            <MapPin size={28} className="text-white" />
                                        </div>
                                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-xs">
                                            <h4 className="text-lg font-bold text-slate-900 mb-1">{selectedFarmacia.nombre}</h4>
                                            <p className="text-sm text-slate-500 mb-1">{selectedFarmacia.direccion}</p>
                                            <p className="text-sm text-slate-400 mb-3">{selectedFarmacia.zona} · {selectedFarmacia.horario}</p>
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4C1D95] text-white text-xs font-bold">
                                                <Percent size={12} /> {selectedFarmacia.descuento}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-4">Mapa de Argentina · Próximamente</p>
                                    </motion.div>
                                ) : (
                                    <div className="text-center">
                                        <div className="w-24 h-24 mx-auto bg-[#4C1D95]/10 rounded-full flex items-center justify-center mb-4">
                                            <MapPin size={44} className="text-[#4C1D95]/30" />
                                        </div>
                                        <h4 className="text-lg font-bold text-slate-400 mb-2">Mapa de Argentina</h4>
                                        <p className="text-sm text-slate-300 max-w-xs mx-auto">Seleccioná una farmacia del listado para ver su ubicación.</p>
                                        <p className="text-xs text-slate-300/70 mt-6">Mapa interactivo próximamente</p>
                                    </div>
                                )}
                            </div>

                            {/* Animated pins */}
                            {!selectedFarmacia && (
                                <>
                                    <div className="absolute top-[15%] left-[20%] w-3 h-3 rounded-full bg-[#4C1D95]/20 animate-pulse" />
                                    <div className="absolute top-[35%] right-[30%] w-3 h-3 rounded-full bg-[#7C3AED]/20 animate-pulse" style={{ animationDelay: "0.5s" }} />
                                    <div className="absolute bottom-[25%] left-[40%] w-3 h-3 rounded-full bg-[#4C1D95]/20 animate-pulse" style={{ animationDelay: "1s" }} />
                                    <div className="absolute top-[60%] right-[15%] w-3 h-3 rounded-full bg-[#7C3AED]/20 animate-pulse" style={{ animationDelay: "1.5s" }} />
                                    <div className="absolute bottom-[40%] left-[15%] w-3 h-3 rounded-full bg-[#4C1D95]/15 animate-pulse" style={{ animationDelay: "2s" }} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
