# initialize values
function farlander/tasks/ui/calc_init

# calculate unlocked "challenges"
scoreboard players set @s[tag="ach_050"] achievements1 1
scoreboard players set @s[tag="ach_051"] achievements2 1
scoreboard players set @s[tag="ach_052"] achievements3 1
scoreboard players set @s[tag="ach_053"] achievements4 1
scoreboard players set @s[tag="ach_054"] achievements5 1
scoreboard players set @s[tag="ach_055"] achievements6 1
scoreboard players set @s[tag="ach_056"] achievements7 1
scoreboard players set @s[tag="ach_057"] achievements8 1
scoreboard players set @s[tag="ach_058"] achievements9 1
scoreboard players set @s[tag="ach_059"] achievements10 1
scoreboard players set @s[tag="ach_060"] achievements11 1

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

# render calculations to screen
titleraw @s title {"rawtext":[{"text":"_xp:npc:tasks.tab_challenges."},{"text":"ach_050."},{"score":{"name":"@s","objective":"achievements1"}},{"text":"ach_051."},{"score":{"name":"@s","objective":"achievements2"}},{"text":"ach_052."},{"score":{"name":"@s","objective":"achievements3"}},{"text":"ach_053."},{"score":{"name":"@s","objective":"achievements4"}},{"text":"ach_054."},{"score":{"name":"@s","objective":"achievements5"}},{"text":"ach_055."},{"score":{"name":"@s","objective":"achievements6"}},{"text":"ach_056."},{"score":{"name":"@s","objective":"achievements7"}},{"text":"ach_057."},{"score":{"name":"@s","objective":"achievements8"}},{"text":"ach_058."},{"score":{"name":"@s","objective":"achievements9"}},{"text":"ach_059."},{"score":{"name":"@s","objective":"achievements10"}},{"text":"ach_060."},{"score":{"name":"@s","objective":"achievements11"}}]}

execute if score @s achievements20 < "#2" achievements20 run dialogue open @e[family="farlander",c=1] @s _xp:tasks_challenges_1
execute if score @s achievements20 < "#2" achievements20 run tag @s remove claimed_cha_2
execute if score @s achievements20 < "#4" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag="claimed_cha_2"] _xp:tasks_challenges_2
execute if score @s achievements20 < "#4" achievements20 run tag @s remove claimed_cha_4
execute if score @s achievements20 < "#6" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag="claimed_cha_4"] _xp:tasks_challenges_3
execute if score @s achievements20 < "#6" achievements20 run tag @s remove claimed_cha_6
execute if score @s achievements20 < "#8" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag="claimed_cha_6"] _xp:tasks_challenges_4
execute if score @s achievements20 < "#8" achievements20 run tag @s remove claimed_cha_8
execute if score @s achievements20 < "#11" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag="claimed_cha_8"] _xp:tasks_challenges_5
execute if score @s achievements20 < "#11" achievements20 run tag @s remove claimed_cha_11

execute if score @s achievements20 >= "#11" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag=!"claimed_cha_11"] _xp:tasks_challenges_unclaimed_5
execute if score @s achievements20 >= "#8" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag=!"claimed_cha_8"] _xp:tasks_challenges_unclaimed_4
execute if score @s achievements20 >= "#6" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag=!"claimed_cha_6"] _xp:tasks_challenges_unclaimed_3
execute if score @s achievements20 >= "#4" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag=!"claimed_cha_4"] _xp:tasks_challenges_unclaimed_2
execute if score @s achievements20 >= "#2" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag=!"claimed_cha_2"] _xp:tasks_challenges_unclaimed_1

execute if score @s achievements20 >= "#max_cha" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag="claimed_cha_11"] _xp:tasks_challenges_completed