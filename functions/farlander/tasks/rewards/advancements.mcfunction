
# ensure player is in survival
gamemode s @initiator

# claim rewards
execute if score @s achievements20 >= "#1" achievements20 run give @s[tag=!"claimed_adv_1"] xp:ends_scream 1 
execute if score @s achievements20 >= "#2" achievements20 run give @s[tag=!"claimed_adv_2"] minecraft:enchanted_golden_apple 1 
execute if score @s achievements20 >= "#4" achievements20 run give @s[tag=!"claimed_adv_4"] minecraft:ender_pearl 16 
execute if score @s achievements20 >= "#6" achievements20 run give @s[tag=!"claimed_adv_6"] xp:enders_rebirth 1 
execute if score @s achievements20 >= "#10" achievements20 run give @s[tag=!"claimed_adv_10"] xp:heart_of_enders_breath 1 

# mark rewards claimed
execute if score @s achievements20 >= "#10" achievements20 run tag @s[tag="claimed_adv_6"] add claimed_adv_10 
execute if score @s achievements20 >= "#6" achievements20 run tag @s[tag="claimed_adv_4"] add claimed_adv_6 
execute if score @s achievements20 >= "#4" achievements20 run tag @s[tag="claimed_adv_2"] add claimed_adv_4 
execute if score @s achievements20 >= "#2" achievements20 run tag @s[tag="claimed_adv_1"] add claimed_adv_2 
execute if score @s achievements20 >= "#1" achievements20 run tag @s add claimed_adv_1 

# send feedback
playsound random.levelup @s ~ ~ ~ 1.0 1.25

# grant achievement
event entity @s[tag=!"ach_112"] xp:achievements.112

# re-open ui
function farlander/tasks/ui/calc_advancements