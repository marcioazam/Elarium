# check if dialogue closed
execute as @initiator[scores={uiSceneState=1..}] run function farlander/ui/close

# set menu state exited
scoreboard players set @initiator uiSceneState -1