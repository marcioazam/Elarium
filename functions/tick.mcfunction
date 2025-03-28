scoreboard players add active sanctuary 0
scoreboard players add portal_activated sanctuary 0
scoreboard players add entered sanctuary 0
execute if score active sanctuary matches 1 in the_end run function broken_sanctuary/loop
execute in the_end positioned 416 157 871 if entity @p[r=400] run function broken_sanctuary/show_visuals
execute in the_end positioned -166 182 2060 run function endboss/loop
execute in the_end positioned -148 58 15 run tp @e[type=ender_dragon,r=50] 50 100 0

scoreboard players add end_cube_lightrays math 1
execute if score end_cube_lightrays math matches 1 in the_end positioned 315 149 -537 if entity @p[r=200] run function biome/ender_abyss/end_cube_lightrays
execute if score end_cube_lightrays math matches 200.. run scoreboard players set end_cube_lightrays math 0