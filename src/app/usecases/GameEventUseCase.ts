import { GameState } from "@/domain/services/game_event_services/GameStateService";
import { EventExecutionService } from "@/domain/services/game_event_services/EventExecutionService";
import { EventProbabilityService } from "@/domain/services/game_event_services/EventProbabilityService";
import { selectEvent } from "@/domain/utils/EventSelector";
import { log } from "console";
import { getRelativeSector } from "@/domain/utils/GetRelativeSector";
import { getSectorStatsModifier } from "@/domain/services/game_event_services/AvgRelevantPlayerStatsService";
import { Team } from "@/domain/entities/Team";
import { updateEventOdds } from "@/domain/services/game_event_services/UpdateEventOddsService";

export class GameEventUseCase {
  private gameState: GameState; // Class property

  constructor(initialState: GameState) {
    this.gameState = initialState; // Assigning passed state to class property
  }

  triggerNextEvent(homeTeam: Team, awayTeam: Team) {
    const eventTypes = [
      "advance",
      "shot",
      "reroll",
      "throw_in",
      "foul",
    ] as const;

    // Determine the sector type dynamically
    const sectorType = getRelativeSector(this.gameState);

    // Identify attacking and defending teams based on possession
    const attackingTeam =
      this.gameState.possession === "home" ? homeTeam : awayTeam;
    const defendingTeam =
      this.gameState.possession === "home" ? awayTeam : homeTeam;

    // Get sector stats difference
    const statsDifference = getSectorStatsModifier(
      sectorType,
      attackingTeam,
      defendingTeam
    );

    const keyToUpdate = sectorType === "attacking" ? "shot" : "advance";

    // Apply stats adjustment only to the relevant event type
    const isHomeTeam = this.gameState.possession === "home";
    updateEventOdds(sectorType, keyToUpdate, statsDifference, isHomeTeam);

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

    log(
      `🎯 Event selected: ${event} (Final probability: ${probability.toFixed(
        2
      )}%)`
    );
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
