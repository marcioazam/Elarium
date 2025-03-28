import { world, system, ItemTypes, ItemStack, EnchantmentType } from "@minecraft/server";
import { Vector } from "./Vector3";
import { getConfigValue } from "../Events/IntervalFunctions/Roll.js";

let resistance_data = {};

export function getResistanceValue(source){
    let equip = source.getComponent("minecraft:equippable");

    let armor = [];
    armor[0] = equip.getEquipment("Head");
    armor[1] = equip.getEquipment("Chest");
    armor[2] = equip.getEquipment("Legs");
    armor[3] = equip.getEquipment("Feet");
    let value = 0;

    for(let item of armor){
        if(item == undefined) continue;
        if(resistance_data[item.typeId] != undefined){
            value += resistance_data[item.typeId];
        }
    }
    // value *= max_y;
    value *= getConfigValue("rns:movement_fix") * 0.8;
    value = Math.min(value, 0.999);
    return value;
}
