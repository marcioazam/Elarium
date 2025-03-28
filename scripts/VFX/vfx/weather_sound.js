import { WeatherType } from "@minecraft/server";
import { getOrCreateScoreboard, isUnderGround } from "../util/util";
import { GlobalValues } from "./global_values";
import BIOMES from './biomes';
const WeatherSoundTimers = {};
const LoopDuration = 5.5 * 20;
const BiomeScoreboard = getOrCreateScoreboard('spark_vfx.biome');
function playWeatherSound(player, starting) {
    let biome = BiomeScoreboard.getScore(player);
    let weather = GlobalValues.weather;
    if (weather == WeatherType.Clear)
        return;
    if (biome == BIOMES.frozen && weather == WeatherType.Thunder) {
        // Blizzard
        if (starting) {
            player.playSound('sound.spark_vfx.blizzard_start');
        }
        else {
            player.playSound('sound.spark_vfx.blizzard_loop');
        }
    }
    else if (biome == BIOMES.desert) {
        // Sandstorm
        if (starting) {
            player.playSound('sound.spark_vfx.sandstorm_start');
        }
        else {
            player.playSound('sound.spark_vfx.sandstorm_loop');
        }
    }
    else if (biome != BIOMES.mesa && weather == WeatherType.Thunder) {
        // Thunderstorm
        if (starting) {
            player.playSound('sound.spark_vfx.thunderstorm_start');
        }
        else {
            player.playSound('sound.spark_vfx.thunderstorm_loop');
        }
    }
}
let weather_system_enabled = false;
export function weatherSoundTick(overworld) {
    if (GlobalValues.weather == WeatherType.Clear) {
        if (weather_system_enabled) {
            weather_system_enabled = false;
            for (let key in WeatherSoundTimers) {
                delete WeatherSoundTimers[key];
            }
        }
        return;
    }
    weather_system_enabled = true;
    let players = overworld.getPlayers();
    for (let player of players) {
        if (player.location.y < 60 && isUnderGround(player))
            continue;
        let starting = false;
        if (WeatherSoundTimers[player.id] == undefined) {
            WeatherSoundTimers[player.id] = 0;
            starting = true;
        }
        WeatherSoundTimers[player.id] += 1;
        if (WeatherSoundTimers[player.id] >= LoopDuration || starting) {
            playWeatherSound(player, starting);
            WeatherSoundTimers[player.id] = 0;
        }
    }
}
//# sourceMappingURL=weather_sound.js.map