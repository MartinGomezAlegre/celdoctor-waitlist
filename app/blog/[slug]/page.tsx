import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { blogPosts, getPostBySlug } from "@/components/blog/blog.data";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return {};
    return {
        title: post.titulo,
        description: post.descripcion,
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) notFound();

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-3xl mx-auto px-6 py-16">
                {/* Back */}
                <Link
                    href="/blog/noticias"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#4C1D95] transition-colors mb-10"
                >
                    <ArrowLeft size={16} />
                    Volver a noticias
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg border bg-[#4C1D95]/5 border-[#4C1D95]/10 text-[#4C1D95] text-[11px] font-bold uppercase tracking-wider mb-4">
                        {post.categoria}
                    </span>
                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-3">
                        {post.titulo}
                    </h1>
                    <p className="text-sm text-slate-400 font-medium">{post.fecha}</p>
                </div>

                <div className="rounded-2xl overflow-hidden mb-10 aspect-video relative">
                    <Image
                        src="/Medicos.jpeg"
                        alt="CelDoctor - equipo médico"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#1e0b4b]/30 to-transparent" />
                </div>

                {/* Content */}
                <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-slate-600 leading-relaxed">{post.descripcion}</p>
                    <p className="text-slate-500 leading-relaxed mt-4">
                        Este artículo está siendo preparado por el equipo de CelDoctor. Volvé pronto para leer el contenido completo.
                    </p>
                </div>

                {/* CTA */}
                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold text-slate-900">¿Todavía no usás CelDoctor?</p>
                        <p className="text-sm text-slate-500">Creá tu cuenta y accedé a atención médica digital 24/7.</p>
                    </div>
                    <Link
                        href="/registro"
                        className="px-6 py-3 bg-[#4C1D95] text-white rounded-xl font-bold text-sm hover:bg-[#3b1675] transition-all shadow-lg shadow-[#4C1D95]/20 whitespace-nowrap shrink-0"
                    >
                        Crear cuenta gratis
                    </Link>
                </div>
            </div>
        </div>
    );
}
