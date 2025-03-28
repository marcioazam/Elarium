import { system, world } from "@minecraft/server";
import { vfxTick } from "./vfx/vfx";
import { tickEmitterBlocks } from "./creative/emitter_block";
import './creative/trigger_items';
import { AmbientSound } from "./ambient_sound";
import './settings';
import { Guidebook } from "./guidebook";
import { weatherSoundTick } from "./vfx/weather_sound";
import { DynamicLight } from "./dynamic_light";
const ambientSoundSystem = new AmbientSound.AmbientSoundSystem();
const dynamicLight = new DynamicLight();
// guidebook on join
Guidebook.init({
    entityId: "spark_vfx:guide_book",
    itemId: "spark_vfx:guide_book_spawn_egg",
    joinString: "spark_vfx.chat.is_active",
    tag: "spark_vfx:has_joined_before",
    additionalItems: ['spark_vfx:settings_menu']
});
function init() {
    let overworld = world.getDimension("overworld");
    overworld.runCommand('function spark/vfx/setup');
    system.run(internalAutoRunTick);
}
function tick() {
    let overworld = world.getDimension("overworld");
    vfxTick();
    tickEmitterBlocks();
    dynamicLight.tick();
    ambientSoundSystem.tick();
    weatherSoundTick(overworld);
}
function internalAutoRunTick() {
    system.run(internalAutoRunTick);
    tick();
}
init();
//# sourceMappingURL=main.js.map