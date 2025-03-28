# This function runs every second for players in ender wilds
scoreboard players random chance math 0 60
execute if score chance math matches 0..10 run fog @s push xp:wilds_biome_fog wilds_fog
execute if score chance math matches 5..6 run playsound wilds_biome.wind @s ~ ~ ~ 0.65 1 0.5
execute if score chance math matches 5..6 run particle xp:wilds.wind ~ ~ ~
execute if score chance math matches 5..6 run particle xp:wilds.wind ~ ~ ~
execute if score chance math matches 5..6 run particle xp:biome_yellow_ambient.1 ~ ~ ~
execute if score chance math matches 6..8 run particle xp:biome_yellow_ambient.2 ~ ~ ~
execute if score chance math matches 0..20 run particle xp:wilds_ambient_1 ~ ~ ~
execute if score chance math matches 0..40 run particle xp:biome_yellow_ambient.1 ~ ~ ~
execute if score chance math matches 0..40 run particle xp:biome_yellow_ambient.3 ~ ~ ~