# executed as/at the mob_spawner entity where it ended up after its teleports

# spawn up to 5 enderbugs if positions find air
execute if block ~3 ~3 ~ minecraft:air run summon xp:enderbug
execute if block ~1 ~2 ~5 minecraft:air run summon xp:enderbug
execute if block ~-3 ~3 ~2 minecraft:air run summon xp:enderbug
execute if block ~3 ~1 ~-4 minecraft:air run summon xp:enderbug
execute if block ~-7 ~3 ~1 minecraft:air run summon xp:enderbug