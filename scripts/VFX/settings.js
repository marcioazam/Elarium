import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { getOrCreateScoreboard } from "./util/util";
import { AmbientSound } from "./ambient_sound";
const settingsScoreboard = getOrCreateScoreboard('spark_vfx.settings');
const Categories = {
    ambient: {
        icon: 'textures/spark/vfx/ui/settings_icon/ambient',
        settings: {
            leaves: {},
            snowflakes: {},
            fireflies: {},
            butterflies: {},
            flies: {},
            startled_birds: {},
            cave_dust: {},
            end_glow: {},
            end_dust: {},
            desert_sand: {},
        }
    },
    sky: {
        icon: 'textures/spark/vfx/ui/settings_icon/sky',
        settings: {
            birds: {},
            shooting_stars: {},
            meteor_showers: {},
            rainbows: {},
            northern_lights: {},
        }
    },
    weather: {
        icon: 'textures/spark/vfx/ui/settings_icon/weather',
        settings: {
            intense_rain: {},
            snowstorms: {},
            sandstorms: {},
            ground_fog: {},
            visible_wind: {},
        }
    },
    water: {
        icon: 'textures/spark/vfx/ui/settings_icon/water',
        settings: {
            splashes: {},
            swimming_trails: {},
            water_godrays: {},
            water_bubbles: {},
            raindrop_ripples: {},
        }
    },
    other: {
        icon: 'textures/spark/vfx/ui/settings_icon/special',
        settings: {
            sun_lens_flare: {},
            moon_lens_flare: {},
            explosions: {},
            tumbleweeds: {},
            dynamic_lights: {},
            immersive_sound: {},
        }
    },
};
// Set default values
for (let category_id in Categories) {
    for (let id in Categories[category_id].settings) {
        if (!settingsScoreboard.hasParticipant(id)) {
            settingsScoreboard.setScore(id, 1);
        }
    }
}
// Main Menu
function showMainMenu(player, returned) {
    if (!returned)
        player.playSound('sound.spark_vfx.settings_enter');
    let form = new ActionFormData();
    form.title({ rawtext: [{ translate: 'spark_vfx.ui.settings.title' }] });
    for (let category_id in Categories) {
        form.button({ rawtext: [{ translate: `spark_vfx.ui.settings.category.${category_id}` }] }, Categories[category_id].icon);
    }
    form.show(player).then(response => {
        if (response.canceled)
            return;
        let chosen_category = Object.keys(Categories)[response.selection];
        if (chosen_category) {
            showCategoryMenu(chosen_category, player);
        }
    });
}
// Category Page
function showCategoryMenu(category_id, player) {
    let category = Categories[category_id];
    let form = new ModalFormData();
    form.title({ rawtext: [{ translate: `spark_vfx.ui.settings.category.${category_id}` }, { text: ' - ' }, { translate: 'spark_vfx.ui.settings.page_text' }] });
    let i = 0;
    for (let id in category.settings) {
        let value = settingsScoreboard.getScore(id) != 0;
        let rawtext = [{ translate: `spark_vfx.ui.settings.setting.${id}` }];
        /*if (i == 0) {
            let page_text: RawMessage[] = [
                {text: '\n'},
                {translate: 'spark_vfx.ui.settings.page_text'},
                {text: '\n\n'}
            ];
            rawtext.splice(0, 0, ...page_text);
        }*/
        form.toggle({ rawtext }, value);
        i++;
    }
    form.show(player).then(response => {
        if (response.canceled || !response.formValues)
            return;
        let ids = Object.keys(category.settings);
        for (let id in category.settings) {
            let index = ids.indexOf(id);
            settingsScoreboard.setScore(id, response.formValues[index] ? 1 : 0);
            // possible sound hook
            if (id === 'immersive_sound') {
                response.formValues[index] ? AmbientSound.AmbientSoundSystem.setEnable() : AmbientSound.AmbientSoundSystem.setDisable();
            }
        }
        showMainMenu(player, true);
    });
}
// Item interact
world.afterEvents.itemUse.subscribe((event) => {
    if (event.itemStack.typeId == 'spark_vfx:settings_menu') {
        showMainMenu(event.source);
    }
});
export function isEffectEnabled(id) {
    return settingsScoreboard.getScore(id) != 0;
}
//# sourceMappingURL=settings.js.map