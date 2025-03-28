
# ensure player is in survival
gamemode s @initiator

# reset tags
tag @initiator remove was_in_survival
tag @s remove was_in_survival
tag @initiator remove dialogue_quest
tag @s remove dialogue_quest
tag @initiator remove dialogue_basic
tag @s remove dialogue_basic

tag @initiator remove interacted
tag @s remove interacted
tag @initiator remove busy
tag @s remove busy

# restore HUD
title @s title _xp_clear_
title @initiator title _xp_clear_

# remove busy flag
scoreboard players remove @s[family=farlander,scores={interactCount=1..}] interactCount 1
tag @s[family=farlander,scores={interactCount=0}] remove busy

# objectives handler
execute as @initiator at @s run function objectives/01
execute as @s[family=player] at @s run function objectives/01

# restore camera control access once closed
inputpermission set @initiator camera enabled
inputpermission set @s camera enabled
