scoreboard players set @a death 1
scoreboard players set @e[type=player] death 0
scoreboard players remove @a[scores={death=1,died=0}] hydration 100
scoreboard players set @a[scores={death=1,died=0}] hydration 0
scoreboard players set @e[type=player,scores={death=0}] died 0
