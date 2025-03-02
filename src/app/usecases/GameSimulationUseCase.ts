import { Team } from "@/domain/entities/Team";
import { GameState } from "@/domain/services/game_event_services/GameStateService";
import { GameEventUseCase } from "@/app/usecases/GameEventUseCase";
import { log } from "console";

export class GameSimulationUseCase {
  private gameState: GameState;
  private gameEventUseCase: GameEventUseCase;
  private homeTeam: Team;
  private awayTeam: Team;

  constructor(homeTeam: Team, awayTeam: Team) {
    this.gameState = new GameState();
    this.gameEventUseCase = new GameEventUseCase(this.gameState);
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;
  }

  // Add this getter to access gameState in tests
  public getGameState(): GameState {
    return this.gameState;
  }

  execute(homeTeam: Team, awayTeam: Team, turns: number) {
    this.gameState.currentSector = 2;
    this.gameState.possession = "home";
    this.gameState.homeScore = 0;
    this.gameState.awayScore = 0;

    for (let i = 0; i < turns; i++) {
      this.gameState.ticksElapsed++;
      log(
        `\nTurn ${i + 1}: ${
          this.getPossessionTeam(homeTeam, awayTeam).name
        } has possession in Sector ${this.gameState.currentSector}`
      );

      this.gameEventUseCase.triggerNextEvent(this.homeTeam, this.awayTeam);

      this.logGameState(homeTeam, awayTeam);
    }

    return {
      homeScore: this.gameState.homeScore,
      awayScore: this.gameState.awayScore,
      winner: this.determineWinner(homeTeam, awayTeam),
    };
  }

  private determineWinner(homeTeam: Team, awayTeam: Team): string {
    if (this.gameState.homeScore > this.gameState.awayScore)
      return homeTeam.name;
    if (this.gameState.awayScore > this.gameState.homeScore)
      return awayTeam.name;
    return "Draw";
  }

  private logGameState(homeTeam: Team, awayTeam: Team) {
    log(
      `Score: ${homeTeam.name} ${this.gameState.homeScore} - ${this.gameState.awayScore} ${awayTeam.name}`
    );
  }

  private getPossessionTeam(homeTeam: Team, awayTeam: Team): Team {
    return this.gameState.possession === "home" ? homeTeam : awayTeam;
  }
}
