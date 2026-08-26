import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { syncPaymentById } from "@/lib/payment-sync";
import { ButtonLink } from "@/components/ui/Button";
import { ClearCartOnMount } from "@/components/cart/ClearCartOnMount";

export const metadata: Metadata = { title: "Pago pendiente | Peluditos Club" };

interface CheckoutPendientePageProps {
  searchParams: Promise<{ order?: string; payment_id?: string }>;
}

export default async function CheckoutPendientePage({ searchParams }: CheckoutPendientePageProps) {
  const { order: orderId, payment_id: paymentId } = await searchParams;
  if (!orderId) notFound();

  if (paymentId) {
    await syncPaymentById(paymentId).catch(() => null);
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <ClearCartOnMount />
      <div className="text-5xl">⏳</div>
      <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl">Tu pago está pendiente</h1>
      <p className="mt-2 text-brand-gray">
        Tu pedido <span className="font-mono font-medium text-brand-black">{order.id}</span> quedó registrado.
        Algunos medios de pago (como transferencia o efectivo) tardan un poco más en confirmarse.
      </p>
      <p className="mt-1 text-sm text-brand-gray">Te vamos a escribir a {order.customerEmail} apenas se confirme.</p>
      <ButtonLink href="/tienda" className="mt-6 inline-flex">
        Volver a la tienda
      </ButtonLink>
    </div>
  );
}
