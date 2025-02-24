import { EventProbabilityService } from "./EventProbabilityService";
import { EventType, Outcome, Sector } from "@/domain/entities/GameEvent";

class EventOutcomeService {
  constructor(private eventProbabilityService: EventProbabilityService) {}

  determineOutcome(
    sector: Sector,
    possession: "home" | "away",
    eventType: EventType
  ): Outcome[] {
    // Get event probability from EventProbabilityService
    const eventProbability = this.eventProbabilityService.getEventProbability(
      sector,
      possession,
      eventType
    );

    return this.getEventOutcome(eventType);
  }

  private getEventOutcome(eventType: EventType): Outcome[] {
    const outcomeProbability: Record<
      EventType,
      { outcome: Outcome; chance: number }[]
    > = {
      advance: [
        { outcome: "retain_possession", chance: 70 },
        { outcome: "switch_possession", chance: 30 },
      ], // if retain_possession, move to next sector
      shot: [
        { outcome: "goal", chance: 10 },
        { outcome: "on_target", chance: 40 },
        { outcome: "off_target", chance: 50 },
      ],
      reroll: [{ outcome: "retain_possession", chance: 100 }], // Reroll means a retry event
      throw_in: [
        { outcome: "switch_possession", chance: 30 }, // Ball stays with the same team
        { outcome: "retain_possession", chance: 70 }, // Ball goes to the other team
      ],
      foul: [
        { outcome: "yellow", chance: 9 },
        { outcome: "red", chance: 1 },
        { outcome: "retain_possession", chance: 80 },
        { outcome: "penalty", chance: 10 },
      ],
    };

    let outcomes = this.pickOutcome(outcomeProbability[eventType]);

    // **Handle follow-up events based on primary outcome**
    if (eventType === "shot" && outcomes.includes("on_target")) {
      outcomes = this.handleShotOnTarget(outcomes);
    } else if (eventType === "foul") {
      outcomes = this.handleFoulOutcome(outcomes);
    }

    return outcomes;
  }

  private handleShotOnTarget(outcomes: Outcome[]): Outcome[] {
    const additionalOutcomes: { outcome: Outcome; chance: number }[] = [
      { outcome: "save", chance: 40 },
      { outcome: "corner", chance: 25 },
      { outcome: "rebound", chance: 15 },
      { outcome: "goal", chance: 20 },
    ];

    const followUpOutcome = this.pickOutcome(additionalOutcomes);

    // If "save" is selected, also add "switch_possession"
    if (followUpOutcome.includes("save")) {
      followUpOutcome.push("switch_possession");
    }

    return [...outcomes, ...followUpOutcome];
  }

  private handleFoulOutcome(outcomes: Outcome[]): Outcome[] {
    const additionalOutcomes: { outcome: Outcome; chance: number }[] = [
      { outcome: "yellow", chance: 9 },
      { outcome: "red", chance: 1 },
      { outcome: "retain_possession", chance: 80 },
      { outcome: "penalty", chance: 10 },
    ];

    const followUpOutcome = this.pickOutcome(additionalOutcomes);

    // If a red card occurs, the team loses a player
    if (followUpOutcome.includes("red")) {
      followUpOutcome.push("player_sent_off");
    }

    // Independent injury check (e.g., 10% chance of injury)
    const injuryChance = 10;
    if (Math.random() * 100 < injuryChance) {
      followUpOutcome.push("injury");
    }

    return [...outcomes, ...followUpOutcome];
  }

  private pickOutcome(
    possibleOutcomes: { outcome: Outcome; chance: number }[]
  ): Outcome[] {
    if (possibleOutcomes.length === 0) return []; // No outcome needed

    const roll = Math.random() * 100;
    let cumulative = 0;

    for (const { outcome, chance } of possibleOutcomes) {
      cumulative += chance;
      if (roll < cumulative) {
        return [outcome];
      }
    }

    return []; // Fallback, should never reach this
  }
}

export { EventOutcomeService };
