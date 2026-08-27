import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { syncPaymentById } from "@/lib/payment-sync";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "El pago no pudo procesarse | Che Peludos" };

interface CheckoutErrorPageProps {
  searchParams: Promise<{ order?: string; payment_id?: string }>;
}

export default async function CheckoutErrorPage({ searchParams }: CheckoutErrorPageProps) {
  const { order: orderId, payment_id: paymentId } = await searchParams;

  if (paymentId) {
    await syncPaymentById(paymentId).catch(() => null);
  }

  const order = orderId ? await prisma.order.findUnique({ where: { id: orderId } }) : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="text-5xl">😕</div>
      <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl">No pudimos procesar tu pago</h1>
      <p className="mt-2 text-brand-gray">
        {order
          ? `Tu pedido ${order.id} quedó registrado, pero Mercado Pago rechazó el pago. Podés volver a intentarlo.`
          : "Mercado Pago rechazó el pago. Podés volver a intentarlo."}
      </p>
      <p className="mt-1 text-sm text-brand-gray">
        No te preocupes: tu carrito sigue guardado, no perdiste tu selección.
      </p>
      <ButtonLink href="/checkout" className="mt-6 inline-flex">
        Volver a intentar
      </ButtonLink>
    </div>
  );
}
