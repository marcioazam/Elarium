execute if entity @s[tag=!"ach_005"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.00","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.005.title"}]}}]}
tellraw @s[tag=!"ach_005"] {"rawtext":[{"text":"_xp:achievement.005.header.00.bg2.blocks/dragons_head_isometric"}]}
playsound achievement @s[tag=!"ach_005"]
tag @s add ach_005