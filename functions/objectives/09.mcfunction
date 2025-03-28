execute unless score "#obj_09" gvar matches 1 run tellraw @s {"rawtext":[{"text":"_xp:objective.header.09.description.09.ui/xp/waypoint/icon_static"}]}
execute unless score "#obj_09" gvar matches 1 run playsound xp.ui.menu.start_game @s

scoreboard players set "#obj_09" gvar 1