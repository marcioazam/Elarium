import { world, ItemStack } from "@minecraft/server";



world.afterEvents.itemCompleteUse.subscribe((eventData) => {
  const player = eventData.source
  const item = player.getComponent('equippable').getEquipment('Mainhand')
          if (item?.typeId == 'minecraft:melon_slice') {
            player.runCommandAsync("scoreboard players remove @s hydration 30");
           }
       }
  );

