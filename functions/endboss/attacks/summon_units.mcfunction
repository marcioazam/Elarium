# count units
scoreboard players set unit_count endboss 0
execute as @e[family=endboss_unit,r=80] run scoreboard players add unit_count endboss 1

# count players
scoreboard players set arena_player_count endboss 0
execute as @a[r=100] run scoreboard players add arena_player_count endboss 1

# determine if we want to spawn a unit
# set the unit cap depending on the amount of players on the arena
execute if score arena_player_count endboss matches 0..1 run scoreboard players set unit_cap endboss 3
execute if score arena_player_count endboss matches 2    run scoreboard players set unit_cap endboss 5
execute if score arena_player_count endboss matches 3    run scoreboard players set unit_cap endboss 7
execute if score arena_player_count endboss matches 4..  run scoreboard players set unit_cap endboss 8

execute if score unit_count endboss < unit_cap endboss run summon xp:endboss_mob_spawner ^ ^ ^8