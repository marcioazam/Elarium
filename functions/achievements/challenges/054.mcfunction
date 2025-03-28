execute if entity @s[tag=!"ach_054"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.02","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.054.title"}]}}]}
tellraw @s[tag=!"ach_054"] {"rawtext":[{"text":"_xp:achievement.054.header.02.bg0.items/heart_of_enders_blast_opaque"}]}
playsound achievement_grand @s[tag=!"ach_054"]
tag @s add ach_054