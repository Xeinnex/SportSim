"use client";

import { useState, useEffect } from "react";
import TeamCard from "@/components/TeamCard";
import { Team } from "@/domain/entities/Team";

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeams() {
      try {
        const response = await fetch("/api/teams");
        const data: Team[] = await response.json();
        setTeams(data);
      } catch (error) {
        console.error("Failed to load teams:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-cyan-300 flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex justify-center p-6">
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </div>
    </div>
  );
}
