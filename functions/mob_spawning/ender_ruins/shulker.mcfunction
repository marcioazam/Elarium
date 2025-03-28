# summon 0-4 place_shulker mob_spawners in a cross shape
# each has a 25% chance of spawning
# they will each search in a 32, 32, 32 cube
scoreboard players random chance math 0 3
execute unless block ~ ~-1 ~ air if score chance math matches 0 run summon xp:mob_spawner ~8 ~10 ~ 
scoreboard players random chance math 0 3
execute unless block ~ ~-1 ~ air if score chance math matches 0 run summon xp:mob_spawner ~-8 ~10 ~ 
scoreboard players random chance math 0 3
execute unless block ~ ~-1 ~ air if score chance math matches 0 run summon xp:mob_spawner ~ ~15 ~8 
scoreboard players random chance math 0 3
execute unless block ~ ~-1 ~ air if score chance math matches 0 run summon xp:mob_spawner ~ ~15 ~-8 