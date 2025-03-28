scoreboard objectives remove end_cube_boss
scoreboard objectives add end_cube_boss dummy
scoreboard players set "sanctuary_intro" end_cube_boss 1

music stop 4

event entity @e[family=end_cube] xp:instant_despawn
event entity @e[type=!player,family=mob,family=!end_cube,x=300,y=222,z=-549,dx=24,dy=125,dz=24] xp:instant_despawn

summon xp:end_cube 312 223 -537
summon xp:end_cube_boss_activator 312 223 -529 
summon xp:end_cube_boss_activator 304 223 -537
summon xp:end_cube_boss_activator 312 223 -545
summon xp:end_cube_barrier 313 223 -537

execute as @e[type=xp:end_cube] at @s run fill 313 223 -536 311 225 -538 barrier
execute as @e[type=xp:end_cube] at @s run tag @e[type=xp:end_cube_boss_activator,c=3] add "ender_boss"
execute as @e[type=xp:end_cube_boss_activator,family=!"interaction"] at @s run fill ~1~4~1~-1~1~-1 barrier replace air
execute as @e[type=xp:end_cube_boss_activator,family=!"interaction"] at @s run fill ~1~~1~1~-1~-1 xp:ender_bricks
execute as @e[type=xp:eye_of_guardian] at @s run fill ~1~5~1~-1~-1~-1 air replace xp:eye_of_ender_block
execute as @e[type=xp:respawn_auger] at @s run fill ~~~~~1~ barrier replace air

execute as @e[type=xp:end_cube_barrier,c=1] at @s run event entity @e[type=xp:rippling,r=256] xp:instant_despawn
execute as @e[type=xp:end_cube_barrier,c=1] at @s run event entity @e[type=xp:endergob,r=256] xp:instant_despawn
execute as @e[type=xp:end_cube_barrier,c=1] at @s run event entity @e[type=xp:enderslug,r=256] xp:instant_despawn
execute as @e[type=xp:end_cube_barrier,c=1] at @s run event entity @e[type=xp:warder,r=256] xp:instant_despawn
execute as @e[type=xp:end_cube_barrier,c=1] at @s run kill @e[type=item,r=256]
execute as @e[type=xp:end_cube_barrier,c=1] at @s run kill @e[type=xp_orb,r=256]