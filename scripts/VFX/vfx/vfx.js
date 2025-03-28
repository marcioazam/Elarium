import { EntityInitializationCause, MolangVariableMap, WeatherType, system, world } from "@minecraft/server";
import { clamp, getOrCreateScoreboard, isBlockLoaded, isUnderGround, isUnderWater, lerp, randomAB } from '../util/util';
import { Vector } from "../util/vector";
import { LinearCurve } from "../util/linear_curve";
import { splashTick } from "./splash";
import { GlobalValues } from "./global_values";
import { biomeEffectTick } from "./ambient_effects";
import SimplexNoise from "../util/noise";
import BIOMES from './biomes';
import { isEffectEnabled } from "../settings";
const SUN_LOOKUP_TABLE = new LinearCurve({
    0: 0,
    1000: 710,
    2000: 1490,
    3000: 2300,
    4000: 3200,
    4500: 3670,
    5000: 4160,
    6000: 5160,
    7000: 6100,
});
const MOON_LOOKUP_TABLE = new LinearCurve({
    0: 0,
    2000: 2370,
    4000: 4660,
    5200: 5980,
    6000: 6400,
});
let lens_flare_smooth_y = {};
let lens_flare_smooth_opacity = {};
const WindNoise = new SimplexNoise();
const BiomeScoreboard = getOrCreateScoreboard('spark_vfx.biome');
let WorldtimeScoreboard = getOrCreateScoreboard('spark_vfx.worldtime');
let slow_tick = 0;
export function vfxTick() {
    let overworld = world.getDimension('overworld');
    let the_end = world.getDimension('the_end');
    let old_absolute_time = GlobalValues.absolute_time;
    GlobalValues.time_of_day = world.getTimeOfDay();
    GlobalValues.absolute_time = world.getAbsoluteTime();
    WorldtimeScoreboard.setScore('daytime', Math.round(GlobalValues.time_of_day));
    GlobalValues.wind_intensity = clamp(0.8 + WindNoise.noise(GlobalValues.time_of_day / 700, -400), 0.1, 2);
    if (GlobalValues.weather != WeatherType.Clear)
        GlobalValues.wind_intensity += 1.6;
    slow_tick++;
    if (slow_tick == 40) {
        let y_scoreboard = getOrCreateScoreboard('spark_vfx.y_pos');
        let dimension_scoreboard = getOrCreateScoreboard('spark_vfx.dimension');
        world.getAllPlayers().forEach(player => {
            if (!player.isValid())
                return;
            y_scoreboard.setScore(player, Math.round(player.location.y));
            dimension_scoreboard.setScore(player, player.dimension == the_end ? 2 : (player.dimension == overworld ? 0 : 1));
        });
        slow_tick = 0;
    }
    biomeEffectTick();
    if (isEffectEnabled('splashes')) {
        splashTick(overworld);
    }
    // Weather
    if (old_absolute_time && GlobalValues.absolute_time - old_absolute_time > 20) {
        GlobalValues.weather = WeatherType.Clear;
    }
    if (slow_tick % 3 == 0) {
        overworld.getPlayers().forEach(player => {
            if (!player || !player.isValid() || !isBlockLoaded(player.location, overworld))
                return;
            let biome = getPlayerBiome(player);
            if (GlobalValues.weather != WeatherType.Clear) {
                if (player.hasTag('spark_vfx.particle_spawner_15') && !isUnderGround(player) && !isUnderWater(player)) {
                    if (biome == BIOMES.frozen) {
                        if (slow_tick % 6 == 0 && GlobalValues.weather == WeatherType.Thunder && isEffectEnabled('snowstorms')) {
                            let location = player.location;
                            location = {
                                x: location.x,
                                y: location.y + 6,
                                z: location.z + 2,
                            };
                            overworld.spawnEntity('spark_vfx:blizzard_emitter', location);
                        }
                    }
                    else if (biome != BIOMES.desert && biome != BIOMES.savanna && biome != BIOMES.mesa && isEffectEnabled('intense_rain')) {
                        overworld.spawnParticle('spark_vfx:light_rain_drizzle', player.location);
                        overworld.spawnParticle('spark_vfx:light_wind_gust', player.location);
                    }
                }
            }
        });
        if (GlobalValues.weather != WeatherType.Clear) {
            WorldtimeScoreboard.setScore('sunny', -10);
        }
        else {
            WorldtimeScoreboard.addScore('sunny', 1);
        }
        let sunny_time = WorldtimeScoreboard.getScore('sunny');
        if (sunny_time == -2 && GlobalValues.time_of_day < 12000 && isEffectEnabled('rainbows')) {
            let direction = GlobalValues.time_of_day < 5900 ? -1 : 1;
            overworld.runCommandAsync(`execute at @r[scores={spark_vfx.dimension=0,spark_vfx.biome=!2}] positioned ~${140 * direction} ~ ~ run function spark/vfx/events/rainbow`);
        }
    }
    world.getAllPlayers().forEach(player => {
        if (!player || !player.isValid() || !isBlockLoaded(player.location, player.dimension))
            return;
        let was_in_sandstorm = player.hasTag('spark_vfx.in_sandstorm');
        let in_sandstorm = false;
        if (GlobalValues.weather != WeatherType.Clear && player.dimension.id == 'minecraft:overworld') {
            if (!isUnderGround(player) && !isUnderWater(player) && isEffectEnabled('sandstorms')) {
                let biome = getPlayerBiome(player);
                if (biome == BIOMES.desert) {
                    in_sandstorm = true;
                    if (player.hasTag('spark_vfx.particle_spawner_15')) {
                        overworld.spawnParticle('spark_vfx:sandstorm', player.location);
                        overworld.spawnParticle('spark_vfx:sandstorm_sweep', player.location);
                        if (Math.random() < 0.1 && isEffectEnabled('tumbleweeds') && isBlockLoaded(player.location, overworld)) {
                            let tumbleweed = overworld.spawnEntity('spark_vfx:tumbleweed', player.location);
                            tumbleweed.addEffect('invisibility', 15, { showParticles: false });
                            tumbleweed.runCommandAsync('spreadplayers ~-30 ~-30 1 40 @s');
                        }
                    }
                }
            }
        }
        if (slow_tick == 10 && was_in_sandstorm != in_sandstorm) {
            if (in_sandstorm) {
                player.addTag('spark_vfx.in_sandstorm');
                player.runCommandAsync('fog @s push spark_vfx:fog_sandstorm spark_vfx.sandstorm');
            }
            else {
                player.removeTag('spark_vfx.in_sandstorm');
                player.runCommandAsync(`fog @s remove spark_vfx.sandstorm`);
            }
        }
    });
    // Player Animations + Effects
    if (isEffectEnabled('swimming_trails')) {
        overworld.getPlayers().forEach(player => {
            if (!player || !player.isValid() || !player.isInWater)
                return;
            let block_location = player.location;
            block_location.y += 2.1;
            let block_top;
            try {
                block_top = overworld.getBlock(block_location);
            }
            catch (err) {
                return;
            }
            if (!block_top.isValid())
                return;
            if (block_top.isAir) {
                let location = {
                    x: player.location.x,
                    y: Math.round(player.location.y + 0.6),
                    z: player.location.z
                };
                if (player.isSwimming) {
                    overworld.spawnParticle('spark_vfx:swimming_trail', location);
                }
                if (Math.random() < 0.2) {
                    location.x += randomAB(-1, 1);
                    location.z += randomAB(-1, 1);
                    overworld.spawnParticle('spark_vfx:splash_ripple', location);
                }
            }
            else if (Math.random() < 0.2) {
                overworld.spawnParticle('spark_vfx:swimming_trail_bubbles', player.location);
            }
        });
    }
    // Tumbleweed
    overworld.getEntities({ type: 'spark_vfx:tumbleweed' }).forEach(tumbleweed => {
        if (!tumbleweed.isValid())
            return;
        let velocity = tumbleweed.getVelocity();
        if (((velocity.x < 0 || velocity.z < 0) && Math.random() < 0.005) ||
            ((velocity.x == 0 && velocity.z == 0) && Math.random() < 0.001) ||
            tumbleweed.isInWater) {
            overworld.runCommandAsync(`particle spark_vfx:tumbleweed_break ${tumbleweed.location.x} ${tumbleweed.location.y} ${tumbleweed.location.z}`);
            tumbleweed.remove();
            return;
        }
        let speed = 0.03 * (tumbleweed.getProperty('spark_vfx:wind_effect') || 1) * GlobalValues.wind_intensity;
        if (speed > 0.015) {
            tumbleweed.applyImpulse({
                x: speed * (1 + (Math.random() - 0.5) * 2.0),
                y: 0,
                z: speed * 1.12
            });
        }
    });
    // Lens flare
    let is_day_time = GlobalValues.time_of_day < 12800 || GlobalValues.time_of_day > 23200;
    if (GlobalValues.weather == WeatherType.Clear && ((is_day_time && isEffectEnabled('sun_lens_flare')) || (!is_day_time && isEffectEnabled('moon_lens_flare')))) {
        let flare_angle = 0, variant = 'day';
        if (is_day_time) {
            let sun_time = (((GlobalValues.time_of_day + 6000) % 24000) - 12000);
            flare_angle = SUN_LOOKUP_TABLE.get(Math.abs(sun_time)) * Math.sign(sun_time) / 12000 * Math.PI;
            if (Math.abs(sun_time) > 6000) {
                variant = 'sunset';
            }
        }
        else {
            let moon_time = (((GlobalValues.time_of_day + 6000 + 12000) % 24000) - 12000);
            flare_angle = MOON_LOOKUP_TABLE.get(Math.abs(moon_time)) * Math.sign(moon_time) / 12000 * Math.PI;
            variant = 'moon';
        }
        let transition_speed = 0.03;
        let transition_fade = Math.max(0, 1 - Math.abs(GlobalValues.time_of_day - 12800) * transition_speed, 1 - Math.abs(GlobalValues.time_of_day - 23200) * transition_speed);
        let distance = 55;
        let offset = {
            x: -Math.sin(flare_angle) * distance,
            y: Math.cos(flare_angle) * distance,
            z: 0,
        };
        overworld.getEntities({ type: 'spark_vfx:lens_flare' }).forEach(entity => {
            if (!entity.isValid())
                return;
            entity.remove();
        });
        overworld.getPlayers().forEach(player => {
            var _a;
            if (!player.isValid())
                return;
            let eye = {
                x: player.location.x,
                y: player.location.y + (player.isSneaking ? 1.3 : 1.6),
                z: player.location.z,
            };
            eye.y = lerp((_a = lens_flare_smooth_y[player.id]) !== null && _a !== void 0 ? _a : eye.y, eye.y, 0.2);
            lens_flare_smooth_y[player.id] = eye.y;
            if (lens_flare_smooth_opacity[player.id] == undefined)
                lens_flare_smooth_opacity[player.id] = 0;
            let ray = overworld.getBlockFromRay(eye, offset, {
                includeLiquidBlocks: true,
                includePassableBlocks: false,
                maxDistance: 120
            });
            let is_blocked = ray && ray.block && ray.block.isValid() && !ray.block.isAir;
            let target_opacity = (is_blocked ? 0 : 1);
            let opacity = lens_flare_smooth_opacity[player.id] = lerp(lens_flare_smooth_opacity[player.id], target_opacity, 0.5);
            opacity *= (1 - transition_fade);
            if (opacity < 0.05) {
                return;
            }
            try {
                let opacity_step = Math.round(opacity * 20);
                let entity = overworld.spawnEntity(`spark_vfx:lens_flare<spark_vfx:${variant}_o_${opacity_step}>`, Vector.add(eye, offset));
                if (!entity || !entity.isValid()) {
                    return;
                }
                let velocity = player.getVelocity();
                entity.applyImpulse(velocity);
            }
            catch (err) {
            }
        });
    }
    else {
        overworld.getEntities({ type: 'spark_vfx:lens_flare' }).forEach(entity => {
            if (!entity.isValid())
                return;
            entity.remove();
        });
    }
}
export function runBirdEvent(player, position, dimension, force) {
    if (!force) {
        let block = dimension.getBlock(position);
        if (!block || !block.isValid() || block.isAir)
            return;
        if (!(block.permutation.matches('minecraft:grass') ||
            block.permutation.matches('minecraft:leaves') ||
            block.permutation.matches('minecraft:leaves2')))
            return;
    }
    dimension.runCommandAsync(`playsound sound.spark_vfx.bird_event @a ${position.x} ${position.y} ${position.z} 2`);
    let variables = new MolangVariableMap();
    let player_offset = [
        player.location.x - position.x,
        player.location.z - position.z,
    ];
    variables.setFloat('rotation', Math.atan2(player_offset[1], -player_offset[0]) / Math.PI * 180 + randomAB(-70, 70));
    dimension.spawnParticle('spark_vfx:bird_event', position, variables);
}
function getPlayerBiome(player) {
    if (player.isValid() && BiomeScoreboard.hasParticipant(player)) {
        return BiomeScoreboard.getScore(player);
    }
    else {
        return 0;
    }
}
world.beforeEvents.explosion.subscribe((event) => {
    if (!event.source)
        return;
    if (!isEffectEnabled('explosions'))
        return;
    try {
        let location = event.source.location;
        system.runTimeout(() => {
            event.dimension.spawnParticle('spark_vfx:explosion_main', location);
        }, 0);
    }
    catch (err) {
    }
});
world.afterEvents.weatherChange.subscribe((event) => {
    GlobalValues.weather = event.newWeather;
});
world.afterEvents.entitySpawn.subscribe(({ entity, cause }) => {
    if (!isEffectEnabled('tumbleweeds') && entity.typeId == 'spark_vfx:tumbleweed' && entity.isValid() && cause == EntityInitializationCause.Spawned) {
        entity.remove();
    }
});
//# sourceMappingURL=vfx.js.map