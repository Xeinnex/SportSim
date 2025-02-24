import { GameState } from "@/domain/services/game_event_services/GameStateService";
import { log } from "console";

export class EventExecutionService {
  static handleAdvance(state: GameState) {
    const success = Math.random() < 0.5;

    if (success) {
      if (state.possession === "home") {
        state.currentSector += 1;
      } else if (state.possession === "away") {
        state.currentSector -= 1;
      }
      log(
        `${state.possession.toUpperCase()} advances to Sector ${
          state.currentSector
        }`
      );
    } else {
      log(
        `${state.possession.toUpperCase()} failed to advance, possession switches.`
      );
      state.switchPossession();
    }
  }

  static handleShot(state: GameState) {
    log(`${state.possession.toUpperCase()} takes a shot and scores!`);

    if (state.possession === "home") {
      state.homeScore++;
    } else {
      state.awayScore++;
    }

    state.switchPossession();
    state.resetSectorAfterGoal();
  }
}
