import { GameSimulationUseCase } from "@/app/usecases/GameSimulationUseCase";
import { Team } from "@/domain/entities/Team";
import { Player, Position } from "@/domain/entities/Player";
import { log } from "console";
import { PlayerPerformanceService } from "@/domain/services/PlayerPerformanceService";
import { PlayerEvalService } from "@/domain/services/PlayerEvalService";

const performanceService = new PlayerPerformanceService();
const testAmount = 50;

describe("GameSimulationUseCase", () => {
  let gameSimulation: GameSimulationUseCase;
  let teamA: Team;
  let teamB: Team;

  beforeEach(() => {
    gameSimulation = new GameSimulationUseCase();

    teamA = {
      id: 1,
      name: "Blaze",
      players: createMockPlayers(),
    };

    teamB = {
      id: 2,
      name: "Sharks",
      players: createMockPlayers(),
    };
  });

  let teamNumber = 1;
  function createMockPlayers(): Player[] {
    const positions: { position: Position; count: number }[] = [
      { position: "gk", count: 1 },
      { position: "def", count: 4 },
      { position: "mid", count: 3 },
      { position: "fwd", count: 3 },
    ];

    const players: Player[] = [];
    let idCounter = 1;

    const avgScores = [];

    for (const { position, count } of positions) {
      for (let i = 0; i < count; i++) {
        const age = Math.floor(Math.random() * (35 - 18 + 1)) + 18;
        const player = {
          id: idCounter++,
          name: `name${idCounter}`,
          lastName: `lastname${idCounter}`,
          position,
          age,
          performance: performanceService.generatePerformance(position, age),
        };

        const avgScore = PlayerEvalService.calculateAvgScore(player);
        avgScores.push(avgScore);
        players.push(player);
      }
    }
    log(
      teamNumber === 1
        ? "\x1b[1;31mTeam Blaze\x1b[0m"
        : "\x1b[1;36mTeam Sharks\x1b[0m"
    );
    const teamAverage =
      Math.floor((avgScores.reduce((sum, score) => sum + score, 0) / 11) * 10) /
      10;
    log("Team Average:", teamAverage);
    teamNumber = 2;
    avgScores.sort((a, b) => b - a);
    log(avgScores);

    return players;
  }

  test("should return a result (5 runs)", () => {
    log("\n=============== Simulation Start ===============\n");

    let teamAWins = 0;
    let teamBWins = 0;
    let draws = 0;

    for (let i = 0; i < testAmount; i++) {
      const result = gameSimulation.execute(teamA, teamB, 60);

      let winner: string;
      if (result.homeScore > result.awayScore) {
        teamAWins++;
        winner = `\x1b[1;31m${teamA.name}\x1b[0m`;
      } else if (result.awayScore > result.homeScore) {
        teamBWins++;
        winner = `\x1b[1;36m${teamB.name}\x1b[0m`;
      } else {
        draws++;
        winner = `\x1b[1;33mDraw\x1b[0m`;
      }

      log(
        `Run ${String(i + 1).padEnd(2)} | ${teamA.name.padEnd(2)} ${String(
          result.homeScore
        ).padStart(2)} - ${String(result.awayScore).padEnd(
          2
        )} ${teamB.name.padEnd(2)} | Result: ${winner}`
      );

      // Update expectations to match the Game entity structure
      expect(result).toHaveProperty("homeScore");
      expect(result).toHaveProperty("awayScore");
      expect(result).toHaveProperty("winner");
    }

    log("\n===== Final Results =====");
    log(`\x1b[1;31m${teamA.name} Wins:\x1b[0m ${teamAWins}`);
    log(`\x1b[1;36m${teamB.name} Wins:\x1b[0m ${teamBWins}`);
    log(`\x1b[1;33mDraws:\x1b[0m ${draws}`);

    log("\n================ Simulation End ================\n");
  });
});
