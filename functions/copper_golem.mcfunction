#go fuck yourself if you want to steal this code
#go fuck yourself if you want to steal this code
#go fuck yourself if you want to steal this code
#go fuck yourself if you want to steal this code
#go fuck yourself if you want to steal this code
#go fuck yourself if you want to steal this code
#go fuck yourself if you want to steal this code
#go fuck yourself if you want to steal this code
#go fuck yourself if you want to steal this code
#go fuck yourself if you want to steal this code
#go fuck yourself if you want to steal this code
#go fuck yourself if you want to steal this code
#Enedyx isn't very friendly when you steal his code grrrrr "hungry stomach noises..."


#walk

execute as @e[family=copper_golem,tag=!reverse,tag=!stop] at @s if block ^^-0.005^-0.40 edx:charged_copper_south if block ^^0.1^0.4 air run tp ^^^0.05 facing ~~~10
execute as @e[family=copper_golem,tag=!reverse,tag=!stop] at @s if block ^^-0.005^-0.40 edx:charged_copper_north if block ^^0.1^0.4 air run tp ^^^0.05 facing ~~~-10
execute as @e[family=copper_golem,tag=!reverse,tag=!stop] at @s if block ^^-0.005^-0.40 edx:charged_copper_east if block ^^0.1^0.4 air run tp ^^^0.05 facing ~10~~
execute as @e[family=copper_golem,tag=!reverse,tag=!stop] at @s if block ^^-0.005^-0.40 edx:charged_copper_west if block ^^0.1^0.4 air run tp ^^^0.05 facing ~-10~~
execute as @e[family=copper_golem,tag=!stop] at @s if block ^^-0.005^-0.40 edx:charged_copper_down if block ^^0.1^0.4 air unless block ^^-0.2^-0.15 air run tp ^^^0.05
execute as @e[family=copper_golem,tag=!stop] at @s if block ^^-0.005^-0.40 edx:charged_copper_up if block ^^0.1^0.4 air unless block ^^-0.2^-0.15 air run tp ^^^0.05 

execute as @e[family=copper_golem,tag=!stop] at @s if block ^^-0.005^-0.40 edx:charged_copper_reverser if block ^^0.1^0.4 air run tp ^^^0.05 
execute as @e[family=copper_golem,tag=!stop] at @s if block ^^-0.005^-0.40 edx:charged_copper_yellow_detector_on if block ^^0.1^0.4 air run tp ^^^0.05 
execute as @e[family=copper_golem,tag=!stop] at @s if block ^^-0.005^-0.40 edx:charged_copper_blue_detector_on if block ^^0.1^0.4 air run tp ^^^0.05 
execute as @e[family=copper_golem,tag=!stop] at @s if block ^^-0.005^-0.40 edx:charged_copper_red_detector_on if block ^^0.1^0.4 air run tp ^^^0.05 
execute as @e[family=copper_golem,tag=!stop] at @s if block ^^-0.005^-0.40 edx:charged_copper_green_detector_on if block ^^0.1^0.4 air run tp ^^^0.05 
execute as @e[family=copper_golem,tag=!stop] at @s if block ^^-0.005^-0.40 edx:charged_copper_yellow_painter if block ^^0.1^0.4 air run tp ^^^0.05 
execute as @e[family=copper_golem,tag=!stop] at @s if block ^^-0.005^-0.40 edx:charged_copper_blue_painter if block ^^0.1^0.4 air run tp ^^^0.05 
execute as @e[family=copper_golem,tag=!stop] at @s if block ^^-0.005^-0.40 edx:charged_copper_red_painter if block ^^0.1^0.4 air run tp ^^^0.05 
execute as @e[family=copper_golem,tag=!stop] at @s if block ^^-0.005^-0.40 edx:charged_copper_green_painter if block ^^0.1^0.4 air run tp ^^^0.05 

#walk reverse

execute as @e[family=copper_golem,tag=reverse,tag=!stop] at @s if block ^^-0.005^-0.40 edx:charged_copper_south if block ^^0.1^0.4 air run tp ^^^0.05 facing ~~~-10
execute as @e[family=copper_golem,tag=reverse,tag=!stop] at @s if block ^^-0.005^-0.40 edx:charged_copper_north if block ^^0.1^0.4 air run tp ^^^0.05 facing ~~~10
execute as @e[family=copper_golem,tag=reverse,tag=!stop] at @s if block ^^-0.005^-0.40 edx:charged_copper_east if block ^^0.1^0.4 air run tp ^^^0.05 facing ~-10~~
execute as @e[family=copper_golem,tag=reverse,tag=!stop] at @s if block ^^-0.005^-0.40 edx:charged_copper_west if block ^^0.1^0.4 air run tp ^^^0.05 facing ~10~~


#detector

execute as @e[family=copper_golem] at @s if block ^^-0.005^-0.40 edx:charged_copper_blue_painter run function copper_blue_painter
execute as @e[family=copper_golem] at @s if block ^^-0.005^-0.40 edx:charged_copper_yellow_painter run function copper_yellow_painter
execute as @e[family=copper_golem] at @s if block ^^-0.005^-0.40 edx:charged_copper_green_painter run function copper_green_painter
execute as @e[family=copper_golem] at @s if block ^^-0.005^-0.40 edx:charged_copper_red_painter run function copper_red_painter

execute as @e[family=copper_golem,tag=!yellow] at @s if block ^^-0.005^-0.40 edx:charged_copper_yellow_detector_off run kill @s
execute as @e[family=copper_golem,tag=!red] at @s if block ^^-0.005^-0.40 edx:charged_copper_red_detector_off run kill @s
execute as @e[family=copper_golem,tag=!blue] at @s if block ^^-0.005^-0.40 edx:charged_copper_blue_detector_off run kill @s
execute as @e[family=copper_golem,tag=!green] at @s if block ^^-0.005^-0.40 edx:charged_copper_green_detector_off run kill @s

execute as @e[family=copper_golem,tag=yellow] at @s if block ^^-0.005^-0.40 edx:charged_copper_yellow_detector_off run setblock ^^-0.005^-0.40 edx:charged_copper_yellow_detector_on
execute as @e[family=copper_golem,tag=red] at @s if block ^^-0.005^-0.40 edx:charged_copper_red_detector_off run setblock ^^-0.005^-0.40 edx:charged_copper_red_detector_on
execute as @e[family=copper_golem,tag=blue] at @s if block ^^-0.005^-0.40 edx:charged_copper_blue_detector_off run setblock ^^-0.005^-0.40 edx:charged_copper_blue_detector_on
execute as @e[family=copper_golem,tag=green] at @s if block ^^-0.005^-0.40 edx:charged_copper_green_detector_off run setblock ^^-0.005^-0.40 edx:charged_copper_green_detector_on

execute as @e[family=copper_golem,tag=yellow] at @s if block ^^-0.005^-0.40 edx:charged_copper_yellow_detector_on run tag @e[type=edx:copper_golem] remove yellow
execute as @e[family=copper_golem,tag=red] at @s if block ^^-0.005^-0.40 edx:charged_copper_red_detector_on run tag @e[type=edx:copper_golem] remove red
execute as @e[family=copper_golem,tag=blue] at @s if block ^^-0.005^-0.40 edx:charged_copper_blue_detector_on run tag @e[type=edx:copper_golem] remove blue
execute as @e[family=copper_golem,tag=green] at @s if block ^^-0.005^-0.40 edx:charged_copper_green_detector_on run tag @e[type=edx:copper_golem] remove green

#headache don't touch it i don't even know how it works

execute as @e[family=copper_golem,tag=!already] at @s if block ^^-0.005^-0.4 edx:charged_copper_reverser run tp @s ~~~ facing ^^^-10
execute as @e[family=copper_golem,tag=!reverse] at @s if block ^^-0.005^-0.4 edx:charged_copper_reverser run tag @s add reversed
execute as @e[family=copper_golem,tag=!already,tag=!reverse] at @s if block ^^-0.005^-0.4 edx:charged_copper_reverser run tag @s add already
execute as @e[family=copper_golem,tag=reverse] at @s if block ^^-0.005^-0.4 edx:charged_copper_reverser run tag @s add unreversed
execute as @e[family=copper_golem,tag=reverse,tag=!already] at @s if block ^^-0.005^-0.4 edx:charged_copper_reverser run tag @s add already
execute as @e[family=copper_golem,tag=unreversed,tag=already] at @s unless block ^^-0.005^-0.4 edx:charged_copper_reverser run tag @s remove reverse
execute as @e[family=copper_golem,tag=reversed,tag=already] at @s unless block ^^-0.005^-0.4 edx:charged_copper_reverser run tag @s add reverse
execute as @e[family=copper_golem,tag=already] at @s unless block ^^-0.005^-0.4 edx:charged_copper_reverser run tag @s remove already
execute as @e[family=copper_golem,tag=reversed] at @s unless block ^^-0.005^-0.4 edx:charged_copper_reverser run tag @s remove reversed
execute as @e[family=copper_golem,tag=unreversed] at @s unless block ^^-0.005^-0.4 edx:charged_copper_reverser run tag @s remove unreversed

#other events

execute as @e[family=copper_golem,tag=!reverse] at @s if block ^^^0.45 edx:charged_copper_up run event entity @s climb_up
execute as @e[family=copper_golem,tag=reverse] at @s if block ^^^0.45 edx:charged_copper_down run event entity @s climb_up
execute as @e[family=copper_golem,tag=!reverse] at @s if block ^^^-0.45 edx:charged_copper_down run event entity @s climb_down
execute as @e[family=copper_golem,tag=reverse] at @s if block ^^^-0.45 edx:charged_copper_up run event entity @s climb_down

#climb down

execute as @e[family=copper_golem,tag=!reverse,tag=!stop] at @s if block ^^-0.005^-0.45 edx:charged_copper_down if block ^^-0.3^-0.1 air run tp ~~-0.05~
execute as @e[family=copper_golem,tag=reverse,tag=!stop] at @s if block ^^-0.005^-0.45 edx:charged_copper_up if block ^^-0.3^-0.1 air run tp ~~-0.05~

#climb up 

execute as @e[family=copper_golem,tag=!reverse,tag=!stop] at @s if block ^^^0.41 edx:charged_copper_up if block ^^1.4^0.1 air run tp ~~0.05~
execute as @e[family=copper_golem,tag=!reverse,tag=!stop] at @s if block ^^-0.005^0.43 edx:charged_copper_up if block ^^0.1^0.4 air if block ^^-0.2^-0.41 air run tp ^^^0.05
execute as @e[family=copper_golem,tag=reverse,tag=!stop] at @s if block ^^^0.41 edx:charged_copper_down if block ^^1.4^0.1 air  run tp ~~0.05~
execute as @e[family=copper_golem,tag=reverse,tag=!stop] at @s if block ^^-0.005^0.43 edx:charged_copper_down if block ^^0.1^0.4 air if block ^^-0.2^-0.41 air run tp ^^^0.05

execute as @e[family=copper_golem,tag=!reverse,tag=!stop] at @s if block ^^-0.001^ edx:charged_copper_up run tp ~~0.05~
execute as @e[family=copper_golem,tag=reverse,tag=!stop] at @s if block ^^-0.001^ edx:charged_copper_down run tp ~~0.05~

#oxidise

scoreboard players add @e[type=edx:copper_golem] oxidise 1
event entity @e[type=edx:copper_golem,scores={oxidise=300}] stage2
event entity @e[type=edx:copper_golem,scores={oxidise=600}] stage3
event entity @e[type=edx:copper_golem,scores={oxidise=900}] stage4
kill @e[type=edx:copper_golem,scores={oxidise=1200..}]

#eyes

playanimation @e[family=copper_golem,tag=yellow] animation.copper_golem.yellow
playanimation @e[family=copper_golem,tag=red] animation.copper_golem.red
playanimation @e[family=copper_golem,tag=blue] animation.copper_golem.blue
playanimation @e[family=copper_golem,tag=green] animation.copper_golem.green

#supercharged

execute as @e[family=copper_golem] at @s if block ^^-0.005^-0.40 edx:supercharged_copper run kill @s

