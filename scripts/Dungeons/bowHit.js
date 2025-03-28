import { world, system, EntityDamageCause } from "@minecraft/server";
const arrows = [
  "minecraft:arrow",
  "dungeons:burning_arrow",
  "dungeons:harpoon_arrow",
  "dungeons:torment_arrow",
  "dungeons:thundering_arrow",
];

world.afterEvents.itemReleaseUse.subscribe((e) => {
  const bow = e.itemStack;
  const player = e.source;
  if (
    (bow.typeId === "minecraft:crossbow" || bow.hasTag("dungeons:crossbow")) &&
    player.typeId === "minecraft:player"
  ) {
    player.playSound("crossbow.loading.end", { volume: 0.44 });
  }
  if (bow.typeId === "minecraft:bow" || bow.hasTag("dungeons:bow")) {
    const nearbyArrow = player.dimension.getEntities({
      location: player.location,
      maxDistance: 16,
      closest: 1,
      families: ["arrow"],
      excludeTags: ["dungeons:arrow"],
    });

    var arrow = nearbyArrow[0];

    switch (bow.typeId) {
      case "dungeons:longbow":
        arrow.addTag("longbow");
        break;

      case "dungeons:corrupted_crossbow":
        arrow.addTag("corrupted_crossbow");
        break;

      case "dungeons:voidcaller":
        arrow.addTag("voidcaller");
        break;

      case "dungeons:soul_hunter_crossbow":
        arrow.addTag("soul_hunter_crossbow");
        break;

      case "dungeons:slayer_crossbow":
        arrow.addTag("slayer_crossbow");
        break;

      case "dungeons:pride_of_the_piglins":
        arrow.addTag("pride_of_the_piglins");
        break;

      case "dungeons:nautical_crossbow":
        arrow.addTag("nautical_crossbow");
        break;

      case "dungeons:imploding_crossbow":
        arrow.addTag("imploding_crossbow");
        break;

      case "dungeons:firebolt_thrower":
        arrow.addTag("firebolt_thrower");
        break;

      case "dungeons:feral_soul_crossbow":
        arrow.addTag("feral_soul_crossbow");
        break;

      case "dungeons:doom_crossbow":
        arrow.addTag("doom_crossbow");
        break;

      case "dungeons:cog_crossbow":
        arrow.addTag("cog_crossbow");
        break;

      case "dungeons:burst_crossbow":
        arrow.addTag("burst_crossbow");
        break;

      case "dungeons:soul_crossbow":
        arrow.addTag("soul_crossbow");
        break;

      case "dungeons:heavy_crossbow":
        arrow.addTag("heavy_crossbow");
        break;

      case "dungeons:harpoon_crossbow":
        arrow.addTag("harpoon_crossbow");
        break;

      case "dungeons:exploding_crossbow":
        arrow.addTag("exploding_crossbow");
        break;

      case "dungeons:twin_bow":
        arrow.addTag("twin_bow");
        break;

      case "dungeons:weeping_vine_bow":
        arrow.addTag("weeping_vine_bow");
        break;

      case "dungeons:winters_touch":
        arrow.addTag("winters_touch");
        break;

      case "dungeons:burst_gale_bow":
        arrow.addTag("burst_gale_bow");
        break;

      case "dungeons:guardian_bow":
        arrow.addTag("guardian_bow");
        break;

      case "dungeons:red_snake":
        arrow.addTag("red_snake");
        break;

      case "dungeons:snow_bow":
        arrow.addTag("snow_bow");
        break;

      case "dungeons:twisting_vine_bow":
        arrow.addTag("twisting_vine_bow");
        break;

      case "dungeons:wind_bow":
        arrow.addTag("wind_bow");
        break;

      case "dungeons:bonebow":
        arrow.addTag("bonebow");
        break;

      default:
        // Caso nenhum tipo corresponda, não faz nada
        break;
    }

    arrow.triggerEvent("minecraft:entity_spawned"); // Ativa o evento X na flecha

    if (arrows.includes(arrow.typeId)) {
      arrow.addTag(`${bow.typeId}`);
      arrow.addTag(`dungeons:piercing_0`);
      arrow.addTag(`dungeons:arrow`);
      const enchantable = bow.getComponent("minecraft:enchantable");
      for (const enchantment of enchantable.getEnchantments()) {
        if (enchantment.type.id === "piercing") {
          arrow.addTag(`dungeons:piercing_${enchantment.level}`);
          arrow.removeTag(`dungeons:piercing_0`);
        }
      }
    }
  }
});

world.afterEvents.projectileHitBlock.subscribe((e) => {
  const arrow = e.projectile;
  if (arrow.isValid() === false) return;
  const player = e.source;
 

  if (player.isValid() == false && !e.source.typeId != "minecraft:player") {
    return;
  }

  const dim = arrow.dimension;

  const equippableComp = player.getComponent("equippable");
  const item = equippableComp?.getEquipment("Mainhand");

  // AJUSTAR PARA ENCANTAMENTO
  const damage = 1;

  if (!arrow.hasTag("dungeons:arrow")) return;

  //DEBUG
  if (player.hasTag("dungeons:debug")) {
    const tags = arrow.getTags();
    for (const tag of tags) {
      world.sendMessage(`${tag}`);
    }
  }

  if (!arrow.hasTag("dungeons:pierced")) {
    //Exploding Crossbow / Redsnake
    if (
      arrow.hasTag("dungeons:exploding_crossbow") ||
      arrow.hasTag("dungeons:firebolt_thrower") ||
      arrow.hasTag("dungeons:red_snake")
    ) {
      dim.spawnParticle("dungeons:exploding_crossbow", arrow.location);
      dim.playSound("random.explode", arrow.location);
      const damageRange = dim.getEntities({
        location: arrow.location,
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
    }
    //Imploding Crossbow
    if (arrow.hasTag("dungeons:imploding_crossbow")) {
      dim.spawnParticle("dungeons:imploding_crossbow", arrow.location);
      dim.playSound("random.explode", arrow.location);
      dim.spawnParticle("dungeons:gravity", {
        x: arrow.location.x,
        y: arrow.location.y + 0.45,
        z: arrow.location.z,
      });
      dim.playSound("mob.endermen.portal", arrow.location);

      const damageRange = dim.getEntities({
        location: arrow.location,
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
          location: arrow.location,
          maxDistance: 6,
          excludeFamilies: ["ignore", "gravity_immune"],
        })
        .forEach((entity) => {
          const xDif = entity.location.x - arrow.location.x;
          const zDif = entity.location.z - arrow.location.z;
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
          if (entity === player) return;
          if (entity === undefined || !entity.isValid()) return;
          entity.applyKnockback(-xDif, -zDif, (xDif2 + zDif2) / 2.1, 0.3);
        });
    }
    //GRAVITY
    if (arrow.hasTag("dungeons:voidcaller")) {
      dim.spawnParticle("dungeons:gravity", {
        x: arrow.location.x,
        y: arrow.location.y + 0.45,
        z: arrow.location.z,
      });
      dim.playSound("mob.endermen.portal", arrow.location);

      dim
        .getEntities({
          location: arrow.location,
          maxDistance: 6,
          excludeFamilies: ["ignore", "gravity_immune"],
        })
        .forEach((entity) => {
          const xDif = entity.location.x - arrow.location.x;
          const zDif = entity.location.z - arrow.location.z;
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
          if (entity === player) return;
          if (entity === undefined || !entity.isValid()) return;
          entity.applyKnockback(-xDif, -zDif, (xDif2 + zDif2) / 2.1, 0.3);
          entity.addEffect("levitation", 40, {
            amplifier: 1,
            showParticles: false,
          });
        });
    }
  }
  arrow.addTag("dungeons:pierced");
});
