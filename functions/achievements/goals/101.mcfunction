execute if entity @s[tag=!"ach_101"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.01","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.101.title"}]}}]}
tellraw @s[tag=!"ach_101"] {"rawtext":[{"text":"_xp:achievement.101.header.01.bg1.emojis/echoing_forest"}]}
playsound achievement @s[tag=!"ach_101"]
tag @s add ach_101