# Setup Scoreboards
scoreboard objectives add wardersEnchant dummy
scoreboard objectives add wardersChance dummy
scoreboard objectives add achievementsId dummy

## Spawn
execute in overworld run fill -1353 3 -1413 -1355 5 -1411 air
time set day
structure load end_portal.frame -1356 4 -1414

## Ticking Area
execute in overworld run tickingarea add -1354 -1 -1412 -1354 -1 -1412 end_portal true

## Reset Entities
kill @e[type=item]

event entity @e[type=xp:game_manager.spawn] xp:despawn
execute in overworld run execute rotated 0 0 run summon xp:game_manager.spawn -1354 -2 -1412
tag @e[type=xp:game_manager.spawn] add first_run

event entity @e[type=xp:spawn_rays] xp:despawn
execute in overworld run execute rotated 0 0 run summon xp:spawn_rays -1372 59 -1429

event entity @e[type=xp:end_portal_frame] xp:despawn
event entity @e[type=xp:end_portal_glow] xp:despawn
event entity @e[type=xp:eyes_glow] xp:despawn

## Player
event entity @a xp:cutscene.clear
title @a title xp_hide_effects_
tag @a remove in_cutscene
tag @a add new_player
tag @a add first_tp
fog @a push xp:spawn_area_fog spawn_fog

execute in overworld run tp @a -1354 5 -1384 facing -1354 3 -1400

effect @a instant_health 5 255 true
effect @a saturation 100 100 true
effect @a clear
clear @a
gamemode s @a
gamerule showtags false
stopsound @a

inputpermission set @a camera enabled
inputpermission set @a movement enabled

scoreboard players reset *

## Reset End Boss Arena
execute in the_end run structure load boss_island.1 -211 167 65
execute in the_end run structure load boss_island.2 -172 171 9
execute in the_end run structure load boss_island.3 -137 176 25
execute in the_end run structure load boss_island.4 -131 169 65
execute in the_end run structure load boss_island.5 -133 231 78
execute in the_end run structure load boss_island.6 -147 163 88
execute in the_end run structure load boss_island.7 -183 178 105
execute in the_end run structure load boss_island.8 -207 171 81
execute in the_end run structure load boss_island.9 -217 216 36

## Run other reset functions
execute as @s in the_end run function conduit/setup
execute as @s in the_end run function mimic/setup
execute as @s in the_end run function end_cube/setup
execute as @s in the_end run function achievements/reset
execute as @s in the_end run function ui/setup
function endboss/setup
function objectives/reset
function waypoint/0

## Return feedback to dev
tag @a[name="r4isen1920"] add dev
tag @a[name="aShadyDan"] add dev
tag @a[name="Maxaxik"] add dev

playsound random.orb @s