execute if entity @s[tag=!"ach_113"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.01","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.113.title"}]}}]}
tellraw @s[tag=!"ach_113"] {"rawtext":[{"text":"_xp:achievement.113.header.01.bg1.blocks/enderite_crystalized_isometric"}]}
playsound achievement @s[tag=!"ach_113"]
tag @s add ach_113