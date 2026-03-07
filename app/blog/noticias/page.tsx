import React from "react";
import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import CTABanner from "@/components/shared/CTABanner";


export const metadata: Metadata = {
    title: "Noticias",
    description: "Últimas noticias de CelDoctor: actualizaciones, tendencias en telemedicina y salud digital.",
};

const news = [
    { category: "Plataforma", title: "CelDoctor abre su lista de espera para el lanzamiento 2026", excerpt: "La plataforma de telemedicina líder anuncia inscripciones anticipadas para la beta.", date: "Próximamente" },
    { category: "Normativa", title: "Argentina avanza en la regulación de recetas digitales", excerpt: "El marco normativo para la prescripción electrónica se fortalece, beneficiando plataformas como CelDoctor.", date: "Próximamente" },
    { category: "Salud Digital", title: "El crecimiento de la telemedicina en Latinoamérica", excerpt: "La región experimenta un boom en adopción de servicios de salud digital post-pandemia.", date: "Próximamente" },
    { category: "Corporativo", title: "Las empresas apuestan por beneficios de telemedicina", excerpt: "Cada vez más compañías incorporan servicios de salud digital para el bienestar de sus empleados.", date: "Próximamente" },
    { category: "Tecnología", title: "Inteligencia artificial aplicada al triaje médico", excerpt: "Las nuevas tecnologías de IA permiten una evaluación más rápida y precisa del paciente.", date: "Próximamente" },
    { category: "Impacto Social", title: "Telemedicina: democratizando el acceso a la salud", excerpt: "Cómo las plataformas digitales llevan atención médica de calidad a comunidades alejadas.", date: "Próximamente" },
];

export default function NoticiasPage() {
    return (
        <>
            <PageHero
                badge="Noticias"
                badgeIconName="Newspaper"
                title="Últimas novedades"
                highlight="de CelDoctor."
                subtitle="Seguí las últimas noticias sobre la plataforma, tendencias en telemedicina y el futuro de la salud digital."
                placeholderLabel="Noticias y Novedades"
                placeholderIconName="Newspaper"
                breadcrumbs={[
                    { label: "Inicio", href: "/" },
                    { label: "Blog", href: "/blog" },
                    { label: "Noticias" },
                ]}
            />

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-3 mb-12">
                        <h2 className="text-2xl font-bold text-slate-900">Artículos recientes</h2>
                        <span className="text-xs font-bold uppercase tracking-wider text-white bg-[#4C1D95] px-3 py-1 rounded-lg">
                            Próximamente
                        </span>
                    </div>

                    {/* Featured */}
                    <article className="mb-8 p-10 rounded-3xl border border-slate-100 hover:border-[#4C1D95]/20 hover:shadow-xl hover:shadow-[#4C1D95]/5 transition-all bg-gradient-to-br from-white to-slate-50 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4C1D95] to-[#7C3AED]" />
                        <span className="inline-block text-xs font-bold text-white bg-[#4C1D95] px-2.5 py-1 rounded-lg uppercase tracking-wider">
                            {news[0].category}
                        </span>
                        <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mt-4 mb-4 leading-tight">{news[0].title}</h3>
                        <p className="text-slate-500 text-lg leading-relaxed max-w-3xl mb-4">{news[0].excerpt}</p>
                        <p className="text-sm text-slate-400 font-medium">{news[0].date}</p>
                    </article>

                    {/* Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {news.slice(1).map((n, i) => (
                            <article
                                key={i}
                                className="group p-8 rounded-2xl border border-slate-100 hover:border-[#4C1D95]/20 hover:shadow-xl hover:shadow-[#4C1D95]/5 transition-all bg-white relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                                <span className="inline-block text-xs font-bold text-white bg-[#4C1D95] px-2.5 py-1 rounded-lg uppercase tracking-wider">
                                    {n.category}
                                </span>
                                <h3 className="text-lg font-bold text-slate-900 mt-3 mb-3 leading-snug">{n.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed mb-4">{n.excerpt}</p>
                                <p className="text-xs text-slate-400 font-medium">{n.date}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <CTABanner
                title="No te pierdas ninguna novedad."
                subtitle="Inscribite para recibir actualizaciones sobre CelDoctor."
            />
        </>
    );
}
