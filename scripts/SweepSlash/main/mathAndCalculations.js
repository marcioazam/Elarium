// This file is used to store most of the math and calculation functions for the Add-On to run.

import {CooldownManager} from "../../Elarium/System/Manager/Cooldown.js";
import { world, Entity, Player, system } from "@minecraft/server";
import { lambertW0, lambertWm1 } from "./lambertw.js";
import {
  ApplyEffectFromWeapon,
   WeaponDB
} from "../Weapon/Weapons.js";

// This is used to check for debug mode, which is accessible in configuration menu.
export function debug(message) {
  const debugMode = world.getDynamicProperty("debug_mode");
  if (debugMode && message) {
    return console.log(message);
  }
  return debugMode;
}

// This is used to check player's status.
const playerStatus = new WeakMap();

function initializePlayerStatus(player) {
  const status = {
    sprintKnockbackHitUsed: false,
    sprintKnockbackValid: false,
    critSweepValid: true,
    shieldValid: false,
    mace: false,
    attackReady: false,
    showBar: true,
    lastSelectedItem: undefined,
    lastSelectedSlot: undefined,
    cooldown: 0,
    lastAttackTime: 0,
    shieldDelay: 0,
    fallDistance: 0,
  };
  playerStatus.set(player, status);
}

Entity.prototype.getStatus = function () {
  if (!playerStatus.has(this)) {
    initializePlayerStatus(this);
  }
  return playerStatus.get(this);
};

function dotProduct(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}
function magnitude(v) {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}
function calculateAngle(v1, v2) {
  const dot = dotProduct(v1, v2);
  const mag1 = magnitude(v1);
  const mag2 = magnitude(v2);
  return Math.acos(dot / (mag1 * mag2)) * (180 / Math.PI);
}

/**
 * For clamping the number
 * @param {number} num / The number to clamp
 * @param {number} min / Minimum number
 * @param {number} max / Maximum number
 * @returns {number} Clamped number
 */
export function clamp(num, min, max) {
  return Math.max(Math.min(num, Math.max(min, max)), Math.min(min, max));
}

/**
 * Chance dice roll
 * @param {number} num / Represents the chance%
 * @returns {boolean} If the roll is larger than the number specified, return true
 */
export function rng(num) {
  let min = 0;
  let max = 100;
  const math = Math.floor(Math.random() * (max - min) + min);
  return math < clamp(num, min, max);
}

/**
 * Pick number between specified numbers
 * @param {number} min / Minimum number possible
 * @param {number} max / Maximum number possible
 * @returns {number} Get the number between min and max
 */
export function random(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Get the target's center
 * @param {Vector3} vector3 / Offset
 * @returns {Vector3}
 */
Entity.prototype.center = function (vector3 = { x: 0, y: 0, z: 0 }) {
  const { x, y, z } = vector3;
  const c = {
    x: this.location.x + x,
    y: (this.location.y + this.getHeadLocation().y) / 2 + y,
    z: this.location.z + z,
  };

  // wink wink
  return c;
};

/**
 * Get the entity's normalized view direction using rotation
 * @param {number} dist / Distance from the center
 * @param {number} height / Height from the center
 * @returns {Vector3} Player's normalized rotation
 */
Entity.prototype.viewRotation = function (dist = 1, height = 0) {
  const loc = this.location;
  const headLoc = this.getHeadLocation();
  const rot = this.getRotation();

  const viewCenter = {
    x: loc.x - Math.sin(rot.y * (Math.PI / 180)) * dist,
    y: (loc.y + headLoc.y) / 2 + height,
    z: loc.z + Math.cos(rot.y * (Math.PI / 180)) * dist,
  };

  return viewCenter;
};



/**
 * Subtract two Vector3 values
 * @param {Vector3} v1
 * @param {Vector3} v2
 * @returns {Vector3} Subtracted Vector3
 */
export function sub(v1, v2) {
  const vector3 = {
    x: v1.x - v2.x,
    y: v1.y - v2.y,
    z: v1.z - v2.z,
  };
  return vector3;
}

// This function was written by MADLAD3718.
// Attack knockback using Lambert W.
Entity.prototype.applyAttackKnockback = function (location, max_height = 1) {
  const delta = sub(location, this.location);
  const y_max = Math.max(max_height, delta.y + max_height);
  const a = 0.08;
  const d = 0.02;

  const ln = Math.log1p(-d);
  const vy =
    (a *
      (d - 1) *
      (lambertWm1(-Math.exp(-(y_max * d * ln + a * d - a) / (a * (d - 1)))) +
        1)) /
    d;
  const e = Math.exp((delta.y * d * ln + a + d * (vy - a)) / (a * (d - 1)));
  const W = lambertW0((-(a * (d - 1) - vy * d) * e) / (a * (d - 1)));
  const time =
    (-a * (d - 1) * W + delta.y * d * ln + a * (1 - d) + vy * d) /
    (a * (d - 1) * ln);

  const m0 = 1.5;
  const muliplier = (m0 - 1) * Math.pow((66 - Math.min(time, 66)) / 66, 2) + 1;
  const vx = delta.x * 0.33 * muliplier;
  const vz = delta.z * 0.33 * muliplier;
  const v = { x: vx, y: vy, z: vz };
  this.applyImpulseAsKnockback(v);
};

Entity.prototype.applyImpulseAsKnockback = function (vector3) {
  // Extract vector components
  const { x, y, z } = vector3;

  // Calculate horizontal strength based on the magnitude of the vector in the horizontal plane
  const horizontalStrength = Math.sqrt(x * x + z * z);
  const verticalStrength = y; // Vertical strength directly corresponds to the y-component

  // Normalize horizontal direction if there is any horizontal movement
  const directionX = horizontalStrength !== 0 ? x / horizontalStrength : 0;
  const directionZ = horizontalStrength !== 0 ? z / horizontalStrength : 0;

  // Reset velocity before applying knockback
  this.applyKnockback(0, 0, 0, 0);

  this.applyKnockback(
    directionX,
    directionZ,
    horizontalStrength,
    verticalStrength
  );
};

// For playing sounds that's only audible to players with sounds configuration.
function selectiveSound(location, dynamicProperty, dimension, soundId, volume) {
  for (const p of world.getAllPlayers()) {
    if (
      p.getDynamicProperty(dynamicProperty) == true &&
      p.dimension.id == dimension
    ) {
      p.playSound(soundId, { location: location, volume: volume });
    }
  }
}

// For damage particles, with molang variable maps.
export function healthParticle(target, damage) {
  const loc = target.center({ x: 0, y: 0.5, z: 0 });
  const hp = target.getComponent("health");
  const dmg = clamp(damage, hp.effectiveMin, hp.effectiveMax) / 2;
  const amount = Math.trunc(dmg);
  const dimension = target.dimension.id;

  target.dimension.spawnParticle("sweepnslash:damage_indicator_emitter", loc);
}

// Converts vector3 to RGB. Hacky.
export function toColor(vector3) {
  const { x, y, z } = vector3;
  const rgb = {
    red: clamp(x, 0, 255) / 255,
    green: clamp(y, 0, 255) / 255,
    blue: clamp(z, 0, 255) / 255,
  };
  return rgb;
}

// Damage Calculation
// Based on The Minecraft Wiki info
// https://minecraft.wiki/w/Damage
export function getCooldownTime(player, attackSpeed) {
  const speed = attackSpeed || 0.9;

  // cooldown time: T = 20 / attack speed
  let ticks = 20 / speed;

  const haste = Check.effect(player, "haste");
  const miningFatigue = Check.effect(player, "mining_fatigue");

  

  // One tick minimum to prevent unexpected behaviors
  const hasteMultiplier = Math.max(0.05, 1 - haste * 0.1);
  const miningFatigueMultiplier = 1 + miningFatigue * 0.1;
  ticks *= hasteMultiplier * miningFatigueMultiplier;

  const ms = ticks * 50;

  return { ticks, ms };
}

/**
 * 
 * @param {Player} player 
 * @param {number} attackSpeed 
 * @returns 
 */
export function getCooldownTime_VAIMUDARDEPOIS(player, attackSpeed) {
  const speed = attackSpeed || 0.9;
  const haste = Check.effect(player, "haste");
  const miningFatigue = Check.effect(player, "mining_fatigue");

  var cooldownInCache = CooldownManager.getCooldownWeapon(attackSpeed, haste, miningFatigue);

  if (cooldownInCache && cooldownInCache.size > 0) {
    console.log("Cooldown in cache");
    return cooldownInCache;
  }

  let ticks = 20 / speed;
  // One tick minimum to prevent unexpected behaviors
  const hasteMultiplier = Math.max(0.05, 1 - haste * 0.1);
  const miningFatigueMultiplier = 1 + miningFatigue * 0.1;
  ticks *= hasteMultiplier * miningFatigueMultiplier;

  const ms = ticks * 50;

  const cooldown = { ticks, ms };

  CooldownManager.setCooldownWeapon(attackSpeed, haste, miningFatigue, cooldown);

  return cooldown;
}

function calculateEnchantmentEfficiency(timeSinceLastAttack, maxTime) {
  return Math.min(timeSinceLastAttack / maxTime, 1);
}

// Return the stats of the weapon from player's weapon.
Entity.prototype.getItemStats = function () {
  const equippableComp = this.getComponent("equippable");
  const item = equippableComp?.getEquipment("Mainhand");
  const stats = WeaponDB.getWeapon(item?.typeId);
  return { equippableComp, item, stats };
};

Entity.prototype.isTamed = function ({ excludeTypes = [] } = {}) {
  if (excludeTypes.includes(this.typeId)) return false;
  return this.getComponent("is_tamed")?.isValid();
};

// Boolean check whether the player is riding anything or not. Used for shield check.
// ex) Entity.isRiding == true
Object.defineProperty(Entity.prototype, "isRiding", {
  get: function () {
    return this.getComponent("riding")?.isValid() ?? false;
  },
});

// Return the entity the player is riding on.
Entity.prototype.getRidingOn = function () {
  return this.getComponent("riding")?.entityRidingOn;
};
// Return an array of the entities riding on an player.
Entity.prototype.getRiders = function () {
  return this.getComponent("rideable")?.getRiders();
};

export class Check {
  static inanimate(entity, { excludeTypes = [] } = {}) {
    const inanimateArray = [
      "minecraft:painting",
      "minecraft:falling_block",
      "minecraft:tnt",
      "minecraft:fishing_hook",
      "minecraft:item",
      "minecraft:xp_orb",
    ];

    if (excludeTypes.includes(entity.typeId)) return false;

    return (
      entity.getComponent("type_family")?.hasTypeFamily("inanimate") ||
      inanimateArray.some((e) => e === entity.typeId)
    );
  }

  // Check enchantment level.
  static enchantLevel(item, id) {
    if (!item) return;
    const level = item.getComponent("enchantable")?.getEnchantment(id)?.level;
    return level ?? 0;
  }

 /**
   @param {Player} player
   */
  static effect(player, id) {
    const getEffect = player.getEffect(id);
    return getEffect ? getEffect.amplifier + 1 : 0;
  }

  // Durability reduction code.
  static durability(player, equippableComp, item, stats) {
    if (player.getGameMode() === "creative") return;
    const unbreakingLevel = this.enchantLevel(item, "unbreaking");
    const breakChance = 100 / (unbreakingLevel + 1);
    const randomizeChance = Math.random() * 100;
    if (breakChance < randomizeChance) return;

    const durabilityComp = item?.getComponent("durability");
    if (!durabilityComp || !stats) return;

    let durabilityModifier = stats?.IsMelee ? 1 : 2;
    durabilityComp.damage = Math.min(
      durabilityComp.damage + durabilityModifier,
      durabilityComp.maxDurability
    );

    const maxDurability = durabilityComp.maxDurability;
    const currentDamage = durabilityComp.damage;
    if (currentDamage >= maxDurability) {
      player.dimension.playSound("random.break", player.getHeadLocation());
      equippableComp.setEquipment("Mainhand", undefined);
    } else if (currentDamage < maxDurability) {
      equippableComp.setEquipment("Mainhand", item);
    }
  }

  // For checking if the player's attack is a critical hit or a sprint knockback hit.
  static specialValid(
    currentTime,
    player,
    stats,
    cooldownMS = 0,
    statusPlayer = null
  ) {
    var status = null;

    if (statusPlayer == null) {
      status = player.getStatus();
    } else {
      status = statusPlayer;
    }

    const timeSinceLastAttack = currentTime - status.lastAttackTime;

    var cooldownTime = 0;

    if (cooldownMS === 0) {
      cooldownTime = getCooldownTime(player, stats?.AttackSpeed).ms;
    } else {
      cooldownTime = cooldownMS;
    }

    const cooldownPercent = (timeSinceLastAttack / cooldownTime) * 100;
    return cooldownPercent > 84.8;
  }
  
  // Duh.
  static criticalHit(currentTime, player, target, stats, { damage, noEffect }) {
    if (
      this.inanimate(target, {
        excludeTypes: ["minecraft:armor_stand"],
      })
    )
      return;
    if (damage <= 0) return;
    const status = player.getStatus();
    const shieldBlock = Check.shieldBlock(currentTime, player, target, stats);
    const dimension = player.dimension;

    const isValid =
      player.isFalling &&
      !player.isOnGround &&
      !player.isInWater &&
      !player.isFlying &&
      !player.isClimbing &&
      !this.effect(player, "blindness") &&
      !this.effect(player, "slow_falling") &&
      this.specialValid(currentTime, player, stats, 0) &&
      !player.getComponent("riding")?.entityRidingOn &&
      status.critSweepValid &&
      !shieldBlock;
    if (!noEffect && isValid) {
      dimension.spawnParticle(
        "minecraft:critical_hit_emitter",
        target.center({ x: 0, y: 1, z: 0 })
      );
      selectiveSound(
        target.location,
        "critSound",
        dimension,
        "entity.player.attack.crit",
        2
      );
    }
    return isValid;
  }

  // Duh 2
  static sprintKnockback(currentTime, player, target, stats, { damage }) {
    if (
      this.inanimate(target, {
        excludeTypes: [
          "minecraft:armor_stand",
          "minecraft:boat",
          "minecraft:chest_boat",
          "minecraft:minecart",
          "minecraft:command_block_minecart",
          "minecraft:hopper_minecart",
          "minecraft:tnt_minecart",
        ],
      })
    )
      return;
    if (damage <= 0) return;
    const status = player.getStatus();
    const isValid =
      this.specialValid(currentTime, player, stats, 0) &&
      status.sprintKnockbackValid &&
      !player.isInWater;
    if (isValid) {
      status.sprintKnockbackHitUsed = true;
      player.dimension.playSound(
        "entity.player.attack.knockback",
        player.location
      );
    }
    return isValid;
  }

  // Duh 2 Epsiode 2
  static sweep(currentTime, player, target, stats, { fireAspect, damage }) {
    const status = player.getStatus();
    if (
      !(
        stats?.SweepAttack &&
        this.specialValid(currentTime, player, stats, 0) &&
        status.critSweepValid
      )
    )
      return;
    if (!player.isOnGround || player.isRiding) return;
    if (damage <= 0) return;
    if (
      this.inanimate(target, {
        excludeTypes: [
          "minecraft:armor_stand",
          "minecraft:boat",
          "minecraft:chest_boat",
          "minecraft:minecart",
          "minecraft:command_block_minecart",
          "minecraft:hopper_minecart",
          "minecraft:tnt_minecart",
        ],
      })
    )
      return;

    const dist = 1.4;
    const height = 0.1;
    const sweepEdgeLvl = 1;

    const pLoc = player.location;
    const tLoc = target.location;
    const headLoc = player.getHeadLocation();
    const dimension = player.dimension;

    if (this.view(player) === target) {
      dimension.spawnParticle(
        "edx:sweep_attack",
        player.viewRotation(dist, height)
      );
    } else {
      const direction = sub(tLoc, pLoc);
      const magnitude = Math.sqrt(direction.x ** 2 + direction.z ** 2);
      const unitDirection = {
        x: direction.x / magnitude,
        z: direction.z / magnitude,
      };
      const particleLocation = {
        x: pLoc.x + unitDirection.x * dist,
        y: (pLoc.y + headLoc.y) / 2 + height,
        z: pLoc.z + unitDirection.z * dist,
      };
      dimension.spawnParticle("edx:sweep_attack", particleLocation);
    }
    player.dimension.playSound("entity.player.attack.sweep", pLoc);

    const playerCenter = player.dimension.getEntities({
      location: pLoc,
      maxDistance: 3,
    });
    const targetCenter = player.dimension.getEntities({
      location: { x: tLoc.x - 1.5, y: tLoc.y, z: tLoc.z - 1.5 },
      volume: { x: 3, y: 0.25, z: 3 },
    });

    const commonEntities = playerCenter.filter(
      (entity) =>
        targetCenter.some((targetEntity) => targetEntity === entity) &&
        !this.inanimate(entity) &&
        entity !== target &&
        entity !== player.getRidingOn() &&
        entity !== player &&
        (!player.getDynamicProperty("excludePetFromSweep") ||
          (player.getDynamicProperty("excludePetFromSweep") &&
            !entity.isTamed({ excludeTypes: ["minecraft:trader_llama"] })))
    );
    commonEntities.forEach((e) => {
      let dmgType = this.shieldBlock(currentTime, player, e, stats)
        ? "entityExplosion"
        : "entityAttack";

      let formula = 1 + damage * (sweepEdgeLvl / (sweepEdgeLvl + 1));

      e.applyDamage(formula, { cause: dmgType, damagingEntity: player });
      try {
        e.setOnFire(fireAspect * 4, true);
      } catch (e) {
        debug(e + "\n" + "setOnFire skipped");
      }
    });
  }

  // Also shield angle check.
  static angle(player, target) {
    const viewDir = target.getViewDirection();
    const pLoc = target.location;
    const entities = target.dimension.getEntities({
      location: target.location,
    });
    const inViewEntities = entities.filter((entity) => {
      const eLoc = entity.location;
      const toEntityVec = sub(eLoc, pLoc);
      const angle = calculateAngle(viewDir, toEntityVec);
      return angle >= -90 && angle <= 90;
    });
    return inViewEntities.some((e) => player === e);
  }

  static shield(target) {
    const equippable = target.getComponent("equippable");
    if (!equippable) return false;

    const shieldCooldown = target.getItemCooldown("minecraft:shield");

    return ["Mainhand", "Offhand"].some(slot => {
        const item = equippable.getEquipment(slot);
        return item?.typeId === "minecraft:shield" && (target.isSneaking || target.isRiding) && shieldCooldown === 0;
    });
}

  // For handling shield block. Refer to class.js
  // Also disables the shield if the attacker has an axe
  static shieldBlock(currentTime, player, target, stats) {
    const status = target.getStatus();
    let angle = false;
    let specialValid = true;

    if (world.getDynamicProperty("shieldBreakSpecial"))
      specialValid = Check.specialValid(currentTime, player, stats, 0);

    if (status.shieldValid) {
      angle = this.angle(player, target);
      if (stats?.UseShield == false && angle && specialValid) {
        target.startItemCooldown("minecraft:shield", 100);
        player.dimension.playSound("random.break", target.location);
      }
    }
    return angle;
  }

  // Self explanatory
  static calculateDamage(
    weapon,
    player,
    target,
    item,
    currentTime,
    timeSinceLastAttack
  ) {
    var attackSpeed = weapon?.AttackSpeed || 0.9;
    var randomDamage = weapon?.Damage || [1, 1];

    var baseDamage =
      randomDamage[0] + Math.random() * (randomDamage[1] - randomDamage[0]);

    const T = getCooldownTime(player, attackSpeed).ms;
    const t = Math.min(timeSinceLastAttack, T);
    var crit = this.criticalHit(currentTime, player, target, weapon, {
      noEffect: true,
    })
      ? 1.5
      : 1;

    // damage multiplier = 0.2 + ((t + 0.5) / T) ^ 2 * 0.8
    const multiplier = 0.2 + Math.pow((t + 0.5) / T, 2) * 0.8;
    // clamp multiplier to the range 0.2 ~ 1
    const clampedMultiplier = clamp(multiplier, 0.2, 1);

    const familyArray = ["undead", "arthropod"];
    const enchantArray = ["smite", "bane_of_arthropods"];

    const targetFamily = target.getComponent("type_family");

    let enchantBonus = 0;
    const enchantmentEfficiency = calculateEnchantmentEfficiency(
      timeSinceLastAttack,
      getCooldownTime(player, attackSpeed).ms
    );

    // Enchantment damage bonus calculation, based on target's family
    familyArray.forEach((family, index) => {
      if (targetFamily?.hasTypeFamily(family)) {
        const enchantLevel = this.enchantLevel(item, enchantArray[index]);
        if (enchantLevel > 0) {
          enchantBonus += Math.ceil(enchantLevel * 2.5 * enchantmentEfficiency);
        }
      }
    });

    let sharpnessLevel = this.enchantLevel(item, "sharpness");
    const strengthModifier = this.effect(player, "strength") * 3;
    const weaknessModifier = this.effect(player, "weakness") * 4;

    if (sharpnessLevel > 0) {
      sharpnessLevel = 0.5 * sharpnessLevel + 0.5;
      enchantBonus += sharpnessLevel * enchantmentEfficiency;
      // Credits to LimonMirbon for pointing out sharpness damage!
    }

    if (enchantBonus > 0) {
      target.dimension.spawnParticle(
        "sweepnslash:enchanted_hit_emitter",
        target.location
      );
    }

    // if (enchantBonus > 0 && weaknessModifier) player.onScreenDisplay.setActionBar("There is a bug where attacking with sharpness or any damage bonus enchantments\nweapons while having weakness effect bugs out the vanilla combat.\nThis is unfortunately not fixable. Sorry!")

    // Return 0 damage if cooldown is still active
    if (T > timeSinceLastAttack) {
      return 0;
    }
  

    if (weapon) {
      try{
        baseDamage = ApplyEffectFromWeapon(
          weapon,
          player,
          baseDamage,
          target,
          timeSinceLastAttack,
          crit
        );
      }
      catch(e){
        debug(`Erro ao aplicar efeito da arma: ${e}`);
      }
    }

    const damage =
      ((baseDamage + (strengthModifier - weaknessModifier)) * crit +
        enchantBonus) *
      clampedMultiplier;

    return damage;
  }

  // Final damage calculation.
  static damageCalculation(currentTime, player, target, item, stats) {
    const status = player.getStatus();
    const lastAttackTime = status.lastAttackTime;
    const timeSinceLastAttack = currentTime - lastAttackTime;

    const finalDamage = Math.max(
      0,
      this.calculateDamage(
        stats,
        player,
        target,
        item,
        currentTime,
        timeSinceLastAttack
      )
    );

    return finalDamage;
  }

  static view(player) {
    const entities = player.getEntitiesFromViewDirection({
      maxDistance: 3,
      excludeTypes: [
        "item",
        "xp_orb",
        "arrow",
        "ender_pearl",
        "snowball",
        "egg",
        "painting",
        "tnt",
        "fishing_hook",
        "falling_block",
      ],
    });

    if (!entities.length) return null; // 🔹 Retorna imediatamente se não houver entidades

    const targetEntity = entities[0].entity;

    // 🔹 Verifica se é uma entidade inanimada de forma otimizada
    return targetEntity &&
      !this.inanimate(targetEntity, { excludeTypes: ["minecraft:armor_stand"] })
      ? targetEntity
      : null;
  }

  static block(player) {
    return player.getBlockFromViewDirection({
      maxDistance: 8,
      includeLiquidBlocks: false,
    });
  }
}
