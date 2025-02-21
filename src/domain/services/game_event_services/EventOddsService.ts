import { Sector, EventType } from "@/domain/entities/GameEvent";

export class EventOddsService {
  private baseOdds: Record<
    "defensive" | "midfield" | "attacking",
    Record<EventType, number>
  > = {
    defensive: {
      advance: 65,
      shot: 0,
      reroll: 20,
      throw_in: 10,
      foul: 5,
      substitution: 0,
    },
    midfield: {
      advance: 65,
      shot: 1,
      reroll: 15,
      throw_in: 9,
      foul: 10,
      substitution: 0,
    },
    attacking: {
      advance: 40,
      shot: 30,
      reroll: 10,
      throw_in: 5,
      foul: 15,
      substitution: 0,
    },
  };

  getEventProbability(
    sector: Sector,
    possession: "home" | "away",
    eventType: EventType
  ): number {
    // Determine if the team is in defensive, midfield, or attacking third
    let zone: "defensive" | "midfield" | "attacking";

    if (possession === "home") {
      // Home team attacks 1 → 3
      if (sector === 1) zone = "defensive";
      else if (sector === 2) zone = "midfield";
      else zone = "attacking";
    } else {
      // Away team attacks 3 → 1
      if (sector === 3) zone = "defensive";
      else if (sector === 2) zone = "midfield";
      else zone = "attacking";
    }

    return this.baseOdds[zone][eventType] ?? 0;
  }
}
