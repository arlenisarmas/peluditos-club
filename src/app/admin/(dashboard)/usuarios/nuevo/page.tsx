import { requirePagePermission } from "@/lib/authz";
import { createUser } from "@/lib/actions/users";
import { UserForm } from "@/components/admin/UserForm";

export default async function NuevoUsuarioPage() {
  await requirePagePermission("users:write");

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold">Nuevo usuario</h1>
      <div className="mt-4 rounded-2xl border border-black/5 bg-white p-5">
        <UserForm action={createUser} />
      </div>
    </div>
  );
}
