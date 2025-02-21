import { PrismaClient } from "@prisma/client";
import { PlayerEvalService } from "@/domain/services/PlayerEvalService";
import { Position, Player } from "@/domain/entities/Player";

const prisma = new PrismaClient();

async function setFirstDivisionTeams() {
  console.log("Fetching teams and players...");

  const teams = await prisma.team.findMany({
    include: { players: { include: { player: true } } },
  });

  // Compute team scores
  const teamScores = teams.map((team) => {
    const playerScores = team.players.map(({ player }) =>
      PlayerEvalService.calculateAvgScore({
        ...player,
        position: player.position as Position, // Cast position correctly
        performance: player.performance as Player["performance"], // Ensure correct structure
      })
    );

    // Sort scores descending and take top 11
    const top11Avg =
      playerScores
        .sort((a, b) => b - a)
        .slice(0, 11)
        .reduce((sum, score) => sum + score, 0) / 11;

    console.log(`${team.name}: Avg Score ${top11Avg || 0}`);

    return { teamId: team.id, teamName: team.name, avgScore: top11Avg || 0 };
  });

  // Sort teams by avgScore descending and take top 16
  const top16Teams = teamScores
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 16);

  console.log("\nTop 16 Teams for Division 1:");
  top16Teams.forEach(({ teamName, avgScore }) =>
    console.log(`${teamName}: ${avgScore}`)
  );

  console.log("\nUpdating divisions...");

  // Reset all teams to division 2 first
  await prisma.team.updateMany({
    data: { division: 2 },
  });

  // Update teams in division 1
  await prisma.team.updateMany({
    where: { id: { in: top16Teams.map((t) => t.teamId) } },
    data: { division: 1 },
  });

  console.log("\nDivision update complete!");
  console.log("Promoted Teams:");
  top16Teams.forEach(({ teamName }) =>
    console.log(`✅ ${teamName} promoted to Division 1`)
  );
}

setFirstDivisionTeams()
  .catch((err) => console.error("Error setting divisions:", err))
  .finally(() => prisma.$disconnect());
