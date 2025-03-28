tag @s remove overworld
tag @s remove nether
tag @s remove the_end
execute in overworld if entity @s[r=1] run tag @s add overworld
execute in nether if entity @s[r=1] run tag @s add nether
execute in the_end if entity @s[r=1] run tag @s add the_end