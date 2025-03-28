

execute as @a[tag=bloody_totem_tag] at @s run effect @a[rm=0.01,r=6] strength 1 0 
execute as @a[tag=bloody_totem_tag] at @s run effect @a[rm=0.01,r=6] speed 1 0
execute as @a[tag=bloody_totem_tag] at @s run effect @a[rm=0.01,r=2] resistance 1 0
execute as @a[tag=bloody_totem_tag] at @s run effect @a[rm=0.01,r=2] regeneration 1 0
execute as @a[tag=bloody_totem_tag,tag=sneak] at @s run particle minecraft:redminecraft:stone_torch_dust_particle ~~1~6
execute as @a[tag=bloody_totem_tag,tag=sneak] at @s run particle minecraft:redminecraft:stone_torch_dust_particle ~~1~-6
execute as @a[tag=bloody_totem_tag,tag=sneak] at @s run particle minecraft:redminecraft:stone_torch_dust_particle ~6~1~
execute as @a[tag=bloody_totem_tag,tag=sneak] at @s run particle minecraft:redminecraft:stone_torch_dust_particle ~-6~1~
execute as @a[tag=bloody_totem_tag,tag=sneak] at @s run particle minecraft:redminecraft:stone_torch_dust_particle ~4~1~4
execute as @a[tag=bloody_totem_tag,tag=sneak] at @s run particle minecraft:redminecraft:stone_torch_dust_particle ~-4~1~-4
execute as @a[tag=bloody_totem_tag,tag=sneak] at @s run particle minecraft:redminecraft:stone_torch_dust_particle ~4~1~-4
execute as @a[tag=bloody_totem_tag,tag=sneak] at @s run particle minecraft:redminecraft:stone_torch_dust_particle ~-4~1~4
execute as @a[tag=bloody_totem_tag,tag=sneak] at @s run particle minecraft:redminecraft:stone_torch_dust_particle ~~1~2
execute as @a[tag=bloody_totem_tag,tag=sneak] at @s run particle minecraft:redminecraft:stone_torch_dust_particle ~~1~-2
execute as @a[tag=bloody_totem_tag,tag=sneak] at @s run particle minecraft:redminecraft:stone_torch_dust_particle ~2~1~
execute as @a[tag=bloody_totem_tag,tag=sneak] at @s run particle minecraft:redminecraft:stone_torch_dust_particle ~-2~1~
execute as @a[tag=bloody_totem_tag,tag=sneak] at @s run particle minecraft:redminecraft:stone_torch_dust_particle ~1.50~1~1.50
execute as @a[tag=bloody_totem_tag,tag=sneak] at @s run particle minecraft:redminecraft:stone_torch_dust_particle ~-1.50~1~-1.50
execute as @a[tag=bloody_totem_tag,tag=sneak] at @s run particle minecraft:redminecraft:stone_torch_dust_particle ~1.50~1~-1.50
execute as @a[tag=bloody_totem_tag,tag=sneak] at @s run particle minecraft:redminecraft:stone_torch_dust_particle ~-1.50~1~1.50





scoreboard players remove @a[scores={magic_axe=1..}] magic_axe 1
scoreboard players remove @a[scores={Bramble=1..}] Bramble 1
scoreboard players remove @a[scores={Sculk_portal=1..}] Sculk_portal 1
scoreboard players remove @a[scores={battle_cry=1..}] battle_cry 1
scoreboard players remove @a[scores={regen=1..}] regen 1 

scoreboard players set @a[tag=magic_axe,scores={player_health=..6,magic_axe=..0}] magic_axe 600
tag @a[tag=magic_axe,scores={player_health=..6,magic_axe=599},tag=!stopmagic_axe] add magic_axe_summon
tag @a[tag=magic_axe,scores={player_health=..6,magic_axe=200}] add stopmagic_axe
tag @a[tag=magic_axe,scores={player_health=7..},tag=stopmagic_axe] remove stopmagic_axe

scoreboard players set @a[tag=battle_cry,scores={player_health=..6,battle_cry=..0},tag=!stopshockwave] battle_cry 600

execute as @a[tag=battle_cry,scores={battle_cry=198}] at @s run summon edx:battle_cry_shock ~-1 ~10 ~

tag @a[tag=battle_cry,scores={player_health=..6,battle_cry=100}] add stopshockwave
tag @a[tag=battle_cry,scores={player_health=7..},tag=stopshockwave] remove stopshockwave

scoreboard players add @a[tag=enchanted_socks,tag=!already_enchanted_socks] speed 2
tag @a[tag=enchanted_socks,tag=!already_enchanted_socks] add already_enchanted_socks
scoreboard players remove @a[tag=!enchanted_socks,tag=already_enchanted_socks] speed 2
tag @a[tag=!enchanted_socks,tag=already_enchanted_socks] remove already_enchanted_socks

execute as @a[tag=magnet] at @s run execute as @e[type=item,r=10] at @s run tp ^^^0.08 facing @p[tag=magnet]

effect @a[tag=crystal_of_rage,scores={player_health=..6}] strength 1 0 true
effect @a[tag=crystal_of_fear,scores={player_health=..6}] speed 1 0 true
scoreboard players set @a[tag=crystal_of_youth,scores={player_health=..6,regen=0}] regen 20
effect @a[tag=crystal_of_bravery,scores={player_health=..6}] resistance 1 0 true
effect @a[scores={regen=20}] regeneration 3 0 true



scoreboard players set @a[tag=dragon_heart,scores={ball=0}] ball 40
execute as @a[scores={ball=20}] at @s run summon edx:dragon_breath
scoreboard players remove @a[scores={ball=1..}] ball 1


tag @a[tag=block_speed] remove block_speed
execute as @a[tag=magma_socks] at @s if block ~~-0.3~ netherrack run tag @s add block_speed
execute as @a[tag=magma_socks] at @s if block ~~-0.3~ crimson_nylium run tag @s add block_speed
execute as @a[tag=magma_socks] at @s if block ~~-0.3~ warped_nylium run tag @s add block_speed
execute as @a[tag=magma_socks] at @s run fill ~~~ ~~1~ air replace powder_snow 


effect @a[tag=poisonous_mucus] poison 0 255 true
effect @a[tag=poisonous_mucus] fatal_poison 0 255 true


scoreboard players add @a max_health 0
scoreboard players set @a[tag=!noinsomnia] Dreamlike_pendant 0
scoreboard players remove @a[scores={Dreamlike_pendant=1..}] Dreamlike_pendant 1

scoreboard players set @a[scores={max_health=0}] max_health 20
scoreboard players add @a[tag=heart_bottle,tag=!already_heart_bottle] max_health 2
tag @a[tag=heart_bottle,tag=!already_heart_bottle] add already_heart_bottle
scoreboard players remove @a[tag=!heart_bottle,tag=already_heart_bottle] max_health 2
tag @a[tag=!heart_bottle,tag=already_heart_bottle] remove already_heart_bottle

scoreboard players add @a[tag=gheart_bottle,tag=!already_gheart_bottle] max_health 4
tag @a[tag=gheart_bottle,tag=!already_gheart_bottle] add already_gheart_bottle
scoreboard players remove @a[tag=!gheart_bottle,tag=already_gheart_bottle] max_health 4
tag @a[tag=!gheart_bottle,tag=already_gheart_bottle] remove already_gheart_bottle

scoreboard players add @a[scores={Dreamlike_pendant=3001..},tag=!already_dreamlike_pendant] max_health 2
tag @a[scores={Dreamlike_pendant=3001..},tag=!already_dreamlike_pendant] add already_dreamlike_pendant
scoreboard players remove @a[scores={Dreamlike_pendant=0..3000},tag=already_dreamlike_pendant] max_health 2
tag @a[scores={Dreamlike_pendant=0..3000},tag=already_dreamlike_pendant] remove already_dreamlike_pendant

scoreboard players add @a[scores={Dreamlike_pendant=1..},tag=!already_dreamlike_pendant2] max_health 2
tag @a[scores={Dreamlike_pendant=1..},tag=!already_dreamlike_pendant2] add already_dreamlike_pendant2
scoreboard players remove @a[scores={Dreamlike_pendant=0},tag=already_dreamlike_pendant2] max_health 2
tag @a[scores={Dreamlike_pendant=0},tag=already_dreamlike_pendant2] remove already_dreamlike_pendant2


effect @a[tag=blue_eye] night_vision 20 0 true





effect @a[tag=blaze_heart] fire_resistance 20 0 true



execute as @a[tag=heavy_socks3] at @s if block ~~~ air if block ~~-1~ air if block ~~-2~ air  if block ~~-3~ air if block ~~-4~ air if block ~~-5~ air run tag @s add heavy_socks2

scoreboard players set @a[tag=xp_orb,scores={xp=0}] xp 200
xp 1 @a[scores={xp=20}]
scoreboard players remove @a[scores={xp=1..}] xp 1


scoreboard players set @a[tag=corrupted_star,scores={wither=0}] wither 39
execute as @a[scores={wither=20}] at @s run effect @e[family=monster,r=7] wither 5 2
scoreboard players remove @a[scores={wither=1..}] wither 1


execute as @a[tag=void_cloak] at @s  run execute as @e[r=5,family=!friend_arrow,type=minecraft:arrow] at @s run execute as @a[tag=void_cloak] at @s run particle edx:void_cloak ~~~
execute as @a[tag=void_cloak] at @s  run event entity @e[r=5,family=!friend_arrow,type=minecraft:arrow] despawn




execute as @a[tag=void_socks] at @s if block ~~-0.3~ edx:void_dust run tag @s add block_speed
execute as @a[tag=chorus_socks] at @s if block ~~-0.3~ edx:chorus_grass run tag @s add block_speed
execute as @a[tag=purpur_socks] at @s if block ~~-0.3~ edx:shulk_grass run tag @s add block_speed
execute as @a[hasitem=[{item=edx:fur_boots,location=slot.armor.feet,slot=0}]] at @s if block ~~~ snow_layer run tag @s add block_speed
execute as @a[hasitem=[{item=edx:fur_boots,location=slot.armor.feet,slot=0}]] at @s if block ~~-1~ snow_layer run tag @s add block_speed

scoreboard players add @a[tag=block_speed,tag=!already_block_speed] speed 1
tag @a[tag=block_speed,tag=!already_block_speed] add already_block_speed
scoreboard players remove @a[tag=!block_speed,tag=already_block_speed] speed 1
tag @a[tag=!block_speed,tag=already_block_speed] remove already_block_speed

execute as @a[tag=chorus_socks,tag=jump,tag=!alreadyjump] at @s if block ~~2~ edx:endshroom_block  run tp @s ~~3~
execute as @a[tag=chorus_socks,tag=jump,tag=!alreadyjump] at @s if block ~~-4~ edx:endshroom_block  run tag @s add alreadyjump
execute as @a[tag=chorus_socks,tag=jump,tag=!alreadyjump] at @s if block ~~3~ edx:endshroom_block  run tp @s ~~4~
execute as @a[tag=chorus_socks,tag=jump,tag=!alreadyjump] at @s if block ~~-5~ edx:endshroom_block  run tag @s add alreadyjump


execute as @a[tag=chorus_socks,tag=sneak,tag=!alreadysneak] at @s if block ~~-3~ edx:endshroom_block run tp @s ~~-2~
execute as @a[tag=chorus_socks,tag=sneak,tag=!alreadysneak] at @s if block ~~2~ edx:endshroom_block run tag @s add alreadysneak
execute as @a[tag=chorus_socks,tag=sneak,tag=!alreadysneak] at @s if block ~~-4~ edx:endshroom_block run tp @s ~~-3~
execute as @a[tag=chorus_socks,tag=sneak,tag=!alreadysneak] at @s if block ~~3~ edx:endshroom_block run tag @s add alreadysneak

execute as @a[tag=purpur_socks,tag=sneak] at @s run tag @s remove fly

execute as @a[tag=chorus_socks,tag=sneak] at @s if block ~~-1~ edx:endshroom_block run tag @s remove sneak
tag @a[tag=jump] remove jump
tag @a[tag=alreadyjump] remove alreadyjump
tag @a[tag=alreadysneak] remove alreadysneak


