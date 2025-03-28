import { Dimension, world } from "@minecraft/server";

// Enum simulado para as dimensões
export const DimensionTypeEnum = {
  OVERWORLD: "overworld",
  NETHER: "nether",
  THE_END: "the_end",
};

// Mapa privado para armazenar as dimensões
var dimensionsInGame = new Map();

export class DimensionWrapper {
  /**
   * Construtor da classe. Inicializa o mapa de dimensões.
   */
  constructor() {
    if (DimensionWrapper.dimensionsInGame.size === 0) {
      DimensionWrapper.dimensionsInGame.set(
        DimensionTypeEnum.OVERWORLD,
        world.getDimension(DimensionTypeEnum.OVERWORLD)
      );
      DimensionWrapper.dimensionsInGame.set(
        DimensionTypeEnum.NETHER,
        world.getDimension(DimensionTypeEnum.NETHER)
      );
      DimensionWrapper.dimensionsInGame.set(
        DimensionTypeEnum.THE_END,
        world.getDimension(DimensionTypeEnum.THE_END)
      );
    }
  }

  static init() {
    dimensionsInGame.set(
      DimensionTypeEnum.OVERWORLD,
      world.getDimension(DimensionTypeEnum.OVERWORLD)
    );
    dimensionsInGame.set(
      DimensionTypeEnum.NETHER,
      world.getDimension(DimensionTypeEnum.NETHER)
    );
    dimensionsInGame.set(
      DimensionTypeEnum.THE_END,
      world.getDimension(DimensionTypeEnum.THE_END)
    );
  }

  /**
   * Retorna o mapa de dimensões.
   * @returns {Dimension[]}
   */
  static getDimensions() {
    return [...dimensionsInGame.values()];
  }

  /**
   * Obtém uma dimensão pelo tipo (enum).
   * @param {DimensionTypeEnum} type - Tipo da dimensão (ex: DimensionTypeEnum.OVERWORLD).
   * @returns {Dimension|null}
   */
  static getDimension(type) {
    return dimensionsInGame.has(type) ? dimensionsInGame.get(type) : null;
  }
}

DimensionWrapper.init();
