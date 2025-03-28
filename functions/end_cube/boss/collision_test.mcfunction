execute as @a[tag="in_ender_boss_arena"] at @s run event entity @e[type=xp:end_cube,c=1,r=2.5] xp:boss_remove_ram

execute at @s positioned 300 223 -549 run event entity @e[type=xp:end_cube,c=1,dx=24,dy=4,dz=2] xp:boss_state_is_dazed
execute at @s positioned 324 223 -549 run event entity @e[type=xp:end_cube,c=1,dx=-2,dy=4,dz=24] xp:boss_state_is_dazed
execute at @s positioned 324 223 -525 run event entity @e[type=xp:end_cube,c=1,dx=-24,dy=4,dz=-2] xp:boss_state_is_dazed
execute at @s positioned 300 223 -525 run event entity @e[type=xp:end_cube,c=1,dx=2,dy=4,dz=-24] xp:boss_state_is_dazed