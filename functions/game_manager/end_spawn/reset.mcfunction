
## Ticking Area
tickingarea remove end_spawn
execute in the_end run tickingarea add 0 5 0 0 5 0 end_spawn true

## Reset Entities
event entity @e[type=xp:game_manager.end_spawn] xp:despawn
execute in the_end run summon xp:game_manager.end_spawn 0 5 0

event entity @e[type=xp:gateway] xp:despawn
execute in the_end run structure load xp_gateway -155 57 13

event entity @e[type=xp:heart_of_ender.eye_1] xp:despawn
execute in the_end run summon xp:heart_of_ender.eye_1 -142.5 62 19.5 
execute in the_end run summon xp:heart_of_ender.eye_1 -145.5 61 11.5 
execute in the_end run summon xp:heart_of_ender.eye_1 -138.5 62 12.5 

# event entity @e[type=minecraft:ender_dragon] xp:despawn
# execute in the_end run summon minecraft:ender_dragon 0 90 0 

## Crystals
event entity @e[type=minecraft:ender_crystal] xp:despawn
execute in the_end run summon minecraft:ender_crystal -34 92 24
execute in the_end run summon minecraft:ender_crystal -42 101 -1
execute in the_end run summon minecraft:ender_crystal -34 95 -25
execute in the_end run summon minecraft:ender_crystal -13 77 -40
execute in the_end run summon minecraft:ender_crystal 12 80 -40
execute in the_end run summon minecraft:ender_crystal 33 98 -25
execute in the_end run summon minecraft:ender_crystal 42 86 0
execute in the_end run summon minecraft:ender_crystal 33 104 24
execute in the_end run summon minecraft:ender_crystal 12 89 39
execute in the_end run summon minecraft:ender_crystal -13 83 39

