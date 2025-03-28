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

# if it ended up on any other block, spawn the enderman there
execute if entity @s[tag=!invalid_block] if entity @p[scores={currentBiome=1}] run summon minecraft:enderman ~ ~ ~
execute if entity @s[tag=!invalid_block] if entity @p[scores={currentBiome=4}] run summon minecraft:enderman ~ ~ ~
execute if entity @s[tag=!invalid_block] if entity @p[scores={currentBiome=2..3}] run summon minecraft:enderman ~ ~ ~
execute if entity @s[tag=!invalid_block] if entity @p[scores={currentBiome=5..}] run summon minecraft:enderman ~ ~ ~
execute if entity @s[tag=!invalid_block] if entity @p[scores={currentBiome=..0}] run summon minecraft:enderman ~ ~ ~