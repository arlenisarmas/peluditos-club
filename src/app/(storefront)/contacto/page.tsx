import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = { title: "Contacto | Peluditos Club" };

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold sm:text-3xl">Contacto</h1>
      <p className="mt-2 text-brand-gray">
        ¿Tenés dudas sobre un producto o tu pedido? Escribinos, te respondemos a la brevedad.
      </p>

      <div className="mt-6 flex flex-col gap-2 text-sm">
        <a href="mailto:hola@peluditosclub.com" className="font-semibold text-brand-black hover:text-brand-yellow">
          ✉️ hola@peluditosclub.com
        </a>
        <a href="tel:+555512345678" className="font-semibold text-brand-black hover:text-brand-yellow">
          📞 55 1234 5678
        </a>
      </div>

      <ContactForm />
    </div>
  );
}
