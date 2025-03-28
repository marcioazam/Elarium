# executed in overworld positioned -1354 5 -1394
# if a player is within 50 blocks of spawn, make sure it's sunny and mobs can not spawn
# turns out setting the weather to rain 1 to let the clear weather timer reset naturally causes it to rain when the player first loads the world
execute if entity @p[r=50] run weather clear 25000
execute if entity @p[r=50] run gamerule domobspawning false
execute unless entity @p[r=50] run gamerule domobspawning true