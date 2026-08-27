import Image from "next/image";
import type { Metadata } from "next";
import { HeartIcon } from "@/components/ui/Decorations";
import { SocialLinks } from "@/components/ui/SocialLinks";

export const metadata: Metadata = {
  title: "Nosotros | Che Peludos",
  description: "Quiénes somos, nuestro blog y la comunidad Che Peludos.",
  alternates: { canonical: "/nosotros" },
};

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Quiénes somos</h1>
        <p className="mx-auto mt-3 max-w-2xl text-brand-gray">
          Che Peludos nació de una idea simple: que consentir a tu mascota sea fácil, seguro y
          con productos pensados con amor. Elegimos cada artículo pensando en la felicidad y el
          bienestar de tu peludito, todos los días.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Image
          src="/images/dogs/golden-retriever-lying.png"
          alt="Golden Retriever relajado"
          width={600}
          height={500}
          className="mx-auto h-64 w-auto object-contain"
        />
        <div className="flex flex-col justify-center gap-3">
          <div className="flex items-center gap-2 text-brand-coral">
            <HeartIcon className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-wide">Nuestra misión</span>
          </div>
          <p className="text-brand-gray">
            Acompañar a las familias con mascotas en cada etapa, ofreciendo productos de calidad,
            envíos seguros a todo el país y una comunidad donde compartir el amor por los animales.
          </p>
        </div>
      </div>

      <section id="blog" className="mt-16 scroll-mt-24">
        <h2 className="text-xl font-bold">Blog</h2>
        <p className="mt-2 text-brand-gray">
          Muy pronto vas a encontrar acá notas sobre cuidado, alimentación y bienestar para tu
          mascota. Esta sección se termina de construir junto con el resto del sitio.
        </p>
      </section>

      <section id="comunidad" className="mt-12 scroll-mt-24">
        <h2 className="text-xl font-bold">Comunidad</h2>
        <p className="mt-2 text-brand-gray">
          Seguinos en nuestras redes para ver a los peluditos de la comunidad, sorteos y novedades
          de la tienda.
        </p>
        <SocialLinks className="mt-3" />
      </section>
    </div>
  );
}
