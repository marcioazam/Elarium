gamerule sendcommandfeedback false
gamerule showtags false

# enter showcase mode
tag @s add dev
gamemode c @s
tag @s add showcase_mode
event entity @s xp:in_showcase_mode
playsound random.levelup @s ~~~ 1.0 2.0

# clear inventory
clear @s

gamerule sendcommandfeedback true