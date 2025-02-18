// src/types.ts

export type Player = {
  id: number;
  name: string;
  lastName: string;
  age: number;
  position: string;
  stats: Performance[];
  avgStats: number;
};

export type Performance = {
  shooting: number;
  passing: number;
  dribbling: number;
  block: number;
  tackling: number;
  interceptions: number;
  strength: number;
  speed: number;
  stamina: number;
  talent: number;
  save: number;
};

export type Team = {
  id: number;
  name: string;
  players: Player[];
};
