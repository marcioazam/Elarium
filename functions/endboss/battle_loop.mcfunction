title @a[rm=28,r=50] actionbar xp_hud.end_boss_scream
execute as @a[rm=28,r=50] run playsound entity.mimic.idle @s -166 181 2076 10 1 1
tp @a[rm=28,r=50,tag=!marketing] -166 181 2076

# execute positioned -166 181 2060 run playsound entity.mimic.idle @a[r=6]

execute in the_end run particle xp:end_boss.beacon_beam_tick -160 183 2039
execute in the_end run particle xp:end_boss.beacon_beam_tick -172 183 2039
execute in the_end run particle xp:end_boss.beacon_beam_tick -160 183 2081
execute in the_end run particle xp:end_boss.beacon_beam_tick -172 183 2081
execute in the_end run particle xp:end_boss.beacon_beam_tick -187 183 2066
execute in the_end run particle xp:end_boss.beacon_beam_tick -187 183 2054
execute in the_end run particle xp:end_boss.beacon_beam_tick -145 183 2066
execute in the_end run particle xp:end_boss.beacon_beam_tick -145 183 2054

execute in the_end run particle xp:heartofender.arena_ambient_tick -166 181 2060

execute in the_end run particle xp:end_boss.beacon_impact_tick -160 183 2039
execute in the_end run particle xp:end_boss.beacon_impact_tick -172 183 2039

execute in the_end run particle xp:end_boss.beacon_impact_tick -160 183 2081
execute in the_end run particle xp:end_boss.beacon_impact_tick -172 183 2081

execute in the_end run particle xp:end_boss.beacon_impact_tick -187 183 2066
execute in the_end run particle xp:end_boss.beacon_impact_tick -187 183 2054

execute in the_end run particle xp:end_boss.beacon_impact_tick -145 183 2066
execute in the_end run particle xp:end_boss.beacon_impact_tick -145 183 2054


execute in the_end run particle xp:end_boss.beacon_impact_1_tick -160 183 2039
execute in the_end run particle xp:end_boss.beacon_impact_1_tick -172 183 2039

execute in the_end run particle xp:end_boss.beacon_impact_1_tick -160 183 2081
execute in the_end run particle xp:end_boss.beacon_impact_1_tick -172 183 2081

execute in the_end run particle xp:end_boss.beacon_impact_1_tick -187 183 2066
execute in the_end run particle xp:end_boss.beacon_impact_1_tick -187 183 2054

execute in the_end run particle xp:end_boss.beacon_impact_1_tick -145 183 2066
execute in the_end run particle xp:end_boss.beacon_impact_1_tick -145 183 2054

scoreboard players random chance math 0 2
execute if score chance math matches 0 in the_end run particle xp:heartofender.fog -166 175 2060

scoreboard players random chance math 0 4
execute if score chance math matches 1 in the_end run particle xp:hoe_boss_lightrays -166 175 2060