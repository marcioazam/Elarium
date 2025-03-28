# select score and ensure to pick one that has not been picked before
scoreboard players add @s gvar 0
scoreboard players random @s[scores={gvar=0}] gvar 1 4
scoreboard players random @s[scores={gvar=1}] gvar 2 4
scoreboard players random @s[scores={gvar=2}] gvar 0 1
scoreboard players random @s[scores={gvar=3}] gvar 0 2
scoreboard players random @s[scores={gvar=4}] gvar 0 3
scoreboard players random @s[scores={gvar=5}] gvar 0 4

# teleport
execute if score @s gvar matches 0 run tp -33 193 -651
execute if score @s gvar matches 1 run tp -30 191 -567
execute if score @s gvar matches 2 run tp -85 191 -563
execute if score @s gvar matches 3 run tp -222 134 -492
execute if score @s gvar matches 4 run tp -254 102 -667
execute if score @s gvar matches 5 run tp -169 100 -836

# initialize scoreboard objective value for later use
scoreboard players operation @s quickTravel = @s gvar
scoreboard players reset @s gvar

# initialize tags
tag @s remove in_ender_wilds
tag @s remove in_echoing_forest
tag @s remove in_ender_abyss_inner
tag @s remove in_ender_abyss
tag @s remove in_broken_sanctuary