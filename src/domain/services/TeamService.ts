import { PrismaClient } from "@prisma/client";
import type { Position } from "@/domain/entities/Player";

export class TeamService {
  constructor(private prisma: PrismaClient) {}

  private positionLimits: Record<Position, number> = {
    gk: 2,
    def: 8,
    mid: 6,
    fwd: 6,
  };

  private preferredNumbers: Record<Position, number[]> = {
    gk: [1],
    def: [2, 3, 4, 5],
    mid: [6, 7, 8],
    fwd: [9, 10, 11],
  };

  async getTeamMissingPosition(position: Position) {
    const teams = await this.prisma.team.findMany({ select: { id: true } });
    const teamPlayers = await this.prisma.teamPlayers.findMany({
      select: { teamId: true, playerId: true },
    });
    const players = await this.prisma.player.findMany({
      where: { id: { in: teamPlayers.map((tp) => tp.playerId) } },
      select: { id: true, position: true },
    });

    const playerPositionMap = new Map(players.map((p) => [p.id, p.position]));
    const teamCountsMap: Record<number, number> = {};

    for (const { teamId, playerId } of teamPlayers) {
      if (playerPositionMap.get(playerId) === position) {
        teamCountsMap[teamId] = (teamCountsMap[teamId] || 0) + 1;
      }
    }

    return (
      teams.find(
        (team) => (teamCountsMap[team.id] || 0) < this.positionLimits[position]
      ) || null
    );
  }

  async assignPlayerToTeam(
    playerId: number,
    teamId: number,
    position: Position
  ) {
    // Fetch all assigned numbers for this team
    const assignedNumbers = await this.prisma.teamPlayers.findMany({
      where: { teamId },
      select: { playerShirt: true },
    });

    const takenNumbers = new Set(assignedNumbers.map((p) => p.playerShirt));

    // Try preferred numbers first
    let shirtNumber =
      this.preferredNumbers[position]?.find((num) => !takenNumbers.has(num)) ||
      null;

    // If no preferred number is available, assign next free number (12-99)
    if (!shirtNumber) {
      for (let num = 12; num <= 99; num++) {
        if (!takenNumbers.has(num)) {
          shirtNumber = num;
          break;
        }
      }
    }

    if (!shirtNumber) {
      console.error(
        `❌ No available shirt number for player ${playerId} in team ${teamId}`
      );
      return;
    }

    // Assign player to team with a shirt number
    await this.prisma.teamPlayers.create({
      data: { playerId, teamId, playerShirt: shirtNumber },
    });

    console.log(
      `✅ Assigned player ${playerId} to Team ${teamId} with shirt #${shirtNumber}`
    );
  }
}
