import { Short_Stack } from "next/font/google";

export type OutcomeOdds = {
  base: Record<string, Record<string, number>>;
  outcomes: Record<string, Record<string, number>>;
};

export const OUTCOME_ODDS: OutcomeOdds = {
  base: {
    advance: { retain_possession: 50, rebound: 20, switch_possession: 30 },
    shot: { on_target: 30, off_target: 70 },
    reroll: { retain_possession: 60, rebound: 20, substitution: 20 },
    throw_in: { retain_possession: 70, switch_possession: 30 },
    foul: { retain_possession: 90, yellow: 9, red: 1, injury: 5, penalty: 15 },
  },
  outcomes: {
    "advance.rebound": { stay: 70, move_back: 30 },
    shotOn: {
      goal: 20,
      save: 35,
      rebound: 20,
      corner: 15,
      switch_possession: 10,
    },
    shotOff: { corner: 25, switch_possession: 65, rebound: 10 },
    "shot.on_target.rebound": { stay: 70, move_back: 30 },
    "shot.off_target.rebound": { stay: 70, move_back: 30 },
    "reroll.rebound": { stay: 70, move_back: 30 },
  },
};
