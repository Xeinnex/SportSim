"use client";
import { useEffect, useState } from "react";
import TeamCard from "@/components/TeamCard";
import { Player, Team } from "../../types/types";

export default function PlayersPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/teams")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch teams: ${res.statusText}`);
        }

        const text = await res.text();

        try {
          const data =
            text.startsWith("{") || text.startsWith("[")
              ? JSON.parse(text)
              : null;

          if (!data) {
            throw new Error("Response is not valid JSON");
          }

          console.log("Raw API Response:", data);

          const teamsMap: Record<number, Team> = {};
          data.teams.forEach((team: Team) => {
            if (!teamsMap[team.id]) {
              teamsMap[team.id] = {
                id: team.id,
                name: team.name,
                players: [],
              };
            }

            team.players.forEach((player: Player) => {
              const avgStats = calculateAvgScore(player);
              teamsMap[team.id].players.push({ ...player, avgStats });
            });

            // Sort players within each team by highest avgStats
            teamsMap[team.id].players.sort((a, b) => b.avgStats - a.avgStats);
          });

          // Convert teamsMap to an array and sort by best player's avgStats
          const sortedTeams = Object.values(teamsMap).sort((a, b) => {
            const bestA = a.players[0]?.avgStats || 0;
            const bestB = b.players[0]?.avgStats || 0;
            return bestB - bestA;
          });

          setTeams(sortedTeams);
        } catch (parseError) {
          console.error("❌ JSON Parse Error:", parseError);
          setError("Failed to parse teams data.");
        }
      })
      .catch((err) => {
        console.error("❌ Fetch Error:", err);
        setError(err.message || "An error occurred while fetching teams.");
      });
  }, []);

  const calculateAvgScore = (player: Player): number => {
    if (
      !player.stats ||
      !Array.isArray(player.stats) ||
      player.stats.length === 0
    ) {
      return 0; // No stats available
    }

    const playerStats = player.stats[0]; // Get first stats object
    let relevantStats: number[] = [];

    switch (player.position) {
      case "fwd":
        relevantStats = [
          playerStats.shooting,
          playerStats.passing,
          playerStats.dribbling, // Fixed typo
          playerStats.speed,
          playerStats.strength,
        ];
        break;
      case "def":
        relevantStats = [
          playerStats.block,
          playerStats.passing,
          playerStats.tackling,
          playerStats.speed,
          playerStats.interceptions,
        ];
        break;
      case "mid":
        relevantStats = [
          playerStats.passing,
          playerStats.dribbling, // Fixed typo
          playerStats.strength,
          playerStats.speed,
          playerStats.interceptions,
        ];
        break;
      default:
        relevantStats = [
          playerStats.save,
          playerStats.passing,
          playerStats.block,
          playerStats.tackling,
        ];
        break;
    }

    if (relevantStats.length === 0) return 0; // Avoid division by zero

    const sum = relevantStats.reduce((acc, stat) => acc + stat, 0);
    return Math.round((sum / relevantStats.length) * 10) / 10;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex justify-center p-6">
      <div className="w-full max-w-7xl">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
