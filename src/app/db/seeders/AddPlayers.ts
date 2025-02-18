import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function generatePlayers(count: number, position: string) {
  const validPositions = ["gk", "def", "mid", "fwd"];

  if (!validPositions.includes(position)) {
    throw new Error(
      `Invalid position. Choose from: ${validPositions.join(", ")}`
    );
  }

  const players = [];

  for (let i = 0; i < count; i++) {
    let name = "";
    let lastName = "";

    do {
      name = faker.person.firstName("male");
    } while (name.length > 8);

    do {
      lastName = faker.person.lastName();
    } while (lastName.length > 8);

    players.push({
      name,
      lastName,
      age: faker.number.int({ min: 16, max: 40 }),
      position,
      performance: {},
    });
  }

  await prisma.player.createMany({ data: players });

  console.log(
    `✅ Successfully added ${count} players in position: ${position}`
  );
  return players;
}

generatePlayers(7, "mid")
  .catch(console.error)
  .finally(() => prisma.$disconnect());
