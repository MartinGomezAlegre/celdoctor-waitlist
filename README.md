# CELDOCTOR Platform

Este repositorio contiene el frontend principal de CELDOCTOR: la web publica, el checkout, el dashboard del cliente, el panel administrativo y el acceso comercial. Ya no es una simple waitlist; hoy funciona como la capa web de una plataforma de telemedicina con suscripcion, credencial digital y operacion interna.

## Que es el proyecto

CELDOCTOR es una plataforma de salud digital orientada a Argentina. El producto combina:

- sitio publico con contenido comercial y SEO
- venta de planes personales, familiares y corporativos
- login y dashboard para clientes
- credencial digital con QR dinamico
- validacion publica de credenciales
- panel administrativo para operar usuarios, empresas, soporte, leads y canal comercial
- panel comercial para brokers, vendedores directos y vendedores de broker

La aplicacion web vive en Next.js y habla con un backend FastAPI separado que concentra reglas de negocio, persistencia y autenticacion.

## Repositorios del sistema

La plataforma se divide en dos repos:

1. `celdoctor-waitlist`
   Frontend Next.js.
2. `broker-salud`
   Backend FastAPI + PostgreSQL.

Para una descripcion tecnica del backend, ver el README del repo `broker-salud`.

## Stack principal

| Capa | Tecnologia |
| --- | --- |
| Frontend | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Tipado | TypeScript 5 |
| Animacion y graficos | Framer Motion, Recharts |
| Proxy y sesion web | Route Handlers de Next |
| Rate limiting publico | Upstash Redis (formularios) |
| Backend consumido | FastAPI sobre Railway |

## Que incluye este repo

### Web publica

Rutas y secciones para captacion, informacion y conversion:

- home
- planes
- atencion medica
- blog
- terminos y privacidad
- formularios y llamadas a la accion

### Autenticacion web

Hay tres accesos distintos:

- cliente: `/login`
- admin: `/admin`
- comercial: `/comercial`

El frontend ya no depende de tokens en `localStorage` para operar la sesion. El login pasa por rutas internas de Next que:

1. envian credenciales al backend
2. validan que el rol corresponda al acceso correcto
3. guardan la sesion en cookie `httpOnly`
4. dejan que el proxy interno traduzca esa cookie a `Authorization: Bearer` hacia el backend

Esto reduce bastante la exposicion de tokens en el navegador.

### Checkout y suscripcion

El flujo actual incluye:

- seleccion de plan
- confirmacion
- upsell del seguro
- consulta de estado de suscripcion

### Dashboard del cliente

El dashboard del cliente concentra:

- saludo y estado del plan
- credencial digital
- gestion de cuenta
- datos personales y de facturacion
- soporte
- beneficiarios del plan familiar
- acceso a beneficios activos

### Credencial digital y QR

La app renderiza la credencial del titular y consume el backend para:

- obtener el QR dinamico
- ampliar la credencial
- abrir la validacion publica del QR

La ruta publica de validacion es:

- `/validar/[token]`

### Panel administrativo

La ruta principal es:

- `/admin/dashboard`

Desde ahi se operan secciones como:

- overview
- personas
- empresas
- suscripciones
- facturacion
- catalogo
- soporte
- leads
- upsells
- canal comercial

### Panel comercial

La ruta principal es:

- `/comercial/dashboard`

Segun el rol, el usuario puede ver:

- ventas aprobadas
- link de referido
- equipo de vendedores del broker
- soporte operativo

## Arquitectura web

El frontend trabaja con tres piezas principales:

### 1. UI y rutas

Las paginas estan en `app/` y combinan:

- rutas publicas
- rutas autenticadas
- paneles por rol

### 2. Session layer

Las rutas internas:

- `app/api/session/login/route.ts`
- `app/api/session/logout/route.ts`

administran la cookie segura de sesion.

### 3. API proxy

La ruta:

- `app/api/proxy/[...path]/route.ts`

actua como puente entre Next y FastAPI. Toma la cookie correcta segun el tipo de sesion y reenvia la request al backend. Esto permite:

- centralizar autenticacion
- ocultar el backend al navegador
- conservar una sola capa de consumo HTTP en el frontend

## Estructura resumida

```text
app/
  (auth)/                  login, registro y recuperacion
  admin/                   login admin y dashboard admin
  api/
    proxy/                 proxy al backend
    session/               login/logout con cookie httpOnly
  atencion-medica/         landings por beneficio
  blog/                    contenido SEO
  checkout/                compra, confirmacion y upsell
  comercial/               login y dashboard comercial
  dashboard/               dashboard del cliente
  planes/                  landings y variantes comerciales
  validar/                 validacion publica de QR

components/
  Navbar, Footer y bloques de UI compartidos

lib/
  api/                     clientes HTTP hacia el proxy
  session.ts               nombres de cookies y scopes
  commercial-session.ts    metadata no sensible del canal comercial
```

## Variables de entorno

Este repo usa principalmente:

```env
BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
GOOGLE_SHEETS_URL=https://script.google.com/macros/s/...
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

### Produccion

En Vercel, `BACKEND_URL` debe apuntar al backend publico, por ejemplo:

```env
BACKEND_URL=https://api.celdoctor.com
```

La URL publica del sitio deberia quedar alineada con el dominio activo:

```env
NEXT_PUBLIC_SITE_URL=https://www.celdoctor.com
NEXT_PUBLIC_BASE_URL=https://www.celdoctor.com
```

## Desarrollo local

```bash
npm install
npm run dev
```

La app levanta en:

- [http://localhost:3000](http://localhost:3000)

Para trabajar completa, necesita un backend local corriendo en `http://localhost:8000` o una `BACKEND_URL` que apunte a staging.

## Build y chequeos

```bash
npm run lint
npm run build
```

Estos dos comandos son hoy el smoke check minimo antes de subir cambios.

## Flujo end-to-end del sistema

1. El usuario navega la web publica y elige un plan.
2. Inicia sesion por la ruta correcta segun su rol.
3. Next valida credenciales contra FastAPI y guarda cookie `httpOnly`.
4. El frontend consume `/api/proxy/...`.
5. El proxy agrega autorizacion desde cookie y reenvia al backend.
6. El backend responde con datos de cuenta, suscripcion, credencial, soporte o panel interno.
7. El frontend renderiza dashboard, admin o panel comercial segun el rol.

## Estado funcional actual

Hoy el frontend ya cubre:

- experiencia publica completa
- login cliente/admin/comercial
- dashboards por rol
- credencial digital con QR
- validacion publica de credenciales
- admin operativo
- canal comercial

## Pendientes estrategicos del producto

Antes de un lanzamiento fuerte, las piezas tecnicas mas importantes a cerrar son:

- staging real
- Redis operativo por ambiente
- cron y jobs async
- pagos recurrentes
- invitaciones de cuenta
- bulk de empleados robusto
- paginacion server-side real en tablas grandes

## Como leer este proyecto rapido

Si alguien nuevo entra al repo, este es el orden que mas conviene:

1. `app/layout.tsx`
2. `app/page.tsx`
3. `app/api/session/login/route.ts`
4. `app/api/proxy/[...path]/route.ts`
5. `app/dashboard/page.tsx`
6. `app/admin/dashboard/page.tsx`
7. `app/comercial/dashboard/page.tsx`
8. `lib/api/`

Con ese recorrido se entiende casi toda la arquitectura web.
