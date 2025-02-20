import { Team } from "@/domain/entities/Team";
import PlayerCard from "./PlayerCard";
import { PlayerEvalService } from "@/domain/services/PlayerEvalService";

export default function TeamCard({ team }: { team: Team }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold">{team.name}</h2>
      <ul className="mt-2 text-xs text-gray-400">
        {team.players
          ?.map((tp: any) => ({
            ...tp,
            overall: PlayerEvalService.calculateAvgScore(tp.player),
          }))
          .sort((a, b) => b.overall - a.overall) // Sort by overall score
          .map((tp: any) => (
            <PlayerCard
              key={tp.player.id}
              player={tp.player}
              overall={tp.overall}
            />
          ))}
      </ul>
    </div>
  );
}
