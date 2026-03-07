"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import InteractiveDemo from "./InteractiveDemo";
import { Menu, X, Play, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

/* ─── Estructura de navegación ─── */
interface NavChild {
  href: string;
  label: string;
}
interface NavItem {
  label: string;
  href?: string;
  children?: NavChild[];
}

const navItems: NavItem[] = [
  {
    label: "Atención Médica",
    children: [
      { href: "/atencion-medica/especialidades-medicas", label: "Especialidades Médicas" },
      { href: "/atencion-medica/descuentos-farmacias", label: "Descuentos en Farmacias" },
      { href: "/atencion-medica/llamadas-urgencias", label: "Llamadas de urgencias" },
      { href: "/atencion-medica/videollamada-inmediata", label: "Videollamada inmediata" },
      { href: "/atencion-medica/receta-medica", label: "Receta médica homologada" },
      { href: "/atencion-medica/historial-medico", label: "Historial Médico" },
    ],
  },
  {
    label: "Planes",
    children: [
      { href: "/planes/personales-familiares", label: "Planes Personales" },
      { href: "/planes/familiares", label: "Planes Familiares" },
      { href: "/planes/corporativos", label: "Planes Corporativos" },
    ],
  },
  {
    label: "App",
    children: [
      { href: "/app/como-funciona", label: "Cómo funciona" },
    ],
  },
  {
    label: "Blog",
    children: [
      { href: "/blog/preguntas-frecuentes", label: "Preguntas frecuentes (FAQ)" },
      { href: "/blog/noticias", label: "Noticias" },
    ],
  },
];

/* ─── Dropdown Desktop ─── */
function DesktopDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const isActive = item.children?.some((c) => pathname.startsWith(c.href));

  if (!item.children) {
    return (
      <Link
        href={item.href || "/"}
        className={`hover:text-[#4C1D95] transition-colors ${pathname === item.href ? "text-[#4C1D95]" : ""
          }`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className={`flex items-center gap-1 hover:text-[#4C1D95] transition-colors ${isActive ? "text-[#4C1D95]" : ""
          }`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {item.label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""
            }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50"
          >
            <div className="bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/50 py-2 min-w-[240px]">
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={() => setOpen(false)}
                  className={`block px-5 py-2.5 text-sm hover:bg-[#4C1D95]/5 hover:text-[#4C1D95] transition-colors ${pathname === child.href
                    ? "text-[#4C1D95] bg-[#4C1D95]/5"
                    : "text-slate-600"
                    }`}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Acordeón Mobile ─── */
function MobileAccordion({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (!item.children) {
    return (
      <Link
        href={item.href || "/"}
        onClick={onNavigate}
        className="block py-3 px-4 rounded-xl text-sm font-medium text-slate-700 hover:bg-[#4C1D95]/5 hover:text-[#4C1D95] transition-colors"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 px-4 rounded-xl text-sm font-medium text-slate-700 hover:bg-[#4C1D95]/5 hover:text-[#4C1D95] transition-colors"
        aria-expanded={open}
      >
        {item.label}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${open ? "rotate-180 text-[#4C1D95]" : ""
            }`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pl-4 pb-1 space-y-0.5">
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onNavigate}
                  className={`block py-2.5 px-4 rounded-lg text-sm transition-colors ${pathname === child.href
                    ? "text-[#4C1D95] bg-[#4C1D95]/5 font-semibold"
                    : "text-slate-500 hover:text-[#4C1D95] hover:bg-[#4C1D95]/5"
                    }`}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Navbar Principal ─── */
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Cerrar menú mobile en cambio de ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-100 z-50 h-20 transition-all">
      <div className="max-w-7xl mx-auto px-6 w-full h-full flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <span className="font-bold text-2xl md:text-3xl tracking-tight text-slate-900">
            CELDOCTOR
          </span>
        </Link>

        {/* Menú Desktop */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
          {navItems.map((item) => (
            <DesktopDropdown key={item.label} item={item} />
          ))}
        </div>

        {/* Botones de Acción (Desktop) */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <InteractiveDemo />
          </div>

          <Link
            href="/#waitlist"
            className="hidden sm:inline-flex bg-[#4C1D95] text-white px-4 md:px-6 py-2.5 rounded-lg text-xs font-bold hover:bg-[#2E1065] transition-all shadow-lg shadow-[#4C1D95]/25 hover:-translate-y-0.5 whitespace-nowrap"
          >
            Unirme a la lista de espera
          </Link>

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
            <div className="px-6 py-4 space-y-1 max-h-[calc(100vh-5rem)] overflow-y-auto">
              {navItems.map((item) => (
                <MobileAccordion
                  key={item.label}
                  item={item}
                  onNavigate={closeMenu}
                />
              ))}

              {/* CTA Mobile */}
              <div className="pt-3 space-y-2.5">
                <Link
                  href="/#waitlist"
                  onClick={closeMenu}
                  className="block w-full text-center bg-[#4C1D95] text-white py-3.5 rounded-xl text-sm font-bold hover:bg-[#2E1065] transition-all shadow-lg shadow-[#4C1D95]/25"
                >
                  Unirme a la lista de espera
                </Link>

                {/* Ver Demo */}
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