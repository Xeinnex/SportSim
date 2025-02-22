import { GameSimulationUseCase } from "@/app/usecases/GameSimulationUseCase";
import { Team } from "@/domain/entities/Team";
import { Player, Position } from "@/domain/entities/Player";
import { log } from "console";
import { PlayerPerformanceService } from "@/domain/services/PlayerPerformanceService";
import { PlayerEvalService } from "@/domain/services/PlayerEvalService";

const performanceService = new PlayerPerformanceService();

describe("GameSimulationUseCase", () => {
  let gameSimulation: GameSimulationUseCase;
  let teamA: Team;
  let teamB: Team;

  beforeEach(() => {
    gameSimulation = new GameSimulationUseCase();

    teamA = {
      id: 1,
      name: "Blaze",
      players: createMockPlayers(), // Players with avg 80 performance
    };

    teamB = {
      id: 2,
      name: "Sharks",
      players: createMockPlayers(), // Players with avg 70 performance
    };
  });

  function createMockPlayers(): Player[] {
    const positions: { position: Position; count: number }[] = [
      { position: "gk", count: 1 },
      { position: "def", count: 4 },
      { position: "mid", count: 3 },
      { position: "fwd", count: 3 },
    ];

    const players: Player[] = [];
    let idCounter = 1;

    for (const { position, count } of positions) {
      for (let i = 0; i < count; i++) {
        const age = Math.floor(Math.random() * (35 - 18 + 1)) + 18; // Random age between 18-35
        const player = {
          id: idCounter++,
          name: `name${idCounter}`,
          lastName: `lastname${idCounter}`,
          position,
          age,
          performance: performanceService.generatePerformance(position, age),
        };

        const avgScore = PlayerEvalService.calculateAvgScore(player);
        log(avgScore);
        players.push(player);
      }
    }

    return players;
  }

  test("should return a result (10 runs)", () => {
    log("\n=============== Simulation Start ===============\n");

    for (let i = 0; i < 50; i++) {
      const result = gameSimulation.execute(teamA, teamB, 100);

      const winner =
        result.winner === teamA.name
          ? `\x1b[1;31m${teamA.name}\x1b[0m`
          : result.winner === teamB.name
          ? `\x1b[1;36m${teamB.name}\x1b[0m`
          : `\x1b[1;33mDraw\x1b[0m`;

      log(
        `Run ${String(i + 1).padEnd(2)} | ${teamA.name.padEnd(2)} ${String(
          result.team1Score
        ).padStart(2)} - ${String(result.team2Score).padEnd(
          2
        )} ${teamB.name.padEnd(2)} | Winner: ${winner}`
      );
      expect(result).toHaveProperty("team1Score");
      expect(result).toHaveProperty("team2Score");
      expect(result).toHaveProperty("winner");
    }

    log("\n================ Simulation End ================\n");
  });
});
