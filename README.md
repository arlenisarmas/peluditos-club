# Che Peludos

Tienda online de productos para mascotas. "Todo para consentir a tu peludito."

Este repo se construye por fases — historial completo, decisiones de diseño y auditoría de seguridad en [`docs/PROGRESS.md`](docs/PROGRESS.md).

- ✅ **Fase 1** — Tienda (frontend)
- ✅ **Fase 2** — Backend real (PostgreSQL + Prisma)
- ✅ **Fase 3** — Autenticación + panel admin con roles (RBAC)
- ⏳ **Fase 4** — Checkout + Mercado Pago (código listo, falta credenciales reales — **pendiente a propósito**)
- ✅ **Fase 5** — Cloudinary
- ✅ **Fase 6** — SEO + performance + seguridad
- ✅ **Fase 7** — Empaquetado final (este README, auditoría de seguridad, `.env.example`)

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4
- [PostgreSQL](https://www.postgresql.org) + [Prisma](https://www.prisma.io) (ORM) — catálogo, categorías, usuarios, pedidos
- [NextAuth (Auth.js v4)](https://next-auth.js.org) — login del panel admin (Credentials + JWT), con roles y permisos (RBAC)
- [Cloudinary](https://cloudinary.com) — imágenes de producto subidas desde el admin
- [Mercado Pago](https://www.mercadopago.com.ar) (Checkout Pro) — integrado, pendiente de credenciales reales
- Carrito con React Context + `localStorage` (checkout como invitado, sin cuenta de cliente)

## Arquitectura principal

- **Storefront público** (`src/app/(storefront)/`): home, tienda, categoría, producto, carrito, checkout, ofertas, nosotros, ayuda, contacto. Sin login — los clientes compran como invitados.
- **Panel admin** (`src/app/admin/`): protegido en dos capas — `src/proxy.ts` (chequeo rápido a nivel de request) + verificación real de sesión en `src/app/admin/(dashboard)/layout.tsx`. Cada Server Action que muta datos vuelve a validar sesión + usuario activo + permiso por su cuenta (`src/lib/authz.ts`) — nunca se confía en un botón oculto ni en un rol mandado desde el cliente.
- **Base de datos**: un solo `PrismaClient` (`src/lib/prisma.ts`), sin SQL crudo en ningún lado — todo pasa por el query builder de Prisma (parametrizado).
- **Imágenes de producto**: suben a Cloudinary desde el admin (`src/lib/cloudinary.ts`); las imágenes de marca/catálogo original quedan en `public/images/`, commiteadas a git.

## Roles administrativos (RBAC)

Permisos centralizados en `src/lib/permissions.ts` — ningún componente ni action decide por su cuenta qué puede hacer un rol.

| Rol | Puede |
|---|---|
| `SUPER_ADMIN` | Todo: productos, categorías, inventario, pedidos, usuarios |
| `ADMIN` | Productos, categorías, inventario, pedidos |
| `EDITOR` | Productos e imágenes (catálogo) |
| `INVENTORY` | Solo stock — no productos, no imágenes |

Un usuario `active: false` no puede loguearse, y las páginas/actions vuelven a chequear ese estado contra la base en cada request (no alcanza con un JWT viejo).

## Requisitos

- Node.js 20+
- PostgreSQL 14+ (local o remoto)
- Una cuenta de [Cloudinary](https://cloudinary.com/users/register/free) (gratis) para que funcione la subida de imágenes
- Opcional por ahora: cuenta de [Mercado Pago Developers](https://www.mercadopago.com.ar/developers) — la Fase 4 no está activa todavía

## Instalación y desarrollo local

```bash
npm install              # también genera el cliente de Prisma (postinstall)
cp .env.example .env     # completar con tus valores (ver más abajo)
npx prisma migrate dev   # aplica las migraciones versionadas de prisma/migrations/
npm run db:seed          # carga el catálogo inicial + tu primer SUPER_ADMIN
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) para la tienda, o [http://localhost:3000/admin/login](http://localhost:3000/admin/login) para el panel (con el `ADMIN_EMAIL`/`ADMIN_INITIAL_PASSWORD` que hayas puesto en `.env`). Los usuarios siguientes se crean desde `/admin/usuarios`, ya logueado como `SUPER_ADMIN` — no hace falta tocar `.env` de nuevo.

Otros comandos:

```bash
npm run build      # build de producción
npm run start      # sirve el build de producción
npm run lint       # ESLint
npx tsc --noEmit   # chequeo de tipos sin generar archivos
npm run db:studio  # explorador visual de la base de datos (Prisma Studio)
```

### Base de datos local (Windows)

Este proyecto se desarrolló con PostgreSQL instalado localmente vía `winget`:

```powershell
winget install --id PostgreSQL.PostgreSQL.17
```

El instalador deja un usuario `postgres` con contraseña `postgres` por defecto, escuchando en `localhost:5432`. Con eso:

```sql
-- una sola vez, con psql -U postgres:
CREATE DATABASE peluditos_club;
```

(El nombre de la base quedó así desde antes del cambio de marca — renombrarla es una operación sobre la base real, no solo texto, así que se dejó como está: es un detalle interno, no algo que vea nadie.)

### Migraciones de Prisma

El historial completo vive en `prisma/migrations/` y se commitea a git. Para una migración nueva durante desarrollo:

```bash
npx prisma migrate dev --name algo_descriptivo
```

Antes de aplicar una migración que renombra o reestructura una tabla con datos reales, generarla con `--create-only` y revisar el SQL a mano (Prisma no detecta renombres solo — ve "se borró un modelo, se creó otro" y por default genera un `DROP TABLE` + `CREATE TABLE`, perdiendo los datos existentes). Así se hizo, por ejemplo, al pasar de un único `AdminUser` a `User` con roles.

### Primer `SUPER_ADMIN`

`npm run db:seed` crea el usuario de `ADMIN_EMAIL`/`ADMIN_INITIAL_PASSWORD` **solo si ese email no existe todavía** — si ya existe, no le toca ni la contraseña ni el rol (así una corrida accidental del seed no resetea credenciales sin querer). Después de loguearte por primera vez, cambiá esa contraseña desde `/admin/perfil` y creá el resto de los usuarios desde `/admin/usuarios`.

### Cloudinary

Las imágenes que se suben desde `/admin/productos` van a Cloudinary (`src/lib/cloudinary.ts`), con optimización automática de formato/calidad (`f_auto`/`q_auto`) y validación server-side de tipo (JPG/PNG/WebP) y tamaño (5 MB). Sin las tres variables de entorno (`CLOUDINARY_CLOUD_NAME`/`CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET`), subir una imagen muestra un error explicando qué falta — el resto del panel funciona igual.

## Variables de entorno

Ver [`.env.example`](.env.example) para la lista completa y comentada. Resumen:

| Variable | Para qué | Requerida |
|---|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL | Sí |
| `NEXTAUTH_URL` | Base URL que usa NextAuth para sus propias redirecciones/cookies | Sí |
| `NEXTAUTH_SECRET` | Firma los JWT de sesión | Sí |
| `NEXT_PUBLIC_SITE_URL` | Dominio público (metadata, Open Graph, sitemap, robots, JSON-LD, canonical) | Recomendada en producción (si falta, cae a `NEXTAUTH_URL`) |
| `ADMIN_EMAIL` / `ADMIN_INITIAL_PASSWORD` | Bootstrap del primer `SUPER_ADMIN` (una sola vez, vía seed) | Solo para el primer seed |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Subida de imágenes de producto | Para que funcione esa parte del admin |
| `MP_ACCESS_TOKEN` / `MP_PUBLIC_KEY` | Checkout Pro de Mercado Pago | Todavía no (Fase 4 pendiente) |

`.env` nunca se commitea (ver `.gitignore`) — se verificó que no haya quedado ningún secreto en el historial de git.

## Panel admin (`/admin`)

- **Usuarios y roles** (`/admin/usuarios`, solo `SUPER_ADMIN`): crear, cambiar rol, activar/desactivar, resetear contraseña. No se puede desactivar la propia cuenta ni dejar el sistema sin ningún `SUPER_ADMIN` activo.
- **Mi perfil** (`/admin/perfil`): cambiar la propia contraseña (pide la actual).
- **¿Olvidaste tu contraseña?** (`/admin/forgot-password` → `/admin/reset-password`): token de un solo uso, expira a los 45 minutos, mensaje siempre genérico (no confirma si el email existe). Sin proveedor de email todavía: el link se loguea en el servidor, y solo se muestra en pantalla fuera de `NODE_ENV=production`.
- **Productos**: crear, editar, borrar, activar/ocultar, destacar, precio/descuento, stock, categoría, talles y colores.
- **Imágenes de producto**: subida con preview, elegir principal, reordenar, reemplazar, borrar (ver sección Cloudinary arriba).
- **Categorías**: crear, editar, borrar (si no tienen productos), reordenar.
- **Inventario**: agotados / stock bajo (≤10) / stock normal, con el stock editable ahí mismo (el rol `INVENTORY` puede tocar esto sin acceso al resto del producto).
- **Pedidos**: pantalla lista pero vacía hasta conectar Mercado Pago (Fase 4).

## SEO, performance y seguridad

Resumen — detalle completo y hallazgos de la auditoría en [`docs/PROGRESS.md`](docs/PROGRESS.md):

- **SEO**: JSON-LD (schema.org `Product`) por página de producto, sitemap y robots dinámicos, Open Graph/Twitter, `canonical` en las páginas públicas principales.
- **Seguridad de aplicación**: headers estándar (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`), rate limiting en login/forgot-password/webhook, validación con Zod en todas las Server Actions, límite de tamaño de subida alineado entre Next.js y la validación propia (5 MB), CSRF cubierto por la protección nativa de Server Actions (compara `Origin` contra `Host`).
- **Pendiente antes de producción** (documentado, no bloquea desarrollo): mover el rate limiting de memoria a un store compartido tipo Upstash Redis (en Vercel serverless cada instancia tiene su propio contador), evaluar 2FA para `SUPER_ADMIN`, verificar la firma del webhook de Mercado Pago cuando se active la Fase 4.

## Marca y contacto

- **Nombre**: Che Peludos. **Email**: `chepeludos@gmail.com`. **Redes**: [Instagram](https://www.instagram.com/chepeludos) y [TikTok](https://www.tiktok.com/@chepeludos) (`src/lib/social.ts`) — no se muestran Facebook/YouTube/X porque todavía no hay cuenta real.
- **Dominio de producción**: `chepeludos.shop`, vía `NEXT_PUBLIC_SITE_URL`.

## Assets de `/public`

Ver la tabla de origen/licencia por carpeta en `docs/PROGRESS.md` — en resumen: el logo es propio, las fotos/banners/íconos son del usuario (licencia según lo que haya provisto, no verificable por el asistente que arma este repo), y los logos de medios de pago son marcas de terceros mostradas para indicar qué se acepta (uso habitual en e-commerce).

## Deploy (cuando se decida publicar)

```text
GitHub  →  Vercel  →  variables de entorno  →  PostgreSQL remoto  →  Cloudinary  →  chepeludos.shop
```

1. **GitHub**: este repo, rama `master`. Dependabot ya está activo (alerts + security updates + `.github/dependabot.yml`); considerar branch protection en `master` recién cuando haya más de un colaborador.
2. **Vercel**: importar el repo. Vercel ya incluye protección de DDoS de red/aplicación en todos los planes — no hace falta nada extra para el volumen esperado. Si más adelante aparece scraping agresivo, sumar Cloudflare (DNS + proxy) delante del dominio.
3. **Variables de entorno** (en el proyecto de Vercel, no en `.env`): las de la tabla de arriba. Importante: `NEXTAUTH_URL` y `NEXT_PUBLIC_SITE_URL` deben ser `https://chepeludos.shop` — las cookies de sesión solo llevan `Secure` si `NEXTAUTH_URL` empieza con `https://`.
4. **PostgreSQL remoto**: cualquier proveedor administrado (Neon, Supabase, Railway) sirve — solo cambia `DATABASE_URL`. Confirmar que el plan elegido tenga backups automáticos con la retención que haga falta.
5. **Cloudinary**: la misma cuenta ya creada, o una nueva para producción si se prefiere separar de desarrollo.
6. **Dominio**: apuntar `chepeludos.shop` al proyecto de Vercel.
7. **Mercado Pago**: paso posterior, expresamente pendiente — no se activa en este deploy.

## Estructura de carpetas

```
prisma/
  schema.prisma          Modelos Product, Category, User (roles), PasswordResetToken, Order
  migrations/              Historial de migraciones (se commitea a git)
  seed.ts / seed-data.ts   Script de seed — seed-data.ts tiene el catálogo original de la Fase 1
src/
  app/
    (storefront)/         Rutas públicas: home, tienda, categoría, producto, carrito, checkout, etc.
    admin/
      login/                Login (sin el shell del panel)
      forgot-password/      Pedir recuperación de contraseña (público)
      reset-password/       Confirmar token + contraseña nueva (público)
      (dashboard)/          Resto del panel (productos, categorías, inventario, pedidos, usuarios, perfil) — protegido
    api/
      auth/[...nextauth]/  Route handler de NextAuth
      webhooks/mercadopago/ Confirmación de pago (Fase 4)
  components/
    layout/              Header, Footer, MobileNav, PromoBar (tienda)
    admin/                AdminSidebar, ProductForm, ProductImageManager, UserForm, StockEditor, etc.
    home/                Hero, Benefits, CategorySection, CategoryCard, FeaturedProducts
    products/            ProductCard, ProductGrid, ProductGallery, ProductDetail, ProductFilters
    cart/                CartItem, CartSummary
    ui/                  Button, Badge, RatingStars, Decorations (SVG), PasswordInput, SocialLinks, ComingSoon
  lib/
    data/                products.ts, categories.ts — consultan Prisma; benefits.ts sigue siendo estático
    actions/              Server Actions (products, categories, inventory, users, profile, password-reset, checkout)
    auth.ts               Configuración de NextAuth (Credentials + JWT)
    authz.ts             requirePermission/requirePagePermission — RBAC centralizado
    permissions.ts       Qué puede hacer cada rol (única fuente de verdad)
    category-accent.ts  Color del círculo de flecha por categoría (home)
    cloudinary.ts        Config y helpers de Cloudinary (subida/borrado/optimización)
    rate-limit.ts        Limitador en memoria (login, forgot-password, webhook)
    prisma.ts             Instancia única de PrismaClient
    site.ts              Dominio público (NEXT_PUBLIC_SITE_URL con fallbacks)
    types.ts             Product, Category, CartLine
    cart-context.tsx     Carrito (Context + localStorage)
    filters.ts           Filtrado/orden de productos (tienda y categoría)
  proxy.ts               Protege /admin (excepto login/forgot-password/reset-password) a nivel de request
public/
  images/                dogs/, icons/, brand/, banners/ — assets del usuario, ya procesados (ver licencias arriba)
                          products/ — imágenes subidas desde el admin (no se commitea, ver .gitignore)
scripts/
  process-assets.mjs     Script (ya ejecutado) que limpió el fondo de los assets originales
docs/
  PROGRESS.md             Historial de fases, decisiones y auditoría de seguridad completa
  design-reference/       Los 2 mockups completos (mobile/desktop) como referencia visual — no se sirven en el sitio
.github/
  dependabot.yml         Chequeo semanal de dependencias npm (ignora saltos de versión mayor)
```
