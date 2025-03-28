execute unless score "#obj_01" gvar matches 1 run tellraw @s {"rawtext":[{"text":"_xp:objective.header.01.description.01.items/iron_axe"}]}
execute unless score "#obj_01" gvar matches 1 run playsound xp.ui.menu.start_game @s

scoreboard players set "#obj_01" gvar 1