# Peluditos Club

Tienda online de productos para mascotas. "Todo para consentir a tu peludito."

Este repo se construye por fases — ver el estado actual en [`docs/PROGRESS.md`](docs/PROGRESS.md). Completas: **Fase 1** (tienda frontend) y **Fase 2** (base de datos real con PostgreSQL + Prisma).

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4
- [PostgreSQL](https://www.postgresql.org) + [Prisma](https://www.prisma.io) (ORM) — catálogo de productos y categorías
- Carrito con React Context + `localStorage` (persiste entre recargas; todavía no tiene backend — llega en la Fase 4)

## Cómo correr el proyecto

Necesitás PostgreSQL corriendo localmente (ver más abajo) y un archivo `.env` con `DATABASE_URL` (copiá `.env.example` y completalo).

```bash
npm install        # también genera el cliente de Prisma (postinstall)
npm run db:push     # o: npx prisma migrate dev, si vas a crear una migración nueva
npm run db:seed      # carga el catálogo inicial (mismos datos de la Fase 1)
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

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

Y en `.env`:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/peluditos_club?schema=public"
```

## Estructura de carpetas

```
prisma/
  schema.prisma          Modelos Product y Category
  migrations/              Historial de migraciones (se commitea a git)
  seed.ts / seed-data.ts   Script de seed — seed-data.ts tiene el catálogo original de la Fase 1
src/
  app/                  Rutas (App Router): home, tienda, categoría, producto, carrito, checkout, etc.
  components/
    layout/              Header, Footer, MobileNav, PromoBar
    home/                Hero, Benefits, CategorySection, FeaturedProducts
    products/            ProductCard, ProductGrid, ProductGallery, ProductDetail, ProductFilters
    cart/                CartItem, CartSummary
    ui/                  Button, Badge, RatingStars, Decorations (SVG), ComingSoon
  lib/
    data/                products.ts, categories.ts — consultan Prisma; benefits.ts sigue siendo estático
    prisma.ts             Instancia única de PrismaClient
    types.ts             Product, Category, CartLine
    cart-context.tsx     Carrito (Context + localStorage)
    filters.ts           Filtrado/orden de productos (tienda y categoría)
public/
  images/                dogs/, icons/, brand/, banners/ — assets reales del usuario, ya procesados
scripts/
  process-assets.mjs     Script (ya ejecutado) que limpió el fondo de los assets originales
docs/
  PROGRESS.md             Checklist de fases
  design-reference/       Los 2 mockups completos (mobile/desktop) como referencia visual — no se sirven en el sitio
```

## Próximos pasos (fases 3 a 7)

Cada una arranca cuando haya credenciales/cuentas disponibles para esa pieza:

3. **Autenticación + panel admin**: Auth.js y `/admin` con CRUD de productos, categorías, inventario y pedidos.
4. **Carrito persistente + checkout + Mercado Pago**: Checkout Pro y webhook de confirmación de pago.
5. **Cloudinary**: migrar `public/images` a un CDN con optimización automática.
6. **SEO + performance + seguridad**: JSON-LD, sitemap, auditoría Lighthouse, hardening.
7. **Empaquetado final para GitHub**: README y `.env.example` definitivos, instrucciones de deploy.

Ver `.env.example` para las variables de entorno que va a necesitar cada fase.
