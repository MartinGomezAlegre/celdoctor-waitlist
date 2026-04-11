"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, LogOut, Menu, Play, X } from "lucide-react"
import InteractiveDemo from "./InteractiveDemo"
import { resolveAccountRoute } from "@/lib/account-route"
import { clearSessionCookie } from "@/lib/session-cookie"
import { useLocalStorageValue } from "@/lib/use-local-storage-value"

interface NavChild {
    href: string
    label: string
}

interface NavItem {
    label: string
    href?: string
    children?: NavChild[]
}

const navItems: NavItem[] = [
    {
        label: "Atencion Medica",
        children: [
            { href: "/atencion-medica/especialidades-medicas", label: "Especialidades Medicas" },
            { href: "/atencion-medica/receta-medica", label: "Receta medica homologada" },
            { href: "/atencion-medica/historial-medico", label: "Historial Medico" },
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
            { href: "/app/como-funciona", label: "Como funciona" },
        ],
    },
    {
        label: "Blog",
        children: [
            { href: "/blog/preguntas-frecuentes", label: "Preguntas frecuentes (FAQ)" },
            { href: "/blog/noticias", label: "Noticias" },
        ],
    },
]

function DesktopDropdown({ item }: { item: NavItem }) {
    const [open, setOpen] = useState(false)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const pathname = usePathname()

    const handleEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setOpen(true)
    }

    const handleLeave = () => {
        timeoutRef.current = setTimeout(() => setOpen(false), 150)
    }

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    const isActive = item.children?.some((child) => pathname.startsWith(child.href))

    if (!item.children) {
        return (
            <Link
                href={item.href || "/"}
                className={`transition-colors hover:text-[#4C1D95] ${pathname === item.href ? "text-[#4C1D95]" : ""}`}
            >
                {item.label}
            </Link>
        )
    }

    return (
        <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
            <button
                className={`flex items-center gap-1 transition-colors hover:text-[#4C1D95] ${isActive ? "text-[#4C1D95]" : ""}`}
                onClick={() => setOpen(!open)}
                aria-expanded={open}
            >
                {item.label}
                <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-1/2 z-50 -translate-x-1/2 pt-3"
                    >
                        <div className="min-w-[240px] rounded-xl border border-slate-100 bg-white py-2 shadow-xl shadow-slate-200/50">
                            {item.children.map((child) => (
                                <Link
                                    key={child.href}
                                    href={child.href}
                                    onClick={() => setOpen(false)}
                                    className={`block px-5 py-2.5 text-sm transition-colors hover:bg-[#4C1D95]/5 hover:text-[#4C1D95] ${
                                        pathname === child.href ? "bg-[#4C1D95]/5 text-[#4C1D95]" : "text-slate-600"
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
    )
}

function MobileAccordion({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    if (!item.children) {
        return (
            <Link
                href={item.href || "/"}
                onClick={onNavigate}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-[#4C1D95]/5 hover:text-[#4C1D95]"
            >
                {item.label}
            </Link>
        )
    }

    return (
        <div>
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-[#4C1D95]/5 hover:text-[#4C1D95]"
                aria-expanded={open}
            >
                {item.label}
                <ChevronDown size={16} className={`transition-transform duration-200 ${open ? "rotate-180 text-[#4C1D95]" : ""}`} />
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
                        <div className="space-y-0.5 pb-1 pl-4">
                            {item.children.map((child) => (
                                <Link
                                    key={child.href}
                                    href={child.href}
                                    onClick={onNavigate}
                                    className={`block rounded-lg px-4 py-2.5 text-sm transition-colors ${
                                        pathname === child.href
                                            ? "bg-[#4C1D95]/5 font-semibold text-[#4C1D95]"
                                            : "text-slate-500 hover:bg-[#4C1D95]/5 hover:text-[#4C1D95]"
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
    )
}

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [token, setToken] = useLocalStorageValue("celdoctor_token")
    const [nombre, setNombre] = useLocalStorageValue("celdoctor_nombre")
    const [rol, setRol] = useLocalStorageValue("celdoctor_rol")
    const router = useRouter()

    const closeMenu = useCallback(() => {
        setIsMenuOpen(false)
    }, [])

    function handleLogout() {
        localStorage.removeItem("celdoctor_token")
        localStorage.removeItem("celdoctor_nombre")
        localStorage.removeItem("celdoctor_email")
        localStorage.removeItem("celdoctor_rol")
        clearSessionCookie("celdoctor_token")
        setToken(null)
        setNombre(null)
        setRol(null)
        closeMenu()
        router.push("/login")
    }

    const accountRoute = resolveAccountRoute(rol)

    return (
        <nav className="sticky top-0 z-50 h-20 w-full border-b border-slate-100 bg-white/95 backdrop-blur-xl transition-all">
            <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-6">
                <Link href="/" onClick={closeMenu} className="flex cursor-pointer select-none items-center gap-2">
                    <span className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                        CELDOCTOR
                    </span>
                </Link>

                <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex">
                    {navItems.map((item) => (
                        <DesktopDropdown key={item.label} item={item} />
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:block">
                        <InteractiveDemo />
                    </div>

                    {token ? (
                        <>
                            {nombre && (
                                <span className="hidden whitespace-nowrap text-xs font-medium text-slate-500 md:block">
                                    Hola, {nombre}
                                </span>
                            )}
                            <Link
                                href={accountRoute}
                                className="hidden items-center whitespace-nowrap rounded-lg border border-[#4C1D95] px-4 py-2.5 text-xs font-bold text-[#4C1D95] transition-all hover:bg-[#4C1D95]/5 sm:inline-flex"
                            >
                                Mi cuenta
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="hidden items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#4C1D95] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#4C1D95]/25 transition-all hover:bg-[#2E1065] sm:inline-flex md:px-5"
                            >
                                <LogOut size={13} />
                                Cerrar sesion
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="hidden items-center whitespace-nowrap rounded-lg border border-[#4C1D95] px-4 py-2.5 text-xs font-bold text-[#4C1D95] transition-all hover:bg-[#4C1D95]/5 sm:inline-flex"
                            >
                                Iniciar sesion
                            </Link>
                            <Link
                                href="/registro"
                                className="hidden whitespace-nowrap rounded-lg bg-[#4C1D95] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#4C1D95]/25 transition-all hover:-translate-y-0.5 hover:bg-[#2E1065] sm:inline-flex md:px-6"
                            >
                                Registrarme
                            </Link>
                        </>
                    )}

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
                        aria-label={isMenuOpen ? "Cerrar menu" : "Abrir menu"}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden border-b border-slate-100 bg-white shadow-lg lg:hidden"
                    >
                        <div className="max-h-[calc(100vh-5rem)] space-y-1 overflow-y-auto px-6 py-4">
                            {navItems.map((item) => (
                                <MobileAccordion key={item.label} item={item} onNavigate={closeMenu} />
                            ))}

                            <div className="space-y-2.5 pt-3">
                                {token ? (
                                    <>
                                        {nombre && (
                                            <p className="pb-1 text-center text-xs font-medium text-slate-500">
                                                Hola, {nombre}
                                            </p>
                                        )}
                                        <Link
                                            href={accountRoute}
                                            onClick={closeMenu}
                                            className="block w-full rounded-xl border border-[#4C1D95] py-3.5 text-center text-sm font-bold text-[#4C1D95] transition-all hover:bg-[#4C1D95]/5"
                                        >
                                            Mi cuenta
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4C1D95] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4C1D95]/25 transition-all hover:bg-[#2E1065]"
                                        >
                                            <LogOut size={15} />
                                            Cerrar sesion
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/registro"
                                            onClick={closeMenu}
                                            className="block w-full rounded-xl bg-[#4C1D95] py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-[#4C1D95]/25 transition-all hover:bg-[#2E1065]"
                                        >
                                            Registrarme
                                        </Link>
                                        <Link
                                            href="/login"
                                            onClick={closeMenu}
                                            className="block w-full rounded-xl border border-[#4C1D95] py-3.5 text-center text-sm font-bold text-[#4C1D95] transition-all hover:bg-[#4C1D95]/5"
                                        >
                                            Iniciar sesion
                                        </Link>
                                    </>
                                )}

                                <div className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-[#4C1D95]/20 bg-[#4C1D95]/5 py-3.5 text-sm font-bold text-[#4C1D95] transition-all hover:bg-[#4C1D95]/10">
                                    <Play size={16} className="pointer-events-none fill-[#4C1D95]/20" />
                                    <span className="pointer-events-none">Ver Demo Interactiva</span>
                                    <div className="absolute inset-0 z-10 opacity-0 [&_button]:h-full [&_button]:w-full [&_button]:cursor-pointer">
                                        <InteractiveDemo />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
