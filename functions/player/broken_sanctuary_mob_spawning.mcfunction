# Run every 2s at the player

# Set mob caps
scoreboard players set capConduit var 2
# scoreboard players set capElderman var 2
scoreboard players set capElderman var 0
scoreboard players set capEnderSlime var 10
# scoreboard players set capStalker var 2
scoreboard players set capStalker var 0
scoreboard players set capEnderman var 5
scoreboard players set capEndermite var 8
scoreboard players set capEndergob var 4
scoreboard players set capRippling var 8
scoreboard players set capWarder var 12
scoreboard players set capShulker var 5
scoreboard players set capEnderslug var 5

# Get mob counts
scoreboard players set countConduit math 0
scoreboard players set countElderman math 0
scoreboard players set countEnderSlime math 0
scoreboard players set countStalker math 0
scoreboard players set countEnderman math 0
scoreboard players set countEndermite math 0
scoreboard players set countEndergob math 0
scoreboard players set countRippling math 0
scoreboard players set countWarder math 0
scoreboard players set countShulker math 0
scoreboard players set countEnderslug math 0

execute as @e[r=500,type=xp:conduit] run scoreboard players add countConduit math 1
execute as @e[r=500,type=xp:elderman] run scoreboard players add countElderman math 1
execute as @e[r=500,type=xp:enderslime] run scoreboard players add countEnderSlime math 1
execute as @e[r=500,type=xp:stalker] run scoreboard players add countStalker math 1
execute as @e[r=500,type=minecraft:enderman] run scoreboard players add countEnderman math 1
execute as @e[r=500,type=minecraft:endermite] run scoreboard players add countEndermite math 1
execute as @e[r=500,type=xp:endergob,tag=!no_tp] run scoreboard players add countEndergob math 1
execute as @e[r=500,type=xp:rippling] run scoreboard players add countRippling math 1
execute as @e[r=500,type=xp:warder] run scoreboard players add countWarder math 1
execute as @e[r=500,type=minecraft:shulker] run scoreboard players add countShulker math 1
execute as @e[r=500,type=xp:enderslug] run scoreboard players add countEnderslug math 1
# Broken Sanctuary Bridges
execute if score @s currentBiome matches 5 if score countWarder math < capWarder var run function mob_spawning/broken_sanctuary/warder
execute if score @s currentBiome matches 5 if score countEnderslug math < capEnderslug var run function mob_spawning/broken_sanctuary/enderslug
execute if score @s currentBiome matches 5 if score countRippling math < capRippling var run function mob_spawning/broken_sanctuary/rippling
execute if score @s currentBiome matches 5 if score countEndergob math < capEndergob var run function mob_spawning/broken_sanctuary/endergob
execute if score @s currentBiome matches 5 if score countEndermite math < capEndermite var run function mob_spawning/broken_sanctuary/endermite
execute if score @s currentBiome matches 5 if score countShulker math < capShulker var run function mob_spawning/broken_sanctuary/shulker
execute if score @s currentBiome matches 5 if score countConduit math < capConduit var run function mob_spawning/broken_sanctuary/conduit

# Broken Sanctuary Clusters
execute if score @s currentBiome matches 6 if score countEnderman math < capEnderman var run function mob_spawning/broken_sanctuary/enderman
execute if score @s currentBiome matches 6 if score countElderman math < capElderman var run function mob_spawning/broken_sanctuary/elderman
execute if score @s currentBiome matches 6 if score countEnderSlime math < capEnderSlime var run function mob_spawning/broken_sanctuary/enderslime
execute if score @s currentBiome matches 6 if score countWarder math < capWarder var run function mob_spawning/broken_sanctuary/warder

# Broken Sanctuary Interiors
execute if score @s currentBiome matches 7 if score countElderman math < capElderman var run function mob_spawning/broken_sanctuary/elderman
execute if score @s currentBiome matches 7 if score countWarder math < capWarder var run function mob_spawning/broken_sanctuary/warder
execute if score @s currentBiome matches 7 if score countStalker math < capStalker var run function mob_spawning/broken_sanctuary/stalker
execute if score @s currentBiome matches 7 if score countEnderman math < capEnderman var run function mob_spawning/broken_sanctuary/enderman