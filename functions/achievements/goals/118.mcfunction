execute if entity @s[tag=!"ach_118"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.01","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.118.title"}]}}]}
tellraw @s[tag=!"ach_118"] {"rawtext":[{"text":"_xp:achievement.118.header.01.bg1.blocks/purple_slime_isometric"}]}
playsound achievement @s[tag=!"ach_118"]
tag @s add ach_118