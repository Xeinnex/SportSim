import { useState } from "react";
import { Player } from "../types";

export default function PlayerData({ player }: { player: Player }) {
  const [hovered, setHovered] = useState(false);

  const relevantStats = (() => {
    switch (player.position) {
      case "fwd":
        return ["shooting", "passing", "dribbling", "speed", "strength"];
      case "def":
        return ["block", "passing", "tackling", "speed", "interceptions"];
      case "mid":
        return ["passing", "dribbling", "strength", "speed", "interceptions"];
      default:
        return ["save", "passing", "block", "tackling"];
    }
  })();

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="cursor-pointer text-blue-400">{player.name}</span>

      {hovered && player.stats?.length && (
        <div className="absolute left-0 mt-2 w-56 bg-gray-800 text-white p-3 rounded-lg shadow-lg z-10">
          <p className="font-bold text-lg mb-2">
            {player.name} {player.lastName}
          </p>
          <p className="text-sm text-gray-400">
            Position: {player.position.toUpperCase()}
          </p>
          <hr className="my-2 border-gray-600" />
          <div className="grid grid-cols-2 gap-1">
            {Object.entries(player.stats[0]).map(([key, value]) => (
              <p
                key={key}
                className={`text-sm ${
                  relevantStats.includes(key) ? "text-yellow-400 font-bold" : ""
                }`}
              >
                {key}: {value}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
