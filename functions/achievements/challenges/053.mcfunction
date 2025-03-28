execute if entity @s[tag=!"ach_053"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.02","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.053.title"}]}}]}
tellraw @s[tag=!"ach_053"] {"rawtext":[{"text":"_xp:achievement.053.header.02.bg0.items/enders_smite_opaque"}]}
playsound achievement_grand @s[tag=!"ach_053"]
tag @s add ach_053