import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PlayerRepository {
  async getAllPlayers() {
    return await prisma.player.findMany({
      include: {
        teams: {
          include: {
            team: true,
          },
        },
      },
    });
  }

  async getPlayerById(playerId: number) {
    return await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        teams: {
          include: {
            team: true,
          },
        },
      },
    });
  }

  async getJustPlayers() {
    return await prisma.player.findMany({});
  }
}
