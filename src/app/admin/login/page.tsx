import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminLoginForm } from "./LoginForm";

export default async function AdminLoginPage() {
  // Un admin ya logueado que vuelve a /admin/login (por ejemplo, un bookmark
  // viejo) va directo al panel en vez de ver el formulario de nuevo.
  const session = await getServerSession(authOptions);
  if (session?.user?.id) redirect("/admin");

  return <AdminLoginForm />;
}
