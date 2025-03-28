# select score and ensure to pick one that has not been picked before
scoreboard players add @s gvar 0
scoreboard players random @s[scores={gvar=0}] gvar 1 4
scoreboard players random @s[scores={gvar=1}] gvar 2 4
scoreboard players random @s[scores={gvar=2}] gvar 0 1
scoreboard players random @s[scores={gvar=3}] gvar 0 2
scoreboard players random @s[scores={gvar=4}] gvar 0 3

# teleport
execute if score @s gvar matches 0 run tp 71 82 259
execute if score @s gvar matches 1 run tp -15 64 260
execute if score @s gvar matches 2 run tp -250 89 264
execute if score @s gvar matches 3 run tp -154 52 418
execute if score @s gvar matches 4 run tp -15 52 505

# initialize scoreboard objective value for later use
scoreboard players operation @s quickTravel = @s gvar
scoreboard players reset @s gvar

# initialize tags
tag @s remove in_ender_wilds
tag @s remove in_ender_abyss_inner
tag @s remove in_ender_abyss
tag @s remove in_ender_riftlands
tag @s remove in_broken_sanctuary