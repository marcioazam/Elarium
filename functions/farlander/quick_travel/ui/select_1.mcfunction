# set menu state new open
scoreboard players set @initiator uiSceneState 0

# set quick travel location
scoreboard players set @initiator[tag=!"in_echoing_forest"] gvar 1

# open up associated quick travel menu
dialogue open @s @initiator[tag=!"in_echoing_forest"] _xp:quick_travel_1

# cancel if in area
title @initiator[tag="in_echoing_forest"] title _xp:npc:farlander:2:31003
execute as @initiator[tag="in_echoing_forest"] run function farlander/quick_travel/ui/reset_biome_checks

execute as @initiator[tag="in_echoing_forest"] run scoreboard players reset @initiator gvar