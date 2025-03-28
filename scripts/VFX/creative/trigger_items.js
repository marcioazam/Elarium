import { MolangVariableMap, WeatherType, world } from "@minecraft/server";
import { getHighestPoint, getOrCreateScoreboard, randomAB, sendUsageWarningMessage } from "../util/util";
import { GlobalValues } from "../vfx/global_values";
import { runBirdEvent } from "../vfx/vfx";
import biomes from "../vfx/biomes";
let biome_scoreboard = getOrCreateScoreboard('spark_vfx.biome');
function getPlayerBiome(player) {
    return biome_scoreboard.getScore(player) || 0;
}
world.afterEvents.itemUse.subscribe((event) => {
    if (!event.itemStack.typeId.startsWith('spark_vfx:trigger_'))
        return;
    let player = event.source;
    let dimension = player.dimension;
    let effect_id = event.itemStack.typeId.replace('spark_vfx:trigger_', '');
    let spawn_location;
    let look_at_block = player.getBlockFromViewDirection({ includePassableBlocks: false, maxDistance: 4 });
    if (look_at_block) {
        spawn_location = {
            x: look_at_block.block.location.x + look_at_block.faceLocation.x,
            y: look_at_block.block.location.y + look_at_block.faceLocation.y,
            z: look_at_block.block.location.z + look_at_block.faceLocation.z,
        };
    }
    else {
        let face_direction = player.getViewDirection();
        let head_pos = player.getHeadLocation();
        let dis = 1.6;
        spawn_location = {
            x: head_pos.x + face_direction.x * dis,
            y: head_pos.y + face_direction.y * dis,
            z: head_pos.z + face_direction.z * dis,
        };
    }
    let successful = true;
    switch (effect_id) {
        case 'startled_birds': {
            let face_direction = player.getViewDirection();
            let head_pos = player.getHeadLocation();
            let dis = randomAB(8, 9);
            spawn_location = {
                x: head_pos.x + face_direction.x * dis + randomAB(-7, 7),
                y: head_pos.y + 12,
                z: head_pos.z + face_direction.z * dis + randomAB(-7, 7),
            };
            spawn_location.y = getHighestPoint(dimension, spawn_location, true, false, spawn_location.y).y;
            runBirdEvent(player, spawn_location, dimension, true);
            break;
        }
        case 'tumbleweed': {
            if (player.dimension.getEntities({ location: spawn_location, maxDistance: 3, type: 'spark_vfx:tumbleweed' }).length == 0) {
                successful = false;
            }
            break;
        }
        case 'flies': {
            let variables = new MolangVariableMap();
            variables.setFloat('rate', 6);
            spawn_location.y += 0.3;
            dimension.spawnParticle('spark_vfx:flies', spawn_location, variables);
            player.playSound('sound.spark_vfx.flies', { location: spawn_location, volume: 1.2 });
            break;
        }
        case 'fireflies': {
            let variables = new MolangVariableMap();
            variables.setFloat('rate', 6);
            spawn_location.y += 0.3;
            dimension.spawnParticle('spark_vfx:fireflies', spawn_location, variables);
            break;
        }
        case 'aurora': {
            player.runCommandAsync('scoreboard players set northern_lights spark_vfx.worldtime 128');
            player.runCommandAsync('function spark/vfx/events/northern_lights');
            break;
        }
        case 'birds': {
            let variables = new MolangVariableMap();
            variables.setFloat('spawn_direction', (randomAB(-44, 44) - player.getRotation().y) / 360);
            let roll = Math.floor(Math.random() * 3.3);
            switch (roll) {
                case 0:
                    dimension.spawnParticle('spark_vfx:sky_goose', spawn_location, variables);
                    break;
                case 1:
                    dimension.spawnParticle('spark_vfx:sky_buzzard', spawn_location, variables);
                    break;
                default:
                    dimension.spawnParticle('spark_vfx:sky_crow', spawn_location, variables);
                    break;
            }
            break;
        }
        case 'butterflies': {
            let variables = new MolangVariableMap();
            variables.setFloat('rate', 7);
            dimension.spawnParticle('spark_vfx:butterflies', spawn_location, variables);
            break;
        }
        case 'leaves': {
            for (let i = 0; i < 14; i++) {
                dimension.spawnParticle('spark_vfx:ambient_leaves_normal', spawn_location);
            }
            break;
        }
        case 'fog': {
            dimension.spawnParticle('spark_vfx:ground_fog_spawn_manual', player.location);
            break;
        }
        case 'shooting_star': {
            player.runCommandAsync('function spark/vfx/events/shooting_star');
            break;
        }
        case 'meteor_shower': {
            dimension.runCommandAsync('scoreboard players random meteor_shower spark_vfx.worldtime 30 60');
            break;
        }
        case 'rainbow': {
            let direction = (GlobalValues.time_of_day % 12000) < 5900 ? -1 : 1;
            player.runCommandAsync(`execute positioned ~${140 * direction} ~ ~ run function spark/vfx/events/rainbow`);
            break;
        }
        case 'rain': {
            if (getPlayerBiome(player) == biomes.desert) {
                sendUsageWarningMessage(player, 'spark_vfx.message.effect_failed_desert');
                successful = false;
            }
            else if (player.dimension.id != 'minecraft:overworld') {
                sendUsageWarningMessage(player, 'spark_vfx.message.effect_failed_not_overworld');
                successful = false;
            }
            else {
                dimension.setWeather(WeatherType.Rain);
            }
            break;
        }
        case 'thunderstorm': {
            if (getPlayerBiome(player) == biomes.desert) {
                sendUsageWarningMessage(player, 'spark_vfx.message.effect_failed_desert');
                successful = false;
            }
            else if (player.dimension.id != 'minecraft:overworld') {
                sendUsageWarningMessage(player, 'spark_vfx.message.effect_failed_not_overworld');
                successful = false;
            }
            else {
                dimension.setWeather(WeatherType.Thunder);
            }
            break;
        }
        case 'sand_storm': {
            if (getPlayerBiome(player) == biomes.desert) {
                dimension.setWeather(WeatherType.Rain);
            }
            else {
                sendUsageWarningMessage(player, 'spark_vfx.message.effect_failed_not_desert');
                successful = false;
            }
            break;
        }
        case 'snow_storm': {
            if (getPlayerBiome(player) == biomes.frozen) {
                dimension.setWeather(WeatherType.Thunder);
            }
            else {
                sendUsageWarningMessage(player, 'spark_vfx.message.effect_failed_not_frozen');
                successful = false;
            }
            break;
        }
    }
    if (successful) {
        player.playSound('sound.spark_vfx.trigger');
    }
});
//# sourceMappingURL=trigger_items.js.map