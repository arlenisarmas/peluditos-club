# Peluditos Club

Tienda online de productos para mascotas. "Todo para consentir a tu peludito."

Este repo se construye por fases — ver el estado actual en [`docs/PROGRESS.md`](docs/PROGRESS.md). Completas: **Fase 1** (tienda frontend), **Fase 2** (base de datos real) y **Fase 3** (autenticación + panel admin). En curso: **Fase 4** (checkout + Mercado Pago) y **Fase 5** (Cloudinary) — el código de ambas está listo, falta cargar credenciales reales (ver `.env.example`).

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4
- [PostgreSQL](https://www.postgresql.org) + [Prisma](https://www.prisma.io) (ORM) — catálogo de productos y categorías
- [NextAuth (Auth.js v4)](https://next-auth.js.org) — login del panel admin (usuario y contraseña, sin redes sociales)
- Carrito con React Context + `localStorage` (persiste entre recargas; todavía no tiene backend — llega en la Fase 4)

## Cómo correr el proyecto

Necesitás PostgreSQL corriendo localmente (ver más abajo) y un archivo `.env` completo (copiá `.env.example`).

```bash
npm install         # también genera el cliente de Prisma (postinstall)
npm run db:push      # o: npx prisma migrate dev, si vas a crear una migración nueva
npm run db:seed       # carga el catálogo inicial y el usuario admin (lee ADMIN_EMAIL/ADMIN_PASSWORD de .env)
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) para la tienda, o [http://localhost:3000/admin](http://localhost:3000/admin) para el panel admin (con el email/contraseña que hayas puesto en `ADMIN_EMAIL`/`ADMIN_PASSWORD`).

Otros comandos:

```bash
npm run build      # build de producción
npm run start      # sirve el build de producción
npm run lint       # ESLint
npm run db:studio  # explorador visual de la base de datos (Prisma Studio)
```

### Base de datos local (Windows)

Este proyecto se desarrolló con PostgreSQL instalado localmente vía `winget`:

```powershell
winget install --id PostgreSQL.PostgreSQL.17
```

El instalador de `winget` deja un usuario `postgres` con contraseña `postgres` por defecto, escuchando en `localhost:5432`. Con eso:

```sql
-- una sola vez, con psql -U postgres:
CREATE DATABASE peluditos_club;
```

Y en `.env` (ver `.env.example` para la lista completa, incluyendo `NEXTAUTH_SECRET`, `ADMIN_EMAIL` y `ADMIN_PASSWORD`):

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/peluditos_club?schema=public"
```

## Panel admin (`/admin`)

- Login simple de email + contraseña (`src/lib/auth.ts`, proveedor Credentials de NextAuth, sesión JWT). No usa redes sociales para no depender de otra cuenta externa.
- Rutas protegidas en dos capas: `src/proxy.ts` (chequeo rápido) + un chequeo real de sesión en `src/app/admin/(dashboard)/layout.tsx` (así lo recomienda Next.js: el proxy no debe ser la única barrera de auth).
- **Productos**: crear, editar, borrar, activar/ocultar, destacar, precio/descuento, stock, categoría, talles y colores.
- **Imágenes de producto**: subida múltiple, elegir imagen principal, borrar, reordenar. Se suben a Cloudinary (`src/lib/cloudinary.ts`) — necesita `CLOUDINARY_CLOUD_NAME`/`CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET` en `.env` (ver `.env.example`); sin esas credenciales, subir una imagen muestra un error explicando qué falta.
- **Categorías**: crear, editar, borrar (si no tienen productos), reordenar.
- **Inventario**: agotados / stock bajo (≤10) / stock normal.
- **Pedidos**: pantalla lista pero vacía hasta la Fase 4 (necesita el modelo de pedidos que trae Mercado Pago).

## Estructura de carpetas

```
prisma/
  schema.prisma          Modelos Product, Category, AdminUser
  migrations/              Historial de migraciones (se commitea a git)
  seed.ts / seed-data.ts   Script de seed — seed-data.ts tiene el catálogo original de la Fase 1
src/
  app/
    (storefront)/         Rutas públicas: home, tienda, categoría, producto, carrito, checkout, etc.
    admin/
      login/                Login (sin el shell del panel)
      (dashboard)/          Resto del panel (productos, categorías, inventario, pedidos) — protegido
    api/auth/[...nextauth]/ Route handler de NextAuth
  components/
    layout/              Header, Footer, MobileNav, PromoBar (tienda)
    admin/                AdminSidebar, ProductForm, ProductImageManager, CategoryRow, etc.
    home/                Hero, Benefits, CategorySection, FeaturedProducts
    products/            ProductCard, ProductGrid, ProductGallery, ProductDetail, ProductFilters
    cart/                CartItem, CartSummary
    ui/                  Button, Badge, RatingStars, Decorations (SVG), ComingSoon
  lib/
    data/                products.ts, categories.ts — consultan Prisma; benefits.ts sigue siendo estático
    actions/              Server Actions del admin (products.ts, categories.ts)
    auth.ts               Configuración de NextAuth (Credentials + JWT)
    prisma.ts             Instancia única de PrismaClient
    types.ts             Product, Category, CartLine
    cart-context.tsx     Carrito (Context + localStorage)
    filters.ts           Filtrado/orden de productos (tienda y categoría)
  proxy.ts               Protege /admin (excepto /admin/login) a nivel de request
public/
  images/                dogs/, icons/, brand/, banners/ — assets reales del usuario, ya procesados
                          products/ — imágenes subidas desde el admin (no se commitea, ver .gitignore)
scripts/
  process-assets.mjs     Script (ya ejecutado) que limpió el fondo de los assets originales
docs/
  PROGRESS.md             Checklist de fases
  design-reference/       Los 2 mockups completos (mobile/desktop) como referencia visual — no se sirven en el sitio
```

## Próximos pasos (fases 4 a 7)

Cada una arranca cuando haya credenciales/cuentas disponibles para esa pieza:

4. **Carrito persistente + checkout + Mercado Pago**: Checkout Pro y webhook de confirmación de pago. Código listo; falta `MP_ACCESS_TOKEN` real y, para producción, un dominio público (el webhook no funciona contra `localhost`).
5. **Cloudinary**: las imágenes que se suben desde el admin van a Cloudinary en vez del disco local (necesario para producción — un hosting serverless no persiste archivos escritos en runtime). Código listo; falta crear la cuenta gratis y cargar las credenciales. Los assets de marca/stock (`public/images/`) quedan como están: ya están commiteados a git y Next.js los optimiza solo.
6. **SEO + performance + seguridad**: JSON-LD, sitemap, auditoría Lighthouse, hardening.
7. **Empaquetado final para GitHub**: README y `.env.example` definitivos, instrucciones de deploy.

Ver `.env.example` para las variables de entorno que va a necesitar cada fase.
