export const EVENT_ODDS = {
  defensive: { advance: 60, shot: 0, reroll: 22, throw_in: 12, foul: 6 },
  midfield: { advance: 50, shot: 1, reroll: 22, throw_in: 16, foul: 11 },
  attacking: { advance: 0, shot: 60, reroll: 20, throw_in: 5, foul: 15 },
};

export const ORIGINAL_EVENT_ODDS = JSON.parse(JSON.stringify(EVENT_ODDS));

export const EVENT_RELEVANT_STATS = {
  advance: {
    attackStats: ["dribbling", "passing", "speed"],
    defenseStats: ["interceptions", "tackling", "block"],
  },
  shot: {
    attackStats: ["shooting", "speed", "crossing"],
    defenseStats: ["interceptions", "tackling", "block"],
  },
  reroll: {
    attackStats: ["passing", "speed"],
    defenseStats: ["interceptions"],
  },
  throw_in: {
    attackStats: ["dribbling"],
    defenseStats: ["tackling"],
  },
  foul: {
    attackStats: ["strength", "speed"],
    defenseStats: ["tackling", "strength"],
  },
};
