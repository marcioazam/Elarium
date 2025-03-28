execute unless score "#obj_07" gvar matches 1 run tellraw @s {"rawtext":[{"text":"_xp:objective.header.07.description.07.ui/xp/waypoint/icon_static"}]}
execute unless score "#obj_07" gvar matches 1 run playsound xp.ui.menu.start_game @s

execute unless score "#obj_07" gvar matches 1 run function waypoint/3

scoreboard players set "#obj_07" gvar 1