particle dungeons:blast_fungus ~~~
playsound armor.equip_leather @a ~~~ 0.5 0.8
scoreboard objectives add blast_immune dummy
scoreboard players set @s blast_immune 60
tag @s add blast_immune

summon dungeons:fungus_blast ~-1.5~~-1.5
summon dungeons:fungus_blast ~-1.5~~1.5
summon dungeons:fungus_blast ~1.5~~