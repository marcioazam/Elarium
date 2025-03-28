# summon rider (pulls player)
summon xp:eye_of_guardian.rider ~ ~ ~
execute as @e[type=xp:eye_of_guardian.rider,tag=!post_spawn,r=5] at @s run function eye_of_guardian/rider_init

# 
tag @s add riding

# set knockback state
event entity @s xp:property.knockback.set.back