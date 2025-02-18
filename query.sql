SELECT 
  t.name AS team_name,
  AVG(ranked_players.average_performance) AS team_avg_performance
FROM Player p
JOIN PlayerPerformance pp ON p.id = pp.playerId
JOIN TeamPlayers tp ON p.id = tp.playerId
JOIN Team t ON tp.teamId = t.id
JOIN (
  SELECT 
    tp.teamId,
    p.id AS player_id,
    CASE 
      WHEN p.position = 'fwd' THEN
        (pp.shooting + pp.passing + pp.dribbling + pp.speed + pp.strength) / 5.0
      WHEN p.position = 'mid' THEN
        (pp.passing + pp.dribbling + pp.speed + pp.stamina + pp.interceptions) / 5.0
      WHEN p.position = 'def' THEN
        (pp.passing + pp.block + pp.tackling + pp.interceptions + pp.speed) / 5.0
      WHEN p.position = 'gk' THEN
        (pp.save + pp.strength + pp.interceptions + pp.block) / 4.0
    END AS average_performance
  FROM Player p
  JOIN PlayerPerformance pp ON p.id = pp.playerId
  JOIN TeamPlayers tp ON p.id = tp.playerId
  JOIN Team t ON tp.teamId = t.id
  ORDER BY tp.teamId, average_performance DESC
) ranked_players ON tp.playerId = ranked_players.player_id
WHERE (SELECT COUNT(*) 
       FROM TeamPlayers tp2 
       WHERE tp2.teamId = ranked_players.teamId AND tp2.playerId <= ranked_players.player_id) <= 11
GROUP BY t.name
ORDER BY team_avg_performance DESC;

Blazing Bananas
Sharknado Champions
Turbo Titans
Sonic Sloths
Titanium Toads
Phantom Pickles
Avalanche Outlaws
Furious Forks
Punching Broccos
Vortex Vikings
Stealthy Krakens
Molten Mavericks
Nitro Knights
Spicy Kings
Night Strikers
Funky Flamingos
Mystic Roosters
Dizzy Fishys
Chill Force
Mighty Mice
Goal Diggers
Ball Busters
Toxic Bullets
Pitch Invaders
Swift Kicks
Neon Magic
Moon Runners
Boom Jokers
Crimson Rhinos
Yellow Force
Atomic Frenzy
Planet Ringers