execute as @s[scores={soulGauge=8..}] at @s run playsound block.bell.hit @a ~~~ 1.3 2

scoreboard players remove @s[scores={soulGauge=8..}] soulGauge 8

# titleraw @s actionbar {"rawtext":[{"text":"§b"},{"score":{"name":"@s","objective":"soulGauge"}},{"text":"§s Souls "}]}