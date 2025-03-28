import { MolangVariableMap, system } from "@minecraft/server";
import { isBlockLoaded } from "../util/util";
import { Vector } from "../util/vector";
const SplashSizes = {
    'minecraft:item': 1,
    'minecraft:rabbit': 1,
    'minecraft:bat': 1,
    'minecraft:pufferfish': 1,
    'minecraft:salmon': 1,
    'minecraft:cod': 1,
    'minecraft:tropicalfish': 1,
    'minecraft:ravager': 3,
    'minecraft:polar_bear': 3,
    'minecraft:panda': 3,
    'minecraft:iron_golem': 3,
    'minecraft:spider': 3,
    'minecraft:sniffer': 3,
    'minecraft:camel': 3,
    'minecraft:turtle': 3,
};
let falling_entities = {};
function entitySplashEffect(entity, velocity) {
    let location = entity.location;
    location.y = Math.round(location.y - Math.max(velocity * 1, -2)) - 0.0;
    let ray = entity.dimension.getBlockFromRay(location, Vector.down, { includeLiquidBlocks: true, maxDistance: 20 });
    if (ray && ray.block) {
        location.y = ray.block.location.y + 0.98;
    }
    system.runTimeout(() => {
        if (!entity.isValid() || !isBlockLoaded(location, entity.dimension))
            return;
        let size = SplashSizes[entity.typeId] || 2;
        if (entity.typeId == 'minecraft:slime') {
            let component = entity.getComponent('minecraft:variant');
            if (component)
                size = component.value == 4 ? 3 : component.value;
        }
        let height = velocity < -0.8 ? 'tall' : (velocity < -0.55 ? 'mid' : 'low');
        let variables = new MolangVariableMap();
        variables.setFloat('speed', -velocity);
        variables.setFloat('radius', size == 1 ? 0.25 : (size == 2 ? 0.5 : 1));
        if (size == 1) {
            entity.dimension.spawnParticle('spark_vfx:splash_ripple_sides_small', location, variables);
            entity.dimension.spawnParticle(`spark_vfx:splash_sides_small`, location, variables);
        }
        else if (size == 2) {
            entity.dimension.spawnParticle('spark_vfx:splash_ripple_sides_medium', location, variables);
            entity.dimension.spawnParticle(`spark_vfx:splash_sides_medium_${height}`, location, variables);
        }
        else if (size == 3) {
            entity.dimension.spawnParticle('spark_vfx:splash_ripple_sides_large', location, variables);
            entity.dimension.spawnParticle(`spark_vfx:splash_sides_large_${height}`, location, variables);
        }
        entity.dimension.spawnParticle('spark_vfx:splash_droplets', location, variables);
    }, Math.round(Math.min(velocity * -4 - 1, 5)));
}
export function splashTick(overworld) {
    overworld.getEntities().forEach(entity => {
        let velocity = entity.getVelocity();
        if (velocity.y < -0.25) {
            if (falling_entities[entity.id] === false && entity.isInWater) {
                entitySplashEffect(entity, velocity.y);
            }
            falling_entities[entity.id] = entity.isInWater;
        }
        else if (falling_entities[entity.id] !== undefined) {
            delete falling_entities[entity.id];
        }
    });
}
//# sourceMappingURL=splash.js.map