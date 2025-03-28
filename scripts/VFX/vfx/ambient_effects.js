import { MolangVariableMap, WeatherType, world } from "@minecraft/server";
import { clamp, getHighestPoint, randomAB } from '../util/util';
import { Vector } from "../util/vector";
import SimplexNoise from "../util/noise";
import { GlobalValues } from "./global_values";
import BIOMES from './biomes';
import { runBirdEvent } from "./vfx";
import { isEffectEnabled } from "../settings";
const STRIDE = 10;
const RADIUS = 4;
let uptime = 0;
const FogNoise = new SimplexNoise();
class AmbientEffectEmitter {
    constructor() {
        this.dimension = world.getDimension('overworld');
        this.chunks = [];
        this.chunk_index = 0;
        let players = world.getAllPlayers().filter(player => player.dimension == this.dimension);
        if (!players.length)
            return;
        try {
            this.biome_tester = this.dimension.spawnEntity('spark_vfx:biome_tester', players[0].location);
            if (!this.biome_tester || !this.biome_tester.isValid())
                return;
        }
        catch (err) {
            return;
        }
        AmbientEffectEmitter.active.push(this);
        let rows = [0];
        for (let i = 1; i <= RADIUS; i++) {
            // Handle close chunks first in case tester gets unloaded on accident
            rows.push(i, -i);
        }
        for (let player of players) {
            let speed = player.getVelocity();
            let pre_gen = 80;
            let pos = [
                Math.round((player.location.x + clamp(speed.x * pre_gen, -40, 40)) / STRIDE) * STRIDE,
                Math.round((player.location.z + clamp(speed.z * pre_gen, -40, 40)) / STRIDE) * STRIDE
            ];
            let addChunk = (x, z, distance) => {
                let id = [x, z].join(' ');
                let existing_chunk = this.chunks.find(c => c.id == id);
                if (existing_chunk) {
                    existing_chunk.distance_min = Math.min(existing_chunk.distance_min, distance);
                    existing_chunk.distance_max = Math.max(existing_chunk.distance_max, distance);
                    existing_chunk.players.push(player);
                }
                else {
                    let chunk = {
                        id,
                        surface_position: {
                            x: x + randomAB(-1, 1) * 5,
                            y: player.location.y,
                            z: z + randomAB(-1, 1) * 5
                        },
                        distance_min: distance,
                        distance_max: distance,
                        players: [player]
                    };
                    this.chunks.push(chunk);
                }
            };
            for (let ox of rows) {
                for (let oz of rows) {
                    addChunk(pos[0] + ox * STRIDE, pos[1] + oz * STRIDE, Math.sqrt(Math.pow(ox, 2) + Math.pow(oz, 2)) * STRIDE);
                }
            }
        }
    }
    tick() {
        let effect_chunk = this.chunks[this.chunk_index - 1];
        let test_chunk = this.chunks[this.chunk_index];
        if ((!effect_chunk && !test_chunk) || !this.biome_tester || !this.biome_tester.isValid()) {
            return this.dispose();
        }
        if (effect_chunk) {
            let surface_position = effect_chunk.surface_position;
            let biome_id = this.biome_tester.getProperty('spark_vfx:biome_query');
            let biome_variant = this.biome_tester.getProperty('spark_vfx:biome_variant_query');
            if (uptime < 200) {
                let weather_at_chunk = this.biome_tester.getProperty('spark_vfx:weather_query');
                if (weather_at_chunk == 1 || weather_at_chunk == 3) {
                    GlobalValues.weather = WeatherType.Rain;
                }
                else if (weather_at_chunk == 2 || weather_at_chunk == 4) {
                    GlobalValues.weather = WeatherType.Thunder;
                }
            }
            if (this.chunk_index == 1 && effect_chunk.players[0].isValid()) {
                world.scoreboard.getObjective('spark_vfx.biome').setScore(effect_chunk.players[0], biome_id);
            }
            if (surface_position && biome_id) {
                try {
                    this.emit(biome_id, biome_variant, effect_chunk);
                }
                catch (err) {
                }
            }
        }
        if (test_chunk) {
            try {
                let { x, z } = test_chunk.surface_position;
                let { y } = getHighestPoint(this.dimension, { x: Math.round(x), y: 64, z: Math.round(z) }, true, true, 140);
                let surface_block = this.dimension.getBlock({ x, y, z });
                if (surface_block.isValid() && surface_block.isLiquid) {
                    test_chunk.discovered = 'liquid';
                }
                for (let i = 0; i < 20; i++) {
                    if (!surface_block.isValid())
                        break;
                    if (surface_block.isAir || surface_block.permutation.matches('minecraft:leaves') || surface_block.permutation.matches('minecraft:leaves2') && y > 64) {
                        surface_block = surface_block.below();
                        test_chunk.discovered = 'tree';
                        y--;
                    }
                    else {
                        break;
                    }
                }
                test_chunk.surface_position.y = y;
                this.biome_tester.teleport({ x, y: y + 2, z });
                this.biome_tester.triggerEvent('spark_vfx:query_biome');
                if (uptime < 200) {
                    this.biome_tester.triggerEvent('spark_vfx:query_weather');
                }
            }
            catch (err) {
                //console.error(err);
            }
        }
        this.chunk_index++;
    }
    emit(biome_id, biome_variant, chunk) {
        let surface_position = chunk.surface_position;
        if (chunk.discovered == 'tree' && isEffectEnabled('leaves')) {
            if (biome_id == BIOMES.dark_oak) {
                this.dimension.spawnParticle('spark_vfx:ambient_leaves_dark', surface_position);
            }
            else if (biome_id == BIOMES.forest || biome_id == BIOMES.jungle) {
                this.dimension.spawnParticle('spark_vfx:ambient_leaves_normal', surface_position);
            }
            else if (biome_id == BIOMES.birch) {
                this.dimension.spawnParticle('spark_vfx:ambient_leaves_birch', surface_position);
            }
        }
        if (biome_id == BIOMES.frozen && GlobalValues.weather == WeatherType.Clear && isEffectEnabled('snowflakes')) {
            this.dimension.spawnParticle('spark_vfx:snow_crystals', surface_position);
        }
        if ([BIOMES.forest, BIOMES.jungle, BIOMES.plains, BIOMES.meadow].indexOf(biome_id) != -1 && GlobalValues.time_of_day < 11000 && GlobalValues.weather == WeatherType.Clear && surface_position.y < 150 && isEffectEnabled('butterflies')) {
            let chance = 1 / 80;
            let clear_radius = 30;
            if (biome_variant == 1) {
                chance = 1 / 6;
                clear_radius = 12;
            }
            if (Math.random() < chance && chunk.distance_min > clear_radius) {
                this.dimension.spawnParticle('spark_vfx:butterflies', surface_position);
            }
        }
        if ([BIOMES.forest, BIOMES.dark_oak, BIOMES.birch, BIOMES.mangroves].indexOf(biome_id) != -1 && GlobalValues.time_of_day < 11000 && GlobalValues.weather == WeatherType.Clear && surface_position.y < 100 && isEffectEnabled('startled_birds')) {
            let chance = 1 / 110;
            if (Math.random() < chance && chunk.distance_min > 9 && chunk.distance_max < 22 && chunk.players.find(player => player.isSprinting)) {
                runBirdEvent(chunk.players[0], surface_position, this.dimension);
            }
        }
        if ([BIOMES.swamp, BIOMES.jungle, BIOMES.mangroves].indexOf(biome_id) != -1 && GlobalValues.time_of_day > 13000 && GlobalValues.time_of_day < 21000 && isEffectEnabled('fireflies')) {
            if (Math.random() < (1 / 10) && chunk.distance_min > 24) {
                this.dimension.spawnParticle('spark_vfx:fireflies', surface_position);
            }
        }
        if (isEffectEnabled('flies')) {
            if (([BIOMES.swamp, BIOMES.mangroves].indexOf(biome_id) != -1 && GlobalValues.time_of_day < 11000 && Math.random() < (1 / 70)) ||
                ([BIOMES.savanna, BIOMES.mushroom].indexOf(biome_id) != -1 && GlobalValues.time_of_day < 11000 && Math.random() < (1 / 120))) {
                this.dimension.spawnParticle('spark_vfx:flies_natural', surface_position);
                this.dimension.runCommand(`playsound sound.spark_vfx.flies @a ${surface_position.x + randomAB(-3, 3)} ${surface_position.y + randomAB(-1, 2)} ${surface_position.z + randomAB(-3, 3)} ${randomAB(0.4, 0.9)}`);
            }
        }
        if (biome_id == BIOMES.desert && chunk.distance_max < 30 && GlobalValues.time_of_day < 12500 && isEffectEnabled('desert_sand') && chunk.discovered != 'liquid') {
            let variabies = new MolangVariableMap();
            variabies.setFloat('wind_intensity', GlobalValues.wind_intensity);
            this.dimension.spawnParticle('spark_vfx:sand_ground', surface_position, variabies);
        }
        if ((biome_id == BIOMES.ocean || biome_id == BIOMES.river) && chunk.distance_max < 30 && GlobalValues.time_of_day < 12500 && isEffectEnabled('water_godrays')) {
            let underwater_player = chunk.players.find(player => {
                return player.isValid() && player.location.y < 62.0 && player.location.y > 40.0;
            });
            if (underwater_player) {
                let effect_id = isEffectEnabled('water_bubbles') ? 'spark_vfx:water_godrays' : 'spark_vfx:water_godrays_dustless';
                this.dimension.spawnParticle(effect_id, {
                    x: surface_position.x + randomAB(-6, 6),
                    y: surface_position.y,
                    z: surface_position.z + randomAB(-6, 6),
                });
            }
        }
        let worldtime_scoreboard = world.scoreboard.getObjective('spark_vfx.worldtime');
        if (surface_position.y > 58 && surface_position.y < 200 && !(worldtime_scoreboard && worldtime_scoreboard.getScore('northern_lights') > 1) && !chunk.players[0].isInWater && isEffectEnabled('ground_fog')) {
            let is_morning_fog = (GlobalValues.time_of_day > 23000 || GlobalValues.time_of_day < 1000)
                && [BIOMES.forest, BIOMES.birch, BIOMES.dark_oak, BIOMES.extreme_hills, BIOMES.jungle, BIOMES.river, BIOMES.taiga].indexOf(biome_id) != -1;
            if (is_morning_fog ||
                (biome_id == BIOMES.frozen && GlobalValues.weather == WeatherType.Clear) ||
                biome_id == BIOMES.swamp ||
                biome_id == BIOMES.mangroves) {
                let value = FogNoise.noise(surface_position.x, surface_position.z);
                value = 1 - Math.pow(1 - value, 2);
                if (value > 0.1) {
                    let variables = new MolangVariableMap();
                    variables.setFloat('density', value * 10);
                    let fog_id = 'spark_vfx:ground_fog_spawn_chunk';
                    if (biome_id == BIOMES.frozen) {
                        fog_id = 'spark_vfx:ground_fog_cold_spawn_chunk';
                    }
                    this.dimension.spawnParticle(fog_id, surface_position, variables);
                }
            }
        }
        if (GlobalValues.weather != WeatherType.Clear && isEffectEnabled('raindrop_ripples') && chunk.distance_max < 15) {
            if (biome_id != BIOMES.frozen && biome_id != BIOMES.desert && biome_id != BIOMES.savanna && biome_id != BIOMES.mesa) {
                if (chunk.discovered == 'liquid') {
                    this.dimension.spawnParticle('spark_vfx:rain_ripple', surface_position);
                }
                else if (Math.random() < 0.35) {
                    this.dimension.spawnParticle('spark_vfx:rain_ripple_ground', surface_position);
                }
            }
        }
    }
    dispose() {
        let i = AmbientEffectEmitter.active.indexOf(this);
        AmbientEffectEmitter.active.splice(i, 1);
        if (this.biome_tester && this.biome_tester.isValid()) {
            this.biome_tester.triggerEvent('spark_vfx:despawn');
        }
    }
}
AmbientEffectEmitter.active = [];
let biome_effect_tick = 0;
export function biomeEffectTick() {
    let the_end = world.getDimension('the_end');
    uptime++;
    biome_effect_tick++;
    if (biome_effect_tick == 40) {
        new AmbientEffectEmitter();
        // End effects
        let end_players = the_end.getPlayers({ location: Vector.zero, maxDistance: 300 });
        if (end_players.length && isEffectEnabled('end_glow')) {
            the_end.runCommandAsync('particle spark_vfx:end_glow 0 60 0');
        }
        biome_effect_tick = 0;
    }
    AmbientEffectEmitter.active.forEach(emitter => {
        emitter.tick();
    });
}
//# sourceMappingURL=ambient_effects.js.map