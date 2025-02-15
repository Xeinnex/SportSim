import React from "react";

type Player = {
  id: number;
  name: string;
  last_name: string;
  age: number;
};

type Team = {
  id: number;
  name: string;
  players: Player[];
};

const TeamCard: React.FC<{ team: Team }> = ({ team }) => {
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-2xl shadow-lg p-4 w-full">
      <h2 className="text-lg font-bold mb-4">{team.name}</h2>

      <div className="space-y-1">
        {team.players.map((player) => (
          <div
            key={player.id}
            className="border border-slate-600 py-1 px-2 rounded-md flex justify-between items-center text-sm"
          >
            <p
              className={`${
                player.age < 25 ? "text-yellow-400" : "text-white"
              } font-semibold`}
            >
              {player.name} {player.last_name}
            </p>
            <p className="text-gray-400 text-xs">Age: {player.age}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamCard;
