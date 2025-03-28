function setup
execute in overworld positioned -1354 2 -1389 if entity @p[r=100] run event entity @e[type=xp:game_manager.spawn] xp:reset
execute in overworld positioned -1354 2 -1389 if entity @p[r=100] run event entity @e[type=xp:game_manager.spawn] xp:cutscene.end_portal