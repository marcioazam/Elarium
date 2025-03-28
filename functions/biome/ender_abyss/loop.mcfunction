# This function runs every second for players in ender abyss
scoreboard players random chance math 0 50
execute if score chance math matches 0..10 run fog @s push xp:ender_abyss_biome_fog ender_abyss_fog
execute if score chance math matches 0..30 run particle xp:abyss.fog ~ ~ ~