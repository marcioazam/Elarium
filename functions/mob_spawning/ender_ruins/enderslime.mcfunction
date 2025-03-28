# summon 0-4 place_enderslime mob_spawners in a cross shape
# each has a 25% chance of spawning
# they will each search in a 32, 32, 32 cube
scoreboard players random chance math 0 1
execute if score chance math matches 0 run summon xp:mob_spawner ~4 ~10 ~ 
scoreboard players random chance math 0 1
execute if score chance math matches 0 run summon xp:mob_spawner ~-4 ~10 ~ 
scoreboard players random chance math 0 1
execute if score chance math matches 0 run summon xp:mob_spawner ~ ~15 ~4 
scoreboard players random chance math 0 1
execute if score chance math matches 0 run summon xp:mob_spawner ~ ~15 ~-4 