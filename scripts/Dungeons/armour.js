import {
  world
}
from "@minecraft/server";

// TURTLE ARMOUR
world.afterEvents.entityHealthChanged.subscribe((event) => {
  const player = event.entity;
  const oldValue = event.oldValue;
  const newValue = event.newValue;
  const dif = newValue - oldValue;
  if (player.typeId !== 'minecraft:player') {
    return;
  }
  if (!player.hasTag('dungeons:nimble_turtle_armour') && !player.hasTag('dungeons:turtle_armour')) {
    return;
  }
  if (newValue < oldValue) {
    return;
  }
  if (player.hasTag('dungeons:healing')) return;
  player.addTag('dungeons:healing');
  let hp = player.getComponent('minecraft:health')
  hp.setCurrentValue(hp.currentValue + (dif / 3));
  player.removeTag('dungeons:healing');
});