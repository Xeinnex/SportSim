import { PrismaClient } from "@prisma/client";
import { PlayerPerformanceService } from "@/domain/services/PlayerPerformanceService";

export class GeneratePlayerPerformancesUseCase {
  constructor(
    private prisma: PrismaClient,
    private performanceService: PlayerPerformanceService
  ) {}

  async execute() {
    const players = await this.prisma.player.findMany();

    for (const player of players) {
      const { position, age, performance } = player;

      if (!performance || Object.keys(performance).length === 0) {
        const Performances = this.performanceService.generatePerformance(
          position as keyof (typeof this.performanceService)["baseValues"],
          age
        );

        console.log(
          `Added Performances for ${player.name} ${player.lastName}, position: ${position}, age: ${age}`
        );

        await this.prisma.player.update({
          where: { id: player.id },
          data: { performance: Performances },
        });
      } else {
        console.log(
          `Skipping ${player.name} ${player.lastName}, Performances already exist.`
        );
      }
    }

    console.log("✅ Player Performances generation complete!");
  }
}
