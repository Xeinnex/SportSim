import TeamCard from "@/components/TeamCard";
import { TeamRepository } from "@/domain/repositories/TeamRepository";

export default async function TeamsPage() {
  const teamRepository = new TeamRepository();
  const teams = await teamRepository.getFullTeams();

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
