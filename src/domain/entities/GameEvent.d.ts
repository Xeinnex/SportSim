import { Game } from "@/domain/entities/Game";

export type EventType =
  | "shot"
  | "advance"
  | "reroll"
  | "throw_in"
  | "foul"
  | "substitution";

export type Sector = 1 | 2 | 3;

export type Outcome =
  | "on_target"
  | "off_target"
  | "goal"
  | "save"
  | "yellow"
  | "red"
  | "injury"
  | "corner"
  | "rebound"
  | "switch_possession"
  | "retain_possession"
  | "penalty"
  | "player_sent_off";

export interface GameEvent {
  id: number;
  gameId: number;
  game?: Game;
  possessionTeamId: number;
  sector: Sector;
  primaryPlayerId: number; // primary player performing the event
  secondaryPlayerId: number; // secondary player (fouling, assisting, etc.)
  eventType: EventType;
  timestamp: number;
  outcome?: Outcome[];
}
