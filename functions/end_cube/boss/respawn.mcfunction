event entity @e[type=xp:end_cube] xp:instant_despawn

summon xp:end_cube_marker ~~~ 
effect @a[r=6] levitation 1 20 true

execute rotated -90 0 run summon xp:end_cube 312 223 -537
execute as @e[type=xp:end_cube] at @s run fill 313 223 -536 311 225 -538 barrier
execute as @e[type=xp:end_cube] at @s run tag @e[type=xp:end_cube_boss_activator,c=3] add "ender_boss"