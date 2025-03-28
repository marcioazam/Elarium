scoreboard objectives add light dummy 
scoreboard players add @s mode 1
scoreboard players set @s[scores={mode=4..}] mode 0

tellraw @s[scores={mode=0}] { "rawtext": [ { "text": "§6Mode:§r Classic §3|| §6Durability cost:§r 1" }] }
tellraw @s[scores={mode=1}] { "rawtext": [ { "text": "§6Mode:§a 1x2 §3|| §6Durability cost:§r 2" }] }
tellraw @s[scores={mode=2}] { "rawtext": [ { "text": "§6Mode:§b 3x1 & 1x3 §3|| §6Durability cost:§r 5" }] }
tellraw @s[scores={mode=3,light=0}] { "rawtext": [ { "text": "§6Mode:§c 3x3 §3|| §6Durability cost:§r 9" }] }
tellraw @s[scores={mode=3,light=1}] { "rawtext": [ { "text": "§6Mode:§c 3x3 §3|| §6Durability cost:§4 18 \nWear a full void armor to reduce the cost to 9" }] }

playsound random.pop @s