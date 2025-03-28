execute if entity @s[tag=!"ach_114"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.01","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.114.title"}]}}]}
tellraw @s[tag=!"ach_114"] {"rawtext":[{"text":"_xp:achievement.114.header.01.bg1.items/conduits_heart"}]}
playsound achievement @s[tag=!"ach_114"]
tag @s add ach_114