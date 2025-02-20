import { PrismaClient } from "@prisma/client";
import type { Position } from "@/domain/entities/Player";

export class PlayerService {
  constructor(private prisma: PrismaClient) {}

  async getUnassignedPlayer(position: Position) {
    return await this.prisma.player.findFirst({
      where: {
        position,
        id: {
          notIn: (
            await this.prisma.teamPlayers.findMany({
              select: { playerId: true },
            })
          ).map((tp) => tp.playerId),
        },
      },
    });
  }
}
