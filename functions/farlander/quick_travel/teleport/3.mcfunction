# select score and ensure to pick one that has not been picked before
scoreboard players add @s gvar 0
scoreboard players random @s[scores={gvar=0}] gvar 1 4
scoreboard players random @s[scores={gvar=1}] gvar 2 4
scoreboard players random @s[scores={gvar=2}] gvar 0 1
scoreboard players random @s[scores={gvar=3}] gvar 0 2
scoreboard players random @s[scores={gvar=4}] gvar 0 3

# teleport
execute if score @s gvar matches 0 run tp 225 54 -440
execute if score @s gvar matches 1 run tp 324 63 -385
execute if score @s gvar matches 2 run tp 415 52 -490
execute if score @s gvar matches 3 run tp 288 73 -682
execute if score @s gvar matches 4 run tp 198 49 -669

# initialize scoreboard objective value for later use
scoreboard players operation @s quickTravel = @s gvar
scoreboard players reset @s gvar

# initialize tags
tag @s remove in_ender_wilds
tag @s remove in_echoing_forest
tag @s remove in_ender_abyss_inner
tag @s remove in_ender_riftlands
tag @s remove in_broken_sanctuary