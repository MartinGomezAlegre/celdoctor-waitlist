# 🏥 CelDoctor — Hospital Digital en tu Bolsillo

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**CelDoctor** es una plataforma de telemedicina diseñada para democratizar el acceso a atención médica de calidad en Argentina. Este repositorio contiene la **landing page de lista de espera** — el primer punto de contacto con pacientes, médicos y empresas interesados en sumarse a la plataforma antes de su lanzamiento oficial.

> 🎓 **Proyecto desarrollado por un estudiante de Ingeniería en Informática** como parte de un emprendimiento real de health-tech, aplicando mejores prácticas de desarrollo web profesional, seguridad y arquitectura de software.

---

## ✨ Características principales

### 🎯 Producto
- **Formulario de waitlist multi-perfil** — Soporte para pacientes, médicos y empresas con campos dinámicos y validación en tiempo real.
- **Demo interactiva** — Simulación guiada de la app en un mockup de teléfono con navegación entre pantallas (Home, Chat, Videollamada, Recetas, Perfil).
- **Secciones informativas** — Especialidades médicas, planes de cobertura, solución corporativa y flujo "Cómo funciona".

### 🔒 Seguridad
- **Validación con Zod v4** — Esquema estricto para todos los campos del formulario (email, WhatsApp, edad, tipo de usuario, provincia).
- **Sanitización anti-injection** — Protección contra formula injection en Google Sheets (caracteres `=`, `+`, `-`, `@`, `\t`, `\r`, `\n`).
- **Rate limiting dual** — Limitación por IP (`x-forwarded-for`) y por email (3 intentos / 60 segundos).
- **Honeypot anti-bot** — Campo invisible que devuelve un falso positivo a bots para no revelar información.
- **Security headers** — Content-Security-Policy, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.

### ⚡ Performance y SEO
- **Server Components** — `page.tsx` y `PlansSection` renderizan en el servidor, reduciendo el bundle del cliente.
- **Metadata optimizado** — Open Graph, Twitter Cards, JSON-LD (MedicalBusiness schema), robots, sitemap, keywords.
- **Static generation** — Todas las páginas se generan estáticamente en build time.
- **Font optimization** — Google Fonts (Inter) cargada via `next/font` sin layout shift.

### ♿ Accesibilidad (a11y)
- Labels semánticos (`htmlFor`/`id`, `sr-only`) en todos los inputs.
- Roles ARIA (`radiogroup`, `radio`, `alert`, `status`) en componentes interactivos.
- `focus:ring` visible en todos los elementos focuseables.
- Atributos `aria-expanded` y `aria-label` en controles dinámicos.

---

## 🛠️ Stack tecnológico

| Categoría | Tecnología | Versión |
|-----------|------------|---------|
| Framework | Next.js (App Router) | 16.1 |
| UI Library | React | 19 |
| Lenguaje | TypeScript | 5 |
| Estilos | Tailwind CSS | 4 |
| Animaciones | Framer Motion | 12 |
| Iconos | Lucide React | 0.562 |
| Validación | Zod | 4 |
| Linting | ESLint | 9 |

---

## 📁 Estructura del proyecto

```
celdoctor-waitlist/
├── app/
│   ├── actions.ts          # Server Action (validación, sanitización, rate limiting)
│   ├── globals.css          # Variables CSS y animaciones globales
│   ├── layout.tsx           # Root layout con metadata SEO
│   ├── loading.tsx          # Loading skeleton (Suspense)
│   ├── not-found.tsx        # Página 404 personalizada
│   └── page.tsx             # Página principal (Server Component)
├── components/
│   ├── interactive-demo/    # Sub-componentes del demo interactivo
│   │   ├── ChatScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── PhoneNavBar.tsx
│   │   ├── PhoneStatusBar.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── RecetasScreen.tsx
│   │   └── VideoScreen.tsx
│   ├── CorporateSection.tsx # Sección soluciones empresariales
│   ├── DoctorsSection.tsx   # Sección para profesionales médicos
│   ├── Footer.tsx           # Footer con navegación y contacto
│   ├── HeroSection.tsx      # Hero principal con CTA
│   ├── HowItWorksSection.tsx # Flujo de 3 pasos
│   ├── InteractiveDemo.tsx  # Orquestador del demo (modal + portal)
│   ├── JsonLd.tsx           # Datos estructurados para Google
│   ├── Navbar.tsx           # Navbar responsive con hamburger menu
│   ├── PlansSection.tsx     # Planes de cobertura (Server Component)
│   ├── SpecialtiesSection.tsx # Grid de especialidades médicas
│   └── WaitlistForm.tsx     # Formulario multi-perfil con validación
├── public/                  # Assets estáticos (imágenes, OG image)
├── next.config.ts           # Configuración de Next.js y security headers
└── tsconfig.json
```

---

## 🚀 Quick Start

### Prerrequisitos
- Node.js 18+ 
- npm, yarn o pnpm

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/celdoctor-waitlist.git
cd celdoctor-waitlist

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores (ver sección "Variables de entorno")

# 4. Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con hot-reload |
| `npm run build` | Build de producción optimizado |
| `npm run start` | Servidor de producción |
| `npm run lint` | Análisis estático con ESLint |

---

## ⚙️ Variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto:

```env
# URL del Google Apps Script que recibe los datos del formulario
GOOGLE_SHEETS_URL=https://script.google.com/macros/s/TU_SCRIPT_ID/exec

# URL base del sitio (para metadata SEO y Open Graph)
NEXT_PUBLIC_SITE_URL=https://celdoctor.com
```

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────┐
│                   Cliente                        │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ Navbar   │  │ Hero     │  │ InteractiveDemo│  │
│  │(client)  │  │(client)  │  │   (client)     │  │
│  └──────────┘  └──────────┘  └───────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │Specialt. │  │HowItWorks│  │  PlansSection  │  │
│  │(client)  │  │(server)  │  │   (server)     │  │
│  └──────────┘  └──────────┘  └───────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ Doctors  │  │Corporate │  │ WaitlistForm   │  │
│  │(client)  │  │(client)  │  │   (client)     │  │
│  └──────────┘  └──────────┘  └───────────────┘  │
└─────────────────────┬───────────────────────────┘
                      │ Server Action
                      ▼
┌─────────────────────────────────────────────────┐
│              actions.ts (Server)                 │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ Zod      │  │  Rate    │  │  Sanitize     │  │
│  │Validation│  │ Limiting │  │  for Sheets   │  │
│  └──────────┘  └──────────┘  └───────────────┘  │
└─────────────────────┬───────────────────────────┘
                      │ HTTPS POST
                      ▼
          ┌───────────────────────┐
          │   Google Sheets API   │
          │  (Google Apps Script) │
          └───────────────────────┘
```

---

## 📄 Licencia

Este proyecto es privado y de uso exclusivo para CelDoctor Argentina.

---

## 👤 Autor

**Martín Gómez Alegre**  
Estudiante de Ingeniería en Informática  

Desarrollado como proyecto de emprendimiento real, aplicando principios de ingeniería de software, seguridad web y diseño de interfaces modernas.
