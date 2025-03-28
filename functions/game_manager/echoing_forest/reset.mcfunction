
## Reset Entities
event entity @e[type=xp:end_city.echoing] xp:despawn
event entity @e[type=xp:end_city.echoing_2] xp:despawn
event entity @e[type=xp:end_city.echoing_3] xp:despawn
event entity @e[type=xp:end_city.echoing_4] xp:despawn
execute in the_end run summon xp:end_city.echoing 185 45 400
execute in the_end run summon xp:end_city.echoing_2 -55 45 260
execute in the_end run summon xp:end_city.echoing_3 -204 39 136
execute in the_end run summon xp:end_city.echoing_4 25 30 385

event entity @e[type=xp:end_boat.echoing] xp:despawn
event entity @e[type=xp:end_boat.echoing_2] xp:despawn
event entity @e[type=xp:end_boat.echoing_3] xp:despawn
execute in the_end run summon xp:end_boat.echoing 257 35 251
execute in the_end run summon xp:end_boat.echoing_2 -148 30 547
execute in the_end run summon xp:end_boat.echoing_3 -311 40 183


