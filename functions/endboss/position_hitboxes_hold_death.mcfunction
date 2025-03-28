tp @e[type=xp:endboss_hitbox] ~ ~ ~

execute as @e[type=xp:endboss_hitbox] at @s if score direction endboss matches 0 rotated 0 0 run tp @s ~ ~ ~ 0 ~
execute as @e[type=xp:endboss_hitbox] at @s if score direction endboss matches 1 rotated 45 0 run tp @s ~ ~ ~ 45 ~
execute as @e[type=xp:endboss_hitbox] at @s if score direction endboss matches 2 rotated 90 0 run tp @s ~ ~ ~ 90 ~
execute as @e[type=xp:endboss_hitbox] at @s if score direction endboss matches 3 rotated 135 0 run tp @s ~ ~ ~ 135 ~
execute as @e[type=xp:endboss_hitbox] at @s if score direction endboss matches 4 rotated 180 0 run tp @s ~ ~ ~ 180 ~
execute as @e[type=xp:endboss_hitbox] at @s if score direction endboss matches 5 rotated 225 0 run tp @s ~ ~ ~ 225 ~
execute as @e[type=xp:endboss_hitbox] at @s if score direction endboss matches 6 rotated 270 0 run tp @s ~ ~ ~ 270 ~
execute as @e[type=xp:endboss_hitbox] at @s if score direction endboss matches 7 rotated 315 0 run tp @s ~ ~ ~ 315 ~

execute as @e[type=xp:endboss_hitbox,tag=upper_arm,r=1,c=1] at @s positioned ~ ~-1 ~ run tp @s ^-6.4 ^ ^6.5
execute as @e[type=xp:endboss_hitbox,tag=upper_arm,r=1,c=1] at @s positioned ~ ~-1 ~ run tp @s ^-4.8 ^ ^5.4
execute as @e[type=xp:endboss_hitbox,tag=upper_arm,r=1,c=1] at @s positioned ~ ~-1 ~ run tp @s ^-3.2 ^ ^4.5
execute as @e[type=xp:endboss_hitbox,tag=upper_arm,r=1,c=1] at @s positioned ~ ~-1 ~ run tp @s ^3.2 ^ ^4.5
execute as @e[type=xp:endboss_hitbox,tag=upper_arm,r=1,c=1] at @s positioned ~ ~-1 ~ run tp @s ^4.8 ^ ^5.4
execute as @e[type=xp:endboss_hitbox,tag=upper_arm,r=1,c=1] at @s positioned ~ ~-1 ~ run tp @s ^6.4 ^ ^6.5

execute as @e[type=xp:endboss_hitbox,tag=lower_arm,r=1,c=1] at @s positioned ~ ~-1 ~ run tp @s ^-11.6 ^ ^9.7
execute as @e[type=xp:endboss_hitbox,tag=lower_arm,r=1,c=1] at @s positioned ~ ~-1 ~ run tp @s ^-9.8 ^ ^8.5
execute as @e[type=xp:endboss_hitbox,tag=lower_arm,r=1,c=1] at @s positioned ~ ~-1 ~ run tp @s ^-8.0 ^ ^7.5
execute as @e[type=xp:endboss_hitbox,tag=lower_arm,r=1,c=1] at @s positioned ~ ~-1 ~ run tp @s ^8.0 ^ ^7.5
execute as @e[type=xp:endboss_hitbox,tag=lower_arm,r=1,c=1] at @s positioned ~ ~-1 ~ run tp @s ^9.8 ^ ^8.5
execute as @e[type=xp:endboss_hitbox,tag=lower_arm,r=1,c=1] at @s positioned ~ ~-1 ~ run tp @s ^11.6 ^ ^9.7

execute as @e[type=xp:endboss_hitbox,tag=body,r=1,c=1] at @s positioned ~ ~ ~ run tp @s ^1 ^ ^5
execute as @e[type=xp:endboss_hitbox,tag=body,r=1,c=1] at @s positioned ~ ~ ~ run tp @s ^-1 ^ ^5
execute as @e[type=xp:endboss_hitbox,tag=body,r=1,c=1] at @s positioned ~ ~ ~ run tp @s ^ ^ ^2

execute as @e[type=xp:endboss_hitbox,tag=head,r=1,c=1] at @s positioned ~ ~-0.5 ~ run tp @s ^ ^ ^7
execute as @e[type=xp:endboss_hitbox,tag=head,r=1,c=1] at @s positioned ~ ~0.5 ~ run tp @s ^ ^ ^8.5

execute as @e[type=xp:endboss_hitbox] at @s run tp @s ^ ^ ^1