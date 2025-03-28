event entity @e[family=end_cube,type=!xp:end_cube_barrier] xp:instant_despawn
event entity @e[type=!player,family=mob,family=!end_cube,x=300,y=222,z=-549,dx=24,dy=125,dz=24] xp:instant_despawn

execute rotated -90 0 run summon xp:end_cube 312 223 -537
execute rotated 0 0 run summon xp:end_cube_boss_activator 312 223 -529 
execute rotated 0 0 run summon xp:end_cube_boss_activator 304 223 -537 
execute rotated 0 0 run summon xp:end_cube_boss_activator 312 223 -545 

execute as @e[type=xp:end_cube] at @s run fill 313 223 -536 311 225 -538 barrier 
execute as @e[type=xp:end_cube] at @s run tag @e[type=xp:end_cube_boss_activator,c=3] add "ender_boss"
execute as @e[type=xp:end_cube_boss_activator,family=!"interaction"] at @s run fill ~1~4~1~-1~1~-1 barrier replace air
execute as @e[type=xp:end_cube_boss_activator,family=!"interaction"] at @s run fill ~1~~1~-1~~-1 xp:ender_bricks

execute as @e[type=xp:end_cube_barrier,c=1] at @s run event entity @e[type=xp:rippling,r=256] xp:instant_despawn
execute as @e[type=xp:end_cube_barrier,c=1] at @s run event entity @e[type=xp:endergob,r=256] xp:instant_despawn
execute as @e[type=xp:end_cube_barrier,c=1] at @s run event entity @e[type=xp:enderslug,r=256] xp:instant_despawn
execute as @e[type=xp:end_cube_barrier,c=1] at @s run event entity @e[type=xp:warder,r=256] xp:instant_despawn
execute as @e[type=xp:end_cube_barrier,c=1] at @s run kill @e[type=item,r=256]
execute as @e[type=xp:end_cube_barrier,c=1] at @s run kill @e[type=xp_orb,r=256]

tag @s remove shown_tip_2
tag @s remove shown_tip_3
tag @s remove shown_tip_8
tag @s remove shown_tip_9
tag @s remove shown_tip_11
tag @s remove shown_tip_12
tag @s remove shown_tip_14
tag @s remove shown_tip_16