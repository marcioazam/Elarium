# summon 0-4 place_conduit mob_spawners in a cross shape at y=60
# each has a 25% chance of spawning
# they will each search in a 32, -32, 32 cube
scoreboard players random chance math 0 12
execute if score chance math matches 0 run summon xp:mob_spawner ~32 60 ~ 
scoreboard players random chance math 0 12
execute if score chance math matches 0 run summon xp:mob_spawner ~-32 60 ~ 
scoreboard players random chance math 0 12
execute if score chance math matches 0 run summon xp:mob_spawner ~ 60 ~32 
scoreboard players random chance math 0 12
execute if score chance math matches 0 run summon xp:mob_spawner ~ 60 ~-32 