execute unless score "#obj_00" gvar matches 1 run tellraw @s {"rawtext":[{"text":"_xp:objective.header.00.description.00.emojis/farlander"}]}
execute unless score "#obj_00" gvar matches 1 run playsound xp.ui.menu.start_game @s

scoreboard players set "#obj_00" gvar 1