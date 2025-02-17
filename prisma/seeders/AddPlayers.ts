// app/api/teams/route.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Query to fetch all teams and their associated players and performance stats
    const teams = await prisma.team.findMany({
      include: {
        players: {
          include: {
            player: {
              include: {
                stats: true, // Include player performance stats
              },
            },
          },
        },
      },
    });

    // Function to calculate average score based on position
    const calculateAvgScore = (position: string, stats: any) => {
      let relevantStats: number[] = []; // Explicitly declare type as number[]

      switch (position) {
        case "gk":
          relevantStats = [stats.save, stats.block, stats.interceptions];
          break;
        case "def":
          relevantStats = [
            stats.tackling,
            stats.interceptions,
            stats.block,
            stats.passing, // Add passing for defenders
            stats.speed, // Add speed for defenders
          ];
          break;
        case "mid":
          relevantStats = [
            stats.passing,
            stats.dribbling,
            stats.tackling,
            stats.interceptions,
            stats.strength,
          ];
          break;
        case "fwd":
          relevantStats = [
            stats.shooting,
            stats.dribbling,
            stats.passing,
            stats.strength,
            stats.speed,
          ];
          break;
        default:
          relevantStats = [];
          break;
      }

      const sum = relevantStats.reduce((acc, stat) => acc + (stat || 0), 0);
      return relevantStats.length
        ? (sum / relevantStats.length).toFixed(2)
        : "0";
    };

    // Map the result to structure the data properly (flatten the player data and calculate avg score)
    const teamsWithPlayers = teams.map((team) => ({
      id: team.id,
      name: team.name,
      players: team.players.map((teamPlayer) => {
        const player = teamPlayer.player;
        const stats = player.stats[0] || {}; // Assuming a player has only one performance record

        return {
          id: player.id,
          name: player.name,
          lastName: player.lastName,
          age: player.age,
          avgScore: calculateAvgScore(player.position, stats),
        };
      }),
    }));

    // Return the teams and players data with avg score
    return new Response(JSON.stringify({ teams: teamsWithPlayers }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch teams and players" }),
      { status: 500 }
    );
  }
}
