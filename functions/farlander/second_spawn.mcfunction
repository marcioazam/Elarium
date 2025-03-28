# spawn in area
structure load farlanders_spot -128 56 39
setblock -128 57 39 air

# remove existing farlanders
execute in the_end positioned -124 57 43 run event entity @e[family="farlander",r=16] xp:instant_despawn
execute in the_end positioned -148 58 17 run event entity @e[family="farlander",r=8] xp:instant_despawn

# spawn farlander entity
execute in the_end positioned -141 58 17 run summon xp:farlander ~~1~

# add spawn effects
execute in the_end as @e[type=xp:farlander,c=1] at @s run particle xp:respawn.2 ~~-1~
execute in the_end as @e[type=xp:farlander,c=1] at @s run particle xp:respawn.3 ~~-0.5~
execute in the_end as @e[type=xp:farlander,c=1] at @s run particle xp:respawn.3 ~~1~
execute in the_end as @e[type=xp:farlander,c=1] at @s run playanimation @e[type=xp:farlander,c=1] teleport_in
execute in the_end as @e[type=xp:farlander,c=1] at @s run playsound horn.call.0 @a -124 57 43 1.0 1.5
execute in the_end as @e[type=xp:farlander,c=1] at @s run playsound mob.endermen.portal @a -124 57 43