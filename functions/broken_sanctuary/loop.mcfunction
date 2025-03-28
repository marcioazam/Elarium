# run from tick.json if score active sanctuary == 1

# Display tower particles
# east

# south
# particle xp:beacon_cutscene.objective.3_2 390 197 872
# west
# particle xp:beacon_cutscene.objective.3_3 416 197 898

# particle xp:beacon_cutscene.objective.7_2 390 197 872
# particle xp:beacon_cutscene.objective.7_3 416 197 898





# Display objective on actionbar
# titleraw @a actionbar {"rawtext":[{"text":"Towers Activated: "},{"score":{"name":"towers_activated","objective":"sanctuary"}},{"text":"/3"}]}

# Deactivate objective if there are no players in the biome
# execute if entity @p is used so that this check only happens once the player is loaded into the world
# otherwise the objective can get deactivated as no player is loaded and the check would go through
execute if entity @p unless entity @a[scores={currentBiome=5..7}] run function broken_sanctuary/deactivate

execute if score east_tower sanctuary matches 6 run function broken_sanctuary/lasers_hurt/east_tower
execute if score south_tower sanctuary matches 6 run function broken_sanctuary/lasers_hurt/south_tower
execute if score west_tower sanctuary matches 6 run function broken_sanctuary/lasers_hurt/west_tower
execute if score portal_activated sanctuary matches 1 run effect @a[x=410,y=194,z=866,dx=12,dy=60,dz=12] levitation 1 2 true

# if a player enters the teleportation zone and boss is about to spawn, then run the cutscene
execute if score portal_activated sanctuary matches 1 if entity @a[x=406,y=215,z=862,dx=20,dy=60,dz=20] if score play_boss_cutscene endboss matches 1 unless entity @e[type=xp:broken_sanctuary_cutscene] run summon xp:broken_sanctuary_cutscene 416 194 872 
# if a player enters the teleportation zone and the boss is already spawned, then just tp them into the arena with some effects
execute if score portal_activated sanctuary matches 1 if score play_boss_cutscene endboss matches 0 unless entity @e[type=xp:broken_sanctuary_cutscene] as @a[x=406,y=230,z=862,dx=20,dy=60,dz=20] run function endboss/tp_player_to_arena

# Remove objective particles on towers that have been completed
scoreboard players add east_tower sanctuary 0
scoreboard players add south_tower sanctuary 0
scoreboard players add west_tower sanctuary 0
execute unless score east_tower sanctuary matches 0 run event entity @e[type=xp:waypoint,x=570,y=200,z=872,c=1] xp:remove_waypoint
execute unless score south_tower sanctuary matches 0 run event entity @e[type=xp:waypoint,x=416,y=200,z=1026,c=1] xp:remove_waypoint
execute unless score west_tower sanctuary matches 0 run event entity @e[type=xp:waypoint,x=262,y=200,z=872,c=1] xp:remove_waypoint