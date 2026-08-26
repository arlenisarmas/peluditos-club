# Progreso — Peluditos Club

Ver el plan completo y el contexto de cada fase en la conversación original / `docs/design-reference/` para los mockups de referencia.

- [x] **Fase 1 — Tienda frontend con datos simulados.** Next.js + TypeScript + Tailwind, catálogo con datos simulados (`src/lib/data/`), carrito con `localStorage`, todas las páginas públicas (home, tienda, categoría, producto, carrito, checkout UI, ofertas, nosotros, ayuda, contacto). Sin base de datos, sin auth, sin pagos reales todavía.
- [x] **Fase 2 — Backend real.** PostgreSQL local + Prisma. `src/lib/data/products.ts` y `categories.ts` ahora consultan la base real; el catálogo de la Fase 1 se movió a `prisma/seed-data.ts` y se sembró con `prisma/seed.ts`. Migraciones versionadas en `prisma/migrations/`.
- [ ] **Fase 3 — Autenticación + Panel admin.** Auth.js, `/admin` protegido, CRUD de productos/categorías/inventario/pedidos, subida de imágenes.
- [ ] **Fase 4 — Carrito persistente + Checkout + Mercado Pago.** Carrito en DB para usuarios logueados, Checkout Pro, webhook de confirmación de pago.
- [ ] **Fase 5 — Cloudinary.** Migrar imágenes de `public/images` a Cloudinary.
- [ ] **Fase 6 — SEO + Performance + Seguridad.** JSON-LD por producto, sitemap, metadata, auditoría Lighthouse, hardening (Zod, rate limiting, headers).
- [ ] **Fase 7 — Empaquetado para GitHub.** Revisión final de README, licencias de assets, `.env.example` completo, instrucciones de deploy.

## Notas de la Fase 1

- Los assets reales del usuario (fotos de perros e íconos exportados de WhatsApp) se procesaron con `scripts/process-assets.mjs` para quitarles el fondo negro que WhatsApp les dejó al comprimirlos, y quedaron en `public/images/{dogs,icons,brand,banners}/` con nombres descriptivos.
- Las dos capturas de mockup completas (mobile y desktop) quedaron en `docs/design-reference/` como referencia visual — no se sirven en el sitio.
- El checkout es solo UI: el botón de pago está deshabilitado hasta la Fase 4 (Mercado Pago).
- `/favoritos`, `/pedidos` y `/cuenta` son pantallas de "disponible próximamente" hasta la Fase 3 (autenticación).

## Notas de la Fase 2

- Se instaló PostgreSQL 17 localmente (vía `winget`) en vez de usar un proveedor en la nube, para no requerir otra cuenta externa en esta etapa. Migrar a un proveedor en la nube (Neon, Supabase, Railway) más adelante es tan simple como cambiar `DATABASE_URL`.
- Se probó explícitamente que la tienda lee en vivo de la base (se cambió un precio directo en PostgreSQL con `psql` y se vio reflejado en `/tienda` sin reiniciar el servidor).
- Se usó **Prisma Migrate** (`prisma migrate dev`), no `db push`, para tener historial de migraciones versionado y commiteado — importante de cara a producción y a trabajar en equipo.
- Se instaló Prisma con la versión mayor **6.x** a propósito: `npm install prisma` sin fijar versión trajo la 7 (recién salida), que cambió la forma de configurar la conexión (adaptadores de driver + archivo de config nuevo) de una manera mucho más compleja de lo que hace falta para este proyecto. Reevaluar esto si en el futuro se quiere actualizar.
- `src/lib/data/benefits.ts` se dejó sin tocar (sigue siendo un array estático): son 3 textos fijos sin necesidad de administración desde el panel.
