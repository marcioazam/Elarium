tag @s add snared
particle dungeons:snareling_web
scoreboard objectives add snare dummy
scoreboard players set @s snare 80
camera @s fade time 0 0 0.6 color 180 255 10

playsound mob.snareling.impact @a ~~~ 1.0 1.0

effect @s slowness 4 0 true