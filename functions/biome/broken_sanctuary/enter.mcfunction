# fog @s push ... ...
fog @s remove dragon_fog
# tellraw @s[tag="dev"] {"rawtext":[{"text":"§abroken sanctuary"}]}
tag @s add in_broken_sanctuary

execute if score entered sanctuary matches 0 run function broken_sanctuary/first_time_enter
execute if score active sanctuary matches 0 run function broken_sanctuary/activate

function achievements/goals/100

event entity @s xp:player_aurora_additive