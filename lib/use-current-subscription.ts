"use client";

import { useEffect, useState } from "react";
import { obtenerMiSuscripcion, type Suscripcion } from "@/lib/api";
import { useLocalStorageValue } from "@/lib/use-local-storage-value";

export function useCurrentSubscription() {
    const [token, , tokenHydrated] = useLocalStorageValue("celdoctor_token");
    const [suscripcionInterna, setSuscripcionInterna] = useState<Suscripcion | null>(null);
    const [ultimoTokenCargado, setUltimoTokenCargado] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        if (!tokenHydrated || !token) {
            return;
        }

        obtenerMiSuscripcion(token)
            .then((data) => {
                if (!cancelled) {
                    setSuscripcionInterna(data);
                    setUltimoTokenCargado(token);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setSuscripcionInterna(null);
                    setUltimoTokenCargado(token);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [token, tokenHydrated]);

    const suscripcion = token ? suscripcionInterna : null;
    const cargandoSuscripcion = Boolean(token && tokenHydrated && ultimoTokenCargado !== token);

    return {
        token,
        tokenHydrated,
        suscripcion,
        cargandoSuscripcion,
    };
}
