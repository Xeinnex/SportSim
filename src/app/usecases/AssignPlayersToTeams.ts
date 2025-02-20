import { PlayerService } from "@/domain/services/PlayerService";
import { TeamService } from "@/domain/services/TeamService";
import { Position } from "@/domain/entities/Player";

export class AssignPlayersToTeams {
  constructor(
    private playerService: PlayerService,
    private teamService: TeamService
  ) {}

  async execute() {
    const positions: Position[] = ["gk", "def", "mid", "fwd"];

    for (const position of positions) {
      while (true) {
        const player = await this.playerService.getUnassignedPlayer(position); // Fetch ONE player
        if (!player) break; // No more players to assign

        const team = await this.teamService.getTeamMissingPosition(position);
        if (!team) break; // No teams need this position

        await this.teamService.assignPlayerToTeam(player.id, team.id, position);
        console.log(
          `✅ Assigned ${player.name} ${player.lastName} (ID: ${player.id}) to Team ${team.id}`
        );
      }
    }

    console.log("✅ All available players assigned to teams.");
  }
}
