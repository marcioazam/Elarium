scoreboard objectives add countentities dummy
scoreboard players set "max" countentities 0
execute as @e run scoreboard players add "max" countentities 1
scoreboard players operation @s countentities = "max" countentities

scoreboard objectives add countentities1 dummy
scoreboard players set "max" countentities1 0
execute as @e[family=prop] run scoreboard players add "max" countentities1 1
scoreboard players operation @s countentities1 = "max" countentities1

scoreboard objectives add countentities2 dummy
scoreboard players set "max" countentities2 0
execute as @e[family=xp_dummy,family=!prop] run scoreboard players add "max" countentities2 1
scoreboard players operation @s countentities2 = "max" countentities2


tellraw @s {"rawtext":[{"text":"§emax loaded: §r§l"},{"score":{"name":"@s","objective":"countentities"}},{"text":" §r§9(props: §r§l"},{"score":{"name":"@s","objective":"countentities1"}},{"text":"§r§9) §7(dummies: §r§l"},{"score":{"name":"@s","objective":"countentities2"}},{"text":"§r§7)"}]}

scoreboard objectives remove countentities
scoreboard objectives remove countentities1
scoreboard objectives remove countentities2