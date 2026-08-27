"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authz";

const stockSchema = z.coerce.number().int().min(0);

// Acción separada de updateProduct: el rol INVENTORY puede tocar stock sin
// tener permiso sobre el resto del producto (nombre, precio, imágenes, etc.).
export async function updateProductStock(id: string, stock: number) {
  await requirePermission("inventory:write");
  const parsed = stockSchema.parse(stock);

  const product = await prisma.product.update({ where: { id }, data: { stock: parsed } });

  revalidatePath("/admin/inventario");
  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${id}`);
  revalidatePath("/tienda");
  revalidatePath(`/producto/${product.slug}`);
}
