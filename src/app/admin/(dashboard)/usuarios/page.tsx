import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requirePagePermission } from "@/lib/authz";
import { ROLE_LABELS } from "@/lib/permissions";
import { UserActiveToggle } from "@/components/admin/UserActiveToggle";

export default async function AdminUsuariosPage() {
  const currentUser = await requirePagePermission("users:write");
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Usuarios</h1>
        <Link
          href="/admin/usuarios/nuevo"
          className="rounded-full bg-brand-yellow px-4 py-2 text-sm font-semibold text-brand-black"
        >
          + Nuevo usuario
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-black/5 text-left text-xs uppercase text-brand-gray">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-black/5 last:border-b-0">
                <td className="px-4 py-3 font-medium">
                  {user.name ?? "—"}
                  {user.id === currentUser.id && <span className="ml-1 text-xs text-brand-gray">(vos)</span>}
                </td>
                <td className="px-4 py-3 text-brand-gray">{user.email}</td>
                <td className="px-4 py-3">{ROLE_LABELS[user.role]}</td>
                <td className="px-4 py-3">
                  {user.active ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Activo</span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Inactivo</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/usuarios/${user.id}`} className="font-medium hover:text-brand-yellow">
                      Editar
                    </Link>
                    <UserActiveToggle userId={user.id} active={user.active} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
