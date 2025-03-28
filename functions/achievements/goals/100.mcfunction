# objectives handler
execute unless score "#obj_07" gvar matches 1 run function objectives/07

execute if entity @s[tag=!"ach_100"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.01","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.100.title"}]}}]}
tellraw @s[tag=!"ach_100"] {"rawtext":[{"text":"_xp:achievement.100.header.01.bg1.emojis/broken sanctuary"}]}
playsound achievement @s[tag=!"ach_100"]
tag @s add ach_100