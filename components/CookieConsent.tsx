"use client"

import { useSyncExternalStore } from "react"

const STORAGE_KEY = "celdoctor_cookie_consent"
const CHANGE_EVENT = "celdoctor_cookie_consent_changed"

function subscribe(callback: () => void) {
    window.addEventListener("storage", callback)
    window.addEventListener(CHANGE_EVENT, callback)
    return () => {
        window.removeEventListener("storage", callback)
        window.removeEventListener(CHANGE_EVENT, callback)
    }
}

function getSnapshot() {
    return localStorage.getItem(STORAGE_KEY) ?? ""
}

function getServerSnapshot() {
    return "accepted"
}

export default function CookieConsent() {
    const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
    const visible = consent !== "accepted" && consent !== "necessary"

    function guardar(valor: "accepted" | "necessary") {
        localStorage.setItem(STORAGE_KEY, valor)
        window.dispatchEvent(new Event(CHANGE_EVENT))
    }

    if (!visible) return null

    return (
        <div className="fixed inset-x-0 bottom-0 z-[90] px-4 pb-4 sm:px-6">
            <div className="mx-auto flex max-w-5xl flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/15 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-bold text-slate-900">Cookies</p>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                        Usamos cookies necesarias para que la pagina funcione y, si aceptas, cookies de mejora para entender el uso del sitio.
                    </p>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => guardar("necessary")}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                    >
                        Solo necesarias
                    </button>
                    <button
                        type="button"
                        onClick={() => guardar("accepted")}
                        className="rounded-xl bg-[#4C1D95] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3b1675]"
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    )
}
