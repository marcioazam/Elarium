scoreboard players set warderCount math 0
execute as @e[type=xp:friendly_warder,r=50] run scoreboard players add warderCount math 1

execute if score warderCount math matches ..2 run summon xp:sanctuary_mob_spawn ~ ~ ~
execute if score warderCount math matches ..2 run summon xp:friendly_warder ~ ~ ~