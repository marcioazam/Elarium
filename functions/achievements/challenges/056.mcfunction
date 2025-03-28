execute if entity @s[tag=!"ach_056"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.02","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.056.title"}]}}]}
tellraw @s[tag=!"ach_056"] {"rawtext":[{"text":"_xp:achievement.056.header.02.bg0.items/elytra"}]}
playsound achievement_grand @s[tag=!"ach_056"]
tag @s add ach_056