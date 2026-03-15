import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/components/blog/blog.data";

export const metadata: Metadata = {
    title: "Noticias CelDoctor",
    description: "Últimas noticias de CelDoctor: expansión, nuevos productos y novedades de la plataforma.",
};

const CATEGORIA_COLORS: Record<string, string> = {
    "Expansión": "bg-blue-50 text-blue-700 border-blue-100",
    "Producto": "bg-violet-50 text-violet-700 border-violet-100",
    "Empresa": "bg-emerald-50 text-emerald-700 border-emerald-100",
    "Empresas": "bg-orange-50 text-orange-700 border-orange-100",
};

function CategoryBadge({ categoria }: { categoria: string }) {
    const cls = CATEGORIA_COLORS[categoria] ?? "bg-slate-100 text-slate-600 border-slate-200";
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[11px] font-bold uppercase tracking-wider ${cls}`}>
            {categoria}
        </span>
    );
}

function PostPlaceholder() {
    return (
        <div className="w-full h-full bg-gradient-to-br from-[#4C1D95] to-[#2E1065] flex items-center justify-center">
            <span className="font-bold text-2xl text-white/20 tracking-tight select-none">CELDOCTOR</span>
        </div>
    );
}

export default function NoticiasPage() {
    const [featured, ...rest] = blogPosts;

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Noticias CelDoctor</h1>
                <p className="text-slate-500 mb-12">Últimas novedades sobre la plataforma y el equipo.</p>

                {/* Featured */}
                <Link href={`/blog/${featured.slug}`} className="group block mb-10">
                    <article className="rounded-3xl border border-slate-100 overflow-hidden hover:border-[#4C1D95]/20 hover:shadow-xl hover:shadow-[#4C1D95]/5 transition-all bg-white relative">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4C1D95] to-[#7C3AED]" />
                        <div className="grid md:grid-cols-2">
                            <div className="aspect-[16/9] md:aspect-auto min-h-[220px]">
                                <PostPlaceholder />
                            </div>
                            <div className="p-8 lg:p-10 flex flex-col justify-center">
                                <CategoryBadge categoria={featured.categoria} />
                                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mt-4 mb-3 leading-tight group-hover:text-[#4C1D95] transition-colors">
                                    {featured.titulo}
                                </h2>
                                <p className="text-slate-500 leading-relaxed mb-4">{featured.descripcion}</p>
                                <p className="text-sm text-slate-400 font-medium">{featured.fecha}</p>
                            </div>
                        </div>
                    </article>
                </Link>

                {/* Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {rest.map((post) => (
                        <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                            <article className="rounded-2xl border border-slate-100 overflow-hidden hover:border-[#4C1D95]/20 hover:shadow-xl hover:shadow-[#4C1D95]/5 transition-all bg-white h-full relative">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                                <div className="aspect-[16/7]">
                                    <PostPlaceholder />
                                </div>
                                <div className="p-6">
                                    <CategoryBadge categoria={post.categoria} />
                                    <h3 className="text-lg font-bold text-slate-900 mt-3 mb-2 leading-snug group-hover:text-[#4C1D95] transition-colors">
                                        {post.titulo}
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-relaxed mb-3">{post.descripcion}</p>
                                    <p className="text-xs text-slate-400 font-medium">{post.fecha}</p>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
