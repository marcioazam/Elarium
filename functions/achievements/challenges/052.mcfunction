execute if entity @s[tag=!"ach_052"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.02","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.052.title"}]}}]}
tellraw @s[tag=!"ach_052"] {"rawtext":[{"text":"_xp:achievement.052.header.02.bg0.items/enders_smite_opaque"}]}
playsound achievement_grand @s[tag=!"ach_052"]
tag @s add ach_052