execute if score ongoing_battle endboss matches 1 run function endboss/battle_loop

execute if score boss_defeated endboss matches 1 unless entity @p[r=50] run scoreboard players add boss_respawn_wait endboss 1
execute if score boss_defeated endboss matches 1 if score boss_respawn_wait endboss matches 500.. run function endboss/respawn_boss

execute if score ongoing_battle endboss matches 0 positioned ~ 180 ~ as @a[r=6] at @s[dy=2,x=~-10,z=~-10,dx=20,dz=20] if block ~ ~-0.5 ~ end_portal run tag @s[scores={auger_values=1..,augerID=1..}] add just_killed_boss
execute if score ongoing_battle endboss matches 0 positioned ~ 180 ~ as @a[r=6] at @s[dy=2,x=~-10,z=~-10,dx=20,dz=20] if block ~ ~-0.5 ~ end_portal run event entity @s[scores={auger_values=1..,augerID=1..}] xp:end_travel.to_respawn_auger
execute if score ongoing_battle endboss matches 0 positioned ~ 180 ~ as @a[r=6] at @s[dy=2,x=~-10,z=~-10,dx=20,dz=20] if block ~ ~-0.5 ~ end_portal run event entity @s[scores={auger_values=0}] xp:end_travel.to_overworld

tag @a[m=survival,r=30] add endboss_adventure_mode
fog @a[r=30] push xp:end_boss_fog end_boss_fog
gamemode adventure @a[m=survival,tag=endboss_adventure_mode]
fog @a[m=adventure,rm=31,tag=endboss_adventure_mode] remove end_boss_fog
gamemode survival @a[m=adventure,rm=31,tag=endboss_adventure_mode]
tag @a[rm=31] remove endboss_adventure_mode