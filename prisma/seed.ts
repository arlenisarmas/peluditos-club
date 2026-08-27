import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { categoriesSeedData, productsSeedData } from "./seed-data";

const prisma = new PrismaClient();

async function main() {
  for (const category of categoriesSeedData) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }
  console.log(`Categorías: ${categoriesSeedData.length} listas.`);

  for (const product of productsSeedData) {
    const { createdAt, ...rest } = product;
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { ...rest, createdAt: new Date(createdAt) },
      create: { ...rest, createdAt: new Date(createdAt) },
    });
  }
  console.log(`Productos: ${productsSeedData.length} listos.`);

  // ADMIN_INITIAL_PASSWORD es el nombre nuevo (deja claro que es solo para el
  // arranque); se acepta también ADMIN_PASSWORD por compatibilidad con el
  // .env de antes del sistema de roles.
  const { ADMIN_EMAIL, ADMIN_INITIAL_PASSWORD, ADMIN_PASSWORD } = process.env;
  const initialPassword = ADMIN_INITIAL_PASSWORD || ADMIN_PASSWORD;

  if (ADMIN_EMAIL && initialPassword) {
    const email = ADMIN_EMAIL.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log(`Usuario ${email} ya existe (rol ${existing.role}) — no se toca ni la contraseña ni el rol.`);
    } else {
      const passwordHash = await bcrypt.hash(initialPassword, 12);
      await prisma.user.create({
        data: { email, passwordHash, role: "SUPER_ADMIN" },
      });
      console.log(`Super admin creado: ${email}`);
    }
  } else {
    console.log("ADMIN_EMAIL/ADMIN_INITIAL_PASSWORD no están en .env — se omite la creación del super admin.");
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
