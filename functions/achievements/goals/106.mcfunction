execute if entity @s[tag=!"ach_106"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.01","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.106.title"}]}}]}
tellraw @s[tag=!"ach_106"] {"rawtext":[{"text":"_xp:achievement.106.header.01.bg1.blocks/dragon_egg_isometric"}]}
playsound achievement @s[tag=!"ach_106"]
tag @s add ach_106