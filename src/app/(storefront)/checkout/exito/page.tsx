import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { syncPaymentById } from "@/lib/payment-sync";
import { ButtonLink } from "@/components/ui/Button";
import { ClearCartOnMount } from "@/components/cart/ClearCartOnMount";

export const metadata: Metadata = { title: "¡Gracias por tu compra! | Peluditos Club" };

interface CheckoutExitoPageProps {
  searchParams: Promise<{ order?: string; payment_id?: string }>;
}

export default async function CheckoutExitoPage({ searchParams }: CheckoutExitoPageProps) {
  const { order: orderId, payment_id: paymentId } = await searchParams;
  if (!orderId) notFound();

  // Mercado Pago no puede llamar al webhook en localhost (necesita un dominio
  // público), así que acá confirmamos el pago también como respaldo para
  // desarrollo. En producción el webhook ya lo habrá hecho antes de este redirect.
  if (paymentId) {
    await syncPaymentById(paymentId).catch(() => null);
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <ClearCartOnMount />
      <div className="text-5xl">🎉</div>
      <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl">
        ¡Gracias por tu compra, {order.customerName.split(" ")[0]}!
      </h1>
      <p className="mt-2 text-brand-gray">
        Tu pedido <span className="font-mono font-medium text-brand-black">{order.id}</span>{" "}
        {order.status === "PAID"
          ? "quedó confirmado."
          : "quedó registrado y estamos confirmando el pago."}
      </p>
      <p className="mt-1 text-sm text-brand-gray">Te vamos a escribir a {order.customerEmail} con las novedades.</p>
      <ButtonLink href="/tienda" className="mt-6 inline-flex">
        Seguir comprando
      </ButtonLink>
    </div>
  );
}
