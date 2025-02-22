import { Player } from "@/domain/entities/Player";
import { Team } from "@/domain/entities/Team";
import { PlayerEvalService } from "@/domain/services/PlayerEvalService";
import PlayerCard from "./PlayerCard";

export default function TeamCard({ team }: { team: Team }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-md font-bold">{team.name}</h2>
      <ul className="mt-2 text-xs text-gray-400">
        {team.players
          ?.map((tp) => {
            const overall = PlayerEvalService.calculateAvgScore(tp.player);
            return {
              ...tp.player,
              overall,
            };
          })
          .sort((a, b) => b.overall - a.overall)
          .map((tp) => (
            <PlayerCard key={tp.id} player={tp} overall={tp.overall} />
          ))}
      </ul>
    </div>
  );
}
