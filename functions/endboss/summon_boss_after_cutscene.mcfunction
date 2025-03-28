music play heart_of_ender_boss_music 1 2 loop

# barriers
fill -161 181 2058 -171 181 2062 barrier
fill -162 181 2057 -170 181 2063 barrier
fill -163 181 2056 -169 181 2064 barrier
fill -164 181 2055 -168 181 2065 barrier

event entity @e[type=xp:heart_of_ender_boss] xp:instant_despawn
summon xp:heart_of_ender_boss -166 182.25 2060.5 


event entity @e[type=xp:heart_of_ender_beam] xp:instant_despawn


execute in the_end run summon xp:heart_of_ender_beam -160 183 2039
execute in the_end run summon xp:heart_of_ender_beam -172 183 2039
execute in the_end run summon xp:heart_of_ender_beam -160 183 2081
execute in the_end run summon xp:heart_of_ender_beam -172 183 2081
execute in the_end run summon xp:heart_of_ender_beam -187 183 2066
execute in the_end run summon xp:heart_of_ender_beam -187 183 2054
execute in the_end run summon xp:heart_of_ender_beam -145 183 2066
execute in the_end run summon xp:heart_of_ender_beam -145 183 2054


scoreboard players set can_beam_attack endboss 0
scoreboard players set can_spawn_enderslugs endboss 0
scoreboard players set awaiting_last_hit endboss 0
scoreboard players set ongoing_battle endboss 1
scoreboard players set direction endboss 0

event entity @e[type=xp:endboss_hitbox] xp:instant_despawn
summon xp:endboss_hitbox -166 182.25 2060.5 
summon xp:endboss_hitbox -166 182.25 2060.5 
summon xp:endboss_hitbox -166 182.25 2060.5 
summon xp:endboss_hitbox -166 182.25 2060.5 
summon xp:endboss_hitbox -166 182.25 2060.5 
summon xp:endboss_hitbox -166 182.25 2060.5 

summon xp:endboss_hitbox -166 182.25 2060.5 
summon xp:endboss_hitbox -166 182.25 2060.5 
summon xp:endboss_hitbox -166 182.25 2060.5 
summon xp:endboss_hitbox -166 182.25 2060.5 
summon xp:endboss_hitbox -166 182.25 2060.5 
summon xp:endboss_hitbox -166 182.25 2060.5 

summon xp:endboss_hitbox -166 182.25 2060.5 
summon xp:endboss_hitbox -166 182.25 2060.5 
summon xp:endboss_hitbox -166 182.25 2060.5 

summon xp:endboss_hitbox -166 182.25 2060.5 
summon xp:endboss_hitbox -166 182.25 2060.5 