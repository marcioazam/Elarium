event entity @e[family=end_cube,family=!treasure,type=!xp:end_cube_barrier] xp:instant_despawn
event entity @e[type=!player,family=mob,family=!end_cube,x=300,y=222,z=-549,dx=24,dy=125,dz=24] xp:instant_despawn

loot spawn 315.5 223.0 -536.5 loot "entity/end_cube/head.loot"

execute rotated 0 0 run summon xp:end_cube_boss_activator 312 222 -529 
execute rotated 0 0 run summon xp:end_cube_boss_activator 304 222 -537 
execute rotated 0 0 run summon xp:end_cube_boss_activator 312 222 -545 

execute align xyz run particle xp:end_cube55 ~~~

execute as @e[type=xp:end_cube_boss_activator,family=!"interaction"] at @s run fill ~1~4~1~-1~1~-1 barrier replace air
execute as @e[type=xp:end_cube_boss_activator,family=!"interaction"] at @s run fill ~1~~1~-1~~-1 xp:ender_bricks

event entity @a[r=128] xp:achievements.007