import { PrismaClient } from "@prisma/client";
import { AssignPlayersToTeams } from "./AssignPlayersToTeams";
import { PlayerService } from "@/domain/services/PlayerService";
import { TeamService } from "@/domain/services/TeamService";

const prisma = new PrismaClient();

new AssignPlayersToTeams().execute();
