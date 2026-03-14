"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { carouselSlides } from "./descuentos.data";

export default function DescuentosCarrusel() {
    const [carouselIndex, setCarouselIndex] = useState(0);

    const nextSlide = () => setCarouselIndex((i) => (i + 1) % carouselSlides.length);
    const prevSlide = () => setCarouselIndex((i) => (i - 1 + carouselSlides.length) % carouselSlides.length);

    return (
        <section className="py-16 bg-gradient-to-br from-[#4C1D95] via-[#3b1675] to-[#2E1065] relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#7C3AED]/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-white mb-2">Ofertas destacadas</h2>
                    <p className="text-white/60">Descuentos rotativos exclusivos para miembros CelDoctor.</p>
                </div>

                {/* Carousel */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={carouselIndex}
                            initial={{ opacity: 0, x: 60 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -60 }}
                            transition={{ duration: 0.35 }}
                            className={`bg-gradient-to-br ${carouselSlides[carouselIndex].color} rounded-3xl p-10 lg:p-14 text-center border border-white/10 relative overflow-hidden`}
                        >
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                            <div className="relative z-10">
                                <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-white text-sm font-bold mb-5 backdrop-blur-sm border border-white/10">
                                    {carouselSlides[carouselIndex].badge}
                                </span>
                                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">{carouselSlides[carouselIndex].title}</h3>
                                <p className="text-white/80 text-lg max-w-lg mx-auto">{carouselSlides[carouselIndex].desc}</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button onClick={prevSlide} className="w-10 h-10 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center hover:bg-white/20 transition-all" aria-label="Anterior">
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex gap-2">
                            {carouselSlides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCarouselIndex(i)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === carouselIndex ? "bg-white w-8" : "bg-white/30 hover:bg-white/50"}`}
                                    aria-label={`Slide ${i + 1}`}
                                />
                            ))}
                        </div>
                        <button onClick={nextSlide} className="w-10 h-10 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center hover:bg-white/20 transition-all" aria-label="Siguiente">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
