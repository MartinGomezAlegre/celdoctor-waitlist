"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, Clock } from "lucide-react";

const articles = [
    { id: 1, title: "5 beneficios de la telemedicina que no conocías", category: "Salud Digital", date: "Próximamente", readTime: "4 min", featured: true },
    { id: 2, title: "¿Cómo funciona una receta digital en Argentina?", category: "Normativa", date: "Próximamente", readTime: "6 min", featured: false },
    { id: 3, title: "La importancia del historial clínico digital", category: "Tecnología", date: "Próximamente", readTime: "5 min", featured: false },
    { id: 4, title: "Telemedicina para empresas: caso de éxito", category: "Corporativo", date: "Próximamente", readTime: "7 min", featured: false },
    { id: 5, title: "Especialidades más consultadas vía telemedicina", category: "Estadísticas", date: "Próximamente", readTime: "3 min", featured: false },
    { id: 6, title: "Cómo elegir el mejor plan de salud digital", category: "Guía", date: "Próximamente", readTime: "5 min", featured: false },
    { id: 7, title: "El crecimiento de la telemedicina en LATAM", category: "Salud Digital", date: "Próximamente", readTime: "8 min", featured: false },
    { id: 8, title: "Inteligencia artificial aplicada al triaje médico", category: "Tecnología", date: "Próximamente", readTime: "6 min", featured: false },
    { id: 9, title: "Descuentos en farmacias: todo lo que necesitás saber", category: "Guía", date: "Próximamente", readTime: "4 min", featured: false },
];

const categories = ["Todos", "Salud Digital", "Normativa", "Tecnología", "Corporativo", "Estadísticas", "Guía"];

export default function BlogSearchContent() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todos");

    const filtered = useMemo(() => {
        return articles.filter((a) => {
            const matchSearch = searchTerm === "" || a.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchCategory = selectedCategory === "Todos" || a.category === selectedCategory;
            return matchSearch && matchCategory;
        });
    }, [searchTerm, selectedCategory]);

    const featuredArticle = filtered.find((a) => a.featured);
    const restArticles = filtered.filter((a) => !a.featured);

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Search + Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-10">
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar artículos..."
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4C1D95]/20 focus:border-[#4C1D95]/30 transition-all"
                            aria-label="Buscar artículos"
                        />
                    </div>
                </div>

                {/* Category pills */}
                <div className="flex flex-wrap gap-2 mb-10">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedCategory === cat
                                ? "bg-[#4C1D95] text-white shadow-lg shadow-[#4C1D95]/20"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Results count */}
                <p className="text-sm text-slate-400 mb-8">{filtered.length} artículo{filtered.length !== 1 ? "s" : ""}</p>

                {/* Featured article */}
                {featuredArticle && (
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-10 rounded-3xl border border-slate-100 hover:border-[#4C1D95]/20 hover:shadow-xl hover:shadow-[#4C1D95]/5 transition-all bg-gradient-to-br from-white to-slate-50 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4C1D95] to-[#7C3AED]" />
                        <div className="flex flex-wrap gap-3 mb-4">
                            <span className="inline-block text-xs font-bold text-white bg-[#4C1D95] px-2.5 py-1 rounded-lg uppercase tracking-wider">
                                {featuredArticle.category}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-400">
                                <Clock size={12} /> {featuredArticle.readTime}
                            </span>
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 leading-tight">{featuredArticle.title}</h3>
                        <p className="text-sm font-medium text-slate-400">{featuredArticle.date}</p>
                    </motion.article>
                )}

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restArticles.map((a, i) => (
                        <motion.article
                            key={a.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="group p-8 rounded-2xl border border-slate-100 hover:border-[#4C1D95]/20 hover:shadow-xl hover:shadow-[#4C1D95]/5 transition-all bg-white relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                            <div className="flex flex-wrap gap-3 mb-3">
                                <span className="inline-block text-xs font-bold text-white bg-[#4C1D95] px-2.5 py-1 rounded-lg uppercase tracking-wider">
                                    {a.category}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-slate-400">
                                    <Clock size={12} /> {a.readTime}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug">{a.title}</h3>
                            <p className="text-xs text-slate-400 font-medium">{a.date}</p>
                        </motion.article>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-medium">No se encontraron artículos.</p>
                    </div>
                )}
            </div>
        </section >
    );
}
