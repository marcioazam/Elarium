# set menu state new open
scoreboard players set @initiator uiSceneState 0

# set quick travel location
scoreboard players set @initiator[tag=!"in_ender_abyss"] gvar 3

# open up associated quick travel menu
dialogue open @s @initiator[tag=!"in_ender_abyss"] _xp:quick_travel_3

# cancel if in area
title @initiator[tag="in_ender_abyss"] title _xp:npc:farlander:2:31003
execute as @initiator[tag="in_ender_abyss"] run function farlander/quick_travel/ui/reset_biome_checks

execute as @initiator[tag="in_ender_abyss"] run scoreboard players reset @initiator gvar