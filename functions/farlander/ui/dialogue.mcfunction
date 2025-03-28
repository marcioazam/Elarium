# check if finished quest dialogue
scoreboard players operation "#dialogue_scene" var = @s dialogueId
scoreboard players operation "#dialogue_scene" var %= "#1000" var
execute unless score @s dialogueId matches 1300..1399 if score @s dialogue >= "#dialogue" var run tag @s add dialogue_quest

# check chat mode
execute unless score @s dialogueId matches 1300..1399 run tag @s add dialogue_basic

# limits
scoreboard players operation "#dialogue" var = @s dialogueId
scoreboard players operation "#dialogue" var /= "#1000" var
execute if score @s dialogue > "#dialogue" var run scoreboard players set @s dialogue 1

# obtain dialogue id digits
scoreboard players operation @s var = @s dialogueId

scoreboard players operation .dialog_digit_1 var = @s var
scoreboard players operation .dialog_digit_1 var %= "#10" var

scoreboard players operation @s var /= "#10" var
scoreboard players operation .dialog_digit_2 var = @s var
scoreboard players operation .dialog_digit_2 var %= "#10" var

scoreboard players operation @s var /= "#10" var
scoreboard players operation .dialog_digit_3 var = @s var
scoreboard players operation .dialog_digit_3 var %= "#10" var

scoreboard players operation @s var = @s dialogue

scoreboard players operation .dialog_digit_4 var = @s var
scoreboard players operation .dialog_digit_4 var %= "#10" var

scoreboard players operation @s var /= "#10" var
scoreboard players operation .dialog_digit_5 var = @s var
scoreboard players operation .dialog_digit_5 var %= "#10" var

# display dialogue
titleraw @s title {"rawtext":[{"text":"_xp:npc:farlander:"},{"score":{"name":".dialog_effect_id","objective":"var"}},{"text":":"},{"score":{"name":".dialog_digit_3","objective":"var"}},{"score":{"name":".dialog_digit_2","objective":"var"}},{"score":{"name":".dialog_digit_1","objective":"var"}},{"score":{"name":".dialog_digit_5","objective":"var"}},{"score":{"name":".dialog_digit_4","objective":"var"}}]}