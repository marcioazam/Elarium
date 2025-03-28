
scoreboard players add @s mode 1
scoreboard players set @s[scores={mode=4..}] mode 0

tellraw @s[scores={mode=0}] { "rawtext": [ { "text": "§6Mode:§r Classic §3|| §6Durability cost:§r 1" }] }
tellraw @s[scores={mode=1}] { "rawtext": [ { "text": "§6Mode:§a 1x5 §3|| §6Durability cost:§r 3" }] }
tellraw @s[scores={mode=2}] { "rawtext": [ { "text": "§6Mode:§b 1x15 §3|| §6Durability cost:§r 6" }] }
tellraw @s[scores={mode=3,light=!1}] { "rawtext": [ { "text": "§6Mode:§c 1x30" }] }
tellraw @s[scores={mode=3,light=1}] { "rawtext": [ { "text": "§cYou can't use the 1x30 mode with a full light armor!" }] }
scoreboard players add @s[scores={mode=3,light=1}] mode 1
playsound random.pop @s