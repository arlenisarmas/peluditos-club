"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authz";
import { deleteImage, publicIdFromUrl, uploadImage } from "@/lib/cloudinary";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

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
  await requirePermission("products:write");
  const data = parseForm(formData);
  const product = await prisma.product.create({
    data: { ...data, images: [], thumbnail: "" },
  });
  revalidateStorefront(product.slug);
  revalidatePath("/admin/productos");
  redirect(`/admin/productos/${product.id}`);
}

export async function updateProduct(id: string, formData: FormData) {
  await requirePermission("products:write");
  const data = parseForm(formData);
  const product = await prisma.product.update({ where: { id }, data });
  revalidateStorefront(product.slug);
  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${id}`);
}

export async function deleteProduct(id: string) {
  await requirePermission("products:write");
  const product = await prisma.product.delete({ where: { id } });
  for (const image of product.images) {
    await deleteImageFile(image);
  }
  revalidateStorefront(product.slug);
  revalidatePath("/admin/productos");
  redirect("/admin/productos");
}

// Las fotos originales del catálogo (público/images/dogs, banners, etc., usadas
// como placeholders al sembrar la base) no viven en Cloudinary y no hay que
// intentar borrarlas ahí.
function isCloudinaryUrl(url: string) {
  return url.includes("res.cloudinary.com");
}

async function deleteImageFile(url: string) {
  if (!isCloudinaryUrl(url)) return;
  const publicId = publicIdFromUrl(url);
  if (!publicId) return;
  await deleteImage(publicId).catch(() => {
    // ya no existe en Cloudinary; no es un error real para el usuario
  });
}

function validateImageFile(file: FormDataEntryValue | null): file is File {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Elegí un archivo de imagen.");
  }
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Formato no admitido. Usá JPG, PNG o WebP.");
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("La imagen pesa demasiado. El máximo es 5 MB.");
  }
  return true;
}

export async function uploadProductImage(id: string, formData: FormData) {
  await requirePermission("products:write");
  const file = formData.get("file");
  validateImageFile(file);

  const product = await prisma.product.findUniqueOrThrow({ where: { id } });
  const buffer = Buffer.from(await (file as File).arrayBuffer());
  const { secureUrl } = await uploadImage(buffer, `${product.slug}-${Date.now()}`);

  const images = [...product.images, secureUrl];
  await prisma.product.update({
    where: { id },
    data: {
      images,
      thumbnail: product.thumbnail || secureUrl,
    },
  });

  revalidateStorefront(product.slug);
  revalidatePath(`/admin/productos/${id}`);
}

export async function replaceProductImage(id: string, oldImagePath: string, formData: FormData) {
  await requirePermission("products:write");
  const file = formData.get("file");
  validateImageFile(file);

  const product = await prisma.product.findUniqueOrThrow({ where: { id } });
  const index = product.images.indexOf(oldImagePath);
  if (index === -1) throw new Error("La imagen que querés reemplazar ya no existe.");

  const buffer = Buffer.from(await (file as File).arrayBuffer());
  const { secureUrl } = await uploadImage(buffer, `${product.slug}-${Date.now()}`);

  const images = [...product.images];
  images[index] = secureUrl;
  const thumbnail = product.thumbnail === oldImagePath ? secureUrl : product.thumbnail;

  await prisma.product.update({ where: { id }, data: { images, thumbnail } });
  await deleteImageFile(oldImagePath);

  revalidateStorefront(product.slug);
  revalidatePath(`/admin/productos/${id}`);
}

export async function removeProductImage(id: string, imagePath: string) {
  await requirePermission("products:write");
  const product = await prisma.product.findUniqueOrThrow({ where: { id } });
  const images = product.images.filter((img) => img !== imagePath);
  const thumbnail = product.thumbnail === imagePath ? images[0] || "" : product.thumbnail;

  await prisma.product.update({ where: { id }, data: { images, thumbnail } });
  await deleteImageFile(imagePath);

  revalidateStorefront(product.slug);
  revalidatePath(`/admin/productos/${id}`);
}

export async function setProductThumbnail(id: string, imagePath: string) {
  await requirePermission("products:write");
  const product = await prisma.product.update({ where: { id }, data: { thumbnail: imagePath } });
  revalidateStorefront(product.slug);
  revalidatePath(`/admin/productos/${id}`);
}

export async function reorderProductImage(id: string, imagePath: string, direction: "up" | "down") {
  await requirePermission("products:write");
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
