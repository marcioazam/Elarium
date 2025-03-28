scoreboard objectives add ender dummy
scoreboard players set get ender 0
execute as @e[family=mob,family=!xp_dummy,type=!player,r=10,c=5] at @s run scoreboard players set get ender 1
execute as @e[family=monster,family=!xp_dummy,type=!player,r=10,c=5] at @s run scoreboard players set get ender 1
scoreboard players operation @s ender = get ender
execute as @s[scores={ender=1}] at @s run function ender_sword/ender_success