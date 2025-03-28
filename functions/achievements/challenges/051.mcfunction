execute if entity @s[tag=!"ach_051"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.02","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.051.title"}]}}]}
tellraw @s[tag=!"ach_051"] {"rawtext":[{"text":"_xp:achievement.051.header.02.bg0.emojis/death2"}]}
playsound achievement_grand @s[tag=!"ach_051"]
tag @s add ach_051