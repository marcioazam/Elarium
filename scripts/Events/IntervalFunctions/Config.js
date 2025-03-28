import { EntityWrapper } from "../../Elarium/System/Class/Entity.js";
import { WorldWrapper } from "../../Elarium/System/Class/World.js";
import {
  DimensionWrapper,
  DimensionTypeEnum,
} from "../../Elarium/System/Class/Dimension.js";
import { EntityManager } from "../../Elarium/System/Manager/Entity.js";
import { system, world, BlockTypes } from "@minecraft/server";
import { Logger } from "../../Elarium/System/Helper/Log.js";

/**
 * Exibe a taxa de ticks por segundo (TPS) na tela do jogador.
 * @param {EntityWrapper} entityWrapper
 */
export function Saturation(entityWrapper) {
  const player = entityWrapper.getPlayerObj();
  if (!player) return;

  let SATURATION = player.getDynamicProperty("jc:saturation");
  if (SATURATION === undefined) {
    player.setDynamicProperty("jc:saturation", 0);
    SATURATION = 0;
  }

  const HEALTH = player.getComponent("health");
  if (
    HEALTH.currentValue === 0 ||
    HEALTH.currentValue >= HEALTH.effectiveMax ||
    SATURATION < 1
  )
    return;

  HEALTH.setCurrentValue(HEALTH.currentValue + 1);
  player.setDynamicProperty("jc:saturation", SATURATION - 1);
  player.addEffect("hunger", 3, { amplifier: 255, showParticles: false });
}

/**
 * Exibe a taxa de ticks por segundo (TPS) na tela do jogador.
 * @param {EntityWrapper} entityWrapper
 */
export function VerifyTagPlayer(playerTags, entityWrapper) {
  const player = entityWrapper.getPlayerObj();

  var health = null;

  if (playerTags.includes("undying_flower") && playerTags.includes("day")) {
    health = player.getComponent("health");
    health.setCurrentValue(health.currentValue + 0.33);
  }

  if (playerTags.includes("fur_chestplate") && playerTags.includes("frozen")) {
    if (health == null) {
      health = player.getComponent("health");
    }
    health.setCurrentValue(health.currentValue + 0.2);
  }
}

const tagTransitions = {
  bleeding1: { newTag: "bleeding2", damage: 2 },
  bleeding2: { newTag: "bleeding3", damage: 1 },
  bleeding3: { newTag: "bleeding4", damage: 1 },
  bleeding4: { newTag: "", damage: 1 },
  bleeding: { newTag: "bleeding1", damage: 2 },
};

export function BleedingFunc() {
  const overworld = DimensionWrapper.getDimension(DimensionTypeEnum.OVERWORLD);
  if (!overworld) {
    return;
  }

  const entitiesWrapper = EntityManager.getEntitiesByTags(overworld, [
    "bleeding1",
    "bleeding2",
    "bleeding3",
    "bleeding4",
    "bleeding",
  ]);

  for (var wrapper of entitiesWrapper) {
    const entityTags = new Set(wrapper.tags ?? []); // Garante que `tags` seja um Set

    const removeTag = [...entityTags].find((tag) => tag.startsWith("bleeding"));
    if (!removeTag) {
      continue;
    }

    const { newTag, damage } = tagTransitions[removeTag] || {};

    wrapper.entity.removeTag(removeTag);
    wrapper.removeTag(removeTag);

    if (newTag) {
      wrapper.entity.addTag(newTag);
    }

    if (damage > 0) {
      wrapper.entity.applyDamage(damage);
      overworld.spawnParticle("edx:blood", wrapper.entity.location);
    }
  }
}

/**
 * Exibe a taxa de ticks por segundo (TPS) na tela do jogador.
 * @param {EntityWrapper} entityWrapper
 */
export function CheckCompassItem(playerTags, entityWrapper) {
  const player = entityWrapper.getPlayerObj();
  if ( playerTags.includes("compass")) {
    // Obtém o inventário do jogador
    const container = player.getComponent("minecraft:inventory").container;
    let hasCompass = false;

    // Percorre cada slot para verificar se existe uma bússola
    for (let slot = 0; slot < container.size; slot++) {
      const item = container.getItem(slot);
      if (item && item.typeId === "minecraft:compass") {
        hasCompass = true;
        break;
      }

      // Se o jogador não tem mais a bússola, remove a tag
      if (!hasCompass) {
        player.removeTag("compass");
      }
    }
  }
}

export function BloodMoonFunction() {
  const currentTime = world.getTimeOfDay();
  const absoluteTime = world.getAbsoluteTime();
  const isBloodMoon = ((absoluteTime - currentTime) / 24000 + 2) % 8 === 0;
  const isNight = currentTime > 12000 && currentTime < 24000;

  if (isBloodMoon && isNight) {
    WorldWrapper.BloodMoon = true;
  } else {
    WorldWrapper.BloodMoon = false;
  }
}

const GOLDEN_SLOTS = [9, 18, 27];

const artifactsList = new Set([
  "poisonous_mucus",
  "corrupted_star",
  "blaze_heart",
  "blue_eye",
  "crystal_of_youth",
  "crystal_of_bravery",
  "crystal_of_rage",
  "crystal_of_fear",
  "dragon_heart",
  "battle_cry",
  "ancient_shield",
  "double_quiver",
  "bloody_totem",
  "explosive_blaze_rod",
  "soul_bottle",
  "blood_vial",
  "sculk_quiver",
  "magic_axe",
  "enchanted_socks",
  "magnetic_firework",
  "magnet",
  "ring_of_atlantis",
  "golden_ring",
  "heavy_quiver",
  "magma_socks",
  "noinsomnia",
  "heart_bottle",
  "gheart_bottle",
  "undying_flower",
  "bloody_ruby",
  "long_spear",
  "chaining_scroll",
  "charged_hit_scroll",
  "crushing_scroll",
  "uppercut_scroll",
  "sharper_spear",
  "speed_spear",
  "shield_spear",
  "wither_spear",
  "cloud_socks",
  "heavy_socks",
  "molten_ingot",
  "bloody_bramble",
  "sculk_portal",
  "supersonic_arrow",
  "void_socks",
  "chorus_socks",
  "purpur_socks",
  "void_cloak",
  "xp_orb",
]);

// 🟡 Índice Global das Tags dos Jogadores
const playerArtifactIndex = new Map();

/**
 * Gerencia os artefatos nos slots dourados do inventário do jogador.
 * @param {EntityWrapper} entityWrapper
 */
export function GoldenSlots(entityWrapper) {
  const player = entityWrapper.getPlayerObj();
  const inv = player.getComponent("inventory").container;
  if (!inv) return;

  // Obtém ou cria um índice de tags para o jogador
  if (!playerArtifactIndex.has(player.id)) {
    playerArtifactIndex.set(player.id, new Set());
  }
  const playerTags = playerArtifactIndex.get(player.id);

  // 🟢 Índice para armazenar artefatos nos slots dourados
  const goldenSlotsTags = new Set();

  for (const slot of GOLDEN_SLOTS) {
    const item = inv.getItem(slot);
    if (item?.getTags) {
      const itemTags = item.getTags();
      for (let i = 0; i < itemTags.length; i++) {
        if (artifactsList.has(itemTags[i])) {
          goldenSlotsTags.add(itemTags[i]);
        }
      }
    }
  }

  // 🛠️ Sincronização Eficiente Usando Índices
  for (const artifact of artifactsList) {
    const hasInSlots = goldenSlotsTags.has(artifact);
    const hasTag = playerTags.has(artifact);

    if (hasInSlots && !hasTag) {
      player.addTag(artifact);
      playerTags.add(artifact);
    } else if (!hasInSlots && hasTag) {
      player.removeTag(artifact);
      playerTags.delete(artifact);
    }
  }
}

