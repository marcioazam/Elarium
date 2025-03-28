execute if entity @s[tag=!"ach_010"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.00","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.010.title"}]}}]}
tellraw @s[tag=!"ach_010"] {"rawtext":[{"text":"_xp:achievement.010.header.00.bg2.emojis/ender boss"}]}
playsound achievement @s[tag=!"ach_010"]
tag @s add ach_010