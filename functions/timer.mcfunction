scoreboard objectives add timer dummy
scoreboard players add @a timer 1
execute as @a[scores={timer=800..840, hydration=!100}] positioned ~ ~ ~ run scoreboard players add @a hydration 1
execute as @a[scores={timer=800..840}] positioned ~ ~ ~ run scoreboard players set @a timer 0
title @a[scores={hydration=0..5}] actionbar ½½½½½½½½½½      
title @a[scores={hydration=6..10}] actionbar ¼½½½½½½½½½      
title @a[scores={hydration=11..20}] actionbar ¼¼½½½½½½½½      
title @a[scores={hydration=21..30}] actionbar ¼¼¼½½½½½½½      
title @a[scores={hydration=31..40}] actionbar ¼¼¼¼½½½½½½      
title @a[scores={hydration=41..50}] actionbar ¼¼¼¼¼½½½½½      
title @a[scores={hydration=51..60}] actionbar ¼¼¼¼¼¼½½½½      
title @a[scores={hydration=61..70}] actionbar ¼¼¼¼¼¼¼½½½      
title @a[scores={hydration=71..80}] actionbar ¼¼¼¼¼¼¼¼½½      
title @a[scores={hydration=81..90}] actionbar ¼¼¼¼¼¼¼¼¼½      
title @a[scores={hydration=91..99}] actionbar ¼¼¼¼¼¼¼¼¼¼      
effect @a[scores={hydration=91..99}] nausea 5 5 true
kill @a[scores={hydration=100}]
