# Set end_portal_frame blocks with known rotations 
setblock ~1 ~ ~  end_portal_frame 
setblock ~-1 ~ ~ end_portal_frame 
setblock ~ ~ ~1  end_portal_frame 
setblock ~ ~ ~-1 end_portal_frame 

event entity @e[type=xp:sanctuary_tower_activator,r=3] xp:instant_despawn
event entity @e[type=xp:sanctuary_activator,r=4] xp:instant_despawn
summon xp:sanctuary_tower_activator

summon xp:sanctuary_activator ~1 ~.805 ~ 
summon xp:sanctuary_activator ~-1 ~.805 ~
summon xp:sanctuary_activator ~ ~.805 ~1 
summon xp:sanctuary_activator ~ ~.805 ~-1

scoreboard players set towers_activated sanctuary 0