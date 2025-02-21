import { PrismaClient } from "@prisma/client";
import readline from "readline";

const prisma = new PrismaClient();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function modifyPlayer() {
  try {
    const playerId = parseInt(await askQuestion("Enter Player ID: "));

    const player = await prisma.player.findUnique({
      where: { id: playerId },
      select: {
        id: true,
        name: true,
        lastName: true,
        age: true,
        position: true,
        performance: true,
      },
    });

    if (!player) {
      console.log("Player not found.");
      return;
    }

    console.log("Current Player Data:");
    console.log(player);

    const field = await askQuestion(
      "What do you want to change? (position or performance stat): "
    );

    if (field === "position") {
      const newPosition = await askQuestion(
        "Enter new position (gk, def, mid, fwd): "
      );

      if (!["gk", "def", "mid", "fwd"].includes(newPosition)) {
        console.log("Invalid position.");
      } else {
        await prisma.player.update({
          where: { id: playerId },
          data: { position: newPosition },
        });
        console.log(`Position updated to ${newPosition}`);
      }
    } else {
      const newValue = parseInt(
        await askQuestion(`Enter new value for ${field}: `)
      );

      if (isNaN(newValue)) {
        console.log("Invalid number.");
      } else {
        await prisma.player.update({
          where: { id: playerId },
          data: {
            performance: {
              ...(player.performance as any),
              [field]: newValue,
            },
          },
        });
        console.log(`Performance stat "${field}" updated to ${newValue}`);
      }
    }
  } catch (error) {
    console.error("Error updating player:", error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

modifyPlayer();
