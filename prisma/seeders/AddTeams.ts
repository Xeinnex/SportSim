import { PrismaClient, Position } from "@prisma/client";

const prisma = new PrismaClient();

const name = "";

async function seed() {
  try {
    const createdTeam = await prisma.team.create({
      data: {
        name,
      },
    });

    console.log("Added Team:", createdTeam);
  } catch (error) {
    console.error("Error adding team:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
