
# ensure player is in survival
gamemode s @initiator

# claim rewards
execute if score @s achievements20 >= "#4" achievements20 run give @s[tag=!"claimed_goa_4"] minecraft:elytra 1
execute if score @s achievements20 >= "#8" achievements20 run give @s[tag=!"claimed_goa_8"] xp:shulker_trill 64
execute if score @s achievements20 >= "#12" achievements20 run give @s[tag=!"claimed_goa_12"] xp:void_cloak 64
execute if score @s achievements20 >= "#16" achievements20 run give @s[tag=!"claimed_goa_16"] xp:ender_artifact 64
execute if score @s achievements20 >= "#19" achievements20 run give @s[tag=!"claimed_goa_19"] xp:tome_teleportation 1

# mark rewards claimed
execute if score @s achievements20 >= "#19" achievements20 run tag @s[tag="claimed_goa_16"] add claimed_goa_19
execute if score @s achievements20 >= "#16" achievements20 run tag @s[tag="claimed_goa_12"] add claimed_goa_16
execute if score @s achievements20 >= "#12" achievements20 run tag @s[tag="claimed_goa_8"] add claimed_goa_12
execute if score @s achievements20 >= "#8" achievements20 run tag @s[tag="claimed_goa_4"] add claimed_goa_8
execute if score @s achievements20 >= "#4" achievements20 run tag @s add claimed_goa_4

# send feedback
playsound random.levelup @s ~ ~ ~ 1.0 1.25

# grant achievement
event entity @s[tag=!"ach_112"] xp:achievements.112

# re-open ui
function farlander/tasks/ui/calc_goals