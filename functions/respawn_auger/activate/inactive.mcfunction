# ran when interacting with a respawn auger

# depending on the auger's position, set the nearby players' augerID score
execute if entity @s[x=311,y=75,z=538,r=10]     run scoreboard players set @a[r=10] augerID 1
execute if entity @s[x=409,y=89,z=668,r=10]     run scoreboard players set @a[r=10] augerID 2
execute if entity @s[x=518,y=96,z=865,r=10]     run scoreboard players set @a[r=10] augerID 3
execute if entity @s[x=409,y=96,z=974,r=10]     run scoreboard players set @a[r=10] augerID 4
execute if entity @s[x=314,y=96,z=865,r=10]     run scoreboard players set @a[r=10] augerID 5
execute if entity @s[x=416,y=75,z=874,r=10]     run scoreboard players set @a[r=10] augerID 6
execute if entity @s[x=-84,y=73,z=300,r=10]     run scoreboard players set @a[r=10] augerID 7
execute if entity @s[x=-205,y=52,z=124,r=10]    run scoreboard players set @a[r=10] augerID 8
execute if entity @s[x=326,y=176,z=-496,r=10]   run scoreboard players set @a[r=10] augerID 9
execute if entity @s[x=312,y=111,z=-515,r=10]   run scoreboard players set @a[r=10] augerID 10
execute if entity @s[x=-562,y=58,z=79,r=10]     run scoreboard players set @a[r=10] augerID 11
execute if entity @s[x=-109,y=51,z=-130,r=10]   run scoreboard players set @a[r=10] augerID 12
execute if entity @s[x=-127,y=56,z=-364,r=10]   run scoreboard players set @a[r=10] augerID 13
execute if entity @s[x=79,y=50,z=-467,r=10]     run scoreboard players set @a[r=10] augerID 14
execute if entity @s[x=-569,y=57,z=249,r=10]    run scoreboard players set @a[r=10] augerID 15
execute if entity @s[x=320,y=74,z=86,r=10]      run scoreboard players set @a[r=10] augerID 16
execute if entity @s[x=538,y=80,z=-402,r=10]    run scoreboard players set @a[r=10] augerID 17
execute if entity @s[x=-478,y=63,z=-428,r=10]   run scoreboard players set @a[r=10] augerID 18

# depending on auger's position set its own augerID score
execute if entity @s[x=311,y=75,z=538,r=10]     run scoreboard players set @s augerID 1
execute if entity @s[x=409,y=89,z=668,r=10]     run scoreboard players set @s augerID 2
execute if entity @s[x=518,y=96,z=865,r=10]     run scoreboard players set @s augerID 3
execute if entity @s[x=409,y=96,z=974,r=10]     run scoreboard players set @s augerID 4
execute if entity @s[x=314,y=96,z=865,r=10]     run scoreboard players set @s augerID 5
execute if entity @s[x=416,y=75,z=874,r=10]     run scoreboard players set @s augerID 6
execute if entity @s[x=-84,y=73,z=300,r=10]     run scoreboard players set @s augerID 7
execute if entity @s[x=-205,y=52,z=124,r=10]    run scoreboard players set @s augerID 8
execute if entity @s[x=326,y=176,z=-496,r=10]   run scoreboard players set @s augerID 9
execute if entity @s[x=312,y=111,z=-515,r=10]   run scoreboard players set @s augerID 10
execute if entity @s[x=-562,y=58,z=79,r=10]     run scoreboard players set @s augerID 11
execute if entity @s[x=-109,y=51,z=-130,r=10]   run scoreboard players set @s augerID 12
execute if entity @s[x=-127,y=56,z=-364,r=10]   run scoreboard players set @s augerID 13
execute if entity @s[x=79,y=50,z=-467,r=10]     run scoreboard players set @s augerID 14
execute if entity @s[x=-569,y=57,z=249,r=10]    run scoreboard players set @s augerID 15
execute if entity @s[x=320,y=74,z=86,r=10]      run scoreboard players set @s augerID 16
execute if entity @s[x=538,y=80,z=-402,r=10]    run scoreboard players set @s augerID 17
execute if entity @s[x=-478,y=63,z=-428,r=10]   run scoreboard players set @s augerID 18


# function respawn_auger/deactivate
event entity @s xp:active
tag @s add active

# we will use actionbar texts for now display information #
titleraw @a[r=7] actionbar {"rawtext":[{"translate":"xp.respawn_auger.inside_range"}]}
titleraw @a[rm=7] actionbar {"rawtext":[{"translate":"xp.respawn_auger.outside_range"}]}
titleraw @a actionbar {"rawtext":[{"translate":"xp.respawn_auger.spawn_set"}]}
playsound beacon.activate @a ~~~ 1 0.5

scoreboard objectives add auger_values dummy
scoreboard players set @a[r=10] auger_values 3

titleraw @a[r=10] actionbar {"rawtext":[{"translate":"xp.respawn_auger.uses"},{"score":{"objective":"auger_values","name":"*"}}]}