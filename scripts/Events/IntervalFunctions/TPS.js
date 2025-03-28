import { EntityWrapper } from "../../Elarium/System/Class/Entity.js";
import { EntityManager } from "../../Elarium/System/Manager/Entity.js";

const DataTPS = {
  tps: 20,
  lastTick: Date.now(),
  timeArray: [],
  lastDisplay: "", // Armazena o último valor exibido
};

/**
 * Exibe a taxa de ticks por segundo (TPS) na tela do jogador.
 * @param {EntityWrapper} entityWrapper
 */
export function DisplayTPS(entityWrapper, playerTags) {

    

    // if(!playerTags.includes("showTPS")) {
    //     return;
    // }

    const player = entityWrapper.getPlayerObj();

  const currentTime = Date.now();
  const elapsedTime = currentTime - DataTPS.lastTick;
  DataTPS.lastTick = currentTime;

  if (elapsedTime > 0) {
    if (DataTPS.timeArray.length >= 20) DataTPS.timeArray.shift();
    DataTPS.timeArray.push(1000 / elapsedTime);
  }

  const totalTps = DataTPS.timeArray.reduce((sum, tps) => sum + tps, 0);
  const avgTps = totalTps / DataTPS.timeArray.length;
  const roundedTps = Math.round(avgTps);
  const TPS = roundedTps >= 20 ? `§a20` : `§c${roundedTps}`;

  const Entities = EntityManager.countEntities(); // Conta mobs hostis
  const InfoText = `TPS: §l${TPS}§r - IA: §l§u${Entities}§r`;

  // Evita exibir o mesmo valor várias vezes
  if (InfoText !== DataTPS.lastDisplay) {
    entityWrapper.getPlayerObj().onScreenDisplay.setActionBar(InfoText);
    DataTPS.lastDisplay = InfoText;
  }
}
