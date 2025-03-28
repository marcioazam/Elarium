scoreboard objectives add hydration dummy
scoreboard players add @a hydration 0
scoreboard players set @a[scores={hydration=101..10000}] hydration 100
scoreboard players set @a[scores={hydration=-10000..0}] hydration 0
scoreboard players set @a[scores={hydration=..-1}] timer 0