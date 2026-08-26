import { PrismaClient } from "@prisma/client";

// Evita crear un PrismaClient nuevo en cada hot-reload de `next dev`,
// que agotaría las conexiones a la base de datos.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
