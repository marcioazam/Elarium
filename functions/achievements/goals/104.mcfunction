execute if entity @s[tag=!"ach_104"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.01","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.104.title"}]}}]}
tellraw @s[tag=!"ach_104"] {"rawtext":[{"text":"_xp:achievement.104.header.01.bg1.emojis/riftlands"}]}
playsound achievement @s[tag=!"ach_104"]
tag @s add ach_104