scoreboard objectives add Hit_cooldown dummy 
scoreboard players add @a Hit_cooldown 0
scoreboard players remove @a[scores={Hit_cooldown=1..}] Hit_cooldown 1
scoreboard objectives add Chaining dummy 
scoreboard objectives add Height dummy 
scoreboard players add @a Height 0
scoreboard objectives add Fire_breath dummy 




execute as @e[type=edx:dragon_breath] at @s run particle edx:dragon_breath ~~~
scoreboard players add @e[type=edx:sculkling_friendly] Bow 1
event entity @e[scores={Bow=6000..},type=edx:sculkling_friendly] despawn
execute as @e[type=minecraft:zombie_horse] at @s run execute as @e[type=minecraft:zombie,r=3,c=1] at @s run effect @e[r=3,type=zombie_horse] speed 1 4 true



scoreboard players add @a[scores={Bow=1..199}] Bow 1
camerashake add @a[scores={Bow=1..40}] 0.002 0.05 rotational
camerashake add @a[scores={Bow=41..60}] 0.01 0.05 rotational
camerashake add @a[scores={Bow=61..80}] 0.015 0.05 rotational
camerashake add @a[scores={Bow=81..120}] 0.022 0.05 rotational
camerashake add @a[scores={Bow=121..200}] 0.029 0.05 rotational
scoreboard players set @a[scores={void=1..}] void 0
scoreboard players set @a[scores={light=1..}] light 0
scoreboard players set @a[hasitem=[{item=edx:light_chestplate,location=slot.armor.chest,slot=0},{item=edx:light_helmet,location=slot.armor.head,slot=0},{item=edx:light_leggings,location=slot.armor.legs,slot=0},{item=edx:light_boots,location=slot.armor.feet,slot=0}]] light 1
tag @a[tag=void] remove void
scoreboard players set @a[hasitem=[{item=edx:void_chestplate,location=slot.armor.chest,slot=0},{item=edx:void_helmet,location=slot.armor.head,slot=0},{item=edx:void_leggings,location=slot.armor.legs,slot=0},{item=edx:void_boots,location=slot.armor.feet,slot=0}]] void 1
tag @a[hasitem=[{item=edx:void_chestplate,location=slot.armor.chest,slot=0},{item=edx:void_helmet,location=slot.armor.head,slot=0},{item=edx:void_leggings,location=slot.armor.legs,slot=0},{item=edx:void_boots,location=slot.armor.feet,slot=0}]] add void


effect @a[hasitem=[{item=edx:light_armblade,location= slot.weapon.mainhand ,slot=0}],scores={void=1}] weakness 4 1 
effect @a[hasitem=[{item=edx:light_armblade2,location= slot.weapon.mainhand ,slot=0}],scores={void=1}] weakness 4 1 
effect @a[hasitem=[{item=edx:light_armblade3,location= slot.weapon.mainhand ,slot=0}],scores={void=1}] weakness 4 1 

effect @a[hasitem=[{item=edx:void_armblade,location= slot.weapon.mainhand ,slot=0}],scores={light=1}] weakness 4 1 
effect @a[hasitem=[{item=edx:void_armblade2,location= slot.weapon.mainhand ,slot=0}],scores={light=1}] weakness 4 1 
effect @a[hasitem=[{item=edx:void_armblade3,location= slot.weapon.mainhand ,slot=0}],scores={light=1}] weakness 4 1 

tag @a[tag=fur_chestplate] remove fur_chestplate
tag @a[hasitem=[{item=edx:fur_chestplate,location=slot.armor.chest,slot=0}]] add fur_chestplate
tag @a[tag=fur_helmet] remove fur_helmet
tag @a[hasitem=[{item=edx:fur_helmet,location=slot.armor.head,slot=0}]] add fur_helmet
effect @a[hasitem=[{item=edx:fur_leggings,location=slot.armor.legs,slot=0}],tag=frozen] slowness 0 255 true
tag @a[tag=fur_boots] remove fur_boots
execute as @a[hasitem=[{item=edx:fur_boots,location=slot.armor.feet,slot=0}],tag=!fur_boots] at @s if block ~~~ snow_layer run tag @s add fur_boots
execute as @a[hasitem=[{item=edx:fur_boots,location=slot.armor.feet,slot=0}],tag=!fur_boots] at @s if block ~~-0.5~ snow run tag @s add fur_boots

scoreboard players add @a[tag=fur_boots,tag=!already_fur_boots] speed 1
tag @a[tag=fur_boots,tag=!already_fur_boots] add already_fur_boots
scoreboard players remove @a[tag=!fur_boots,tag=already_fur_boots] speed 1
tag @a[tag=!fur_boots,tag=already_fur_boots] remove already_fur_boots


tag @a[tag=slide] remove slide
execute as @a[hasitem=[{item=edx:penguin_leggings,location=slot.armor.legs,slot=0}],tag=!slide] at @s if block ~~-0.5~ ice run tag @s add slide
execute as @a[hasitem=[{item=edx:penguin_leggings,location=slot.armor.legs,slot=0}],tag=!slide] at @s if block ~~-0.5~ packed_ice run tag @s add slide
execute as @a[hasitem=[{item=edx:penguin_leggings,location=slot.armor.legs,slot=0}],tag=!slide] at @s if block ~~-0.5~ blue_ice run tag @s add slide
execute as @a[hasitem=[{item=edx:penguin_leggings,location=slot.armor.legs,slot=0}],tag=!slide] at @s if block ~~~ water run tag @s add slide

scoreboard players add @a[tag=slide,tag=!already_slide] speed 3
tag @a[tag=slide,tag=!already_slide] add already_slide
scoreboard players remove @a[tag=!slide,tag=already_slide] speed 3
tag @a[tag=!slide,tag=already_slide] remove already_slide

gamerule commandblockoutput false
effect @e[type=edx:knight_blaze] slow_falling 10 1 true
scoreboard players add @a start 0

execute if entity @e[type=edx:copper_golem] run function copper_golem

execute as @a[tag=molten_ingot,hasitem=[{item=raw_iron}]] run give @s iron_ingot
clear @a[tag=molten_ingot,hasitem=[{item=raw_iron}]] raw_iron 0 1
execute as @a[tag=molten_ingot,hasitem=[{item=raw_gold}]] run give @s gold_ingot
clear @a[tag=molten_ingot,hasitem=[{item=raw_gold}]] raw_gold 0 1
execute as @a[tag=molten_ingot,hasitem=[{item=raw_copper}]] run give @s copper_ingot
clear @a[tag=molten_ingot,hasitem=[{item=raw_copper}]] raw_copper 0 1
execute as @a[tag=molten_ingot,hasitem=[{item=edx:raw_tin}]] run give @s edx:tin_ingot
clear @a[tag=molten_ingot,hasitem=[{item=edx:raw_tin}]] edx:raw_tin 0 1
execute as @a[tag=molten_ingot,hasitem=[{item=edx:raw_platinium}]] run give @s edx:platinium_ingot
clear @a[tag=molten_ingot,hasitem=[{item=edx:raw_platinium}]] edx:raw_platinium 0 1
execute as @a[tag=molten_ingot,hasitem=[{item=edx:raw_nickel}]] run give @s edx:nickel_ingot
clear @a[tag=molten_ingot,hasitem=[{item=edx:raw_nickel}]] edx:raw_nickel 0 1
execute as @a[tag=molten_ingot,hasitem=[{item=minecraft:ancient_debris}]] run give @s minecraft:netherite_scrap
clear @a[tag=molten_ingot,hasitem=[{item=minecraft:netherite_scrap}]] minecraft:ancient_debris 0 1

execute as @e[name=wither_loot] at @s run function wither
kill @e[name=kill]
kill @e[name="Sculk jaw"]
event entity @a[scores={max_health=1}] health_1
event entity @a[scores={max_health=2}] health_2
event entity @a[scores={max_health=3}] health_3
event entity @a[scores={max_health=4}] health_4
event entity @a[scores={max_health=5}] health_5
event entity @a[scores={max_health=6}] health_6
event entity @a[scores={max_health=7}] health_7
event entity @a[scores={max_health=8}] health_8
event entity @a[scores={max_health=9}] health_9
event entity @a[scores={max_health=10}] health_10
event entity @a[scores={max_health=11}] health_11
event entity @a[scores={max_health=12}] health_12
event entity @a[scores={max_health=13}] health_13
event entity @a[scores={max_health=14}] health_14
event entity @a[scores={max_health=15}] health_15
event entity @a[scores={max_health=16}] health_16
event entity @a[scores={max_health=17}] health_17
event entity @a[scores={max_health=18}] health_18
event entity @a[scores={max_health=19}] health_19
event entity @a[scores={max_health=20}] health_20
event entity @a[scores={max_health=21}] health_21
event entity @a[scores={max_health=22}] health_22
event entity @a[scores={max_health=23}] health_23
event entity @a[scores={max_health=24}] health_24
event entity @a[scores={max_health=25}] health_25
event entity @a[scores={max_health=26}] health_26
event entity @a[scores={max_health=27}] health_27
event entity @a[scores={max_health=28}] health_28
event entity @a[scores={max_health=29}] health_29
event entity @a[scores={max_health=30}] health_30
event entity @a[scores={max_health=31}] health_31
event entity @a[scores={max_health=32}] health_32
event entity @a[scores={max_health=33}] health_33
event entity @a[scores={max_health=34}] health_34
event entity @a[scores={max_health=35}] health_35
event entity @a[scores={max_health=36}] health_36
event entity @a[scores={max_health=37}] health_37
event entity @a[scores={max_health=38}] health_38
event entity @a[scores={max_health=39}] health_39
event entity @a[scores={max_health=40}] health_40
event entity @a[scores={max_health=41}] health_41
event entity @a[scores={max_health=42}] health_42
event entity @a[scores={max_health=43}] health_43
event entity @a[scores={max_health=44}] health_44
event entity @a[scores={max_health=45}] health_45
event entity @a[scores={max_health=46}] health_46
event entity @a[scores={max_health=47}] health_47
event entity @a[scores={max_health=48}] health_48
event entity @a[scores={max_health=49}] health_49
event entity @a[scores={max_health=50}] health_50
event entity @a[scores={max_health=51}] health_51
event entity @a[scores={max_health=52}] health_52
event entity @a[scores={max_health=53}] health_53
event entity @a[scores={max_health=54}] health_54
event entity @a[scores={max_health=55}] health_55
event entity @a[scores={max_health=56}] health_56
event entity @a[scores={max_health=57}] health_57
event entity @a[scores={max_health=58}] health_58
event entity @a[scores={max_health=59}] health_59
event entity @a[scores={max_health=60}] health_60

event entity @a[scores={speed=-3}] speed-3
event entity @a[scores={speed=-2}] speed-2
event entity @a[scores={speed=-1}] speed-1
event entity @a[scores={speed=0}] speed0
event entity @a[scores={speed=1}] speed1
event entity @a[scores={speed=2}] speed2
event entity @a[scores={speed=3}] speed3
event entity @a[scores={speed=4}] speed4
event entity @a[scores={speed=5}] speed5
event entity @a[scores={speed=6}] speed6
event entity @a[scores={speed=7}] speed7

execute as @e[name="§4Strange totem"] at @s if block ~~-0.2~ gold_block run summon edx:abomination ~~~


execute as @a[tag=blood_moon] run weather clear
execute as @a[tag=blood_moon] run event entity @e[family=blood_moon] blood_variant 

execute as @a[tag=!abom,m=!c] at @s if block ~~~ portal run tellraw @s { "rawtext": [ { "text": "§cYou need to kill §4The abomination§c to unlock the Nether.\nCheck the wiki book for more informations" } ] }
execute as @a[tag=!abom,m=!c] at @s if block ~~~ portal run setblock ~~~ air
execute as @a[tag=!abom,m=!c] at @s if block ~~~1 portal run tellraw @s { "rawtext": [ { "text": "§cYou need to kill §4The abomination§c to unlock the Nether.\nCheck the wiki book for more informations" } ] }
execute as @a[tag=!abom,m=!c] at @s if block ~~~1 portal run setblock ~~~1 air
execute as @a[tag=!abom,m=!c] at @s if block ~~~-1 portal run tellraw @s { "rawtext": [ { "text": "§cYou need to kill §4The abomination§c to unlock the Nether.\nCheck the wiki book for more informations" } ] }
execute as @a[tag=!abom,m=!c] at @s if block ~~~-1 portal run setblock ~~~-1 air
execute as @a[tag=!abom,m=!c] at @s if block ~1~~ portal run tellraw @s { "rawtext": [ { "text": "§cYou need to kill §4The abomination§c to unlock the Nether.\nCheck the wiki book for more informations" } ] }
execute as @a[tag=!abom,m=!c] at @s if block ~1~~ portal run setblock ~1~~ air
execute as @a[tag=!abom,m=!c] at @s if block ~-1~~ portal run tellraw @s { "rawtext": [ { "text": "§cYou need to kill §4The abomination§c to unlock the Nether.\nCheck the wiki book for more informations" } ] }
execute as @a[tag=!abom,m=!c] at @s if block ~-1~~ portal run setblock ~-1~~ air
tellraw @a[scores={difficulty=1}] { "rawtext": [ { "text": "§6You are now in Hell mode\n§5Monsters in the overworld are now more powerful and some new mobs can now spawn..." } ] }
tellraw @a[tag=abom,tag=!abom2] { "rawtext": [ { "text": "§cThe Abomination has been killed, and the Nether is now unlocked.\nFeel free to go to hell and kill the second beast:§4 The Wither" } ] }
tag @a[tag=abom,tag=!abom2] add abom2
scoreboard players set @a[scores={difficulty=1}] difficulty 2
scoreboard players set @a[scores={difficulty=3..}] difficulty 2
execute as @a[scores={difficulty=1..}] run scoreboard players set @a[scores={difficulty=0}] difficulty 1
execute as @a[scores={difficulty2=1..}] run scoreboard players set @a[scores={difficulty2=0}] difficulty2 1
tellraw @a[scores={start=202}] { "rawtext": [ { "text": "§6Survival Reworked by Enedyx and Efosi\n\n§rDon't forget to open the wiki book if you're lost in the add-on, it contain almost everythings about the add-on.\n§cIf you lose the wiki book, you can craft a new with a dirt block\n\nGood luck in this more difficult survival :)" } ] }
give @a[scores={start=202}] edx:quest_book 
execute as @a[scores={start=202}] run gamerule sendcommandfeedback false

scoreboard players set @a[scores={start=202}] max_health 20
scoreboard players set @a[scores={start=202}] magic_axe 0
scoreboard players set @a[scores={start=202}] regen 0
scoreboard players set @a[scores={start=202}] player_health 20
scoreboard players set @a[scores={start=202}] battle_cry 0
scoreboard players set @a[scores={start=202}] ball 0
scoreboard players set @a[scores={start=202}] ec 0
scoreboard players set @a[scores={start=202}] Lab 0
scoreboard players set @a[scores={start=202}] light_effect 0
scoreboard players set @a[scores={start=202}] xp 0
scoreboard players set @a[scores={start=202}] wither 0
scoreboard players set @a[scores={start=202}] difficulty 0
scoreboard players set @a[scores={start=202}] difficulty2 0
scoreboard players set @a[scores={start=202}] detect 0


tellraw @a[tag=blood_moon,tag=!already_blood_moon] { "rawtext": [ { "text": "§4A blood moon is rising..." } ] }
playsound random.click @a[tag=blood_moon,tag=!already_blood_moon]
tag @a[tag=blood_moon,tag=!already_blood_moon] add already_blood_moon
tag @a[tag=!blood_moon,tag=already_blood_moon] remove already_blood_moon


scoreboard players set @a[scores={start=202}] start 203
scoreboard players add @a[scores={start=0..202}] start 1

 

execute as @a[scores={difficulty=2}] run event entity @e[family=hellmode,tag=!hellmode,family=!spawner] hellmode
tag @e[family=hellmode,tag=!hellmode] add hellmode

scoreboard players remove @a[scores={detect=1..}] detect 1 
scoreboard players remove @a[scores={dash=1..}] dash 1
scoreboard players set @a[scores={detect=0}] detect 30


tellraw @a[scores={difficulty2=1}] { "rawtext": [ { "text": "§6Congratulation!!!\n §cThe Ender Dragon has been killed, and the end islands are now for you\n§6You are now in Void mode\n§5Monsters in the overworld and in the Nether are now even more powerful and some new mobs can now spawn...\nYou can now fight the §4True Wither§c by summoning the Wither in the Nether\n\n§6In a near future a new boss will be added for the end, even more harder than the True Wither...\nI hope you enjoy this add-on and you didn't encounter bugs ;). If yes, you can report them on the discord (link on mcpedl)\n\n§4WARNING: The end game content is not finished and a lot of thing are missing \n\n§6-Enedyx and Efosi" } ] }
scoreboard players set @a[scores={difficulty2=1}] difficulty2 2
scoreboard players set @a[scores={difficulty2=3..}] difficulty2 2
execute as @a[scores={difficulty2=2}] run scoreboard players set @a[scores={difficulty2=0}] difficulty2 1

execute as @a[scores={difficulty2=2}] run event entity @e[family=void_mode,tag=!void_mode,family=!spawner] void_mode
execute as @a[scores={difficulty2=..1}] run event entity @e[family=novoidmode,r=100] minecraft:despawn
tag @e[family=void_mode,tag=!void_mode] add void_mode


tag @a[tag=clock] remove clock
tag @a[hasitem=[{item=minecraft:clock,location=slot.inventory}]] add clock
tag @a[hasitem=[{item=minecraft:clock,location=slot.hotbar}]] add clock


scoreboard players remove @a[scores={shield=1..}] shield 1
title @a[scores={shield=1..}] actionbar §4This area is protected
gamemode s @a[m=a,scores={shield=..0}]
gamemode a @a[scores={shield=1..},m=s]

event entity @e[type=item,name="Netherite pickaxe §3\nMineable ores:§8\nCoal,Sulfur,Copper,Lapis,Quartz,Tin,Iron,Platinium,Diamond,Redminecraft:stone,Emerald,Nickel,Obsidian,Ruby"] not_burn
event entity @e[type=item,name="Forged Netherite pickaxe §3\nMineable ores:§8\nCoal,Sulfur,Copper,Lapis,Quartz,Tin,Iron,Platinium,Diamond,Redminecraft:stone,Emerald,Nickel,Obsidian,Ruby"] not_burn
event entity @e[type=item,name="Upgraded Netherite pickaxe §3\nMineable ores:§8\nCoal,Sulfur,Copper,Lapis,Quartz,Tin,Iron,Platinium,Diamond,Redminecraft:stone,Emerald,Nickel,Obsidian,Ruby\n§aSneak + right click to change mode"] not_burn
event entity @e[type=item,name="§dRefined Netherite pickaxe §3\nMineable ores:§8\nCoal,Sulfur,Copper,Lapis,Quartz,Tin,Iron,Platinium,Diamond,Redminecraft:stone,Emerald,Nickel,Obsidian,Ruby\n§bSneak + right click to change mode"] not_burn
event entity @e[type=item,name="Void pickaxe §3\nMineable ores:§8\nCoal,Sulfur,Copper,Lapis,Quartz,Tin,Iron,Platinium,Diamond,Redminecraft:stone,Emerald,Nickel,Obsidian,Ruby\n§aSneak + right click to change mode"] not_burn
event entity @e[type=item,name="Light pickaxe §3\nMineable ores:§8\nCoal,Sulfur,Copper,Lapis,Quartz,Tin,Iron,Platinium,Diamond,Redminecraft:stone,Emerald,Nickel,Obsidian,Ruby\n§aSneak + right click to change mode"] not_burn
event entity @e[type=item,name="Infused light pickaxe §3\nMineable ores:§8\nCoal,Sulfur,Copper,Lapis,Quartz,Tin,Iron,Platinium,Diamond,Redminecraft:stone,Emerald,Nickel,Obsidian,Ruby\n§bSneak + right click to change mode"] not_burn
event entity @e[type=item,name="Infused Void pickaxe §3\nMineable ores:§8\nCoal,Sulfur,Copper,Lapis,Quartz,Tin,Iron,Platinium,Diamond,Redminecraft:stone,Emerald,Nickel,Obsidian,Ruby\n§bSneak + right click to change mode"] not_burn
event entity @e[type=item,name="§dPure Light pickaxe §3\nMineable ores:§8\nCoal,Sulfur,Copper,Lapis,Quartz,Tin,Iron,Platinium,Diamond,Redminecraft:stone,Emerald,Nickel,Obsidian,Ruby\n§cSneak + right click to change mode"] not_burn
event entity @e[type=item,name="§dPure Void pickaxe §3\nMineable ores:§8\nCoal,Sulfur,Copper,Lapis,Quartz,Tin,Iron,Platinium,Diamond,Redminecraft:stone,Emerald,Nickel,Obsidian,Ruby\n§cSneak + right click to change mode"] not_burn
event entity @e[type=item,name="Netherite axe"] not_burn
event entity @e[type=item,name="Forged Netherite axe"] not_burn
event entity @e[type=item,name="Upgraded Netherite axe\n§aSneak + right click to change mode\n§4Modes only work wih logs"] not_burn
event entity @e[type=item,name="§dRefined Netherite axe\n§bSneak + right click to change mode\n§4Modes only work wih logs"] not_burn
event entity @e[type=item,name="Light axe\n§aSneak + right click to change mode\n§4Modes only work wih logs"] not_burn 
event entity @e[type=item,name="Void axe\n§aSneak + right click to change mode\n§4Modes only work wih logs"] not_burn
event entity @e[type=item,name="Infused light axe\n§bSneak + right click to change mode\n§4Modes only work wih logs"] not_burn
event entity @e[type=item,name="Infused void axe\n§bSneak + right click to change mode\n§4Modes only work wih logs"] not_burn
event entity @e[type=item,name="§dPure light axe\n§cSneak + right click to change mode\n§4Modes only work wih logs"] not_burn
event entity @e[type=item,name="§dPure void axe\n§cSneak + right click to change mode\n§4Modes only work wih logs"] not_burn
event entity @e[type=item,name="Netherite shovel"] not_burn
event entity @e[type=item,name="Forged Netherite shovel"] not_burn
event entity @e[type=item,name="Upgraded Netherite shovel\n§aSneak + right click to change mode"] not_burn
event entity @e[type=item,name="§dRefined Netherite shovel\n§bSneak + right click to change mode"] not_burn
event entity @e[type=item,name="Light shovel\n§aSneak + right click to change mode"] not_burn 
event entity @e[type=item,name="Void shovel\n§aSneak + right click to change mode"] not_burn
event entity @e[type=item,name="Infused light shovel\n§bSneak + right click to change mode"] not_burn
event entity @e[type=item,name="Infused void shovel\n§bSneak + right click to change mode"] not_burn
event entity @e[type=item,name="§dPure light shovel\n§cSneak + right click to change mode"] not_burn
event entity @e[type=item,name="§dPure void shovel\n§cSneak + right click to change mode"] not_burn
event entity @e[type=item,name="Light armblades\nRight click to give yourself regen 1"] not_burn
event entity @e[type=item,name="Infused light armblades\nRight click to give regen 1 to every players around including yourself\nSneak + right click to give yourself regen 2"] not_burn
event entity @e[type=item,name="§dPure light armblades\nRight click to give regen 3 to every players around including yourself\nSneak + right click to give yourself regen 4"] not_burn
event entity @e[type=item,name="Void armblades\nRight click to inflict 20 magic damage to every monsters around\nSneak + right click to inflict 5 magic damage to every players around except yourself"] not_burn
event entity @e[type=item,name="Infused void armblades\nRight click to inflict 35 magic damage to every monsters around\nSneak + right click to inflict 10 magic damage to every players around except yourself"] not_burn
event entity @e[type=item,name="§dPure void armblades\nRight click to inflict 50 magic damage to every monsters around\nSneak + right click to inflict 15 magic damage to every players around except yourself"] not_burn
event entity @e[type=item,name="Light leggings"] not_burn
event entity @e[type=item,name="Light helmet"] not_burn
event entity @e[type=item,name="Light boots"] not_burn
event entity @e[type=item,name="Light chestplate"] not_burn
event entity @e[type=item,name="Void leggings"] not_burn
event entity @e[type=item,name="Void helmet"] not_burn
event entity @e[type=item,name="Void boots"] not_burn
event entity @e[type=item,name="Void chestplate"] not_burn
event entity @e[type=item,name="Netherite leggings §6[Survival reworked]"] not_burn
event entity @e[type=item,name="Netherite helmet §6[Survival reworked]"] not_burn
event entity @e[type=item,name="Netherite boots §6[Survival reworked]"] not_burn
event entity @e[type=item,name="Netherite chestplate §6[Survival reworked]"] not_burn


scoreboard players add @a[scores={light=1},tag=!already_light_hearts] max_health 2
tag @a[scores={light=1},tag=!already_light_hearts] add already_light_hearts
scoreboard players remove @a[scores={light=0},tag=already_light_hearts] max_health 2
tag @a[scores={light=0},tag=already_light_hearts] remove already_light_hearts

execute as @a[scores={ec=2}] at @s run tickingarea add ~ ~ ~ ~ ~ ~ ecspawn
scoreboard players remove @a[scores={ec=1..}] ec 1


scoreboard players remove @a[scores={Flower_cooldown=1..}] Flower_cooldown 1
scoreboard players remove @a[scores={Void_cloak=1..60}] Void_cloak 1
playsound lodeminecraft:stone_compass.link_compass_to_lodeminecraft:stone @a[scores={Void_cloak=1}] 


execute as @e[type=ender_dragon] at @s run event entity @e[type=edx:heretic_shulker,r=200] stay

 