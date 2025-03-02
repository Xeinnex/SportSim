import { Sector } from "@/domain/entities/GameEvent";
import { GameState } from "@/domain/services/game_event_services/GameStateService";

export function getRelativeSector(
  gameState: GameState
): "defensive" | "midfield" | "attacking" {
  const sectorMap = {
    home: {
      1: "defensive",
      2: "midfield",
      3: "attacking",
    },
    away: {
      1: "attacking",
      2: "midfield",
      3: "defensive",
    },
  } as const;

  if (
    !sectorMap[gameState.possession] ||
    !sectorMap[gameState.possession][gameState.currentSector]
  ) {
    throw new Error(`Invalid game state: ${JSON.stringify(gameState)}`);
  }

  return sectorMap[gameState.possession][gameState.currentSector];
}
