import type { MetadataRoute } from "next";

const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL || "https://celdoctor.com";

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    return [
        // ─── HOME ───────────────────────────────────────────────
        {
            url: `${BASE_URL}/`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 1.0,
        },

        // ─── PLANES ─────────────────────────────────────────────
        {
            url: `${BASE_URL}/planes`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/planes/personales-familiares`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/planes/familiares`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/planes/corporativos`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/planes/aseguradoras`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.7,
        },

        // ─── ATENCIÓN MÉDICA ────────────────────────────────────
        {
            url: `${BASE_URL}/atencion-medica`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.85,
        },
        {
            url: `${BASE_URL}/atencion-medica/especialidades-medicas`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/atencion-medica/videollamada-inmediata`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/atencion-medica/receta-medica`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/atencion-medica/descuentos-farmacias`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.75,
        },
        {
            url: `${BASE_URL}/atencion-medica/llamadas-urgencias`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.75,
        },
        {
            url: `${BASE_URL}/atencion-medica/historial-medico`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.7,
        },

        // ─── APP ────────────────────────────────────────────────
        {
            url: `${BASE_URL}/app/como-funciona`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.75,
        },

        // ─── BLOG ───────────────────────────────────────────────
        {
            url: `${BASE_URL}/blog`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/blog/preguntas-frecuentes`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.65,
        },
        {
            url: `${BASE_URL}/blog/noticias`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.6,
        },

        // ─── AUTH (baja prioridad — no indexar acciones) ────────
        {
            url: `${BASE_URL}/login`,
            lastModified: now,
            changeFrequency: "yearly",
            priority: 0.4,
        },
        {
            url: `${BASE_URL}/registro`,
            lastModified: now,
            changeFrequency: "yearly",
            priority: 0.5,
        },

        // ─── LEGAL ──────────────────────────────────────────────
        {
            url: `${BASE_URL}/privacidad`,
            lastModified: now,
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/terminos`,
            lastModified: now,
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ];
}
