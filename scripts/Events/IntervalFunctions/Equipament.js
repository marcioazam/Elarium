import { EntityWrapper } from "../../Elarium/System/Class/Entity.js";
import { system, world, EquipmentSlot, Dimension } from "@minecraft/server";
import { DurabilityArmorViewer } from "../../OthersMods/main_durability.js";
import {
  DimensionWrapper,
  DimensionTypeEnum,
} from "../../Elarium/System/Class/Dimension.js";
import { EntityManager } from "../../Elarium/System/Manager/Entity.js";

const greatswords = [
  "dungeons:claymore",
  "dungeons:broadsword",
  "dungeons:great_axeblade",
  "dungeons:heartstealer",
  "dungeons:bone_club",
  "dungeons:bone_cudgel",
  "dungeons:anchor",
  "dungeons:encrusted_anchor",
  "dungeons:obsidian_claymore",
  "dungeons:starless_night",
];

/**
 * Exibe a taxa de ticks por segundo (TPS) na tela do jogador.
 * @param {EntityWrapper} entityWrapper
 */
export function ShadowForm(entityWrapper) {
  const player = entityWrapper.getPlayerObj();
  let shadowTime = world.scoreboard.getObjective("shadowTime");
  let shadowTimePlayer = shadowTime.getScore(player);
  if (shadowTimePlayer > 0) {
    player.playAnimation("animation.shadow", { nextState: "shadowForm" });
    player.addEffect("strength", 3, {
      amplifier: 2,
      showParticles: false,
    });
    player.addEffect("invisibility", 3, {
      amplifier: 0,
      showParticles: false,
    });
    shadowTime.addScore(player, -20);

    player.spawnParticle("dungeons:shadow_idle", player.getHeadLocation());
  }
}

//   /**
//  * Exibe a taxa de ticks por segundo (TPS) na tela do jogador.
//  * @param {EntityWrapper} entityWrapper
//  */
//   export function GreatSwordFunction(entityWrapper, heldItem) {
//     const player = entityWrapper.getPlayerObj();
//     if (!heldItem) return;
//     if (greatswords.includes(heldItem.typeId)) {
//       if (player.isSwimming) return;

//       if (world.scoreboard.getObjective("shadowTime").getScore(player) > 0)
//         return;
//       player.playAnimation("animation.player.greatsword_hold", {
//         blendOutTime: 0.6,
//         nextState: "claymoreHold",
//       });
//     }
//   }

/**
 * Exibe a taxa de ticks por segundo (TPS) na tela do jogador.
 * @param {EntityWrapper} entityWrapper
 */
export function Powershaker(entityWrapper) {
  const player = entityWrapper.getPlayerObj();
  let usesLeft = world.scoreboard
    .getObjective("powershaker_u")
    .getScore(player);
  let timeLeft = world.scoreboard.getObjective("powershaker_t");
  let timeLeftPlayer = timeLeft.getScore(player);
  if (timeLeftPlayer > 0) {
    timeLeft.addScore(player, -6);
    player.addEffect("strength", 1);
  } else if (timeLeftPlayer <= 0 && usesLeft > 0) {
    world.scoreboard.getObjective("powershaker_u").setScore(player, 0);
  }
}

/**
 * Exibe a taxa de ticks por segundo (TPS) na tela do jogador.
 * @param {EntityWrapper} entityWrapper
 */
export function ShowCordinates(playerTags, entityWrapper) {
  if (playerTags.includes("compass")) {
    const player = entityWrapper.getPlayerObj();
    const headlocation = player.getHeadLocation();
    const x = Math.round(headlocation.x);
    const y = Math.round(headlocation.y - 2);
    const z = Math.round(headlocation.z);

    player.onScreenDisplay.setActionBar(`${x}, ${y}, ${z}`);
  }
}

/**
 * Exibe a taxa de ticks por segundo (TPS) na tela do jogador.
 * @param {EntityWrapper} entityWrapper
 */
export function GuardianEye(entityWrapper) {
  const player = entityWrapper.getPlayerObj();
  let guardianEye = world.scoreboard.getObjective("guardianEye");
  let guardianEyePlayer = 0;

  system.run(async () => guardianEye.getScore(player));

  if (guardianEyePlayer > 0) {
    player.addEffect("slowness", 10, { amplifier: 3, showParticles: false });
    const ammo = player.dimension.spawnEntity(
      "dungeons:eye_guardian_ammo",
      player.getHeadLocation()
    );
    const proj = ammo.getComponent("projectile");
    proj.owner = player;
    proj.shoot(player.getViewDirection());
    system.runTimeout(() => {
      ammo.remove();
    }, 25);

    system.run(async () => guardianEye.addScore(player, -1));
  }
}

/**
 * Exibe a taxa de ticks por segundo (TPS) na tela do jogador.
 * @param {EntityWrapper} entityWrapper
 */
export function SwordBlock(playerTags, entityWrapper) {
  const player = entityWrapper.getPlayerObj();
  if (
    playerTags.includes("dungeons:sword_block") &&
    world.scoreboard.getObjective("shadowTime").getScore(player) == 0
  ) {
    player.playAnimation("animation.player.block", {
      blendOutTime: 0.33,
      nextState: "swordBlock",
    });
  }
}

/**
 * Exibe a taxa de ticks por segundo (TPS) na tela do jogador.
 * @param {EntityWrapper} entityWrapper
 */
export async function WeightWeapon(
  playerTags = null,
  item,
  stats,
  entityWrapper
) {
  const player = entityWrapper.getPlayerObj();

  if (!item) {
    await RemoveDebuffWeight(player);
    return;
  }

  if (!stats || !stats.Weight) {
    await RemoveDebuffWeight(player);
    return;
  }

  if (playerTags !== null) {
    if (playerTags.includes(stats.Weight.replace(" ", ""))) {
      return;
    }
  } 

  // 🚀 Se `RemoveDebuffWeight` for assíncrono, usar `await`
  await RemoveDebuffWeight(player);

  // Adicionar a tag correspondente ao peso da arma
  switch (stats.Weight) {
    case "Leve":
      player.addTag("Leve"); // 🚀 Se `addTag` for assíncrono no futuro
      break;
    case "Médio":
      player.addTag("Médio");
      break;
    case "Pesada":
      player.addTag("Pesada");
      break;
    case "Muito Pesada":
      player.addTag("MuitoPesada");
      break;
    default:
      await RemoveDebuffWeight(player);
      break;
  }
}

async function RemoveDebuffWeight(player) {
  player.removeTag("Leve");
  player.removeTag("Médio");
  player.removeTag("Pesada");
  player.removeTag("MuitoPesada");

  await VelocidadePadrao(player);
}

async function VelocidadePadrao(player) {
  player.addTag("Padrao");
}

export async function FireBreath(entityWrapper) {
  const player = entityWrapper.getPlayerObj();

  // 🚀 Aplicar efeitos de respiração de fogo e arco
  if (getScore(player, "Fire_breath") > 0) {
    const viewDirection = player.getViewDirection();
    const headLocation = player.getHeadLocation();
    const dimension = player.dimension;
    await applyFireBreathEffect(player, headLocation, viewDirection, dimension);
  }
}

export async function KnockbackInFly(playerTags, entityWrapper) {
  const player = entityWrapper.getPlayerObj();
  if (playerTags.includes("fly")) {
    const viewDirection = player.getViewDirection();
    applyKnockback(player, viewDirection);
  }
}

export async function NotSleepBloodMoon(playerTags, entityWrapper) {
  const player = entityWrapper.getPlayerObj();

  // 🚀 Impedir sono durante a lua de sangue
  if (player.isSleeping && playerTags.includes("blood_moon")) {
    player.teleport({
      x: player.location.x,
      y: player.location.y + 1,
      z: player.location.z,
    });
  }
}

export async function EffectBlazeBlade(entityWrapper) {
  const player = entityWrapper.getPlayerObj();

  if (getScore(player, "Bow") > 30) {
    BlazeEffect(player);
  }
}

/**
 * Aplica knockback ao jogador se ele estiver voando.
 * 🚀 Não precisa ser `async`, pois é totalmente síncrono.
 */
function applyKnockback(player, viewDirection) {
  const knockbackForce =
    Math.sqrt(
      Math.abs(viewDirection.x) * 1.1 + Math.abs(viewDirection.z) * 1.1
    ) * 0.2;
  player.applyKnockback(viewDirection.x, viewDirection.z, knockbackForce, 0.2);
}

/**
 * Aplica o efeito de respiração de fogo.
 * 🚀 Agora usa `getEntitiesFromRayAsync` para melhor desempenho em grandes servidores.
 */
async function applyFireBreathEffect(
  player,
  headLocation,
  viewDirection,
  dimension
) {
  const options = {
    maxDistance: 7,
    excludeTypes: ["minecraft:item"],
    excludeFamilies: ["projectile"],
    includePassableBlocks: false,
  };

  // 🚀 Agora pegamos entidades de forma assíncrona
  const entities = await dimension.getEntitiesFromRayAsync(
    headLocation,
    viewDirection,
    options
  );
  for (const entity of entities) {
    if (entity.entity !== player) {
      entity.entity.applyDamage(2, { cause: "fire", damagingEntity: player });
      entity.entity.setOnFire(4, true);
    }
  }

  // 🚀 Criar partículas apenas se houver entidades atingidas
  if (entities.length > 0) {
    spawnFireBreathParticles(dimension, headLocation, viewDirection);
  }

  // 🚀 Agora removemos o placar de forma assíncrona
  removeScore(player, "Fire_breath", 20);
}

/**
 * Aplica efeitos ao usar arco com `blaze_blade`.
 * 🚀 Agora é assíncrono caso `spawnParticle` seja assíncrono no futuro.
 */
async function BlazeEffect(player) {
  const equipment = player.getComponent("equippable");
  const selectedItem = equipment.getEquipment("Mainhand");
  if (selectedItem && selectedItem.typeId === "edx:blaze_blade") {
    await player.dimension.spawnParticle(
      "edx:blaze_blade",
      player.getHeadLocation()
    );
  }
}

/**
 * Exibe a taxa de ticks por segundo (TPS) na tela do jogador.
 * @param {EntityWrapper} entityWrapper
 */
export function DurabilityArmor(entityWrapper) {
  const player = entityWrapper.getPlayerObj();
  DurabilityArmorViewer(player);
}

/**
 * Spawna partículas do sopro de fogo.
 * 🚀 Mantemos síncrono porque `spawnParticle` é síncrono.
 */
function spawnFireBreathParticles(dimension, headLocation, viewDirection) {
  const vmap = new MolangVariableMap();
  vmap.setVector3("variable.direction", viewDirection);
  dimension.spawnParticle(
    "edx:fire_breath",
    {
      x: headLocation.x + viewDirection.x / 4,
      y: headLocation.y + viewDirection.y / 4,
      z: headLocation.z + viewDirection.z / 4,
    },
    vmap
  );
}

/**
 * Remove score do jogador de forma assíncrona.
 */
function removeScore(player, objective, amount) {
  const scoreboardComp = player.getComponent("scoreboardIdentity");
  if (!scoreboardComp) return; // 🚨 Jogador não tem identidade no scoreboard

  const obj = world.scoreboard.getObjective(objective);
  if (!obj) return; // 🚨 O placar não existe

  const currentScore = obj.getScore(player.scoreboardIdentity) || 0;
  obj.setScore(player.scoreboardIdentity, Math.max(0, currentScore - amount));
}

const scoreboardCache = new Map();

/**
 * Obtém o score de um jogador para um determinado objetivo no scoreboard.
 * @param {Player} player - O jogador cujo score será buscado.
 * @param {string} objective - O nome do scoreboard.
 * @returns {number | null} - O score do jogador ou null se não existir.
 */
function getScore(player, objective) {
  if (!player || !objective) {
    return null;
  }

  const scoreboardComp = player.getComponent("scoreboardIdentity");
  if (!scoreboardComp) {
    return null;
  }

  let scoreboard = scoreboardCache.get(objective);
  if (!scoreboard) {
    scoreboard = world.scoreboard.getObjective(objective);
    if (!scoreboard) {
      return null;
    }
    scoreboardCache.set(objective, scoreboard);
  }

  const score = scoreboard.getScore(player.scoreboardIdentity);
  return score !== undefined ? score : 0;
}
// ⚡ Criamos um Map para buscas ultra rápidas
const armourDataMap = new Map();
const enchantMap = new Map();

const armourData = [
  {
    helmetTypeId: "dungeons:titans_shroud_helmet",
    chestplateTypeId: "dungeons:titans_shroud_chestplate",
    leggingsTypeId: "dungeons:titans_shroud_leggings",
    bootsTypeId: "dungeons:titans_shroud_boots",
    enchant: "20%% Damage Reduction",
  },
  {
    helmetTypeId: "dungeons:fox_helmet",
    chestplateTypeId: "dungeons:fox_chestplate",
    leggingsTypeId: "dungeons:fox_leggings",
    bootsTypeId: "dungeons:fox_boots",
    enchant: "Boosts Sprint Speed",
  },
  {
    helmetTypeId: "dungeons:black_wolf_helmet",
    chestplateTypeId: "dungeons:black_wolf_chestplate",
    leggingsTypeId: "dungeons:black_wolf_leggings",
    bootsTypeId: "dungeons:black_wolf_boots",
    enchant: "Boosts Attack Strength",
  },
  {
    helmetTypeId: "dungeons:frost_helmet",
    chestplateTypeId: "dungeons:frost_chestplate",
    leggingsTypeId: "dungeons:frost_leggings",
    bootsTypeId: "dungeons:frost_boots",
    enchant: "Slows enemies",
  },
  {
    helmetTypeId: "dungeons:wither_helmet",
    chestplateTypeId: "dungeons:wither_chestplate",
    leggingsTypeId: "dungeons:wither_leggings",
    bootsTypeId: "dungeons:wither_boots",
    enchant: "Leeching",
  },
  {
    helmetTypeId: "dungeons:ember_helmet",
    chestplateTypeId: "dungeons:ember_chestplate",
    leggingsTypeId: "dungeons:ember_leggings",
    bootsTypeId: "dungeons:ember_boots",
    enchant: "Burns attacking enemies",
  },
  {
    helmetTypeId: "dungeons:verdant_helmet",
    chestplateTypeId: "dungeons:verdant_chestplate",
    leggingsTypeId: "dungeons:verdant_leggings",
    bootsTypeId: "dungeons:verdant_boots",
    enchant: "Doubles collected souls",
  },
  {
    helmetTypeId: "dungeons:shadow_walker_helmet",
    chestplateTypeId: "dungeons:shadow_walker_chestplate",
    leggingsTypeId: "dungeons:shadow_walker_leggings",
    bootsTypeId: "dungeons:shadow_walker_boots",
    enchant: "Damage resistance while sprinting",
  },
  {
    helmetTypeId: "dungeons:opulent_helmet",
    chestplateTypeId: "dungeons:opulent_chestplate",
    leggingsTypeId: "dungeons:opulent_leggings",
    bootsTypeId: "dungeons:opulent_boots",
    enchant: "Prevents damage after level up",
  },
  {
    helmetTypeId: "dungeons:gilded_glory_helmet",
    chestplateTypeId: "dungeons:gilded_glory_chestplate",
    leggingsTypeId: "dungeons:gilded_glory_leggings",
    bootsTypeId: "dungeons:gilded_glory_boots",
    enchant: "Converts levels into health",
  },
  {
    helmetTypeId: "dungeons:nimble_turtle_helmet",
    chestplateTypeId: "dungeons:nimble_turtle_chestplate",
    leggingsTypeId: "dungeons:nimble_turtle_leggings",
    bootsTypeId: "dungeons:nimble_turtle_boots",
    enchant: "Boosts speed when injured",
  },
  {
    helmetTypeId: "dungeons:glow_squid_helmet",
    chestplateTypeId: "dungeons:glow_squid_chestplate",
    leggingsTypeId: "dungeons:glow_squid_leggings",
    bootsTypeId: "dungeons:glow_squid_boots",
    enchant: "Boosted damage immunity",
  },
  {
    helmetTypeId: "dungeons:spider_helmet",
    chestplateTypeId: "dungeons:spider_chestplate",
    leggingsTypeId: "dungeons:spider_leggings",
    bootsTypeId: "dungeons:spider_boots",
    enchant: "Lifesteal Aura",
  },
  {
    helmetTypeId: "dungeons:living_vines_helmet",
    chestplateTypeId: "dungeons:living_vines_chestplate",
    leggingsTypeId: "dungeons:living_vines_leggings",
    bootsTypeId: "dungeons:living_vines_boots",
    enchant: "Poison Heal Aura",
  },
  {
    helmetTypeId: "dungeons:black_spot_helmet",
    chestplateTypeId: "dungeons:black_spot_chestplate",
    leggingsTypeId: "dungeons:black_spot_leggings",
    bootsTypeId: "dungeons:black_spot_boots",
    enchant: "Artefact use grants healing",
  },
  {
    helmetTypeId: "dungeons:golden_piglin_helmet",
    chestplateTypeId: "dungeons:golden_piglin_chestplate",
    leggingsTypeId: "dungeons:golden_piglin_leggings",
    bootsTypeId: "dungeons:golden_piglin_boots",
    enchant: "Artefact use grants healing",
  },
];

// 🔹 Criamos Mapas para acesso instantâneo (O(1))
for (const armor of armourData) {
  [
    armor.helmetTypeId,
    armor.chestplateTypeId,
    armor.leggingsTypeId,
    armor.bootsTypeId,
  ].forEach((id) => armourDataMap.set(id, armor));
  enchantMap.set(armor.enchant, `§r§7${armor.enchant} `);
}

/**
 * Exibe a taxa de ticks por segundo (TPS) na tela do jogador.
 * @param {EntityWrapper} entityWrapper
 */
export function ArmoursDataFunction(entityWrapper) {
  const player = entityWrapper.getPlayerObj();
  const hand = player
    .getComponent("equippable")
    ?.getEquipment(EquipmentSlot.Mainhand);
  if (!hand?.typeId) return;

  const foundItem = armourDataMap.get(hand.typeId);
  if (!foundItem) return;

  const loreText = enchantMap.get(foundItem.enchant);
  if (hand.getLore()?.[0] !== loreText) {
    hand.setLore([loreText]);
  }
}

// ⚡ Criamos um `Map` para buscas instantâneas (O(1))
const artefactDataMap = new Map();
const loreMap = new Map();
const artefactData = [
  {
    artefactTypeId: "dungeons:totem_of_regeneration",
    artefactRareTypeId: "dungeons:rare_totem_of_regeneration",
    description: "Casts an area of healing for nearby players.",
    soulInfo: "",
  },
  {
    artefactTypeId: "dungeons:soul_healer",
    artefactRareTypeId: "dungeons:rare_soul_healer",
    description: "Recovers health.",
    soulInfo: "\nConsumes 10 ",
  },
  {
    artefactTypeId: "dungeons:iron_hide_amulet",
    artefactRareTypeId: "dungeons:rare_iron_hide_amulet",
    description: "Increases damage resistance.",
    soulInfo: "",
  },
  {
    artefactTypeId: "dungeons:harvester",
    artefactRareTypeId: "dungeons:rare_harvester",
    description: "Creates a strong explosion.",
    soulInfo: "\nConsumes 15 ",
  },
  {
    artefactTypeId: "dungeons:shock_powder",
    artefactRareTypeId: "dungeons:rare_shock_powder",
    description: "Stuns surrounding monsters.",
    soulInfo: "",
  },
  {
    artefactTypeId: "dungeons:gong_of_weakening",
    artefactRareTypeId: "dungeons:rare_gong_of_weakening",
    description: "Weakens surrounding monsters.",
    soulInfo: "",
  },
  {
    artefactTypeId: "dungeons:blast_fungus",
    artefactRareTypeId: "dungeons:rare_blast_fungus",
    description: "Launches bouncing explosives.",
    soulInfo: "",
  },
  {
    artefactTypeId: "dungeons:totem_of_shielding",
    artefactRareTypeId: "dungeons:rare_totem_of_shielding",
    description: "Cast an area of resistance for nearby players.",
    soulInfo: "",
  },
  {
    artefactTypeId: "dungeons:shadow_shifter",
    artefactRareTypeId: "dungeons:rare_shadow_shifter",
    description: "Grants shadow form.",
    soulInfo: "\nConsumes 8 ",
  },
  {
    artefactTypeId: "dungeons:vexing_chant",
    artefactRareTypeId: "dungeons:rare_vexing_chant",
    description: "Summons helpful Vexes.",
    soulInfo: "",
  },
  {
    artefactTypeId: "dungeons:satchel_of_elements",
    artefactRareTypeId: "dungeons:rare_satchel_of_elements",
    description: "Unleashes elemental attacks on monsters.",
    soulInfo: "",
  },
  {
    artefactTypeId: "dungeons:wind_horn",
    artefactRareTypeId: "dungeons:rare_wind_horn",
    description: "Slows and launches nearby mobs.",
    soulInfo: "",
  },
  {
    artefactTypeId: "dungeons:ice_wand",
    artefactRareTypeId: "dungeons:rare_ice_wand",
    description: "Creates chunks of ice.",
    soulInfo: "",
  },
  {
    artefactTypeId: "dungeons:death_cap_mushroom",
    artefactRareTypeId: "dungeons:rare_death_cap_mushroom",
    description: "Increases attack power and speed.",
    soulInfo: "",
  },
  {
    artefactTypeId: "dungeons:enchanted_grass",
    artefactRareTypeId: "dungeons:rare_enchanted_grass",
    description: "Summons a heroic sheep.",
    soulInfo: "",
  },
  {
    artefactTypeId: "dungeons:corrupted_seeds",
    artefactRareTypeId: "dungeons:rare_corrupted_seeds",
    description: "Traps and poisons nearby monsters.",
    soulInfo: "",
  },
  {
    artefactTypeId: "dungeons:boots_of_swiftness",
    artefactRareTypeId: "dungeons:rare_boots_of_swiftness",
    description: "Boosts your speed.",
    soulInfo: "",
  },
  {
    artefactTypeId: "dungeons:lightning_rod",
    artefactRareTypeId: "dungeons:rare_lightning_rod",
    description: "Strike arcane lightning on foes.",
    soulInfo: "\nConsumes 8 ",
  },
  {
    artefactTypeId: "dungeons:buzzy_nest",
    artefactRareTypeId: "dungeons:rare_buzzy_nest",
    description: "Places a nest of tamed bees.",
    soulInfo: "",
  },
  {
    artefactTypeId: "dungeons:light_feather",
    artefactRareTypeId: "dungeons:rare_light_feather",
    description: "Stuns nearby mobs and launches you far.",
    soulInfo: "",
  },
  {
    artefactTypeId: "dungeons:golem_kit",
    artefactRareTypeId: "dungeons:rare_golem_kit",
    description: "Summons an Iron Golem.",
    soulInfo: "",
  },
  {
    artefactTypeId: "dungeons:updraft_tome",
    artefactRareTypeId: "dungeons:rare_updraft_tome",
    description: "Levitates up to 7 foes.",
    soulInfo: "",
  },
  {
    artefactTypeId: "dungeons:enchanters_tome",
    artefactRareTypeId: "dungeons:rare_enchanters_tome",
    description: "Enchants your summoned mobs.",
    soulInfo: "",
  },
  {
    artefactTypeId: "dungeons:scatter_mines",
    artefactRareTypeId: "dungeons:rare_scatter_mines",
    description: "Places deadly bombs on the floor.",
    soulInfo: "",
  },
  {
    artefactTypeId: "dungeons:eye_of_the_guardian",
    artefactRareTypeId: "dungeons:rare_eye_of_the_guardian",
    description: "Fires a powerful laser.",
    soulInfo: "",
  },
  {
    artefactTypeId: "dungeons:satchel_of_snacks",
    artefactRareTypeId: "dungeons:rare_satchel_of_snacks",
    description: "Replenishes health and hunger.",
    soulInfo: "",
  },
  {
    artefactTypeId: "dungeons:satchel_of_elixirs",
    artefactRareTypeId: "dungeons:rare_satchel_of_elixirs",
    description: "Grants various effects.",
    soulInfo: "",
  },
  {
    artefactTypeId: "dungeons:totem_of_casting",
    artefactRareTypeId: "dungeons:rare_totem_of_casting",
    description: "Reduces cooldowns in range.",
    soulInfo: "\nConsumes 15 ",
  },
  {
    artefactTypeId: "dungeons:powershaker",
    artefactRareTypeId: "dungeons:rare_powershaker",
    description: "Adds area damage to each hit.",
    soulInfo: "",
  },
];

// 🔹 Popula os `Maps` para acesso rápido
for (const artefact of artefactData) {
  artefactDataMap.set(artefact.artefactTypeId, artefact);
  artefactDataMap.set(artefact.artefactRareTypeId, artefact);
  loreMap.set(
    artefact.description + artefact.soulInfo,
    `§7${artefact.description}§c${artefact.soulInfo}`
  );
}

/**
 * Aplica lore em artefatos equipados na mão.
 * 🔹 Agora busca instantaneamente com `Map` (O(1) em vez de O(n)).
 * @param {EntityWrapper} entityWrapper - O jogador segurando o artefato.
 */
export function ArtefactFunction(entityWrapper) {
  const player = entityWrapper.getPlayerObj();
  const hand = player
    .getComponent("equippable")
    ?.getEquipment(EquipmentSlot.Mainhand);
  if (!hand?.typeId) return;

  const foundArtefact = artefactDataMap.get(hand.typeId);
  if (!foundArtefact) return;

  const loreText = loreMap.get(
    foundArtefact.description + foundArtefact.soulInfo
  );
  if (hand.getLore()?.[0] !== loreText) {
    hand.setLore([loreText]);
  }
}

// ⚡ Criamos um `Map` para buscas instantâneas (O(1))
const limitedArmourMap = new Map();

const limitedArmourData = [
  {
    helmetTypeId: "dungeons:spooky_gourdian_helmet",
    chestplateTypeId: "dungeons:spooky_gourdian_chestplate",
    leggingsTypeId: "dungeons:spooky_gourdian_leggings",
    bootsTypeId: "dungeons:spooky_gourdian_boots",
    enchant: "Leeching",
  },
];

// 🔹 Popula o `Map` para acesso rápido
for (const armour of limitedArmourData) {
  limitedArmourMap.set(armour.helmetTypeId, armour);
  limitedArmourMap.set(armour.chestplateTypeId, armour);
  limitedArmourMap.set(armour.leggingsTypeId, armour);
  limitedArmourMap.set(armour.bootsTypeId, armour);
}

// 🛡️ Mapeia os slots corretamente usando a API oficial
const armourSlots = [
  EquipmentSlot.Head,
  EquipmentSlot.Chest,
  EquipmentSlot.Legs,
  EquipmentSlot.Feet,
];

export function LimitedArmour(entityWrapper) {
  const player = entityWrapper.getPlayerObj();
  if (!player) return;

  const equippable = player.getComponent("minecraft:equippable");
  if (!equippable) return;

  for (const slot of armourSlots) {
    const item = equippable.getEquipment(slot);
    if (!item?.typeId) continue;

    // Changed check to verify if item is non-stackable
    if (item.maxAmount > 1) continue;

    const armourData = limitedArmourMap.get(item.typeId);
    if (!armourData) continue;

    // Replaced problematic Unicode character with standard star
    const loreText = `§r§7${armourData.enchant}`;

    if (
      typeof item.getLore === "function" &&
      typeof item.setLore === "function"
    ) {
      const currentLore = item.getLore();
      if (!currentLore?.[0]?.startsWith("§r§7")) {
        item.setLore([loreText]);
      }
    }
  }
}

/**
 * Aplica lore em artefatos equipados na mão.
 * 🔹 Agora busca instantaneamente com `Map` (O(1) em vez de O(n)).
 * @param {EntityWrapper} entityWrapper - O jogador segurando o artefato.
 */
export function PoisonBowTrail() {
  const dimensions = DimensionWrapper.getDimensions();
  const bowTags = ["dungeons:twisting_vine_bow", "dungeons:weeping_vine_bow"];

  for (const dim of dimensions) {
    const entitiesWrapper = EntityManager.getEntitiesByTags(dim, bowTags);

    for (const wrapper of entitiesWrapper) {
      if (!wrapper.entity.isOnGround) {
        const location = wrapper.entity.location;
        dim.spawnParticle("dungeons:poison_bow_trail", location);
        dim.spawnEntity("dungeons:poison_trail", location);
      }
    }
  }
}

export function IncendiaryPotionFunction() {
  const dimensions = DimensionWrapper.getDimensions();

  for (const dim of dimensions) {
    const potions = EntityManager.getEntitiesByType(
      dim,
      "edx:area_incendiary_potion"
    );

    for (const potion of potions) {
      const { x, y, z } = potion.location;
      const entities = dim.getEntities({
        location: { x: x - 3, y, z: z - 3 },
        volume: { x: 6, y: 1, z: 6 },
      });

      for (const entity of entities) {
        if (entity !== potion) {
          entity.setOnFire(10);
        }
      }
    }
  }
}

export function ScaleBoneBow() {
  const dimensions = DimensionWrapper.getDimensions();
  for (let dim of dimensions) {
    const entitiesWrapper = EntityManager.getEntitiesByTags(dim, [
      "dungeons:bonebow",
    ]);
    for (let wrapper of entitiesWrapper) {
      let scale = wrapper.entity.getComponent("minecraft:scale");
      if (scale.value < 6 && !wrapper.entity.isOnGround) {
        scale.value = scale.value + 0.1;
      }
    }
  }
}

export function ParticleSpookyArmor(playerTags, entityWrapper) {
  const player = entityWrapper.getPlayerObj();
 
  player.dimension.spawnParticle(
    "dungeons:spooky_gourdian_idle",
    player.location
  );
}

export function GildedArmorFunction(playerTags, entityWrapper) {
  const player = entityWrapper.getPlayerObj();
  if (!playerTags.includes("dungeons:gilded_glory_armour")) return;
  const hp = player.getComponent("minecraft:health");
  if (player.level > 10 && hp.currentValue < hp.defaultValue / 2) {
    player.dimension.spawnParticle("dungeons:emerald_healing", player.location);
    player.playSound("beacon.activate", {
      pitch: 1,
      volume: 0.1,
    });
    hp.setCurrentValue(hp.currentValue + 2);
    player.addLevels(-1);
  }
}

export function SproutArmour(playerTags, entityWrapper) {
  const player = entityWrapper.getPlayerObj();
  if (
    !playerTags.includes("dungeons:sprout_armour") ||
    !playerTags.includes("dungeons:living_vines_armour")
  )
    return;
  if (player.isSprinting) {
    const nearbyMobs = player.dimension.getEntities({
      location: player.location,
      maxDistance: 3,
      families: ["monster"],
    });
    for (const mob of nearbyMobs) {
      mob.dimension.spawnParticle("dungeons:whip_poison", mob.location);
      if (!mob.getEffect("slowness")) {
        mob.addEffect("slowness", 35, {
          amplifier: 2,
          showParticles: false,
        });
      }
      if (!mob.getEffect("poison")) {
        mob.addEffect("poison", 40, {
          amplifier: 2,
          showParticles: false,
        });
      }
    }
    const nearbyPlayers = player.dimension.getEntities({
      location: player.location,
      maxDistance: 3,
      families: ["player"],
    });
    for (const enemyplayer of nearbyPlayers) {
      if (enemyplayer !== player) {
        enemyplayer.dimension.spawnParticle(
          "dungeons:whip_poison",
          enemyplayer.location
        );
        if (!enemyplayer.getEffect("slowness")) {
          enemyplayer.addEffect("slowness", 35, {
            amplifier: 1,
            showParticles: false,
          });
        }
        if (!enemyplayer.getEffect("fatal_poison")) {
          enemyplayer.addEffect("fatal_poison", 40, {
            amplifier: 2,
            showParticles: false,
          });
        }
      }
    }
  }
}

export function OpulentArmourFunction(playerTags, entityWrapper) {
  const player = entityWrapper.getPlayerObj();
  if (!playerTags.includes("dungeons:opulent_armour")) return;
  const playerLevel = player.level;
  system.runTimeout(() => {
    if (player.level > playerLevel) {
      player.dimension.spawnParticle(
        "dungeons:emerald_shield",
        player.location
      );
      player.playSound("beacon.activate", {
        pitch: 1.5,
        volume: 0.3,
      });
      player.addEffect("resistance", 100, {
        amplifier: 5,
      });
    }
  }, 1);
}

export function FrostArmourFunction(playerTags, entityWrapper) {
  const player = entityWrapper.getPlayerObj();
  if (!playerTags.includes("dungeons:frost_armour")) return;
    const nearbyMobs = player.dimension.getEntities({
      location: player.location,
      maxDistance: 8,
      families: ["monster"],
    });

    for (const mob of nearbyMobs) {
      mob.runCommandAsync("particle dungeons:element_freeze ~~1~");
      mob.addEffect("slowness", 30, {
        amplifier: 0,
        showParticles: false,
      });
    }
  
}

export function ShadowWalkerFunction(playerTags, entityWrapper) {
  const player = entityWrapper.getPlayerObj();
  if (!playerTags.includes("dungeons:shadow_walker_armour")) return;
    player.addEffect("resistance", 3, {
      amplifier: 2,
      showParticles: false,
    });
  
}

export function FoxArmour(playerTags, entityWrapper) {
  const player = entityWrapper.getPlayerObj();
  if (!playerTags.includes("dungeons:fox_armour")) return;
    if (player.isSprinting) {
      player.addEffect("speed", 3, {
        amplifier: 0,
        showParticles: false,
      });
    }
  
}
