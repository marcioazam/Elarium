
scoreboard players add @s mode 1
scoreboard players set @s[scores={mode=3..}] mode 0

tellraw @s[scores={mode=0}] { "rawtext": [ { "text": "§6Mode:§r Classic" }] }
tellraw @s[scores={mode=1}] { "rawtext": [ { "text": "§6Mode:§a 1x5" }] }
tellraw @s[scores={mode=2}] { "rawtext": [ { "text": "§6Mode:§b 1x15" }] }
playsound random.pop @s