export interface BlogPost {
    id: number;
    titulo: string;
    fecha: string;
    categoria: string;
    descripcion: string;
    imagen: string | null;
    slug: string;
}

export const blogPosts: BlogPost[] = [
    {
        id: 1,
        titulo: "CelDoctor llega a Uruguay y Paraguay",
        fecha: "10 de marzo de 2026",
        categoria: "Expansión",
        descripcion:
            "Expandimos nuestros servicios de telemedicina a Uruguay y Paraguay, llevando atención médica digital a miles de nuevos pacientes.",
        imagen: null,
        slug: "celdoctor-llega-uruguay-paraguay",
    },
    {
        id: 2,
        titulo: "Nuevas especialidades disponibles en CelDoctor",
        fecha: "5 de marzo de 2026",
        categoria: "Producto",
        descripcion:
            "Sumamos dermatología, oftalmología y cardiología a nuestra red de especialistas disponibles 24/7.",
        imagen: null,
        slug: "nuevas-especialidades",
    },
    {
        id: 3,
        titulo: "CelDoctor supera los 10.000 usuarios activos",
        fecha: "28 de febrero de 2026",
        categoria: "Empresa",
        descripcion:
            "Un hito importante en nuestro crecimiento. Gracias a cada usuario que confió en nuestra plataforma.",
        imagen: null,
        slug: "10000-usuarios",
    },
    {
        id: 4,
        titulo: "Lanzamos el vademécum digital integrado",
        fecha: "20 de febrero de 2026",
        categoria: "Producto",
        descripcion:
            "Ahora podés consultar precios y disponibilidad de más de 5.000 medicamentos directamente desde CelDoctor.",
        imagen: null,
        slug: "vademecum-digital",
    },
    {
        id: 5,
        titulo: "Plan Empresarial: cuidá la salud de tu equipo",
        fecha: "15 de febrero de 2026",
        categoria: "Empresas",
        descripcion:
            "Presentamos nuestro plan corporativo con dashboard de gestión, factura A y account manager dedicado.",
        imagen: null,
        slug: "plan-empresarial",
    },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
    return blogPosts.find((p) => p.slug === slug);
}
