# This function runs every second for players in ender riftlands
scoreboard players random chance math 0 100
execute if score chance math matches 0..10 run fog @s push xp:ender_riftlands_biome_fog ender_riftlands_fog
execute if score chance math matches 5..6 run playsound wilds_biome.wind @s ~ ~ ~ 0.65 1 0.5
execute if score chance math matches 5..20 run particle xp:biome_riftland_fog.1 ~ ~ ~
execute if score chance math matches 25..75 run particle xp:biome_riftland_fog.1 ~ ~-25 ~
execute if score chance math matches 0..40 run particle xp:biome_riftland_crystal.2 ~ ~ ~