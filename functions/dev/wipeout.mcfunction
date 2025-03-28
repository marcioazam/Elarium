# run instant despawn events asychronously
event entity @e[family=!dummy,family=!game_manager,family=!dev,family=!inanimate] xp:despawn
event entity @e[family=!dummy,family=!game_manager,family=!dev,family=!inanimate] xp:instant_despawn
event entity @e[family=!dummy,family=!game_manager,family=!dev,family=!inanimate] xp:action.despawn
event entity @e[family=!dummy,family=!game_manager,family=!dev,family=!inanimate] action.despawn.set
event entity @e[family=!dummy,family=!game_manager,family=!dev,family=!inanimate] action.despawn
event entity @e[family=!dummy,family=!game_manager,family=!dev,family=!inanimate] despawn

# kill xp orbs
kill @e[type=xp_orb]
kill @e[family=item]

# send feedback
tellraw @a {"rawtext":[{"text":"§eWiping out all pre-loaded entities."}]}
playsound random.orb @s