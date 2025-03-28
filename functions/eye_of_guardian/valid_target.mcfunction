# update tracking state
event entity @s xp:track_player
tag @s add track_player

# reset valid target status
scoreboard players set "#eye_of_guardian_target" var 0