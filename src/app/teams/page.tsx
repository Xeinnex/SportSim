"use client";
import { useEffect, useState } from "react";
import TeamCard from "@/components/TeamCard";

type Player = {
  id: number;
  name: string;
  last_name: string;
  age: number;
  team_name: string;
};

type Team = {
  id: number;
  name: string;
  players: Player[];
};

export default function PlayersPage() {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    fetch("/api/teams")
      .then(async (res) => {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          if (!res.ok) throw new Error(data.error || "Failed to fetch players");

          // Get unique team names
          const uniqueTeams = new Set<string>();
          data.players.forEach((player: Player) =>
            uniqueTeams.add(player.team_name)
          );

          // Initialize teams, including empty ones
          const teamsMap: Record<string, Team> = {};
          Array.from(uniqueTeams).forEach((teamName, index) => {
            teamsMap[teamName] = {
              id: index + 1, // Fake ID
              name: teamName,
              players: [],
            };
          });

          // Assign players to teams
          data.players.forEach((player: Player) => {
            teamsMap[player.team_name].players.push(player);
          });

          // Convert to sorted array
          const sortedTeams = Object.values(teamsMap).sort((a, b) =>
            a.name.localeCompare(b.name)
          );

          // Debugging: Check if empty teams exist
          console.log("✅ Processed Teams:", sortedTeams);

          setTeams(sortedTeams);
        } catch (parseError) {
          console.error("❌ JSON Parse Error:", parseError);
        }
      })
      .catch((err) => console.error("❌ Fetch Error:", err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex justify-center p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
}
