"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { Preference } from "mercadopago";
import { prisma } from "@/lib/prisma";
import { getMercadoPagoClient } from "@/lib/mercadopago";
import { getSiteUrl } from "@/lib/site";
import { CartLine } from "@/lib/types";

const checkoutSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(6),
  address: z.string().min(3),
  city: z.string().min(2),
  province: z.string().min(2),
  postalCode: z.string().min(3),
  cart: z.string().min(2),
});

export interface CheckoutState {
  error?: string;
}

export async function createCheckout(
  _prevState: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const parsed = checkoutSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Revisá los datos del formulario: falta o está mal cargado algún campo." };
  }

  const lines: CartLine[] = JSON.parse(parsed.data.cart);
  if (lines.length === 0) {
    return { error: "Tu carrito está vacío." };
  }

  let checkoutUrl: string;
  try {
    const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);

    const order = await prisma.order.create({
      data: {
        customerName: `${parsed.data.firstName} ${parsed.data.lastName}`,
        customerEmail: parsed.data.email,
        customerPhone: parsed.data.phone,
        address: parsed.data.address,
        city: parsed.data.city,
        province: parsed.data.province,
        postalCode: parsed.data.postalCode,
        subtotal,
        total: subtotal,
        items: {
          create: lines.map((line) => ({
            productId: line.productId,
            name: line.name,
            price: line.price,
            quantity: line.quantity,
            color: line.color,
            size: line.size,
          })),
        },
      },
    });

    const siteUrl = getSiteUrl();
    const client = getMercadoPagoClient();
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: lines.map((line) => ({
          id: line.productId,
          title: line.name,
          quantity: line.quantity,
          unit_price: line.price,
          currency_id: "ARS",
        })),
        payer: {
          name: parsed.data.firstName,
          surname: parsed.data.lastName,
          email: parsed.data.email,
          phone: { number: parsed.data.phone },
          address: { zip_code: parsed.data.postalCode, street_name: parsed.data.address },
        },
        external_reference: order.id,
        notification_url: `${siteUrl}/api/webhooks/mercadopago`,
        back_urls: {
          success: `${siteUrl}/checkout/exito?order=${order.id}`,
          pending: `${siteUrl}/checkout/pendiente?order=${order.id}`,
          failure: `${siteUrl}/checkout/error?order=${order.id}`,
        },
        auto_return: "approved",
        statement_descriptor: "CHE PELUDOS",
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { mpPreferenceId: result.id },
    });

    const url = result.init_point || result.sandbox_init_point;
    if (!url) {
      throw new Error("Mercado Pago no devolvió una URL de pago.");
    }
    checkoutUrl = url;
  } catch (error) {
    console.error("Error creando el checkout de Mercado Pago:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "No se pudo iniciar el pago. Intentá de nuevo en unos minutos.",
    };
  }

  redirect(checkoutUrl);
}
