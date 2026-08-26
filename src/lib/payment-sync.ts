import { Payment } from "mercadopago";
import { prisma } from "@/lib/prisma";
import { getMercadoPagoClient } from "@/lib/mercadopago";

const STATUS_MAP: Record<string, "PAID" | "CANCELLED" | "PENDING"> = {
  approved: "PAID",
  rejected: "CANCELLED",
  cancelled: "CANCELLED",
  refunded: "CANCELLED",
  charged_back: "CANCELLED",
  pending: "PENDING",
  in_process: "PENDING",
  in_mediation: "PENDING",
};

// Nunca confiamos únicamente en el redirect del navegador: esto vuelve a
// consultar el pago directamente a la API de Mercado Pago (con el
// Access Token privado) y recién ahí actualiza el estado del pedido. Lo usan
// tanto el webhook (server-to-server, la fuente de verdad real) como la
// página de "éxito" del checkout (como respaldo útil en desarrollo local,
// donde Mercado Pago no puede llamar de vuelta a localhost).
export async function syncPaymentById(paymentId: string) {
  const client = getMercadoPagoClient();
  const payment = await new Payment(client).get({ id: paymentId });

  const orderId = payment.external_reference;
  if (!orderId) return null;

  const status = STATUS_MAP[payment.status ?? ""] ?? "PENDING";

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status, mpPaymentId: String(payment.id) },
  });

  return order;
}
