import { PrismaClient } from "@prisma/client";
import { PlayerService } from "@/domain/services/PlayerService";
import { TeamService } from "@/domain/services/TeamService";
import { AssignPlayersToTeamsUseCase } from "@/app/usecases/AssignPlayers";

const prisma = new PrismaClient();
const playerService = new PlayerService(prisma);
const teamService = new TeamService(prisma);

async function run() {
  console.log("🚀 Running AssignPlayersToTeamsUseCase...");

  const useCase = new AssignPlayersToTeamsUseCase(playerService, teamService);
  await useCase.execute();

  await prisma.$disconnect();
}

run().catch(console.error);
