# set menu state new open
scoreboard players set @initiator uiSceneState 0

# set quick travel location
scoreboard players set @initiator[tag=!"in_ender_riftlands"] gvar 4

# open up associated quick travel menu
dialogue open @s @initiator[tag=!"in_ender_riftlands"] _xp:quick_travel_4

# cancel if in area
title @initiator[tag="in_ender_riftlands"] title _xp:npc:farlander:2:31003
execute as @initiator[tag="in_ender_riftlands"] run function farlander/quick_travel/ui/reset_biome_checks

execute as @initiator[tag="in_ender_riftlands"] run scoreboard players reset @initiator gvar