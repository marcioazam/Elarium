import { EntityDamageCause } from "@minecraft/server";
import { Attack } from "../../SurvivalReworked/items/spears.js";
import { Check } from "../main/mathAndCalculations.js";
import { EntityWrapper } from "../../Elarium/System/Class/Entity.js";

/**
 * @readonly
 * @enum {string}
 */
export const Rarity = Object.freeze({
  Common: "Comum",
  Uncommon: "Incomum",
  Rare: "Raro",
  Epic: "Épico",
  Legendary: "Lendário",
});

/**
 * @readonly
 * @enum {string}
 */
export const Weight = Object.freeze({
  Light: "Leve",
  Medium: "Médio",
  Heavy: "Pesada",
  VeryHeavy: "Muito Pesada",
});

/**
 * @readonly
 * @enum {string}
 */
export const Effect = Object.freeze({
  Sawblade: "Desgaste",
  AquaDamage: "Dano aquático",
  SoulCollect: "Coleta almas",
  KillMoveSpeed: "Velocidade pos morte",
  DoubleCritical: "Crítico duplo",
  AreaDamage: "Dano área",
  HighAreaDamage: "Alto dano área",
  Gravity: "Gravidade",
  HighGravity: "Alta gravidade",
  HighKnockback: "Knockback",
  WeaponBlock: "Bloqueio com arma",
  SweepAttack: "Ataque em varredura",
  SlownessAttack: "Lentidão",
  WeaknessAttack: "Fraqueza",
  SummonBee: "Invocar abelha",
  PermaFrost: "Congelamento em área",
  PoisonAttack: "Envenenamento",
  FatalPoison: "Envenenamento fatal",
  FireStrike: "Incendiar em área",
  SoulGauge: "Medidor de alma",
  Stun: "Atordoamento",
  Chaining: "Encadeamento",
  CorposeExplode: "Explosão de corpo",
  AreaPoison: "Envenenamento em área",
  IllageBane: "Dano contra Illagers",
  Leeching: "Roubo de vida",
  Rampage: "Fúria",
  EnigmaResonator: "Resonador de enigma",
  Shockwave: "Onda de choque",
  Bleeding: "Sangramento",
  FireProjectile: "Projétil de fogo",
  Throw: "Arremesso",
  SpearAttack: "Ataque de lança",
  WindProjectile: "Projétil de vento",
  PoisonProjectile: "Projétil de veneno",
  SlownessProjectile: "Projétil de lentidão",
  ScaleDamageProjectile: "Projétil de dano em escala",
  RicochetProjectile: "Projétil de ricochete",
  HighKnockbackProjectile: "Projétil de alto knockback",
  ExplodeProjectile: "Projétil explosivo",
  WeaknessProjectile: "Projétil de fraqueza",
  MoreDamageProjectile: "Projétil de dano adicional",
  BonusDamageProjectile: "Projétil de dano bônus",
  ArponMoreDamageProjectile: "Projétil de arpão de dano adicional",
  CriticalProjectile: "Projétil crítico",
});

export function ApplyEffectFromWeapon(
  weapon,
  player,
  baseDamage,
  target,
  timeSinceLastAttack,
  crit
) {
  if (weapon.Id === "dungeons:coral_blade" && player.isInWater) {
    baseDamage = baseDamage + 3;
    target.dimension.spawnParticle("dungeons:coral_blade", target.location);
  }

  if (weapon.Id === "dungeons:sponge_striker" && player.isInWater) {
    baseDamage = baseDamage + 4;
    target.dimension.spawnParticle("dungeons:coral_blade", target.location);
  }

  if (weapon.Id === "dungeons:bone_club") {
    player.runCommandAsync("function weapon/bone_club_fx");
  }

  if (weapon.Effects) {
    if (weapon.Effects.includes(Effect.Sawblade)) {
      if (timeSinceLastAttack < 2500) {
        baseDamage = Math.floor(baseDamage / 2);
      }
    }

    if (weapon.Effects.includes(Effect.Bleeding)) {
      target.runCommand(`tag @s add bleeding`);
      target.runCommand(`tag @s remove bleeding4`);
      target.runCommand(`tag @s remove bleeding3`);
      target.runCommand(`tag @s remove bleeding2`);
      target.runCommand(`tag @s remove bleeding1`);
    }

    if (weapon.Effects.includes(Effect.SpearAttack)) {
      Attack(player);
    }

    if (weapon.Effects.includes(Effect.PoisonAttack)) {
      target.addEffect("poison", 80, {
        amplifier: 1,
        showParticles: true,
      });
      target.dimension.spawnParticle("dungeons:whip_poison", target.location);
    }

    if (weapon.Effects.includes(Effect.FatalPoison)) {
      target.addEffect("fatal_poison", 120, {
        amplifier: 1,
        showParticles: true,
      });
      target.dimension.spawnParticle("dungeons:whip_poison", target.location);
    }

    if (weapon.Effects.includes(Effect.SummonBee)) {
      const bee = Math.floor(Math.random() * 10);
      if (bee <= 1) {
        const pet = target.dimension.spawnEntity(
          "dungeons:pet_bee",
          target.location
        );
        let beeTameable = pet.getComponent("minecraft:tameable");
        beeTameable.tame(player);
      }
    }

    if (weapon.Effects.includes(Effect.Stun)) {
      hurtEntity.runCommandAsync("function weapon/stunning");
    }

    if (weapon.Effects.includes(Effect.SoulGauge)) {
      const souls = world.scoreboard.getObjective("soulGauge").getScore(player);
      if (souls >= 100) return;
      const soul = Math.floor(Math.random() * 5);
      if (soul > 0) return;
      if (
        target.matches({
          families: ["monster"],
        })
      ) {
        target.runCommandAsync("function weapon/soul_siphon_fx_target");
        player.runCommandAsync("function weapon/soul_siphon_fx_player");
        world.scoreboard.getObjective("soulGauge").addScore(player, 1);
        if (souls < 99 && player.hasTag("dungeons:verdant_armour"))
          world.scoreboard.getObjective("soulGauge").addScore(player, 1);
      }
    }

    if (weapon.Effects.includes(Effect.WeaknessAttack)) {
      target.addEffect("weakness", 166);
      target.dimension.spawnParticle("dungeons:cauldron_summon", {
        x: target.location.x,
        y: target.location.y + 1,
        z: target.location.z,
      });
    }

    if (weapon.Effects.includes(Effect.SlownessAttack)) {
      target.addEffect("slowness", 66, {
        amplifier: 2,
        showParticles: true,
      });
      target.runCommandAsync("function weapon/spooky_freezing_fx");
    }

    if (weapon.Effects.includes(Effect.Chaining)) {
      target.runCommandAsync("function weapon/chaining");
    }

    if (weapon.Effects.includes(Effect.AreaDamage)) {
      player.runCommandAsync("function weapon/swirling");
      player.dimension
        .getEntities({
          location: player.location,
          maxDistance: 4,
          excludeFamilies: ["ignore"],
        })
        .forEach((entity) => {
          const xDif = entity.location.x - player.location.x;
          const zDif = entity.location.z - player.location.z;
          if (entity === target || entity === player) return;
          if (entity === undefined || !entity.isValid()) return;
          if (entity.typeId === "minecraft:item") return;
          entity.applyKnockback(xDif, zDif, 0.25, 0.25);
          entity.applyDamage(Math.floor(baseDamage / 2), {
            cause: EntityDamageCause.entityAttack,
            damagingEntity: player,
          });
        });
    }

    if (weapon.Effects.includes(Effect.Shockwave)) {
      player.runCommandAsync("function weapon/shockwave_fx");
      player.dimension
        .getEntities({
          location: player.location,
          maxDistance: 6,
          excludeFamilies: ["ignore"],
        })
        .forEach((entity) => {
          const xDif = entity.location.x - player.location.x;
          const zDif = entity.location.z - player.location.z;
          if (entity === target || entity === player) return;
          if (entity === undefined || !entity.isValid()) return;
          if (entity.typeId === "minecraft:item") return;
          entity.applyKnockback(xDif, zDif, 2.0, 2.0);
          entity.applyDamage(Math.floor(baseDamage / 2), {
            cause: EntityDamageCause.entityAttack,
            damagingEntity: player,
          });
        });
    }

    if (weapon.Effects.includes(Effect.FireStrike)) {
      player.runCommandAsync("function weapon/swirling");
      player.playSound("mob.ghast.fireball", {
        pitch: 1.05,
        volume: 0.33,
      });
      player.dimension
        .getEntities({
          location: player.location,
          maxDistance: 4,
          excludeFamilies: ["ignore"],
        })
        .forEach((entity) => {
          const xDif = entity.location.x - player.location.x;
          const zDif = entity.location.z - player.location.z;
          if (entity === target) {
            entity.setOnFire(3, true);
          }
          if (entity === player) return;
          if (entity === undefined || !entity.isValid()) return;
          if (entity.typeId === "minecraft:item") return;
          entity.applyKnockback(xDif, zDif, 0.25, 0.25);
          entity.setOnFire(3, true);
        });
    }

    if (weapon.Effects.includes(Effect.AreaPoison)) {
      player.dimension
        .getEntities({
          location: player.location,
          maxDistance: 5,
          excludeFamilies: ["ignore"],
        })
        .forEach((entity) => {
          const xDif = entity.location.x - player.location.x;
          const zDif = entity.location.z - player.location.z;
          if (entity === player) return;
          if (entity === undefined || !entity.isValid()) return;
          if (entity.typeId === "minecraft:item") return;
          entity.applyKnockback(xDif, zDif, 0.25, 0.25);
          entity.addEffect("poison", 80, {
            amplifier: 1,
            showParticles: true,
          });
        });
    }

    if (weapon.Effects.includes(Effect.PermaFrost)) {
      player.dimension
        .getEntities({
          location: player.location,
          maxDistance: 4,
          excludeFamilies: ["ignore"],
        })
        .forEach((entity) => {
          const xDif = entity.location.x - player.location.x;
          const zDif = entity.location.z - player.location.z;
          if (entity === target || entity === player) return;
          if (entity === undefined || !entity.isValid()) return;
          if (entity.typeId === "minecraft:item") return;
          entity.runCommandAsync("function weapon/freezing_fx");
          entity.addEffect("slowness", 66, {
            amplifier: 3,
            showParticles: true,
          });
          entity.applyKnockback(xDif, zDif, 0.25, 0.25);
          entity.applyDamage(Math.floor(1), {
            cause: EntityDamageCause.freezing,
            damagingEntity: player,
          });
        });
    }

    if (weapon.Effects.includes(Effect.HighAreaDamage)) {
      player.runCommandAsync("function weapon/obsidian_claymore_fx");
      player.dimension
        .getEntities({
          location: player.location,
          maxDistance: 5,
          excludeFamilies: ["ignore"],
        })
        .forEach((entity) => {
          const xDif = entity.location.x - player.location.x;
          const zDif = entity.location.z - player.location.z;
          if (entity === target || entity === player) return;
          if (entity === undefined || !entity.isValid()) return;
          if (entity.typeId === "minecraft:item") return;
          entity.applyKnockback(xDif, zDif, 0.25, 0.25);
          entity.applyDamage(Math.floor(baseDamage / 2), {
            cause: EntityDamageCause.entityAttack,
            damagingEntity: player,
          });
        });
    }

    if (weapon.Effects.includes(Effect.HighKnockback)) {
      const xDif = target.location.x - player.location.x;
      const zDif = target.location.z - player.location.z;
      target.applyKnockback(xDif, zDif, 1, 0.23);
    }

    if (weapon.Effects.includes(Effect.Gravity)) {
      target.runCommandAsync("function weapon/anchor_fx");
      target.applyKnockback(0, 0, 0, 0.3);
      target.dimension
        .getEntities({
          location: target.location,
          maxDistance: 4,
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

    if (weapon.Effects.includes(Effect.HighGravity)) {
      target.runCommandAsync("function weapon/spooky_gravity_hammer_fx");
      target.applyKnockback(0, 0, 0, 0.3);
      target.dimension
        .getEntities({
          location: target.location,
          maxDistance: 5,
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

    if (weapon.Effects.includes(Effect.DoubleCritical)) {
      crit = 3.0;
    }

    if (weapon.Effects.includes(Effect.DistanceAttack)) {
      target.dimension.playSound("weapon.whip.crack", target.location);
      target.dimension.spawnParticle("dungeons:whip_crack", loc);
      target.dimension.spawnParticle("dungeons:whip_sparks", loc);

      const atacante = player;
      const alvo = target;
      if (!alvo) return baseDamage;
      const xDif = Math.abs(atacante.location.x - alvo.location.x);
      const yDif = Math.abs(atacante.location.y - alvo.location.y);
      const zDif = Math.abs(atacante.location.z - alvo.location.z);
      let aumentoDano = 0;
      if (xDif > yDif && xDif > zDif) {
        aumentoDano = xDif;
      } else if (yDif > xDif && yDif > zDif) {
        aumentoDano = yDif;
      } else if (zDif > xDif && zDif > yDif) {
        aumentoDano = zDif;
      } else {
        aumentoDano = xDif;
      }

      if (aumentoDano >= 5) {
        baseDamage += 8;
      } else if (aumentoDano >= 4) {
        baseDamage += 2;
      } else if (aumentoDano >= 3) {
        baseDamage += 1;
      }
    }
  }

  return baseDamage;
}

/**
 * @typedef {Object} WeaponStat
 * @property {string} Id
 * @property {number} Damage
 * @property {number} AttackSpeed
 * @property {boolean} IsMelee
 * @property {boolean} UseShield
 * @property {boolean} SweepAttack
 * @property {string} Rarity
 * @property {string[]} [Effects]
 * @property {string} Weight
 */

/** @type {WeaponStat[]} */
export const WeaponStats = [
  // COMMON
  {
    Id: "minecraft:wooden_sword",
    Damage: [1, 2],
    AttackSpeed: 0.86, // DPS: 1.72
    IsMelee: true,
    UseShield: true,
    SweepAttack: true,
    Effects: [Effect.SweepAttack],
    Rarity: Rarity.Common,
    Weight: Weight.Medium,
  },
  {
    Id: "minecraft:bow",
    Damage: [1, 5],
    ProjectileSpeed: 1.8, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Rarity: Rarity.Common,
    Weight: Weight.Medium,
  },
  {
    Id: "minecraft:wooden_axe",
    Damage: [3, 4],
    AttackSpeed: 0.43, // DPS: 2.15
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Common,
    Weight: Weight.Heavy,
  },
  {
    Id: "minecraft:stone_sword",
    Damage: [1, 3],
    AttackSpeed: 0.8, // DPS: 2.40
    IsMelee: true,
    UseShield: true,
    SweepAttack: true,
    Effects: [Effect.SweepAttack],
    Rarity: Rarity.Common,
    Weight: Weight.Medium,
  },
  {
    Id: "minecraft:stone_axe",
    Damage: [4, 5],
    AttackSpeed: 0.5, // DPS: 3.00
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Common,
    Weight: Weight.Heavy,
  },
  {
    Id: "dungeons:battlestaff",
    Damage: [1, 2],
    AttackSpeed: 1.35, // DPS: 1.50
    IsMelee: true,
    UseShield: false,
    SweepAttack: true,
    Effects: [Effect.SweepAttack],
    Rarity: Rarity.Common,
    Weight: Weight.Light,
  },
  // UNCOMMON
  {
    Id: "minecraft:iron_sword",
    Damage: [2, 4],
    AttackSpeed: 0.8, // DPS: 3.20
    IsMelee: true,
    UseShield: true,
    SweepAttack: true,
    Effects: [Effect.SweepAttack],
    Rarity: Rarity.Uncommon,
    Weight: Weight.Medium,
  },
  {
    Id: "minecraft:crossbow",
    Damage: [1, 4],
    ProjectileSpeed: 3.0, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Rarity: Rarity.Uncommon,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:exploding_crossbow",
    Damage: [2, 5],
    ProjectileSpeed: 3.5, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Rarity: Rarity.Uncommon,
    Effects: [Effect.ExplodeProjectile],
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:cog_crossbow",
    Damage: [2, 5],
    ProjectileSpeed: 3.5, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.MoreDamageProjectile],
    Rarity: Rarity.Uncommon,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:burst_crossbow",
    Damage: [2, 5],
    ProjectileSpeed: 3.5, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Rarity: Rarity.Uncommon,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:soul_crossbow",
    Damage: [2, 5],
    ProjectileSpeed: 3.5, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.EnigmaResonator],
    Rarity: Rarity.Uncommon,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:heavy_crossbow",
    Damage: [2, 5],
    ProjectileSpeed: 4.5, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.BonusDamageProjectile],
    Rarity: Rarity.Uncommon,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:harpoon_crossbow",
    Damage: [2, 5],
    ProjectileSpeed: 3.5, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.ArponMoreDamageProjectile],
    Rarity: Rarity.Uncommon,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:longbow",
    Damage: [2, 6],
    ProjectileSpeed: 2.5, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Rarity: Rarity.Uncommon,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:wind_bow",
    Damage: [2, 6],
    ProjectileSpeed: 2.5, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.WindProjectile],
    Rarity: Rarity.Uncommon,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:twisting_vine_bow",
    Damage: [2, 6],
    ProjectileSpeed: 2.5, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.PoisonProjectile],
    Rarity: Rarity.Uncommon,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:snow_bow",
    Damage: [2, 6],
    ProjectileSpeed: 2.5, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.SlownessProjectile],
    Rarity: Rarity.Uncommon,
    Weight: Weight.Medium,
  },
  {
    Id: "edx:iron_spear_i",
    Damage: [2, 5],
    AttackSpeed: 0.9, // DPS: 3.20
    IsMelee: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.SpearAttack],
    Rarity: Rarity.Uncommon,
    Weight: Weight.Medium,
  },
  {
    Id: "edx:tin_sword",
    Damage: [1, 3],
    AttackSpeed: 0.9, // DPS: 3.20
    IsMelee: true,
    UseShield: true,
    SweepAttack: true,
    Effects: [Effect.SweepAttack],
    Rarity: Rarity.Uncommon,
    Weight: Weight.Medium,
  },
  {
    Id: "edx:tin_spear_i",
    Damage: [2, 4],
    AttackSpeed: 1.0, // DPS: 3.20
    IsMelee: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.SpearAttack],
    Rarity: Rarity.Uncommon,
    Weight: Weight.Medium,
  },
  {
    Id: "edx:crimson_nickel_sword",
    Damage: [1, 3],
    AttackSpeed: 0.95, // DPS: 3.20
    IsMelee: true,
    UseShield: true,
    SweepAttack: true,
    Effects: [Effect.SweepAttack],
    Rarity: Rarity.Uncommon,
    Weight: Weight.Medium,
  },
  {
    Id: "edx:crimson_nickel_spear_i",
    Damage: [2, 4],
    AttackSpeed: 1.05, // DPS: 3.20
    IsMelee: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.SpearAttack],
    Rarity: Rarity.Uncommon,
    Weight: Weight.Medium,
  },
  {
    Id: "edx:warped_nickel_sword",
    Damage: [1, 2],
    AttackSpeed: 1.6, // DPS: 3.20
    IsMelee: true,
    UseShield: true,
    SweepAttack: true,
    Effects: [Effect.SweepAttack],
    Rarity: Rarity.Uncommon,
    Weight: Weight.Medium,
  },
  {
    Id: "edx:warped_nickel_spear_i",
    Damage: [1, 3],
    AttackSpeed: 1.7, // DPS: 3.20
    IsMelee: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.SpearAttack],
    Rarity: Rarity.Uncommon,
    Weight: Weight.Medium,
  },
  {
    Id: "edx:copper_sword",
    Damage: [3, 5],
    AttackSpeed: 0.65, // DPS: 3.25
    IsMelee: true,
    UseShield: true,
    SweepAttack: true,
    Effects: [Effect.SweepAttack],
    Rarity: Rarity.Uncommon,
    Weight: Weight.Medium,
  },
  {
    Id: "edx:copper_spear_i",
    Damage: [3, 6],
    AttackSpeed: 0.75, // DPS: 3.25
    IsMelee: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.SpearAttack],
    Rarity: Rarity.Uncommon,
    Weight: Weight.Medium,
  },
  {
    Id: "edx:spider_mandibule",
    Damage: [1, 2],
    AttackSpeed: 0.8, // DPS: 3.20
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Effects: [Effect.Bleeding],
    Rarity: Rarity.Uncommon,
    Weight: Weight.Medium,
  },
  {
    Id: "minecraft:iron_axe",
    Damage: [5, 6],
    AttackSpeed: 0.5, // DPS: 3.00
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Uncommon,
    Weight: Weight.Heavy,
  },
  {
    Id: "edx:tin_axe",
    Damage: [3, 4],
    AttackSpeed: 0.75, // DPS: 3.00
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Uncommon,
    Weight: Weight.Heavy,
  },
  {
    Id: "edx:copper_axe",
    Damage: [6, 7],
    AttackSpeed: 0.3, // DPS: 2.10
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Uncommon,
    Weight: Weight.Heavy,
  },
  {
    Id: "minecraft:golden_sword",
    Damage: [1, 3],
    AttackSpeed: 1.1, // DPS: 3.30
    IsMelee: true,
    UseShield: true,
    SweepAttack: true,
    Effects: [Effect.SweepAttack],
    Rarity: Rarity.Uncommon,
    Weight: Weight.Medium,
  },
  {
    Id: "minecraft:golden_axe",
    Damage: [4, 5],
    AttackSpeed: 0.7, // DPS: 3.50
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Uncommon,
    Weight: Weight.Heavy,
  },
  {
    Id: "dungeons:rapier",
    Damage: [2, 4],
    AttackSpeed: 0.9, // DPS: 3.60
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Uncommon,
    Weight: Weight.Light,
  },
  {
    Id: "dungeons:broken_sawblade",
    Damage: [5, 6],
    AttackSpeed: 0.8, // DPS: 4.80
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Uncommon,
    Effects: [Effect.Sawblade],
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:coral_blade",
    Damage: [1, 2],
    AttackSpeed: 1.0, // DPS: 2.00
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Uncommon,
    Effects: [Effect.AquaDamage],
    Weight: Weight.Light,
  },
  {
    Id: "dungeons:soul_knife",
    Damage: [1, 2],
    AttackSpeed: 1.1, // DPS: 2.20
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Uncommon,
    Effects: [Effect.SoulCollect],
    Weight: Weight.Light,
  },
  {
    Id: "dungeons:soul_scythe",
    Damage: [5, 6],
    AttackSpeed: 0.65, // DPS: 4.80
    IsMelee: true,
    UseShield: false,
    SweepAttack: true,
    Rarity: Rarity.Uncommon,
    Effects: [Effect.SoulCollect, Effect.SweepAttack],
    Weight: Weight.VeryHeavy,
  },
  {
    Id: "dungeons:tempest_knife",
    Damage: [1, 3],
    AttackSpeed: 0.95, // DPS: 2.85
    IsMelee: true,
    UseShield: true,
    SweepAttack: true,
    Rarity: Rarity.Uncommon,
    Effects: [Effect.KillMoveSpeed, Effect.SweepAttack],
    Weight: Weight.Light,
  },
  {
    Id: "dungeons:whip",
    Damage: [1, 1],
    AttackSpeed: 0.6, // DPS: 0.60
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Uncommon,
    Effects: [Effect.DistanceAttack],
    Weight: Weight.Light,
  },
  {
    Id: "dungeons:cutlass",
    Damage: [2, 3],
    AttackSpeed: 0.7, // DPS: 2.80
    IsMelee: true,
    UseShield: true,
    SweepAttack: true,
    Rarity: Rarity.Uncommon,
    Effects: [Effect.DoubleCritical, Effect.SweepAttack],
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:axe",
    Damage: [4, 5],
    AttackSpeed: 0.35, // DPS: 2.45
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Uncommon,
    Effects: [Effect.DoubleCritical],
    Weight: Weight.Heavy,
  },
  {
    Id: "dungeons:double_axe",
    Damage: [4, 5],
    AttackSpeed: 0.35, // DPS: 2.45
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Uncommon,
    Effects: [Effect.AreaDamage],
    Weight: Weight.Heavy,
  },
  {
    Id: "dungeons:anchor",
    Damage: [6, 7],
    AttackSpeed: 0.55, // DPS: 4.00
    IsMelee: true,
    UseShield: false,
    SweepAttack: false,
    Rarity: Rarity.Uncommon,
    Effects: [Effect.Gravity],
    Weight: Weight.VeryHeavy,
  },
  {
    Id: "dungeons:bone_club",
    Damage: [5, 6],
    AttackSpeed: 0.72, // DPS: 4.80
    IsMelee: true,
    UseShield: false,
    SweepAttack: false,
    Rarity: Rarity.Uncommon,
    Effects: [Effect.HighKnockback],
    Weight: Weight.VeryHeavy,
  },
  {
    Id: "dungeons:claymore",
    Damage: [6, 7],
    AttackSpeed: 0.5, // DPS: 4.80
    IsMelee: true,
    UseShield: false,
    SweepAttack: true,
    Effects: [Effect.SweepAttack],
    Rarity: Rarity.Uncommon,
    Weight: Weight.VeryHeavy,
  },
  {
    Id: "dungeons:great_hammer",
    Damage: [5, 6],
    AttackSpeed: 0.48, // DPS: 4.80
    IsMelee: true,
    UseShield: false,
    SweepAttack: false,
    Rarity: Rarity.Uncommon,
    Effects: [Effect.Gravity, Effect.AreaDamage],
    Weight: Weight.VeryHeavy,
  },
  {
    Id: "dungeons:daggers",
    Damage: [3, 4],
    AttackSpeed: 1.3, // DPS: 5.20
    IsMelee: true,
    UseShield: false,
    SweepAttack: false,
    Rarity: Rarity.Uncommon,
    Weight: Weight.Light,
  },
  {
    Id: "dungeons:katana",
    Damage: [4, 5],
    AttackSpeed: 0.95, // DPS: 4.75
    IsMelee: true,
    UseShield: false,
    SweepAttack: true,
    Effects: [Effect.SweepAttack],
    Rarity: Rarity.Uncommon,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:sword",
    Damage: [4, 5],
    AttackSpeed: 0.8, // DPS: 3.20
    IsMelee: true,
    UseShield: false,
    SweepAttack: true,
    Rarity: Rarity.Uncommon,
    Effects: [Effect.WeaponBlock, Effect.SweepAttack],
    Weight: Weight.Medium,
  },
  // RARE
  {
    Id: "dungeons:corrupted_crossbow",
    Damage: [3, 6],
    ProjectileSpeed: 4.0, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.CriticalProjectile],
    Rarity: Rarity.Rare,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:doom_crossbow",
    Damage: [3, 6],
    ProjectileSpeed: 4.0, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.BonusDamageProjectile],
    Rarity: Rarity.Rare,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:feral_soul_crossbow",
    Damage: [3, 6],
    ProjectileSpeed: 4.0, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.EnigmaResonator],
    Rarity: Rarity.Rare,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:firebolt_thrower",
    Damage: [3, 6],
    ProjectileSpeed: 4.0, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.ExplodeProjectile],
    Rarity: Rarity.Rare,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:nautical_crossbow",
    Damage: [3, 6],
    ProjectileSpeed: 4.0, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.ArponMoreDamageProjectile],
    Rarity: Rarity.Rare,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:slayer_crossbow",
    Damage: [3, 6],
    ProjectileSpeed: 4.0, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.RicochetProjectilem, Effect.BonusDamageProjectile],
    Rarity: Rarity.Rare,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:bonebow",
    Damage: [3, 7],
    ProjectileSpeed: 3.0, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.ScaleDamageProjectile],
    Rarity: Rarity.Rare,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:burst_gale_bow",
    Damage: [3, 7],
    ProjectileSpeed: 3.0, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.WindProjectile],
    Rarity: Rarity.Rare,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:echo_of_the_valley",
    Damage: [3, 7],
    ProjectileSpeed: 3.0, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.RicochetProjectile],
    Rarity: Rarity.Rare,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:guardian_bow",
    Damage: [3, 7],
    ProjectileSpeed: 3.0, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.HighKnockbackProjectile],
    Rarity: Rarity.Rare,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:weeping_vine_bow",
    Damage: [3, 7],
    ProjectileSpeed: 3.0, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.PoisonProjectile],
    Rarity: Rarity.Rare,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:winters_touch",
    Damage: [3, 7],
    ProjectileSpeed: 3.0, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.WeaknessProjectile],
    Rarity: Rarity.Rare,
    Weight: Weight.Medium,
  },
  {
    Id: "minecraft:diamond_sword",
    Damage: [3, 5],
    AttackSpeed: 0.83, // DPS: 4.15
    IsMelee: true,
    UseShield: true,
    SweepAttack: true,
    Effects: [Effect.SweepAttack],
    Rarity: Rarity.Rare,
    Weight: Weight.Medium,
  },
  {
    Id: "minecraft:trident",
    Damage: [3, 4],
    AttackSpeed: 0.75, // DPS: 4.15
    IsMelee: true,
    UseShield: true,
    SweepAttack: true,
    Effects: [Effect.Throw],
    Rarity: Rarity.Rare,
    Weight: Weight.Medium,
  },
  {
    Id: "edx:platinium_sword",
    Damage: [3, 5],
    AttackSpeed: 0.9, // DPS: 4.50
    IsMelee: true,
    UseShield: true,
    SweepAttack: true,
    Effects: [Effect.SweepAttack],
    Rarity: Rarity.Rare,
    Weight: Weight.Medium,
  },
  {
    Id: "edx:platinium_spear_i",
    Damage: [5, 6],
    AttackSpeed: 1.0, // DPS: 4.50
    IsMelee: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.SpearAttack],
    Rarity: Rarity.Rare,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:truthseeker",
    Damage: [4, 5],
    AttackSpeed: 0.7, // DPS: 4.50
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Rare,
    Effects: [Effect.PoisonAttack],
    Weight: Weight.Medium,
  },
  {
    Id: "minecraft:diamond_axe",
    Damage: [6, 7],
    AttackSpeed: 0.63, // DPS: 4.41
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Rare,
    Weight: Weight.Heavy,
  },
  {
    Id: "edx:crimson_nickel_axe",
    Damage: [7, 8],
    AttackSpeed: 0.43, // DPS: 4.41
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Rare,
    Weight: Weight.Heavy,
  },
  {
    Id: "edx:warped_nickel_axe",
    Damage: [4, 5],
    AttackSpeed: 0.9, // DPS: 4.41
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Rare,
    Weight: Weight.Heavy,
  },

  {
    Id: "edx:platinium_axe",
    Damage: [5, 6],
    AttackSpeed: 0.8, // DPS: 5.10
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Rare,
    Weight: Weight.Heavy,
  },
  {
    Id: "dungeons:cursed_axe",
    Damage: [4, 5],
    AttackSpeed: 0.6, // DPS: 4.41
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Effects: [Effect.PoisonAttack, Effect.CorposeExplode],
    Rarity: Rarity.Rare,
    Weight: Weight.Heavy,
  },
  {
    Id: "dungeons:dark_katana",
    Damage: [5, 6],
    AttackSpeed: 1.05, // DPS: 4.75
    IsMelee: true,
    UseShield: false,
    SweepAttack: true,
    Effects: [Effect.SweepAttack, Effect.KillMoveSpeed],
    Rarity: Rarity.Uncommon,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:encrusted_anchor",
    Damage: [7, 8],
    AttackSpeed: 0.65, // DPS: 4.00
    IsMelee: true,
    UseShield: false,
    SweepAttack: false,
    Rarity: Rarity.Rare,
    Effects: [Effect.HighGravity, Effect.AreaPoison],
    Weight: Weight.VeryHeavy,
  },
  {
    Id: "dungeons:highlands_axe",
    Damage: [5, 6],
    AttackSpeed: 0.63, // DPS: 4.68
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Rare,
    Effects: [Effect.Stun],
    Weight: Weight.Heavy,
  },
  {
    Id: "dungeons:vine_whip",
    Damage: [1, 2],
    AttackSpeed: 0.7, // DPS: 0.60
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Rare,
    Effects: [Effect.DistanceAttack, Effect.PoisonAttack],
    Weight: Weight.Light,
  },
  {
    Id: "dungeons:mechanised_sawblade",
    Damage: [6, 7],
    AttackSpeed: 0.9, // DPS: 4.80
    IsMelee: true,
    UseShield: true,
    SweepAttack: true,
    Rarity: Rarity.Rare,
    Effects: [Effect.Sawblade, Effect.SweepAttack],
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:nameless_blade",
    Damage: [4, 5],
    AttackSpeed: 0.73, // DPS: 5.04
    IsMelee: true,
    UseShield: true,
    SweepAttack: true,
    Rarity: Rarity.Rare,
    Effects: [Effect.SweepAttack, Effect.WeaknessAttack],
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:obsidian_claymore",
    Damage: [7, 8],
    AttackSpeed: 0.65, // DPS: 5.20
    IsMelee: true,
    UseShield: false,
    SweepAttack: true,
    Effects: [Effect.SweepAttack],
    Rarity: Rarity.Rare,
    Weight: Weight.VeryHeavy,
  },
  {
    Id: "dungeons:growing_staff",
    Damage: [1, 3],
    AttackSpeed: 1.65, // DPS: 4.95
    IsMelee: true,
    UseShield: false,
    SweepAttack: true,
    Effects: [Effect.SweepAttack, Effect.HighAreaDamage],
    Rarity: Rarity.Rare,
    Weight: Weight.Light,
  },
  {
    Id: "dungeons:sponge_striker",
    Damage: [1, 3],
    AttackSpeed: 1.2, // DPS: 3.60
    IsMelee: true,
    UseShield: true,
    SweepAttack: true,
    Rarity: Rarity.Rare,
    Effects: [Effect.AquaDamage, Effect.SweepAttack],
    Weight: Weight.Light,
  },
  {
    Id: "dungeons:frost_scythe",
    Damage: [5, 7],
    AttackSpeed: 0.75, // DPS: 7.00
    IsMelee: true,
    UseShield: false,
    SweepAttack: true,
    Effects: [Effect.SoulCollect, Effect.SweepAttack, Effect.SlownessAttack],
    Rarity: Rarity.Rare,
    Weight: Weight.VeryHeavy,
  },
  {
    Id: "dungeons:jailors_scythe",
    Damage: [5, 7],
    AttackSpeed: 0.88, // DPS: 7.00
    IsMelee: true,
    UseShield: false,
    SweepAttack: true,
    Effects: [Effect.SweepAttack, Effect.Chaining],
    Rarity: Rarity.Rare,
    Weight: Weight.VeryHeavy,
  },
  {
    Id: "dungeons:eternal_knife",
    Damage: [3, 4],
    AttackSpeed: 1.05, // DPS: 4.20
    IsMelee: true,
    UseShield: true,
    SweepAttack: true,
    Rarity: Rarity.Rare,
    Effects: [Effect.SweepAttack, Effect.SoulGauge, Effect.SoulCollect],
    Weight: Weight.Light,
  },
  {
    Id: "dungeons:frost_knives",
    Damage: [4, 5],
    AttackSpeed: 1.3, // DPS: 4.20
    IsMelee: true,
    UseShield: false,
    SweepAttack: false,
    Rarity: Rarity.Rare,
    Effects: [Effect.PermaFrost],
    Weight: Weight.Light,
  },
  {
    Id: "dungeons:sheer_daggers",
    Damage: [4, 5],
    AttackSpeed: 1.0, // DPS: 4.20
    IsMelee: true,
    UseShield: false,
    SweepAttack: false,
    Rarity: Rarity.Rare,
    Effects: [Effect.AreaDamage],
    Weight: Weight.Light,
  },
  {
    Id: "dungeons:chill_gale_knife",
    Damage: [2, 3],
    AttackSpeed: 1.4, // DPS: 4.20
    IsMelee: true,
    UseShield: true,
    SweepAttack: true,
    Rarity: Rarity.Rare,
    Effects: [Effect.KillMoveSpeed, Effect.SweepAttack],
    Weight: Weight.Light,
  },
  {
    Id: "dungeons:great_axeblade",
    Damage: [8, 9],
    AttackSpeed: 0.5, // DPS: 5.20
    IsMelee: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.HighKnockback],
    Rarity: Rarity.Rare,
    Weight: Weight.VeryHeavy,
  },
  {
    Id: "dungeons:stormlander",
    Damage: [6, 7],
    AttackSpeed: 0.6, // DPS: 7.00
    IsMelee: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.HighGravity, Effect.HighAreaDamage],
    Rarity: Rarity.Rare,
    Weight: Weight.VeryHeavy,
  },
  {
    Id: "dungeons:bone_cudgel",
    Damage: [6, 7],
    AttackSpeed: 0.77, // DPS: 7.00
    IsMelee: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.IllageBane, Effect.HighKnockback],
    Rarity: Rarity.Rare,
    Weight: Weight.VeryHeavy,
  },
  {
    Id: "dungeons:diamond_sword",
    Damage: [6, 8],
    AttackSpeed: 0.8, // DPS: 7.00
    IsMelee: true,
    UseShield: false,
    SweepAttack: true,
    Effects: [Effect.SweepAttack],
    Rarity: Rarity.Rare,
    Weight: Weight.VeryHeavy,
  },
  {
    Id: "dungeons:heartstealer",
    Damage: [6, 7],
    AttackSpeed: 0.7, // DPS: 7.00
    IsMelee: true,
    UseShield: false,
    SweepAttack: true,
    Effects: [Effect.SweepAttack, Effect.Leeching],
    Rarity: Rarity.Rare,
    Weight: Weight.VeryHeavy,
  },
  {
    Id: "dungeons:hawkbrand",
    Damage: [5, 6],
    AttackSpeed: 0.7, // DPS: 7.00
    IsMelee: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.DoubleCritical, Effect.WeaponBlock],
    Rarity: Rarity.Rare,
    Weight: Weight.VeryHeavy,
  },
  {
    Id: "dungeons:whirlwind",
    Damage: [6, 7],
    AttackSpeed: 0.7, // DPS: 7.00
    IsMelee: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.Shockwave],
    Rarity: Rarity.Rare,
    Weight: Weight.VeryHeavy,
  },

  // EPIC
  {
    Id: "dungeons:imploding_crossbow",
    Damage: [4, 7],
    ProjectileSpeed: 5.0, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.ExplodeProjectile],
    Rarity: Rarity.Epic,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:pride_of_the_piglins",
    Damage: [4, 7],
    ProjectileSpeed: 5.0, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.MoreDamageProjectile],
    Rarity: Rarity.Epic,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:soul_hunter_crossbow",
    Damage: [4, 7],
    ProjectileSpeed: 5.0, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.EnigmaResonator],
    Rarity: Rarity.Epic,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:voidcaller",
    Damage: [4, 7],
    ProjectileSpeed: 5.0, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.MoreDamageProjectile],
    Rarity: Rarity.Epic,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:red_snake",
    Damage: [4, 8],
    ProjectileSpeed: 3.5, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.ExplodeProjectile],
    Rarity: Rarity.Epic,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:twin_bow",
    Damage: [4, 8],
    ProjectileSpeed: 3.5, // DPS: 1.72
    IsMelee: false,
    IsRanged: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.RicochetProjectile],
    Rarity: Rarity.Epic,
    Weight: Weight.Medium,
  },
  {
    Id: "edx:blaze_blade",
    Damage: [2, 3],
    AttackSpeed: 0.85, // DPS: 5.04
    IsMelee: false,
    UseShield: true,
    SweepAttack: false,
    Effects: [Effect.FireStrike, Effect.FireProjectile],
    Rarity: Rarity.Epic,
    Weight: Weight.Medium,
  },
  {
    Id: "minecraft:netherite_sword",
    Damage: [4, 6],
    AttackSpeed: 0.86, // DPS: 5.04
    IsMelee: true,
    UseShield: true,
    SweepAttack: true,
    Rarity: Rarity.Epic,
    Effects: [Effect.SweepAttack],
    Weight: Weight.Medium,
  },
  {
    Id: "edx:crimson_netherite_sword",
    Damage: [5, 7],
    AttackSpeed: 0.75, // DPS: 5.25
    IsMelee: true,
    UseShield: true,
    SweepAttack: true,
    Rarity: Rarity.Epic,
    Effects: [Effect.SweepAttack],
    Weight: Weight.Medium,
  },
  {
    Id: "edx:crimson_netherite_spear_i",
    Damage: [7, 8],
    AttackSpeed: 0.85, // DPS: 5.25
    IsMelee: true,
    UseShield: false,
    SweepAttack: false,
    Rarity: Rarity.Epic,
    Effects: [Effect.SpearAttack],
    Weight: Weight.Medium,
  },
  {
    Id: "edx:warped_netherite_sword",
    Damage: [3, 5],
    AttackSpeed: 1.05, // DPS: 5.25
    IsMelee: true,
    UseShield: true,
    SweepAttack: true,
    Rarity: Rarity.Epic,
    Effects: [Effect.SweepAttack],
    Weight: Weight.Medium,
  },
  {
    Id: "edx:warped_netherite_spear_i",
    Damage: [3, 6],
    AttackSpeed: 1.15, // DPS: 3.20
    IsMelee: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.SpearAttack],
    Rarity: Rarity.Epic,
    Weight: Weight.Medium,
  },
  {
    Id: "edx:crimson_netherite_axe",
    Damage: [8, 9],
    AttackSpeed: 0.5, // DPS: 4.50
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Epic,
    Weight: Weight.Heavy,
  },
  {
    Id: "edx:old_armblade",
    Damage: [9, 10],
    AttackSpeed: 0.45, // DPS: 4.00
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Epic,
    Weight: Weight.Heavy,
  },
  {
    Id: "edx:warped_netherite_axe",
    Damage: [6, 7],
    AttackSpeed: 0.85, // DPS: 4.50
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Epic,
    Weight: Weight.Heavy,
  },

  {
    Id: "edx:old_axe",
    Damage: [9, 10],
    AttackSpeed: 0.4, // DPS: 4.00
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Epic,
    Weight: Weight.Heavy,
  },
  {
    Id: "minecraft:mace",
    Damage: [5, 6],
    AttackSpeed: 0.6, // DPS: 5.28
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Effects: [Effect.Stun, Effect.Shockwave],
    Rarity: Rarity.Epic,
    Weight: Weight.Heavy,
  },
  {
    Id: "minecraft:netherite_axe",
    Damage: [7, 8],
    AttackSpeed: 0.66, // DPS: 5.28
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Epic,
    Weight: Weight.Heavy,
  },
  {
    Id: "dungeons:firebrand",
    Damage: [6, 7],
    AttackSpeed: 0.55, // DPS: 5.28
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Rarity: Rarity.Epic,
    Effects: [Effect.FireStrike],
    Weight: Weight.Heavy,
  },
  {
    Id: "dungeons:freezing_foil",
    Damage: [5, 6],
    AttackSpeed: 0.7, // DPS: 5.04
    IsMelee: true,
    UseShield: true,
    SweepAttack: true,
    Rarity: Rarity.Epic,
    Effects: [Effect.SweepAttack, Effect.PermaFrost],
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:bee_stinger",
    Damage: [5, 6],
    AttackSpeed: 0.9, // DPS: 5.40
    IsMelee: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.SummonBee],
    Rarity: Rarity.Epic,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:sinister_sword",
    Damage: [5, 7],
    AttackSpeed: 0.8, // DPS: 7.00
    IsMelee: true,
    UseShield: false,
    SweepAttack: false,
    Effects: [Effect.DoubleCritical, Effect.WeaponBlock],
    Rarity: Rarity.Epic,
    Weight: Weight.VeryHeavy,
  },
  {
    Id: "dungeons:resolute_tempest_knife",
    Damage: [4, 5],
    AttackSpeed: 1.0, // DPS: 5.20
    IsMelee: true,
    UseShield: true,
    SweepAttack: true,
    Rarity: Rarity.Epic,
    Effects: [Effect.KillMoveSpeed, Effect.SweepAttack, Effect.SlownessAttack],
    Weight: Weight.Light,
  },
  {
    Id: "dungeons:moon_daggers",
    Damage: [5, 6],
    AttackSpeed: 1.3, // DPS: 4.20
    IsMelee: true,
    UseShield: false,
    SweepAttack: false,
    Rarity: Rarity.Epic,
    Effects: [Effect.EnigmaResonator, Effect.SoulCollect],
    Weight: Weight.Light,
  },
  {
    Id: "dungeons:skull_scythe",
    Damage: [7, 8],
    AttackSpeed: 0.8, // DPS: 7.00
    IsMelee: true,
    UseShield: false,
    SweepAttack: true,
    Effects: [Effect.SoulCollect, Effect.SweepAttack, Effect.SlownessAttack],
    Rarity: Rarity.Epic,
    Weight: Weight.VeryHeavy,
  },
  {
    Id: "dungeons:battlestaff_of_terror",
    Damage: [2, 4],
    AttackSpeed: 1.7, // DPS: 4.95
    IsMelee: true,
    UseShield: false,
    SweepAttack: true,
    Effects: [Effect.SweepAttack, Effect.HighAreaDamage, Effect.CorposeExplode],
    Rarity: Rarity.Epic,
    Weight: Weight.Light,
  },
  {
    Id: "dungeons:hammer_of_gravity",
    Damage: [7, 8],
    AttackSpeed: 0.7, // DPS: 7.00
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Effects: [Effect.HighGravity, Effect.HighAreaDamage],
    Rarity: Rarity.Epic,
    Weight: Weight.VeryHeavy,
  },
  {
    Id: "dungeons:bonehead_hammer",
    Damage: [6, 7],
    AttackSpeed: 0.6, // DPS: 7.00
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Effects: [Effect.FatalPoison],
    Rarity: Rarity.Epic,
    Weight: Weight.VeryHeavy,
  },
  {
    Id: "dungeons:dancers_sword",
    Damage: [6, 7],
    AttackSpeed: 0.7, // DPS: 7.00
    IsMelee: true,
    UseShield: true,
    SweepAttack: false,
    Effects: [Effect.Rampage],
    Rarity: Rarity.Epic,
    Weight: Weight.VeryHeavy,
  },
  {
    Id: "dungeons:masters_katana",
    Damage: [6, 7],
    AttackSpeed: 1.1, // DPS: 4.75
    IsMelee: true,
    UseShield: false,
    SweepAttack: true,
    Effects: [Effect.SweepAttack, Effect.KillMoveSpeed, Effect.DoubleCritical],
    Rarity: Rarity.Uncommon,
    Weight: Weight.Medium,
  },
  {
    Id: "dungeons:starless_night",
    Damage: [7, 8],
    AttackSpeed: 0.9, // DPS: 7.00
    IsMelee: true,
    UseShield: false,
    SweepAttack: true,
    Effects: [Effect.CorposeExplode, Effect.SweepAttack],
    Rarity: Rarity.Epic,
    Weight: Weight.VeryHeavy,
  },
  {
    Id: "dungeons:broadsword",
    Damage: [8, 9],
    AttackSpeed: 0.85, // DPS: 7.00
    IsMelee: true,
    UseShield: false,
    SweepAttack: true,
    Effects: [Effect.SweepAttack],
    Rarity: Rarity.Epic,
    Weight: Weight.VeryHeavy,
  },

  // LEGENDARY
  {
    Id: "edx:void_axe",
    Damage: [0, 0],
    AttackSpeed: 0.01, // DPS: 7.00
    IsMelee: true,
    UseShield: false,
    SweepAttack: true,
    Rarity: Rarity.Legendary,
    Weight: Weight.Light,
  },
  {
    Id: "edx:light_axe",
    Damage: [0, 0],
    AttackSpeed: 0.01, // DPS: 7.00
    IsMelee: true,
    UseShield: false,
    SweepAttack: true,
    Rarity: Rarity.Legendary,
    Weight: Weight.Light,
  },
];

// Estrutura de dados otimizada
export const WeaponDB = {
  // Mapa principal para busca por ID
  map: new Map(),

  // Índices secundários
  byRarity: {},
  byEffect: {},
  byType: {},
  byWeight: {},

  // Inicialização
  init(weapons) {
    weapons.forEach((weapon) => {
      // Mapa principal
      this.map.set(weapon.Id, weapon);

      // Índice de raridade
      if (!this.byRarity[weapon.Rarity]) this.byRarity[weapon.Rarity] = [];
      this.byRarity[weapon.Rarity].push(weapon);

      // Índice de efeitos
      weapon.Effects?.forEach((effect) => {
        if (!this.byEffect[effect]) this.byEffect[effect] = [];
        this.byEffect[effect].push(weapon);
      });

      // Índice de tipo (melee, ranged, etc.)
      const type = weapon.IsMelee
        ? "melee"
        : weapon.IsRanged
        ? "ranged"
        : "other";
      if (!this.byType[type]) this.byType[type] = [];
      this.byType[type].push(weapon);

      // Índice de peso
      if (!this.byWeight[weapon.Weight]) this.byWeight[weapon.Weight] = [];
      this.byWeight[weapon.Weight].push(weapon);
    });
  },

  // Métodos de busca
  getWeapon(id) {
    return this.map.get(id);
  },

  getWeaponsByRarity(rarity) {
    return this.byRarity[rarity] || [];
  },

  getWeaponsByEffect(effect) {
    return this.byEffect[effect] || [];
  },

  getWeaponsByType(type) {
    return this.byType[type] || [];
  },

  getWeaponsByWeight(weight) {
    return this.byWeight[weight] || [];
  },
};

// Inicialização com os dados originais
WeaponDB.init(WeaponStats);

// 📂 CORE/LoreCacheSystem.js
const dpsCache = new Map(); // Cache para DPS calculado

const rarityColors = {
  Comum: "§a",
  Incomum: "§9",
  Raro: "§b",
  Épico: "§d",
  Lendário: "§e",
};

// 1. Tipos de cache
const LORE_CACHES = {
  STATIC: new Map(), // Itens pré-processados (imutável)
  DYNAMIC: new Map(), // Itens gerados dinamicamente (LRU cache)
  PLAYER: new WeakMap(), // Cache por jogador (coletável pelo GC)
};

// 2. Tamanhos máximos (ajustáveis)
const CACHE_LIMITS = {
  STATIC: 1000,
  DYNAMIC: 500,
  PLAYER: 100,
};

// 📂 Adicione na seção de constantes
const WEAPONS_ITEMS = WeaponStats.map((weapon) => ({
  typeId: weapon.Id,
  getTags: null, // Tags base vazias
}));

preheatLoreCache();

// 4. Função de pré-carregamento
function preheatLoreCache() {
  // Limpa caches antigos
  LORE_CACHES.STATIC.clear();

  // 🔥 Pré-processa todos os itens comuns
  WeaponStats.forEach((item) => {
    const lore = generateBaseLore(item);
    const key = generateCacheKey(item);

    // Armazena em cache estático
    LORE_CACHES.STATIC.set(key, Object.freeze(lore));
  });

  // Pré-calcula variações com encantamentos
  precalculateEnchantedVariants();
}

// 5. Gerador de chaves de cache
function generateCacheKey(item, effectKey = null) {
  let key = item.Id;

  // Adiciona encantamentos à chave
  if (effectKey != null) {
    key = key + ":" + effectKey;
    // const tags = Array.from(item.getTags()).sort();
    // key += `|${tags.join(",")}`;
  }

  // Adiciona contexto do jogador se relevante
  // if (player?.getTags) {
  //     const playerTags = Array.from(player.getTags())
  //         .filter(t => t.startsWith('class:'))
  //         .sort();
  //     key += `@${playerTags.join(',')}`;
  // }

  return key;
}

// 6. Geração de lore base
function generateBaseLore(stats, levelEnchant = null, item = null) {
  try {
    if (!stats) return [];

    const { damageMin, damageMax } = calculateDamage(stats, levelEnchant, item);

    const attackSpeed = stats.AttackSpeed?.toFixed(2) || "N/A";
    const dps = stats.AttackSpeed
      ? `${calculateDPS(damageMax, stats.AttackSpeed)}s`
      : "N/A";
    const weight = stats.Weight || "Desconhecido";
    const shield = stats.UseShield ? "§aON" : "§cOFF";
    const rarity = rarityColors[stats.Rarity]
      ? rarityColors[stats.Rarity] + stats.Rarity
      : "§aComum";
    const criticalMultiplier =
      Array.isArray(stats.Effects) &&
      stats.Effects.includes(Effect.DoubleCritical)
        ? 3.0
        : 1.5;
    const criticalDamage = (damageMax * criticalMultiplier).toFixed(0);
    const effects = stats.Effects?.length
      ? stats.Effects.join(" | ")
      : "Sem efeitos";

    const lore = [
      "",
      `§rDano:§r§a ${damageMin}-${damageMax}`,
      stats.IsRanged
        ? `§rVelocidade do Projétil:§r§a ${
            stats.ProjectileSpeed?.toFixed(2) || "?"
          }m/s`
        : `§rCrítico Máximo:§r§a ${criticalDamage}`,
      stats.IsRanged ? "" : `§rVelocidade de Ataque:§r§a ${attackSpeed}`,
      stats.IsRanged ? "" : `§rDPS Máximo:§r§a ${dps}`,
      `§rEscudo: §r${shield}`,
      `§rPeso: §r§a${weight}`,
      "",
      "§rEfeitos:",
      "§r§a" + effects,
      "",
      `§rRaridade: §r${rarity}`,
    ];

    return Array.isArray(lore) ? lore : [];
  } catch (error) {
    console.error(
      "Erro ao gerar lore para item" + error + " rastreamento: " + error.stack
    );
    return [];
  }
}

// 7. Pré-cálculo de variações
function precalculateEnchantedVariants() {
  const ENCHANTMENTS = ["sharpness"];
  const LEVELS = [1, 2, 3];

  WeaponStats.forEach((baseItem) => {
    ENCHANTMENTS.forEach((ench) => {
      LEVELS.forEach((level) => {
        var effectKey = `ench:${ench}:${level}`;

        const key = generateCacheKey(baseItem, effectKey);
        const lore = generateBaseLore(baseItem, level);

        LORE_CACHES.STATIC.set(key, Object.freeze(lore));
      });
    });
  });
}

/**
 * Calcula o dano mínimo e máximo com cache
 */
function calculateDamage(stats, levelEnchant = null, item = null) {
  var sharpnessLevel = 0;

  if (item != null) {
    sharpnessLevel = Check.enchantLevel(item, "sharpness") || 0;
  } else if (levelEnchant != null) {
    sharpnessLevel = levelEnchant;
  }

  var sharpnessBonus = 0;

  if(sharpnessLevel != 0){
    sharpnessBonus = 0.5 * sharpnessLevel + 0.5;
  }

  var damageMin = (stats.Damage?.[0] || 1);
  var damageMax = (stats.Damage?.[1] || 1);

  if(sharpnessBonus != 0){
    damageMin =+ sharpnessBonus;
    damageMax =+ sharpnessBonus;
  }

  damageMax = Math.round(damageMax);
  damageMin = Math.round(damageMin);

  return { damageMin, damageMax };
}

/**
 * Calcula o DPS com cache
 */
function calculateDPS(damage, attackSpeed) {
  if (!attackSpeed) return "N/A";
  const cacheKey = `${damage}-${attackSpeed}`;
  if (dpsCache.has(cacheKey)) return dpsCache.get(cacheKey);

  const dps = (damage / (1 / attackSpeed)).toFixed(2);
  dpsCache.set(cacheKey, dps);
  return dps;
}

/**
 * Aplica lore em artefatos equipados na mão.
 * 🔹 Agora busca instantaneamente com `Map` (O(1) em vez de O(n)).
 * @param {EntityWrapper} entityWrapper - O jogador segurando o artefato.
 */
export function InventoryAddLore(entityWrapper) {
  const player = entityWrapper.getPlayerObj();
  if (!player) {
    return;
  }

  try {
    let playerCache = LORE_CACHES.PLAYER.get(player);
    if (!playerCache || typeof playerCache.set !== "function") {
      playerCache = new Map();
      LORE_CACHES.PLAYER.set(player, playerCache);
    }

    const inv = player.getComponent("inventory")?.container;
    if (!inv) {
      return;
    }

    const invSize = inv.size;

    for (let slot = 0; slot < invSize; slot++) {
      try {
        const itemSlot = inv.getSlot(slot);

        if (!itemSlot || !itemSlot.hasItem()) {
          continue;
        }

        const item = itemSlot.getItem();

        if (!item || !item.typeId) {
          continue;
        }

        const stats = WeaponDB.getWeapon(item.typeId);
        if (!stats) {
          continue;
        }

        var sharpnessLevel = Check.enchantLevel(item, "sharpness") || 0;

        var effectKey = null;

        if (sharpnessLevel > 0) {
          effectKey = `ench:sharpness:${sharpnessLevel}`;
        }
        else{
          sharpnessLevel = null;
        }

        const cacheKey = generateCacheKey(stats, effectKey);

        let lore = LORE_CACHES.STATIC.get(cacheKey);

        if (!lore) {
          lore = generateBaseLore(stats, sharpnessLevel, item) || [];

          if (LORE_CACHES.DYNAMIC.size >= CACHE_LIMITS.DYNAMIC) {
            LORE_CACHES.DYNAMIC.delete(LORE_CACHES.DYNAMIC.keys().next().value);
          }
          LORE_CACHES.DYNAMIC.set(cacheKey, lore);
        }

        playerCache.set(cacheKey, lore);

        const currentLore = item.getLore();

        if (!compareLore(currentLore, lore)) {
          // Clonagem correta do item com componentes
          const newItem = item.clone(); // Método de clonagem oficial

          // Atualiza apenas a lore
          newItem.setLore(lore);
         

          // Substitui o item no inventário
          inv.setItem(slot, newItem);
        } 
      } catch (innerError) {
        console.error(`💥 Erro no slot ${slot}:`, innerError);
      }
    }

    LORE_CACHES.PLAYER.set(player, playerCache);
  } catch (error) {
    console.error("⛔ Erro crítico no InventoryAddLore:", error);
    throw error;
  }
}

function compareLore(current, cached) {
  const result =
    current &&
    cached &&
    current.length === cached.length &&
    current.every((line, i) => line === cached[i]);

  return result;
}
