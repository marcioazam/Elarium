
# set menu state
scoreboard players add @initiator uiSceneState 1

# check if dialogue closed
event entity @initiator xp:farlander.quick_travel.reset
event entity @initiator xp:farlander.quick_travel.close
