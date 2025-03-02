import { GameSimulationUseCase } from "@/app/usecases/GameSimulationUseCase";
import { GAME_SETTINGS } from "@/config/GameSettings";
import { Player, Position } from "@/domain/entities/Player";
import { Team } from "@/domain/entities/Team";
import { PlayerEvalService } from "@/domain/services/PlayerEvalService";
import { PlayerPerformanceService } from "@/domain/services/PlayerPerformanceService";
import { log } from "console";

const performanceService = new PlayerPerformanceService();
const testAmount = 100;

describe("GameSimulationUseCase", () => {
  let gameSimulation: GameSimulationUseCase;
  let teamA: Team;
  let teamB: Team;

  beforeEach(() => {
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

    gameSimulation = new GameSimulationUseCase(teamA, teamB);
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

    return players;
  }

  test("should return an amount of runs", () => {
    log("\n=============== Simulation Start ===============\n");

    let teamAWins = 0;
    let teamBWins = 0;
    let draws = 0;

    let homeGoalsDistribution = new Array(11).fill(0);
    let awayGoalsDistribution = new Array(11).fill(0);
    let totalHomeGoals = 0;
    let totalAwayGoals = 0;

    const teamAScores: number[] = [];
    const teamBScores: number[] = [];

    for (const player of teamA.players ?? []) {
      teamAScores.push(PlayerEvalService.calculateAvgScore(player));
    }

    for (const player of teamB.players ?? []) {
      teamBScores.push(PlayerEvalService.calculateAvgScore(player));
    }

    // Calculate team averages
    const teamAAverage =
      Math.floor(
        (teamAScores.reduce((sum, score) => sum + score, 0) / 11) * 10
      ) / 10;
    const teamBAverage =
      Math.floor(
        (teamBScores.reduce((sum, score) => sum + score, 0) / 11) * 10
      ) / 10;

    // Sort scores for better readability
    teamAScores.sort((a, b) => b - a);
    teamBScores.sort((a, b) => b - a);

    log("\x1b[1;31mTeam Blaze\x1b[0m");
    log("Team Average:", teamAAverage);
    log("Player Scores:", teamAScores);

    log("\x1b[1;36mTeam Sharks\x1b[0m");
    log("Team Average:", teamBAverage);
    log("Player Scores:", teamBScores);

    for (let i = 0; i < testAmount; i++) {
      const result = gameSimulation.execute(
        teamA,
        teamB,
        GAME_SETTINGS.gameTicks
      );

      if (result.homeScore > result.awayScore) {
        teamAWins++;
      } else if (result.awayScore > result.homeScore) {
        teamBWins++;
      } else {
        draws++;
      }

      if (result.homeScore <= 10) homeGoalsDistribution[result.homeScore]++;
      if (result.awayScore <= 10) awayGoalsDistribution[result.awayScore]++;

      totalHomeGoals += result.homeScore;
      totalAwayGoals += result.awayScore;
    }

    log("\n===== Final Results =====");
    log(`\x1b[1;31m${teamA.name} Wins:\x1b[0m ${teamAWins}`);
    log(`\x1b[1;36m${teamB.name} Wins:\x1b[0m ${teamBWins}`);
    log(`\x1b[1;33mDraws:\x1b[0m ${draws}`);

    log("\n===== Home Team Goal Distribution =====");
    log(`Total Games: ${testAmount}`);
    for (let i = 0; i <= 10; i++) {
      log(`⚽ ${i} goals: ${homeGoalsDistribution[i]} times`);
    }
    log(`Total Home Goals Scored: ${totalHomeGoals}`);

    log("\n===== Away Team Goal Distribution =====");
    for (let i = 0; i <= 10; i++) {
      log(`⚽ ${i} goals: ${awayGoalsDistribution[i]} times`);
    }
    log(`Total Away Goals Scored: ${totalAwayGoals}`);

    log("\n===== Players Used for Simulation =====");

    log(`\x1b[1;31m${teamA.name} Average Score:\x1b[0m`, teamAAverage);
    log(teamAScores.sort((a, b) => b - a));

    log(`\x1b[1;36m${teamB.name} Average Score:\x1b[0m`, teamBAverage);
    log(teamBScores.sort((a, b) => b - a));

    log("\n================ Simulation End ================\n");
  });

  //test("should validate sector filtering", () => {});
});
