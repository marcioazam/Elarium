scoreboard objectives add endboss dummy

scoreboard players set can_beam_attack endboss 0
scoreboard players set can_spawn_enderslugs endboss 0
scoreboard players set awaiting_last_hit endboss 0
scoreboard players set ongoing_battle endboss 0
scoreboard players set direction endboss 0
scoreboard players set play_boss_cutscene endboss 1

scoreboard players set portal_activated sanctuary 1
scoreboard players set east_tower sanctuary 6
scoreboard players set west_tower sanctuary 6
scoreboard players set south_tower sanctuary 6

execute in the_end run tp @a 416 194 862