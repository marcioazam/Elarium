import { system, world } from "@minecraft/server";

import { FOOD_SATURATION } from "./food_saturation";

const S_MAX = 20;



world.afterEvents.itemCompleteUse.subscribe((e) => {
    const { itemStack, source } = e;
    const itemId = itemStack.typeId;

    const saturationValue = FOOD_SATURATION[itemId] || 0;
    if (saturationValue === 0) return;
    const currentSaturation = source.getDynamicProperty("jc:saturation") || 0;

    const newSaturation = Math.min(currentSaturation + saturationValue, S_MAX);

    source.setDynamicProperty("jc:saturation", Number(newSaturation.toPrecision(2)));
});


world.beforeEvents.effectAdd.subscribe((e) => {
    if (e.entity?.typeId !== "minecraft:player" || e.effectType !== "Hunger") return;
    if (e.duration > 5) e.cancel = true;
});
