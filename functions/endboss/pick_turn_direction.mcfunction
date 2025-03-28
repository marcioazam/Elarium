scoreboard players set players_right endboss 0
scoreboard players set players_left endboss 0
scoreboard players set players_behind endboss 0

execute if score direction endboss matches 0 rotated 0 0 run function endboss/pick_turn/count_players
execute if score direction endboss matches 1 rotated 45 0 run function endboss/pick_turn/count_players
execute if score direction endboss matches 2 rotated 90 0 run function endboss/pick_turn/count_players
execute if score direction endboss matches 3 rotated 135 0 run function endboss/pick_turn/count_players
execute if score direction endboss matches 4 rotated 180 0 run function endboss/pick_turn/count_players
execute if score direction endboss matches 5 rotated 225 0 run function endboss/pick_turn/count_players
execute if score direction endboss matches 6 rotated 270 0 run function endboss/pick_turn/count_players
execute if score direction endboss matches 7 rotated 315 0 run function endboss/pick_turn/count_players

execute if score players_right endboss matches 0 if score players_left endboss matches 0 if score players_behind endboss matches 0 run event entity @s xp:turn_none
execute if score players_right endboss matches 0 if score players_left endboss matches 0 if score players_behind endboss matches 1 run event entity @s xp:turn_right
execute if score players_right endboss matches 1.. run event entity @s xp:turn_right
execute if score players_right endboss matches 0 if score players_left endboss matches 1.. run event entity @s xp:turn_left