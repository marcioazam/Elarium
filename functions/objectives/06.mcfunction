execute unless score "#obj_06" gvar matches 1 run tellraw @s {"rawtext":[{"text":"_xp:objective.header.06.description.06.emojis/discover end"}]}
execute unless score "#obj_06" gvar matches 1 run playsound xp.ui.menu.start_game @s

scoreboard players set "#obj_06" gvar 1