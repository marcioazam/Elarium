# initialize values
function farlander/tasks/ui/calc_init

# calculate unlocked "goals"
scoreboard players set @s[tag="ach_100"] achievements1 1
scoreboard players set @s[tag="ach_101"] achievements2 1
scoreboard players set @s[tag="ach_102"] achievements3 1
scoreboard players set @s[tag="ach_103"] achievements4 1
scoreboard players set @s[tag="ach_104"] achievements5 1
scoreboard players set @s[tag="ach_105"] achievements6 1
scoreboard players set @s[tag="ach_106"] achievements7 1
scoreboard players set @s[tag="ach_107"] achievements8 1
scoreboard players set @s[tag="ach_108"] achievements9 1
scoreboard players set @s[tag="ach_109"] achievements10 1
scoreboard players set @s[tag="ach_110"] achievements11 1
scoreboard players set @s[tag="ach_111"] achievements12 1
scoreboard players set @s[tag="ach_112"] achievements13 1
scoreboard players set @s[tag="ach_113"] achievements14 1
scoreboard players set @s[tag="ach_114"] achievements15 1
scoreboard players set @s[tag="ach_115"] achievements16 1
scoreboard players set @s[tag="ach_116"] achievements17 1
scoreboard players set @s[tag="ach_117"] achievements18 1
scoreboard players set @s[tag="ach_118"] achievements19 1

scoreboard players operation @s achievements20 += @s achievements1 
scoreboard players operation @s achievements20 += @s achievements2 
scoreboard players operation @s achievements20 += @s achievements3 
scoreboard players operation @s achievements20 += @s achievements4 
scoreboard players operation @s achievements20 += @s achievements5 
scoreboard players operation @s achievements20 += @s achievements6 
scoreboard players operation @s achievements20 += @s achievements7 
scoreboard players operation @s achievements20 += @s achievements8 
scoreboard players operation @s achievements20 += @s achievements9 
scoreboard players operation @s achievements20 += @s achievements10 
scoreboard players operation @s achievements20 += @s achievements11 
scoreboard players operation @s achievements20 += @s achievements12 
scoreboard players operation @s achievements20 += @s achievements13 
scoreboard players operation @s achievements20 += @s achievements14 
scoreboard players operation @s achievements20 += @s achievements15 
scoreboard players operation @s achievements20 += @s achievements16 
scoreboard players operation @s achievements20 += @s achievements17 
scoreboard players operation @s achievements20 += @s achievements18 
scoreboard players operation @s achievements20 += @s achievements19 

# render calculations to screen
titleraw @s title {"rawtext":[{"text":"_xp:npc:tasks.tab_goals."},{"text":"ach_100."},{"score":{"name":"@s","objective":"achievements1"}},{"text":"ach_101."},{"score":{"name":"@s","objective":"achievements2"}},{"text":"ach_102."},{"score":{"name":"@s","objective":"achievements3"}},{"text":"ach_103."},{"score":{"name":"@s","objective":"achievements4"}},{"text":"ach_104."},{"score":{"name":"@s","objective":"achievements5"}},{"text":"ach_105."},{"score":{"name":"@s","objective":"achievements6"}},{"text":"ach_106."},{"score":{"name":"@s","objective":"achievements7"}},{"text":"ach_107."},{"score":{"name":"@s","objective":"achievements8"}},{"text":"ach_108."},{"score":{"name":"@s","objective":"achievements9"}},{"text":"ach_109."},{"score":{"name":"@s","objective":"achievements10"}},{"text":"ach_110."},{"score":{"name":"@s","objective":"achievements11"}},{"text":"ach_111."},{"score":{"name":"@s","objective":"achievements12"}},{"text":"ach_112."},{"score":{"name":"@s","objective":"achievements13"}},{"text":"ach_113."},{"score":{"name":"@s","objective":"achievements14"}},{"text":"ach_114."},{"score":{"name":"@s","objective":"achievements15"}},{"text":"ach_115."},{"score":{"name":"@s","objective":"achievements16"}},{"text":"ach_116."},{"score":{"name":"@s","objective":"achievements17"}},{"text":"ach_117."},{"score":{"name":"@s","objective":"achievements18"}},{"text":"ach_118."},{"score":{"name":"@s","objective":"achievements19"}}]}

execute if score @s achievements20 < "#4" achievements20 run dialogue open @e[family="farlander",c=1] @s _xp:tasks_goals_1
execute if score @s achievements20 < "#4" achievements20 run tag @s remove claimed_goa_4
execute if score @s achievements20 < "#8" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag="claimed_goa_4"] _xp:tasks_goals_2
execute if score @s achievements20 < "#8" achievements20 run tag @s remove claimed_goa_8
execute if score @s achievements20 < "#12" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag="claimed_goa_8"] _xp:tasks_goals_3
execute if score @s achievements20 < "#12" achievements20 run tag @s remove claimed_goa_12
execute if score @s achievements20 < "#16" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag="claimed_goa_12"] _xp:tasks_goals_4
execute if score @s achievements20 < "#16" achievements20 run tag @s remove claimed_goa_16
execute if score @s achievements20 < "#19" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag="claimed_goa_16"] _xp:tasks_goals_5
execute if score @s achievements20 < "#19" achievements20 run tag @s remove claimed_goa_19

execute if score @s achievements20 >= "#19" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag=!"claimed_goa_19"] _xp:tasks_goals_unclaimed_5
execute if score @s achievements20 >= "#16" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag=!"claimed_goa_16"] _xp:tasks_goals_unclaimed_4
execute if score @s achievements20 >= "#12" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag=!"claimed_goa_12"] _xp:tasks_goals_unclaimed_3
execute if score @s achievements20 >= "#8" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag=!"claimed_goa_8"] _xp:tasks_goals_unclaimed_2
execute if score @s achievements20 >= "#4" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag=!"claimed_goa_4"] _xp:tasks_goals_unclaimed_1

execute if score @s achievements20 >= "#max_goa" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag="claimed_goa_19"] _xp:tasks_goals_completed