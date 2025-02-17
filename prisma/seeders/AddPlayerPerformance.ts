import { PrismaClient, Position } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
const fwdbase = [80, 70, 80, 40, 45, 45, 75, 80, 70, 80, 40];
const midbase = [70, 80, 75, 50, 65, 70, 80, 80, 75, 80, 40];
const defbase = [55, 65, 50, 85, 80, 80, 85, 80, 80, 80, 40];
const gkbase = [40, 50, 45, 90, 50, 50, 60, 50, 80, 80, 80];

const baseValues: Record<string, number[]> = {
  fwd: fwdbase,
  mid: midbase,
  def: defbase,
  gk: gkbase,
};

// Formula to generate the stats
const generateStat = (
  position: keyof typeof baseValues,
  age: number,
  statIndex: number
): number => {
  const base = baseValues[position][statIndex]; // Get the base value for the stat
  const ageModifier = -Math.abs(age - 27); // Age modifier
  const randomMod = Math.floor(Math.random() * 31) - 15; // Random modifier between -15 and 15
  return base + ageModifier + randomMod;
};

async function seed() {
  const players = await prisma.player.findMany(); // Get all players from the Player table

  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const { id, position, age } = player;

    // Check if the player already has stats in the PlayerPerformance table
    const existingStats = await prisma.playerPerformance.findFirst({
      where: { playerId: id }, // Find stats by player id
    });

    if (!existingStats) {
      // Generate stats using the formula and the position-specific base values
      const stats = {
        shooting: generateStat(position, age, 0),
        passing: generateStat(position, age, 1),
        dribbling: generateStat(position, age, 2),
        block: generateStat(position, age, 3),
        tackling: generateStat(position, age, 4),
        interceptions: generateStat(position, age, 5),
        strength: generateStat(position, age, 6),
        speed: generateStat(position, age, 7),
        stamina: generateStat(position, age, 8),
        talent: generateStat(position, age, 9),
        save: generateStat(position, age, 10),
      };

      console.log(
        `${i + 1} -- added ${player.name} ${
          player.lastName
        }, position: ${position}, age: ${age}, stats:`,
        stats
      );

      // Insert stats into PlayerPerformance table
      await prisma.playerPerformance.create({
        data: {
          playerId: id, // Associate the stats with the player
          shooting: stats.shooting,
          passing: stats.passing,
          dribbling: stats.dribbling,
          block: stats.block,
          tackling: stats.tackling,
          interceptions: stats.interceptions,
          strength: stats.strength,
          speed: stats.speed,
          stamina: stats.stamina,
          talent: stats.talent,
          save: stats.save,
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
