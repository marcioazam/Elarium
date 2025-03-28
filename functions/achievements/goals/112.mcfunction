execute if entity @s[tag=!"ach_112"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.01","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.112.title"}]}}]}
tellraw @s[tag=!"ach_112"] {"rawtext":[{"text":"_xp:achievement.112.header.01.bg1.items/enderite_ingot"}]}
playsound achievement @s[tag=!"ach_112"]
tag @s add ach_112