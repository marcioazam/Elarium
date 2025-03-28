execute if score direction endboss matches 0 rotated 0 0 run summon xp:heart_of_ender_treasure ^ ^ ^8
execute if score direction endboss matches 1 rotated 45 0 run summon xp:heart_of_ender_treasure ^ ^ ^8
execute if score direction endboss matches 2 rotated 90 0 run summon xp:heart_of_ender_treasure ^ ^ ^8
execute if score direction endboss matches 3 rotated 135 0 run summon xp:heart_of_ender_treasure ^ ^ ^8
execute if score direction endboss matches 4 rotated 180 0 run summon xp:heart_of_ender_treasure ^ ^ ^8
execute if score direction endboss matches 5 rotated 225 0 run summon xp:heart_of_ender_treasure ^ ^ ^8
execute if score direction endboss matches 6 rotated 270 0 run summon xp:heart_of_ender_treasure ^ ^ ^8
execute if score direction endboss matches 7 rotated 315 0 run summon xp:heart_of_ender_treasure ^ ^ ^8

execute if score direction endboss matches 0 rotated 0 0 run loot spawn ^ ^ ^8 loot "entity/endboss/head.loot"
execute if score direction endboss matches 1 rotated 45 0 run loot spawn ^ ^ ^8 loot "entity/endboss/head.loot"
execute if score direction endboss matches 2 rotated 90 0 run loot spawn ^ ^ ^8 loot "entity/endboss/head.loot"
execute if score direction endboss matches 3 rotated 135 0 run loot spawn ^ ^ ^8 loot "entity/endboss/head.loot"
execute if score direction endboss matches 4 rotated 180 0 run loot spawn ^ ^ ^8 loot "entity/endboss/head.loot"
execute if score direction endboss matches 5 rotated 225 0 run loot spawn ^ ^ ^8 loot "entity/endboss/head.loot"
execute if score direction endboss matches 6 rotated 270 0 run loot spawn ^ ^ ^8 loot "entity/endboss/head.loot"
execute if score direction endboss matches 7 rotated 315 0 run loot spawn ^ ^ ^8 loot "entity/endboss/head.loot"

playsound ender_boss.victory_long @a -166 182 2060 10 1 1
playsound xp_intro_jinggle @a[x=-166,y=182,z=2082,r=64]

execute positioned ~ 223 ~ rotated 0 0 run summon xp_bottle ^ ^ ^8
execute positioned ~ 223 ~ rotated 45 0 run summon xp_bottle ^ ^ ^8
execute positioned ~ 223 ~ rotated 97 0 run summon xp_bottle ^ ^ ^8
execute positioned ~ 223 ~ rotated 135 0 run summon xp_bottle ^ ^ ^8
execute positioned ~ 223 ~ rotated 180 0 run summon xp_bottle ^ ^ ^8
execute positioned ~ 223 ~ rotated 225 0 run summon xp_bottle ^ ^ ^8
execute positioned ~ 223 ~ rotated 270 0 run summon xp_bottle ^ ^ ^8
execute positioned ~ 223 ~ rotated 315 0 run summon xp_bottle ^ ^ ^8

execute positioned ~ ~110 ~ at @e[type=xp_bottle,r=100] run summon xp_bottle ~.3 ~ ~.3
execute positioned ~ ~110 ~ at @e[type=xp_bottle,r=100] run summon xp_bottle ~-.3 ~ ~-.3
execute positioned ~ ~110 ~ at @e[type=xp_bottle,r=100] run summon xp_bottle ~-.3 ~ ~.3
execute positioned ~ ~110 ~ at @e[type=xp_bottle,r=100] run summon xp_bottle ~.3 ~ ~-.3

fill -157 220 2051 -175 220 2068 barrier

execute positioned ~ ~20 ~ rotated 0 0 run loot spawn ^ ^ ^16 loot "entity/end_chestloot/end_chestloot_good.loot_table"
execute positioned ~ ~20 ~ rotated 45 0 run loot spawn ^ ^ ^16 loot "entity/end_chestloot/end_chestloot_good.loot_table"
execute positioned ~ ~20 ~ rotated 90 0 run loot spawn ^ ^ ^16 loot "entity/end_chestloot/end_chestloot_good.loot_table"
execute positioned ~ ~20 ~ rotated 135 0 run loot spawn ^ ^ ^16 loot "entity/end_chestloot/end_chestloot_good.loot_table"
execute positioned ~ ~20 ~ rotated 180 0 run loot spawn ^ ^ ^16 loot "entity/end_chestloot/end_chestloot_good.loot_table"
execute positioned ~ ~20 ~ rotated 225 0 run loot spawn ^ ^ ^16 loot "entity/end_chestloot/end_chestloot_good.loot_table"
execute positioned ~ ~20 ~ rotated 270 0 run loot spawn ^ ^ ^16 loot "entity/end_chestloot/end_chestloot_good.loot_table"
execute positioned ~ ~20 ~ rotated 315 0 run loot spawn ^ ^ ^16 loot "entity/end_chestloot/end_chestloot_good.loot_table"