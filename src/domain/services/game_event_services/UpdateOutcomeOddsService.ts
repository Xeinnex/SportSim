import { OUTCOME_ODDS, OutcomeOdds } from "@/config/OutcomeOdds";
import { GAME_SETTINGS } from "@/config/GameSettings";

const ORIGINAL_OUTCOME_ODDS: OutcomeOdds = JSON.parse(
  JSON.stringify(OUTCOME_ODDS)
);

export function updateOutcomeOdds(
  category: "base" | "outcomes", // ✅ Explicitly define category type
  keyToUpdate: string,
  modifier: number,
  isHomeTeam: boolean
) {
  // ✅ Reset odds before modifying
  Object.assign(
    OUTCOME_ODDS,
    JSON.parse(JSON.stringify(ORIGINAL_OUTCOME_ODDS))
  );

  if (isHomeTeam) {
    modifier += GAME_SETTINGS.homeTeamAdjuster;
  }
  const clampedModifier = Math.max(-20, Math.min(20, modifier));

  // ✅ Type-safe access to category
  const categoryOdds = OUTCOME_ODDS[category];
  if (!categoryOdds) {
    throw new Error(`Invalid category: ${category}`);
  }

  console.log(OUTCOME_ODDS[category].shot);

  // ✅ Handle "base" category (nested structure)
  if (category === "base") {
    updateNestedOdds(
      categoryOdds as Record<string, any>,
      keyToUpdate,
      clampedModifier
    );
  }

  // ✅ Handle "outcomes" category (flat structure)
  else {
    if (!(keyToUpdate in categoryOdds)) {
      throw new Error(`Invalid outcome key: ${keyToUpdate}`);
    }

    const target = categoryOdds[keyToUpdate] as Record<string, number>;

    Object.keys(target).forEach((outcomeKey) => {
      if (typeof target[outcomeKey] === "number") {
        adjustChance(target, outcomeKey, clampedModifier);
      }
    });
  }
  console.log(OUTCOME_ODDS[category].shot);

  // ✅ Debug log
  console.log(`\n=== Outcome Odds Update ===`);
  console.log(`Category: ${category}`);
  console.log(`Updated Key: ${keyToUpdate}`);
  console.log(`Modifier: ${clampedModifier}`);
  console.log(`===========================\n`);
}

// ✅ Updates nested keys in the "base" category
function updateNestedOdds(
  targetObj: Record<string, any>,
  keyPath: string,
  modifier: number
) {
  const keys = keyPath.split(".");
  let target: Record<string, any> = targetObj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!(key in target)) {
      throw new Error(`Invalid key path: ${keyPath}`);
    }

    target = target[key];
  }

  const finalKey = keys[keys.length - 1];

  if (typeof target[finalKey] === "number") {
    adjustChance(target, finalKey, modifier);
  } else {
    throw new Error(`Invalid key or non-numeric value: ${keyPath}`);
  }
}

// ✅ Adjusts probabilities while keeping total sum balanced
function adjustChance(
  targetObj: Record<string, number>,
  keyToUpdate: string,
  modifier: number
) {
  if (
    !(keyToUpdate in targetObj) ||
    typeof targetObj[keyToUpdate] !== "number"
  ) {
    throw new Error(`Invalid key or non-numeric value: ${keyToUpdate}`);
  }

  // Calculate new chance, ensuring it's between 0 and 100
  const newChance = Math.max(
    0,
    Math.min(100, targetObj[keyToUpdate] + modifier)
  );

  // Get all other keys with numeric values
  const otherKeys = Object.keys(targetObj).filter(
    (key) => key !== keyToUpdate && typeof targetObj[key] === "number"
  );

  // Calculate the remaining total that needs to be redistributed
  const remainingTotal = 100 - newChance;
  const totalOtherChances = otherKeys.reduce(
    (sum, key) => sum + targetObj[key],
    0
  );

  // Adjust other keys proportionally
  otherKeys.forEach((key) => {
    targetObj[key] = (targetObj[key] / totalOtherChances) * remainingTotal;
  });

  // Apply the new chance
  targetObj[keyToUpdate] = newChance;
}

// ✅ Example Calls (must match actual keys in OUTCOME_ODDS)
updateOutcomeOdds("base", "shot.on_target", 5.33, true); // Adjust shot-on-target odds
updateOutcomeOdds("outcomes", "shot.on_target.rebound", -3, false); // Adjust rebound odds
// updateOutcomeOdds("base", "reroll.rebound", 8, true); // Adjust reroll rebound odds
