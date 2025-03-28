execute if entity @s[tag=!"ach_004"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.00","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.004.title"}]}}]}
tellraw @s[tag=!"ach_004"] {"rawtext":[{"text":"_xp:achievement.004.header.00.bg2.items/gold_chestplate"}]}
playsound achievement @s[tag=!"ach_004"]
tag @s add ach_004