execute in the_end run tp @a -165 181 2077

# arena
execute in the_end run structure load end_boss_arena_full -199 170 2025 0_degrees none layer_by_layer
execute in the_end run structure load boss_island.1 -211 167 2065 0_degrees none layer_by_layer
execute in the_end run structure load boss_island.2 -172 171 2009 0_degrees none layer_by_layer
execute in the_end run structure load boss_island.3 -137 176 2025 0_degrees none layer_by_layer
execute in the_end run structure load boss_island.4 -131 169 2065 0_degrees none layer_by_layer
execute in the_end run structure load boss_island.5 -133 231 2078 0_degrees none layer_by_layer
execute in the_end run structure load boss_island.6 -147 163 2088 0_degrees none layer_by_layer
execute in the_end run structure load boss_island.7 -183 178 2105 0_degrees none layer_by_layer
execute in the_end run structure load boss_island.8 -207 171 2081 0_degrees none layer_by_layer
execute in the_end run structure load boss_island.9 -217 216 2036 0_degrees none layer_by_layer

execute in the_end run setblock -160 182 2039 xp:gateway_block
execute in the_end run setblock -172 182 2039 xp:gateway_block
execute in the_end run setblock -160 182 2081 xp:gateway_block
execute in the_end run setblock -172 182 2081 xp:gateway_block
execute in the_end run setblock -187 182 2066 xp:gateway_block
execute in the_end run setblock -187 182 2054 xp:gateway_block
execute in the_end run setblock -145 182 2066 xp:gateway_block
execute in the_end run setblock -145 182 2054 xp:gateway_block

# # boss
event entity @e[type=xp:heart_of_ender_boss] xp:instant_despawn
event entity @e[type=xp:endboss_hitbox] xp:instant_despawn
event entity @e[family=endboss_unit] xp:instant_despawn

event entity @e[type=xp:heart_of_ender.eye] xp:despawn

# eyes – summon sem os parâmetros de escala
execute in the_end run summon xp:heart_of_ender.eye -192.02 189 2055.9 


execute in the_end run summon xp:heart_of_ender.eye -170.0 189.5 2087.0 


execute in the_end run summon xp:heart_of_ender.eye -197.0 194.85 2072.0


execute in the_end run summon xp:heart_of_ender.eye -161.0 189.5 2087.0 


execute in the_end run summon xp:heart_of_ender.eye -192.02 190 2064.9 


execute in the_end run summon xp:heart_of_ender.eye -170.05 189.5 2033.98 


execute in the_end run summon xp:heart_of_ender.eye -167.0 196.75 2027.0

execute in the_end run summon xp:heart_of_ender.eye -187.05 196.35 2033.98 

execute in the_end run summon xp:heart_of_ender.eye -198.0 196.0 2052.0 

execute in the_end run summon xp:heart_of_ender.eye -161 189.5 2033.99 

execute in the_end run summon xp:heart_of_ender.eye -184.05 195.25 2087.98

execute in the_end run summon xp:heart_of_ender.eye -145.0 187.0 2077.0 

execute in the_end run summon xp:heart_of_ender.eye -139.0 189 2065.0 

execute in the_end run summon xp:heart_of_ender.eye -139.0 189 2056.0 

execute in the_end run summon xp:heart_of_ender.eye -147.0 196.0 2033.0 

execute in the_end run summon xp:heart_of_ender.eye -145.0 196.0 2087.0 

# barriers
fill -161 181 2058 -171 181 2062 barrier
fill -162 181 2057 -170 181 2063 barrier
fill -163 181 2056 -169 181 2064 barrier
fill -164 181 2055 -168 181 2065 barrier

function endboss/setup