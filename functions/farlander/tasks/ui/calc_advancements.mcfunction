# initialize values
function farlander/tasks/ui/calc_init

# calculate unlocked "advancements"
scoreboard players set @s[tag="ach_001"] achievements1 1
scoreboard players set @s[tag="ach_002"] achievements2 1
scoreboard players set @s[tag="ach_003"] achievements3 1
scoreboard players set @s[tag="ach_004"] achievements4 1
scoreboard players set @s[tag="ach_005"] achievements5 1
scoreboard players set @s[tag="ach_006"] achievements6 1
scoreboard players set @s[tag="ach_007"] achievements7 1
scoreboard players set @s[tag="ach_008"] achievements8 1
scoreboard players set @s[tag="ach_009"] achievements9 1
scoreboard players set @s[tag="ach_010"] achievements10 1

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

# render calculations to screen
titleraw @s[tag="farlander_tasks_chat_init"] title {"rawtext":[{"text":"_xp:npc:tasks.tab_advancements."},{"text":"ach_001."},{"score":{"name":"@s","objective":"achievements1"}},{"text":"ach_002."},{"score":{"name":"@s","objective":"achievements2"}},{"text":"ach_003."},{"score":{"name":"@s","objective":"achievements3"}},{"text":"ach_004."},{"score":{"name":"@s","objective":"achievements4"}},{"text":"ach_005."},{"score":{"name":"@s","objective":"achievements5"}},{"text":"ach_006."},{"score":{"name":"@s","objective":"achievements6"}},{"text":"ach_007."},{"score":{"name":"@s","objective":"achievements7"}},{"text":"ach_008."},{"score":{"name":"@s","objective":"achievements8"}},{"text":"ach_009."},{"score":{"name":"@s","objective":"achievements9"}},{"text":"ach_010."},{"score":{"name":"@s","objective":"achievements10"}}]}
titleraw @s[tag=!"farlander_tasks_chat_init"] title {"rawtext":[{"text":"_xp:npc:tasks_init.tab_advancements."},{"text":"ach_001."},{"score":{"name":"@s","objective":"achievements1"}},{"text":"ach_002."},{"score":{"name":"@s","objective":"achievements2"}},{"text":"ach_003."},{"score":{"name":"@s","objective":"achievements3"}},{"text":"ach_004."},{"score":{"name":"@s","objective":"achievements4"}},{"text":"ach_005."},{"score":{"name":"@s","objective":"achievements5"}},{"text":"ach_006."},{"score":{"name":"@s","objective":"achievements6"}},{"text":"ach_007."},{"score":{"name":"@s","objective":"achievements7"}},{"text":"ach_008."},{"score":{"name":"@s","objective":"achievements8"}},{"text":"ach_009."},{"score":{"name":"@s","objective":"achievements9"}},{"text":"ach_010."},{"score":{"name":"@s","objective":"achievements10"}}]}
tag @s add farlander_tasks_chat_init

execute if score @s achievements20 < "#1" achievements20 run dialogue open @e[family="farlander",c=1] @s _xp:tasks_advancements_1
execute if score @s achievements20 < "#1" achievements20 run tag @s remove claimed_adv_1
execute if score @s achievements20 < "#2" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag="claimed_adv_1"] _xp:tasks_advancements_2
execute if score @s achievements20 < "#2" achievements20 run tag @s remove claimed_adv_2
execute if score @s achievements20 < "#4" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag="claimed_adv_2"] _xp:tasks_advancements_3
execute if score @s achievements20 < "#4" achievements20 run tag @s remove claimed_adv_4
execute if score @s achievements20 < "#6" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag="claimed_adv_4"] _xp:tasks_advancements_4
execute if score @s achievements20 < "#6" achievements20 run tag @s remove claimed_adv_6
execute if score @s achievements20 < "#10" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag="claimed_adv_6"] _xp:tasks_advancements_5
execute if score @s achievements20 < "#10" achievements20 run tag @s remove claimed_adv_10

execute if score @s achievements20 >= "#10" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag=!"claimed_adv_10"] _xp:tasks_advancements_unclaimed_5
execute if score @s achievements20 >= "#6" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag=!"claimed_adv_6"] _xp:tasks_advancements_unclaimed_4
execute if score @s achievements20 >= "#4" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag=!"claimed_adv_4"] _xp:tasks_advancements_unclaimed_3
execute if score @s achievements20 >= "#2" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag=!"claimed_adv_2"] _xp:tasks_advancements_unclaimed_2
execute if score @s achievements20 >= "#1" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag=!"claimed_adv_1"] _xp:tasks_advancements_unclaimed_1

execute if score @s achievements20 >= "#max_adv" achievements20 run dialogue open @e[family="farlander",c=1] @s[tag="claimed_adv_10"] _xp:tasks_advancements_completed