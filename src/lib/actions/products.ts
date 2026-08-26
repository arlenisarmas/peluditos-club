"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";

const productSchema = z.object({
  name: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Usá minúsculas, números y guiones."),
  description: z.string().min(10),
  shortDescription: z.string().min(5),
  category: z.string().min(1),
  price: z.coerce.number().int().min(0),
  comparePrice: z.coerce.number().int().min(0).optional().or(z.literal("")),
  stock: z.coerce.number().int().min(0),
  sku: z.string().min(2),
  rating: z.coerce.number().min(0).max(5),
  reviewCount: z.coerce.number().int().min(0),
  sizes: z.string().optional(),
  colors: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  active: z.coerce.boolean().optional(),
});

function parseSizes(raw?: string) {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseColors(raw?: string) {
  if (!raw?.trim()) return undefined;
  const colors = raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [name, hex] = entry.split(":").map((v) => v.trim());
      return { name, hex: hex || "#CCCCCC" };
    })
    .filter((c) => c.name);
  return colors.length ? colors : undefined;
}

function parseForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.parse(raw);
  return {
    name: parsed.name,
    slug: parsed.slug,
    description: parsed.description,
    shortDescription: parsed.shortDescription,
    category: parsed.category,
    price: parsed.price,
    comparePrice: parsed.comparePrice === "" || parsed.comparePrice === undefined ? null : parsed.comparePrice,
    stock: parsed.stock,
    sku: parsed.sku,
    rating: parsed.rating,
    reviewCount: parsed.reviewCount,
    sizes: parseSizes(parsed.sizes),
    colors: parseColors(parsed.colors),
    featured: Boolean(parsed.featured),
    active: parsed.active === undefined ? true : Boolean(parsed.active),
  };
}

function revalidateStorefront(slug?: string) {
  revalidatePath("/tienda");
  revalidatePath("/ofertas");
  revalidatePath("/");
  if (slug) revalidatePath(`/producto/${slug}`);
}

export async function createProduct(formData: FormData) {
  const data = parseForm(formData);
  const product = await prisma.product.create({
    data: { ...data, images: [], thumbnail: "" },
  });
  revalidateStorefront(product.slug);
  revalidatePath("/admin/productos");
  redirect(`/admin/productos/${product.id}`);
}

export async function updateProduct(id: string, formData: FormData) {
  const data = parseForm(formData);
  const product = await prisma.product.update({ where: { id }, data });
  revalidateStorefront(product.slug);
  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${id}`);
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.delete({ where: { id } });
  for (const image of product.images) {
    await deleteImageFile(image);
  }
  revalidateStorefront(product.slug);
  revalidatePath("/admin/productos");
  redirect("/admin/productos");
}

const PRODUCTS_DIR = path.join(process.cwd(), "public", "images", "products");

async function deleteImageFile(publicPath: string) {
  if (!publicPath.startsWith("/images/products/")) return; // no borrar assets originales del catálogo
  try {
    await fs.unlink(path.join(process.cwd(), "public", publicPath));
  } catch {
    // el archivo ya no está; no es un error real para el usuario
  }
}

export async function uploadProductImage(id: string, formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return;

  const product = await prisma.product.findUniqueOrThrow({ where: { id } });
  await fs.mkdir(PRODUCTS_DIR, { recursive: true });

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const filename = `${product.slug}-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(PRODUCTS_DIR, filename), buffer);

  const publicPath = `/images/products/${filename}`;
  const images = [...product.images, publicPath];
  await prisma.product.update({
    where: { id },
    data: {
      images,
      thumbnail: product.thumbnail || publicPath,
    },
  });

  revalidateStorefront(product.slug);
  revalidatePath(`/admin/productos/${id}`);
}

export async function removeProductImage(id: string, imagePath: string) {
  const product = await prisma.product.findUniqueOrThrow({ where: { id } });
  const images = product.images.filter((img) => img !== imagePath);
  const thumbnail = product.thumbnail === imagePath ? images[0] || "" : product.thumbnail;

  await prisma.product.update({ where: { id }, data: { images, thumbnail } });
  await deleteImageFile(imagePath);

  revalidateStorefront(product.slug);
  revalidatePath(`/admin/productos/${id}`);
}

export async function setProductThumbnail(id: string, imagePath: string) {
  const product = await prisma.product.update({ where: { id }, data: { thumbnail: imagePath } });
  revalidateStorefront(product.slug);
  revalidatePath(`/admin/productos/${id}`);
}

export async function reorderProductImage(id: string, imagePath: string, direction: "up" | "down") {
  const product = await prisma.product.findUniqueOrThrow({ where: { id } });
  const images = [...product.images];
  const index = images.indexOf(imagePath);
  if (index === -1) return;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= images.length) return;
  [images[index], images[swapWith]] = [images[swapWith], images[index]];

  await prisma.product.update({ where: { id }, data: { images } });
  revalidateStorefront(product.slug);
  revalidatePath(`/admin/productos/${id}`);
}
