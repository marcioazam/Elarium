execute if entity @s[tag=!"ach_102"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.01","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.102.title"}]}}]}
tellraw @s[tag=!"ach_102"] {"rawtext":[{"text":"_xp:achievement.102.header.01.bg1.emojis/abyss"}]}
playsound achievement @s[tag=!"ach_102"]
tag @s add ach_102