execute if entity @s[tag=!"ach_055"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.02","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.055.title"}]}}]}
tellraw @s[tag=!"ach_055"] {"rawtext":[{"text":"_xp:achievement.055.header.02.bg0.items/chainmail_boots"}]}
playsound achievement_grand @s[tag=!"ach_055"]
tag @s add ach_055