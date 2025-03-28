scoreboard players set players_were_in_interior math 0
execute if score players_in_interior math matches 1.. run scoreboard players set players_were_in_interior math 1
scoreboard players set players_in_interior math 0
execute in the_end if entity @s[x=302,y=140,z=-547,dx=20,dy=80,dz=20] run scoreboard players set players_in_interior math 1

execute if score players_in_interior math matches 1.. if score players_were_in_interior math matches 0 run music queue entity.end_cube.music_bgm.loop 1 1 loop
execute if score players_in_interior math matches 0 if score players_were_in_interior math matches 1.. run music stop 1
