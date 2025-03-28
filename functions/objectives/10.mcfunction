execute unless score "#obj_10" gvar matches 1 run tellraw @s {"rawtext":[{"text":"_xp:objective.header.10.description.10.items/heart_of_enders_head"}]}
execute unless score "#obj_10" gvar matches 1 run playsound xp.ui.menu.start_game @s

scoreboard players set "#obj_10" gvar 1