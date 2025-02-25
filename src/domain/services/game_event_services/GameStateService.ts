import { Sector } from "@/domain/entities/GameEvent";

export class GameState {
  possession: "home" | "away" = "home";
  currentSector: Sector = 1;
  homeScore: number = 0;
  awayScore: number = 0;
  halfTime: boolean = false;
  ticksElapsed: number = 0;
  homeSubstitutions: number = 0;
  awaySubstitutions: number = 0;

  switchPossession() {
    this.possession = this.possession === "home" ? "away" : "home";
  }

  resetSectorAfterGoal() {
    this.currentSector = this.possession === "home" ? 1 : 3;
  }

  toggleHalfTime() {
    this.halfTime = !this.halfTime;
  }
}
