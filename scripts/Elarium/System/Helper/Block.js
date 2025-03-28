import { DimensionWrapper, DimensionTypeEnum } from "../Class/Dimension.js";

/**
     * Obtém uma dimensão pelo tipo (enum).
     * @param {DimensionTypeEnum} dimension - Tipo da dimensão (ex: DimensionType.OVERWORLD).
      
        */
export class BlockHelper {
  static isBlockOfType(
    position,
    type,
    dimensionId = DimensionTypeEnum.OVERWORLD
  ) {
    const block =
      DimensionWrapper.getDimension(dimensionId).getBlock(position);
    return block?.typeId === type;
  }

  static replaceBlock(
    position,
    newType,
    dimensionId = DimensionTypeEnum.OVERWORLD
  ) {
    const block =
      DimensionWrapper.getDimension(dimensionId).getBlock(position);
    if (block) block.setType(newType);
  }

  static createExplosion(
    position,
    power = 4,
    dimensionId = DimensionTypeEnum.OVERWORLD
  ) {
    DimensionWrapper.getDimension(dimensionId).createExplosion(
      position,
      power
    );
  }
}

// Uso:
// BlockHelper.replaceBlock({ x: 0, y: 0, z: 0 }, "minecraft:diamond_block");
