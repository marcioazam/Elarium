execute if entity @s[tag=!"ach_057"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.02","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.057.title"}]}}]}
tellraw @s[tag=!"ach_057"] {"rawtext":[{"text":"_xp:achievement.057.header.02.bg0.entity/wildchorus/wildchorus_preview"}]}
playsound achievement_grand @s[tag=!"ach_057"]
tag @s add ach_057