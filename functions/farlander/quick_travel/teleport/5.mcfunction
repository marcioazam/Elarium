# select score and ensure to pick one that has not been picked before
scoreboard players add @s gvar 0
scoreboard players random @s[scores={gvar=0}] gvar 1 5
scoreboard players random @s[scores={gvar=1}] gvar 2 5
scoreboard players random @s[scores={gvar=2}] gvar 0 1
scoreboard players random @s[scores={gvar=3..}] gvar 0 2

# teleport
execute if score @s gvar matches 0 run tp 301 117 860
execute if score @s gvar matches 1 run tp 525 117 850
execute if score @s gvar matches 2 run tp 394 117 979
execute if score @s gvar matches 3.. run tp 447 123 867

# initialize scoreboard objective value for later use
scoreboard players operation @s quickTravel = @s gvar
scoreboard players reset @s gvar

# initialize tags
tag @s remove in_ender_wilds
tag @s remove in_echoing_forest
tag @s remove in_ender_abyss_inner
tag @s remove in_ender_abyss
tag @s remove in_ender_riftlands