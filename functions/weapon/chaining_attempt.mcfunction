scoreboard objectives add chain_hit dummy
scoreboard objectives add chained_t dummy
scoreboard players random @s chain_hit 0 2

execute as @s[scores={chain_hit=1..}] at @s run effect @s slowness 2 9 true
execute as @s[scores={chain_hit=1..}] at @s run particle dungeons:chain
scoreboard players set @s[scores={chained_t=0}] chained_t 40
execute as @s[scores={chain_hit=1..}] as @s run execute as @e[scores={chained_t=0},family=monster,c=1,r=5,rm=0.1] at @s run function weapon/chaining_attempt