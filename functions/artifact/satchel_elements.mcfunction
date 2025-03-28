scoreboard objectives add element dummy
scoreboard players random @s element 0 2

execute as @s[scores={element=0}] at @s run execute as @e[family=monster,c=7,r=8] at @s run function artifact/satchel_elements/freeze

execute as @s[scores={element=1}] at @s run execute as @e[family=monster,c=7,r=8] at @s run function artifact/satchel_elements/burn

execute as @s[scores={element=2}] at @s run execute as @e[family=monster,c=7,r=8] at @s run function artifact/satchel_elements/shock