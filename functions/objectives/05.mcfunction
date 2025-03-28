execute unless score "#obj_05" gvar matches 1 run tellraw @s {"rawtext":[{"text":"_xp:objective.header.05.description.05.emojis/heart of ender"}]}
execute unless score "#obj_05" gvar matches 1 run playsound xp.ui.menu.start_game @s

execute unless score "#obj_05" gvar matches 1 run function end_cube/setup

scoreboard players set "#obj_05" gvar 1