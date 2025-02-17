USE xeinnex_sport_sim;
-- formula to add stats to players  JSON_ARRAY(CEIL(65 - (ABS(age - 27)) + (RAND() * 24 - 10)))

-- SELECT * FROM player_stats
-- JOIN players ON player_stats.player_id = players.id
-- WHERE players.position = 'fwd';


SELECT 
    players.name,
    players.last_name,
    players.age,
    players.position,
    teams.name AS team_name,
    ROUND(
        (
            JSON_UNQUOTE(JSON_EXTRACT(player_stats.shooting, '$[0]')) + 
            JSON_UNQUOTE(JSON_EXTRACT(player_stats.dribbling, '$[0]')) + 
            JSON_UNQUOTE(JSON_EXTRACT(player_stats.passing, '$[0]')) + 
            JSON_UNQUOTE(JSON_EXTRACT(player_stats.speed, '$[0]'))
        ) / 4, 2
    ) AS average_offense
FROM players
JOIN team_players ON players.id = team_players.player_id
JOIN teams ON team_players.team_id = teams.id
JOIN player_stats ON players.id = player_stats.player_id
ORDER BY average_offense DESC;
