import { GameEvent } from "@/domain/entities/GameEvent";

function testShotSimulation() {
  const eventOddsService = new EventOddsService();
  const shotService = new ShotEventService(eventOddsService);

  const state: GameEvent = {
    possessionTeamId: Math.random() < 0.5 ? 1 : 2,
    sector: 3, // Attacking third
    gameEvents: [],
  };

  for (let i = 0; i < 10; i++) {
    const event = shotService.handleEvent(state);
    state.gameEvents.push(event);
    console.log(
      `Shot Event #${event.id}: Team ${
        event.possessionTeamId
      } | Outcome: ${event.outcome.join(", ")}`
    );
  }

  console.log("Final Game Events:", state.gameEvents);
}

// Run the test
testShotSimulation();
