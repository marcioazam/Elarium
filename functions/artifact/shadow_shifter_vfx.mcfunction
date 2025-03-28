execute as @s[scores={soulGauge=8..}] at @s run playsound mob.endermen.portal @a ~~~ 0.5 0.65
execute as @s[scores={soulGauge=8..}] at @s run particle dungeons:instant_teleport ~~1.8~


execute as @s[scores={soulGauge=..7}] at @s run playsound mob.evocation_illager.cast_spell @a ~~~ 0.5 0.6
tellraw @s[scores={soulGauge=..7}] {"rawtext":[{"text":"§7§oCollect more Souls to use this Artefact"}]}
