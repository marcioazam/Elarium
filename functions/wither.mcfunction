scoreboard players add @a[tag=!wither,r=100] max_health 4
tellraw @a[tag=!wither,r=100] { "rawtext": [ { "text": "§cThe Wither has been killed, you can now go in the end but be prepared because when you'll kill the Ender dragon you'll enter in §5Void mode§c monsters will be even more powerful and some new mobs will spawn" } ] }
tag @a[tag=!wither,r=100] add wither
give @a[r=100] edx:corrupted_star