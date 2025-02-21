import { GameEvent, Sector } from "@/domain/entities/GameEvent";
import { EventOddsService } from "./EventOddsService";
import { EventOutcomeService } from "./EventOutcomeService";

class ShotEventService {
  constructor(
    private eventOddsService: EventOddsService,
    private eventOutcomeService: EventOutcomeService
  ) {}

  handleEvent(
    gameId: number,
    possessionTeamId: number,
    sector: Sector,
    primaryPlayerId: number,
    secondaryPlayerId: number,
    gameEvents: GameEvent[]
  ): { event: GameEvent; newPossessionTeamId: number } {
    const teamType = possessionTeamId === 1 ? "home" : "away";
    const shotProbability = this.eventOddsService.getEventProbability(
      sector,
      teamType,
      "shot"
    );

    if (Math.random() * 100 > shotProbability) {
      console.log(
        `Shot event did not trigger (probability too low: ${shotProbability}%)`
      );
      return {
        event: this.createEmptyEvent(
          gameId,
          possessionTeamId,
          sector,
          primaryPlayerId,
          secondaryPlayerId,
          gameEvents
        ),
        newPossessionTeamId: possessionTeamId,
      };
    }

    // **Delegate shot outcome determination to EventOutcomeService**
    let outcomes = this.eventOutcomeService.determineOutcome(
      sector,
      teamType,
      "shot"
    );

    const event: GameEvent = {
      id: gameEvents.length + 1,
      gameId,
      possessionTeamId,
      sector,
      eventType: "shot",
      outcome: outcomes,
      timestamp: Date.now(),
      primaryPlayerId,
      secondaryPlayerId,
    };

    // **Handle possession switch if needed**
    let newPossessionTeamId = possessionTeamId;
    if (outcomes.includes("goal") || outcomes.includes("save")) {
      newPossessionTeamId = possessionTeamId === 1 ? 2 : 1;
    }

    return { event, newPossessionTeamId };
  }

  private createEmptyEvent(
    gameId: number,
    possessionTeamId: number,
    sector: Sector,
    primaryPlayerId: number,
    secondaryPlayerId: number,
    gameEvents: GameEvent[]
  ): GameEvent {
    return {
      id: gameEvents.length + 1,
      gameId,
      possessionTeamId,
      sector,
      eventType: "reroll",
      outcome: [],
      timestamp: Date.now(),
      primaryPlayerId,
      secondaryPlayerId,
    };
  }
}
