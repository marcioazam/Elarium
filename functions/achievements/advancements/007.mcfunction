execute if entity @s[tag=!"ach_007"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.00","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.007.title"}]}}]}
tellraw @s[tag=!"ach_007"] {"rawtext":[{"text":"_xp:achievement.007.header.00.bg2.emojis/heart of ender"}]}
playsound achievement @s[tag=!"ach_007"]
tag @s add ach_007