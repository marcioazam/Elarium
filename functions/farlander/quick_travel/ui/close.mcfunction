# remove tags from Farlander
event entity @e[family="farlander",c=1] xp:is_not_quick_travelling
tag @e[family="farlander",c=1] remove is_quick_travelling

# restore HUD
title @s title _xp_clear_
function farlander/ui/open_initial