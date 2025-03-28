execute if entity @s[tag=!"ach_108"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.01","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.108.title"}]}}]}
tellraw @s[tag=!"ach_108"] {"rawtext":[{"text":"_xp:achievement.108.header.01.bg1.items/dragons_breath"}]}
playsound achievement @s[tag=!"ach_108"]
tag @s add ach_108