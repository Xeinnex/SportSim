import { Player } from "@/domain/entities/Player";

export default function PlayerCard({
  player,
  overall,
}: {
  player: Player;
  overall: number;
}) {
  return (
    <li className="border-b border-gray-700 py-1 flex justify-between">
      <span>
        {player.name} {player.lastName} ({player.age}) - {player.position}
      </span>
      <span className="font-bold text-orange-300">{overall}</span>
    </li>
  );
}
