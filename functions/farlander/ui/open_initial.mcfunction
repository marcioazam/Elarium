
# set menu state new open
scoreboard players set @s uiSceneState 0

# initialize dialogue
scoreboard players set @s dialogue 1
scoreboard players set .dialog_effect_id var 0

# initialize dialogue
function farlander/ui/dialogue

# open ui
event entity @e[family="farlander",c=1] xp:npc_reset
dialogue open @e[family="farlander",c=1] @s[tag=dialogue_basic] _xp:farlander_chat_0
dialogue open @e[family="farlander",tag=!"busy",c=1] @s[tag=!dialogue_basic] _xp:farlander_chat_2
dialogue open @e[family="farlander",tag="busy",c=1] @s[tag=!dialogue_basic] _xp:farlander_chat_3

# check busy flag
tag @e[family="farlander",scores={interactCount=..1},c=1] remove busy
tag @e[family="farlander",scores={interactCount=2..},c=1] add busy
execute if entity @s[tag=!"interacted"] at @s run scoreboard players add @e[family="farlander",c=1] interactCount 1
tag @s add interacted

# reset other screen usage
tag @s remove dialogue_quick_travel
tag @s remove dialogue_tasks
tag @s remove farlander_tasks_chat_init
scoreboard players reset @s gvar

tag @s remove to_ender_wilds
tag @s remove to_echoing_forest
tag @s remove to_ender_arena
tag @s remove to_ender_abyss
tag @s remove to_riftlands
tag @s remove to_broken_sanctuary
