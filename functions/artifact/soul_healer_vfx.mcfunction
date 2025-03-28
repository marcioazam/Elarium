execute as @s[scores={soulGauge=10..}] at @s run playsound mob.evocation_illager.cast_spell @a ~~~ 0.5 1.1
execute as @s[scores={soulGauge=10..}] at @s run particle dungeons:soul_healer ~~1~
execute as @s[scores={soulGauge=10..}] at @s run particle dungeons:soul_rings ~~0.2~
execute as @s[scores={soulGauge=10..}] at @s run particle dungeons:soul2 ~~~
execute as @s[scores={soulGauge=10..}] at @s run particle dungeons:soul2 ~~0.5~

scoreboard players remove @s[scores={soulGauge=10..}] soulGauge 10

# titleraw @s actionbar {"rawtext":[{"text":"§b"},{"score":{"name":"@s","objective":"soulGauge"}},{"text":"§s Souls "}]}