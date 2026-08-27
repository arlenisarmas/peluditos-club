import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SignOutButton } from "@/components/admin/SignOutButton";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  // El proxy (src/proxy.ts) ya filtra esto de forma optimista antes de
  // llegar acá; esta es la verificación real de autorización, como recomienda
  // Next.js (el proxy no debe ser la única barrera de auth). Además, se
  // vuelve a consultar la base para el estado "active": un usuario
  // desactivado no debe poder seguir entrando solo porque su JWT viejo
  // todavía es válido.
  if (!session?.user?.id) redirect("/admin/login");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.active) redirect("/admin/login");

  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-brand-gray-light">
        <aside className="hidden w-56 shrink-0 border-r border-black/5 bg-white p-4 sm:block">
          <Link href="/admin" className="flex items-center gap-2 px-2">
            <Image src="/images/brand/logo-mark.png" alt="" width={28} height={28} className="h-7 w-7" />
            <span className="font-bold">Admin</span>
          </Link>
          <div className="mt-6">
            <AdminSidebar role={user.role} />
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="border-b border-black/5 bg-white px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-sm text-brand-gray hover:text-brand-black">
                ← Ver la tienda
              </Link>
              <div className="flex items-center gap-3">
                <span className="hidden text-sm text-brand-gray sm:inline">{user.email}</span>
                <SignOutButton />
              </div>
            </div>
            <div className="mt-3 -mx-1 overflow-x-auto sm:hidden">
              <AdminSidebar horizontal role={user.role} />
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
