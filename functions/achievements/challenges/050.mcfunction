execute if entity @s[tag=!"ach_050"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.02","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.050.title"}]}}]}
tellraw @s[tag=!"ach_050"] {"rawtext":[{"text":"_xp:achievement.050.header.02.bg0.items/shulker_shell"}]}
playsound achievement_grand @s[tag=!"ach_050"]
tag @s add ach_050