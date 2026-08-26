# Peluditos Club

Tienda online de productos para mascotas. "Todo para consentir a tu peludito."

Este repo se construye por fases — ver el estado actual en [`docs/PROGRESS.md`](docs/PROGRESS.md). Ahora mismo está completa la **Fase 1: tienda frontend con datos simulados** (sin base de datos ni pagos reales todavía).

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4
- Carrito con React Context + `localStorage` (persiste entre recargas, sin backend)
- Catálogo de productos con datos simulados en `src/lib/data/`, con la misma forma que va a tener la base de datos real de la Fase 2

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

Otros comandos:

```bash
npm run build   # build de producción
npm run start   # sirve el build de producción
npm run lint    # ESLint
```

## Estructura de carpetas

```
src/
  app/                  Rutas (App Router): home, tienda, categoría, producto, carrito, checkout, etc.
  components/
    layout/              Header, Footer, MobileNav, PromoBar
    home/                Hero, Benefits, CategorySection, FeaturedProducts
    products/            ProductCard, ProductGrid, ProductGallery, ProductDetail, ProductFilters
    cart/                CartItem, CartSummary
    ui/                  Button, Badge, RatingStars, Decorations (SVG), ComingSoon
  lib/
    data/                products.ts, categories.ts, benefits.ts — datos simulados de la Fase 1
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

## Próximos pasos (fases 2 a 7)

Cada una arranca cuando haya credenciales/cuentas disponibles para esa pieza:

2. **Backend real**: PostgreSQL + Prisma, migrando `src/lib/data/*` a queries reales.
3. **Autenticación + panel admin**: Auth.js y `/admin` con CRUD de productos, categorías, inventario y pedidos.
4. **Carrito persistente + checkout + Mercado Pago**: Checkout Pro y webhook de confirmación de pago.
5. **Cloudinary**: migrar `public/images` a un CDN con optimización automática.
6. **SEO + performance + seguridad**: JSON-LD, sitemap, auditoría Lighthouse, hardening.
7. **Empaquetado final para GitHub**: README y `.env.example` definitivos, instrucciones de deploy.

Ver `.env.example` para las variables de entorno que va a necesitar cada fase.
