# executed as/at the mob_spawner entity where it ended up after its teleports

# despawning out the ones that spawned on top of the following blocks:
# Air
# Echoing Leaves
# Echoing Thick Leaves
# Echoing Pome Thick Leaves
# Echoing Log
# Echoing Root Log

execute unless block ~ ~2 ~ minecraft:air run tag @s add invalid_block
execute unless block ~ ~1 ~ minecraft:air run tag @s add invalid_block
execute unless block ~ ~ ~ minecraft:air run tag @s add invalid_block
execute if block ~ ~-1 ~ minecraft:air run tag @s add invalid_block
execute if block ~ ~-1 ~ xp:echoing_leaves run tag @s add invalid_block
execute if block ~ ~-1 ~ xp:echoing_thick_leaves run tag @s add invalid_block
execute if block ~ ~-1 ~ xp:echoing_pome_thick_leaves run tag @s add invalid_block
execute if block ~ ~-1 ~ xp:echoing_log run tag @s add invalid_block
execute if block ~ ~-1 ~ xp:echoing_root_log run tag @s add invalid_block
event entity @s[tag=invalid_block] xp:despawn

tag @s add invalid_platform
execute if block ~ ~-1 ~ xp:abyss_grass run tag @s remove invalid_platform
execute if block ~ ~-1 ~ xp:abyss_grass_bushy run tag @s remove invalid_platform
execute if block ~ ~-1 ~ xp:abyss_grass_full run tag @s remove invalid_platform
execute if block ~ ~-1 ~ xp:abyss_grass_plant run tag @s remove invalid_platform
execute if block ~ ~-1 ~ xp:abyss_grass_thick_roots run tag @s remove invalid_platform
execute if block ~ ~-1 ~ xp:abyss_rooted run tag @s remove invalid_platform
execute if block ~ ~-1 ~ xp:abyss_rooted_grass run tag @s remove invalid_platform
execute if block ~ ~-1 ~ xp:abyss_rooted_grass_bushy run tag @s remove invalid_platform
# if it ended up on any other block, and the floor block is correct, spawn the mimic there
execute if entity @s[tag=!invalid_block,tag=!invalid_platform] align xyz run summon xp:mimic