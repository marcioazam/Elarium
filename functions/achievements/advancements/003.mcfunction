execute if entity @s[tag=!"ach_003"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.00","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.003.title"}]}}]}
tellraw @s[tag=!"ach_003"] {"rawtext":[{"text":"_xp:achievement.003.header.00.bg2.items/enderite_ingot"}]}
playsound achievement @s[tag=!"ach_003"]
tag @s add ach_003