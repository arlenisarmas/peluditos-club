import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission, type Permission } from "@/lib/permissions";

// Las Server Actions del admin (src/lib/actions/*) son, debajo, un endpoint
// HTTP más — el proxy y el layout del dashboard solo protegen el HTML de la
// página, no bloquean una llamada directa a la action. Por eso toda mutación
// vuelve a validar acá: sesión, que el usuario siga activo en la base (no
// alcanza con confiar en el JWT, que puede ser viejo) y el permiso puntual.

/** Para Server Actions: sesión + usuario activo. Tira si no cumple. */
export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("No autorizado.");
  }
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.active) {
    throw new Error("No autorizado.");
  }
  return user;
}

/** Para Server Actions: sesión + usuario activo + permiso puntual. Tira si no cumple. */
export async function requirePermission(permission: Permission) {
  const user = await requireUser();
  if (!hasPermission(user.role, permission)) {
    throw new Error("No tenés permiso para hacer esto.");
  }
  return user;
}

/** Para Server Components (páginas): igual que requirePermission, pero redirige en vez de tirar. */
export async function requirePagePermission(permission: Permission, redirectTo = "/admin") {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/admin/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.active) redirect("/admin/login");
  if (!hasPermission(user.role, permission)) redirect(redirectTo);

  return user;
}
