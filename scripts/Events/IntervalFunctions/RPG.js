import { system, world } from "@minecraft/server";

import {
  Check,
  getCooldownTime_VAIMUDARDEPOIS,
} from "../../SweepSlash/main/mathAndCalculations.js";
import { EntityWrapper } from "../../Elarium/System/Class/Entity.js";

/**
 * Aplica efeitos à entidade sem repetição
 * @param {EntityWrapper} entityWrapper
 */
export async function CombatRPGCooldown(item, stats, status, changedWeapon, entityWrapper) {
  const player = entityWrapper.getPlayerObj();
  const currentTime = Date.now();

  // Se o jogador mudou de slot ou de item, reseta o cooldown
  if (
    changedWeapon == true
  ) {
    status.lastAttackTime = currentTime;
    status.attackReady = false;
  }

  const shieldCheck = await checkShieldAsync(player);
    if (shieldCheck) {
    status.shieldDelay += 1;
  } else {
    status.shieldDelay = 0;
  }
  status.shieldValid = status.shieldDelay > 5;

  if (status?.attackReady == true) return;

  const hasMace = item?.typeId === "minecraft:mace";

  if (hasMace) {
    // Fall distance code by Jayly
    // For mace smash attack
    const fallDist = status.fallDistance;
    await updateFallDistanceAsync(player, status);

    if (Math.abs(fallDist) >= 1.5 && item?.typeId === "minecraft:mace") {
      await triggerEventAsync(player, "sweepnslash:mace");
      status.mace = true;
    } else {
      await triggerEventAsync(player, "sweepnslash:not_mace");
      status.mace = false;
    }
  }

  // Atualiza os status após a verificação
  status.lastSelectedSlot = player.selectedSlotIndex;
  status.lastSelectedItem = item?.typeId;

  const cooldown = await getCooldownAsync(player, stats?.AttackSpeed);

  await updateStatusAsync(status, {
    lastSelectedSlot: player.selectedSlotIndex,
    lastSelectedItem: item?.typeId,
    cooldown: Math.max(0, (status.lastAttackTime + cooldown.ms - currentTime) / 50),
  });

  const specialCheck = await checkSpecialValidAsync(currentTime, player, stats, cooldown.ms, status);



  if (!specialCheck && !player.hasTag("attack_disabled")) {
    managePlayerTags(player, "attack_disabled", "add");
  } else if (player.hasTag("attack_disabled")) {
    managePlayerTags(player, "attack_disabled", "remove");
  }

  // For UI
  const maxCD = cooldown.ticks;
  const curCD = status.cooldown;
  const cooldownPercentage = ((maxCD - curCD) / maxCD) * 100;

  const viewCheck = await checkRangeAsync(player);

  // Handles indicators
  // If the player has indicator disabled, the title will show up once to clean up the UI and never appear
  const barStyle = 0;
  const barArray = ["crs", "htb", "sub", "non"][barStyle];

  const bonkReady = specialCheck && viewCheck;

  status.showBar = true;
  if (curCD > 0 || viewCheck) {
    updateUI(player, barArray, bonkReady, cooldownPercentage).then(() => {
      status.attackReady = false;
    });
  } else if (curCD <= 0 && status.attackReady == false) {
    updateUI(player, "non", false, 0).then(() => {
      status.attackReady = true;
    });
  }
}

async function updateFallDistanceAsync(player, status) {
  return new Promise((resolve) => {
    if (player.isFalling) {
      status.fallDistance += player.getVelocity().y;
    } else {
      system.run(() => (status.fallDistance = 0));
    }
    resolve();
  });
}

async function triggerEventAsync(player, event) {
  return new Promise((resolve) => {
    player.triggerEvent(event);
    resolve();
  });
}

async function checkRangeAsync(player) {
  return new Promise((resolve) => {
    const inRange = null; // Substitua por lógica real de verificação de alcance
    const targetValid = !(inRange?.getComponent("health")?.currentValue <= 0);
    const riders = player.getRiders() || [];
    const riderCheck = riders.some((rider) => rider === inRange);
    const ridingCheck = player.getRidingOn() !== inRange;
    const viewCheck = inRange && targetValid && !riderCheck && ridingCheck;
    resolve(viewCheck);
  });
}

async function updateUI(player, barArray, bonkReady, cooldownPercentage) {
  await player.onScreenDisplay.setTitle(
    `_sweepnslash:${barArray}:${bonkReady ? "t" : "f"}:${cooldownPercentage.toFixed(0)}`,
    {
      fadeInDuration: 0,
      fadeOutDuration: 0,
      stayDuration: 0,
    }
  );
}

  async function managePlayerTags(player, tag, action) {
    if (action === "add") {
      await player.addTag(tag);
    } else if (action === "remove") {
      await player.removeTag(tag);
    }
    player.triggerEvent("check_attack_disabled");
  }

  async function updateStatusAsync(status, updates) {
    return new Promise((resolve) => {
      Object.assign(status, updates);
      resolve();
    });
  }
  
  async function getCooldownAsync(player, attackSpeed) {
    return new Promise((resolve) => {
      const cooldown = getCooldownTime_VAIMUDARDEPOIS(player, attackSpeed);
      resolve(cooldown);
    });
  }

  async function checkShieldAsync(player) {
    return new Promise((resolve) => {
      const result = Check.shield(player);
      resolve(result);
    });
  }

  async function checkSpecialValidAsync(currentTime, player, stats, cooldownMs, status) {
    return new Promise((resolve) => {
      const result = Check.specialValid(currentTime, player, stats, cooldownMs, status);
      resolve(result);
    });
  }