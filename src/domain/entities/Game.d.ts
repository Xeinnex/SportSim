import { Team } from "@/domain/entities/Team";

export interface Game {
  id: number;
  HomeTeamId: number;
  HomeTeam: Team;
  AwayTeamId: number;
  AwayTeam: Team;
  HomeScore: number;
  AwayScore: number;
  GameNumber: number;
}
