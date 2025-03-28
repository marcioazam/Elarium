
# force endboss to halt attacks if made steady
# set the attack index to something unassigned

scoreboard players add forced_attack endboss 0
execute if entity @s[tag="sticky"] run scoreboard players set forced_attack endboss 100

# pick slam attack or splatter, but don't pick splatter if it was the last attack

scoreboard players random chance endboss 0 8
execute if score can_beam_attack endboss matches 1 run scoreboard players random chance endboss 0 10

# if the boss doesn't need to turn then only roll attacks
scoreboard players set players_in_front endboss 0

execute if score direction endboss matches 0 rotated 0 0 positioned ^ ^ ^10 if entity @a[r=10] run scoreboard players set players_in_front endboss 1
execute if score direction endboss matches 1 rotated 45 0 positioned ^ ^ ^10 if entity @a[r=10] run scoreboard players set players_in_front endboss 1
execute if score direction endboss matches 2 rotated 90 0 positioned ^ ^ ^10 if entity @a[r=10] run scoreboard players set players_in_front endboss 1
execute if score direction endboss matches 3 rotated 135 0 positioned ^ ^ ^10 if entity @a[r=10] run scoreboard players set players_in_front endboss 1
execute if score direction endboss matches 4 rotated 180 0 positioned ^ ^ ^10 if entity @a[r=10] run scoreboard players set players_in_front endboss 1
execute if score direction endboss matches 5 rotated 225 0 positioned ^ ^ ^10 if entity @a[r=10] run scoreboard players set players_in_front endboss 1
execute if score direction endboss matches 6 rotated 270 0 positioned ^ ^ ^10 if entity @a[r=10] run scoreboard players set players_in_front endboss 1
execute if score direction endboss matches 7 rotated 315 0 positioned ^ ^ ^10 if entity @a[r=10] run scoreboard players set players_in_front endboss 1

execute if score players_in_front endboss matches 1.. run scoreboard players random chance endboss 0 3

# if boss can beam attack, then let a part of attacks be the beam attack
execute if score can_beam_attack endboss matches 1 run scoreboard players random second_chance endboss 0 3
execute if score second_chance endboss matches 1 run scoreboard players set chance endboss 9


# if last attack was splatter, roll another attack
execute if entity @s[tag=last_attack_was_splatter] run scoreboard players random chance endboss 1 8
execute if entity @s[tag=last_attack_was_splatter] if score can_beam_attack endboss matches 1 run scoreboard players random chance endboss 1 10

# if slam attack is picked but there is no player in slam attack range, execute splatter attack instead
execute unless entity @p[r=14] if score chance endboss matches 1..2 run scoreboard players set chance endboss 0

# scoreboard players set chance endboss 9
# scoreboard players random chance endboss 1 6

execute if score forced_attack endboss matches 1.. run scoreboard players operation chance endboss = forced_attack endboss
execute if score forced_attack endboss matches 1.. run scoreboard players remove chance endboss 1

execute if score chance endboss matches 0 run event entity @s xp:attack_state_splatter
execute if score chance endboss matches 1..2 run event entity @s xp:attack_state_slam
execute if score chance endboss matches 3..4 run event entity @s xp:attack_state_summon_units
execute if score chance endboss matches 5..8 run event entity @s xp:attack_state_turn
execute if score chance endboss matches 9..10 run event entity @s xp:attack_state_beam

scoreboard players set forced_attack endboss 0

tag @s remove last_attack_was_splatter