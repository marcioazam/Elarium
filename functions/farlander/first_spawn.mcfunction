# ensure UI is setup correctly
function ui/setup
function objectives/reset

# remove existing farlanders
execute in the_end positioned -141 58 17 run event entity @e[family="farlander",r=32] xp:instant_despawn

# spawn farlander entity
execute in the_end positioned -141 58 17 run summon xp:farlander_spawn "" ~~1~
execute in the_end as @e[type=xp:farlander_spawn,c=1] at @s run tp @s ~~~ facing @p

# add spawn effects
execute in the_end as @e[type=xp:farlander_spawn,c=1] at @s run particle xp:respawn.2 ~~-1~
execute in the_end as @e[type=xp:farlander_spawn,c=1] at @s run particle xp:respawn.3 ~~-0.5~
execute in the_end as @e[type=xp:farlander_spawn,c=1] at @s run particle xp:respawn.3 ~~1~
execute in the_end as @e[type=xp:farlander_spawn,c=1] at @s run playanimation @e[type=xp:farlander_spawn,c=1] teleport_in
execute in the_end as @e[type=xp:farlander_spawn,c=1] at @s run playsound horn.call.0 @a -141 58 17 1.0 1.5
execute in the_end as @e[type=xp:farlander_spawn,c=1] at @s run playsound mob.endermen.portal @a -141 58 17

# set objective
execute in the_end as @a run function objectives/00