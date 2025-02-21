import { Team } from "@/domain/entities/Team";

export interface Game {
  id: Number;
  HomeTeamId: Number;
  HomeTeam: Team;
  AwayTeamId: Number;
  AwayTeam: Team;
  HomeScore: Number;
  AwayScore: Number;
  GameNumber: Number;
}
