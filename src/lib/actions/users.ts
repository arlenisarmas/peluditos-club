"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { Prisma, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authz";

const ROLE_VALUES = ["SUPER_ADMIN", "ADMIN", "EDITOR", "INVENTORY"] as const;

const passwordSchema = z.string().min(8, "La contraseña debe tener al menos 8 caracteres.");

function isUniqueEmailError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

async function ensureNotLastSuperAdmin(userId: string, nextRole: Role, nextActive: boolean) {
  if (nextRole === "SUPER_ADMIN" && nextActive) return;

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target || target.role !== "SUPER_ADMIN" || !target.active) return;

  const otherActiveSuperAdmins = await prisma.user.count({
    where: { role: "SUPER_ADMIN", active: true, id: { not: userId } },
  });
  if (otherActiveSuperAdmins === 0) {
    throw new Error("No podés dejar el sistema sin ningún Super admin activo.");
  }
}

export interface UserFormState {
  error?: string;
  success?: boolean;
}

const createUserSchema = z
  .object({
    name: z.string().min(2, "Ingresá un nombre."),
    email: z.string().email(),
    role: z.enum(ROLE_VALUES),
    password: passwordSchema,
    confirmPassword: z.string(),
    active: z.coerce.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export async function createUser(_prevState: UserFormState, formData: FormData): Promise<UserFormState> {
  await requirePermission("users:write");

  const parsed = createUserSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisá los datos del formulario." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  try {
    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase().trim(),
        role: parsed.data.role,
        active: parsed.data.active === undefined ? true : Boolean(parsed.data.active),
        passwordHash,
      },
    });
  } catch (error) {
    if (isUniqueEmailError(error)) return { error: "Ya existe un usuario con ese email." };
    throw error;
  }

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}

const updateUserSchema = z.object({
  name: z.string().min(2, "Ingresá un nombre."),
  email: z.string().email(),
  role: z.enum(ROLE_VALUES),
  active: z.coerce.boolean().optional(),
});

export async function updateUser(
  id: string,
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const currentUser = await requirePermission("users:write");

  const parsed = updateUserSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisá los datos del formulario." };
  }
  const active = parsed.data.active === undefined ? false : Boolean(parsed.data.active);

  if (currentUser.id === id && !active) {
    return { error: "No podés desactivar tu propia cuenta." };
  }

  try {
    await ensureNotLastSuperAdmin(id, parsed.data.role, active);
    await prisma.user.update({
      where: { id },
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase().trim(),
        role: parsed.data.role,
        active,
      },
    });
  } catch (error) {
    if (isUniqueEmailError(error)) return { error: "Ya existe un usuario con ese email." };
    if (error instanceof Error) return { error: error.message };
    throw error;
  }

  revalidatePath("/admin/usuarios");
  revalidatePath(`/admin/usuarios/${id}`);
  return { success: true };
}

export async function setUserActive(id: string, active: boolean) {
  const currentUser = await requirePermission("users:write");

  if (currentUser.id === id && !active) {
    throw new Error("No podés desactivar tu propia cuenta.");
  }
  const target = await prisma.user.findUniqueOrThrow({ where: { id } });
  await ensureNotLastSuperAdmin(id, target.role, active);

  await prisma.user.update({ where: { id }, data: { active } });
  revalidatePath("/admin/usuarios");
}

const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

// El SUPER_ADMIN fuerza una contraseña nueva para cualquier usuario — útil
// mientras no haya un flujo de email de recuperación conectado de verdad.
export async function resetUserPassword(
  id: string,
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  await requirePermission("users:write");

  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisá los datos del formulario." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.update({ where: { id }, data: { passwordHash } });
  revalidatePath(`/admin/usuarios/${id}`);
  return { success: true };
}
