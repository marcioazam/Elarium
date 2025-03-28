execute if entity @s[tag=!"ach_059"] run tellraw @a {"rawtext":[{"translate":"xp.achievement.announce.02","with":{"rawtext":[{"selector":"@s"},{"translate":"xp.achievement.059.title"}]}}]}
tellraw @s[tag=!"ach_059"] {"rawtext":[{"text":"_xp:achievement.059.header.02.bg0.emojis/newinfo1"}]}
playsound achievement_grand @s[tag=!"ach_059"]
tag @s add ach_059