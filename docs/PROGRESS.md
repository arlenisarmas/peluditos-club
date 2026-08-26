# Progreso — Peluditos Club

Ver el plan completo y el contexto de cada fase en la conversación original / `docs/design-reference/` para los mockups de referencia.

- [x] **Fase 1 — Tienda frontend con datos simulados.** Next.js + TypeScript + Tailwind, catálogo con datos simulados (`src/lib/data/`), carrito con `localStorage`, todas las páginas públicas (home, tienda, categoría, producto, carrito, checkout UI, ofertas, nosotros, ayuda, contacto). Sin base de datos, sin auth, sin pagos reales todavía.
- [x] **Fase 2 — Backend real.** PostgreSQL local + Prisma. `src/lib/data/products.ts` y `categories.ts` ahora consultan la base real; el catálogo de la Fase 1 se movió a `prisma/seed-data.ts` y se sembró con `prisma/seed.ts`. Migraciones versionadas en `prisma/migrations/`.
- [x] **Fase 3 — Autenticación + Panel admin.** NextAuth (Credentials + JWT) protegiendo `/admin` en dos capas (`src/proxy.ts` + chequeo de sesión en el layout). CRUD completo de productos (con imágenes: subir/borrar/reordenar/elegir principal) y categorías (con reorden), pantalla de inventario, y un stub de pedidos que se activa en la Fase 4.
- [ ] **Fase 4 — Carrito persistente + Checkout + Mercado Pago.** Carrito en DB para usuarios logueados, Checkout Pro, webhook de confirmación de pago.
- [ ] **Fase 5 — Cloudinary.** Migrar a Cloudinary las imágenes que se suben desde el admin (los assets de marca/stock de `public/images` quedan como están: ya funcionan bien commiteados a git).
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

## Notas de la Fase 5 (en curso)

- Alcance acotado a propósito: solo se migran a Cloudinary las imágenes que se suben desde el panel admin (`uploadProductImage` en `src/lib/actions/products.ts`, vía `src/lib/cloudinary.ts`). Los assets de marca/stock en `public/images/{dogs,icons,brand,banners}` **no** se tocan — ya están commiteados a git y Next.js los optimiza solo con su Image Optimization API; Cloudinary no suma nada ahí.
- El problema real que resuelve esta fase: las imágenes subidas desde el admin se guardaban en disco local (`public/images/products/`), que funciona en desarrollo pero se pierde en cualquier hosting serverless (Vercel y similares no persisten archivos escritos en runtime entre despliegues/instancias).
- Al borrar una imagen o un producto, solo se intenta borrar en Cloudinary si la URL es de `res.cloudinary.com` (`publicIdFromUrl` en `src/lib/cloudinary.ts`) — las imágenes viejas sembradas por `prisma/seed-data.ts` (fotos de `public/images/dogs/...` usadas como placeholder de catálogo) se ignoran, igual que antes con el disco local.
- `next.config.ts` permite `res.cloudinary.com` en `images.remotePatterns` para que `next/image` pueda optimizar esas URLs.
- Pendiente para cerrar la fase: crear una cuenta gratis en Cloudinary y cargar `CLOUDINARY_CLOUD_NAME`/`CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET` en `.env` — ver `.env.example`. Sin esas credenciales, subir una imagen desde el admin muestra un error explicando qué falta (mismo patrón que Mercado Pago en la Fase 4).

## Notas de la Fase 4 (en curso)

- El checkout es "guest checkout": no requiere login (el proyecto no tiene cuentas de cliente, solo el usuario admin de la Fase 3). El form de `/checkout` ahora llama a la server action `createCheckout` (`src/lib/actions/checkout.ts`), que crea el `Order` en la base **antes** de ir a Mercado Pago, y recién después genera la preferencia de pago con esa orden como `external_reference`.
- Confirmación del pago por dos caminos, ambos reutilizan `syncPaymentById` (`src/lib/payment-sync.ts`): el webhook `/api/webhooks/mercadopago` (la fuente de verdad real, server-to-server) y, como respaldo, las páginas `checkout/exito` y `checkout/pendiente` vuelven a consultar el pago al llegar — necesario en desarrollo local porque Mercado Pago no puede llamarle a un webhook en `localhost`.
- Si el pago es rechazado (`checkout/error`) el carrito **no** se vacía, para que el cliente pueda reintentar sin perder la selección; en éxito y pendiente sí se vacía (el pedido ya quedó creado en la base).
- Pendiente para cerrar la fase: conseguir credenciales de prueba de Mercado Pago (`MP_ACCESS_TOKEN`), y para producción un dominio público (Mercado Pago no acepta `notification_url` con `localhost`) — ver `.env.example`.

## Notas de la Fase 3

- Login con NextAuth v4 (Credentials + sesión JWT), un solo usuario admin (modelo `AdminUser`, contraseña con bcrypt). Se eligió esto en vez de login social para no depender de otra cuenta externa (Google/GitHub OAuth) en esta etapa.
- Next.js 16 renombró `middleware.ts` a `proxy.ts` (misma función, otro nombre) — el archivo real está en `src/proxy.ts`. Además, Next recomienda no confiar solo en el proxy para autorización real, así que se sumó un chequeo de sesión (`redirect` si no hay sesión) directamente en `src/app/admin/(dashboard)/layout.tsx`.
- Las rutas públicas se movieron a `src/app/(storefront)/` (route group) para que la tienda y el admin tengan layouts totalmente distintos sin compartir header/footer.
- Verificado de punta a punta con un usuario de prueba temporal (creado y borrado por la sesión, sin usar la contraseña real del usuario): login vía `/api/auth/callback/credentials`, sesión persistida, y las 6 páginas del panel devolviendo 200 tanto sin sesión (redirigen a login) como con sesión (entran).
- Las imágenes que se suben desde el admin usan Cloudinary desde la Fase 5 (antes se guardaban en `public/images/products/`, en disco local, no commiteado a git).
