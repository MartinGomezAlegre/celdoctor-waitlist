"use client";

import { useEffect, useState } from "react";
import { obtenerMiSuscripcion, type Suscripcion } from "@/lib/api";

export function useCurrentSubscription() {
    const [suscripcion, setSuscripcion] = useState<Suscripcion | null>(null);
    const [sessionChecked, setSessionChecked] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [cargandoSuscripcion, setCargandoSuscripcion] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function cargarSesion() {
            setCargandoSuscripcion(true);

            const response = await fetch("/api/session/me?scope=customer", {
                cache: "no-store",
                credentials: "same-origin",
            }).catch(() => null);

            if (!response || response.status === 401 || response.status === 403) {
                if (!cancelled) {
                    setIsAuthenticated(false);
                    setSuscripcion(null);
                    setSessionChecked(true);
                    setCargandoSuscripcion(false);
                }
                return;
            }

            if (!response.ok) {
                if (!cancelled) {
                    setIsAuthenticated(false);
                    setSuscripcion(null);
                    setSessionChecked(true);
                    setCargandoSuscripcion(false);
                }
                return;
            }

            if (!cancelled) {
                setIsAuthenticated(true);
                setSessionChecked(true);
            }

            try {
                const data = await obtenerMiSuscripcion();
                if (!cancelled) {
                    setSuscripcion(data);
                }
            } catch {
                if (!cancelled) {
                    setSuscripcion(null);
                }
            } finally {
                if (!cancelled) {
                    setCargandoSuscripcion(false);
                }
            }
        }

        void cargarSesion();

        return () => {
            cancelled = true;
        };
    }, []);

    return {
        isAuthenticated,
        sessionChecked,
        suscripcion,
        cargandoSuscripcion,
    };
}
