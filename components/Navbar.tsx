"use client";

import React, { useState, useCallback } from "react";
import InteractiveDemo from "./InteractiveDemo";
import { Menu, X, Play } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { href: "#especialidades", label: "Especialidades" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#planes", label: "Planes" },
  { href: "#empresas", label: "Empresas" },
];

function scrollToSection(href: string) {
  const targetId = href.replace("#", "");
  const element = document.getElementById(targetId);

  if (element) {
    const navbarHeight = 80;
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - navbarHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();

      if (isMenuOpen) {
        // Close menu first, then scroll after the animation completes
        setIsMenuOpen(false);
        setTimeout(() => scrollToSection(href), 250);
      } else {
        scrollToSection(href);
      }
    },
    [isMenuOpen]
  );

  return (
    <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-100 z-50 h-20 transition-all">
      <div className="max-w-7xl mx-auto px-6 w-full h-full flex items-center justify-between">

        {/* Logo — Click scrolls to top */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            if (isMenuOpen) setIsMenuOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <span className="font-bold text-2xl md:text-3xl tracking-tight text-slate-900">
            CELDOCTOR
          </span>
        </a>

        {/* Menú Desktop */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="hover:text-[#4C1D95] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Botones de Acción (Desktop) */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <InteractiveDemo />
          </div>

          <a
            href="#waitlist"
            onClick={(e) => handleNavClick(e, "#waitlist")}
            className="hidden sm:inline-flex bg-[#4C1D95] text-white px-4 md:px-6 py-2.5 rounded-lg text-xs font-bold hover:bg-[#2E1065] transition-all shadow-lg shadow-[#4C1D95]/25 hover:-translate-y-0.5 whitespace-nowrap"
          >
            Unirme a la lista de espera
          </a>

          {/* Botón Hamburguesa (Mobile) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-700"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Panel Mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="lg:hidden bg-white border-b border-slate-100 shadow-lg overflow-hidden"
          >
            <div className="px-6 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="block py-3 px-4 rounded-xl text-sm font-medium text-slate-700 hover:bg-[#4C1D95]/5 hover:text-[#4C1D95] transition-colors"
                >
                  {link.label}
                </a>
              ))}

              {/* CTA Mobile */}
              <div className="pt-3 space-y-2.5">
                <a
                  href="#waitlist"
                  onClick={(e) => handleNavClick(e, "#waitlist")}
                  className="block w-full text-center bg-[#4C1D95] text-white py-3.5 rounded-xl text-sm font-bold hover:bg-[#2E1065] transition-all shadow-lg shadow-[#4C1D95]/25"
                >
                  Unirme a la lista de espera
                </a>

                {/* Ver Demo — abre el modal directamente (no cerrar menú para no unmount) */}
                <div
                  className="relative flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold border border-[#4C1D95]/20 text-[#4C1D95] bg-[#4C1D95]/5 hover:bg-[#4C1D95]/10 transition-all overflow-hidden"
                >
                  <Play size={16} className="fill-[#4C1D95]/20 pointer-events-none" />
                  <span className="pointer-events-none">Ver Demo Interactiva</span>
                  <div className="absolute inset-0 opacity-0 z-10 [&_button]:w-full [&_button]:h-full [&_button]:cursor-pointer">
                    <InteractiveDemo />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}