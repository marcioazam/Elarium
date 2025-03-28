execute if entity @s[tag=!"ach_006"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.00","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.006.title"}]}}]}
tellraw @s[tag=!"ach_006"] {"rawtext":[{"text":"_xp:achievement.006.header.00.bg2.items/end_crystal"}]}
playsound achievement @s[tag=!"ach_006"]
tag @s add ach_006