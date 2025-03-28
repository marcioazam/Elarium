import {
  world,
  system,
  ItemStack,
  EntityDamageCause,
  MolangVariableMap,
  TicksPerSecond,
  Player
} from "@minecraft/server";

import { EventQueue } from "../Elarium/System/Core/Queue.js";

import {
  Check,
  healthParticle,
} from "../SweepSlash/main/mathAndCalculations.js";

import { DurabilityArmorViewer } from "../OthersMods/main_durability.js";

const ignoreBlock = [
  "anvil",
  "campfire",
  "contact",
  "drowning",
  "fall",
  "fallingBlock",
  "fire",
  "fireTick",
  "flyIntoWall",
  "freezing",
  "lava",
  "lightning",
  "magic",
  "magma",
  "none",
  "selfDestruct",
  "sonicBoom",
  "soulCampfire",
  "stalagmite",
  "stalactite",
  "starve",
  "suffocation",
  "suicide",
  "temperature",
  "void",
  "wither",
];

function findRicochet(target, player, arrow, damage, mult) {
  let rand = Math.random();
  if (rand > 0.75) return;
  target.addTag("dungeons:ricocheted");

  const damageRange = target.dimension.getEntities({
    location: target.location,
    maxDistance: 8,
    closest: 1,
    families: ["monster"],
    excludeTags: ["dungeons:ricocheted"],
  });
  for (const enemy of damageRange) {
    enemy.applyDamage((mult * damage) / 2, {
      cause: "entityAttack",
      damagingEntity: player,
    });

    target.dimension.spawnParticle("dungeons:ricochet_shot", target.location);
    target.dimension.playSound("weapon.enchant.ricochet", target.location);

    system.runTimeout(() => {
      findRicochet(enemy, player, arrow, damage, mult);
    }, 4);
  }

  system.runTimeout(() => {
    target.removeTag("dungeons:ricocheted");
  }, 30);
}

function isFamily(family, entity) {
  try {
    entity.runCommand(`testfor @s[family=${family}]`);
    return true;
  } catch {
    return false;
  }
}

function getKnockbackValue(itemUsed) {
  var value = 1;
  if (
    itemUsed?.getComponent("enchantable")?.getEnchantment("knockback")?.level >
    0
  )
    value =
      itemUsed?.getComponent("enchantable")?.getEnchantment("knockback")
        ?.level * 1.25;
  return value;
}

function getScore(player, objective) {
  try {
    const s = world.scoreboard.getObjective(objective);
    if (!s) world.scoreboard.addObjective(objective, objective);
    return s.getScore(player.scoreboardIdentity) != 0
      ? s.getScore(player.scoreboardIdentity)
      : 1;
  } catch {
    return 1;
  }
}

function getDamage(player, damage) {
  if (player.hasTag("charged_hit_scroll")) {
    damage *= 1.2;
  }
  if (player.hasTag("chaining_scroll")) {
    damage *= 1 + 0.1 * getScore(player, "Chaining");
  }
  damage = Math.round(damage * 100) / 100; // 2 chiffres apres virgule
  return damage;
}

function snareling_web(event) {
  const hurtEntity = event.hurtEntity;
  const damageSource = event.damageSource.damagingEntity;
  const damageProjectile = event.damageSource.damagingProjectile;
  if (!damageSource || !damageProjectile) {
    return;
  }
  if (
    damageSource.typeId === "dungeons:snareling" &&
    damageProjectile.typeId === "dungeons:snareling_ammo"
  ) {
    hurtEntity.runCommandAsync("function snareling_web");
  }
}

function enchanted_sheep(event) {
  const damage = event.damage;
  const hurtEntity = event.hurtEntity;
  const damageSource = event.damageSource.damagingEntity;
  if (!damageSource) {
    return;
  }
  if (damageSource.typeId === "dungeons:enchanted_sheep") {
    //0 = red
    if (damageSource.hasTag("sheep_red")) {
      hurtEntity.setOnFire(damage * 2, true);
    }
    //1 = green
    if (damageSource.hasTag("sheep_green")) {
      hurtEntity.addEffect("poison", damage * 18, {
        amplifier: 1,
        showParticles: true,
      });
    }
    //2 = blue
    if (damageSource.hasTag("sheep_blue")) {
      hurtEntity.addEffect("slowness", 80, {
        amplifier: damage,
        showParticles: true,
      });
    }
  }
}

function spongeStrikerCharge(event) {
  const hurtEntity = event.hurtEntity;
  const damage = event.damage;
  if (hurtEntity.typeId !== "minecraft:player") return;
  const score = world.scoreboard
    .getObjective("spongeStrikerCharge")
    .getScore(hurtEntity);

  if (Math.floor(damage) > 50) {
    world.scoreboard
      .getObjective("spongeStrikerCharge")
      .setScore(hurtEntity, 50);
  } else if (Math.floor(damage) > score && score < 50) {
    world.scoreboard
      .getObjective("spongeStrikerCharge")
      .setScore(hurtEntity, Math.ceil(damage));
  } else {
    world.scoreboard
      .getObjective("spongeStrikerCharge")
      .addScore(hurtEntity, 1);
  }
}

function DungeonsConfig(e) {

  const target = e.hurtEntity;
  const player = e.damageSource.damagingEntity;
  const arrow = e.damageSource.damagingProjectile;
  if (!player || !arrow) return;
  if (arrow.isValid() === false) return;
  const dim = arrow.dimension;
  const damage = e.damage;

  if (!arrow.hasTag("dungeons:arrow")) return;
  //DEBUG
  if (player.hasTag("dungeons:debug")) {
    const tags = arrow.getTags();
    for (const tag of tags) {
      world.sendMessage(`${tag}`);
    }
  }

  if (!arrow.hasTag("dungeons:pierced")) {
    //COG CROSSBOW
    if (
      arrow.hasTag("dungeons:pride_of_the_piglins") ||
      arrow.hasTag("dungeons:cog_crossbow")
    ) {
      target.applyDamage(damage * 1.5, {
        damagingProjectile: arrow,
        damagingEntity: player,
      });
    }
  }
  //HEAVY CROSSBOW
  if (
    arrow.hasTag("dungeons:heavy_crossbow") ||
    arrow.hasTag("dungeons:doom_crossbow") ||
    arrow.hasTag("dungeons:slayer_crossbow")
  ) {
    target.applyDamage(damage * 1.25, {
      damagingProjectile: arrow,
      damagingEntity: player,
    });
  }
  //SLAYER RICOCHET
  if (arrow.hasTag("dungeons:slayer_crossbow")) {
    findRicochet(target, player, arrow, damage, 1.25);
  }
  //HARPOON CROSSBOW
  if (
    arrow.hasTag("dungeons:harpoon_crossbow") ||
    arrow.hasTag("dungeons:nautical_crossbow")
  ) {
    if (arrow.typeId === "dungeons:harpoon_arrow") {
      target.applyDamage(damage * 1.7, {
        damagingProjectile: arrow,
        damagingEntity: player,
      });
    }
  }
  //BONEBOW
  if (arrow.hasTag("dungeons:bonebow")) {
    const scale = arrow.getComponent("minecraft:scale").value;
    if (scale > 1.43) {
      target.applyDamage(damage * (scale * 0.7), {
        damagingProjectile: arrow,
        damagingEntity: player,
      });
    }
  }
  //WIND BOW
  if (
    arrow.hasTag("dungeons:wind_bow") ||
    arrow.hasTag("dungeons:burst_gale_bow") ||
    arrow.hasTag("dungeons:echo_of_the_valley")
  ) {
    const xDif = target.location.x - player.location.x;
    const zDif = target.location.z - player.location.z;
    var xDif2 = 0;
    var zDif2 = 0;
    if (xDif < 0) {
      xDif2 = xDif * -1;
    }
    if (xDif >= 0) {
      xDif2 = xDif;
    }
    if (zDif < 0) {
      zDif2 = zDif * -1;
    }
    if (zDif >= 0) {
      zDif2 = zDif;
    }
    if (target === undefined || !target.isValid()) return;
    if ((xDif2 + zDif2) / 3.6 < 4) {
      target.applyKnockback(-xDif, -zDif, (xDif2 + zDif2) / 4.6, 0.6);
    } else {
      target.applyKnockback(-xDif, -zDif, 5, 0.6);
    }

    dim.spawnParticle("minecraft:wind_explosion_emitter", {
      x: target.location.x,
      y: target.location.y + 1,
      z: target.location.z,
    });
    dim.playSound(
      "wind_charge.burst",
      { x: target.location.x, y: target.location.y + 1, z: target.location.z },
      {
        volume: 0.9,
        pitch: 1,
      }
    );
  }
  //RICOCHET
  if (
    arrow.hasTag("dungeons:echo_of_the_valley") ||
    arrow.hasTag("dungeons:twin_bow")
  ) {
    findRicochet(target, player, arrow, damage, 1);
  }
  //KNOCKBACK
  if (
    arrow.hasTag("dungeons:guardian_bow") ||
    arrow.hasTag("dungeons:doom_crossbow")
  ) {
    const xDif = target.location.x - player.location.x;
    const zDif = target.location.z - player.location.z;

    target.applyKnockback(xDif, zDif, 1.8, 0.345);
  }
  //SNOW BOW
  if (arrow.hasTag("dungeons:snow_bow")) {
    if (target.getEffect("slowness")) return;
    target.addEffect("slowness", 86, {
      amplifier: 2,
      showParticles: true,
    });
    target.runCommandAsync("function weapon/freezing_fx");
  }
  //WINTERS TOUCH
  if (arrow.hasTag("dungeons:winters_touch")) {
    if (target.getEffect("slowness")) return;
    target.runCommandAsync("function weapon/freezing_fx");
    target.runCommandAsync("function weapon/stun_fx");
    target.addEffect("slowness", 30, {
      amplifier: 9,
      showParticles: true,
    });
    target.addEffect("weakness", 30, {
      amplifier: 9,
      showParticles: false,
    });
    system.runTimeout(() => {
      target.addEffect("slowness", 56, {
        amplifier: 2,
        showParticles: true,
      });
    }, 20);
  }
  //Exploding Crossbow/Red Snake
  if (
    arrow.hasTag("dungeons:exploding_crossbow") ||
    arrow.hasTag("dungeons:firebolt_thrower") ||
    arrow.hasTag("dungeons:red_snake")
  ) {
    dim.spawnParticle("dungeons:exploding_crossbow", target.location);
    dim.playSound("random.explode", target.location);
    const damageRange = dim.getEntities({
      location: target.location,
      maxDistance: 4,
      excludeFamilies: ["ignore"],
    });
    for (const entity of damageRange) {
      if (entity === player) continue;
      entity.applyDamage(damage, {
        cause: EntityDamageCause.entityExplosion,
        damagingEntity: arrow,
      });
    }
  }
  //Imploding Crossbow
  if (arrow.hasTag("dungeons:imploding_crossbow")) {
    dim.spawnParticle("dungeons:imploding_crossbow", target.location);
    dim.playSound("random.explode", target.location);
    dim.spawnParticle("dungeons:gravity", {
      x: target.location.x,
      y: target.location.y + 0.45,
      z: target.location.z,
    });
    dim.playSound("mob.endermen.portal", target.location);

    const damageRange = dim.getEntities({
      location: target.location,
      maxDistance: 3,
      excludeFamilies: ["ignore"],
    });
    for (const entity of damageRange) {
      if (entity === player) continue;
      entity.applyDamage(damage, {
        cause: EntityDamageCause.entityExplosion,
        damagingEntity: arrow,
      });
    }

    dim
      .getEntities({
        location: target.location,
        maxDistance: 6,
        excludeFamilies: ["ignore", "gravity_immune"],
      })
      .forEach((entity) => {
        const xDif = entity.location.x - target.location.x;
        const zDif = entity.location.z - target.location.z;
        var xDif2 = 0;
        var zDif2 = 0;
        if (xDif < 0) {
          xDif2 = xDif * -1;
        }
        if (xDif >= 0) {
          xDif2 = xDif;
        }
        if (zDif < 0) {
          zDif2 = zDif * -1;
        }
        if (zDif >= 0) {
          zDif2 = zDif;
        }
        if (entity === target || entity === player) return;
        if (entity === undefined || !entity.isValid()) return;
        entity.applyKnockback(-xDif, -zDif, (xDif2 + zDif2) / 2.1, 0.3);
      });
  }
  //GRAVITY
  if (arrow.hasTag("dungeons:voidcaller")) {
    dim.spawnParticle("dungeons:gravity", {
      x: target.location.x,
      y: target.location.y + 0.45,
      z: target.location.z,
    });
    dim.playSound("mob.endermen.portal", target.location);

    dim
      .getEntities({
        location: target.location,
        maxDistance: 6,
        excludeFamilies: ["ignore", "gravity_immune"],
      })
      .forEach((entity) => {
        const xDif = entity.location.x - target.location.x;
        const zDif = entity.location.z - target.location.z;
        var xDif2 = 0;
        var zDif2 = 0;
        if (xDif < 0) {
          xDif2 = xDif * -1;
        }
        if (xDif >= 0) {
          xDif2 = xDif;
        }
        if (zDif < 0) {
          zDif2 = zDif * -1;
        }
        if (zDif >= 0) {
          zDif2 = zDif;
        }
        if (entity === target || entity === player) return;
        if (entity === undefined || !entity.isValid()) return;
        entity.applyKnockback(-xDif, -zDif, (xDif2 + zDif2) / 2.1, 0.3);
        entity.addEffect("levitation", 40, {
          amplifier: 1,
          showParticles: false,
        });
      });
  }
  //ENIGMA RESONATOR
  if (
    arrow.hasTag("dungeons:feral_soul_crossbow") ||
    arrow.hasTag("dungeons:soul_hunter_crossbow")
  ) {
    const critical = Math.floor(Math.random() * 400);
    const souls = world.scoreboard.getObjective("soulGauge").getScore(player);

    if (player.hasTag("dungeons:debug"))
      player.sendMessage(`roll : ${critical}`);
    if (critical < souls) {
      target.runCommandAsync("function weapon/enigma_resonator_fx");

      target.addTag("prevent_effect");
      target.applyDamage(damage * 1.5, {
        damagingProjectile: arrow,
        damagingEntity: player,
      });

      system.runTimeout(() => {
        target.removeTag("prevent_effect");
      }, 1);
    }
  }
  // CRITICAL HIT
  if (arrow.hasTag("dungeons:corrupted_crossbow")) {
    const critical = Math.floor(Math.random() * 10);

    if (player.hasTag("dungeons:debug"))
      player.sendMessage(`roll : ${critical}`);
    if (critical == 1) {
      target.runCommandAsync("function weapon/critical_hit_fx");

      target.addTag("prevent_effect");
      target.applyDamage(damage * 2.0, {
        damagingProjectile: arrow,
        damagingEntity: player,
      });

      system.runTimeout(() => {
        target.removeTag("prevent_effect");
      }, 1);
    }
  }

  // PIERCING ENCHANT CODE
  if (arrow.hasTag("dungeons:piercing_0")) {
    arrow.addTag("dungeons:pierced");
    arrow.remove();
    return;
  }
  if (arrow.hasTag("dungeons:piercing_1")) {
    arrow.removeTag("dungeons:piercing_1");
    arrow.addTag("dungeons:piercing_0");
    arrow.addTag("dungeons:pierced");
    return;
  }
  if (arrow.hasTag("dungeons:piercing_2")) {
    arrow.removeTag("dungeons:piercing_2");
    arrow.addTag("dungeons:piercing_1");
    arrow.addTag("dungeons:pierced");
    return;
  }
  if (arrow.hasTag("dungeons:piercing_3")) {
    arrow.removeTag("dungeons:piercing_3");
    arrow.addTag("dungeons:piercing_2");
    arrow.addTag("dungeons:pierced");
    return;
  }
  if (arrow.hasTag("dungeons:piercing_4")) {
    arrow.removeTag("dungeons:piercing_4");
    arrow.addTag("dungeons:piercing_3");
    arrow.addTag("dungeons:pierced");
    return;
  }
  if (arrow.hasTag("dungeons:piercing_5")) {
    arrow.removeTag("dungeons:piercing_5");
    arrow.addTag("dungeons:piercing_4");
    arrow.addTag("dungeons:pierced");
    return;
  }
  if (arrow.hasTag("dungeons:piercing_6")) {
    arrow.removeTag("dungeons:piercing_6");
    arrow.addTag("dungeons:piercing_5");
    arrow.addTag("dungeons:pierced");
    return;
  }
}

function SwordBlock(event) {
  const hurtEntity = event.hurtEntity;
  const cause = event.damageSource.cause;
  const damage = event.damage;

  if (!hurtEntity) return;
  if (!hurtEntity.hasTag("dungeons:sword_block")) return;
  if (ignoreBlock.includes(cause)) return;

  let hp = hurtEntity.getComponent("minecraft:health");

  hp.setCurrentValue(hp.currentValue + damage / 2);
  hurtEntity.playSound("weapon.sword.parry", {
    pitch: 1,
    location: hurtEntity.location,
    volume: 1,
  });

  const item = hurtEntity
    .getComponent("minecraft:equippable")
    .getEquipment("Mainhand");
  if (!item) return;
  if (!item.hasTag("dungeons:blockable_weapon")) {
    player.removeTag("dungeons:sword_block");
    return;
  }

  let durability = item.getComponent("durability");
  if (!durability) return;

  var weaponDamage = 1;
  if (damage >= 4) {
    weaponDamage += Math.floor(damage);
  }

  durability.damage += weaponDamage;

  const maxDurability = durability.maxDurability;
  const currentDamage = durability.damage;
  if (currentDamage >= maxDurability) {
    hurtEntity.playSound("random.break", {
      pitch: 1,
      location: hurtEntity.location,
      volume: 1,
    });
    hurtEntity
      .getComponent("minecraft:equippable")
      .setEquipment("Mainhand", new ItemStack("minecraft:air", 1));
  } else {
    item.getComponent("cooldown").startCooldown(hurtEntity);
    hurtEntity
      .getComponent("minecraft:equippable")
      .setEquipment("Mainhand", item);
  }
}

function VerdantArmor(event) {
  const hurtEntity = event.hurtEntity;
  const damageSource = event.damageSource.damagingEntity;
  const cause = event.damageSource.cause;
  const damage = event.damage;
  if (!damageSource) {
    return;
  }
  if (!damageSource.isValid()) return;
  if (!hurtEntity.hasTag("dungeons:ember_armour")) {
    return;
  }
  if (hurtEntity == damageSource) {
    return;
  }
  if (cause == "fireTick") return;
  damageSource.dimension.spawnParticle("dungeons:wildfire_flames", {
    x: damageSource.location.x,
    y: damageSource.location.y + 1,
    z: damageSource.location.z,
  });
  hurtEntity.playSound("fire.ignite", {
    pitch: 1.5,
    volume: 0.3,
  });
  damageSource.setOnFire(1 + damage * 3, true);
  damageSource.applyDamage(1 + damage / 2, {
    cause: EntityDamageCause.fireTick,
    damagingEntity: hurtEntity,
  });
}

function ConfigReworked(ev) {
  if (victim == undefined || attacker == undefined) var victim = ev.hurtEntity;
  var damage = ev.damage;
  var attacker = ev.damageSource.damagingEntity;
  var projectile = ev.damageSource.damagingProjectile;
  const dimension = victim.dimension;

  if (victim.typeId == "edx:training_dummy") {
    victim.addEffect("regeneration", 5, {
      amplifier: 200,
      showParticles: false,
    });
    victim.nameTag = Math.round(Math.round(damage * 100) / 100).toString();
    victim.triggerEvent("show");
    system.runTimeout(() => {
      victim.triggerEvent("stop_show");
      victim.nameTag = "";
    }, TicksPerSecond);
  }

  if (projectile != undefined && attacker != undefined) {
    if (projectile.typeId === "edx:fire_strike") {
      victim.setOnFire(4, true);
    }
  }
  if (victim.typeId == "edx:gloopine") {
    if (victim.getComponent("variant")?.value == 0) {
      victim.triggerEvent("go_fat");
    } else {
      dimension.spawnParticle("edx:gloopine_explode", victim.location);
      dimension.createExplosion(victim.location, 4, {
        breaksBlocks: false,
        causesFire: false,
      });
      victim.runCommand(`loot spawn  ~~~ loot gloopine`);
      victim.remove();
    }
  }
  if (victim.typeId == "edx:gloop_ball") {
    if (victim.getComponent("variant")?.value == 0) {
      victim.triggerEvent("go_fat");
    } else {
      dimension.spawnParticle("edx:gloopine_explode", victim.location);
      dimension.createExplosion(victim.location, 4, {
        breaksBlocks: false,
        causesFire: false,
      });
      victim.remove();
    }
  }
  if (attacker != undefined) {
    if (
      attacker.typeId === "minecraft:player" &&
      attacker.hasTag("explosive_blaze_rod") &&
      victim.getComponent("minecraft:onfire")
    ) {
      system.runTimeout(() => {
        var entities = victim.dimension.getEntities({
          location: {
            x: victim.location.x,
            y: victim.location.y,
            z: victim.location.z,
          },
          maxDistance: 0.5,
        });
        victim.runCommand(`particle edx:blazeblade_explosion ~~1~`);
        for (let entity of entities) {
          entity.applyDamage(5, {
            cause: "fire",
          });
          entity.applyKnockback(0, 0, 0, 0.5);
          entity.extinguishFire();
        }
      }, 20);
    }

    //sword sweep attack
    else if (
      attacker?.typeId === "minecraft:player" &&
      attacker
        ?.getComponent("equippable")
        ?.getEquipment("Mainhand")
        ?.hasTag("minecraft:is_sword")
    ) {
      const player = attacker;
      if (
        getScore(player, "Hit_cooldown") <= 1 &&
        !player.isSprinting &&
        player.isOnGround
      ) {
        const itemUsed = player
          ?.getComponent("equippable")
          ?.getEquipment("Mainhand");
        let fireAspectLevel =
          itemUsed?.getComponent("enchantable")?.getEnchantment("fire_aspect")
            ?.level ?? 0;
        var entitiesCircle = world
          .getDimension(player.dimension.id)
          .getEntities({
            excludeTypes: ["minecraft:item"],
            excludeFamilies: ["projectile"],
            location: victim.location,
            maxDistance: 2,
          });
        entitiesCircle.forEach((entity) => {
          if (
            victim.typeId != "minecraft:player" ||
            world.gameRules.pvp == true
          )
            if (
              victim != entity &&
              entity != player &&
              entity.typeId != "minecraft:xp_orb" &&
              entity.typeId != "minecraft:item"
            ) {
              entity?.applyKnockback(
                player.getViewDirection().x,
                player.getViewDirection().z,
                Math.sqrt(
                  player.getViewDirection().x ** 2 +
                    player.getViewDirection().z ** 2
                ) * getKnockbackValue(itemUsed),
                0.5
              );
              entity.applyDamage(getDamage(player, damage) / 3, {
                cause: "entityAttack",
              });
              entity.setOnFire(fireAspectLevel * 4);
            }
        });
        const particleLocation = {
          x: player.getHeadLocation().x + player.getViewDirection().x,
          y: player.getHeadLocation().y + player.getViewDirection().y - 0.4,
          z: player.getHeadLocation().z + player.getViewDirection().z,
        };
        world
          .getDimension(player.dimension.id)
          .spawnParticle("edx:sweep_attack", particleLocation);
        world
          .getDimension(player.dimension.id)
          .playSound("vr.stutterturn", player.location);
        if (player.hasTag("charged_hit_scroll")) {
          player.applyKnockback(
            -player.getViewDirection().x,
            -player.getViewDirection().z,
            Math.sqrt(
              player.getViewDirection().x ** 2 +
                player.getViewDirection().z ** 2
            ) * 2,
            0.5
          );
        }
        if (
          player.hasTag("charged_hit_scroll") ||
          player.hasTag("chaining_scroll")
        )
          victim?.applyDamage(getDamage(player, damage), {
            cause: "entityAttack",
          });
        if (
          player.hasTag("uppercut_scroll") &&
          !victim.dimension.getBlock({
            x: victim.location.x,
            y: victim.location.y - 0.5,
            z: victim.location.z,
          }).isAir
        ) {
          world
            .getDimension(victim.dimension.id)
            .spawnParticle("edx:uppercut", victim.location);
          victim.clearVelocity();
          victim.applyKnockback(0, 0, 0, 0.5);
        }
      }

      if (
        player.hasTag("crushing_scroll") &&
        victim.dimension.getBlock({
          x: victim.location.x,
          y: victim.location.y - 0.5,
          z: victim.location.z,
        }).isAir
      ) {
        world
          .getDimension(victim.dimension.id)
          .spawnParticle("edx:uppercut", victim.location);
        victim?.applyKnockback(0, 0, 0, -0.7);
        victim.applyDamage(getDamage(player, damage) + 2, {
          cause: "entityAttack",
        });
      }
      if (
        player.hasTag("chaining_scroll") &&
        (isFamily("monster", victim) === true ||
          isFamily("mob", victim) === true)
      ) {
        if (getScore(player, "Chaining") < 6) {
          world
            .getDimension(victim.dimension.id)
            .spawnParticle("edx:chaining_particle", victim.getHeadLocation());
          player.runCommand(`scoreboard players add @s Chaining 1`);
        }
      }
      player.runCommand(`scoreboard players set @s Hit_cooldown 20`);
    }

    if (attacker?.typeId === "minecraft:player") {
    }
  }
  if (victim.typeId === "minecraft:player") {
    var player = victim;
    if (getScore(player, "Chaining") > 0) {
      const vmap = new MolangVariableMap();
      vmap.setFloat("variable.amount", getScore(victim, "Chaining"));
      world
        .getDimension(victim.dimension.id)
        .spawnParticle(
          "edx:chaining_hurt_particle",
          victim.getHeadLocation(),
          vmap
        );
      player.runCommand(`scoreboard players set @s Chaining 0`);
    }
  }
}

function DamageAfterDown(event) {
  if (event.hurtEntity.typeId !== "minecraft:player") return;
  if (event.damageSource.cause !== "fall") return;

  event.hurtEntity.runCommandAsync(`effect @s slowness ${event.damage * 4} 2`);
}

function ShieldDefense(event) {
  const hurtEntity = event.hurtEntity;
  const damageSource = event.damageSource.damagingEntity;
  const damage = event.damage;

  if (!(damageSource instanceof Player)) return; // Garante que o atacante seja um jogador



  const player = damageSource; // Corrigindo a referência ao jogador

  if (event.damageSource.cause === "entityAttack") {
    const { equippableComp, item, stats } = player.getItemStats();
    const currentTime = Date.now();
    const shieldBlock = Check.shieldBlock(
      currentTime,
      player,
      hurtEntity,
      stats
    );
    if (!shieldBlock)
      hurtEntity.__lastAttack = { damage: stats?.Damage, time: Date.now() };
    healthParticle(hurtEntity, damage);
  }

  if (event.damageSource.cause === "projectile") {
    //if (player.getDynamicProperty("bowHitSound") == true) player.playSound( "random.orb", { pitch: 0.5 })
  }
}


function DurabilityArmor(event) {
  if (event.hurtEntity.typeId == "minecraft:player") {
    DurabilityArmorViewer(event.hurtEntity);
  }
}

function RunArtifact(event) {
  const hurtEntity = event.hurtEntity;
  const damageSource = event.damageSource.damagingEntity;
  const cause = event.damageSource.cause;
  const damage = event.damage;
  if (!damageSource) {
    return;
  }
  if (damageSource.typeId !== "minecraft:player") {
    return;
  }
  if (hurtEntity == damageSource) {
    return;
  }
  if (cause != "entityAttack") {
    return;
  }

  if (damageSource.hasTag("powershaker_cooldown")) return;

  let timeLeft = world.scoreboard.getObjective("");
  let usesLeft = world.scoreboard.getObjective("powershaker_u");

  if (
    usesLeft.getScore(damageSource) <= 0 ||
    timeLeft.getScore(damageSource) <= 0
  )
    return;

  hurtEntity.dimension.spawnParticle(
    "dungeons:party_boom",
    hurtEntity.location
  );
  hurtEntity.dimension.playSound("random.explode", hurtEntity.location, {
    volume: 0.5,
    pitch: 1.5,
  });

  hurtEntity.dimension
    .getEntities({
      location: hurtEntity.location,
      maxDistance: 3.5,
      excludeFamilies: ["ignore"],
    })
    .forEach((entity) => {
      if (entity === hurtEntity || entity === damageSource) return;
      if (entity === undefined || !entity.isValid()) return;
      if (entity.typeId === "minecraft:item") return;
      entity.applyDamage(4 + Math.floor(damage * 0.66), {
        cause: EntityDamageCause.entityExplosion,
        damagingEntity: damageSource,
      });
    });

  usesLeft.addScore(damageSource, -1);
  damageSource.addTag("powershaker_cooldown");
  system.runTimeout(() => {
    damageSource.removeTag("powershaker_cooldown");
  }, 8);
}

function ancient_guardian(event) {
  const hurtEntity = event.hurtEntity;
  const damageSource = event.damageSource.damagingEntity;
  const cause = event.damageSource.cause;

  if(!damageSource) return;
  if (cause == "thorns") return;
  if (damageSource.typeId === "dungeons:ancient_guardian") {
    hurtEntity.dimension.spawnParticle('dungeons:scatter_mine_boom', hurtEntity.location);
  }
}

function piglin_fungus_thrower(event) {
  const hurtEntity = event.hurtEntity;
  const damageSource = event.damageSource.damagingEntity;
  const cause = event.damageSource.cause;

  if(!damageSource) return;
  if (damageSource.typeId === "dungeons:piglin_fungus_thrower") {
    hurtEntity.dimension.spawnParticle('dungeons:nethershroom_boom', hurtEntity.location);
  }
}

function shadowTime(event) {
  const hurtEntity = event.hurtEntity;
  const damageSource = event.damageSource.damagingEntity;
  if (!damageSource) {
    return;
  }
  if (damageSource.typeId !== "minecraft:player") {
    return;
  }
  let shadowTime = world.scoreboard.getObjective('shadowTime')
  let shadowTimePlayer = shadowTime.getScore(damageSource);
  if (shadowTimePlayer == 0) return;
  if (hurtEntity == damageSource) {
    return;
  }
  damageSource.runCommandAsync('function exit_shadow')
  shadowTime.setScore(damageSource, 0)
}

function thorns_enchant(event) {
  const hurtEntity = event.hurtEntity;
  const damageSource = event.damageSource.damagingEntity;
  const cause = event.damageSource.cause
  const damage = event.damage
  if (!damageSource) {
    return;
  }
  if (!damageSource.isValid()) return;
  if (!hurtEntity.hasTag('dungeons:thorns_enchant')) {
    return;
  }
  if (hurtEntity == damageSource) {
    return;
  }
  if (cause == "thorns") return;
  if (damageSource.typeId === 'minecraft:player') {
    damageSource.playSound('damage.thorns', {
      pitch: 0.5,
      volume: 0.5
    });
  }
  damageSource.applyDamage(damage * 1.5, {
    cause: EntityDamageCause.thorns,
    damagingEntity: hurtEntity
  });
}

function nimble_turtle_armour(event) {
  const hurtEntity = event.hurtEntity;
  const cause = event.damageSource.cause;
  const damage = event.damage;
  if (!hurtEntity.hasTag('dungeons:nimble_turtle_armour')) {
    return;
  }
  hurtEntity.dimension.spawnParticle('dungeons:swiftness', hurtEntity.location);
  hurtEntity.playSound('artefact.shadow_break', {
    pitch: 2,
    volume: 0.3
  });
  hurtEntity.addEffect('speed', 60, {
    amplifier: 2
  });
}

function glow_squid_armour(event) {
  const hurtEntity = event.hurtEntity;
  const damageSource = event.damageSource.damagingEntity;
  const cause = event.damageSource.cause;
  const damage = event.damage;
  if (!damageSource) {
    return;
  }
  if (!damageSource.isValid()) return;
  if ((!hurtEntity.hasTag('dungeons:glow_squid_armour') && !hurtEntity.hasTag('dungeons:squid_armour')) || hurtEntity.hasTag('squid_ink_cooldown')) {
    return;
  }
  if (hurtEntity.hasTag('dungeons:squid_armour')) {
    hurtEntity.dimension.spawnParticle('dungeons:squid_ink', hurtEntity.location);
    hurtEntity.playSound('mob.squid.ink_squirt', {
      pitch: 1.0,
      volume: 0.6
    });
  }
  else {
    hurtEntity.dimension.spawnParticle('dungeons:glow_squid_ink', hurtEntity.location);
    hurtEntity.playSound('mob.glow_squid.ink_squirt', {
      pitch: 1.0,
      volume: 0.6
    });
  }
  const nearbyMobs = hurtEntity.dimension.getEntities({
    location: hurtEntity.location,
    maxDistance: 4
  });
  for (const mob of nearbyMobs) {
    if (mob == damageSource) {
      mob.addEffect('weakness', 75);
      mob.addEffect('blindness', 40);
      break;
    }
  }
  hurtEntity.addTag('squid_ink_cooldown');
  system.runTimeout(() => {
    hurtEntity.removeTag('squid_ink_cooldown');
  }, 100);
}

function glow_squid_sparkles(event) {
  const hurtEntity = event.hurtEntity;
  const damageSource = event.damageSource.damagingEntity;
  const cause = event.damageSource.cause;
  const damage = event.damage;
  if (!hurtEntity.hasTag('dungeons:glow_squid_armour')) {
    return;
  }
  system.runTimeout(() => {
    hurtEntity.addEffect('resistance', 7, {
      amplifier: 255,
      showParticles: false
    });
  }, 8);
  hurtEntity.dimension.spawnParticle('dungeons:glow_squid_sparkles', hurtEntity.location);
  hurtEntity.playSound('mob.glow_squid.ink_squirt', {
    pitch: 1.5,
    volume: 0.6
  });
}

function spider_armour(event) {
  const hurtEntity = event.hurtEntity;
  const damageSource = event.damageSource.damagingEntity;
  const cause = event.damageSource.cause;
  const damage = event.damage;
  if (!damageSource) {
    return;
  }
  if (!damageSource.isValid()) return;
  if (!damageSource.typeId === 'minecraft:player') return;
  if (!damageSource.hasTag('dungeons:spider_armour')) {
    return;
  }
  if (hurtEntity == damageSource) {
    return;
  }
  let hp = damageSource.getComponent('minecraft:health')
  hp.setCurrentValue(hp.currentValue + damage * 0.07)
}

function living_vines_armour(event) {
  const damaged = event.hurtEntity;
  const cause = event.damageSource.cause;
  const damage = event.damage;
  if (damage > 4 || cause != "magic") {
    return;
  }
  if (damaged.getEffect('poison') || damaged.getEffect('fatal_poison')) {
    const players = damaged.dimension.getPlayers({
      tags: ['dungeons:living_vines_armour'],
      maxDistance: 10,
      location: damaged.location
    });
    for (const player of players) {
      let hp = player.getComponent('minecraft:health');
      if (hp.currentValue < hp.defaultValue) {
        let healing = (damage/2) / players.length;
        hp.setCurrentValue(hp.currentValue + healing)

        let xDif = player.location.x - damaged.location.x;
        let zDif = player.location.x - damaged.location.z;
        let yDif = player.location.x - damaged.location.y;

        const molang = new MolangVariableMap();

        molang.setColorRGB('color', {red: 0.0, green: 1.0, blue: 0.0});
        molang.setVector3('direction', {x: xDif, y: yDif, z: zDif});
        molang.setFloat('particle_initial_speed', (Math.abs(xDif) + Math.abs(yDif) + Math.abs(zDif)));
        molang.setFloat('max_lifetime', 1);

player.dimension.spawnParticle('minecraft:creaking_heart_trail', player.location, molang);
     
      }
    }
  }
}

function critical_hit(event) {
  const hurtEntity = event.hurtEntity;
  const damageSource = event.damageSource.damagingEntity;
  const cause = event.damageSource.cause
  const damage = event.damage
  if (!damageSource || !hurtEntity) {
    return;
  }
  if (hurtEntity.hasTag('prevent_effect')) return;
  if (damageSource.typeId !== "minecraft:player") {
    return;
  }
  if (hurtEntity == damageSource) {
    return;
  }
  if (cause != "entityAttack") {
    return;
  }
  const heldItem = damageSource.getComponent("minecraft:equippable").getEquipment("Mainhand");
  if (!heldItem) return;
  if (!heldItem.hasTag('dungeons:critical_hit')) {
    return;
  }

  const critical = Math.floor(Math.random() * 10);
  if (damageSource.hasTag('dungeons:debug')) damageSource.sendMessage(`roll : ${critical}`)
  if (critical == 1) {

    hurtEntity.runCommandAsync('function weapon/critical_hit_fx')

    hurtEntity.addTag('prevent_effect')
    hurtEntity.applyDamage(damage * 1.5, {
      cause: cause,
      damagingEntity: damageSource
    });

    system.runTimeout(() => {
      hurtEntity.removeTag('prevent_effect')
    }, 1)

  }

}

function critical_hit_spooky(event) {
  const hurtEntity = event.hurtEntity;
  const damageSource = event.damageSource.damagingEntity;
  const cause = event.damageSource.cause
  const damage = event.damage
  if (!damageSource || !hurtEntity) {
    return;
  }
  if (hurtEntity.hasTag('prevent_effect')) return;
  if (damageSource.typeId !== "minecraft:player") {
    return;
  }
  if (hurtEntity == damageSource) {
    return;
  }
  if (cause != "entityAttack") {
    return;
  }
  const heldItem = damageSource.getComponent("minecraft:equippable").getEquipment("Mainhand");
  if (!heldItem) return;
  if (!heldItem.hasTag('dungeons:critical_hit_spooky')) {
    return;
  }

  const critical = Math.floor(Math.random() * 10);
  if (damageSource.hasTag('dungeons:debug')) damageSource.sendMessage(`roll : ${critical}`)
  if (critical == 1) {

    hurtEntity.runCommandAsync('function weapon/spooky_critical_hit_fx')

    hurtEntity.addTag('prevent_effect')
    hurtEntity.applyDamage(damage * 1.5, {
      cause: cause,
      damagingEntity: damageSource
    });

    system.runTimeout(() => {
      hurtEntity.removeTag('prevent_effect')
    }, 1)

  }

}

function enigma_resonator(event) {
  const hurtEntity = event.hurtEntity;
  const damageSource = event.damageSource.damagingEntity;
  const cause = event.damageSource.cause
  const damage = event.damage
  if (!damageSource || !hurtEntity) {
    return;
  }
  if (hurtEntity.hasTag('prevent_effect')) return;
  if (damageSource.typeId !== "minecraft:player") {
    return;
  }
  if (hurtEntity == damageSource) {
    return;
  }
  if (cause != "entityAttack") {
    return;
  }
  const heldItem = damageSource.getComponent("minecraft:equippable").getEquipment("Mainhand");
  if (!heldItem) return;
  if (!heldItem.hasTag('dungeons:enigma_resonator')) {
    return;
  }

  const critical = Math.floor(Math.random() * 400);
  const souls = world.scoreboard.getObjective('soulGauge').getScore(damageSource);

  if (damageSource.hasTag('dungeons:debug')) damageSource.sendMessage(`roll : ${critical}`)
  if (critical < souls) {

    hurtEntity.runCommandAsync('function weapon/enigma_resonator_fx')

    hurtEntity.addTag('prevent_effect')
    hurtEntity.applyDamage(damage * 1.5, {
      cause: cause,
      damagingEntity: damageSource
    });

    system.runTimeout(() => {
      hurtEntity.removeTag('prevent_effect')
    }, 1)

  }

}

function burning(event) {
  const hurtEntity = event.hurtEntity;
  const damageSource = event.damageSource.damagingEntity;
  const cause = event.damageSource.cause
  const damage = event.damage
  if (!damageSource) {
    return;
  }
  if (damageSource.typeId !== "minecraft:player") {
    return;
  }
  if (hurtEntity == damageSource) {
    return;
  }
  if (cause != "entityAttack") {
    return;
  }
  const heldItem = damageSource.getComponent("minecraft:equippable").getEquipment("Mainhand");
  if (!heldItem) return;
  if (!heldItem.hasTag('dungeons:burning')) {
    return;
  }

  const isFire = hurtEntity.setOnFire(damage * 2.4, true)
  if (!isFire) return;
  damageSource.playSound('mob.ghast.fireball', {
    pitch: 1.05,
    volume: 0.33
  })

}

const committedWeapons = [
  'dungeons:growing_staff'
];

function committed(event) {
  const hurtEntity = event.hurtEntity;
  const damageSource = event.damageSource.damagingEntity;
  const cause = event.damageSource.cause
  const damage = event.damage
  if (!damageSource) {
    return;
  }
  if (hurtEntity.hasTag('prevent_effect')) return;
  if (damageSource.typeId !== "minecraft:player") {
    return;
  }
  if (hurtEntity == damageSource) {
    return;
  }
  if (cause != "entityAttack") {
    return;
  }
  const heldItem = damageSource.getComponent("minecraft:equippable").getEquipment("Mainhand");
  if (!heldItem) return;
  if (!heldItem.hasTag('dungeons:committed')) {
    return;
  }

  let hp = hurtEntity.getComponent('minecraft:health')

  if (!hp) {
    console.warn('Entity does not have health component');
    return;
  }

  if ((hp.currentValue + damage) < hp.defaultValue) {

    hurtEntity.addTag('prevent_effect')
    if ((hp.defaultValue - ((hp.currentValue + damage)) * 0.2) < 20) {
      hurtEntity.applyDamage(((hp.defaultValue - (hp.currentValue + damage)) * 0.2), {
        cause: cause,
        damagingEntity: damageSource
      });
    } else {
      hurtEntity.applyDamage(20, {
        cause: cause,
        damagingEntity: damageSource
      });
    }

    system.runTimeout(() => {
      hurtEntity.removeTag('prevent_effect')
    }, 1)
  }

}

const illagersBaneWeapons = [
  'dungeons:bone_cudgel'
];

function illagersWeaponBane(event) {
  const hurtEntity = event.hurtEntity;
  const damageSource = event.damageSource.damagingEntity;
  const cause = event.damageSource.cause
  const damage = event.damage
  if (!damageSource) {
    return;
  }
  if (hurtEntity.hasTag('prevent_effect')) return;
  if (damageSource.typeId !== "minecraft:player") {
    return;
  }
  if (hurtEntity == damageSource) {
    return;
  }
  if (!hurtEntity.matches({
      families: ['illager']
    })) {
    return;
  }
  if (cause != "entityAttack") {
    return;
  }
  const heldItem = damageSource.getComponent("minecraft:equippable").getEquipment("Mainhand");
  if (!heldItem) return;
  if (!heldItem.hasTag('dungeons:illagers_bane')) {
    return;
  }

  hurtEntity.runCommandAsync('function weapon/illagers_bane_fx')
  hurtEntity.addTag('prevent_effect')
  hurtEntity.applyDamage((damage * 1.75), {
    cause: cause,
    damagingEntity: damageSource
  });

  system.runTimeout(() => {
    hurtEntity.removeTag('prevent_effect')
  }, 1)

}

const smitingWeapons = [
  'dungeons:dark_katana'
];

function smiting(event) {
  const hurtEntity = event.hurtEntity;
  const damageSource = event.damageSource.damagingEntity;
  const cause = event.damageSource.cause
  const damage = event.damage
  if (!damageSource) {
    return;
  }
  if (hurtEntity.hasTag('prevent_effect')) return;
  if (damageSource.typeId !== "minecraft:player") {
    return;
  }
  if (hurtEntity == damageSource) {
    return;
  }
  if (!hurtEntity.matches({
      families: ['undead']
    })) {
    return;
  }
  if (cause != "entityAttack") {
    return;
  }
  const heldItem = damageSource.getComponent("minecraft:equippable").getEquipment("Mainhand");
  if (!heldItem) return;
  if (!heldItem.hasTag('dungeons:smiting')) {
    return;
  }

  hurtEntity.runCommandAsync('function weapon/smiting_fx')
  hurtEntity.addTag('prevent_effect')
  hurtEntity.applyDamage((damage * 1.2), {
    cause: cause,
    damagingEntity: damageSource
  });

  system.runTimeout(() => {
    hurtEntity.removeTag('prevent_effect')
  }, 1)

}

const unchantingWeapons = [];

function unchanting_Weapons(event) {
  const hurtEntity = event.hurtEntity;
  const damageSource = event.damageSource.damagingEntity;
  const cause = event.damageSource.cause
  const damage = event.damage
  if (!damageSource) {
    return;
  }
  if (hurtEntity.hasTag('prevent_effect')) return;
  if (damageSource.typeId !== "minecraft:player") {
    return;
  }
  if (hurtEntity == damageSource) {
    return;
  }
  if (!hurtEntity.matches({
      families: ['enchanted']
    })) {
    return;
  }
  if (cause != "entityAttack") {
    return;
  }
  const heldItem = damageSource.getComponent("minecraft:equippable").getEquipment("Mainhand");
  if (!heldItem) return;
  if (!heldItem.hasTag('dungeons:unchanting')) {
    return;
  }

  hurtEntity.runCommandAsync('function weapon/unchanting_fx')
  hurtEntity.addTag('prevent_effect')
  hurtEntity.applyDamage((damage * 2.2), {
    cause: cause,
    damagingEntity: damageSource
  });
  system.runTimeout(() => {
    hurtEntity.removeTag('prevent_effect')
  }, 1)
}

// // Lista de handlers (defina isso globalmente)
// const ENTITY_HURT_HANDLERS = [
//   enigma_resonator,
//   burning,
//   committed,
//   illagersWeaponBane,
//   smiting,
//   unchanting_Weapons,
//   critical_hit_spooky,
//   critical_hit,
//   living_vines_armour,
//   spider_armour,
//   glow_squid_sparkles,
//   glow_squid_armour,
//   nimble_turtle_armour,
//   thorns_enchant,
//   shadowTime,
//   piglin_fungus_thrower,
//   ancient_guardian,
//   RunArtifact,
//   DurabilityArmor,
//   VerdantArmor,
//   ShieldDefense,
//   DamageAfterDown,
//   ConfigReworked,
//   SwordBlock,
//   DungeonsConfig,
//   spongeStrikerCharge,
//   enchanted_sheep,
//   snareling_web
// ];

// // Crie uma instância da fila para entityHurt
// const entityHurtQueue = new EventQueue(15, ENTITY_HURT_HANDLERS);

// // Sobrescreva o método shouldSkipEvent para entityHurt
// entityHurtQueue.shouldSkipEvent = (event) => {
//   const { hurtEntity, damageSource } = event;
//   if (!hurtEntity?.isValid()) return true; // Ignora se a entidade for inválida
//   const attacker = damageSource?.damagingEntity;
//   if (attacker && !attacker.isValid()) return true; // Ignora se o atacante for inválido
//   return false;
// };

// // Assine o evento entityHurt
// world.afterEvents.entityHurt.subscribe((event) => {
//   entityHurtQueue.addEvent(event); // Adiciona o evento à fila
// });