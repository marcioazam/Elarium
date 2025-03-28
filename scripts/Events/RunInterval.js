import { system, world, MolangVariableMap, Player, EntityDamageCause  } from "@minecraft/server";
import { EntityManager } from "../Elarium/System/Manager/Entity.js";

import {
  Saturation,
  VerifyTagPlayer,
  BleedingFunc,
  CheckCompassItem,
  BloodMoonFunction,
  GoldenSlots,
} from "./IntervalFunctions/Config.js";

import { SafeHandler, SafeAsyncHandler } from "../Elarium/System/Core/Handler.js";
import { Analisys } from "../Elarium/System/Core/Analisy.js";
import { InventoryAddLore, WeaponDB } from "../SweepSlash/Weapon/Weapons.js";
import { CombatRPGCooldown } from "./IntervalFunctions/RPG.js";
import { DisplayTPS } from "./IntervalFunctions/TPS.js";
import { PlayerRoll } from "./IntervalFunctions/Roll.js";
import {
  ShadowForm,
  Powershaker,
  ShowCordinates,
  GuardianEye,
  SwordBlock,
  FireBreath,
  WeightWeapon,
  KnockbackInFly,
  NotSleepBloodMoon,
  DurabilityArmor,
  ArmoursDataFunction,
  ArtefactFunction,
  LimitedArmour,
  PoisonBowTrail,
  ScaleBoneBow,
  IncendiaryPotionFunction,
  EffectBlazeBlade,
  ParticleSpookyArmor,
  GildedArmorFunction,
  SproutArmour,
  OpulentArmourFunction,
  FrostArmourFunction,
  ShadowWalkerFunction,
  FoxArmour,
} from "./IntervalFunctions/Equipament.js";

async function ConfigParamTick1(cachePlayer) {
  const player = cachePlayer.getPlayerObj();
  const playerTags = player.getTags();
  const { item, stats } = player.getItemStats();
  const status = player.getStatus();
  var changedWeapon = false;

  // Se o jogador mudou de slot ou de item, reseta o cooldown
  if (
    player.selectedSlotIndex !== status.lastSelectedSlot ||
    status.lastSelectedItem !== item?.typeId
  ) {
    changedWeapon = true;
  }

  return { item, stats, status, changedWeapon, playerTags };
}

system.runInterval(() => {
  EntityManager.getPlayers().forEach((cachePlayer) => {
    var playerTags = cachePlayer.getPlayerObj().getTags();

    SafeHandler(SwordBlock, 1, false, playerTags, cachePlayer);
    SafeHandler(ShowCordinates, 1, false, playerTags, cachePlayer);
    SafeHandler(GuardianEye, 1, false, cachePlayer);
    SafeHandler(PlayerRoll, 1, false, cachePlayer);
    DisplayTPS(cachePlayer, playerTags);
  });
}, 1);

system.runInterval(async () => {
  EntityManager.getPlayers().forEach(async (cachePlayer) => {
    const { item, stats, status, changedWeapon, playerTags } =
      await ConfigParamTick1(cachePlayer);

    SafeAsyncHandler(
      CombatRPGCooldown,
      1,
      false,
      true,
      item,
      stats,
      status,
      changedWeapon,
      cachePlayer
    );
    SafeAsyncHandler(
      WeightWeapon,
      1,
      false,
      true,
      playerTags,
      item,
      stats,
      cachePlayer
    );
    SafeAsyncHandler(KnockbackInFly, 1, false, true, playerTags, cachePlayer);
    SafeAsyncHandler(
      NotSleepBloodMoon,
      1,
      false,
      true,
      playerTags,
      cachePlayer
    );

    SafeAsyncHandler(FireBreath, 1, false, true, cachePlayer);
  });
}, 1);

system.runInterval(async () => {
  EntityManager.getPlayers().forEach(async (cachePlayer) => {
    SafeAsyncHandler(ShadowForm, 1, false, true, cachePlayer);
    SafeAsyncHandler(Powershaker, 1, false, true, cachePlayer);
  });
}, 6);

system.runInterval(() => {
  EntityManager.getPlayers().forEach((cachePlayer) => {
    SafeHandler(ScaleBoneBow, 1, false, cachePlayer);
    SafeHandler(IncendiaryPotionFunction, 1, false, cachePlayer);
  });
}, 19);

system.runInterval(() => {
  EntityManager.getPlayers().forEach((cachePlayer) => {
    var playerTags = cachePlayer.getPlayerObj().getTags();
    SafeHandler(Saturation, 1, false, cachePlayer);
    SafeHandler(VerifyTagPlayer, 1, false, playerTags, cachePlayer);
    SafeHandler(CheckCompassItem, 1, false, playerTags, cachePlayer);
  });
}, 20);

system.runInterval(() => {
  EntityManager.getPlayers().forEach((cachePlayer) => {
    SafeHandler(ShadowForm, 1, false, cachePlayer);
    SafeHandler(EffectBlazeBlade, 1, false, cachePlayer);
  });
}, 21);

system.runInterval(() => {
  EntityManager.getPlayers().forEach((cachePlayer) => {
    SafeHandler(ArmoursDataFunction, 1, false, cachePlayer);
    SafeHandler(PoisonBowTrail, 1, false, cachePlayer);
  });
}, 22);

system.runInterval(() => {
  EntityManager.getPlayers().forEach((cachePlayer) => {
    SafeHandler(ArtefactFunction, 1, false, cachePlayer);
    SafeHandler(LimitedArmour, 1, false, cachePlayer);
  });
}, 23);

system.runInterval(() => {
  EntityManager.getPlayers().forEach((cachePlayer) => {
    SafeHandler(GoldenSlots, 1, false, cachePlayer);
    SafeHandler(DurabilityArmor, 1, false, cachePlayer);
  });
}, 24);

system.runInterval(() => {
  EntityManager.getPlayers().forEach((cachePlayer) => {
    SafeHandler(InventoryAddLore, 1, false, cachePlayer);
  });
}, 25);

system.runInterval(() => {
  EntityManager.getPlayers().forEach((cachePlayer) => {
    SafeHandler(BleedingFunc, 1, false, cachePlayer);
  });
}, 40);

system.runInterval(() => {
  EntityManager.getPlayers().forEach((cachePlayer) => {
    SafeHandler(BloodMoonFunction, 1, false, cachePlayer);
  });
}, 100);

// Testador de funcoes
system.runInterval(() => {
  var cachePlayers = EntityManager.getPlayers();
  Analisys.ClonePlayer100x(cachePlayers);
  Analisys.StartBenchmark("Teste de Benchmark");

  cachePlayers.forEach((cachePlayer) => {
    var playerTags = cachePlayer.getPlayerObj().getTags();
    SafeHandler(ParticleSpookyArmor, 1, false, playerTags, cachePlayer);
    SafeHandler(GildedArmorFunction, 1, false, playerTags, cachePlayer);
    SafeHandler(SproutArmour, 1, false, playerTags, cachePlayer);
    SafeHandler(OpulentArmourFunction, 1, false, playerTags, cachePlayer);
    SafeHandler(FrostArmourFunction, 1, false, playerTags, cachePlayer);
    SafeHandler(ShadowWalkerFunction, 1, false, playerTags, cachePlayer);
    SafeHandler(FoxArmour, 1, false, playerTags, cachePlayer);
  });

  Analisys.EndBenchmark();
}, 20);


