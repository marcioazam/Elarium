import { world, system  } from "@minecraft/server";

// This is a Set containing a collection of valid effect types.
const validEffectTypes = new Set([
  "absorption", "bad_omen", "blindness", "clear", "conduit_power", "darkness",
  "fatal_poison", "fire_resistance", "haste", "health_boost", "hunger", 
  "instant_damage", "instant_health", "invisibility", "jump_boost", 
  "levitation", "mining_fatigue", "nausea", "night_vision", "poison", 
  "regeneration", "resistance", "saturation", "slow_falling", "slowness", 
  "speed", "strength", "village_hero", "water_breathing", "weakness", "wither"
]);

/**
 * Object array defining the items, along with the effect(s) and modifiers assigned to them.
 * 
 * itemTypeId: string; - The typeId of the item.
 * effects: {
 *      effectType: string; - The type of effect applied by the item.
 *      duration: number; - The duration of the effect applied by the item in seconds.
 *      amplifier: number; - The amplifier of the effect applied by the item.
 *      showParticles: boolean; - Indicates whether particles are shown for the effect.
 * }[];
 * 
 */
const itemEffects = [
  {
    itemTypeId: "edx:crimsonspire_cap",
    effects: [
      { effectType: "nausea", duration: 15, amplifier: 0, showParticles: true }
    ]
  },
  {
    itemTypeId: "edx:crimsonspire_slice",
    effects: [
      { effectType: "nausea", duration: 5, amplifier: 0, showParticles: true }
    ]
  },
  {
    itemTypeId: "edx:blue_energy_stew",
    effects: [
      { effectType: "speed", duration: 60, amplifier: 0, showParticles: true }
    ]
  },
  {
    itemTypeId: "edx:eye_globe",
    effects: [
      { effectType: "night_vision", duration: 20, amplifier: 0, showParticles: true }
    ]
  },
  {
    itemTypeId: "edx:fire_agave_leaf",
    effects: [
      { effectType: "fire_resistance", duration: 60, amplifier: 0, showParticles: true }
    ]
  },
  {
    itemTypeId: "edx:fire_agave_leaf",
    effects: [
      { effectType: "strength", duration: 12, amplifier: 0, showParticles: true }
    ]
  },
  {
    itemTypeId: "edx:blindness_potion",
    effects: [
      { effectType: "blindness", duration: 33, amplifier: 0, showParticles: true }
    ]
  },
  {
    itemTypeId: "edx:long_levitation_potion",
    effects: [
      { effectType: "levitation", duration: 240, amplifier: 0, showParticles: true }
    ]
  },
  {
    itemTypeId: "edx:strength_potion",
    effects: [
      { effectType: "strength", duration: 240, amplifier: 1, showParticles: true }
    ]
  },
  {
    itemTypeId: "edx:long_blindness_potion",
    effects: [
      { effectType: "blindness", duration: 120, amplifier: 0, showParticles: true }
    ]
  },
  {
    itemTypeId: "edx:levitation_potion",
    effects: [
      { effectType: "levitation", duration: 90, amplifier: 0, showParticles: true }
    ]
  },
  {
    itemTypeId: "edx:levitation_potion",
    effects: [
      { effectType: "levitation", duration: 90, amplifier: 0, showParticles: true }
    ]
  },
  {
    itemTypeId: "edx:yellow_energy_stew",
    effects: [
      { effectType: "haste", duration: 60, amplifier: 0, showParticles: true }
    ]
  }
];

world.afterEvents.itemCompleteUse.subscribe(evd => {
  const { source: entity, itemStack: itemUsed } = evd;
  const player = evd.source;
  var item = evd.itemStack
  if (item.typeId === "edx:blue_energy_stew")
   {
    system.run(() => {
      player.runCommand(`give @s bowl`)
    });
  }
  if (item.typeId === "edx:yellow_energy_stew")
  {
   system.run(() => {
     player.runCommand(`give @s bowl`)
   });
 }
 if (item.typeId === "edx:chorus_stew")
 {
  system.run(() => {
    player.runCommand(`give @s bowl`)
  });
}
if (item.typeId === "edx:blindness_potion")
{
 system.run(() => {
   player.runCommand(`give @s glass_bottle`)
 });
}
if (item.typeId === "edx:levitation_potion")
{
 system.run(() => {
   player.runCommand(`give @s glass_bottle`)
 });
}
if (item.typeId === "edx:long_blindness_potion")
{
 system.run(() => {
   player.runCommand(`give @s glass_bottle`)
 });
}
if (item.typeId === "edx:long_levitation_potion")
{
 system.run(() => {
   player.runCommand(`give @s glass_bottle`)
 });
}
if (item.typeId === "edx:strength_potion")
{
 system.run(() => {
   player.runCommand(`give @s glass_bottle`)
 });
}
if (item.typeId === "edx:muscle_fiber")
{
  player.runCommand(`effect @s strength 15 0`)
}
if (item.typeId === "edx:oozeshroom_juice")
  {
   system.run(() => {
    let health = player.getComponent("health")
    if(player.getEffect("wither")!=undefined)
    {
      health.setCurrentValue(health.currentValue+4)
      player.runCommand(`give @s glass_bottle`)
    }
    player.removeEffect("wither")
   });
  }
if (item.typeId === "edx:snow_cone")
{
 system.run(() => {
   player.runCommand(`give @s paper`)
 });
}
if (item.typeId === "edx:suspicious_pie")
{
 system.run(() => {
   player.runCommand(`event entity @s suspicious_pie`)
 });
}

if (item.typeId === "edx:fire_potion")
  {
   system.run(() => {
     player.runCommand(`scoreboard players set @s Fire_breath 220`)
     player.runCommand(`give @s glass_bottle`)
   });
  }
  // This returns if the entity is not a player, or itemUsed is undefined.
  if (entity.typeId !== "minecraft:player" || !itemUsed) return;

  // This searches for a item in the itemEffects array matching the itemUsed.
  const foundItem = itemEffects.find(item => item.itemTypeId === itemUsed.typeId);

  // If the item is within the itemEffects array, then it will apply the effect(s) and modifiers assigned to the itemUsed.
  if (foundItem) {
    foundItem.effects.forEach(effectInfo => {
      const { effectType, duration, amplifier, showParticles } = effectInfo;


      // This returns if effectType is invalid.
      if (!validEffectTypes.has(effectType)) return console.error(`§cError:§r §7Invalid effect type '§r${effectType}§7' detected.`);

      // This converts duration from seconds into ticks.
      const durationInTicks = 20 * duration;
      // This returns if durationValue is not within a valid range (1 to 20,000,000 ticks).
      // The error message is based on the duration in seconds.
      if (durationInTicks < 1 || durationInTicks > 20000000) return console.error(`§cError:§r §7Duration value '§r${duration}§7' is not within the valid range (0 to 1,000,000 seconds).`);

      // This returns if amplifierValue is not within a valid range (0 to 255).
      if (amplifier < 0 || amplifier > 255) return console.error(`§cError:§r §7Amplifier value '§r${amplifier}§7' is not within the valid range (0 to 255).`);

      // This returns if the showParticles value is not a boolean.
      if (typeof showParticles !== 'boolean') return console.error(`§cError:§r §7Invalid value '§r${showParticles}§7' for showParticles. It must be a boolean type (true or false).`);


      entity.addEffect(effectType, durationInTicks, { amplifier, showParticles });
    });
  }
});