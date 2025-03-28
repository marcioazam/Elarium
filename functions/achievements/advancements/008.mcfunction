execute if entity @s[tag=!"ach_008"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.00","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.008.title"}]}}]}
tellraw @s[tag=!"ach_008"] {"rawtext":[{"text":"_xp:achievement.008.header.00.bg2.items/enders_rebirth"}]}
playsound achievement @s[tag=!"ach_008"]
tag @s add ach_008