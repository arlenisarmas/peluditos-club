-- Renombra admin_users -> users en vez de borrar y recrear (lo que generaba
-- por defecto `prisma migrate dev` para este diff) para no perder ningún
-- usuario admin que ya exista.
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'INVENTORY');

ALTER TABLE "admin_users" RENAME TO "users";
ALTER TABLE "users" RENAME CONSTRAINT "admin_users_pkey" TO "users_pkey";
ALTER INDEX "admin_users_email_key" RENAME TO "users_email_key";

ALTER TABLE "users" ADD COLUMN "role" "Role" NOT NULL DEFAULT 'EDITOR';
ALTER TABLE "users" ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "users" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Cualquier admin que ya existiera (el único usuario de antes de este cambio,
-- creado por prisma/seed.ts) pasa a ser SUPER_ADMIN, no EDITOR (el default
-- para usuarios nuevos de acá en adelante).
UPDATE "users" SET "role" = 'SUPER_ADMIN';

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_tokenHash_key" ON "password_reset_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "password_reset_tokens_userId_idx" ON "password_reset_tokens"("userId");

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
