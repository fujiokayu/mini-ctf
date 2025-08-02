import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data first
  await prisma.feedback.deleteMany({});
  await prisma.user.deleteMany({});

  await prisma.user.create({
    data: {
      id: 1,
      name: "admin",
      role: "ADMIN",
      note: "CTF{GQL_P0CALYPSE_1337}",
      adminNote: "Admin secret data"
    }
  });

  await prisma.user.create({
    data: {
      id: 2,
      name: "alice",
      role: "TESTER",
      note: "Alice here",
      adminNote: null
    }
  });

  console.log("🌱 Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });