import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Query to fetch all teams, players, their stats, and position
    const teams = await prisma.team.findMany({
      include: {
        players: {
          include: {
            player: {
              include: {
                stats: true, // Fetch PlayerPerformance (stats)
              },
            },
          },
        },
      },
    });

    console.log(JSON.stringify(teams, null, 2)); // Log the entire teams data to check the structure

    // Map the result to structure the data properly, including position
    const teamsWithPlayers = teams.map((team) => ({
      id: team.id,
      name: team.name,
      players: team.players.map((teamPlayer) => ({
        id: teamPlayer.player.id,
        name: teamPlayer.player.name,
        lastName: teamPlayer.player.lastName,
        age: teamPlayer.player.age,
        position: teamPlayer.player.position, // Ensure position is included
        stats: teamPlayer.player.stats, // Include player stats
      })),
    }));

    // Return the teams and players data as JSON
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
