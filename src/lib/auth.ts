import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isRateLimited } from "@/lib/rate-limit";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const email = credentials.email.toLowerCase().trim();
        // Máximo 5 intentos cada 15 minutos por email, para frenar fuerza bruta
        // contra el único usuario admin. No distinguimos el motivo en la
        // respuesta (misma pantalla de "email o contraseña incorrectos") para
        // no darle pistas a quien esté probando contraseñas.
        if (isRateLimited(`admin-login:${email}`, 5, 15 * 60 * 1000)) return null;

        const admin = await prisma.adminUser.findUnique({ where: { email } });
        if (!admin) return null;

        const valid = await bcrypt.compare(credentials.password, admin.passwordHash);
        if (!valid) return null;

        return { id: admin.id, email: admin.email, name: admin.name ?? admin.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as { id?: string }).id = token.id as string;
      return session;
    },
  },
};

// Las Server Actions del admin (src/lib/actions/*) son, debajo, un endpoint
// HTTP más — el proxy y el layout del dashboard solo protegen el HTML de la
// página, no bloquean una llamada directa a la action. Por eso cada action
// que crea, edita o borra algo empieza llamando a esto.
export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("No autorizado.");
  }
  return session;
}
