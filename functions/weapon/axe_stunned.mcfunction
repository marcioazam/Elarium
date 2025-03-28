effect @s slowness 1 255 true
effect @s weakness 1 255 true
particle dungeons:stun_1s

scoreboard objectives add stun_cd dummy
scoreboard players set @s stun_cd 100
playsound ambient.weather.lightning.impact @a ~~~ 0.33 2.5