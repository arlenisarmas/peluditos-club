"use client";

import { FormEvent, Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";

function getSafeCallbackUrl(requested: string | null): string {
  // Solo se acepta como destino algo DENTRO del admin (para poder volver,
  // por ejemplo, a /admin/productos/123 después de loguearse). Cualquier
  // otra cosa —incluida /cuenta, la pantalla pública de clientes, o una URL
  // externa— se ignora y cae en /admin. Antes se usaba el parámetro tal cual
  // venía en la URL, así que un link o bookmark con ?callbackUrl=/cuenta
  // terminaba mandando ahí a un admin recién logueado.
  if (requested && requested.startsWith("/admin") && requested !== "/admin/login") {
    return requested;
  }
  return "/admin";
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Email o contraseña incorrectos.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-gray-light px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <div className="flex justify-center">
          <Image src="/images/brand/logo-mark.png" alt="Che Peludos" width={48} height={48} />
        </div>
        <h1 className="mt-4 text-center text-xl font-bold">Panel de administración</h1>
        <p className="mt-1 text-center text-sm text-brand-gray">Che Peludos</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-yellow"
            />
          </div>
          <PasswordInput
            id="password"
            label="Contraseña"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-brand-coral">{error}</p>}
          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? "Entrando..." : "Entrar"}
          </Button>
          <Link href="/admin/forgot-password" className="text-center text-xs text-brand-gray hover:text-brand-black">
            ¿Olvidaste tu contraseña?
          </Link>
        </form>
      </div>
    </div>
  );
}

export function AdminLoginForm() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
