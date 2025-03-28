effect @e[type=!player,tag=snared,scores={snare=21..}] slowness 1 99 true

inputpermission set @e[type=player,tag=snared,scores={snare=80..}] movement disabled

inputpermission set @e[type=player,tag=snared,scores={snare=1}] movement enabled

tag @e[tag=snared,scores={snare=1}] remove snared

scoreboard players remove @e[scores={snare=1..}] snare 1

execute as @e[scores={snare=2}] at @s run playsound mob.snareling.impact @a ~~~ 1.0 0.5