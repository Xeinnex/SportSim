USE xeinnex_sport_sim;

UPDATE player_stats
JOIN players ON player_stats.player_id = players.id
SET 
    shooting = 75 + (ABS(players.age - 27)/2) + (RAND() * 10 - 5),
    passing = 75 + (ABS(players.age - 27)/2) + (RAND() * 10 - 5),
    dribbling = 75 + (ABS(players.age - 27)/2) + (RAND() * 10 - 5),
    `block` = 45 + (ABS(players.age - 27)/2) + (RAND() * 10 - 5),
    tackling = 45 + (ABS(players.age - 27)/2) + (RAND() * 10 - 5),
    interceptions = 45 + (ABS(players.age - 27)/2) + (RAND() * 10 - 5),
    strength = 70 + (ABS(players.age - 27)/2) + (RAND() * 10 - 5),
    speed = 70 + (ABS(players.age - 27)/2) + (RAND() * 10 - 5),
    stamina = 70 + (ABS(players.age - 27)/2) + (RAND() * 10 - 5),
    talent = 70 + (ABS(players.age - 27)/2) + (RAND() * 10 - 5),
    `save` = 45 + (ABS(players.age - 27)/2) + (RAND() * 10 - 5)
WHERE players.position = 'fwd';