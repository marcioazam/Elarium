# set menu state new open
scoreboard players set @initiator uiSceneState 0

# continue dialogue
scoreboard players add @initiator dialogue 1
scoreboard players set .dialog_effect_id var 1
execute as @initiator run function farlander/ui/dialogue

# open up associated chat menu
dialogue open @s @initiator _xp:farlander_chat_2