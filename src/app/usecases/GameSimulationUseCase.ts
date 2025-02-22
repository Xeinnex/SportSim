import { Team } from "@/domain/entities/Team";

export class GameSimulationUseCase {
  execute(team1: Team, team2: Team, turns: number) {
    let team1Score = 0;
    let team2Score = 0;

    for (let i = 0; i < turns; i++) {
      const team1Chance = this.calculateTeamChance(team1);
      const team2Chance = this.calculateTeamChance(team2);

      if (Math.random() * 100 < team1Chance) team1Score++;
      if (Math.random() * 100 < team2Chance) team2Score++;
    }

    return {
      team1Score,
      team2Score,
      winner: this.determineWinner(team1, team2, team1Score, team2Score),
    };
  }

  private calculateTeamChance(team: Team): number {
    if (!team.players || team.players.length === 0) return 0;

    const totalOffense = team.players.reduce((sum, player) => {
      return (
        sum + (player.performance.shooting + player.performance.dribbling) / 2
      );
    }, 0);

    return totalOffense / team.players.length;
  }

  private determineWinner(
    team1: Team,
    team2: Team,
    score1: number,
    score2: number
  ) {
    if (score1 > score2) {
      return team1.name;
    }
    if (score2 > score1) {
      return team2.name;
    }
    return "Draw";
  }
}
