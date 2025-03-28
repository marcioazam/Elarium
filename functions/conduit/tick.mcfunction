execute at @s if block ~ ~ ~ minecraft:grass_block run spreadplayers ~~ 1 15 @s
execute at @s if block ~ ~ ~ water run spreadplayers ~~ 1 15 @s
scoreboard players remove @s[scores={conduit_cooldown=1..}] conduit_cooldown 1
event entity @s[scores={conduit_cooldown=1}] xp:usable
# execute as @s[tag=stationed] at @s run function align_rotation