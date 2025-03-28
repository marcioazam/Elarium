# summons a random animal to put in the cage on biome placement
scoreboard players random chance math 0 9
execute if score chance math matches 0 run summon cow
execute if score chance math matches 1 run summon sheep
execute if score chance math matches 2 run summon pig
execute if score chance math matches 3 run summon chicken
execute if score chance math matches 4 run summon zombie
execute if score chance math matches 5 run summon creeper
execute if score chance math matches 6 run summon wolf
execute if score chance math matches 7 run summon bee
execute if score chance math matches 8 run summon fox
execute if score chance math matches 9 run summon panda