tp @s[scores={augerID=1}] 313 75 538
tp @s[scores={augerID=2}] 409 89 670
tp @s[scores={augerID=3}] 518 96 867
tp @s[scores={augerID=4}] 409 96 976
tp @s[scores={augerID=5}] 314 96 867
tp @s[scores={augerID=6}] 416 75 876
tp @s[scores={augerID=7}] -84 73 302
tp @s[scores={augerID=8}] -205 52 126
tp @s[scores={augerID=9}] 326 176 -494
tp @s[scores={augerID=10}] 312 111 -513
tp @s[scores={augerID=11}] -562 58 81
tp @s[scores={augerID=12}] -109 51 -128
tp @s[scores={augerID=13}] -127 56 -362
tp @s[scores={augerID=14}] 79 50 -465
tp @s[scores={augerID=15}] -569 58 246
tp @s[scores={augerID=16}] 323 74 86
tp @s[scores={augerID=17}] 535 81 -402
tp @s[scores={augerID=18}] -478 64 -425

effect @s resistance 3 10 true
tag @s add just_respawned_with_auger
playanimation @s respawn "1"
scoreboard players remove @s[tag=!just_killed_boss] auger_values 1
execute at @s run event entity @e[type=xp:respawn_auger,c=1] xp:display_tellraw
# titleraw @s actionbar {"rawtext":[{"translate":"xp.respawn_auger.uses"},{"score":{"objective":"auger_values","name":"*"}}]}
scoreboard players set @s[scores={auger_values=..0}] augerID 0

tag @s remove just_killed_boss