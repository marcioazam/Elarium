execute if entity @s[tag=!"ach_111"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.01","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.111.title"}]}}]}
tellraw @s[tag=!"ach_111"] {"rawtext":[{"text":"_xp:achievement.111.header.01.bg1.items/saddle"}]}
playsound achievement @s[tag=!"ach_111"]
tag @s add ach_111