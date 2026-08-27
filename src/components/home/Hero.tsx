import Image from "next/image";
import Link from "next/link";

// Banner final aprobado: un solo asset con todo el diseño ya resuelto
// (fondo, texto, botón visual, decoraciones), no se recompone con HTML/CSS
// encima. Se prioriza mostrar la imagen completa sin recortar caras ni texto
// (object-contain) por sobre llenar el ancho recortando (cover) — se usa el
// mismo archivo en todos los tamaños de pantalla por ahora; si en algún
// momento hace falta una composición distinta para mobile, se suma como
// variante acá (no se inventa un recorte nuevo sin confirmarlo antes).
export function Hero() {
  return (
    <section>
      <Link href="/tienda" className="mx-auto block max-w-7xl">
        <Image
          src="/images/hero/hero-main.png"
          alt="Todo para consentir a tu peludito — ver productos"
          width={1672}
          height={941}
          priority
          className="h-auto w-full object-contain"
        />
      </Link>
    </section>
  );
}
