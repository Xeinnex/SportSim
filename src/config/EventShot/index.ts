import { PlayerPerformanceService } from "@/domain/services/PlayerPerformanceService";
import { onTargetEvent } from "./onTargetEvent";
import { Performance } from "@/domain/entities/Player";
import { Team } from "@/domain/entities/Team";
import { GameState } from "@/domain/services/game_event_services/GameStateService";

// ShotFile.ts
export const shotEvent: EventGame = {
    name: 'shot',
    percent: 30,
    events: [onTargetEvent]
}

interface Event {
    name: string
    percent: number
}

interface EventChild extends Event {
    events: EventGame[]
}

interface EventAction extends Event {
    execute: () => void
}

type EventGame = EventChild | EventAction