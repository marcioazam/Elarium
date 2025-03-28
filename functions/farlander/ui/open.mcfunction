
# revoke camera control access to retain focus
inputpermission set @initiator camera disabled

# ensure player is in survival
gamemode s @initiator

# set menu state open id
scoreboard players set @initiator uiSceneState 11
