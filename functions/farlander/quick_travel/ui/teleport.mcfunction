# set menu state new open
scoreboard players set @initiator uiSceneState 0

# open up associated quick travel teleport menu
dialogue open @s @a[scores={gvar=0},tag=dialogue_quick_travel,r=8] _xp:quick_travel_0_teleport
dialogue open @s @a[scores={gvar=1},tag=dialogue_quick_travel,r=8] _xp:quick_travel_1_teleport
dialogue open @s @a[scores={gvar=2},tag=dialogue_quick_travel,r=8] _xp:quick_travel_2_teleport
dialogue open @s @a[scores={gvar=3},tag=dialogue_quick_travel,r=8] _xp:quick_travel_3_teleport
dialogue open @s @a[scores={gvar=4},tag=dialogue_quick_travel,r=8] _xp:quick_travel_4_teleport
dialogue open @s @a[scores={gvar=5},tag=dialogue_quick_travel,r=8] _xp:quick_travel_5_teleport

# teleport
tag @a[scores={gvar=0},r=8,tag=dialogue_quick_travel] add to_ender_wilds
tag @a[scores={gvar=1},r=8,tag=dialogue_quick_travel] add to_echoing_forest
tag @a[scores={gvar=2},r=8,tag=dialogue_quick_travel] add to_ender_arena
tag @a[scores={gvar=3},r=8,tag=dialogue_quick_travel] add to_ender_abyss
tag @a[scores={gvar=4},r=8,tag=dialogue_quick_travel] add to_riftlands
tag @a[scores={gvar=5},r=8,tag=dialogue_quick_travel] add to_broken_sanctuary