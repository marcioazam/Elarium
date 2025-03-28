# objectives handler
execute unless score "#obj_00" gvar matches 1 run function farlander/first_spawn
execute in the_end positioned -141 58 17 if score "#obj_00" gvar matches 1 if score "#obj_01" gvar matches 1 run function farlander/second_spawn

function achievements/advancements/001

# trigger the main achievement
tellraw @s[tag=!"ach_105"] {"rawtext":[{"text":"_xp:achievement.105.header.01.bg1.emojis/wild"}]}
tag @s add ach_105