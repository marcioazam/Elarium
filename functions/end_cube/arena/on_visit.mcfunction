
# i'm giving up on the cutscene, its just too laggy - when will Mojang add client-side camera adjustments?
# execute as @e[type=xp:end_cube_barrier,c=1] run summon xp:end_cube_marker ~~~ xp:marker_type.cinematics_handler.1

# objectives handler
execute unless score "#obj_05" gvar matches 1 at @s as @a[r=128] run function objectives/05 

scoreboard players set "sanctuary_intro" end_cube_boss 1
scoreboard players set "#obj_05" gvar 1