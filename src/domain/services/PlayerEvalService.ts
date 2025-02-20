import { Position, Player } from "@/domain/entities/Player";

export class PlayerEvalService {
  private static relevantStats: Record<Position, string[]> = {
    gk: ["save", "stamina", "passing", "block", "tackling"],
    def: ["tackling", "block", "passing", "speed", "interceptions"],
    mid: ["passing", "dribbling", "dribbling", "speed", "interceptions"],
    fwd: ["shooting", "dribbling", "speed", "crossing", "passing"],
  };

  static getRelevantStats(position: Position): string[] {
    return this.relevantStats[position] || [];
  }

  static calculateAvgScore(player: Player): number {
    if (!player.performance) {
      return 0; // No performance data available
    }

    const relevantStats = PlayerEvalService.getRelevantStats(player.position);
    if (relevantStats.length === 0) return 0; // No relevant stats found

    const statValues = relevantStats
      .map(
        (stat) => player.performance[stat as keyof typeof player.performance]
      )
      .filter((stat): stat is number => typeof stat === "number"); // Ensures type safety

    if (statValues.length === 0) return 0; // Avoid division by zero

    const sum = statValues.reduce((acc, stat) => acc + stat, 0);
    return Math.round(sum / statValues.length); // Rounded to an integer
  }
}
