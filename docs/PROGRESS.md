# Progreso — Che Peludos

Ver el plan completo y el contexto de cada fase en la conversación original / `docs/design-reference/` para los mockups de referencia.

- [x] **Fase 1 — Tienda frontend con datos simulados.** Next.js + TypeScript + Tailwind, catálogo con datos simulados (`src/lib/data/`), carrito con `localStorage`, todas las páginas públicas (home, tienda, categoría, producto, carrito, checkout UI, ofertas, nosotros, ayuda, contacto). Sin base de datos, sin auth, sin pagos reales todavía.
- [x] **Fase 2 — Backend real.** PostgreSQL local + Prisma. `src/lib/data/products.ts` y `categories.ts` ahora consultan la base real; el catálogo de la Fase 1 se movió a `prisma/seed-data.ts` y se sembró con `prisma/seed.ts`. Migraciones versionadas en `prisma/migrations/`.
- [x] **Fase 3 — Autenticación + Panel admin + Usuarios internos (RBAC).** NextAuth (Credentials + JWT) protegiendo `/admin` en dos capas. CRUD completo de productos, categorías e inventario. Multiusuario con roles (`SUPER_ADMIN`/`ADMIN`/`EDITOR`/`INVENTORY`), permisos centralizados, panel `/admin/usuarios`, cambio de contraseña propio y recuperación por token.
- [ ] **Fase 4 — Carrito persistente + Checkout + Mercado Pago.** Carrito en DB para usuarios logueados, Checkout Pro, webhook de confirmación de pago.
- [x] **Fase 5 — Cloudinary.** Migrar a Cloudinary las imágenes que se suben desde el admin (los assets de marca/stock de `public/images` quedan como están: ya funcionan bien commiteados a git). Cuenta creada y credenciales cargadas en `.env`.
- [x] **Fase 6 — SEO + Performance + Seguridad.** JSON-LD por producto, sitemap + robots dinámicos, metadata (Open Graph/Twitter), headers de seguridad, rate limiting en login y webhook. Sin dependencias externas pendientes.
- [x] **Fase 7 — Empaquetado para GitHub.** README definitivo, licencias de assets documentadas, `.env.example` completo, auditoría de seguridad, instrucciones de deploy. Lo único que queda fuera a propósito: activar Mercado Pago en producción (Fase 4).

## Rebranding: Peluditos Club → Che Peludos

- Cambio de marca aplicado en todo lo visible: metadata (`title`/`description`/OG/Twitter), JSON-LD, sitemap/robots (vía `getSiteUrl()`), textos de header/footer/nosotros/checkout/admin, README y este archivo.
- Correo de contacto: `chepeludos@gmail.com` (footer, contacto, ayuda). Redes: Instagram y TikTok reales (`src/lib/social.ts`), con íconos propios (`src/components/ui/SocialIcons.tsx`, mismo criterio que `Decorations.tsx`: SVG a mano, sin librería externa) a través de un componente reutilizable (`src/components/ui/SocialLinks.tsx`) usado en footer, `/nosotros` y `/contacto`. Facebook/YouTube/X se sacaron del footer (antes eran parte de una imagen fija `social-strip.png`, ahora borrada) porque no hay cuenta real todavía — no se muestran links placeholder.
- Dominio de producción: `chepeludos.shop`, vía `NEXT_PUBLIC_SITE_URL` (`.env.example`). `src/lib/site.ts` ahora prioriza esa variable sobre `NEXTAUTH_URL` (que se deja como estaba, la sigue necesitando NextAuth para armar sus propias URLs de callback). Se agregaron `alternates.canonical` en las páginas públicas principales.
- **Lo que a propósito no se tocó** (nombres técnicos internos, no rompen nada visible pero cambiarlos sin necesidad es más riesgo que beneficio):
  - El nombre de la base de datos (`peluditos_club` en `DATABASE_URL`) — renombrarlo implica una operación sobre la base real (`ALTER DATABASE` o recrearla), no es solo texto.
  - Nombres que sí se actualizaron por ser 100% seguros de cambiar (no tocan rutas, migraciones ni integraciones): `package.json`/`package-lock.json` (`name`), la carpeta de Cloudinary (`che-peludos/products`), la key de `localStorage` del carrito y el `statement_descriptor` que ve el cliente en el resumen de su tarjeta al pagar con Mercado Pago.
- Cloudinary: se confirmó que la integración está centralizada en un solo lugar (`src/lib/cloudinary.ts`), sin duplicados, sin secretos en componentes ni en el frontend — todo sale de `process.env`. Se cargaron las credenciales reales de la cuenta ya creada directamente en `.env` (nunca en `.env.example` ni en el código).

## Consolidación final: UI, auditoría de seguridad y cierre de la Fase 7

Revisión hecha sobre el estado real del código (no se reimplementó nada de lo ya terminado). Confirmado leyendo el código: Fases 1, 2, 3, 5 y 6 están completas tal como dice el checklist de arriba — RBAC con `requirePermission`/`requirePagePermission` en las 10 actions de productos/categorías/inventario/usuarios y en cada página del dashboard, Cloudinary centralizado en `src/lib/cloudinary.ts`, SEO/headers de la Fase 6 en `next.config.ts` y `src/app/layout.tsx`.

### Correcciones de UI

- **Ícono de cuenta oculto** en `Header.tsx` (desktop) y `MobileNav.tsx` (mobile/tablet) — `/cuenta` sigue existiendo y sigue mostrando "Tu cuenta, muy pronto"; el login de empleados sigue siendo exclusivamente `/admin/login`, sin conectarlos.
- **Flechas de categoría**: antes eran siempre círculo blanco + flecha negra sin importar la categoría. Ahora el color del círculo sale de `src/lib/category-accent.ts` (mapa centralizado slug → clase de Tailwind, con default si aparece una categoría nueva sin mapear) y la flecha es blanca. Se extrajo `src/components/home/CategoryCard.tsx` como componente único reutilizable (antes ya era un solo `.map()`, no estaba duplicado 4 veces, pero ahora el color y el markup viven en un solo lugar). Colores: Accesorios y Comederos `bg-brand-blue` (#43aeef), Ropa `bg-brand-yellow` (#ffc107), Juguetes `bg-brand-coral` (#ff4b3e) — los tres ya existían como tokens de marca en `globals.css`, no hizo falta inventar hex nuevos.

### Auditoría de seguridad

**Corregido ahora:**
- **Límite real de subida de imágenes**: Next.js limita el body de una Server Action a 1MB por defecto — *menos* que el límite de 5MB que ya validaba `uploadProductImage`/`replaceProductImage`. En la práctica, cualquier imagen de entre 1 y 5MB fallaba en el framework antes de llegar a nuestra validación (con un error genérico, no el mensaje claro que escribimos). Se corrigió con `experimental.serverActions.bodySizeLimit: "6mb"` en `next.config.ts`.
- **JSON-LD sin escapar**: `JSON.stringify` no escapa `<`, así que si un nombre o descripción de producto alguna vez incluyera literalmente `</script>`, cortaría el tag antes de tiempo (un vector de XSS poco probable pero real). Se agregó un `.replace(/</g, "\\u003c")` en `producto/[slug]/page.tsx`.
- **GitHub**: se activaron *Dependabot alerts* y *Dependabot security updates* (estaban apagados; *secret scanning* y *push protection* ya estaban activos solos por ser repo público). Se agregó `.github/dependabot.yml` (chequeo semanal de `npm`, ignora saltos de versión mayor a propósito — ver Fase 2 sobre por qué Prisma se fijó en 6.x).

**Ya estaba bien, verificado sin cambios:**
- Hashing de contraseñas: bcrypt costo 12, en `auth.ts` y todas las actions de usuarios.
- Cookies de NextAuth: `HttpOnly` y `SameSite=Lax` siempre (son el default de la librería, no configurable "mal"); `Secure` se activa solo automáticamente cuando `NEXTAUTH_URL` empieza con `https://` — **en producción hay que asegurarse de que esa variable use el dominio real con https**, si no, las cookies no llevan `Secure`.
- Rate limit de login (5 intentos/15 min por email) y mensaje siempre genérico ("email o contraseña incorrectos") — no se puede distinguir si el email existe, si la contraseña está mal, o si está rate-limiteado.
- RBAC: todas las mutaciones validan sesión + usuario activo + permiso del lado del servidor (`src/lib/authz.ts`); nunca se confía en un botón oculto ni en un rol mandado desde el cliente.
- Headers de seguridad (`next.config.ts`): sin duplicados ni contradicciones. Se decidió no sumar CSP estricta (ver Fase 6) porque obliga a renderizado dinámico en todas las páginas.
- CSRF: Next.js protege las Server Actions solas comparando `Origin` contra `Host` (rechaza si no coinciden) — no hace falta un mecanismo redundante. El login usa el `csrfToken` propio de NextAuth (verificado a mano contra `/api/auth/callback/credentials`).
- Prisma: cero SQL crudo en todo el proyecto (`$queryRaw`/`$executeRaw` no se usan) — todas las queries están parametrizadas por el ORM. `DATABASE_URL` solo se lee server-side, nunca con prefijo `NEXT_PUBLIC_`.
- Cloudinary: subida y borrado exigen `requirePermission("products:write")`; tipo (JPG/PNG/WebP) y tamaño (5MB, ahora sí aplicado de punta a punta) se validan en el servidor; el `API_SECRET` solo se lee en `src/lib/cloudinary.ts` (server-only), nunca llega al navegador.
- Secretos: se revisó el historial completo de git (no solo el estado actual) — `.env` nunca se commiteó, y no aparece ningún secreto hardcodeado en ningún archivo trackeado.

**Encontrado y documentado, sin corregir ahora (no bloquean el uso actual):**
- **Rate limiting en memoria no alcanza para producción serverless.** `src/lib/rate-limit.ts` es un `Map` en memoria de un solo proceso — funciona bien en `npm run dev` o un servidor tradicional siempre prendido, pero en Vercel cada invocación puede caer en una instancia distinta (o una instancia "fría" que arranca en cero), así que el límite de 5 intentos/15 min se puede esquivar en la práctica. **Antes de producción real**, cambiar `isRateLimited` para usar un store compartido — la opción más simple es **Upstash Redis** (tiene SDK oficial `@upstash/ratelimit` + `@upstash/redis`, plan gratuito, y Vercel lo integra con un click vía Marketplace). No se agregó ahora para no sumar una cuenta/dependencia externa sin necesidad mientras el sitio no está en producción.
- **Sin 2FA/TOTP para SUPER_ADMIN.** Es una adición razonable (biblioteca tipo `otplib` + un campo `totpSecret` en `User` + un paso extra en el login) pero es trabajo real aparte, no algo para sumar de paso en esta consolidación. **Recomendado antes de producción**, sobre todo si va a haber más de un SUPER_ADMIN.
- **Webhook de Mercado Pago sin verificar firma.** `MP_WEBHOOK_SECRET` está en `.env.example` pero nunca se usa en el código — el webhook (`src/app/api/webhooks/mercadopago/route.ts`) no valida el header `x-signature` que manda Mercado Pago. El riesgo práctico hoy es bajo (haría falta adivinar un `payment_id` real de MP cuyo `external_reference` coincida con un pedido nuestro), pero es lo correcto de implementar cuando se retome la Fase 4 — **no se tocó ahora porque Mercado Pago queda expresamente pendiente**.
- **`npm audit`**: 3 vulnerabilidades "high" en `deepmerge-ts` (vía `@prisma/config`, dependencia de la CLI `prisma`). **No afecta el sitio en producción**: `@prisma/client` (lo que corre en el servidor deployado) no depende de ese paquete — solo lo usa la herramienta de línea de comandos (`migrate`, `generate`, `seed`), y el arreglo automático (`npm audit fix --force`) bajaría `prisma` a la 6.12, deshaciendo la decisión ya tomada en la Fase 2 de fijar la versión mayor. Se deja así y se recomienda revisar de nuevo cuando `@prisma/config` publique una versión con `deepmerge-ts` parcheado.
- **Duración de sesión**: 30 días (default de NextAuth, no se fijó explícito). Es razonable para un panel chico, pero para un admin conviene evaluar acortarla (por ejemplo 7 días) antes de producción.

### DDoS y protección perimetral (para cuando se despliegue)

Con Vercel + dominio propio (`chepeludos.shop`), la recomendación práctica (sin sumar infraestructura compleja):

1. **Vercel ya trae protección de DDoS de capa de red/aplicación incluida** en todos los planes (absorbe ataques volumétricos automáticamente, sin configuración). Alcanza para el volumen de tráfico esperado de esta tienda.
2. **Sumar Cloudflare adelante (DNS + proxy) recién si aparece scraping agresivo o abuso real** — no hace falta desde el día uno. Cuando se justifique: apuntar el dominio a Cloudflare en modo proxy (nube naranja), activar el WAF gratuito y un rate limit de borde para rutas sensibles (`/admin/login`, `/api/webhooks/mercadopago`, `/admin/forgot-password`), y modo "Under Attack" como botón de pánico puntual.
3. Mientras tanto, el rate limiting de aplicación (login, forgot-password, webhook — ver arriba) es la primera línea de defensa real contra abuso dirigido, no volumétrico.

### Backups y recuperación (estrategia mínima, para configurar al desplegar)

- **PostgreSQL**: si se aloja en un proveedor administrado (Neon, Supabase, Railway — cualquiera sirve, `DATABASE_URL` es lo único que cambia), todos ofrecen backups automáticos diarios con algunos días de retención en el plan gratuito/inicial. Confirmar la retención del proveedor elegido y, si el negocio lo justifica más adelante, subir de plan para retención más larga o point-in-time recovery. Restaurar es específico del proveedor (típicamente un botón en su panel).
- **Cloudinary**: no se necesita backup aparte mientras las URLs sigan en Postgres (que sí tiene su propio backup) — el activo real vive en Cloudinary y Postgres solo guarda la referencia. Cuidado al borrar: `deleteImageFile` (en `src/lib/actions/products.ts`) ya evita borrar assets que no sean de `res.cloudinary.com` (los del catálogo original en `public/images/`), así que un borrado de producto no puede afectar assets compartidos por accidente.
- **GitHub**: el código ya está versionado (es la fuente de verdad de todo). Cuando el sitio pase a producción, taguear ese commit (`git tag v1.0.0`) y usar releases de GitHub para versiones importantes en adelante — todavía no se hizo porque no hay un primer despliegue real.

### Assets de `/public` — origen y licencia

| Carpeta | Contenido | Origen |
|---|---|---|
| `brand/logo-mark.png` | Isotipo de la marca | Propio |
| `dogs/*.png` | Fotos de perros usadas en todo el sitio | Del usuario (procesadas con `scripts/process-assets.mjs` para quitar el fondo) — licencia según lo que haya provisto el usuario, no verificable por este asistente |
| `banners/*.jpg` | Banners promocionales del home | Del usuario, mismo origen que `dogs/` |
| `icons/icon-love.png`, `icon-secure.png`, `icon-shipping.png` | Íconos decorativos | Del usuario (Fase 1: "exportados de WhatsApp") — origen/licencia original no verificable |
| `icons/payment-strip.png` | Logos de Visa/Mastercard/Amex/PayPal | Marcas registradas de terceros, mostradas para indicar medios de pago aceptados (uso habitual en e-commerce); no hay licencia propia sobre estos logos — si se requiere una revisión legal estricta antes de producción, confirmar que el uso respeta las guías de marca de cada red |

Ningún asset tiene una licencia inventada acá — donde no se pudo verificar el origen exacto, queda anotado así para reemplazar si hace falta antes de salir a producción.

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

### Multiusuario y RBAC (ampliación de la Fase 3)

- **Modelo**: `AdminUser` (un solo usuario, sin rol) se renombró a `User` con `role` (`SUPER_ADMIN`/`ADMIN`/`EDITOR`/`INVENTORY`) y `active`. Migración escrita a mano (`prisma/migrations/20260827022156_add_rbac_users/migration.sql`) para **renombrar** la tabla en vez de borrarla y recrearla (lo que generaba por defecto el diff automático de Prisma) — así no se pierde ningún usuario que ya exista. Se agregó `PasswordResetToken` (token hasheado, expiración, uso único) para el flujo de recuperación.
- **Permisos centralizados** en `src/lib/permissions.ts` (`ROLE_PERMISSIONS`, `hasPermission`) — nada de `if (role === ...)` repetido. `src/lib/authz.ts` expone `requirePermission()` (para Server Actions, tira error) y `requirePagePermission()` (para páginas, redirige). Se usan en las 10 actions de productos/categorías, la nueva de inventario, y en cada página del dashboard.
- **Hallazgo al revisar el sistema anterior**: solo había un usuario posible, sacado de `ADMIN_EMAIL`/`ADMIN_PASSWORD` en `.env` vía `npm run db:seed` (contraseña con bcrypt, nunca en texto plano). Recuperar acceso hoy significaba cambiar `ADMIN_PASSWORD` y volver a correr el seed — ahora eso lo reemplaza `/admin/usuarios` (reseteo manual) y el flujo de "olvidé mi contraseña".
- **Inventario con permiso propio**: antes no había forma de tocar el stock sin editar el producto completo. Se separó `updateProductStock` (`src/lib/actions/inventory.ts`, permiso `inventory:write`) de `updateProduct` (`products:write`), y la pantalla de inventario ahora tiene un input editable por fila.
- **Bootstrap del primer SUPER_ADMIN**: `prisma/seed.ts` ahora crea el usuario **solo si el email no existe** (antes hacía upsert y pisaba la contraseña en cada corrida) — para no sorprender a nadie reseteando credenciales sin querer. Variable renombrada a `ADMIN_INITIAL_PASSWORD` (se sigue aceptando `ADMIN_PASSWORD` por compatibilidad).
- **Protección contra auto-bloqueo**: no se puede desactivar la propia cuenta, ni quitarle el rol `SUPER_ADMIN`/desactivar al único `SUPER_ADMIN` activo que quede (`ensureNotLastSuperAdmin` en `src/lib/actions/users.ts`).
- **"Olvidé mi contraseña"**: mensaje siempre genérico (no confirma si el email existe), token de un solo uso con expiración de 45 minutos. Sin proveedor de email transaccional todavía: el link se loguea en el servidor siempre, y solo se devuelve al navegador (`devResetUrl`) fuera de `NODE_ENV=production` — preparado para conectar un email real más adelante sin cambiar el flujo.
- **Mostrar/ocultar contraseña**: `src/components/ui/PasswordInput.tsx`, reutilizado en login, alta de usuario, reseteo y cambio de contraseña propio (`/admin/perfil`).
- **No se implementó**: registro de auditoría (`createdBy`/`updatedBy` o `AuditLog`). Es una migración/cambio de por sí, así que se deja para pedirlo aparte en vez de sumarlo a un cambio ya grande.
- **Verificado de punta a punta** (con usuarios de prueba temporales, creados y borrados por la sesión): login del SUPER_ADMIN real vía `/api/auth/callback/credentials`; un usuario `EDITOR` entra a `/admin/productos` pero rebota a `/admin` en categorías/inventario/pedidos/usuarios; un `INVENTORY` entra a inventario pero no a productos/categorías/usuarios; un usuario `active: false` no puede loguearse; flujo completo de "olvidé mi contraseña" (token válido cambia la contraseña, token inválido y reutilizado se rechazan, login funciona con la contraseña nueva).
