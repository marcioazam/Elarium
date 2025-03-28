# This function runs every second for every player in broken sanctuary

scoreboard players random chance math 0 99
execute if score chance math matches 0..4 as @r at @s positioned 416 ~ 872 at @s[rm=40,r=120] run function biome/broken_sanctuary/summon_meteor

# execute if score chance math matches 0..2 run particle xp:broken_sanctuary_lightrays 360 90 872
# execute if score chance math matches 3..5 run particle xp:broken_sanctuary_lightrays 380 110 872
# execute if score chance math matches 6..8 run particle xp:broken_sanctuary_lightrays 400 135 872
# execute if score chance math matches 9..11 run particle xp:broken_sanctuary_lightrays2 397 100 875
# execute if score chance math matches 12..15 run particle xp:broken_sanctuary_lightrays3 426 140 883
# execute if score chance math matches 16..18 run particle xp:broken_sanctuary_lightrays4 420 120 884



# execute if score chance math matches 0..1 run particle xp:broken_sanctuary_cutscene_fog.1 416 75 810
# execute if score chance math matches 1..2 run particle xp:broken_sanctuary_cutscene_fog.1 416 100 872
# execute if score chance math matches 2..3 run particle xp:broken_sanctuary_cutscene_fog.1 416 120 872
# execute if score chance math matches 4..5 run particle xp:broken_sanctuary_cutscene_fog.1 360 100 872
# execute if score chance math matches 6..7 run particle xp:broken_sanctuary_cutscene_fog.1 425 100 872
# execute if score chance math matches 8..9 run particle xp:broken_sanctuary_cutscene_fog.1 400 100 986

# execute if score chance math matches 0..50 run particle xp:sanctuary_fog ~ ~ ~
# execute if score chance math matches 51..99 run particle xp:sanctuary_fog_far ~ ~ ~
execute if score chance math matches 51..99 run particle xp:sanctuary_light_lines ~ ~ ~
execute if score chance math matches 0..99 run particle xp:sanctuary_light_lines_far ~ ~ ~

# execute if score chance math matches 0..50 run particle xp:sanctuary_rays 400 50 793
# execute if score chance math matches 0..30 run particle xp:sanctuary_rays 407 34 760
# execute if score chance math matches 51..80 run particle xp:sanctuary_rays 407 34 745
# execute if score chance math matches 0..30 run particle xp:sanctuary_rays 407 34 730
# execute if score chance math matches 51..80 run particle xp:sanctuary_rays 407 34 715
# execute if score chance math matches 0..30 run particle xp:sanctuary_rays 407 34 700
# execute if score chance math matches 51..80 run particle xp:sanctuary_rays 407 34 685
# execute if score chance math matches 0..30 run particle xp:sanctuary_rays 407 34 675
# execute if score chance math matches 51..80 run particle xp:sanctuary_rays 407 34 660
# execute if score chance math matches 0..30 run particle xp:sanctuary_rays 407 34 645
# execute if score chance math matches 51..80 run particle xp:sanctuary_rays 407 34 635
# execute if score chance math matches 0..30 run particle xp:sanctuary_rays 407 34 615
# execute if score chance math matches 51..80 run particle xp:sanctuary_rays 407 34 600
# execute if score chance math matches 0..30 run particle xp:sanctuary_rays 407 34 590
# execute if score chance math matches 51..80 run particle xp:sanctuary_rays 407 34 580
# execute if score chance math matches 0..30 run particle xp:sanctuary_rays 407 34 565
# execute if score chance math matches 51..80 run particle xp:sanctuary_rays 407 34 550