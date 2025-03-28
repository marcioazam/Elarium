# initialize tags
tag @s remove farlander_quest_done

tag @s remove claimed_adv_1
tag @s remove claimed_adv_2
tag @s remove claimed_cha_2
tag @s remove claimed_adv_4
tag @s remove claimed_cha_4
tag @s remove claimed_goa_4
tag @s remove claimed_adv_6
tag @s remove claimed_cha_6
tag @s remove claimed_cha_8
tag @s remove claimed_goa_8
tag @s remove claimed_adv_10
tag @s remove claimed_cha_10
tag @s remove claimed_goa_12
tag @s remove claimed_goa_16
tag @s remove claimed_goa_19

# remove and reset global objectives
scoreboard objectives remove var
scoreboard objectives remove gvar
scoreboard objectives remove uiSceneState
scoreboard objectives remove dialogue
scoreboard objectives remove dialogueId
scoreboard objectives remove interactCount
scoreboard objectives remove walkDistance

scoreboard objectives remove achievements1
scoreboard objectives remove achievements2
scoreboard objectives remove achievements3
scoreboard objectives remove achievements4
scoreboard objectives remove achievements5
scoreboard objectives remove achievements6
scoreboard objectives remove achievements7
scoreboard objectives remove achievements8
scoreboard objectives remove achievements9
scoreboard objectives remove achievements10
scoreboard objectives remove achievements11
scoreboard objectives remove achievements12
scoreboard objectives remove achievements13
scoreboard objectives remove achievements14
scoreboard objectives remove achievements15
scoreboard objectives remove achievements16
scoreboard objectives remove achievements17
scoreboard objectives remove achievements18
scoreboard objectives remove achievements19
scoreboard objectives remove achievements20

# setup global objectives
scoreboard objectives add var dummy
scoreboard objectives add gvar dummy
scoreboard objectives add uiSceneState dummy
scoreboard objectives add dialogue dummy
scoreboard objectives add dialogueId dummy
scoreboard objectives add quickTravel dummy
scoreboard objectives add interactCount dummy
scoreboard objectives add walkDistance dummy

scoreboard objectives add achievements1 dummy
scoreboard objectives add achievements2 dummy
scoreboard objectives add achievements3 dummy
scoreboard objectives add achievements4 dummy
scoreboard objectives add achievements5 dummy
scoreboard objectives add achievements6 dummy
scoreboard objectives add achievements7 dummy
scoreboard objectives add achievements8 dummy
scoreboard objectives add achievements9 dummy
scoreboard objectives add achievements10 dummy
scoreboard objectives add achievements11 dummy
scoreboard objectives add achievements12 dummy
scoreboard objectives add achievements13 dummy
scoreboard objectives add achievements14 dummy
scoreboard objectives add achievements15 dummy
scoreboard objectives add achievements16 dummy
scoreboard objectives add achievements17 dummy
scoreboard objectives add achievements18 dummy
scoreboard objectives add achievements19 dummy
scoreboard objectives add achievements20 dummy

# setup global scores
scoreboard players set "#10" var 10
scoreboard players set "#1000" var 1000
scoreboard players set "#max_adv" achievements20 10
scoreboard players set "#max_cha" achievements20 11
scoreboard players set "#max_goa" achievements20 19
scoreboard players set "#1" achievements20 1
scoreboard players set "#2" achievements20 2
scoreboard players set "#4" achievements20 4
scoreboard players set "#6" achievements20 6
scoreboard players set "#8" achievements20 8
scoreboard players set "#10" achievements20 10
scoreboard players set "#11" achievements20 11

scoreboard players set "#12" achievements20 12
scoreboard players set "#16" achievements20 16
scoreboard players set "#19" achievements20 19

# setup default scores
scoreboard players set @a dialogueId 04100