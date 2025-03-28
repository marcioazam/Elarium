# set menu state new open
scoreboard players set @initiator uiSceneState 0

# set quick travel location
scoreboard players set @initiator[tag=!"in_ender_wilds"] gvar 0

# open up associated quick travel menu
dialogue open @s @initiator[tag=!"in_ender_wilds"] _xp:quick_travel_0

# cancel if in area
title @initiator[tag="in_ender_wilds"] title _xp:npc:farlander:2:31003
execute as @initiator[tag="in_ender_wilds"] run function farlander/quick_travel/ui/reset_biome_checks

execute as @initiator[tag="in_ender_wilds"] run scoreboard players reset @initiator gvar