"use server";

import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isRateLimited } from "@/lib/rate-limit";
import { getSiteUrl } from "@/lib/site";

const RESET_TOKEN_TTL_MS = 45 * 60 * 1000; // 45 minutos, uso único

const GENERIC_MESSAGE = "Si existe una cuenta asociada a ese correo, vas a recibir instrucciones.";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export interface ForgotPasswordState {
  message?: string;
  // Solo se completa fuera de producción, como acceso directo de desarrollo
  // mientras no haya un proveedor de email transaccional conectado.
  devResetUrl?: string;
}

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") ?? "")
    .toLowerCase()
    .trim();
  if (!email) return { message: GENERIC_MESSAGE };

  // Limita pedidos por email: evita tanto spamear la casilla de alguien como
  // usar este formulario para adivinar qué emails existen en el sistema.
  if (isRateLimited(`forgot-password:${email}`, 5, 15 * 60 * 1000)) {
    return { message: GENERIC_MESSAGE };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.active) return { message: GENERIC_MESSAGE };

  const token = crypto.randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    },
  });

  const resetUrl = `${getSiteUrl()}/admin/reset-password?token=${token}`;

  // Todavía no hay un servicio de email transaccional conectado (Fase 7 o
  // cuando se contrate uno). Mientras tanto, el link queda en el log del
  // servidor para que un SUPER_ADMIN lo pueda reenviar a mano si hace falta.
  console.log(`[forgot-password] Link de recuperación para ${email}: ${resetUrl}`);

  return {
    message: GENERIC_MESSAGE,
    devResetUrl: process.env.NODE_ENV === "production" ? undefined : resetUrl,
  };
}

export interface ResetPasswordState {
  error?: string;
  success?: boolean;
}

export async function resetPasswordWithToken(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!token) return { error: "Falta el token de recuperación." };
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };
  if (password !== confirmPassword) return { error: "Las contraseñas no coinciden." };

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashToken(token) } });

  // Mensaje genérico también acá: no distinguimos "no existe" de "vencido" de
  // "ya usado" para no darle información extra a quien esté probando tokens.
  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return { error: "Este enlace ya no es válido. Pedí uno nuevo desde \"¿Olvidaste tu contraseña?\"." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
  ]);

  return { success: true };
}
