import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function assignPlayersToTeams() {
  try {
    // Step 1: Fetch players sorted by position and age
    const players = await prisma.player.findMany({
      orderBy: [{ position: "asc" }, { age: "asc" }],
    });

    // Step 2: Fetch all teams
    const teams = await prisma.team.findMany();

    // Step 3: Check if we have teams and players
    if (teams.length === 0 || players.length === 0) {
      console.log("No teams or players found.");
      return;
    }

    // Step 4: Assign players in a round-robin manner
    let teamIndex = 0;
    const playersPerTeam = 20;

    for (const player of players) {
      // Get the current team
      const currentTeam = teams[teamIndex];

      // Add player to the team if it has fewer than 20 players
      const teamPlayerCount = await prisma.teamPlayers.count({
        where: {
          teamId: currentTeam.id,
        },
      });

      // Only add player if the current team has fewer than 20 players
      if (teamPlayerCount < playersPerTeam) {
        await prisma.teamPlayers.create({
          data: {
            teamId: currentTeam.id,
            playerId: player.id,
          },
        });

        console.log(
          `Assigned player ${player.name} ${player.lastName} to team ${currentTeam.name}`
        );

        // Move to the next team
        teamIndex = (teamIndex + 1) % teams.length;
      }
    }

    console.log("Players have been evenly distributed to teams.");
  } catch (error) {
    console.error("Error assigning players to teams:", error);
  } finally {
    await prisma.$disconnect();
  }
}

assignPlayersToTeams();
