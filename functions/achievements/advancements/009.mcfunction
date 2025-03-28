execute if entity @s[tag=!"ach_009"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.00","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.009.title"}]}}]}
tellraw @s[tag=!"ach_009"] {"rawtext":[{"text":"_xp:achievement.009.header.00.bg2.blocks/beacon_isometric"}]}
playsound achievement @s[tag=!"ach_009"]
tag @s add ach_009