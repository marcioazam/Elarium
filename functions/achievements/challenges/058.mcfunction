execute if entity @s[tag=!"ach_058"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.02","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.058.title"}]}}]}
tellraw @s[tag=!"ach_058"] {"rawtext":[{"text":"_xp:achievement.058.header.02.bg0.emojis/death1"}]}
playsound achievement_grand @s[tag=!"ach_058"]
tag @s add ach_058