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

  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    const email = ADMIN_EMAIL.toLowerCase().trim();
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await prisma.adminUser.upsert({
      where: { email },
      update: { passwordHash },
      create: { email, passwordHash },
    });
    console.log(`Usuario admin listo: ${email}`);
  } else {
    console.log("ADMIN_EMAIL/ADMIN_PASSWORD no están en .env — se omite la creación del usuario admin.");
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
