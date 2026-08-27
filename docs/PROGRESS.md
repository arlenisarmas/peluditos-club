# Progreso — Che Peludos

Ver el plan completo y el contexto de cada fase en la conversación original / `docs/design-reference/` para los mockups de referencia.

- [x] **Fase 1 — Tienda frontend con datos simulados.** Next.js + TypeScript + Tailwind, catálogo con datos simulados (`src/lib/data/`), carrito con `localStorage`, todas las páginas públicas (home, tienda, categoría, producto, carrito, checkout UI, ofertas, nosotros, ayuda, contacto). Sin base de datos, sin auth, sin pagos reales todavía.
- [x] **Fase 2 — Backend real.** PostgreSQL local + Prisma. `src/lib/data/products.ts` y `categories.ts` ahora consultan la base real; el catálogo de la Fase 1 se movió a `prisma/seed-data.ts` y se sembró con `prisma/seed.ts`. Migraciones versionadas en `prisma/migrations/`.
- [x] **Fase 3 — Autenticación + Panel admin.** NextAuth (Credentials + JWT) protegiendo `/admin` en dos capas (`src/proxy.ts` + chequeo de sesión en el layout). CRUD completo de productos (con imágenes: subir/borrar/reordenar/elegir principal) y categorías (con reorden), pantalla de inventario, y un stub de pedidos que se activa en la Fase 4.
- [ ] **Fase 4 — Carrito persistente + Checkout + Mercado Pago.** Carrito en DB para usuarios logueados, Checkout Pro, webhook de confirmación de pago.
- [x] **Fase 5 — Cloudinary.** Migrar a Cloudinary las imágenes que se suben desde el admin (los assets de marca/stock de `public/images` quedan como están: ya funcionan bien commiteados a git). Cuenta creada y credenciales cargadas en `.env`.
- [x] **Fase 6 — SEO + Performance + Seguridad.** JSON-LD por producto, sitemap + robots dinámicos, metadata (Open Graph/Twitter), headers de seguridad, rate limiting en login y webhook. Sin dependencias externas pendientes.
- [ ] **Fase 7 — Empaquetado para GitHub.** Revisión final de README, licencias de assets, `.env.example` completo, instrucciones de deploy.

## Rebranding: Peluditos Club → Che Peludos

- Cambio de marca aplicado en todo lo visible: metadata (`title`/`description`/OG/Twitter), JSON-LD, sitemap/robots (vía `getSiteUrl()`), textos de header/footer/nosotros/checkout/admin, README y este archivo.
- Correo de contacto: `chepeludos@gmail.com` (footer, contacto, ayuda). Redes: Instagram y TikTok reales (`src/lib/social.ts`), con íconos propios (`src/components/ui/SocialIcons.tsx`, mismo criterio que `Decorations.tsx`: SVG a mano, sin librería externa) a través de un componente reutilizable (`src/components/ui/SocialLinks.tsx`) usado en footer, `/nosotros` y `/contacto`. Facebook/YouTube/X se sacaron del footer (antes eran parte de una imagen fija `social-strip.png`, ahora borrada) porque no hay cuenta real todavía — no se muestran links placeholder.
- Dominio de producción: `chepeludos.shop`, vía `NEXT_PUBLIC_SITE_URL` (`.env.example`). `src/lib/site.ts` ahora prioriza esa variable sobre `NEXTAUTH_URL` (que se deja como estaba, la sigue necesitando NextAuth para armar sus propias URLs de callback). Se agregaron `alternates.canonical` en las páginas públicas principales.
- **Lo que a propósito no se tocó** (nombres técnicos internos, no rompen nada visible pero cambiarlos sin necesidad es más riesgo que beneficio):
  - El nombre de la base de datos (`peluditos_club` en `DATABASE_URL`) — renombrarlo implica una operación sobre la base real (`ALTER DATABASE` o recrearla), no es solo texto.
  - Nombres que sí se actualizaron por ser 100% seguros de cambiar (no tocan rutas, migraciones ni integraciones): `package.json`/`package-lock.json` (`name`), la carpeta de Cloudinary (`che-peludos/products`), la key de `localStorage` del carrito y el `statement_descriptor` que ve el cliente en el resumen de su tarjeta al pagar con Mercado Pago.
- Cloudinary: se confirmó que la integración está centralizada en un solo lugar (`src/lib/cloudinary.ts`), sin duplicados, sin secretos en componentes ni en el frontend — todo sale de `process.env`. Se cargaron las credenciales reales de la cuenta ya creada directamente en `.env` (nunca en `.env.example` ni en el código).

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

## Notas de la Fase 6

- **JSON-LD**: `producto/[slug]/page.tsx` inyecta un `<script type="application/ld+json">` con schema.org `Product` (imagen, precio, disponibilidad según stock, y `aggregateRating` solo si `reviewCount > 0`, para no mandar una calificación sin reseñas reales).
- **Sitemap + robots**: `src/app/sitemap.ts` genera `/sitemap.xml` con las páginas estáticas, categorías y productos activos (`getProducts()`/`getCategories()`, ya filtran por `active`). `src/app/robots.ts` permite todo salvo `/admin/`, `/api/` y las páginas de resultado del checkout (no tiene sentido indexarlas). Ambos usan `getSiteUrl()` (`src/lib/site.ts`), la misma función que ya usaba `checkout.ts` para las `back_urls` de Mercado Pago — antes estaba duplicada ahí.
- **Metadata**: `metadataBase` en `src/app/layout.tsx` ahora sigue a `NEXTAUTH_URL` en vez de tener `http://localhost:3000` hardcodeado con un TODO — alcanza con actualizar esa variable al desplegar. Se sumaron `openGraph`/`twitter` por defecto (usa un banner existente de `public/images/banners/` como imagen social).
- **`/admin` fuera de buscadores**: además del `Disallow` en `robots.txt` (que un bot no conforme podría ignorar), se agregó `metadata.robots = { index: false, follow: false }` en el layout del dashboard y en un layout nuevo para `/admin/login` (no se pudo poner directo en `admin/login/page.tsx` porque es un Client Component — Next no permite exportar `metadata` ahí).
- **Rate limiting**: `src/lib/rate-limit.ts` es un limitador simple en memoria (un `Map`, sin dependencias). Se usa en `src/lib/auth.ts` (máx. 5 intentos de login cada 15 min por email, para frenar fuerza bruta contra el único usuario admin) y en el webhook de Mercado Pago (máx. 30 requests/min por IP). **Limitación conocida**: al ser en memoria, solo protege una instancia — en un despliegue serverless con múltiples instancias cada una tendría su propio conteo. Si eso importa en producción, reemplazar por un store compartido (Redis/Upstash).
- **Headers de seguridad**: `next.config.ts` agrega `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` y `Strict-Transport-Security` para todas las rutas. Se decidió **no** sumar un `Content-Security-Policy` estricto: la variante segura (con nonces) obliga a renderizar todas las páginas dinámicamente, perdiendo la generación estática — un retroceso justo en la fase de performance. Reevaluar si en algún momento se necesita.
- **Ya cubierto de fases anteriores**: validación con Zod en todas las server actions (`checkout.ts`, `products.ts`, `categories.ts`), así que no hizo falta agregar nada ahí.
- Pendiente manual (no requiere código): correr una auditoría de Lighthouse en Chrome DevTools sobre `/`, `/tienda` y `/producto/[slug]` para confirmar los puntajes de performance/SEO en la práctica.

## Notas de la Fase 5

- Alcance acotado a propósito: solo se migran a Cloudinary las imágenes que se suben desde el panel admin (`uploadProductImage` en `src/lib/actions/products.ts`, vía `src/lib/cloudinary.ts`). Los assets de marca/stock en `public/images/{dogs,icons,brand,banners}` **no** se tocan — ya están commiteados a git y Next.js los optimiza solo con su Image Optimization API; Cloudinary no suma nada ahí.
- El problema real que resuelve esta fase: las imágenes subidas desde el admin se guardaban en disco local (`public/images/products/`), que funciona en desarrollo pero se pierde en cualquier hosting serverless (Vercel y similares no persisten archivos escritos en runtime entre despliegues/instancias).
- Al borrar una imagen o un producto, solo se intenta borrar en Cloudinary si la URL es de `res.cloudinary.com` (`publicIdFromUrl` en `src/lib/cloudinary.ts`) — las imágenes viejas sembradas por `prisma/seed-data.ts` (fotos de `public/images/dogs/...` usadas como placeholder de catálogo) se ignoran, igual que antes con el disco local.
- `next.config.ts` permite `res.cloudinary.com` en `images.remotePatterns` para que `next/image` pueda optimizar esas URLs.
- Credenciales reales cargadas en `.env` (cuenta de Cloudinary ya creada). Probado end-to-end contra la cuenta real (subida, `f_auto,q_auto`, parseo de `public_id` y borrado) con un script descartable — no quedó en el repo.
- **Hallazgo de seguridad corregido**: ninguna Server Action de `src/lib/actions/{products,categories}.ts` verificaba sesión — el layout de `/admin` protege el HTML de la página, pero una Server Action es, debajo, un endpoint HTTP aparte que se puede invocar directo sin pasar por ahí. Se agregó `requireAdminSession()` (`src/lib/auth.ts`) al principio de las 10 actions que crean/editan/borran algo (productos, categorías e imágenes).
- **Validación de imágenes**: `uploadProductImage`/`replaceProductImage` ahora rechazan con un mensaje claro archivos que no sean JPG/PNG/WebP o que pesen más de 5 MB, validado en el servidor (no alcanza con el `accept` del `<input>`, que un cliente puede ignorar).
- **Optimización**: las URLs que devuelve Cloudinary llevan `f_auto,q_auto` (formato y calidad automáticos) — se agregó al insertar el segmento de transformación en la URL de entrega (`withAutoOptimization` en `src/lib/cloudinary.ts`). El tamaño según breakpoint lo sigue resolviendo `next/image` como ya hacía; no hizo falta duplicar esa lógica del lado de Cloudinary.
- **`ProductImageManager`**: ahora muestra una vista previa del archivo elegido antes de subirlo (`URL.createObjectURL`), y suma "Reemplazar" por imagen (sube el archivo nuevo, actualiza esa posición del array conservando orden y si era la principal, y borra el archivo viejo de Cloudinary) — antes solo se podía borrar y volver a subir al final.
- **Sin migración de Prisma**: el modelo `Product` sigue guardando solo `images: String[]` (el orden es la posición en el array) y `thumbnail: String` — no hizo falta agregar un `public_id` aparte porque `publicIdFromUrl` ya lo reconstruye de forma confiable a partir de la URL guardada.

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
