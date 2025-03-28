execute if entity @s[tag=!"ach_109"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.01","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.109.title"}]}}]}
tellraw @s[tag=!"ach_109"] {"rawtext":[{"text":"_xp:achievement.109.header.01.bg1.items/enders_smite_opaque"}]}
playsound achievement @s[tag=!"ach_109"]
tag @s add ach_109