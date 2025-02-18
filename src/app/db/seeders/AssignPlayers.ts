import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Position = "gk" | "def" | "mid" | "fwd";

// 1️⃣ Get an unassigned player of a specific position
async function getUnassignedPlayerByPosition(position: Position) {
  return await prisma.player.findFirst({
    where: {
      position,
      id: {
        notIn: (
          await prisma.teamPlayers.findMany({ select: { playerId: true } })
        ).map((tp) => tp.playerId),
      },
    },
  });
}

// 2️⃣ Get a team that still needs a player in that position
async function getTeamMissingPosition(position: Position) {
  const positionLimits: Record<Position, number> = {
    gk: 2,
    def: 6,
    mid: 6,
    fwd: 6,
  };

  // Fetch all teams
  const teams = await prisma.team.findMany({ select: { id: true } });

  // Fetch assigned players and their teams
  const teamPlayers = await prisma.teamPlayers.findMany({
    select: {
      teamId: true,
      playerId: true,
    },
  });

  // Fetch players' positions
  const players = await prisma.player.findMany({
    where: {
      id: { in: teamPlayers.map((tp) => tp.playerId) }, // Get only assigned players
    },
    select: {
      id: true,
      position: true,
    },
  });

  // Map playerId to position
  const playerPositionMap = new Map(players.map((p) => [p.id, p.position]));

  // Count players per team per position
  const teamCountsMap: Record<number, number> = {};
  for (const { teamId, playerId } of teamPlayers) {
    if (playerPositionMap.get(playerId) === position) {
      teamCountsMap[teamId] = (teamCountsMap[teamId] || 0) + 1;
    }
  }

  // Find a team that still needs a player of this position
  return (
    teams.find(
      (team) => (teamCountsMap[team.id] || 0) < positionLimits[position]
    ) || null
  );
}

// 3️⃣ Assign a player to a team
async function assignPlayerToTeam(playerId: number, teamId: number) {
  await prisma.teamPlayers.create({
    data: { playerId, teamId },
  });
  console.log(`Assigned player ${playerId} to team ${teamId}`);
}

// 🚀 Main Function
async function assignPlayersToTeams() {
  try {
    const positions: Position[] = ["gk", "def", "mid", "fwd"];

    for (const position of positions) {
      while (true) {
        const player = await getUnassignedPlayerByPosition(position);
        if (!player) break; // Stop if no more players of this position

        const team = await getTeamMissingPosition(position);
        if (!team) break; // Stop if no more teams need this position

        await assignPlayerToTeam(player.id, team.id);
      }
    }

    console.log("✅ All available players assigned to teams.");
  } catch (error) {
    console.error("❌ Error assigning players:", error);
  } finally {
    await prisma.$disconnect();
  }
}

assignPlayersToTeams();
