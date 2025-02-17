import React from "react";
import PlayerData from "@/components/PlayerData";
import { Team } from "../types";

const TeamCard: React.FC<{ team: Team }> = ({ team }) => {
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-2xl shadow-lg p-4 w-full">
      <h2 className="text-lg font-bold mb-4">{team.name}</h2>

      <div className="space-y-1">
        {team.players.map((p) => (
          <div
            key={p.id}
            className="border border-slate-600 py-1 px-2 rounded-md flex justify-between items-center text-sm"
          >
            {/* Hover effect for player data */}
            <PlayerData player={p} />

            <div className="flex justify-between w-2/3">
              <p className="text-gray-400 text-xs text-right">Age: {p.age}</p>
              <p className="text-gray-400 text-xs text-right">
                Stat: {p.avgStats}
              </p>
              <p className="text-gray-400 text-xs text-right">
                Pos: {p.position}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamCard;
