function blue_spores_particles
effect @e[r=0.5,type=player] speed 10 0
effect @e[r=0.5,type=player] poison 5 0
execute if block ~~1~ air run execute if block ~~~ edx:cave_mycelium run fill ~~~ ~~1~ edx:mycelium_grass replace air 
execute if block ~1~1~ air run execute if block ~1~~ edx:cave_mycelium run fill ~1~1~ ~1~1~ edx:mycelium_vine replace air
execute if block ~1~1~1 air run execute if block ~1~~1 edx:cave_mycelium run fill ~1~1~1 ~1~1~1 edx:mycelium_grass replace air 
execute if block ~~1~-1 air run execute if block ~~~-1 edx:cave_mycelium run fill ~~1~-1 ~~1~-1 edx:mycelium_grass replace air
execute if block ~~1~1 air run execute if block ~~~1 edx:cave_mycelium run fill ~~1~1 ~~1~1 edx:blue_mushroom replace air
execute if block ~-1~1~1 air run execute if block ~-1~~1 edx:cave_mycelium run fill ~-1~1~1 ~-1~1~1 edx:mycelium_grass replace air
execute if block ~1~2~-1 air run execute if block ~1~1~-1 edx:cave_mycelium run fill ~1~2~-1 ~1~2~-1 edx:mycelium_grass replace air 
execute if block ~1~2~ air run execute if block ~1~1~ edx:cave_mycelium run fill ~1~2~ ~1~2~ edx:mycelium_vine replace air
execute if block ~1~2~1 air run execute if block ~1~1~1 edx:cave_mycelium run fill ~1~2~1 ~1~2~1 edx:mycelium_grass replace air
execute if block ~~2~-1 air run execute if block ~~1~-1 edx:cave_mycelium run fill ~~2~-1 ~~2~-1 edx:mycelium_grass replace air
execute if block ~-1~2~1 air run execute if block ~-1~1~1 edx:cave_mycelium run fill ~-1~2~1 ~-1~2~1 edx:mycelium_grass replace air 

execute if block ~2~1~-2 air run execute if block ~2~~-2 edx:cave_mycelium run fill ~2~1~-2 ~2~1~-2 edx:mycelium_grass replace air
execute if block ~2~1~1 air run execute if block ~2~~1 edx:cave_mycelium run fill ~2~1~1 ~2~1~1 edx:mycelium_grass replace air
execute if block ~~1~2 air run execute if block ~~~2 edx:cave_mycelium run fill ~~1~2 ~~1~2 edx:mycelium_grass replace air
execute if block ~1~1~ air run fill ~1~~ ~1~~ edx:cave_mycelium replace minecraft:stone 
execute if block ~-1~1~ air run fill ~-1~~ ~-1~~ edx:cave_mycelium replace minecraft:stone 
execute if block ~~1~1 air run fill ~~~1 ~~~1 edx:cave_mycelium replace minecraft:stone 
execute if block ~~1~-1 air run fill ~~~-1 ~~~-1 edx:cave_mycelium replace minecraft:stone 
playsound item.bone_meal.use @a[r=15]
execute if block ~1~2~ air run fill ~1~1~ ~1~1~ edx:cave_mycelium replace minecraft:stone 
execute if block ~-1~2~ air run fill ~-1~1~ ~-1~1~ edx:cave_mycelium replace minecraft:stone 
execute if block ~~2~1 air run fill ~~1~1 ~~1~1 edx:cave_mycelium replace minecraft:stone 
execute if block ~~2~-1 air run fill ~~1~-1 ~~1~-1 edx:cave_mycelium replace minecraft:stone 
execute if block ~~1~ air run execute if block ~~~ edx:mycelium_vine run fill ~~~ ~~1~ edx:mycelium_vine replace air
execute if block ~~2~ air run execute if block ~~1~ edx:mycelium_vine run fill ~~1~ ~~2~ edx:mycelium_vine
execute if block ~~3~ air run execute if block ~~2~ edx:mycelium_vine run fill ~~2~ ~~3~ edx:mycelium_vine
execute if block ~~4~ air run execute if block ~~3~ edx:mycelium_vine run fill ~~3~ ~~4~ edx:mycelium_vine
execute if block ~~5~ air run execute if block ~~4~ edx:mycelium_vine run fill ~~4~ ~~5~ edx:mycelium_vine
execute if block ~~1~ air run fill ~~~ ~~~ edx:cave_mycelium replace minecraft:stone 

 
 
