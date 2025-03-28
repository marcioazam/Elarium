execute at @s if block ~ ~-0.2 ~ xp:echoing_grass run spreadplayers ~~ 1 15 @s
execute at @s if block ~ ~-0.2 ~ xp:echoing_grass_full run spreadplayers ~~ 1 15 @s
execute at @s if block ~ ~-0.2 ~ xp:wilds_grass run spreadplayers ~~ 1 15 @s
execute at @s if block ~ ~-0.2 ~ xp:wilds_sediment_grass run spreadplayers ~~ 1 15 @s

execute at @s if block ~ ~-0.2 ~ water run spreadplayers ~~ 1 15 @s

execute as @s[family=inanimate] at @s run function align_rotation

scoreboard players remove @s[scores={mimic_timer=1..}] mimic_timer 1
event entity @s[scores={mimic_timer=1}] xp:deactivate
tp @s[scores={mimic_timer=1}] ~~~

# execute at @s positioned ~ ~2.5 ~ run fill ~-3~-4~-3 ~3~4~3 air 0 replace barrier
# execute as @s[family=inanimate] at @s positioned ~ ~1 ~ run fill ^-1^-1^ ^1^1^ barrier 0 replace air
# execute as @s[family=inanimate] at @s positioned ~ ~3 ~ run fill ~~~ ~~1~ barrier 0 replace air

tag @s remove playerNear
tag @s add self
tag @s remove catNear
execute if entity @e[r=12,type=minecraft:cat] run tag @s add catNear
event entity @s[tag=catNear] xp:shake
event entity @s[tag=!catNear] xp:unshake

execute as @a[r=15,m=!c] at @s run tag @e[tag=self] add playerNear
execute as @s[tag=!playerNear,family=!inanimate] at @s run execute as @p[tag=!idle,r=30,m=!c] at @s run spreadplayers ~~ 1 8 @e[tag=self]
tag @s remove self