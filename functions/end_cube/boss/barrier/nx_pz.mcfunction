execute in the_end if entity @e[x=326,y=223,z=-551,dx=-27,dy=14,dz=1] run event entity @e[type=xp:end_cube_barrier,c=1] xp:damaged_barrier

execute as @a[tag="in_ender_boss_arena",x=326,y=223,z=-551,dx=-27,dy=14,dz=1] at @s run title @s actionbar xp_hud.barrier_vignette
execute as @a[tag="in_ender_boss_arena",x=326,y=223,z=-551,dx=-27,dy=14,dz=1] at @s run playsound mob.endermen.portal @s ~~~ 1.0 0.75
execute as @a[tag="in_ender_boss_arena",x=326,y=223,z=-551,dx=-27,dy=14,dz=1] at @s run tp @s ~~~1

execute as @e[family=projectile,x=326,y=223,z=-555,dx=-27,dy=14,dz=4] at @s run particle xp:end_cube_barrier.2a ~~~
execute as @e[family=projectile,x=326,y=223,z=-555,dx=-27,dy=14,dz=4] at @s run playsound respawn_anchor.charge @a ~~~ 1.0 0.6
execute at @s run kill @e[family=projectile,x=326,y=223,z=-555,dx=-27,dy=14,dz=4]

execute as @e[type=xp:tome_teleportation.projectile,x=326,y=223,z=-551,dx=-27,dy=14,dz=4] at @s run tp @s ~~~1