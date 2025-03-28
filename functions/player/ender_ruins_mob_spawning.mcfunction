# Set mob caps
scoreboard players set capConduit var 2
scoreboard players set capElderman var 3
scoreboard players set capEnderSlime var 4
scoreboard players set capStalker var 2
scoreboard players set capEnderman var 5
scoreboard players set capEndermite var 8
scoreboard players set capEndergob var 4
scoreboard players set capRippling var 4
scoreboard players set capWarder var 6
scoreboard players set capShulker var 4
scoreboard players set capEnderslug var 3

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

execute as @e[r=100,type=xp:conduit] run scoreboard players add countConduit math 1
execute as @e[r=100,type=xp:elderman] run scoreboard players add countElderman math 1
execute as @e[r=100,type=xp:enderslime] run scoreboard players add countEnderSlime math 1
execute as @e[r=100,type=xp:stalker] run scoreboard players add countStalker math 1
execute as @e[r=100,type=minecraft:enderman] run scoreboard players add countEnderman math 1
execute as @e[r=100,type=minecraft:endermite] run scoreboard players add countEndermite math 1
execute as @e[r=100,type=xp:endergob] run scoreboard players add countEndergob math 1
execute as @e[r=100,type=xp:rippling] run scoreboard players add countRippling math 1
execute as @e[r=100,type=xp:warder] run scoreboard players add countWarder math 1
execute as @e[r=100,type=minecraft:shulker] run scoreboard players add countShulker math 1
execute as @e[r=100,type=xp:enderslug] run scoreboard players add countEnderslug math 1

# Player in the inner area: @s[x=290,y=153,z=-556,dx=50,dy=67,dz=50]

# Ruins, Outside the inner area. Mostly flying enemies
execute unless entity @s[x=290,y=153,z=-556,dx=50,dy=67,dz=50] if score countWarder math < capWarder var run function mob_spawning/ender_ruins/warder
execute unless entity @s[x=290,y=153,z=-556,dx=50,dy=67,dz=50] if score countRippling math < capRippling var run function mob_spawning/ender_ruins/rippling
execute unless entity @s[x=290,y=153,z=-556,dx=50,dy=67,dz=50] if score countEndergob math < capEndergob var run function mob_spawning/ender_ruins/endergob
execute unless entity @s[x=290,y=153,z=-556,dx=50,dy=67,dz=50] if score countShulker math < capShulker var run function mob_spawning/ender_ruins/shulker

# Ruins, Inside the inner area. Close range enemies
execute if entity @s[x=290,y=153,z=-556,dx=50,dy=67,dz=50] if score countEnderman math < capEnderman var run function mob_spawning/ender_ruins/enderman
# execute if entity @s[x=290,y=153,z=-556,dx=50,dy=67,dz=50] if score countElderman math < capElderman var run function mob_spawning/ender_ruins/elderman
execute if entity @s[x=290,y=153,z=-556,dx=50,dy=67,dz=50] if score countEndergob math < capEndergob var run function mob_spawning/ender_ruins/endergob
execute if entity @s[x=290,y=153,z=-556,dx=50,dy=67,dz=50] if score countEnderslug math < capEnderslug var run function mob_spawning/ender_ruins/enderslug
# execute if entity @s[x=290,y=153,z=-556,dx=50,dy=67,dz=50] if score countStalker math < capStalker var run function mob_spawning/ender_ruins/stalker
# execute if entity @s[x=290,y=153,z=-556,dx=50,dy=67,dz=50] if score countEnderSlime math < capEnderSlime var run function mob_spawning/ender_ruins/enderslime
execute if entity @s[x=290,y=153,z=-556,dx=50,dy=67,dz=50] if score countWarder math < capWarder var run function mob_spawning/ender_ruins/warder