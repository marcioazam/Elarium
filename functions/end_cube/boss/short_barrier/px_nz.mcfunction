execute in the_end if entity @e[x=298,y=223,z=-523,dx=27,dy=14,dz=-1] run event entity @e[type=xp:end_cube_barrier,c=1] xp:damaged_barrier

execute as @e[family=projectile,x=298,y=223,z=-523,dx=27,dy=14,dz=-3] at @s run particle xp:end_cube_barrier.2a ~~~
execute as @e[family=projectile,x=298,y=223,z=-523,dx=27,dy=14,dz=-3] at @s run playsound respawn_anchor.charge @a ~~~ 1.0 0.6
execute at @s run kill @e[family=projectile,x=298,y=223,z=-523,dx=27,dy=14,dz=-3]

execute as @e[type=xp:tome_teleportation.projectile,x=298,y=223,z=-523,dx=27,dy=14,dz=-4] at @s run tp @s ~~~-1