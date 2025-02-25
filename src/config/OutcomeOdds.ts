export const OUTCOME_ODDS = {
  advance: {
    retain_possession: 50,
    rebound: {
      chance: 20,
      outcomes: {
        stay: 70,
        move_back: 30,
      },
    },
    switch_possession: 30,
  },
  shot: {
    on_target: {
      chance: 30,
      outcomes: {
        goal: 20,
        save: 35,
        rebound: {
          chance: 20,
          outcomes: {
            stay: 70,
            move_back: 30,
          },
        },
        corner: 15,
        switch_possession: 10,
      },
    },
    off_target: {
      chance: 70,
      outcomes: {
        corner: 25,
        switch_possession: 65,
        rebound: {
          chance: 10,
          outcomes: {
            stay: 70,
            move_back: 30,
          },
        },
      },
    },
  },
  reroll: {
    retain_possession: 60,
    rebound: {
      chance: 20,
      outcomes: {
        stay: 70,
        move_back: 30,
      },
    },
    substitution: 20,
  },
  throw_in: {
    retain_possession: 70,
    switch_possession: 30,
  },
  foul: {
    retain_possession: 90,
    yellow: 9,
    red: 1,
    injury: 5,
    penalty: 15,
  },
};
