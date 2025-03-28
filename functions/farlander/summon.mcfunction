tag @s add self

execute as @e[type=xp:farlander,r=18] at @s run tag @p[tag=self] add farlanderNear
execute at @s positioned ^^1^4 run execute if block ~ ~-1 ~ air run execute if block ~ ~-2 ~ air run tag @s add fallArea
execute at @s in the_end unless entity @s[r=2] run tag @s add not_in_end
tag @s[x=300,y=222,z=-549,dx=24,dy=24,dz=24] add in_arena
tag @s[x=-166,y=182,z=2082,r=72] add in_arena

titleraw @s[tag=farlanderNear] actionbar {"rawtext":[{"translate":"xp.farlander.summon.nearby"}]}
playsound entity.farlander.trade @s[tag=farlanderNear]

titleraw @s[tag=!farlanderNear,tag=fallArea] actionbar {"rawtext":[{"translate":"xp.farlander.summon.fall"}]}
playsound entity.farlander.trade @s[tag=!farlanderNear,tag=fallArea]

titleraw @s[tag=in_arena] actionbar {"rawtext":[{"translate":"xp.farlander.summon.arena"}]}
playsound entity.farlander.trade @s[tag=in_arena]

titleraw @s[tag=not_in_end] actionbar {"rawtext":[{"translate":"xp.farlander.summon.dimension"}]}
playsound entity.farlander.trade @s[tag=not_in_end]

execute as @s[tag=!farlanderNear,tag=!fallArea,tag=!not_in_end,tag=!in_arena] at @s run function farlander/checkarea

tag @s remove farlanderNear
tag @s remove fallArea
tag @s remove not_in_end
tag @s remove in_arena
tag @s remove self