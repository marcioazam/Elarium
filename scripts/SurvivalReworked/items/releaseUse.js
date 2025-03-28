import { world } from "@minecraft/server";
import {Damage} from "../items/item_components"
// Subscribe to the `itemReleaseUse` event, which is triggered when a player releases the use of an item
world.afterEvents.itemReleaseUse.subscribe((eventData) => {
    const { source, itemStack,useDuration } = eventData;
    const equipment = source.getComponent('equippable');
    const selectedItem = equipment.getEquipment('Mainhand');
    if(selectedItem.typeId == "edx:blaze_blade" && useDuration<170)
    {
        const view = source.getViewDirection()
        const head = source.getHeadLocation()
        const direction = { x: head.x + view.x, y: head.y + view.y, z: head.z + view.z }
        source.dimension.spawnEntity('edx:fire_strike', direction).getComponent("minecraft:projectile").shoot(view);
        source.dimension.playSound('mob.blaze.shoot',source.location);
        Damage(source,itemStack) 
    }
});