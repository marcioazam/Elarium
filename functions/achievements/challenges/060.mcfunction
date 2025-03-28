execute if entity @s[tag=!"ach_060"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.02","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.060.title"}]}}]}
tellraw @s[tag=!"ach_060"] {"rawtext":[{"text":"_xp:achievement.060.header.02.bg0.emojis/newinfo2"}]}
playsound achievement_grand @s[tag=!"ach_060"]
tag @s add ach_060