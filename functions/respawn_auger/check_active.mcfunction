# runs for each auger every second
scoreboard objectives add tempAugerID dummy
scoreboard objectives add augerID dummy

# count the players with matching augerID and if there isn't any, deactivate
execute as @a run scoreboard players operation @s tempAugerID = @s augerID
scoreboard players operation @a tempAugerID -= @s augerID
# if we don't find any player with matching score, deactivate
execute unless entity @a[scores={tempAugerID=0}] run function respawn_auger/deactivate