import { AmbientSoundConfig, TPSConfig } from "./config";
import { world, system } from "@minecraft/server";
import { clamp } from "./util/util";
var AmbientSoundUtil;
(function (AmbientSoundUtil) {
    // class to assign uids to players and handle them the same way with sound query via dynamic properties
    // I noticed that this is kinda unnecessary, lol
    class UIDMap {
        constructor() {
            this.uidMap = new Map;
        }
        getPlayer(uid) {
            return this.uidMap.get(uid);
        }
        getUID(player) {
            return player.id;
        }
        insert(player) {
            this.uidMap.set(player.id, player);
        }
        removeUID(uid) {
            this.uidMap.delete(uid);
        }
        removePlayer(player) {
            this.uidMap.delete(player.id);
        }
        hasPlayer(player) {
            return this.uidMap.has(player.id);
        }
        hasUID(uid) {
            return this.uidMap.has(uid);
        }
    }
    AmbientSoundUtil.UIDMap = UIDMap;
    // class implementation which also computes average tps to negotiate with generally slow running servers
    class TPSTracker {
        constructor() {
            this.lastTickTime = Date.now();
            this.tpsTimer = 0;
            this.tpsTracker = 0;
            this.MAX_TPS = 20;
            this.tpsHistory = [];
        }
        tick() {
            let time = Date.now();
            this.tpsTracker += time - this.lastTickTime;
            this.lastTickTime = time;
            this.tpsTimer++;
            // updated logic
            if (time - this.lastTickTime >= 1000) {
                this.tps = this.calculateTPS();
                this.tpsTimer = 0;
                this.tpsTracker = 0;
                this.tpsHistory.push(this.tps);
                if (this.tpsHistory.length > TPSConfig.AVERAGE_TPS_TIME) {
                    this.tpsHistory.shift();
                }
            }
        }
        calculateTPS() {
            let secondsPassed = this.tpsTimer / 1000;
            let tps = Math.min(this.tpsTimer / secondsPassed, this.MAX_TPS);
            return tps;
        }
        getTPS() {
            return this.tps;
        }
        getAverageTPS() {
            if (this.tpsHistory.length < TPSConfig.AVERAGE_TPS_TIME || this.tpsHistory.length === 0) {
                return this.MAX_TPS;
            }
            let sum = this.tpsHistory.reduce((acc, val) => acc + val, 0);
            return sum / this.tpsHistory.length;
        }
    }
    AmbientSoundUtil.TPSTracker = TPSTracker;
    AmbientSoundUtil.BIOME_MAP = new Map([
        [-1, { id: undefined, sound: undefined }],
        [0, { id: "default", sound: undefined }],
        [1, { id: "underground", sound: AmbientSoundConfig.SOUND_UNDERGROUND }],
        [2, { id: "ocean", sound: AmbientSoundConfig.SOUND_OCEAN_SURFACE }],
        [3, { id: "forest_light", sound: AmbientSoundConfig.SOUND_FOREST_LIGHT }],
        [4, { id: "jungle", sound: AmbientSoundConfig.SOUND_JUNGLE }],
        [5, { id: "nether", sound: AmbientSoundConfig.SOUND_NETHER }],
        [6, { id: "mesa", sound: AmbientSoundConfig.SOUND_MESA }],
        [7, { id: "cave_wet", sound: AmbientSoundConfig.SOUND_CAVE_WET }],
        [8, { id: "beach", sound: AmbientSoundConfig.SOUND_BEACH }],
        [9, { id: "highland", sound: AmbientSoundConfig.SOUND_HIGHLAND }],
        [10, { id: "forest_dense", sound: AmbientSoundConfig.SOUND_FOREST_DENSE }],
        [11, { id: "cold", sound: AmbientSoundConfig.SOUND_COLD }],
        [12, { id: "flatland", sound: AmbientSoundConfig.SOUND_FLATLAND }],
        [13, { id: "desert", sound: AmbientSoundConfig.SOUND_DESERT }],
        [14, { id: "swamp", sound: AmbientSoundConfig.SOUND_SWAMP }],
        [15, { id: "end", sound: AmbientSoundConfig.SOUND_END }]
    ]);
})(AmbientSoundUtil || (AmbientSoundUtil = {}));
export var AmbientSound;
(function (AmbientSound) {
    class AmbientSoundSystem {
        constructor() {
            this.tpsTracker = new AmbientSoundUtil.TPSTracker;
            this.UID_PROPERTY_NAME = "spark_vfx:dyn_uid";
            this.uidMap = new AmbientSoundUtil.UIDMap;
            this.timer = AmbientSoundConfig.LOOP_TIME * 20;
            system.afterEvents.scriptEventReceive.subscribe((event) => {
                if (event.id === "spark_vfx:emit_sound_query") {
                    let query = event.sourceEntity;
                    this.onReceiveQuery(query);
                }
            });
            // player join after event is weird, use spawn instead
            world.afterEvents.playerSpawn.subscribe((event) => {
                this.uidMap.insert(event.player);
            });
            // don't create scoreboard here, only check if it exists and disable sound when it does and is toggled off
            let settingsScoreboard = world.scoreboard.getObjective("spark_vfx.settings");
            if (settingsScoreboard) {
                let toggledSetting = settingsScoreboard.getScore("immersive_sound");
                if (toggledSetting === 0) {
                    AmbientSoundSystem.isDisabled = true;
                }
            }
        }
        // read and return query entries
        readQuery(query) {
            let data = {
                biome: -1
            };
            // trust me, the type is correct.
            try {
                data.biome = Number(query.getProperty("spark_vfx:biome"));
            }
            catch (err) { }
            return data;
        }
        onReceiveQuery(query) {
            let queryUID;
            // check if query has uid property
            if (!query.getDynamicPropertyIds().find(_ => _ === this.UID_PROPERTY_NAME)) {
                try {
                    query.remove();
                    return;
                }
                catch (err) { }
            }
            // check if player with uid exists
            try {
                queryUID = String(query.getDynamicProperty(this.UID_PROPERTY_NAME));
            }
            catch (err) { }
            if (!this.uidMap.hasUID(queryUID)) {
                try {
                    query.remove();
                    return;
                }
                catch (err) { }
            }
            let queryData = this.readQuery(query);
            let target = this.uidMap.getPlayer(queryUID);
            try {
                query.remove();
            }
            catch (err) { }
            this.handleSound(target, queryData);
        }
        handleSound(player, queryData) {
            let y = player.location.y;
            let inWater = player.isInWater;
            let biome = AmbientSoundUtil.BIOME_MAP.get(queryData.biome);
            // special cases first
            if (y > AmbientSoundConfig.Y_LEVEL_SKY) {
                this.playSound(player, AmbientSoundConfig.SOUND_SKY);
                return;
            }
            if (biome.id === undefined || biome.id === "default") {
                // both should never happen
                // undefined: messed up evaluation or transmission; default: filter-biome issue
                return;
            }
            if (biome.id === "ocean" && y > AmbientSoundConfig.Y_LEVEL_WATER_SURFACE) {
                this.playSound(player, AmbientSoundConfig.SOUND_OCEAN_SURFACE);
                return;
            }
            if (biome.id === "ocean" && y < AmbientSoundConfig.Y_LEVEL_WATER_SURFACE && inWater) {
                this.playSound(player, AmbientSoundConfig.SOUND_OCEAN_UNDERWATER);
                return;
            }
            if (biome.id === "ocean" && y < AmbientSoundConfig.Y_LEVEL_WATER_SURFACE && !inWater) {
                this.playSound(player, AmbientSoundConfig.SOUND_UNDERGROUND);
                return;
            }
            if (biome.id === "cave_wet") {
                this.playSound(player, AmbientSoundConfig.SOUND_CAVE_WET);
                return;
            }
            if (y < AmbientSoundConfig.Y_LEVEL_UNDERGROUND) {
                this.playSound(player, AmbientSoundConfig.SOUND_UNDERGROUND);
                return;
            }
            this.playSound(player, biome.sound);
            return;
        }
        playSound(player, identifier) {
            // modify pitch and volume in here
            player.playSound(identifier, { volume: AmbientSoundSystem.soundVolume });
        }
        // use tps to update loop time to get precise timing
        updateTimer() {
            let averageTPS = this.tpsTracker.getAverageTPS();
            this.timer = AmbientSoundConfig.LOOP_TIME * averageTPS;
        }
        // timer hits 0
        triggerTimer() {
            if (AmbientSoundSystem.isDisabled) {
                return;
            }
            if (AmbientSoundSystem.soundVolume < 0.005) {
                return;
            }
            let players = world.getAllPlayers();
            players.forEach((p) => {
                let uid = this.uidMap.getUID(p);
                try {
                    let query = p.dimension.spawnEntity("spark_vfx:sound_query", p.location);
                    query.setDynamicProperty(this.UID_PROPERTY_NAME, uid);
                }
                catch (err) { }
            });
        }
        // PUBLIC INTERFACE
        // hook up in UI to set and reset the sound system to cancel and enable it.
        // enable system
        static setEnable() {
            AmbientSoundSystem.isDisabled = false;
        }
        // disable system
        static setDisable() {
            AmbientSoundSystem.isDisabled = true;
        }
        // get if the system is enabled/disabled
        static checkDisabled() {
            return AmbientSoundSystem.isDisabled;
        }
        // hook up in UI to get and set global sound level of this system
        static setVolumeLevel(volume) {
            AmbientSoundSystem.soundVolume = clamp(volume, 0, 1);
        }
        static getCurrentVolume() {
            return AmbientSoundSystem.soundVolume;
        }
        // use this to set inital slider position
        static getDefaultVolume() {
            return AmbientSoundConfig.OPTION_DEFAULT_VOLUME;
        }
        tick() {
            this.tpsTracker.tick();
            if (this.timer <= 0) {
                this.updateTimer();
                this.triggerTimer();
            }
            this.timer--;
        }
    }
    AmbientSoundSystem.isDisabled = false;
    AmbientSoundSystem.soundVolume = AmbientSoundConfig.OPTION_DEFAULT_VOLUME;
    AmbientSound.AmbientSoundSystem = AmbientSoundSystem;
})(AmbientSound || (AmbientSound = {}));
//# sourceMappingURL=ambient_sound.js.map