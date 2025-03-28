
# ensure player is in survival
gamemode s @initiator

# claim rewards
execute if score @s achievements20 >= "#2" achievements20 run give @s[tag=!"claimed_cha_2"] xp:enderite_cutter 1
execute if score @s achievements20 >= "#4" achievements20 run give @s[tag=!"claimed_cha_4"] xp:ender_staff 1
execute if score @s achievements20 >= "#6" achievements20 run give @s[tag=!"claimed_cha_6"] xp:the_touched_ends_enchanted 1
execute if score @s achievements20 >= "#8" achievements20 run give @s[tag=!"claimed_cha_8"] xp:hammer_of_void 1
execute if score @s achievements20 >= "#11" achievements20 run give @s[tag=!"claimed_cha_11"] xp:obsidian_blade_enchanted 1

# mark rewards claimed
execute if score @s achievements20 >= "#11" achievements20 run tag @s[tag="claimed_cha_8"] add claimed_cha_11
execute if score @s achievements20 >= "#8" achievements20 run tag @s[tag="claimed_cha_6"] add claimed_cha_8
execute if score @s achievements20 >= "#6" achievements20 run tag @s[tag="claimed_cha_4"] add claimed_cha_6
execute if score @s achievements20 >= "#4" achievements20 run tag @s[tag="claimed_cha_2"] add claimed_cha_4
execute if score @s achievements20 >= "#2" achievements20 run tag @s add claimed_cha_2

# send feedback
playsound random.levelup @s ~ ~ ~ 1.0 1.25

# grant achievement
event entity @s[tag=!"ach_112"] xp:achievements.112

# re-open ui
function farlander/tasks/ui/calc_challenges