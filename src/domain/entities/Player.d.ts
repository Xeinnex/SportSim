export type Position = "gk" | "def" | "mid" | "fwd";
export interface Performance {
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
}
export interface Player {
  id: number;
  name: string;
  lastName: string;
  position: Position;
  age: number;
  playerShirt?: number;
  performance: Performance;
}
