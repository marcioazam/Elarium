import { BlockPermutation, EquipmentSlot, system, world } from "@minecraft/server";
import { Vector } from "./util/vector";
import { isEffectEnabled } from "./settings";

import { PlayersInGame } from '../Events/Player_Event.js';

var DynamicLightData;
(function (DynamicLightData) {
    // @config: number, distance player has to be moved between two ticks to clear old positioned light
    DynamicLightData.MIN_KILL_DISTANCE = 1;
    // @config: number, time in ticks to clear light behind player
    DynamicLightData.TRAIL_KILL_DELAY = 2;
    // @config: number, time in ticks, interval to check for active players in world
    DynamicLightData.ACTIVE_PLAYER_CHECK_INTERVAL = 40;
    // @config: contains blocks light can replace
    DynamicLightData.REPLACE_BLOCKS = new Set([
        "minecraft:air",
        "minecraft:light_block"
    ]);
    // @config: define light types from hold items
    DynamicLightData.ITEM_TO_LIGHT_TYPE = new Map([
        ["minecraft:torch", "torch"],
        ["minecraft:lantern", "torch"],
        ["minecraft:redstone_torch", "redstone_torch"],
        ["minecraft:soul_torch", "soul_torch"],
        ["minecraft:soul_lantern", "soul_torch"]
    ]);
    // @config: main light placing config, only one instance of fallback supported by design
    DynamicLightData.LIGHT_OFFSET_DATA_LIST = [
        { lightLevel: new Map([["torch", 15], ["redstone_torch", 7], ["soul_torch", 10]]), x: 0, y: 0, z: 0, isFallback: false },
        { lightLevel: new Map([["torch", 15], ["redstone_torch", 7], ["soul_torch", 10]]), x: 0, y: 1, z: 0, isFallback: false },
        { lightLevel: new Map([["torch", 15], ["redstone_torch", 7], ["soul_torch", 10]]), x: 0, y: 2, z: 0, isFallback: false },
        { lightLevel: new Map([["torch", 14], ["redstone_torch", 6], ["soul_torch", 9]]), x: 1, y: 0, z: 1, isFallback: true, fallbackPos: { x: 0, y: 0, z: 0 } },
        { lightLevel: new Map([["torch", 14], ["redstone_torch", 6], ["soul_torch", 9]]), x: -1, y: 0, z: 1, isFallback: true, fallbackPos: { x: 0, y: 0, z: 0 } },
        { lightLevel: new Map([["torch", 14], ["redstone_torch", 6], ["soul_torch", 9]]), x: 1, y: 0, z: -1, isFallback: true, fallbackPos: { x: 0, y: 0, z: 0 } },
        { lightLevel: new Map([["torch", 14], ["redstone_torch", 6], ["soul_torch", 9]]), x: -1, y: 0, z: -1, isFallback: true, fallbackPos: { x: 0, y: 0, z: 0 } },
        { lightLevel: new Map([["torch", 14], ["redstone_torch", 6], ["soul_torch", 9]]), x: 1, y: 1, z: 1, isFallback: true, fallbackPos: { x: 0, y: 1, z: 0 } },
        { lightLevel: new Map([["torch", 14], ["redstone_torch", 6], ["soul_torch", 9]]), x: 1, y: 1, z: -1, isFallback: true, fallbackPos: { x: 0, y: 1, z: 0 } },
        { lightLevel: new Map([["torch", 14], ["redstone_torch", 6], ["soul_torch", 9]]), x: -1, y: 1, z: 1, isFallback: true, fallbackPos: { x: 0, y: 1, z: 0 } },
        { lightLevel: new Map([["torch", 14], ["redstone_torch", 6], ["soul_torch", 9]]), x: -1, y: 1, z: -1, isFallback: true, fallbackPos: { x: 0, y: 1, z: 0 } },
        { lightLevel: new Map([["torch", 14], ["redstone_torch", 6], ["soul_torch", 9]]), x: -1, y: 2, z: -1, isFallback: true, fallbackPos: { x: 0, y: 2, z: 0 } },
        { lightLevel: new Map([["torch", 14], ["redstone_torch", 6], ["soul_torch", 9]]), x: -1, y: 2, z: 1, isFallback: true, fallbackPos: { x: 0, y: 2, z: 0 } },
        { lightLevel: new Map([["torch", 14], ["redstone_torch", 6], ["soul_torch", 9]]), x: 1, y: 2, z: -1, isFallback: true, fallbackPos: { x: 0, y: 2, z: 0 } },
        { lightLevel: new Map([["torch", 14], ["redstone_torch", 6], ["soul_torch", 9]]), x: 1, y: 2, z: 1, isFallback: true, fallbackPos: { x: 0, y: 2, z: 0 } }
    ];
})(DynamicLightData || (DynamicLightData = {}));
export class DynamicLight {
    constructor() {
        this.lightMainPlaceList = [];
        this.lightFallBackMap = new Map();
        this.activePlayers = [];
        this.validItems = new Set(DynamicLightData.ITEM_TO_LIGHT_TYPE.keys());
        this.init();
        world.afterEvents.playerSpawn.subscribe((evt) => {
            if (evt.initialSpawn) {
                this.activePlayers.push(evt.player);
                return;
            }
        });
        world.afterEvents.playerJoin.subscribe(event => {
            let id = event.playerId;
            let interval = system.runInterval(() => {
                let player = PlayersInGame.find(player => player.id == id);
                if (player) {
                    system.clearRun(interval);
                    player.runCommandAsync('fill ~-1 ~ ~-1 ~1 ~2 ~1 air[] replace light_block');
                }
            });
        });
    }
    getBlockPos(pos) {
        return { x: Math.round(pos.x), y: Math.round(pos.y), z: Math.round(pos.z) };
    }
    cleanLight(player, basePos, block, lightLevel, lightType) {
        var _a;
        try {
            if (!block.isValid()) {
                return;
            }
            let equipComponent = player.getComponent('minecraft:equippable');
            let mainHandItemID = (_a = equipComponent.getEquipment(EquipmentSlot.Mainhand)) === null || _a === void 0 ? void 0 : _a.typeId;
            if ((Vector.distance(player.location, basePos) < DynamicLightData.MIN_KILL_DISTANCE) && (this.validItems.has(mainHandItemID)) && (DynamicLightData.ITEM_TO_LIGHT_TYPE.get(mainHandItemID) === lightType)) {
                system.runTimeout(() => { this.cleanLight(player, basePos, block, lightLevel, lightType); }, DynamicLightData.TRAIL_KILL_DELAY);
                return;
            }
            if (!block.typeId.startsWith("minecraft:light_block")) {
                return;
            }
            if (block.permutation.getState("block_light_level") !== lightLevel) {
                return;
            }
            block.setType("minecraft:air");
        }
        catch (_b) { }
    }
    setLight(player, dim, basePos, lightType, lightData, block) {
        try {
            let lightLevel = lightData.lightLevel.get(lightType);
            block.setType("minecraft:light_block");
            let permutation = BlockPermutation.resolve("minecraft:light_block", { block_light_level: lightLevel });
            block.setPermutation(permutation);
            system.runTimeout(() => { this.cleanLight(player, basePos, block, lightLevel, lightType); }, DynamicLightData.TRAIL_KILL_DELAY);
        }
        catch (_a) { }
    }
    setLightFallback(player, dim, basePos, lightType, block, dataFallbackPos) {
        this.lightFallBackMap.get(dataFallbackPos).forEach((data) => {
            this.setLight(player, dim, basePos, lightType, data, block);
        });
    }
    setLightTrail(player, lightType) {
        const playerPos = player.location;
        const dim = player.dimension;
        const basePos = this.getBlockPos(playerPos);
        this.lightMainPlaceList.forEach((data) => {
            try {
                let block = dim.getBlock({ x: basePos.x + data.x, y: basePos.y + data.y, z: basePos.z + data.z });
                if (!DynamicLightData.REPLACE_BLOCKS.has(block.typeId)) {
                    this.setLightFallback(player, dim, basePos, lightType, block, data.fallbackPos);
                    return;
                }
                this.setLight(player, dim, basePos, lightType, data, block);
                return;
            }
            catch (_a) { }
        });
    }
    initMainPlaceList() {
        DynamicLightData.LIGHT_OFFSET_DATA_LIST.forEach((data) => {
            if (data.isFallback) {
                return;
            }
            this.lightMainPlaceList.push(data);
        });
    }
    initFallBack() {
        DynamicLightData.LIGHT_OFFSET_DATA_LIST.forEach((data) => {
            if (!data.isFallback) {
                return;
            }
            if (!this.lightFallBackMap.has(data.fallbackPos)) {
                this.lightFallBackMap.set(data.fallbackPos, []);
            }
            this.lightFallBackMap.get(data.fallbackPos).push(data);
        });
    }
    validateActivePlayers() {
        let validPlayers = [];
        this.activePlayers.forEach((p) => {
            if (!p.isValid()) {
                return;
            }
            validPlayers.push(p);
        });
        this.activePlayers = validPlayers;
    }
    init() {
        this.initFallBack();
        this.initMainPlaceList();
  
        (() => { this.validateActivePlayers(); }, DynamicLightData.ACTIVE_PLAYER_CHECK_INTERVAL);
    }
    tick() {
        if (!isEffectEnabled('dynamic_lights')) {
            return;
        }
        this.activePlayers.forEach((p) => {
            var _a;
            if (!p.isValid()) {
                return;
            }
            let equipComponent = p.getComponent('minecraft:equippable');
            let mainHandItemID = (_a = equipComponent.getEquipment(EquipmentSlot.Mainhand)) === null || _a === void 0 ? void 0 : _a.typeId;
            if (!mainHandItemID) {
                return;
            }
            if (!this.validItems.has(mainHandItemID)) {
                return;
            }
            this.setLightTrail(p, DynamicLightData.ITEM_TO_LIGHT_TYPE.get(mainHandItemID));
        });
    }
}
//# sourceMappingURL=dynamic_light.js.map