# set menu state new open
scoreboard players set @initiator uiSceneState 0

# set quick travel location
scoreboard players set @initiator[tag=!"in_ender_abyss_inner"] gvar 2

# open up associated quick travel menu
dialogue open @s @initiator[tag=!"in_ender_abyss_inner"] _xp:quick_travel_2

# cancel if in area
title @initiator[tag="in_ender_abyss_inner"] title _xp:npc:farlander:2:31005
dialogue open @e[family=farlander,c=1] @initiator[tag="in_ender_abyss_inner"] _xp:quick_travel

execute as @initiator[tag="in_ender_abyss_inner"] run scoreboard players reset @initiator gvar