export type Position = "gk" | "def" | "mid" | "fwd";

export interface Player {
  id: number;
  name: string;
  lastName: string;
  position: Position;
  age: number;
  performance: {
    speed: number;
    shooting: number;
    crossing: number;
    passing: number;
    dribbling: number;
    interceptions: number;
    block: number;
    tackling: number;
    strength: number;
    stamina: number;
    talent: number;
    save: number;
  };
  teams?: TeamPlayers[];
}
