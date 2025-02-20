import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class TeamRepository {
  async getFullTeams() {
    return await prisma.team.findMany({
      include: {
        players: {
          include: {
            player: true,
          },
        },
      },
    });
  }

  async getTeamById(teamId: number) {
    return await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        players: {
          include: {
            player: true,
          },
        },
      },
    });
  }

  async getJustTeams() {
    return await prisma.team.findMany({});
  }
}
