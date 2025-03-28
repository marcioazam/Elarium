# summon 0-4 place_rippling mob_spawners in a cross shape
# each has a 25% chance of spawning
# they will each search in a 32, -32, 32 cube
scoreboard players random chance math 0 6
execute if score chance math matches 0 if block ~16 ~8 ~ air run summon xp:rippling ~16 ~8 ~16
execute if score chance math matches 0 if block ~16 ~8 ~ air run summon xp:sanctuary_mob_spawn ~16 ~8 ~16
scoreboard players random chance math 0 6
execute if score chance math matches 0 if block ~16 ~8 ~ air run summon xp:rippling ~16 ~8 ~-16
execute if score chance math matches 0 if block ~16 ~8 ~ air run summon xp:sanctuary_mob_spawn ~16 ~8 ~-16
scoreboard players random chance math 0 6
execute if score chance math matches 0 if block ~16 ~8 ~ air run summon xp:rippling ~-16 ~8 ~16
execute if score chance math matches 0 if block ~16 ~8 ~ air run summon xp:sanctuary_mob_spawn ~-16 ~8 ~16
scoreboard players random chance math 0 6
execute if score chance math matches 0 if block ~16 ~8 ~ air run summon xp:rippling ~-16 ~8 ~-16
execute if score chance math matches 0 if block ~16 ~8 ~ air run summon xp:sanctuary_mob_spawn ~-16 ~8 ~-16