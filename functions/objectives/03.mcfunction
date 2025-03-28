execute unless score "#obj_03" gvar matches 1 run tellraw @s {"rawtext":[{"text":"_xp:objective.header.03.description.03.items/end_crystal"}]}
execute unless score "#obj_03" gvar matches 1 run playsound xp.ui.menu.start_game @s

execute unless score "#obj_03" gvar matches 1 run function waypoint/1

execute unless score "#obj_03" gvar matches 1 run scoreboard players set "#obj_03" gvar 1