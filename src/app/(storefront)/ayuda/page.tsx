import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ayuda | Che Peludos",
  description: "Envíos, cambios y devoluciones, y preguntas frecuentes.",
  alternates: { canonical: "/ayuda" },
};

const FAQS = [
  {
    q: "¿Cuánto tarda en llegar mi pedido?",
    a: "Entre 3 y 7 días hábiles según tu localidad, una vez confirmado el pago.",
  },
  {
    q: "¿Puedo cambiar el producto si no le queda bien a mi mascota?",
    a: "Sí, tenés 30 días desde la entrega para solicitar un cambio de talla, siempre que el producto no haya sido usado.",
  },
  {
    q: "¿Qué medios de pago aceptan?",
    a: "Tarjetas de crédito y débito, y Mercado Pago. Esta información se termina de habilitar cuando conectemos el checkout real.",
  },
];

export default function AyudaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold sm:text-3xl">Ayuda</h1>

      <section id="envios" className="mt-8 scroll-mt-24">
        <h2 className="text-lg font-bold">Envíos</h2>
        <p className="mt-2 text-brand-gray">
          Hacemos envíos seguros a todo el país. El envío es gratis en compras superiores a $699;
          por debajo de ese monto, el costo se calcula en el checkout según tu ubicación.
        </p>
      </section>

      <section id="devoluciones" className="mt-10 scroll-mt-24">
        <h2 className="text-lg font-bold">Cambios y devoluciones</h2>
        <p className="mt-2 text-brand-gray">
          Si el producto no cumplió tus expectativas, tenés 30 días desde la entrega para
          solicitar un cambio o devolución, sin uso y con su empaque original.
        </p>
      </section>

      <section id="preguntas-frecuentes" className="mt-10 scroll-mt-24">
        <h2 className="text-lg font-bold">Preguntas frecuentes</h2>
        <dl className="mt-3 space-y-4">
          {FAQS.map((faq) => (
            <div key={faq.q} className="rounded-xl bg-brand-gray-light p-4">
              <dt className="font-semibold">{faq.q}</dt>
              <dd className="mt-1 text-sm text-brand-gray">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="mt-10 text-sm text-brand-gray">
        ¿No encontraste tu respuesta? Escribinos a{" "}
        <a href="mailto:chepeludos@gmail.com" className="font-semibold text-brand-black hover:text-brand-yellow">
          chepeludos@gmail.com
        </a>
        .
      </p>
    </div>
  );
}
