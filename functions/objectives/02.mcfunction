
# Re-summon Ender Dragon if not already
execute unless entity @e[type=ender_dragon,x=0,y=100,z=0,r=256] positioned 0 100 0 run tp @e[type=ender_dragon] 0 100 0
execute unless entity @e[type=ender_dragon,x=0,y=100,z=0,r=256] positioned 0 100 0 run summon ender_dragon 0 100 0

# Objectives handler
execute unless score "#obj_02" gvar matches 1 run tellraw @s {"rawtext":[{"text":"_xp:objective.header.02.description.02.items/enderite_ingot"}]}
execute unless score "#obj_02" gvar matches 1 run playsound xp.ui.menu.start_game @s

scoreboard players set "#obj_02" gvar 1
