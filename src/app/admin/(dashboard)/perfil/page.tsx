import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/permissions";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export const metadata: Metadata = { title: "Mi perfil | Admin", robots: { index: false, follow: false } };

export default async function AdminPerfilPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="max-w-md">
      <h1 className="text-xl font-bold">Mi perfil</h1>
      <p className="mt-1 text-sm text-brand-gray">
        {session?.user?.email} — {session?.user?.role && ROLE_LABELS[session.user.role]}
      </p>

      <div className="mt-6 rounded-2xl border border-black/5 bg-white p-5">
        <h2 className="text-sm font-bold text-brand-gray">Cambiar contraseña</h2>
        <div className="mt-3">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
