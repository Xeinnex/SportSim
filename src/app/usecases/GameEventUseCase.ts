import { GameState } from "@/domain/services/game_event_services/GameStateService";
import { EventExecutionService } from "@/domain/services/game_event_services/EventExecutionService";
import { EventProbabilityService } from "@/domain/services/game_event_services/EventProbabilityService";
import { selectEvent } from "@/domain/utils/EventSelector";
import { log } from "console";

export class GameEventUseCase {
  private gameState: GameState; // Class property

  constructor(initialState: GameState) {
    this.gameState = initialState; // Assigning passed state to class property
  }

  triggerNextEvent() {
    const eventTypes = [
      "advance",
      "shot",
      "reroll",
      "throw_in",
      "foul",
    ] as const;
    const eventChances = Object.fromEntries(
      eventTypes.map((event) => [
        event,
        EventProbabilityService.getProbability(
          this.gameState.currentSector,
          this.gameState.possession,
          event
        ),
      ])
    ) as Record<(typeof eventTypes)[number], number>;

    const { event, probability } = selectEvent(eventChances);
    if (event == "reroll" || event === "throw_in") {
      log(
        `🎯 \x1b[1;32mEvent selected: ${event} (Base probability: ${probability}%)\x1b[0m`
      );
    } else {
      log(`🎯 Event selected: ${event} (Base probability: ${probability}%)`);
    }
    this.executeEvent(event);
  }

  private executeEvent(event: string) {
    switch (event) {
      case "advance":
        EventExecutionService.handleAdvance(this.gameState);
        break;
      case "shot":
        EventExecutionService.handleShot(this.gameState);
        break;
      case "foul":
        EventExecutionService.handleFoul(this.gameState);
        break;
      case "reroll":
        EventExecutionService.handleReroll(this.gameState);
        break;
      case "throw_in":
        EventExecutionService.handleThrowIn(this.gameState);
        break;
      default:
        log(`Unhandled event: ${event}`);
    }
  }
}
