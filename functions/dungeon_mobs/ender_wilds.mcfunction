scoreboard players set canSpawn math 0
# count mobs around
scoreboard players set mobCount math 0
execute as @e[r=16] run scoreboard players add mobCount math 1

# set canSpawn to 1 if a player is found in the area, but not too close
execute if entity @p[rm=8,r=32] if score mobCount math matches ..10 run scoreboard players set canSpawn math 1

# prevent mob spawning if any player has the disable flag
execute if entity @a[tag=disable_mob_spawning] run scoreboard players set canSpawn math 0

# decide which mob to spawn
scoreboard players random chance math 0 26

execute if score canSpawn math matches 1 if score chance math matches 0..9 run summon xp:warder
execute if score canSpawn math matches 1 if score chance math matches 10..16 run summon xp:endergob
execute if score canSpawn math matches 1 if score chance math matches 17..23 run summon xp:rippling
execute if score canSpawn math matches 1 if score chance math matches 24..26 run summon xp:enderslug