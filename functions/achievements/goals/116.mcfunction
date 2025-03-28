execute if entity @s[tag=!"ach_116"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.01","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.116.title"}]}}]}
tellraw @s[tag=!"ach_116"] {"rawtext":[{"text":"_xp:achievement.116.header.01.bg1.emojis/heart"}]}
playsound achievement @s[tag=!"ach_116"]
tag @s add ach_116