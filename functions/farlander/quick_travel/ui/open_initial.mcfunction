# check busy flag
tag @s[scores={interactCount=..1},c=1] remove busy
tag @s[scores={interactCount=2..},c=1] add busy
execute if entity @initiator[tag=!"interacted"] run scoreboard players add @s interactCount 1
tag @s add interacted

execute if entity @s[tag="busy"] run tag @initiator add busy
execute if entity @s[tag=!"busy"] run tag @initiator remove busy

# open ui
title @initiator[tag=!"busy"] title _xp:npc:farlander:2:31001
title @initiator[tag="busy"] title _xp:npc:farlander:1:31004
dialogue open @s[tag=!"busy"] @initiator _xp:quick_travel
dialogue open @s[tag="busy"] @initiator _xp:farlander_chat_3

# add tags
tag @initiator add dialogue_quick_travel

# add tags to Farlander
event entity @s xp:is_quick_travelling
tag @s add is_quick_travelling