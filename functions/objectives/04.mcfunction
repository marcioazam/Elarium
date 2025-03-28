execute unless score "#obj_04" gvar matches 1 run tellraw @s {"rawtext":[{"text":"_xp:objective.header.04.description.04.blocks/dragons_head_isometric"}]}
execute unless score "#obj_04" gvar matches 1 run playsound xp.ui.menu.start_game @s

execute unless score "#obj_04" gvar matches 1 run function waypoint/2

scoreboard players set "#obj_04" gvar 1