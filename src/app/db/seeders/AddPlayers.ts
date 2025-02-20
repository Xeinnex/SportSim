import { PrismaClient } from "@prisma/client";
import { PlayerPerformanceService } from "@/domain/services/PlayerPerformanceService";
import { PlayerFactoryService } from "@/domain/services/PlayerFactoryService";
import { Position } from "@/domain/entities/Player";

const prisma = new PrismaClient();
const performanceService = new PlayerPerformanceService();

async function generatePlayers(count: number, position: Position) {
  for (let i = 0; i < count; i++) {
    const { name, lastName, age } = PlayerFactoryService.generatePlayerInfo();
    const performance = performanceService.generatePerformance(position, age);

    await prisma.player.create({
      data: { name, lastName, age, position, performance },
    });
  }

  console.log(
    `✅ Successfully added ${count} players in position: ${position}`
  );
}

generatePlayers(63, "gk")
  .catch(console.error)
  .finally(() => prisma.$disconnect());
