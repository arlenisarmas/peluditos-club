import { PrismaClient } from "@prisma/client";
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
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
