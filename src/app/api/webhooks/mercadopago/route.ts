import { NextRequest, NextResponse } from "next/server";
import { syncPaymentById } from "@/lib/payment-sync";
import { isRateLimited } from "@/lib/rate-limit";

// Mercado Pago manda la notificación por query params (IPN clásico) o por
// body JSON (webhooks nuevos), según el tipo de evento. Siempre respondemos
// 200 para que no reintente: un error nuestro se resuelve reprocesando el
// pago manualmente, no reintentando la misma notificación indefinidamente.
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(`mp-webhook:${ip}`, 30, 60 * 1000)) {
    return NextResponse.json({ received: true }, { status: 429 });
  }

  const url = new URL(request.url);
  const topic = url.searchParams.get("topic") ?? url.searchParams.get("type");
  let paymentId = url.searchParams.get("id") ?? url.searchParams.get("data.id");

  if (!paymentId) {
    const body = await request.json().catch(() => null);
    if (body?.type === "payment" && body?.data?.id) {
      paymentId = String(body.data.id);
    }
  }

  if (paymentId && (!topic || topic === "payment")) {
    try {
      await syncPaymentById(paymentId);
    } catch (error) {
      console.error("Error sincronizando pago de Mercado Pago:", error);
    }
  }

  return NextResponse.json({ received: true });
}
