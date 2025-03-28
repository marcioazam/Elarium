# execute at @e[type=xp:respawn_auger,family=auger_active] run playsound beacon.deactivate @a ~~~ 1 0.4
# event entity @e[type=xp:respawn_auger] xp:inactive

playsound beacon.deactivate @a ~~~ 1 0.4
event entity @s xp:inactive