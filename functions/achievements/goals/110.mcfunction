execute if entity @s[tag=!"ach_110"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.01","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.110.title"}]}}]}
tellraw @s[tag=!"ach_110"] {"rawtext":[{"text":"_xp:achievement.110.header.01.bg1.emojis/discover end"}]}
playsound achievement @s[tag=!"ach_110"]
tag @s add ach_110