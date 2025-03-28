execute in the_end if entity @e[x=298,y=230,z=-551,dx=27,dy=1,dz=27] run event entity @e[type=xp:end_cube_barrier,c=1] xp:damaged_barrier

execute as @a[tag="in_ender_boss_arena",x=298,y=230,z=-551,dx=27,dy=1,dz=27] at @s run title @s actionbar xp_hud.barrier_vignette
execute as @a[tag="in_ender_boss_arena",x=298,y=230,z=-551,dx=27,dy=1,dz=27] at @s run particle xp:end_cube_barrier.2b ~ 231 ~
execute as @a[tag="in_ender_boss_arena",x=298,y=230,z=-551,dx=27,dy=1,dz=27] at @s run playsound mob.endermen.portal @s ~~~ 1.0 0.75
execute as @a[tag="in_ender_boss_arena",x=298,y=230,z=-551,dx=27,dy=1,dz=27] at @s run tp @s ~~-1~

execute as @e[family=projectile,x=298,y=236,z=-551,dx=27,dy=10,dz=27] at @s run particle xp:end_cube_barrier.2a ~~~
execute as @e[family=projectile,x=298,y=236,z=-551,dx=27,dy=10,dz=27] at @s run playsound respawn_anchor.charge @a ~~~ 1.0 0.6
execute at @s run kill @e[family=projectile,x=298,y=236,z=-551,dx=27,dy=10,dz=27]

execute as @e[type=xp:tome_teleportation.projectile,x=298,y=230,z=-551,dx=27,dy=10,dz=27] at @s run tp @s ~~-1~