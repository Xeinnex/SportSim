USE xeinnex_sport_sim;

SELECT players.*
FROM players
LEFT JOIN team_players ON players.id = team_players.player_id
WHERE team_players.team_id IS NULL;
