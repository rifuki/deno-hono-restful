import "@std/dotenv/load";
import { withAccelerate } from "@prisma/extension-accelerate";

import { PrismaClient } from "./generated/prisma/client.ts";

const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    console.log("Prisma Client with Accelerate extension is ready.");
  } catch (error) {
    console.error(
      "Error initializing Prisma Client with Accelerate extension:",
      error,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main();
