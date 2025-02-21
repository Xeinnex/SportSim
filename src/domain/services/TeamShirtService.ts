import { PrismaClient } from "@prisma/client";
import type { Position } from "@/domain/entities/Player";

export class ShirtNumberService {
  constructor(private prisma: PrismaClient) {}

  private preferredNumbers: Record<Position, number[]> = {
    gk: [1],
    def: [2, 3, 4, 5],
    mid: [6, 7, 8],
    fwd: [9, 10, 11],
  };

  async updateShirtNumbers() {
    console.log("🚀 Updating shirt numbers...");

    // Get all players who need a shirt number
    const playersToUpdate = await this.prisma.teamPlayers.findMany({
      where: { playerShirt: 99 },
      select: {
        playerId: true,
        teamId: true,
        player: { select: { position: true } },
      },
    });

    if (playersToUpdate.length === 0) {
      console.log("✅ No players need a shirt number update.");
      return;
    }

    // Fetch all assigned numbers for teams in a single query (Optimized)
    const assignedNumbersData = await this.prisma.teamPlayers.findMany({
      where: {
        teamId: { in: [...new Set(playersToUpdate.map((p) => p.teamId))] },
      },
      select: { teamId: true, playerShirt: true },
    });

    // Create a map of teamId -> Set of taken numbers
    const teamNumbersMap = new Map<number, Set<number>>();
    assignedNumbersData.forEach(({ teamId, playerShirt }) => {
      if (!teamNumbersMap.has(teamId)) teamNumbersMap.set(teamId, new Set());
      teamNumbersMap.get(teamId)!.add(playerShirt);
    });

    // Assign new shirt numbers
    for (const { playerId, teamId, player } of playersToUpdate) {
      if (!player || !player.position) continue;

      const takenNumbers = teamNumbersMap.get(teamId) || new Set();

      // Try preferred numbers first
      let newShirtNumber =
        this.preferredNumbers[player.position as Position]?.find(
          (num) => !takenNumbers.has(num)
        ) || null;

      // If no preferred number is available, assign next free number (12-99)
      if (!newShirtNumber) {
        for (let num = 12; num <= 99; num++) {
          if (!takenNumbers.has(num)) {
            newShirtNumber = num;
            break;
          }
        }
      }

      if (newShirtNumber) {
        // Update the shirt number
        await this.prisma.teamPlayers.update({
          where: { teamId_playerId: { teamId, playerId } },
          data: { playerShirt: newShirtNumber },
        });

        // Add to taken numbers set to prevent duplicate assignments
        teamNumbersMap.get(teamId)?.add(newShirtNumber);
        console.log(
          `✅ Assigned shirt #${newShirtNumber} to player ${playerId} (Team ${teamId})`
        );
      } else {
        console.error(
          `❌ No available shirt number for player ${playerId} in team ${teamId}`
        );
      }
    }

    console.log("✅ Shirt number updates completed!");
  }
}
