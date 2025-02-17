import { PrismaClient, Position } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
const playerCount = 150;
const playerPositionOdds = {
  gk: 0.1,
  def: 0.3,
  mid: 0.3,
  fwd: 0.3,
};
const ageMin = 16;
const ageMax = 40;

async function seed() {
  const players = [];

  for (let i = 0; i < playerCount; i++) {
    let name = faker.person.firstName(`male`);
    let lastName = faker.person.lastName();

    while (name.length > 8) {
      name = faker.person.firstName(`male`);
    }
    while (lastName.length > 8) {
      lastName = faker.person.lastName();
    }

    let position: Position;
    const rand = Math.random();
    if (rand < playerPositionOdds.gk) {
      position = Position.gk;
    } else if (rand < playerPositionOdds.gk + playerPositionOdds.def) {
      position = Position.def;
    } else if (
      rand <
      playerPositionOdds.gk + playerPositionOdds.def + playerPositionOdds.mid
    ) {
      position = Position.mid;
    } else {
      position = Position.fwd;
    }

    const player = {
      name,
      lastName,
      position,
      age: faker.number.int({ min: ageMin, max: ageMax }),
    };

    console.log(
      `${i + 1} -- added ${player.name} ${player.lastName}, position: ${
        player.position
      }, age: ${player.age} `
    );
    players.push(player);

    const createdPlayer = await prisma.player.create({
      data: {
        name: player.name,
        lastName: player.lastName,
        position: player.position,
        age: player.age,
      },
    });
  }

  console.log("Seeding complete!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
