execute at @s positioned ^^1^4 run execute if block ~-1 ~0 ~-1 air run execute if block ~-1 ~0 ~0 air run execute if block ~-1 ~0 ~1 air run execute if block ~0 ~0 ~-1 air run execute if block ~0 ~0 ~0 air run execute if block ~0 ~0 ~1 air run execute if block ~1 ~0 ~-1 air run execute if block ~1 ~0 ~0 air run execute if block ~1 ~0 ~1 air run execute if block ~-1 ~1 ~-1 air run execute if block ~-1 ~1 ~0 air run execute if block ~-1 ~1 ~1 air run execute if block ~0 ~1 ~-1 air run execute if block ~0 ~1 ~0 air run execute if block ~0 ~1 ~1 air run execute if block ~1 ~1 ~-1 air run execute if block ~1 ~1 ~0 air run execute if block ~1 ~1 ~1 air run tag @s add openArea

titleraw @s[tag=!openArea] actionbar {"rawtext":[{"translate":"xp.farlander.summon.cant_fit"}]}
playsound entity.farlander.trade @s[tag=!openArea]

execute as @s[tag=openArea] at @s run summon xp:farlander "" ^^1^4
execute as @s[tag=openArea] at @s run execute as @e[type=xp:farlander,c=1] at @s unless block ~~~ air run tp @s ~~2~
execute as @s[tag=openArea] at @s run execute as @e[type=xp:farlander,c=1] at @s run particle xp:respawn.2 ~~-1~
execute as @s[tag=openArea] at @s run execute as @e[type=xp:farlander,c=1] at @s run particle xp:respawn.3 ~~-0.5~
execute as @s[tag=openArea] at @s run execute as @e[type=xp:farlander,c=1] at @s run particle xp:respawn.3 ~~1~
execute as @s[tag=openArea] at @s run playanimation @e[type=xp:farlander,c=1] teleport_in
execute as @s[tag=openArea] at @s run playsound horn.call.0 @a ~~~ 1.0 1.5
execute as @s[tag=openArea] at @s run playsound mob.endermen.portal @a ~~~
titleraw @s[tag=openArea] actionbar {"rawtext":[{"translate":"xp.farlander.summon.success"}]}

tag @s remove openArea

# initialize players
tag @a remove dialogue_quest
scoreboard players set @a dialogueId 01300