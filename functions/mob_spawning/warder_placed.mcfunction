# executed as/at the mob_spawner entity where it ended up after its teleports

# despawning out the ones that spawned on top of air
execute if block ~ ~-1 ~ minecraft:air run tag @s add invalid_block
event entity @s[tag=invalid_block] xp:despawn

# if it ended up on any other block, spawn the warder there
execute if entity @s[tag=!invalid_block] run summon xp:warder