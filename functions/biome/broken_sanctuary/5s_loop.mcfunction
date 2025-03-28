# This function runs once every 5s if there is a player in Broken Sanctuary
# Called in animation.player.broken_sanctuary_mob_spawning

particle xp:sanctuary_fog 416 75 810
particle xp:sanctuary_fog 416 100 872
particle xp:sanctuary_fog 416 120 872
particle xp:sanctuary_fog 360 100 872
particle xp:sanctuary_fog 425 100 872
particle xp:sanctuary_fog 400 100 986

particle xp:sanctuary_ambient_lightrays.1 400 90 872
particle xp:sanctuary_ambient_lightrays.1 410 110 872
particle xp:sanctuary_ambient_lightrays.1 420 135 872
# particle xp:sanctuary_ambient_lightrays.2 397 100 875
# particle xp:sanctuary_ambient_lightrays.3 426 140 883
particle xp:sanctuary_ambient_lightrays.4 450 90 884
particle xp:sanctuary_ambient_lightrays.4 440 110 884
particle xp:sanctuary_ambient_lightrays.4 430 135 884

particle xp:sanctuary_ambient_lightrays.1 420 40 872
particle xp:sanctuary_ambient_lightrays.4 430 40 884

particle xp:sanctuary_aurora 421 20 870

particle xp:sanctuary_flat_aurora 210 -30 850
particle xp:sanctuary_flat_aurora 410 -30 750
particle xp:sanctuary_flat_aurora 610 -30 850

particle xp:sanctuary_tower_fog 417 53 873
particle xp:sanctuary_tower_dots 417 53 873
particle xp:sanctuary_tower_fog 576 83 858
particle xp:sanctuary_tower_dots 576 83 858
particle xp:sanctuary_tower_fog 259 83 860
particle xp:sanctuary_tower_dots 259 83 860
particle xp:sanctuary_tower_fog 405 83 1029
particle xp:sanctuary_tower_dots 405 83 1029

execute at @r[scores={currentBiome=5..7}] run particle xp:sanctuary_fog_far ~ ~ ~
execute at @r[scores={currentBiome=5..7}] run particle xp:sanctuary_wisps ~ ~ ~