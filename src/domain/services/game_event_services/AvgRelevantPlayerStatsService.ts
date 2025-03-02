import { Player, Position } from "@/domain/entities/Player";
import { Team } from "@/domain/entities/Team";

export function getSectorStatsModifier(
  sector: "defensive" | "midfield" | "attacking",
  attackingTeam: Team,
  defendingTeam: Team
) {
  if (!attackingTeam.players || !defendingTeam.players) {
    throw new Error("Both teams must have players.");
  }

  const sectorMapping = {
    defensive: {
      attackStats: ["speed", "passing", "dribbling"] as const,
      defendStats: ["interceptions", "tackling", "block"] as const,
      expectedAttackers: 4,
      expectedDefenders: 3,
      filterAttacking: (p: Player) => p.position === ("def" as Position),
      filterDefending: (p: Player) => p.position === ("fwd" as Position),
    },
    midfield: {
      attackStats: ["speed", "dribbling", "crossing"] as const,
      defendStats: ["interceptions", "tackling", "block"] as const,
      expectedAttackers: 3,
      expectedDefenders: 3,
      filterAttacking: (p: Player) => p.position === ("mid" as Position),
      filterDefending: (p: Player) => p.position === ("mid" as Position),
    },
    attacking: {
      attackStats: ["shooting", "crossing", "dribbling"] as const,
      defendStats: ["interceptions", "tackling", "block"] as const,
      expectedAttackers: 3,
      expectedDefenders: 4,
      filterAttacking: (p: Player) => p.position === ("fwd" as Position),
      filterDefending: (p: Player) => p.position === ("def" as Position),
    },
  };

  const {
    attackStats,
    defendStats,
    expectedAttackers,
    expectedDefenders,
    filterAttacking,
    filterDefending,
  } = sectorMapping[sector];

  const attackingPlayers = attackingTeam.players.filter(filterAttacking);
  const defendingPlayers = defendingTeam.players.filter(filterDefending);

  const calculateTeamAverage = <T extends keyof Player["performance"]>(
    players: Player[],
    stats: readonly T[],
    expectedCount: number
  ): number => {
    const totalAverage =
      stats.reduce((sum, stat) => {
        const statTotal = players.reduce(
          (playerSum, player) => playerSum + (player.performance[stat] || 0),
          0
        );
        return sum + statTotal / expectedCount;
      }, 0) / stats.length;

    return Number(totalAverage.toFixed(2));
  };

  const attackAverage = calculateTeamAverage(
    attackingPlayers,
    attackStats,
    expectedAttackers
  );
  const defenseAverage = calculateTeamAverage(
    defendingPlayers,
    defendStats,
    expectedDefenders
  );

  const statDifference = Number((attackAverage - defenseAverage).toFixed(2));

  return statDifference;
}
