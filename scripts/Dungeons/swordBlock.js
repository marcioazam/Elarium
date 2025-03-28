import {
  world,
  system,
  ItemStack
}
from "@minecraft/server";



world.afterEvents.itemStartUse.subscribe((event) => {
  const player = event.source;
  const item = event.itemStack;

  if (player.hasTag('dungeons:sword_block')) return;
  if (!item.hasTag('dungeons:blockable_weapon')) return;

  player.addTag('dungeons:sword_block');
});
world.afterEvents.itemStopUse.subscribe((event) => {
  const player = event.source;
  const item = event.itemStack;

  if (!player.hasTag('dungeons:sword_block')) return;

  player.removeTag('dungeons:sword_block');
});