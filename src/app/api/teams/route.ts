import { NextResponse } from "next/server";
import { TeamRepository } from "@/domain/repositories/TeamRepository";

export async function GET() {
  try {
    const teamRepository = new TeamRepository();
    const teams = await teamRepository.getFullTeams();
    return NextResponse.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}
