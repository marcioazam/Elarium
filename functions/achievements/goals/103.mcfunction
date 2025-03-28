execute if entity @s[tag=!"ach_103"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.01","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.103.title"}]}}]}
tellraw @s[tag=!"ach_103"] {"rawtext":[{"text":"_xp:achievement.103.header.01.bg1.emojis/ender boss arena"}]}
playsound achievement @s[tag=!"ach_103"]
tag @s add ach_103