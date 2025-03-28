# This function runs every second for players in echoing forest

scoreboard players random chance math 0 99
execute if score chance math matches 0..10 run fog @s push xp:echoing_forest_biome_fog echoing_forest_fog
execute if score chance math matches 0..5 run particle xp:biome_blue_firefly.1_5 ~ ~15 ~
execute if score chance math matches 6..25 run particle xp:biome_blue_firefly.1_1 ~ ~ ~
execute if score chance math matches 50..54 run particle xp:wind_blue_leaf.1 ~ ~ ~
execute if score chance math matches 55..80 run particle xp:biome_blue_firefly.1_3 ~ ~ ~
execute if score chance math matches 15..30 run particle xp:biome_blue_firefly.1_4 ~ ~ ~
execute if score chance math matches 40..50 run particle xp:biome_blue_flower.1 ~ ~ ~
# execute if score chance math matches 16..30 run say wind
execute if score chance math matches 16..17 run playsound entity.warder.scream @a ~ ~10 ~ 0.7
execute if score chance math matches 18..19 run playsound entity.enderbug.hover @a ~ ~10 ~ 1
execute if score chance math matches 20..21 run playsound entity.enderbug.special_attack @a ~ ~10 ~ 1
execute if score chance math matches 22..23 run playsound entity.rippling.scream @a ~ ~10 ~ 1
execute if score chance math matches 24..25 run playsound entity.conduit.portal_use @a ~ ~10 ~ 1
execute if score chance math matches 24..25 run playsound entity.conduit.portal_use @a ~ ~10 ~ 1
execute if score chance math matches 26..27 run playsound entity.conduit.death_start @a ~ ~10 ~ 1
# say loop
# kill @e[type=xp_orb]