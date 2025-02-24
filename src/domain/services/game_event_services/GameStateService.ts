import { Sector } from "@/domain/entities/GameEvent";
import { Team } from "@/domain/entities/Team";

export class GameState {
  possession: "home" | "away";
  currentSector: Sector;
  homeScore: number;
  awayScore: number;

  constructor() {
    this.possession = "home";
    this.currentSector = 1;
    this.homeScore = 0;
    this.awayScore = 0;
  }

  switchPossession() {
    this.possession = this.possession === "home" ? "away" : "home";
  }

  resetSectorAfterGoal() {
    this.currentSector = this.possession === "home" ? 1 : 3;
  }
}
