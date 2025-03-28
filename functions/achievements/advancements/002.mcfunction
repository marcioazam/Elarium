# objectives handler
function objectives/02

execute if entity @s[tag=!"ach_002"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.00","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.002.title"}]}}]}
tellraw @s[tag=!"ach_002"] {"rawtext":[{"text":"_xp:achievement.002.header.00.bg2.blocks/echoing_log_isometric"}]}
playsound achievement @s[tag=!"ach_002"]
tag @s add ach_002