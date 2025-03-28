execute as @e[type=dungeons:wraith_fire] at @s run damage @e[type=!item,family=!undead,r=1.33] 3 fire

execute as @e[type=dungeons:wraith_fire_strong] at @s run damage @e[type=!item,family=!undead,r=1.33] 5 fire

execute as @e[type=dungeons:wretched_wraith_fire] at @s run damage @e[type=!item,family=!monster,family=!wretched_wraith_death,r=1] 15 fire

execute as @e[type=dungeons:wretched_wraith_fire] at @s run effect @e[type=!item,family=!monster,r=1.5] weakness 25 1 true

execute as @e[type=dungeons:wretched_wraith_fire] at @s run effect @e[type=!item,family=player,r=15] mining_fatigue 25 2 true

execute as @e[type=dungeons:weak_wretched_fire] at @s run damage @e[type=!item,family=!monster,family=!wretched_wraith_death,r=2] 8 fire

execute as @e[type=dungeons:weak_wretched_fire] at @s run effect @e[type=!item,family=!monster,family=!wretched_wraith_death,r=2.5] weakness 25 0 true


execute as @e[type=dungeons:cauldron_fire] at @s run damage @e[type=!item,family=!monster,r=4] 9 magic entity @e[type=dungeons:corrupted_cauldron,c=1,r=16]

execute as @e[type=dungeons:rolling_flame_fire] at @s run damage @e[type=!item,family=!monster,r=1] 6 fire

execute as @e[type=dungeons:tower_wraith_fire] at @s run damage @e[type=!item,family=!monster,r=2.25] 6 fire
execute as @e[type=dungeons:tower_wraith_poison] at @s run damage @e[type=!item,family=!monster,r=1.33] 7 magic