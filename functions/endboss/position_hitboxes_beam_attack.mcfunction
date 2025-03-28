tp @e[type=xp:endboss_hitbox] ~ ~ ~

execute as @e[type=xp:endboss_hitbox] at @s if score direction endboss matches 0 rotated 0 0 run tp @s ~ ~ ~ 0 ~
execute as @e[type=xp:endboss_hitbox] at @s if score direction endboss matches 1 rotated 45 0 run tp @s ~ ~ ~ 45 ~
execute as @e[type=xp:endboss_hitbox] at @s if score direction endboss matches 2 rotated 90 0 run tp @s ~ ~ ~ 90 ~
execute as @e[type=xp:endboss_hitbox] at @s if score direction endboss matches 3 rotated 135 0 run tp @s ~ ~ ~ 135 ~
execute as @e[type=xp:endboss_hitbox] at @s if score direction endboss matches 4 rotated 180 0 run tp @s ~ ~ ~ 180 ~
execute as @e[type=xp:endboss_hitbox] at @s if score direction endboss matches 5 rotated 225 0 run tp @s ~ ~ ~ 225 ~
execute as @e[type=xp:endboss_hitbox] at @s if score direction endboss matches 6 rotated 270 0 run tp @s ~ ~ ~ 270 ~
execute as @e[type=xp:endboss_hitbox] at @s if score direction endboss matches 7 rotated 315 0 run tp @s ~ ~ ~ 315 ~

execute as @e[type=xp:endboss_hitbox,tag=upper_arm,r=1,c=1] at @s positioned ~ ~6.4 ~ run tp @s ^-5.9 ^ ^1.2
execute as @e[type=xp:endboss_hitbox,tag=upper_arm,r=1,c=1] at @s positioned ~ ~5.7 ~ run tp @s ^-4.6 ^ ^
execute as @e[type=xp:endboss_hitbox,tag=upper_arm,r=1,c=1] at @s positioned ~ ~5 ~ run tp @s ^-3.3 ^ ^-1.2
execute as @e[type=xp:endboss_hitbox,tag=upper_arm,r=1,c=1] at @s positioned ~ ~5 ~ run tp @s ^3.3 ^ ^-1.2
execute as @e[type=xp:endboss_hitbox,tag=upper_arm,r=1,c=1] at @s positioned ~ ~5.7 ~ run tp @s ^4.6 ^ ^0
execute as @e[type=xp:endboss_hitbox,tag=upper_arm,r=1,c=1] at @s positioned ~ ~6.4 ~ run tp @s ^5.9 ^ ^1.2

execute as @e[type=xp:endboss_hitbox,tag=lower_arm,r=1,c=1] at @s positioned ~ ~4.9 ~ run tp @s ^-4.2 ^ ^4.6
execute as @e[type=xp:endboss_hitbox,tag=lower_arm,r=1,c=1] at @s positioned ~ ~6 ~ run tp @s ^-5.5 ^ ^3.8
execute as @e[type=xp:endboss_hitbox,tag=lower_arm,r=1,c=1] at @s positioned ~ ~7.1 ~ run tp @s ^-6.8 ^ ^3
execute as @e[type=xp:endboss_hitbox,tag=lower_arm,r=1,c=1] at @s positioned ~ ~7.1 ~ run tp @s ^6.8 ^ ^3
execute as @e[type=xp:endboss_hitbox,tag=lower_arm,r=1,c=1] at @s positioned ~ ~6 ~ run tp @s ^5.5 ^ ^3.8
execute as @e[type=xp:endboss_hitbox,tag=lower_arm,r=1,c=1] at @s positioned ~ ~4.9 ~ run tp @s ^4.2 ^ ^4.6

execute as @e[type=xp:endboss_hitbox,tag=body,r=1,c=1] at @s positioned ~ ~3.5 ~ run tp @s ^1 ^ ^-0.8
execute as @e[type=xp:endboss_hitbox,tag=body,r=1,c=1] at @s positioned ~ ~3.5 ~ run tp @s ^-1 ^ ^-0.8
execute as @e[type=xp:endboss_hitbox,tag=body,r=1,c=1] at @s positioned ~ ~1 ~ run tp @s ^ ^ ^-0.5

execute as @e[type=xp:endboss_hitbox,tag=head,r=1,c=1] at @s positioned ~ ~6.5 ~ run tp @s ^ ^ ^-4.5
execute as @e[type=xp:endboss_hitbox,tag=head,r=1,c=1] at @s positioned ~ ~6.0 ~ run tp @s ^ ^ ^-1.5

execute as @e[type=xp:endboss_hitbox] at @s run tp @s ^ ^ ^1