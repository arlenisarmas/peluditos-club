# Progreso — Peluditos Club

Ver el plan completo y el contexto de cada fase en la conversación original / `docs/design-reference/` para los mockups de referencia.

- [x] **Fase 1 — Tienda frontend con datos simulados.** Next.js + TypeScript + Tailwind, catálogo con datos simulados (`src/lib/data/`), carrito con `localStorage`, todas las páginas públicas (home, tienda, categoría, producto, carrito, checkout UI, ofertas, nosotros, ayuda, contacto). Sin base de datos, sin auth, sin pagos reales todavía.
- [ ] **Fase 2 — Backend real.** PostgreSQL + Prisma, migrar `src/lib/data/*` a queries reales, seed desde los mismos datos de la Fase 1.
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
