scoreboard objectives add wind_cd dummy
tag @a[scores={wind_cd=1}] remove horn_immune
tag @a[scores={wind_cd=1}] remove strong_horn_immune
scoreboard players remove @a[scores={wind_cd=1..}] wind_cd 1

