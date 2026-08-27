import Image from "next/image";
import Link from "next/link";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-black/5 bg-brand-cream pb-20 pt-12 lg:pb-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <Image src="/images/brand/logo-mark.png" alt="" width={32} height={32} className="h-8 w-8" />
            <span className="text-lg font-extrabold">
              Che <span className="font-script text-brand-yellow">Peludos</span>
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-brand-gray">
            Todo para consentir a tu peludito. 💙
          </p>
          <form className="mt-4 flex max-w-xs gap-2">
            <label htmlFor="newsletter-email" className="sr-only">
              Tu correo electrónico
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Tu correo electrónico"
              className="w-full min-w-0 rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none focus:border-brand-yellow"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-brand-yellow px-4 py-2 text-sm font-semibold text-brand-black"
            >
              Suscribirme
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-sm font-bold">Comprar</h3>
          <ul className="mt-3 space-y-2 text-sm text-brand-gray">
            <li><Link href="/tienda" className="hover:text-brand-black">Tienda</Link></li>
            <li><Link href="/tienda" className="hover:text-brand-black">Categorías</Link></li>
            <li><Link href="/ofertas" className="hover:text-brand-black">Ofertas</Link></li>
            <li><Link href="/tienda?sort=vendidos" className="hover:text-brand-black">Más vendidos</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold">Ayuda</h3>
          <ul className="mt-3 space-y-2 text-sm text-brand-gray">
            <li><Link href="/ayuda#envios" className="hover:text-brand-black">Envíos</Link></li>
            <li><Link href="/ayuda#devoluciones" className="hover:text-brand-black">Cambios y devoluciones</Link></li>
            <li><Link href="/ayuda#preguntas-frecuentes" className="hover:text-brand-black">Preguntas frecuentes</Link></li>
            <li><Link href="/contacto" className="hover:text-brand-black">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold">Nosotros</h3>
          <ul className="mt-3 space-y-2 text-sm text-brand-gray">
            <li><Link href="/nosotros" className="hover:text-brand-black">Quiénes somos</Link></li>
            <li><Link href="/nosotros#blog" className="hover:text-brand-black">Blog</Link></li>
            <li><Link href="/nosotros#comunidad" className="hover:text-brand-black">Comunidad</Link></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-black/5 px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-2 text-xs text-brand-gray sm:flex-row sm:justify-between">
          <p>© 2026 Che Peludos. Todos los derechos reservados. 💙</p>
          <p>Envíos seguros a todo el país</p>
        </div>
        <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-brand-gray">
            <span>Contáctanos:</span>
            <a href="mailto:chepeludos@gmail.com" className="hover:text-brand-black">chepeludos@gmail.com</a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-brand-gray">Síguenos en</span>
            <SocialLinks />
          </div>
        </div>
        <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <span className="text-xs text-brand-gray">Pago 100% seguro y protegido</span>
          <Image src="/images/icons/payment-strip.png" alt="Visa, Mastercard, American Express, PayPal" width={160} height={30} className="h-6 w-auto" />
        </div>
      </div>
    </footer>
  );
}
