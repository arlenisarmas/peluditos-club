"use client";

import { Button } from "@/components/ui/Button";

export function ContactForm() {
  return (
    <form
      className="mt-8 grid grid-cols-1 gap-4 rounded-2xl border border-black/5 bg-white p-5 sm:grid-cols-2"
      onSubmit={(e) => e.preventDefault()}
    >
      <div>
        <label htmlFor="name" className="text-sm font-medium">Nombre</label>
        <input id="name" name="name" required className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-yellow" />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input id="email" name="email" type="email" required className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-yellow" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className="text-sm font-medium">Mensaje</label>
        <textarea id="message" name="message" rows={4} required className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-yellow" />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" variant="coral">Enviar mensaje</Button>
        <p className="mt-2 text-xs text-brand-gray">
          Este formulario todavía no envía mensajes de verdad — se conecta cuando sumemos el backend.
        </p>
      </div>
    </form>
  );
}
