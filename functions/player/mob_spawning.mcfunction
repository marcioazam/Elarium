# Run every 10s at the player

# Set mob caps
scoreboard players set capConduit var 3
scoreboard players set capElderman var 10
execute if score @s currentBiome matches 2 run scoreboard players set capElderman var 6
scoreboard players set capEFEnderman var 10
scoreboard players set capEndermite var 10
scoreboard players set capEnderSlime var 10
execute if score @s currentBiome matches 2 run scoreboard players set capEnderSlime var 20
scoreboard players set capAllay var 10
scoreboard players set capStalker var 3
scoreboard players set capEnderman var 10
execute if score @s currentBiome matches 2 run scoreboard players set capEnderman var 20
scoreboard players set capMimic var 20
scoreboard players set capEnderbug var 15

# Get mob counts
scoreboard players set countConduit math 0
scoreboard players set countElderman math 0
scoreboard players set countEFEnderman math 0
scoreboard players set countEndermite math 0
scoreboard players set countEnderSlime math 0
scoreboard players set countAllay math 0
scoreboard players set countStalker math 0
scoreboard players set countEnderman math 0
scoreboard players set countMimic math 0
scoreboard players set countEnderbug math 0

execute as @e[type=xp:conduit] run scoreboard players add countConduit math 1
execute as @e[type=xp:elderman] run scoreboard players add countElderman math 1
# execute as @e[type=xp:?] run scoreboard players add countEFEnderman math 1
execute as @e[type=minecraft:endermite] run scoreboard players add countEndermite math 1
execute as @e[type=xp:enderslime] run scoreboard players add countEnderSlime math 1
execute as @e[type=minecraft:allay] run scoreboard players add countAllay math 1
execute as @e[type=xp:stalker] run scoreboard players add countStalker math 1
execute as @e[type=minecraft:enderman] run scoreboard players add countEnderman math 1
execute as @e[type=xp:mimic] run scoreboard players add countMimic math 1
execute as @e[type=xp:enderbug] run scoreboard players add countEnderbug math 1

# Echoing Forest
execute if score @s currentBiome matches 1 if score countConduit math < capConduit var run function mob_spawning/conduit
execute if score @s currentBiome matches 1 if score countElderman math < capElderman var run function mob_spawning/elderman
execute if score @s currentBiome matches 1 if score countEnderman math < capEnderman var run function mob_spawning/enderman
execute if score @s currentBiome matches 1 if score countEndermite math < capEndermite var run function mob_spawning/endermite
execute if score @s currentBiome matches 1 if score countEnderSlime math < capEnderSlime var run function mob_spawning/enderslime
execute if score @s currentBiome matches 1 if score countAllay math < capAllay var run function mob_spawning/allay

# Ender Riftlands
execute if score @s currentBiome matches 2 if score countConduit math < capConduit var run function mob_spawning/riftlands/conduit
execute if score @s currentBiome matches 2 if score countEnderbug math < capEnderbug var run function mob_spawning/riftlands/enderbug_swarm
execute if score @s currentBiome matches 2 if score countEnderSlime math < capEnderSlime var run function mob_spawning/riftlands/enderslime
execute if score @s currentBiome matches 2 if score countEnderman math < capEnderman var run function mob_spawning/riftlands/enderman

# Ender Abyss
execute if score @s currentBiome matches 3  if score countConduit math < capConduit var run function mob_spawning/conduit
execute if score @s currentBiome matches 3  if score countEnderman math < capEnderman var run function mob_spawning/enderman
execute if score @s currentBiome matches 3  if score countEndermite math < capEndermite var run function mob_spawning/endermite
execute if score @s currentBiome matches 3  if score countMimic math < capMimic var run function mob_spawning/abyss/mimic

# Ender wilds
execute if score @s currentBiome matches 4 if score countEnderman math < capEnderman var run function mob_spawning/enderman
execute if score @s currentBiome matches 4 if score countConduit math < capConduit var run function mob_spawning/conduit
execute if score @s currentBiome matches 4 if score countElderman math < capElderman var run function mob_spawning/elderman
execute if score @s currentBiome matches 4 if score countEndermite math < capEndermite var run function mob_spawning/endermite
execute if score @s currentBiome matches 4 if score countEnderSlime math < capEnderSlime var run function mob_spawning/enderslime
execute if score @s currentBiome matches 4 if score countStalker math < capStalker var run function mob_spawning/stalker

