import { PrismaClient } from "@prisma/client";
import CheckPlayersService from "@/domain/services/PlayerAvgStatService";

const prisma = new PrismaClient();
const checkPlayersService = new CheckPlayersService(prisma);

checkPlayersService.getTopPlayers("gk");
