"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/authz";

export interface ChangePasswordState {
  error?: string;
  success?: boolean;
}

export async function changeOwnPassword(
  _prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const user = await requireUser();

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) return { error: "La contraseña actual no es correcta." };
  if (newPassword.length < 8) return { error: "La contraseña nueva debe tener al menos 8 caracteres." };
  if (newPassword !== confirmPassword) return { error: "Las contraseñas nuevas no coinciden." };

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  return { success: true };
}
