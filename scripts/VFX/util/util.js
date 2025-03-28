import { world } from "@minecraft/server";
import { Vector } from "./vector";
/**
 * Clamps the input value to between the two numbers
 */
export const clamp = function (value, min, max) {
    return Math.max(Math.min(value, max), min);
};
export const lerp = function (start, end, lerp) {
    return start + (end - start) * lerp;
};
export const randomAB = function (start, end) {
    return start + Math.random() * (end - start);
};
export const randomRange = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
export const isBlockLoaded = function (location, dimension) {
    try {
        return dimension.getBlock(location).isValid();
    }
    catch (e) {
        return false;
    }
    return false;
};
export const getHighestPoint = function (dimension, location, liquid = false, passable = false, maxHeight = 320) {
    let block = dimension.getBlockFromRay({ x: location.x, y: maxHeight, z: location.z }, Vector.down, { maxDistance: maxHeight + 64, includeLiquidBlocks: liquid, includePassableBlocks: passable });
    if (block == undefined)
        return { x: 0, y: -64, z: 0 };
    return { x: block.block.x, y: block.block.y, z: block.block.z };
};
export const getAboveHighestPoint = function (dimension, location) {
    let point = getHighestPoint(dimension, location);
    return Vector.add(point, Vector.up);
};
export const getBelowHighestPoint = function (dimension, location) {
    let point = getHighestPoint(dimension, location);
    return Vector.add(point, Vector.down);
};
export const isUnderGround = function (entity, maxHeight = 320) {
    let start_location = { x: entity.location.x, y: entity.location.y + 1.7, z: entity.location.z };
    let hit = entity.dimension.getBlockFromRay(start_location, Vector.up, { maxDistance: maxHeight + 64 });
    if (hit == undefined)
        return false;
    return true;
};
export const isUnderWater = function (entity) {
    if (!entity.isInWater)
        return false;
    let head_block = entity.dimension.getBlock({ x: entity.location.x, y: entity.location.y + 1.7, z: entity.location.z });
    if (!head_block.isValid())
        return false;
    return head_block.isLiquid;
};
export const isBlockAboveHead = function (entity) {
    let hit = entity.dimension.getBlockFromRay(entity.location, Vector.up, { maxDistance: 2 });
    return hit == undefined ? false : true;
};
export function getOrCreateScoreboard(id) {
    let scoreboard = world.scoreboard.getObjective(id);
    if (!scoreboard) {
        scoreboard = world.scoreboard.addObjective(id, id);
    }
    return scoreboard;
}
export const getKeyFromBlock = function (block) {
    return getKeyFromVector(block.location);
};
export const getKeyFromVector = function (location) {
    return location.x.toString() + ":" + location.y.toString() + ":" + location.z.toString();
};
export const getVectorFromBlockKey = function (location) {
    let parts = location.split(":").map(Number);
    return { x: parts[0], y: parts[1], z: parts[2] };
};
export const printCoordinates = function (location) {
    return location.x.toString() + " " + location.y.toString() + " " + location.z.toString();
};
const ERROR_PREFIX = '§4[!]§7 ';
export function sendUsageWarningMessage(player, translate_key) {
    player.runCommandAsync(`titleraw @s actionbar {"rawtext": [{"text": "${ERROR_PREFIX}"}, {"translate": "${translate_key}"}]}`);
}
export function Log(...args) {
    world.getDimension('overworld').runCommandAsync('say ' + args.join(' '));
}
//# sourceMappingURL=util.js.map