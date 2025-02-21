import { AssignPlayersToTeams } from "./AssignPlayersToTeams";
import { PlayerService } from "@/domain/services/PlayerService";
import { TeamService } from "@/domain/services/TeamService";

jest.mock("@/domain/services/PlayerService");
jest.mock("@/domain/services/TeamService");

describe("AssignPlayersToTeams", () => {
  let playerService: any;
  let teamService: any;
  let assignPlayersToTeams: any;

  beforeEach(() => {
    playerService = new PlayerService();
    teamService = new TeamService();
    assignPlayersToTeams = new AssignPlayersToTeams(playerService, teamService);
  });

  it("should assign unassigned players to teams that need their position", async () => {
    playerService.getUnassignedPlayer = jest
      .fn()
      .mockResolvedValueOnce({
        id: 1,
        name: "John",
        lastName: "Doe",
        position: "mid",
      })
      .mockResolvedValueOnce({
        id: 2,
        name: "Jane",
        lastName: "Smith",
        position: "def",
      })
      .mockResolvedValueOnce(null); // No more players

    teamService.getTeamMissingPosition = jest
      .fn()
      .mockResolvedValueOnce({ id: 10 })
      .mockResolvedValueOnce({ id: 20 })
      .mockResolvedValueOnce(null); // No more teams needing positions

    teamService.assignPlayerToTeam = jest.fn().mockResolvedValue(undefined);

    await assignPlayersToTeams.execute();

    expect(playerService.getUnassignedPlayer).toHaveBeenCalledTimes(6);
    expect(teamService.getTeamMissingPosition).toHaveBeenCalledTimes(2);
    expect(teamService.assignPlayerToTeam).toHaveBeenCalledTimes(2);
    expect(teamService.assignPlayerToTeam).toHaveBeenCalledWith(1, 10, "mid");
    expect(teamService.assignPlayerToTeam).toHaveBeenCalledWith(2, 20, "def");
  });

  it("should stop if no teams need a player's position", async () => {
    playerService.getUnassignedPlayer = jest.fn().mockResolvedValue({
      id: 3,
      name: "Mike",
      lastName: "Johnson",
      position: "fwd",
    });
    teamService.getTeamMissingPosition = jest.fn().mockResolvedValue(null);
    teamService.assignPlayerToTeam = jest.fn();

    await assignPlayersToTeams.execute();

    expect(playerService.getUnassignedPlayer).toHaveBeenCalledTimes(1);
    expect(teamService.getTeamMissingPosition).toHaveBeenCalledTimes(1);
    expect(teamService.assignPlayerToTeam).not.toHaveBeenCalled();
  });
});
