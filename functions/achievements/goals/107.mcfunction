execute if entity @s[tag=!"ach_107"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.01","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.107.title"}]}}]}
tellraw @s[tag=!"ach_107"] {"rawtext":[{"text":"_xp:achievement.107.header.01.bg1.items/elytra"}]}
playsound achievement @s[tag=!"ach_107"]
tag @s add ach_107