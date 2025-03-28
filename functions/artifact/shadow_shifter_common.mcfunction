function artifact/shadow_shifter_vfx
scoreboard players set @s[scores={soulGauge=8..}] shadowTime 280
scoreboard players remove @s[scores={soulGauge=8..}] soulGauge 8

# titleraw @s actionbar {"rawtext":[{"text":"§b"},{"score":{"name":"@s","objective":"soulGauge"}},{"text":"§s Souls "}]}