scoreboard objectives add void dummy 
scoreboard players add @s mode 1
scoreboard players set @s[scores={mode=4..}] mode 0

tellraw @s[scores={mode=0}] { "rawtext": [ { "text": "§6Mode:§r Classic" }] }
tellraw @s[scores={mode=1}] { "rawtext": [ { "text": "§6Mode:§a 1x2" }] }
tellraw @s[scores={mode=2}] { "rawtext": [ { "text": "§6Mode:§b 3x1 & 1x3" }] }
tellraw @s[scores={mode=3,void=0}] { "rawtext": [ { "text": "§6Mode:§c 3x3" }] }
tellraw @s[scores={mode=3,void=1}] { "rawtext": [ { "text": "§6Mode:§c 3x3 §3Don't work if you wear a full void armor" }] }

playsound random.pop @s