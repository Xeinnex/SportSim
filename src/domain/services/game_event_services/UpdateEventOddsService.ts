import { EVENT_ODDS, ORIGINAL_EVENT_ODDS } from "@/config/EventOdds";
import { GAME_SETTINGS } from "@/config/GameSettings";

export function updateEventOdds(
  category: keyof typeof EVENT_ODDS,
  keyToUpdate: keyof (typeof EVENT_ODDS)[keyof typeof EVENT_ODDS],
  modifier: number,
  isHomeTeam: boolean
) {
  if (isHomeTeam) {
    modifier += GAME_SETTINGS.homeTeamAdjuster;
  }
  const clampedModifier = Math.max(-20, Math.min(20, modifier));
  resetEventOdds();

  const categoryOdds = EVENT_ODDS[category];
  if (!categoryOdds || !(keyToUpdate in categoryOdds)) {
    throw new Error("Invalid category or key");
  }

  const currentValue = categoryOdds[keyToUpdate];
  const newValue = Math.max(0, Math.min(100, currentValue + clampedModifier)); // Clamp within [0, 100]

  const totalOtherValues = 100 - currentValue;
  const remainingTotal = 100 - newValue;

  const otherKeys = Object.keys(categoryOdds).filter(
    (k) => k !== keyToUpdate
  ) as Array<keyof typeof categoryOdds>;

  const updatedOdds: Partial<typeof categoryOdds> = { [keyToUpdate]: newValue };

  otherKeys.forEach((key) => {
    updatedOdds[key] = (categoryOdds[key] / totalOtherValues) * remainingTotal;
  });

  EVENT_ODDS[category] = updatedOdds as typeof categoryOdds;
}

function resetEventOdds() {
  Object.keys(ORIGINAL_EVENT_ODDS).forEach((cat) => {
    EVENT_ODDS[cat as keyof typeof EVENT_ODDS] = JSON.parse(
      JSON.stringify(ORIGINAL_EVENT_ODDS[cat as keyof typeof EVENT_ODDS])
    );
  });
}
