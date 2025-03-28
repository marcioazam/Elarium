# remove quest tag
tag @initiator remove dialogue_quest

# accept quest
scoreboard players set @initiator dialogueId 01300
event entity @s xp:transform_to_original

# reset dialogue quest stuff (fail-safe)
function farlander/ui/close