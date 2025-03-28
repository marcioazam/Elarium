execute if entity @s[tag=!"ach_117"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.01","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.117.title"}]}}]}
tellraw @s[tag=!"ach_117"] {"rawtext":[{"text":"_xp:achievement.117.header.01.bg1.entity/endlootchest/endlootchest_preview"}]}
playsound achievement @s[tag=!"ach_117"]
tag @s add ach_117