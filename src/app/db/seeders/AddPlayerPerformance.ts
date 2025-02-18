import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const baseValues: Record<string, number[]> = {
  fwd: [80, 80, 80, 80, 80, 60, 51, 56, 75, 80, 80, 38],
  mid: [80, 65, 80, 80, 80, 80, 59, 60, 64, 74, 80, 38],
  def: [80, 52, 60, 80, 55, 80, 80, 80, 77, 78, 80, 38],
  gk: [80, 38, 55, 80, 58, 55, 80, 80, 74, 80, 80, 80],
};

const generateStat = (
  position: keyof typeof baseValues,
  age: number,
  statIndex: number
): number => {
  const base = baseValues[position][statIndex];
  const ageModifier = -Math.abs(age - 27);
  const randomMod = Math.floor(Math.random() * 31) - 15;
  return base + ageModifier + randomMod;
};

async function seed() {
  const players = await prisma.player.findMany();

  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const { position, age, performance } = player;

    if (!performance || Object.keys(performance).length === 0) {
      const stats = {
        speed: generateStat(position, age, 0),
        shooting: generateStat(position, age, 1),
        crossing: generateStat(position, age, 2),
        passing: generateStat(position, age, 3),
        dribbling: generateStat(position, age, 4),
        interceptions: generateStat(position, age, 5),
        block: generateStat(position, age, 6),
        tackling: generateStat(position, age, 7),
        strength: generateStat(position, age, 8),
        stamina: generateStat(position, age, 9),
        talent: generateStat(position, age, 10),
        save: generateStat(position, age, 11),
      };

      console.log(
        `${i + 1} -- added ${player.name} ${
          player.lastName
        }, position: ${position}, age: ${age}, stats:`,
        stats
      );

      await prisma.player.update({
        where: { id: player.id },
        data: {
          performance: stats,
        },
      });
    } else {
      console.log(
        `Player ${player.name} ${player.lastName} already has stats, skipping...`
      );
    }
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
