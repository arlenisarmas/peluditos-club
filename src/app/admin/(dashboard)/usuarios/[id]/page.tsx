import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePagePermission } from "@/lib/authz";
import { updateUser } from "@/lib/actions/users";
import { UserForm } from "@/components/admin/UserForm";
import { ResetUserPasswordForm } from "@/components/admin/ResetUserPasswordForm";

interface EditUsuarioPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUsuarioPage({ params }: EditUsuarioPageProps) {
  await requirePagePermission("users:write");
  const { id } = await params;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) notFound();

  const updateWithId = updateUser.bind(null, id);

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold">Editar usuario</h1>

      <div className="mt-4 rounded-2xl border border-black/5 bg-white p-5">
        <UserForm user={user} action={updateWithId} />
      </div>

      <div className="mt-4 rounded-2xl border border-black/5 bg-white p-5">
        <h2 className="text-sm font-bold text-brand-gray">Resetear contraseña</h2>
        <p className="mt-1 text-xs text-brand-gray">
          Uso manual: le asignás vos una contraseña nueva (mientras no haya un flujo de email de
          recuperación conectado, esta es la forma de ayudar a alguien que perdió acceso).
        </p>
        <div className="mt-3">
          <ResetUserPasswordForm userId={id} />
        </div>
      </div>
    </div>
  );
}
