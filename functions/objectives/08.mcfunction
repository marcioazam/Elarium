execute unless score "#obj_08" gvar matches 1 run tellraw @s {"rawtext":[{"text":"_xp:objective.header.08.description.08.emojis/ender boss"}]}
execute unless score "#obj_08" gvar matches 1 run playsound xp.ui.menu.start_game @s

scoreboard players set "#obj_08" gvar 1