execute if entity @s[tag=!"ach_115"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.01","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.115.title"}]}}]}
tellraw @s[tag=!"ach_115"] {"rawtext":[{"text":"_xp:achievement.115.header.01.bg1.entity/eye_guardian/eye_guardian_preview"}]}
playsound achievement @s[tag=!"ach_115"]
tag @s add ach_115