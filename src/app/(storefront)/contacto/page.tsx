import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { SocialLinks } from "@/components/ui/SocialLinks";

export const metadata: Metadata = {
  title: "Contacto | Che Peludos",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold sm:text-3xl">Contacto</h1>
      <p className="mt-2 text-brand-gray">
        ¿Tenés dudas sobre un producto o tu pedido? Escribinos, te respondemos a la brevedad.
      </p>

      <div className="mt-6 flex flex-col gap-2 text-sm">
        <a href="mailto:chepeludos@gmail.com" className="font-semibold text-brand-black hover:text-brand-yellow">
          ✉️ chepeludos@gmail.com
        </a>
        <a href="tel:+555512345678" className="font-semibold text-brand-black hover:text-brand-yellow">
          📞 55 1234 5678
        </a>
      </div>

      <div className="mt-4 flex items-center gap-3 text-sm text-brand-gray">
        <span>Seguinos:</span>
        <SocialLinks />
      </div>

      <ContactForm />
    </div>
  );
}
