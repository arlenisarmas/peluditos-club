"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Usá minúsculas, números y guiones."),
  image: z.string().min(1),
  bgClass: z.string().min(1),
});

function revalidateStorefront() {
  revalidatePath("/");
  revalidatePath("/tienda");
  revalidatePath("/admin/categorias");
}

export async function createCategory(formData: FormData) {
  await requireAdminSession();
  const data = categorySchema.parse(Object.fromEntries(formData.entries()));
  const count = await prisma.category.count();
  await prisma.category.create({ data: { ...data, order: count } });
  revalidateStorefront();
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdminSession();
  const data = categorySchema.parse(Object.fromEntries(formData.entries()));
  await prisma.category.update({ where: { id }, data });
  revalidateStorefront();
}

export async function deleteCategory(id: string) {
  await requireAdminSession();
  const productsInCategory = await prisma.product.count({ where: { categoryRef: { id } } });
  if (productsInCategory > 0) {
    throw new Error(
      `No se puede borrar: hay ${productsInCategory} producto(s) usando esta categoría. Reasigná esos productos primero.`
    );
  }
  await prisma.category.delete({ where: { id } });
  revalidateStorefront();
}

export async function reorderCategory(id: string, direction: "up" | "down") {
  await requireAdminSession();
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= categories.length) return;

  const a = categories[index];
  const b = categories[swapWith];
  await prisma.$transaction([
    prisma.category.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.category.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);
  revalidateStorefront();
}
