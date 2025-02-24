import { EVENT_ODDS } from "@/config/EventOdds";
import { EventType, Sector } from "@/domain/entities/GameEvent";

export class EventProbabilityService {
  getEventProbability(sector: number, possession: string, eventType: string) {
    throw new Error("Method not implemented.");
  }
  static sectorMap: Record<Sector, "defensive" | "midfield" | "attacking"> = {
    1: "defensive",
    2: "midfield",
    3: "attacking",
  };

  static getProbability(
    sector: Sector,
    possession: "home" | "away",
    event: EventType
  ): number {
    let zone: "defensive" | "midfield" | "attacking";

    if (sector === 2) {
      zone = "midfield";
    } else if (
      (sector === 3 && possession === "home") ||
      (sector === 1 && possession === "away")
    ) {
      zone = "attacking";
    } else {
      zone = "defensive";
    }

    const odds = EVENT_ODDS[zone];
    return odds[event] ?? 0;
  }
}
