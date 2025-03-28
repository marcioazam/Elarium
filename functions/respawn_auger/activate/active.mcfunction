playanimation @s deny "1"
playsound mob.endermen.scream @a[r=32] ~~~ 0.25 1.5 0.01
playsound mob.endermen.scream @a[r=32] ~~~ 0.75 0.5 0.02
playsound respawn_auger.scream @a[r=32] ~~~ 1 2 0.02
titleraw @a[r=7] actionbar {"rawtext":[{"translate":"xp.respawn_auger.already_active"}]}
camerashake add @a[r=4] 0.05 0.75 rotational
camerashake add @a[r=8] 0.025 1.25 rotational
particle xp:heart_drip.burst ~~1.75~