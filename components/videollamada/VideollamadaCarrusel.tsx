"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, ChevronLeft, ChevronRight } from "lucide-react";
import { carouselSlides } from "./videollamada.data";

export default function VideollamadaCarrusel() {
    const [slideIndex, setSlideIndex] = useState(0);

    const prevSlide = () => setSlideIndex((i) => (i - 1 + carouselSlides.length) % carouselSlides.length);
    const nextSlide = () => setSlideIndex((i) => (i + 1) % carouselSlides.length);

    return (
        <section className="py-20 bg-white">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C1D95]/5 border border-[#4C1D95]/10 text-[#4C1D95] text-[11px] font-bold uppercase tracking-wider mb-4">
                        <Smartphone size={12} /> Funcionalidades
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Mirá todo lo que podés hacer</h2>
                    <p className="text-slate-500">Explorá las funciones de videollamada de CelDoctor.</p>
                </div>

                {/* Carousel */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-3 relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={slideIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="bg-slate-50 rounded-2xl aspect-[16/8] flex items-center justify-center relative overflow-hidden"
                        >
                            {/* Subtle wireframe */}
                            <div className="absolute inset-4 flex flex-col gap-3 opacity-15">
                                <div className="flex gap-3">
                                    <div className="w-28 h-7 bg-[#4C1D95]/10 rounded-lg" />
                                    <div className="flex-1" />
                                    <div className="w-20 h-7 bg-[#4C1D95]/10 rounded-lg" />
                                </div>
                                <div className="flex gap-3 flex-1">
                                    <div className="w-24 space-y-2">
                                        <div className="h-5 bg-[#4C1D95]/8 rounded" />
                                        <div className="h-5 bg-[#4C1D95]/15 rounded" />
                                        <div className="h-5 bg-[#4C1D95]/8 rounded" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex gap-2">
                                            <div className="flex-1 h-20 bg-[#4C1D95]/5 rounded-xl" />
                                            <div className="flex-1 h-20 bg-[#4C1D95]/5 rounded-xl" />
                                        </div>
                                        <div className="h-16 bg-[#4C1D95]/5 rounded-xl" />
                                    </div>
                                </div>
                            </div>
                            <div className="relative z-10 text-center">
                                <div className="w-14 h-14 mx-auto bg-[#4C1D95]/10 rounded-2xl flex items-center justify-center mb-3">
                                    <Smartphone size={28} className="text-[#4C1D95]/30" />
                                </div>
                                <p className="text-sm text-slate-400 font-bold">{carouselSlides[slideIndex].label}</p>
                                <p className="text-xs text-slate-300 mt-1">Feature Screenshot {slideIndex + 1}</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-lg text-slate-500 flex items-center justify-center hover:text-[#4C1D95] hover:border-[#4C1D95]/30 transition-all z-20"
                        aria-label="Anterior"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-lg text-slate-500 flex items-center justify-center hover:text-[#4C1D95] hover:border-[#4C1D95]/30 transition-all z-20"
                        aria-label="Siguiente"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

                {/* Dots */}
                <div className="flex gap-2 justify-center mt-5">
                    {carouselSlides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setSlideIndex(i)}
                            className={`h-2.5 rounded-full transition-all ${i === slideIndex ? "w-8 bg-[#4C1D95]" : "w-2.5 bg-slate-200 hover:bg-slate-300"}`}
                            aria-label={`Slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
