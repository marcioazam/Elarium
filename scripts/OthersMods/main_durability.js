import { EquipmentSlot } from "@minecraft/server";
import itemIdList from "./item_id";

const armorSlots = [
  EquipmentSlot.Head,
  EquipmentSlot.Chest,
  EquipmentSlot.Legs,
  EquipmentSlot.Feet,
  EquipmentSlot.Offhand,
];

const NO_ITEM_CODE = "1403";
const NO_DURABILITY_CODE = "1404";

/**
 * Obtém o componente de equipamento de um jogador, armazenando-o em cache para evitar chamadas repetidas.
 * @param {Player} player - O jogador cujo componente de equipamento será obtido.
 */
export function DurabilityArmorViewer(player) {
  const equipment = player.getComponent("equippable");

  if (!equipment) {
    return;
  }

  let title = "§d§m§z§d§a§v§r§f:";
  let subtitle = "§d§m§z§d§a§v§r§f:";

  for (const slot of armorSlots) {
    const item = equipment.getEquipment(slot);

    if (!item) {
      title += NO_ITEM_CODE;
      subtitle += NO_DURABILITY_CODE;
      continue;
    }

    const itemId = itemIdList[item.typeId] || NO_ITEM_CODE;
    title += itemId;

    const durabilityComponent = item.getComponent("durability");
    if (durabilityComponent) {
      const maxDurability = durabilityComponent.maxDurability;
      const damage = durabilityComponent.damage;
      const durabilityPercent = Math.floor(
        ((maxDurability - damage) / maxDurability) * 1000
      );
      subtitle += durabilityPercent.toString().padStart(4, "_");
    } else {
      subtitle += NO_DURABILITY_CODE;
    }

    if (slot === EquipmentSlot.Offhand && item.amount) {
      subtitle += item.amount.toString().padStart(4, "_");
    }
  }


    player.onScreenDisplay.setTitle(title, {
      stayDuration: 5,
      fadeInDuration: 0,
      fadeOutDuration: 0,
      subtitle,
    });
  
}
