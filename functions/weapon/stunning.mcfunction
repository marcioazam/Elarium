scoreboard objectives add stunning_hit dummy
scoreboard players random @s stunning_hit 0 4
scoreboard objectives add stun_cd dummy
scoreboard players add @s stun_cd 0

execute as @s[scores={stun_cd=0,stunning_hit=3..}] at @s run function weapon/axe_stunned