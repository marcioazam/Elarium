import { world, system, ItemStack, EntityEquippableComponent, EntityInventoryComponent, EquipmentSlot, EntityHealthComponent, EntityDamageCause, ItemEnchantableComponent, GameMode, EnchantmentTypes, ItemDurabilityComponent, EntityProjectileComponent, EntityRideableComponent, BlockPermutation, EntityLeashableComponent, EntityItemComponent, BlockInventoryComponent } from '@minecraft/server';
import { MessageFormData, ModalFormData, ActionFormData } from '@minecraft/server-ui';
import { PlayersInGame } from '../Events/Player_Event.js'

const setting_registry = [
    {
        id: "reduce_validations",
        type: "boolean",
        default: false,
        value: false,
    },
    {
        id: "addon_integration",
        type: "boolean",
        default: true,
        value: true,
    },
    {
        id: "particles",
        type: "boolean",
        default: true,
        value: true,
    },
    {
        id: "double_jump",
        type: "boolean",
        default: true,
        value: true,
    },
    {
        id: "slower_double_click",
        type: "boolean",
        default: false,
        value: false,
    },
    {
        id: "explorer_exp_bar",
        type: "boolean",
        default: true,
        value: true,
    },
    {
        id: "explosion_damage",
        type: "boolean",
        default: true,
        value: true,
    },
    {
        id: "fire_damage",
        type: "boolean",
        default: true,
        value: true,
    },
    {
        id: "ability_unlock_message",
        type: "boolean",
        default: true,
        value: true,
    },
    {
        id: "announce_level_up",
        type: "boolean",
        default: true,
        value: true,
    },
    {
        id: "abilities_target_players",
        type: "boolean",
        default: true,
        value: true,
    },
];
class Settings {
    prefix;
    constructor(prefix) {
        this.prefix = prefix;
        this.load();
    }
    load = () => {
        for (const setting of setting_registry) {
            const value = world.getDynamicProperty(this.prefix + "_" + setting.id);
            setting.value = value === undefined ? setting.default : value;
        }
    };
    getSettingObject = (settingId) => {
        return setting_registry.find((v) => v.id === settingId);
    };
    getValue = (settingId) => {
        const setting = this.getSettingObject(settingId);
        if (setting === undefined)
            return undefined;
        const value = setting.value !== undefined ? setting.value : setting.default;
        switch (setting.type) {
            case "enum":
                return setting.options ? setting.options[value] : value;
            default:
                return value;
        }
    };
    setValue = (setting, value) => {
        if (typeof setting === "string") {
            const settingFound = this.getSettingObject(setting);
            if (settingFound === undefined)
                return;
            setting = settingFound;
        }
        setting = setting;
        if (setting === undefined)
            return;
        if (setting.type === "boolean" && typeof value !== "boolean")
            return;
        if (setting.type === "enum" && typeof value !== "number")
            return;
        if (setting.onChange !== undefined)
            setting.onChange(this.getValue(setting.id), value);
        setting.value = value;
        world.setDynamicProperty(this.prefix + "_" + setting.id, value);
    };
    booleanSwitch = (setting) => {
        this.setValue(setting, !this.getValue(setting));
    };
}
async function showSettingsDisclaimer(player, settings) {
    if (player.getDynamicProperty("ignore_settings_disclaimer") === true) {
        showSettingsMenu(player, settings);
    }
    else {
        const form = new MessageFormData();
        form.title({ translate: `pod_rpg.settings.title` });
        form.body({ translate: `pod_rpg.settings.disclaimer`, with: ["\n"] });
        form.button1({ translate: `pod_rpg.settings.disclaimer.confirm_ignore` });
        form.button2({ translate: `pod_rpg.settings.disclaimer.confirm` });
        const response = await form.show(player);
        if (response.canceled)
            return;
        if (response.selection === 0) {
            player.setDynamicProperty("ignore_settings_disclaimer", true);
        }
        showSettingsMenu(player, settings);
    }
}
async function showSettingsMenu(player, settings) {
    const form = new ModalFormData();
    form.title({ rawtext: [{ translate: "pod_rpg.settings.title" }] });
    const listedSettings = [];
    for (const setting of setting_registry) {
        const value = settings.getValue(setting.id);
        if (value === undefined)
            continue;
        const text = {
            rawtext: [{ translate: `pod_rpg.setting.${setting.id}` }],
        };
        switch (setting.type) {
            case "boolean":
                form.toggle(text, value);
                break;
            case "enum":
                form.dropdown(text, setting.options, setting.value);
                break;
            case "number":
                form.slider(text, setting.numberOptions.range[0], setting.numberOptions.range[1], setting.numberOptions.steps, value);
        }
        listedSettings.push(setting);
    }
    form.submitButton({ translate: "pod_rpg.settings.save_button" });
    const response = await form.show(player);
    if (!response.formValues) {
        player.sendMessage({ translate: "pod_rpg.settings.cancel" });
        return;
    }
    for (let i = 0; i < listedSettings.length; i++) {
        const value = response.formValues[i];
        if (value === undefined)
            continue;
        settings.setValue(listedSettings[i], value);
    }
}
const settings = new Settings("pod_rpg_setting");

const currentBar = {
    priority: 1000,
    since: 0,
};
/**
 * Displays an ActionBar to a player using priorities
 * @param player Player that receives the Action Bar
 * @param text RawMessage that is displayed to the Player
 * @param priority Priority at which the action bar is displayed. Defaults to 1. Useful in projects where the action bar is used a lot
 */
function displayActionBar(player, text, priority = 1) {
    // currentBar.priority += Math.max(0, system.currentTick - currentBar.since - 2);
    // if (priority <= currentBar.priority) {
    //     player.onScreenDisplay.setActionBar(text);
    //     currentBar.priority = priority;
    //     currentBar.since = system.currentTick;
    // }
}
/**
 * Returns a Progress Bar string formatted for the minecraft chat, that can be used as indication for health bars, progress bars, etc.
 * @param filled Bit that is colored of the rendered bar
 * @param max Length of the bar
 * @param barOptions Additional settings such as color, length, etc.
 * @returns Progress Bar string formatted for the minecraft cha
 */
function getRenderableBar(filled, max, barOptions) {
    const barFilled = Math.ceil((filled / max) * (barOptions?.barLength || 30));
    return ((barOptions?.filledColor) +
        "|".repeat(barOptions?.barLength || 30).substring(0, barFilled) +
        (barOptions?.emptyColor) +
        "|".repeat(barOptions?.barLength || 30).substring(barFilled));
}
/**
 * Displays a title to a player.
 * @param player The player to display the title to
 * @param title The title
 * @param subtitle The subtitle
 * @param options The Title Display Options
 */
function displayTitle(player, title = "", subtitle = "", options) {
    player.onScreenDisplay.updateSubtitle(subtitle);
    player.onScreenDisplay.setTitle(title);
}

/**
 * Spawns particle in the specified dimension
 * @param dimension
 * @param location
 * @param particleName
 */
function spawnParticle(dimension, location, particleName) {
    dimension.spawnParticle(particleName, location);
}

/*
const buttonExample = {
  text: String | RawMessage -> {translate: "pod.example"},
  icon: String -> "textures/items/iron_ingot", //can be undefined, button will have no icon then.
  action: function with the player as parameter -> showPage("main", 0, []), //can be any function or undefined. If undefined, the button will close the menu.
};
*/
/**
 * Shows a confirmation screen to a player and performs a specified action if the prompt is accepted.
 *
 * Note: Button2 should be the confirm button usually
 * @param player
 * @param form
 * @param onSuccess
 * @returns whether the prompt was accepted or not
 */
async function showConfirmationScreen(player, form, onSuccess) {
    const response = await form.show(player);
    if (response.canceled || response.selection !== 1)
        return false;
    onSuccess();
    return true;
}
/**
 * Shows a page to a player and adds all specified buttons to it with their actions
 * @param player
 * @param title Title of the page
 * @param body Body of the page
 * @param buttons Buttons as array
 */
const showPage = async (player, title, body, buttons) => {
    if (!buttons || !buttons.length) {
        console.warn(`Failed to show Page: Requires Button.`);
        return;
    }
    const form = new ActionFormData();
    form.title(title);
    form.body(body);
    for (const button of buttons) {
        form.button(button.text, button.icon);
    }
    const response = await form.show(player);
    if (response.canceled || response.selection === undefined)
        return;
    const action = buttons[response.selection].action;
    if (!action)
        return;
    action(player);
};
class RawtextBuilder {
    body;
    constructor() {
        this.body = [];
    }
    /**
     * Adds elements to the body
     * @param elements
     */
    push(...elements) {
        for (const element of elements) {
            if (typeof element === "string" || element instanceof String) {
                this.body.push({ text: element });
            }
            else {
                this.body.push(element);
            }
        }
    }
    /**
     * Adds elements to the body and an empty line after that.
     * @param elements
     */
    pushLine(...elements) {
        this.push(...elements);
        this.push({ text: "§r\n" });
    }
    /**
     * Builds the RawMessage with all elements added to it
     * @returns RawMessage
     */
    build() {
        return { rawtext: this.body };
    }
}

const ABILITY_KEY = "patience";
const fishing_patience_ability = {
    key: ABILITY_KEY,
    unlock_level: 30,
    enableTitle: false,
    description: function (level) {
        return [`${getChance$6(level) * 100}%%`];
    },
};
function handlePatience(player, cooldown, skill) {
    const ability = getSelectedAbility(player, skill);
    if (ability?.key !== "patience")
        return cooldown;
    return Math.ceil(cooldown *
        (1 - getChance$6(getAbilityLevel(player, skill, fishing_patience_ability))));
}
function getChance$6(level) {
    return 0.05 + level * 0.05;
}

class TimerUtil {
    cooldowns;
    onExpire;
    constructor() {
        this.cooldowns = new Map();
        this.onExpire = {};
    }
    /**
     * Check if a specific id is on cooldown
     * @param id
     * @returns true if the id provided is on cooldown. else false
     */
    has(id) {
        return this.get(id) > system.currentTick;
    }
    /**
     * Gets the current cooldown length of an id, or returns 0
     * @param id
     * @returns cooldown length or 0
     */
    get(id) {
        return this.cooldowns.get(id) || 0;
    }
    /**
     * Sets the cooldown of an specific id
     * @param id
     * @param ticks
     */
    set(id, ticks) {
        const runId = this.onExpire[id];
        if (runId !== undefined)
            system.clearRun(runId);
        this.cooldowns.set(id, system.currentTick + ticks);
    }
    /**
     * Enables the cooldown display for a specific player. the cooldown will be displayed in the action bar until the player is no longer on cooldown
     * @param player
     * @param text A function that returns the text, either as {@link RawMessage} or String
     */
    enableDisplay(player, text) {
        // const runId = system.runInterval(() => {
        //     if (!this.has(player.name)) {
        //         player.onScreenDisplay.setActionBar("§r");
        //         system.clearRun(runId);
        //         return;
        //     }
        //     player.onScreenDisplay.setActionBar(text());
        // }, 5);
    }
    /**
     * Specifies a function that should be ran when the cooldown for a speicifc id expires
     * @param id
     * @param func
     */
    setOnExpire(id, func) {
        if (!this.has(id))
            return;
        const runId = system.runTimeout(() => {
            this.onExpire[id] = undefined;
            func();
        }, this.get(id) - system.currentTick);
        this.onExpire[id] = runId;
    }
}
class AbilityTimerUtil extends TimerUtil {
    setPlayer(player, ticks, skill, disallowReduction = false) {
        const ability = getSelectedAbility(player, skill);
        if (ability === undefined)
            return;
        super.set(player.id + skill.key + ability.key, disallowReduction ? ticks : handlePatience(player, ticks, fishing_skill));
        if (skill === undefined)
            return;
        super.setOnExpire(player.name, () => {
            const ability = getSelectedAbility(player, skill);
            if (ability === undefined)
                return;
            displayActionBar(player, {
                rawtext: [
                    ...getAbilityName(ability, skill.secondary_color),
                    { text: " " },
                    { translate: "pod_rpg.common.ability.cooldown.expire" },
                ],
            }, 1);
        });
    }
}
const ABILITY_TIMERS = new AbilityTimerUtil();

const MAX_LEVEL = 100;
const setSelectedAbility = (player, skill, abilityId) => {
    player.setDynamicProperty(`pod_rpg_${skill.key}_ability`, abilityId);
};
const getSelectedAbility = (player, skill) => {
    const i = player.getDynamicProperty(`pod_rpg_${skill.key}_ability`);
    if (i === undefined || i < 0)
        return undefined;
    return skill.abilities[i];
};
const addExp = (player, skill, amount, priority = 3) => {
    if (amount === 0)
        return;
    const exp = (player.getDynamicProperty(`pod_rpg_${skill.key}_exp`) || 0) + amount;
    player.setDynamicProperty(`pod_rpg_${skill.key}_exp`, exp);
    const level = getLevelFromExp(skill, exp);
    const prevLevel = getLevelFromExp(skill, exp - amount);
    //LEVEL CAP 100
    if (prevLevel === MAX_LEVEL)
        return;
    const expForThisLevel = getExpRequiredForLevel(skill, level);
    const expRequired = getExpRequiredForLevel(skill, level + 1) - expForThisLevel;
    if (skill.key !== "explorer" ||
        settings.getValue("explorer_exp_bar") === true) {
        displayActionBar(player, {
            rawtext: [
                ...getSkillName(skill, skill.primary_color),
                {
                    text: `  §8- [${getRenderableExpBar(exp - expForThisLevel, expRequired, 30)}§8] - §gLv. ${level}`,
                },
            ],
        }, priority);
    }
    if (level > prevLevel) {
        if (settings.getValue("announce_level_up") === true && level % 5 === 0) {
            world.sendMessage({
                rawtext: [
                    { text: `§7[` },
                    ...getSkillName(skill, skill.primary_color),
                    { text: `§7] §r` },
                    {
                        translate: "pod_rpg.common.levelup",
                        with: [player.name, `${level}`],
                    },
                ],
            });
        }
        if (settings.getValue("ability_unlock_message") === true) {
            for (const ability of skill.abilities) {
                if (ability.unlock_level > prevLevel && ability.unlock_level <= level) {
                    player.sendMessage({
                        rawtext: [
                            { text: `§7[` },
                            ...getSkillName(skill, skill.primary_color),
                            { text: `§7] ${skill.secondary_color}` },
                            ...getAbilityName(ability),
                            { text: " §r" },
                            { translate: "pod_rpg.common.ability.unlock" },
                        ],
                    });
                }
            }
        }
        player.playSound("random.levelup");
        spawnParticle(player.dimension, player.location, "pod_rpg:levelup");
        displayTitle(player, {
            rawtext: getSkillName(skill, skill.primary_color),
        }, {
            rawtext: [{ text: `§f${prevLevel} §7-> §f${level}` }],
        });
    }
};
function abilityActionBar$1(player, skill, doubleClick, actionKey, status) {
    const ability = getSelectedAbility(player, skill);
    displayActionBar(player, {
        rawtext: [
            ...(ability === undefined
                ? getSkillName(skill, skill.primary_color)
                : getAbilityName(ability, skill.secondary_color)),
            {
                text: ` §8- §a${actionKey} §7- ${doubleClick ? "§a" : "§7"}${actionKey} §8- `,
            },
            ...(getAbilityStatus$1(player, skill, ability)),
        ],
    }, 1);
}
function getAbilityStatus$1(player, skill, ability) {
    if (ability === undefined)
        return [
            { text: "§c" },
            { translate: "pod_rpg.common.ability.non_selected" },
        ];
    if (ability && !ability.onEnable) {
        return [
            { text: "§p" },
            { translate: "pod_rpg.common.ability.always_active" },
        ];
    }
    if (ABILITY_TIMERS.has(player.id + skill.key + ability.key))
        return [
            { text: `§c` },
            {
                translate: "pod_rpg.common.ability.cooldown",
                with: [
                    ((ABILITY_TIMERS.get(player.id + skill.key + ability.key) -
                        system.currentTick) /
                        20).toFixed(1),
                ],
            },
        ];
    return [{ text: "§a" }, { translate: "pod_rpg.common.ability.ready" }];
}
function getRenderableExpBar(exp, expRequired, length) {
    return getRenderableBar(exp, expRequired, {
        barLength: length,
        filledColor: "§a",
        emptyColor: "§7",
    });
}
function getLevelFromExp(skill, exp) {
    return Math.min(Math.floor((-1 + Math.sqrt(1 + 8 * (exp / skill.base_exp))) / 2), MAX_LEVEL);
}
function getLevel(player, skill) {
    return getLevelFromExp(skill, player.getDynamicProperty(`pod_rpg_${skill.key}_exp`) || 0);
}
function getExpRequiredForLevel(skill, level) {
    return (level / 2) * skill.base_exp * (level + 1);
}
function enableAbilityTitle(player, ability, color) {
    displayTitle(player, "§r", {
        rawtext: [
            { text: color },
            ...getAbilityName(ability),
            { text: " " },
            {
                translate: "pod_rpg.common.ability.enable",
            },
        ],
    });
}
function getAbilityName(ability, formatting = "") {
    return [
        { text: formatting },
        { translate: `pod_rpg.abilities.${ability.key}.name` },
    ];
}
function getSkillName(skill, formatting = "") {
    return [
        { text: formatting },
        { translate: `pod_rpg.skills.${skill.key}.name` },
    ];
}
function getAbilityLevel(player, skill, ability) {
    if (Number.isInteger(ability))
        ability = skill.abilities[ability];
    return (player.getDynamicProperty(`pod_rpg_${skill.key}_${ability.key}`) || 0);
}
function dropAdditionalItem(location, dimension, chance, item, item_count) {
    if (chance >= Math.random() * 100) {
        const spawnedItem = dimension.spawnItem(new ItemStack(item, item_count), location);
        spawnParticle(spawnedItem.dimension, spawnedItem.location, "pod_rpg:extra_drop");
        world.playSound("random.pop", spawnedItem.location);
    }
}
function showResetUi(player) {
    const form = new MessageFormData();
    form.title({ rawtext: [{ translate: "pod_rpg.reset.title1" }] });
    form.body({ rawtext: [{ translate: "pod_rpg.reset.disclaimer1" }] });
    form.button1({
        rawtext: [{ translate: "pod_rpg.common.ui.cancel_button" }],
    });
    form.button2({
        rawtext: [{ translate: "pod_rpg.common.ui.continue_button" }],
    });
    showConfirmationScreen(player, form, () => {
        form.title({ rawtext: [{ translate: "pod_rpg.reset.title2" }] });
        form.body({ rawtext: [{ translate: "pod_rpg.reset.disclaimer2" }] });
        form.button2({ rawtext: [{ translate: "pod_rpg.reset.button" }] });
        showConfirmationScreen(player, form, () => player.clearDynamicProperties());
    });
}

class PodcrashEvent {
    listeners;
    constructor() {
        this.listeners = [];
    }
    subscribe(listener) {
        this.listeners.push(listener);
    }
    call(eventData) {
        for (const listener of this.listeners) {
            listener(eventData);
        }
    }
}
/**
   * Usage:
      export const exampleEvent = new PodcrashEvent();
   */

const playerJumpEvent = new PodcrashEvent();
const playerSneakEvent = new PodcrashEvent();
const triggerAbilityEvent = new PodcrashEvent();
const playerShootArrowEvent = new PodcrashEvent();
const addonInstallEvent = new PodcrashEvent();
const playerFishSuccessfulEvent = new PodcrashEvent();
const playerCastFishingHookEvent = new PodcrashEvent();
const playerUncastFishingHookEvent = new PodcrashEvent();
const playerBlockLookedAtChangeEvent = new PodcrashEvent();
const playerEnchantItemEvent = new PodcrashEvent();

/**
 * Randomly selects a value of an array considering a weight
 * @param options Object that has either a weight property (number) or a weight() function that returns a number.
 * @returns
 */
function weightedSelection(options) {
    const weights = [
        options[0].weight === undefined
            ? 1
            : typeof options[0].weight === "number"
                ? options[0].weight
                : options[0].weight(),
    ];
    for (let i = 1; i < options.length; i++) {
        weights[i] =
            options[i].weight === undefined
                ? 1
                : (typeof options[i].weight === "number"
                    ? options[i].weight
                    : options[i].weight()) + weights[i - 1];
    }
    const random = Math.random() * weights[weights.length - 1];
    for (let i = 0; i < weights.length; i++)
        if (weights[i] > random)
            return options[i];
}
/**
 * Chooses random value from array list
 * @param array Array
 * @returns Chosen Value
 */
function randomSelection(array) {
    return array[Math.floor(Math.random() * array.length)];
}
/**
 * Advanced random function. Leave arguments empty for classic random result
 * @param min Minimum value of random (Defaults to 0)
 * @param max Maximum value of random (Defaults to min+1)
 * @param rounded Should the result be rounded?
 * @returns Random Number
 */
function rand(min = 0, max = min + 1, rounded = false) {
    return rounded
        ? Math.round(min + Math.random() * (max - min))
        : min + Math.random() * (max - min);
}

// Vanilla Data for Minecraft Bedrock Edition script APIs
// Project: https://docs.microsoft.com/minecraft/creator/
// Definitions by: Jake Shirley <https://github.com/JakeShirley>
//                 Mike Ammerlaan <https://github.com/mammerla>
//                 Raphael Landaverde <https://github.com/rlandav>

/* *****************************************************************************
   Copyright (c) Microsoft Corporation.
   ***************************************************************************** */
var MinecraftBiomeTypes=(MinecraftBiomeTypes2=>{MinecraftBiomeTypes2["BambooJungle"]="minecraft:bamboo_jungle";MinecraftBiomeTypes2["BambooJungleHills"]="minecraft:bamboo_jungle_hills";MinecraftBiomeTypes2["BasaltDeltas"]="minecraft:basalt_deltas";MinecraftBiomeTypes2["Beach"]="minecraft:beach";MinecraftBiomeTypes2["BirchForest"]="minecraft:birch_forest";MinecraftBiomeTypes2["BirchForestHills"]="minecraft:birch_forest_hills";MinecraftBiomeTypes2["BirchForestHillsMutated"]="minecraft:birch_forest_hills_mutated";MinecraftBiomeTypes2["BirchForestMutated"]="minecraft:birch_forest_mutated";MinecraftBiomeTypes2["CherryGrove"]="minecraft:cherry_grove";MinecraftBiomeTypes2["ColdBeach"]="minecraft:cold_beach";MinecraftBiomeTypes2["ColdOcean"]="minecraft:cold_ocean";MinecraftBiomeTypes2["ColdTaiga"]="minecraft:cold_taiga";MinecraftBiomeTypes2["ColdTaigaHills"]="minecraft:cold_taiga_hills";MinecraftBiomeTypes2["ColdTaigaMutated"]="minecraft:cold_taiga_mutated";MinecraftBiomeTypes2["CrimsonForest"]="minecraft:crimson_forest";MinecraftBiomeTypes2["DeepColdOcean"]="minecraft:deep_cold_ocean";MinecraftBiomeTypes2["DeepDark"]="minecraft:deep_dark";MinecraftBiomeTypes2["DeepFrozenOcean"]="minecraft:deep_frozen_ocean";MinecraftBiomeTypes2["DeepLukewarmOcean"]="minecraft:deep_lukewarm_ocean";MinecraftBiomeTypes2["DeepOcean"]="minecraft:deep_ocean";MinecraftBiomeTypes2["DeepWarmOcean"]="minecraft:deep_warm_ocean";MinecraftBiomeTypes2["Desert"]="minecraft:desert";MinecraftBiomeTypes2["DesertHills"]="minecraft:desert_hills";MinecraftBiomeTypes2["DesertMutated"]="minecraft:desert_mutated";MinecraftBiomeTypes2["DripstoneCaves"]="minecraft:dripstone_caves";MinecraftBiomeTypes2["ExtremeHills"]="minecraft:extreme_hills";MinecraftBiomeTypes2["ExtremeHillsEdge"]="minecraft:extreme_hills_edge";MinecraftBiomeTypes2["ExtremeHillsMutated"]="minecraft:extreme_hills_mutated";MinecraftBiomeTypes2["ExtremeHillsPlusTrees"]="minecraft:extreme_hills_plus_trees";MinecraftBiomeTypes2["ExtremeHillsPlusTreesMutated"]="minecraft:extreme_hills_plus_trees_mutated";MinecraftBiomeTypes2["FlowerForest"]="minecraft:flower_forest";MinecraftBiomeTypes2["Forest"]="minecraft:forest";MinecraftBiomeTypes2["ForestHills"]="minecraft:forest_hills";MinecraftBiomeTypes2["FrozenOcean"]="minecraft:frozen_ocean";MinecraftBiomeTypes2["FrozenPeaks"]="minecraft:frozen_peaks";MinecraftBiomeTypes2["FrozenRiver"]="minecraft:frozen_river";MinecraftBiomeTypes2["Grove"]="minecraft:grove";MinecraftBiomeTypes2["Hell"]="minecraft:hell";MinecraftBiomeTypes2["IceMountains"]="minecraft:ice_mountains";MinecraftBiomeTypes2["IcePlains"]="minecraft:ice_plains";MinecraftBiomeTypes2["IcePlainsSpikes"]="minecraft:ice_plains_spikes";MinecraftBiomeTypes2["JaggedPeaks"]="minecraft:jagged_peaks";MinecraftBiomeTypes2["Jungle"]="minecraft:jungle";MinecraftBiomeTypes2["JungleEdge"]="minecraft:jungle_edge";MinecraftBiomeTypes2["JungleEdgeMutated"]="minecraft:jungle_edge_mutated";MinecraftBiomeTypes2["JungleHills"]="minecraft:jungle_hills";MinecraftBiomeTypes2["JungleMutated"]="minecraft:jungle_mutated";MinecraftBiomeTypes2["LegacyFrozenOcean"]="minecraft:legacy_frozen_ocean";MinecraftBiomeTypes2["LukewarmOcean"]="minecraft:lukewarm_ocean";MinecraftBiomeTypes2["LushCaves"]="minecraft:lush_caves";MinecraftBiomeTypes2["MangroveSwamp"]="minecraft:mangrove_swamp";MinecraftBiomeTypes2["Meadow"]="minecraft:meadow";MinecraftBiomeTypes2["MegaTaiga"]="minecraft:mega_taiga";MinecraftBiomeTypes2["MegaTaigaHills"]="minecraft:mega_taiga_hills";MinecraftBiomeTypes2["Mesa"]="minecraft:mesa";MinecraftBiomeTypes2["MesaBryce"]="minecraft:mesa_bryce";MinecraftBiomeTypes2["MesaPlateau"]="minecraft:mesa_plateau";MinecraftBiomeTypes2["MesaPlateauMutated"]="minecraft:mesa_plateau_mutated";MinecraftBiomeTypes2["MesaPlateauStone"]="minecraft:mesa_plateau_stone";MinecraftBiomeTypes2["MesaPlateauStoneMutated"]="minecraft:mesa_plateau_stone_mutated";MinecraftBiomeTypes2["MushroomIsland"]="minecraft:mushroom_island";MinecraftBiomeTypes2["MushroomIslandShore"]="minecraft:mushroom_island_shore";MinecraftBiomeTypes2["Ocean"]="minecraft:ocean";MinecraftBiomeTypes2["Plains"]="minecraft:plains";MinecraftBiomeTypes2["RedwoodTaigaHillsMutated"]="minecraft:redwood_taiga_hills_mutated";MinecraftBiomeTypes2["RedwoodTaigaMutated"]="minecraft:redwood_taiga_mutated";MinecraftBiomeTypes2["River"]="minecraft:river";MinecraftBiomeTypes2["RoofedForest"]="minecraft:roofed_forest";MinecraftBiomeTypes2["RoofedForestMutated"]="minecraft:roofed_forest_mutated";MinecraftBiomeTypes2["Savanna"]="minecraft:savanna";MinecraftBiomeTypes2["SavannaMutated"]="minecraft:savanna_mutated";MinecraftBiomeTypes2["SavannaPlateau"]="minecraft:savanna_plateau";MinecraftBiomeTypes2["SavannaPlateauMutated"]="minecraft:savanna_plateau_mutated";MinecraftBiomeTypes2["SnowySlopes"]="minecraft:snowy_slopes";MinecraftBiomeTypes2["SoulsandValley"]="minecraft:soulsand_valley";MinecraftBiomeTypes2["StoneBeach"]="minecraft:stone_beach";MinecraftBiomeTypes2["StonyPeaks"]="minecraft:stony_peaks";MinecraftBiomeTypes2["SunflowerPlains"]="minecraft:sunflower_plains";MinecraftBiomeTypes2["Swampland"]="minecraft:swampland";MinecraftBiomeTypes2["SwamplandMutated"]="minecraft:swampland_mutated";MinecraftBiomeTypes2["Taiga"]="minecraft:taiga";MinecraftBiomeTypes2["TaigaHills"]="minecraft:taiga_hills";MinecraftBiomeTypes2["TaigaMutated"]="minecraft:taiga_mutated";MinecraftBiomeTypes2["TheEnd"]="minecraft:the_end";MinecraftBiomeTypes2["WarmOcean"]="minecraft:warm_ocean";MinecraftBiomeTypes2["WarpedForest"]="minecraft:warped_forest";return MinecraftBiomeTypes2})(MinecraftBiomeTypes||{});var MinecraftBlockTypes=(MinecraftBlockTypes2=>{MinecraftBlockTypes2["AcaciaButton"]="minecraft:acacia_button";MinecraftBlockTypes2["AcaciaDoor"]="minecraft:acacia_door";MinecraftBlockTypes2["AcaciaDoubleSlab"]="minecraft:acacia_double_slab";MinecraftBlockTypes2["AcaciaFence"]="minecraft:acacia_fence";MinecraftBlockTypes2["AcaciaFenceGate"]="minecraft:acacia_fence_gate";MinecraftBlockTypes2["AcaciaHangingSign"]="minecraft:acacia_hanging_sign";MinecraftBlockTypes2["AcaciaLeaves"]="minecraft:acacia_leaves";MinecraftBlockTypes2["AcaciaLog"]="minecraft:acacia_log";MinecraftBlockTypes2["AcaciaPlanks"]="minecraft:acacia_planks";MinecraftBlockTypes2["AcaciaPressurePlate"]="minecraft:acacia_pressure_plate";MinecraftBlockTypes2["AcaciaSapling"]="minecraft:acacia_sapling";MinecraftBlockTypes2["AcaciaSlab"]="minecraft:acacia_slab";MinecraftBlockTypes2["AcaciaStairs"]="minecraft:acacia_stairs";MinecraftBlockTypes2["AcaciaStandingSign"]="minecraft:acacia_standing_sign";MinecraftBlockTypes2["AcaciaTrapdoor"]="minecraft:acacia_trapdoor";MinecraftBlockTypes2["AcaciaWallSign"]="minecraft:acacia_wall_sign";MinecraftBlockTypes2["AcaciaWood"]="minecraft:acacia_wood";MinecraftBlockTypes2["ActivatorRail"]="minecraft:activator_rail";MinecraftBlockTypes2["Air"]="minecraft:air";MinecraftBlockTypes2["Allium"]="minecraft:allium";MinecraftBlockTypes2["Allow"]="minecraft:allow";MinecraftBlockTypes2["AmethystBlock"]="minecraft:amethyst_block";MinecraftBlockTypes2["AmethystCluster"]="minecraft:amethyst_cluster";MinecraftBlockTypes2["AncientDebris"]="minecraft:ancient_debris";MinecraftBlockTypes2["Andesite"]="minecraft:andesite";MinecraftBlockTypes2["AndesiteDoubleSlab"]="minecraft:andesite_double_slab";MinecraftBlockTypes2["AndesiteSlab"]="minecraft:andesite_slab";MinecraftBlockTypes2["AndesiteStairs"]="minecraft:andesite_stairs";MinecraftBlockTypes2["AndesiteWall"]="minecraft:andesite_wall";MinecraftBlockTypes2["Anvil"]="minecraft:anvil";MinecraftBlockTypes2["Azalea"]="minecraft:azalea";MinecraftBlockTypes2["AzaleaLeaves"]="minecraft:azalea_leaves";MinecraftBlockTypes2["AzaleaLeavesFlowered"]="minecraft:azalea_leaves_flowered";MinecraftBlockTypes2["AzureBluet"]="minecraft:azure_bluet";MinecraftBlockTypes2["Bamboo"]="minecraft:bamboo";MinecraftBlockTypes2["BambooBlock"]="minecraft:bamboo_block";MinecraftBlockTypes2["BambooButton"]="minecraft:bamboo_button";MinecraftBlockTypes2["BambooDoor"]="minecraft:bamboo_door";MinecraftBlockTypes2["BambooDoubleSlab"]="minecraft:bamboo_double_slab";MinecraftBlockTypes2["BambooFence"]="minecraft:bamboo_fence";MinecraftBlockTypes2["BambooFenceGate"]="minecraft:bamboo_fence_gate";MinecraftBlockTypes2["BambooHangingSign"]="minecraft:bamboo_hanging_sign";MinecraftBlockTypes2["BambooMosaic"]="minecraft:bamboo_mosaic";MinecraftBlockTypes2["BambooMosaicDoubleSlab"]="minecraft:bamboo_mosaic_double_slab";MinecraftBlockTypes2["BambooMosaicSlab"]="minecraft:bamboo_mosaic_slab";MinecraftBlockTypes2["BambooMosaicStairs"]="minecraft:bamboo_mosaic_stairs";MinecraftBlockTypes2["BambooPlanks"]="minecraft:bamboo_planks";MinecraftBlockTypes2["BambooPressurePlate"]="minecraft:bamboo_pressure_plate";MinecraftBlockTypes2["BambooSapling"]="minecraft:bamboo_sapling";MinecraftBlockTypes2["BambooSlab"]="minecraft:bamboo_slab";MinecraftBlockTypes2["BambooStairs"]="minecraft:bamboo_stairs";MinecraftBlockTypes2["BambooStandingSign"]="minecraft:bamboo_standing_sign";MinecraftBlockTypes2["BambooTrapdoor"]="minecraft:bamboo_trapdoor";MinecraftBlockTypes2["BambooWallSign"]="minecraft:bamboo_wall_sign";MinecraftBlockTypes2["Barrel"]="minecraft:barrel";MinecraftBlockTypes2["Barrier"]="minecraft:barrier";MinecraftBlockTypes2["Basalt"]="minecraft:basalt";MinecraftBlockTypes2["Beacon"]="minecraft:beacon";MinecraftBlockTypes2["Bed"]="minecraft:bed";MinecraftBlockTypes2["Bedrock"]="minecraft:bedrock";MinecraftBlockTypes2["BeeNest"]="minecraft:bee_nest";MinecraftBlockTypes2["Beehive"]="minecraft:beehive";MinecraftBlockTypes2["Beetroot"]="minecraft:beetroot";MinecraftBlockTypes2["Bell"]="minecraft:bell";MinecraftBlockTypes2["BigDripleaf"]="minecraft:big_dripleaf";MinecraftBlockTypes2["BirchButton"]="minecraft:birch_button";MinecraftBlockTypes2["BirchDoor"]="minecraft:birch_door";MinecraftBlockTypes2["BirchDoubleSlab"]="minecraft:birch_double_slab";MinecraftBlockTypes2["BirchFence"]="minecraft:birch_fence";MinecraftBlockTypes2["BirchFenceGate"]="minecraft:birch_fence_gate";MinecraftBlockTypes2["BirchHangingSign"]="minecraft:birch_hanging_sign";MinecraftBlockTypes2["BirchLeaves"]="minecraft:birch_leaves";MinecraftBlockTypes2["BirchLog"]="minecraft:birch_log";MinecraftBlockTypes2["BirchPlanks"]="minecraft:birch_planks";MinecraftBlockTypes2["BirchPressurePlate"]="minecraft:birch_pressure_plate";MinecraftBlockTypes2["BirchSapling"]="minecraft:birch_sapling";MinecraftBlockTypes2["BirchSlab"]="minecraft:birch_slab";MinecraftBlockTypes2["BirchStairs"]="minecraft:birch_stairs";MinecraftBlockTypes2["BirchStandingSign"]="minecraft:birch_standing_sign";MinecraftBlockTypes2["BirchTrapdoor"]="minecraft:birch_trapdoor";MinecraftBlockTypes2["BirchWallSign"]="minecraft:birch_wall_sign";MinecraftBlockTypes2["BirchWood"]="minecraft:birch_wood";MinecraftBlockTypes2["BlackCandle"]="minecraft:black_candle";MinecraftBlockTypes2["BlackCandleCake"]="minecraft:black_candle_cake";MinecraftBlockTypes2["BlackCarpet"]="minecraft:black_carpet";MinecraftBlockTypes2["BlackConcrete"]="minecraft:black_concrete";MinecraftBlockTypes2["BlackConcretePowder"]="minecraft:black_concrete_powder";MinecraftBlockTypes2["BlackGlazedTerracotta"]="minecraft:black_glazed_terracotta";MinecraftBlockTypes2["BlackShulkerBox"]="minecraft:black_shulker_box";MinecraftBlockTypes2["BlackStainedGlass"]="minecraft:black_stained_glass";MinecraftBlockTypes2["BlackStainedGlassPane"]="minecraft:black_stained_glass_pane";MinecraftBlockTypes2["BlackTerracotta"]="minecraft:black_terracotta";MinecraftBlockTypes2["BlackWool"]="minecraft:black_wool";MinecraftBlockTypes2["Blackstone"]="minecraft:blackstone";MinecraftBlockTypes2["BlackstoneDoubleSlab"]="minecraft:blackstone_double_slab";MinecraftBlockTypes2["BlackstoneSlab"]="minecraft:blackstone_slab";MinecraftBlockTypes2["BlackstoneStairs"]="minecraft:blackstone_stairs";MinecraftBlockTypes2["BlackstoneWall"]="minecraft:blackstone_wall";MinecraftBlockTypes2["BlastFurnace"]="minecraft:blast_furnace";MinecraftBlockTypes2["BlueCandle"]="minecraft:blue_candle";MinecraftBlockTypes2["BlueCandleCake"]="minecraft:blue_candle_cake";MinecraftBlockTypes2["BlueCarpet"]="minecraft:blue_carpet";MinecraftBlockTypes2["BlueConcrete"]="minecraft:blue_concrete";MinecraftBlockTypes2["BlueConcretePowder"]="minecraft:blue_concrete_powder";MinecraftBlockTypes2["BlueGlazedTerracotta"]="minecraft:blue_glazed_terracotta";MinecraftBlockTypes2["BlueIce"]="minecraft:blue_ice";MinecraftBlockTypes2["BlueOrchid"]="minecraft:blue_orchid";MinecraftBlockTypes2["BlueShulkerBox"]="minecraft:blue_shulker_box";MinecraftBlockTypes2["BlueStainedGlass"]="minecraft:blue_stained_glass";MinecraftBlockTypes2["BlueStainedGlassPane"]="minecraft:blue_stained_glass_pane";MinecraftBlockTypes2["BlueTerracotta"]="minecraft:blue_terracotta";MinecraftBlockTypes2["BlueWool"]="minecraft:blue_wool";MinecraftBlockTypes2["BoneBlock"]="minecraft:bone_block";MinecraftBlockTypes2["Bookshelf"]="minecraft:bookshelf";MinecraftBlockTypes2["BorderBlock"]="minecraft:border_block";MinecraftBlockTypes2["BrainCoral"]="minecraft:brain_coral";MinecraftBlockTypes2["BrainCoralBlock"]="minecraft:brain_coral_block";MinecraftBlockTypes2["BrainCoralFan"]="minecraft:brain_coral_fan";MinecraftBlockTypes2["BrainCoralWallFan"]="minecraft:brain_coral_wall_fan";MinecraftBlockTypes2["BrewingStand"]="minecraft:brewing_stand";MinecraftBlockTypes2["BrickBlock"]="minecraft:brick_block";MinecraftBlockTypes2["BrickDoubleSlab"]="minecraft:brick_double_slab";MinecraftBlockTypes2["BrickSlab"]="minecraft:brick_slab";MinecraftBlockTypes2["BrickStairs"]="minecraft:brick_stairs";MinecraftBlockTypes2["BrickWall"]="minecraft:brick_wall";MinecraftBlockTypes2["BrownCandle"]="minecraft:brown_candle";MinecraftBlockTypes2["BrownCandleCake"]="minecraft:brown_candle_cake";MinecraftBlockTypes2["BrownCarpet"]="minecraft:brown_carpet";MinecraftBlockTypes2["BrownConcrete"]="minecraft:brown_concrete";MinecraftBlockTypes2["BrownConcretePowder"]="minecraft:brown_concrete_powder";MinecraftBlockTypes2["BrownGlazedTerracotta"]="minecraft:brown_glazed_terracotta";MinecraftBlockTypes2["BrownMushroom"]="minecraft:brown_mushroom";MinecraftBlockTypes2["BrownMushroomBlock"]="minecraft:brown_mushroom_block";MinecraftBlockTypes2["BrownShulkerBox"]="minecraft:brown_shulker_box";MinecraftBlockTypes2["BrownStainedGlass"]="minecraft:brown_stained_glass";MinecraftBlockTypes2["BrownStainedGlassPane"]="minecraft:brown_stained_glass_pane";MinecraftBlockTypes2["BrownTerracotta"]="minecraft:brown_terracotta";MinecraftBlockTypes2["BrownWool"]="minecraft:brown_wool";MinecraftBlockTypes2["BubbleColumn"]="minecraft:bubble_column";MinecraftBlockTypes2["BubbleCoral"]="minecraft:bubble_coral";MinecraftBlockTypes2["BubbleCoralBlock"]="minecraft:bubble_coral_block";MinecraftBlockTypes2["BubbleCoralFan"]="minecraft:bubble_coral_fan";MinecraftBlockTypes2["BubbleCoralWallFan"]="minecraft:bubble_coral_wall_fan";MinecraftBlockTypes2["BuddingAmethyst"]="minecraft:budding_amethyst";MinecraftBlockTypes2["Cactus"]="minecraft:cactus";MinecraftBlockTypes2["Cake"]="minecraft:cake";MinecraftBlockTypes2["Calcite"]="minecraft:calcite";MinecraftBlockTypes2["CalibratedSculkSensor"]="minecraft:calibrated_sculk_sensor";MinecraftBlockTypes2["Camera"]="minecraft:camera";MinecraftBlockTypes2["Campfire"]="minecraft:campfire";MinecraftBlockTypes2["Candle"]="minecraft:candle";MinecraftBlockTypes2["CandleCake"]="minecraft:candle_cake";MinecraftBlockTypes2["Carrots"]="minecraft:carrots";MinecraftBlockTypes2["CartographyTable"]="minecraft:cartography_table";MinecraftBlockTypes2["CarvedPumpkin"]="minecraft:carved_pumpkin";MinecraftBlockTypes2["Cauldron"]="minecraft:cauldron";MinecraftBlockTypes2["CaveVines"]="minecraft:cave_vines";MinecraftBlockTypes2["CaveVinesBodyWithBerries"]="minecraft:cave_vines_body_with_berries";MinecraftBlockTypes2["CaveVinesHeadWithBerries"]="minecraft:cave_vines_head_with_berries";MinecraftBlockTypes2["Chain"]="minecraft:chain";MinecraftBlockTypes2["ChainCommandBlock"]="minecraft:chain_command_block";MinecraftBlockTypes2["ChemicalHeat"]="minecraft:chemical_heat";MinecraftBlockTypes2["CherryButton"]="minecraft:cherry_button";MinecraftBlockTypes2["CherryDoor"]="minecraft:cherry_door";MinecraftBlockTypes2["CherryDoubleSlab"]="minecraft:cherry_double_slab";MinecraftBlockTypes2["CherryFence"]="minecraft:cherry_fence";MinecraftBlockTypes2["CherryFenceGate"]="minecraft:cherry_fence_gate";MinecraftBlockTypes2["CherryHangingSign"]="minecraft:cherry_hanging_sign";MinecraftBlockTypes2["CherryLeaves"]="minecraft:cherry_leaves";MinecraftBlockTypes2["CherryLog"]="minecraft:cherry_log";MinecraftBlockTypes2["CherryPlanks"]="minecraft:cherry_planks";MinecraftBlockTypes2["CherryPressurePlate"]="minecraft:cherry_pressure_plate";MinecraftBlockTypes2["CherrySapling"]="minecraft:cherry_sapling";MinecraftBlockTypes2["CherrySlab"]="minecraft:cherry_slab";MinecraftBlockTypes2["CherryStairs"]="minecraft:cherry_stairs";MinecraftBlockTypes2["CherryStandingSign"]="minecraft:cherry_standing_sign";MinecraftBlockTypes2["CherryTrapdoor"]="minecraft:cherry_trapdoor";MinecraftBlockTypes2["CherryWallSign"]="minecraft:cherry_wall_sign";MinecraftBlockTypes2["CherryWood"]="minecraft:cherry_wood";MinecraftBlockTypes2["Chest"]="minecraft:chest";MinecraftBlockTypes2["ChippedAnvil"]="minecraft:chipped_anvil";MinecraftBlockTypes2["ChiseledBookshelf"]="minecraft:chiseled_bookshelf";MinecraftBlockTypes2["ChiseledCopper"]="minecraft:chiseled_copper";MinecraftBlockTypes2["ChiseledDeepslate"]="minecraft:chiseled_deepslate";MinecraftBlockTypes2["ChiseledNetherBricks"]="minecraft:chiseled_nether_bricks";MinecraftBlockTypes2["ChiseledPolishedBlackstone"]="minecraft:chiseled_polished_blackstone";MinecraftBlockTypes2["ChiseledQuartzBlock"]="minecraft:chiseled_quartz_block";MinecraftBlockTypes2["ChiseledRedSandstone"]="minecraft:chiseled_red_sandstone";MinecraftBlockTypes2["ChiseledSandstone"]="minecraft:chiseled_sandstone";MinecraftBlockTypes2["ChiseledStoneBricks"]="minecraft:chiseled_stone_bricks";MinecraftBlockTypes2["ChiseledTuff"]="minecraft:chiseled_tuff";MinecraftBlockTypes2["ChiseledTuffBricks"]="minecraft:chiseled_tuff_bricks";MinecraftBlockTypes2["ChorusFlower"]="minecraft:chorus_flower";MinecraftBlockTypes2["ChorusPlant"]="minecraft:chorus_plant";MinecraftBlockTypes2["Clay"]="minecraft:clay";MinecraftBlockTypes2["ClientRequestPlaceholderBlock"]="minecraft:client_request_placeholder_block";MinecraftBlockTypes2["CoalBlock"]="minecraft:coal_block";MinecraftBlockTypes2["CoalOre"]="minecraft:coal_ore";MinecraftBlockTypes2["CoarseDirt"]="minecraft:coarse_dirt";MinecraftBlockTypes2["CobbledDeepslate"]="minecraft:cobbled_deepslate";MinecraftBlockTypes2["CobbledDeepslateDoubleSlab"]="minecraft:cobbled_deepslate_double_slab";MinecraftBlockTypes2["CobbledDeepslateSlab"]="minecraft:cobbled_deepslate_slab";MinecraftBlockTypes2["CobbledDeepslateStairs"]="minecraft:cobbled_deepslate_stairs";MinecraftBlockTypes2["CobbledDeepslateWall"]="minecraft:cobbled_deepslate_wall";MinecraftBlockTypes2["Cobblestone"]="minecraft:cobblestone";MinecraftBlockTypes2["CobblestoneDoubleSlab"]="minecraft:cobblestone_double_slab";MinecraftBlockTypes2["CobblestoneSlab"]="minecraft:cobblestone_slab";MinecraftBlockTypes2["CobblestoneWall"]="minecraft:cobblestone_wall";MinecraftBlockTypes2["Cocoa"]="minecraft:cocoa";MinecraftBlockTypes2["ColoredTorchBlue"]="minecraft:colored_torch_blue";MinecraftBlockTypes2["ColoredTorchGreen"]="minecraft:colored_torch_green";MinecraftBlockTypes2["ColoredTorchPurple"]="minecraft:colored_torch_purple";MinecraftBlockTypes2["ColoredTorchRed"]="minecraft:colored_torch_red";MinecraftBlockTypes2["CommandBlock"]="minecraft:command_block";MinecraftBlockTypes2["Composter"]="minecraft:composter";MinecraftBlockTypes2["CompoundCreator"]="minecraft:compound_creator";MinecraftBlockTypes2["Conduit"]="minecraft:conduit";MinecraftBlockTypes2["CopperBlock"]="minecraft:copper_block";MinecraftBlockTypes2["CopperBulb"]="minecraft:copper_bulb";MinecraftBlockTypes2["CopperDoor"]="minecraft:copper_door";MinecraftBlockTypes2["CopperGrate"]="minecraft:copper_grate";MinecraftBlockTypes2["CopperOre"]="minecraft:copper_ore";MinecraftBlockTypes2["CopperTrapdoor"]="minecraft:copper_trapdoor";MinecraftBlockTypes2["Cornflower"]="minecraft:cornflower";MinecraftBlockTypes2["CrackedDeepslateBricks"]="minecraft:cracked_deepslate_bricks";MinecraftBlockTypes2["CrackedDeepslateTiles"]="minecraft:cracked_deepslate_tiles";MinecraftBlockTypes2["CrackedNetherBricks"]="minecraft:cracked_nether_bricks";MinecraftBlockTypes2["CrackedPolishedBlackstoneBricks"]="minecraft:cracked_polished_blackstone_bricks";MinecraftBlockTypes2["CrackedStoneBricks"]="minecraft:cracked_stone_bricks";MinecraftBlockTypes2["Crafter"]="minecraft:crafter";MinecraftBlockTypes2["CraftingTable"]="minecraft:crafting_table";MinecraftBlockTypes2["CrimsonButton"]="minecraft:crimson_button";MinecraftBlockTypes2["CrimsonDoor"]="minecraft:crimson_door";MinecraftBlockTypes2["CrimsonDoubleSlab"]="minecraft:crimson_double_slab";MinecraftBlockTypes2["CrimsonFence"]="minecraft:crimson_fence";MinecraftBlockTypes2["CrimsonFenceGate"]="minecraft:crimson_fence_gate";MinecraftBlockTypes2["CrimsonFungus"]="minecraft:crimson_fungus";MinecraftBlockTypes2["CrimsonHangingSign"]="minecraft:crimson_hanging_sign";MinecraftBlockTypes2["CrimsonHyphae"]="minecraft:crimson_hyphae";MinecraftBlockTypes2["CrimsonNylium"]="minecraft:crimson_nylium";MinecraftBlockTypes2["CrimsonPlanks"]="minecraft:crimson_planks";MinecraftBlockTypes2["CrimsonPressurePlate"]="minecraft:crimson_pressure_plate";MinecraftBlockTypes2["CrimsonRoots"]="minecraft:crimson_roots";MinecraftBlockTypes2["CrimsonSlab"]="minecraft:crimson_slab";MinecraftBlockTypes2["CrimsonStairs"]="minecraft:crimson_stairs";MinecraftBlockTypes2["CrimsonStandingSign"]="minecraft:crimson_standing_sign";MinecraftBlockTypes2["CrimsonStem"]="minecraft:crimson_stem";MinecraftBlockTypes2["CrimsonTrapdoor"]="minecraft:crimson_trapdoor";MinecraftBlockTypes2["CrimsonWallSign"]="minecraft:crimson_wall_sign";MinecraftBlockTypes2["CryingObsidian"]="minecraft:crying_obsidian";MinecraftBlockTypes2["CutCopper"]="minecraft:cut_copper";MinecraftBlockTypes2["CutCopperSlab"]="minecraft:cut_copper_slab";MinecraftBlockTypes2["CutCopperStairs"]="minecraft:cut_copper_stairs";MinecraftBlockTypes2["CutRedSandstone"]="minecraft:cut_red_sandstone";MinecraftBlockTypes2["CutRedSandstoneDoubleSlab"]="minecraft:cut_red_sandstone_double_slab";MinecraftBlockTypes2["CutRedSandstoneSlab"]="minecraft:cut_red_sandstone_slab";MinecraftBlockTypes2["CutSandstone"]="minecraft:cut_sandstone";MinecraftBlockTypes2["CutSandstoneDoubleSlab"]="minecraft:cut_sandstone_double_slab";MinecraftBlockTypes2["CutSandstoneSlab"]="minecraft:cut_sandstone_slab";MinecraftBlockTypes2["CyanCandle"]="minecraft:cyan_candle";MinecraftBlockTypes2["CyanCandleCake"]="minecraft:cyan_candle_cake";MinecraftBlockTypes2["CyanCarpet"]="minecraft:cyan_carpet";MinecraftBlockTypes2["CyanConcrete"]="minecraft:cyan_concrete";MinecraftBlockTypes2["CyanConcretePowder"]="minecraft:cyan_concrete_powder";MinecraftBlockTypes2["CyanGlazedTerracotta"]="minecraft:cyan_glazed_terracotta";MinecraftBlockTypes2["CyanShulkerBox"]="minecraft:cyan_shulker_box";MinecraftBlockTypes2["CyanStainedGlass"]="minecraft:cyan_stained_glass";MinecraftBlockTypes2["CyanStainedGlassPane"]="minecraft:cyan_stained_glass_pane";MinecraftBlockTypes2["CyanTerracotta"]="minecraft:cyan_terracotta";MinecraftBlockTypes2["CyanWool"]="minecraft:cyan_wool";MinecraftBlockTypes2["DamagedAnvil"]="minecraft:damaged_anvil";MinecraftBlockTypes2["Dandelion"]="minecraft:dandelion";MinecraftBlockTypes2["DarkOakButton"]="minecraft:dark_oak_button";MinecraftBlockTypes2["DarkOakDoor"]="minecraft:dark_oak_door";MinecraftBlockTypes2["DarkOakDoubleSlab"]="minecraft:dark_oak_double_slab";MinecraftBlockTypes2["DarkOakFence"]="minecraft:dark_oak_fence";MinecraftBlockTypes2["DarkOakFenceGate"]="minecraft:dark_oak_fence_gate";MinecraftBlockTypes2["DarkOakHangingSign"]="minecraft:dark_oak_hanging_sign";MinecraftBlockTypes2["DarkOakLeaves"]="minecraft:dark_oak_leaves";MinecraftBlockTypes2["DarkOakLog"]="minecraft:dark_oak_log";MinecraftBlockTypes2["DarkOakPlanks"]="minecraft:dark_oak_planks";MinecraftBlockTypes2["DarkOakPressurePlate"]="minecraft:dark_oak_pressure_plate";MinecraftBlockTypes2["DarkOakSapling"]="minecraft:dark_oak_sapling";MinecraftBlockTypes2["DarkOakSlab"]="minecraft:dark_oak_slab";MinecraftBlockTypes2["DarkOakStairs"]="minecraft:dark_oak_stairs";MinecraftBlockTypes2["DarkOakTrapdoor"]="minecraft:dark_oak_trapdoor";MinecraftBlockTypes2["DarkOakWood"]="minecraft:dark_oak_wood";MinecraftBlockTypes2["DarkPrismarine"]="minecraft:dark_prismarine";MinecraftBlockTypes2["DarkPrismarineDoubleSlab"]="minecraft:dark_prismarine_double_slab";MinecraftBlockTypes2["DarkPrismarineSlab"]="minecraft:dark_prismarine_slab";MinecraftBlockTypes2["DarkPrismarineStairs"]="minecraft:dark_prismarine_stairs";MinecraftBlockTypes2["DarkoakStandingSign"]="minecraft:darkoak_standing_sign";MinecraftBlockTypes2["DarkoakWallSign"]="minecraft:darkoak_wall_sign";MinecraftBlockTypes2["DaylightDetector"]="minecraft:daylight_detector";MinecraftBlockTypes2["DaylightDetectorInverted"]="minecraft:daylight_detector_inverted";MinecraftBlockTypes2["DeadBrainCoral"]="minecraft:dead_brain_coral";MinecraftBlockTypes2["DeadBrainCoralBlock"]="minecraft:dead_brain_coral_block";MinecraftBlockTypes2["DeadBrainCoralFan"]="minecraft:dead_brain_coral_fan";MinecraftBlockTypes2["DeadBrainCoralWallFan"]="minecraft:dead_brain_coral_wall_fan";MinecraftBlockTypes2["DeadBubbleCoral"]="minecraft:dead_bubble_coral";MinecraftBlockTypes2["DeadBubbleCoralBlock"]="minecraft:dead_bubble_coral_block";MinecraftBlockTypes2["DeadBubbleCoralFan"]="minecraft:dead_bubble_coral_fan";MinecraftBlockTypes2["DeadBubbleCoralWallFan"]="minecraft:dead_bubble_coral_wall_fan";MinecraftBlockTypes2["DeadFireCoral"]="minecraft:dead_fire_coral";MinecraftBlockTypes2["DeadFireCoralBlock"]="minecraft:dead_fire_coral_block";MinecraftBlockTypes2["DeadFireCoralFan"]="minecraft:dead_fire_coral_fan";MinecraftBlockTypes2["DeadFireCoralWallFan"]="minecraft:dead_fire_coral_wall_fan";MinecraftBlockTypes2["DeadHornCoral"]="minecraft:dead_horn_coral";MinecraftBlockTypes2["DeadHornCoralBlock"]="minecraft:dead_horn_coral_block";MinecraftBlockTypes2["DeadHornCoralFan"]="minecraft:dead_horn_coral_fan";MinecraftBlockTypes2["DeadHornCoralWallFan"]="minecraft:dead_horn_coral_wall_fan";MinecraftBlockTypes2["DeadTubeCoral"]="minecraft:dead_tube_coral";MinecraftBlockTypes2["DeadTubeCoralBlock"]="minecraft:dead_tube_coral_block";MinecraftBlockTypes2["DeadTubeCoralFan"]="minecraft:dead_tube_coral_fan";MinecraftBlockTypes2["DeadTubeCoralWallFan"]="minecraft:dead_tube_coral_wall_fan";MinecraftBlockTypes2["Deadbush"]="minecraft:deadbush";MinecraftBlockTypes2["DecoratedPot"]="minecraft:decorated_pot";MinecraftBlockTypes2["Deepslate"]="minecraft:deepslate";MinecraftBlockTypes2["DeepslateBrickDoubleSlab"]="minecraft:deepslate_brick_double_slab";MinecraftBlockTypes2["DeepslateBrickSlab"]="minecraft:deepslate_brick_slab";MinecraftBlockTypes2["DeepslateBrickStairs"]="minecraft:deepslate_brick_stairs";MinecraftBlockTypes2["DeepslateBrickWall"]="minecraft:deepslate_brick_wall";MinecraftBlockTypes2["DeepslateBricks"]="minecraft:deepslate_bricks";MinecraftBlockTypes2["DeepslateCoalOre"]="minecraft:deepslate_coal_ore";MinecraftBlockTypes2["DeepslateCopperOre"]="minecraft:deepslate_copper_ore";MinecraftBlockTypes2["DeepslateDiamondOre"]="minecraft:deepslate_diamond_ore";MinecraftBlockTypes2["DeepslateEmeraldOre"]="minecraft:deepslate_emerald_ore";MinecraftBlockTypes2["DeepslateGoldOre"]="minecraft:deepslate_gold_ore";MinecraftBlockTypes2["DeepslateIronOre"]="minecraft:deepslate_iron_ore";MinecraftBlockTypes2["DeepslateLapisOre"]="minecraft:deepslate_lapis_ore";MinecraftBlockTypes2["DeepslateRedstoneOre"]="minecraft:deepslate_redstone_ore";MinecraftBlockTypes2["DeepslateTileDoubleSlab"]="minecraft:deepslate_tile_double_slab";MinecraftBlockTypes2["DeepslateTileSlab"]="minecraft:deepslate_tile_slab";MinecraftBlockTypes2["DeepslateTileStairs"]="minecraft:deepslate_tile_stairs";MinecraftBlockTypes2["DeepslateTileWall"]="minecraft:deepslate_tile_wall";MinecraftBlockTypes2["DeepslateTiles"]="minecraft:deepslate_tiles";MinecraftBlockTypes2["Deny"]="minecraft:deny";MinecraftBlockTypes2["DeprecatedAnvil"]="minecraft:deprecated_anvil";MinecraftBlockTypes2["DeprecatedPurpurBlock1"]="minecraft:deprecated_purpur_block_1";MinecraftBlockTypes2["DeprecatedPurpurBlock2"]="minecraft:deprecated_purpur_block_2";MinecraftBlockTypes2["DetectorRail"]="minecraft:detector_rail";MinecraftBlockTypes2["DiamondBlock"]="minecraft:diamond_block";MinecraftBlockTypes2["DiamondOre"]="minecraft:diamond_ore";MinecraftBlockTypes2["Diorite"]="minecraft:diorite";MinecraftBlockTypes2["DioriteDoubleSlab"]="minecraft:diorite_double_slab";MinecraftBlockTypes2["DioriteSlab"]="minecraft:diorite_slab";MinecraftBlockTypes2["DioriteStairs"]="minecraft:diorite_stairs";MinecraftBlockTypes2["DioriteWall"]="minecraft:diorite_wall";MinecraftBlockTypes2["Dirt"]="minecraft:dirt";MinecraftBlockTypes2["DirtWithRoots"]="minecraft:dirt_with_roots";MinecraftBlockTypes2["Dispenser"]="minecraft:dispenser";MinecraftBlockTypes2["DoubleCutCopperSlab"]="minecraft:double_cut_copper_slab";MinecraftBlockTypes2["DragonEgg"]="minecraft:dragon_egg";MinecraftBlockTypes2["DriedKelpBlock"]="minecraft:dried_kelp_block";MinecraftBlockTypes2["DripstoneBlock"]="minecraft:dripstone_block";MinecraftBlockTypes2["Dropper"]="minecraft:dropper";MinecraftBlockTypes2["Element0"]="minecraft:element_0";MinecraftBlockTypes2["Element1"]="minecraft:element_1";MinecraftBlockTypes2["Element10"]="minecraft:element_10";MinecraftBlockTypes2["Element100"]="minecraft:element_100";MinecraftBlockTypes2["Element101"]="minecraft:element_101";MinecraftBlockTypes2["Element102"]="minecraft:element_102";MinecraftBlockTypes2["Element103"]="minecraft:element_103";MinecraftBlockTypes2["Element104"]="minecraft:element_104";MinecraftBlockTypes2["Element105"]="minecraft:element_105";MinecraftBlockTypes2["Element106"]="minecraft:element_106";MinecraftBlockTypes2["Element107"]="minecraft:element_107";MinecraftBlockTypes2["Element108"]="minecraft:element_108";MinecraftBlockTypes2["Element109"]="minecraft:element_109";MinecraftBlockTypes2["Element11"]="minecraft:element_11";MinecraftBlockTypes2["Element110"]="minecraft:element_110";MinecraftBlockTypes2["Element111"]="minecraft:element_111";MinecraftBlockTypes2["Element112"]="minecraft:element_112";MinecraftBlockTypes2["Element113"]="minecraft:element_113";MinecraftBlockTypes2["Element114"]="minecraft:element_114";MinecraftBlockTypes2["Element115"]="minecraft:element_115";MinecraftBlockTypes2["Element116"]="minecraft:element_116";MinecraftBlockTypes2["Element117"]="minecraft:element_117";MinecraftBlockTypes2["Element118"]="minecraft:element_118";MinecraftBlockTypes2["Element12"]="minecraft:element_12";MinecraftBlockTypes2["Element13"]="minecraft:element_13";MinecraftBlockTypes2["Element14"]="minecraft:element_14";MinecraftBlockTypes2["Element15"]="minecraft:element_15";MinecraftBlockTypes2["Element16"]="minecraft:element_16";MinecraftBlockTypes2["Element17"]="minecraft:element_17";MinecraftBlockTypes2["Element18"]="minecraft:element_18";MinecraftBlockTypes2["Element19"]="minecraft:element_19";MinecraftBlockTypes2["Element2"]="minecraft:element_2";MinecraftBlockTypes2["Element20"]="minecraft:element_20";MinecraftBlockTypes2["Element21"]="minecraft:element_21";MinecraftBlockTypes2["Element22"]="minecraft:element_22";MinecraftBlockTypes2["Element23"]="minecraft:element_23";MinecraftBlockTypes2["Element24"]="minecraft:element_24";MinecraftBlockTypes2["Element25"]="minecraft:element_25";MinecraftBlockTypes2["Element26"]="minecraft:element_26";MinecraftBlockTypes2["Element27"]="minecraft:element_27";MinecraftBlockTypes2["Element28"]="minecraft:element_28";MinecraftBlockTypes2["Element29"]="minecraft:element_29";MinecraftBlockTypes2["Element3"]="minecraft:element_3";MinecraftBlockTypes2["Element30"]="minecraft:element_30";MinecraftBlockTypes2["Element31"]="minecraft:element_31";MinecraftBlockTypes2["Element32"]="minecraft:element_32";MinecraftBlockTypes2["Element33"]="minecraft:element_33";MinecraftBlockTypes2["Element34"]="minecraft:element_34";MinecraftBlockTypes2["Element35"]="minecraft:element_35";MinecraftBlockTypes2["Element36"]="minecraft:element_36";MinecraftBlockTypes2["Element37"]="minecraft:element_37";MinecraftBlockTypes2["Element38"]="minecraft:element_38";MinecraftBlockTypes2["Element39"]="minecraft:element_39";MinecraftBlockTypes2["Element4"]="minecraft:element_4";MinecraftBlockTypes2["Element40"]="minecraft:element_40";MinecraftBlockTypes2["Element41"]="minecraft:element_41";MinecraftBlockTypes2["Element42"]="minecraft:element_42";MinecraftBlockTypes2["Element43"]="minecraft:element_43";MinecraftBlockTypes2["Element44"]="minecraft:element_44";MinecraftBlockTypes2["Element45"]="minecraft:element_45";MinecraftBlockTypes2["Element46"]="minecraft:element_46";MinecraftBlockTypes2["Element47"]="minecraft:element_47";MinecraftBlockTypes2["Element48"]="minecraft:element_48";MinecraftBlockTypes2["Element49"]="minecraft:element_49";MinecraftBlockTypes2["Element5"]="minecraft:element_5";MinecraftBlockTypes2["Element50"]="minecraft:element_50";MinecraftBlockTypes2["Element51"]="minecraft:element_51";MinecraftBlockTypes2["Element52"]="minecraft:element_52";MinecraftBlockTypes2["Element53"]="minecraft:element_53";MinecraftBlockTypes2["Element54"]="minecraft:element_54";MinecraftBlockTypes2["Element55"]="minecraft:element_55";MinecraftBlockTypes2["Element56"]="minecraft:element_56";MinecraftBlockTypes2["Element57"]="minecraft:element_57";MinecraftBlockTypes2["Element58"]="minecraft:element_58";MinecraftBlockTypes2["Element59"]="minecraft:element_59";MinecraftBlockTypes2["Element6"]="minecraft:element_6";MinecraftBlockTypes2["Element60"]="minecraft:element_60";MinecraftBlockTypes2["Element61"]="minecraft:element_61";MinecraftBlockTypes2["Element62"]="minecraft:element_62";MinecraftBlockTypes2["Element63"]="minecraft:element_63";MinecraftBlockTypes2["Element64"]="minecraft:element_64";MinecraftBlockTypes2["Element65"]="minecraft:element_65";MinecraftBlockTypes2["Element66"]="minecraft:element_66";MinecraftBlockTypes2["Element67"]="minecraft:element_67";MinecraftBlockTypes2["Element68"]="minecraft:element_68";MinecraftBlockTypes2["Element69"]="minecraft:element_69";MinecraftBlockTypes2["Element7"]="minecraft:element_7";MinecraftBlockTypes2["Element70"]="minecraft:element_70";MinecraftBlockTypes2["Element71"]="minecraft:element_71";MinecraftBlockTypes2["Element72"]="minecraft:element_72";MinecraftBlockTypes2["Element73"]="minecraft:element_73";MinecraftBlockTypes2["Element74"]="minecraft:element_74";MinecraftBlockTypes2["Element75"]="minecraft:element_75";MinecraftBlockTypes2["Element76"]="minecraft:element_76";MinecraftBlockTypes2["Element77"]="minecraft:element_77";MinecraftBlockTypes2["Element78"]="minecraft:element_78";MinecraftBlockTypes2["Element79"]="minecraft:element_79";MinecraftBlockTypes2["Element8"]="minecraft:element_8";MinecraftBlockTypes2["Element80"]="minecraft:element_80";MinecraftBlockTypes2["Element81"]="minecraft:element_81";MinecraftBlockTypes2["Element82"]="minecraft:element_82";MinecraftBlockTypes2["Element83"]="minecraft:element_83";MinecraftBlockTypes2["Element84"]="minecraft:element_84";MinecraftBlockTypes2["Element85"]="minecraft:element_85";MinecraftBlockTypes2["Element86"]="minecraft:element_86";MinecraftBlockTypes2["Element87"]="minecraft:element_87";MinecraftBlockTypes2["Element88"]="minecraft:element_88";MinecraftBlockTypes2["Element89"]="minecraft:element_89";MinecraftBlockTypes2["Element9"]="minecraft:element_9";MinecraftBlockTypes2["Element90"]="minecraft:element_90";MinecraftBlockTypes2["Element91"]="minecraft:element_91";MinecraftBlockTypes2["Element92"]="minecraft:element_92";MinecraftBlockTypes2["Element93"]="minecraft:element_93";MinecraftBlockTypes2["Element94"]="minecraft:element_94";MinecraftBlockTypes2["Element95"]="minecraft:element_95";MinecraftBlockTypes2["Element96"]="minecraft:element_96";MinecraftBlockTypes2["Element97"]="minecraft:element_97";MinecraftBlockTypes2["Element98"]="minecraft:element_98";MinecraftBlockTypes2["Element99"]="minecraft:element_99";MinecraftBlockTypes2["ElementConstructor"]="minecraft:element_constructor";MinecraftBlockTypes2["EmeraldBlock"]="minecraft:emerald_block";MinecraftBlockTypes2["EmeraldOre"]="minecraft:emerald_ore";MinecraftBlockTypes2["EnchantingTable"]="minecraft:enchanting_table";MinecraftBlockTypes2["EndBrickStairs"]="minecraft:end_brick_stairs";MinecraftBlockTypes2["EndBricks"]="minecraft:end_bricks";MinecraftBlockTypes2["EndGateway"]="minecraft:end_gateway";MinecraftBlockTypes2["EndPortal"]="minecraft:end_portal";MinecraftBlockTypes2["EndPortalFrame"]="minecraft:end_portal_frame";MinecraftBlockTypes2["EndRod"]="minecraft:end_rod";MinecraftBlockTypes2["EndStone"]="minecraft:end_stone";MinecraftBlockTypes2["EndStoneBrickDoubleSlab"]="minecraft:end_stone_brick_double_slab";MinecraftBlockTypes2["EndStoneBrickSlab"]="minecraft:end_stone_brick_slab";MinecraftBlockTypes2["EndStoneBrickWall"]="minecraft:end_stone_brick_wall";MinecraftBlockTypes2["EnderChest"]="minecraft:ender_chest";MinecraftBlockTypes2["ExposedChiseledCopper"]="minecraft:exposed_chiseled_copper";MinecraftBlockTypes2["ExposedCopper"]="minecraft:exposed_copper";MinecraftBlockTypes2["ExposedCopperBulb"]="minecraft:exposed_copper_bulb";MinecraftBlockTypes2["ExposedCopperDoor"]="minecraft:exposed_copper_door";MinecraftBlockTypes2["ExposedCopperGrate"]="minecraft:exposed_copper_grate";MinecraftBlockTypes2["ExposedCopperTrapdoor"]="minecraft:exposed_copper_trapdoor";MinecraftBlockTypes2["ExposedCutCopper"]="minecraft:exposed_cut_copper";MinecraftBlockTypes2["ExposedCutCopperSlab"]="minecraft:exposed_cut_copper_slab";MinecraftBlockTypes2["ExposedCutCopperStairs"]="minecraft:exposed_cut_copper_stairs";MinecraftBlockTypes2["ExposedDoubleCutCopperSlab"]="minecraft:exposed_double_cut_copper_slab";MinecraftBlockTypes2["Farmland"]="minecraft:farmland";MinecraftBlockTypes2["FenceGate"]="minecraft:fence_gate";MinecraftBlockTypes2["Fern"]="minecraft:fern";MinecraftBlockTypes2["Fire"]="minecraft:fire";MinecraftBlockTypes2["FireCoral"]="minecraft:fire_coral";MinecraftBlockTypes2["FireCoralBlock"]="minecraft:fire_coral_block";MinecraftBlockTypes2["FireCoralFan"]="minecraft:fire_coral_fan";MinecraftBlockTypes2["FireCoralWallFan"]="minecraft:fire_coral_wall_fan";MinecraftBlockTypes2["FletchingTable"]="minecraft:fletching_table";MinecraftBlockTypes2["FlowerPot"]="minecraft:flower_pot";MinecraftBlockTypes2["FloweringAzalea"]="minecraft:flowering_azalea";MinecraftBlockTypes2["FlowingLava"]="minecraft:flowing_lava";MinecraftBlockTypes2["FlowingWater"]="minecraft:flowing_water";MinecraftBlockTypes2["Frame"]="minecraft:frame";MinecraftBlockTypes2["FrogSpawn"]="minecraft:frog_spawn";MinecraftBlockTypes2["FrostedIce"]="minecraft:frosted_ice";MinecraftBlockTypes2["Furnace"]="minecraft:furnace";MinecraftBlockTypes2["GildedBlackstone"]="minecraft:gilded_blackstone";MinecraftBlockTypes2["Glass"]="minecraft:glass";MinecraftBlockTypes2["GlassPane"]="minecraft:glass_pane";MinecraftBlockTypes2["GlowFrame"]="minecraft:glow_frame";MinecraftBlockTypes2["GlowLichen"]="minecraft:glow_lichen";MinecraftBlockTypes2["Glowingobsidian"]="minecraft:glowingobsidian";MinecraftBlockTypes2["Glowstone"]="minecraft:glowstone";MinecraftBlockTypes2["GoldBlock"]="minecraft:gold_block";MinecraftBlockTypes2["GoldOre"]="minecraft:gold_ore";MinecraftBlockTypes2["GoldenRail"]="minecraft:golden_rail";MinecraftBlockTypes2["Granite"]="minecraft:granite";MinecraftBlockTypes2["GraniteDoubleSlab"]="minecraft:granite_double_slab";MinecraftBlockTypes2["GraniteSlab"]="minecraft:granite_slab";MinecraftBlockTypes2["GraniteStairs"]="minecraft:granite_stairs";MinecraftBlockTypes2["GraniteWall"]="minecraft:granite_wall";MinecraftBlockTypes2["GrassBlock"]="minecraft:grass_block";MinecraftBlockTypes2["GrassPath"]="minecraft:grass_path";MinecraftBlockTypes2["Gravel"]="minecraft:gravel";MinecraftBlockTypes2["GrayCandle"]="minecraft:gray_candle";MinecraftBlockTypes2["GrayCandleCake"]="minecraft:gray_candle_cake";MinecraftBlockTypes2["GrayCarpet"]="minecraft:gray_carpet";MinecraftBlockTypes2["GrayConcrete"]="minecraft:gray_concrete";MinecraftBlockTypes2["GrayConcretePowder"]="minecraft:gray_concrete_powder";MinecraftBlockTypes2["GrayGlazedTerracotta"]="minecraft:gray_glazed_terracotta";MinecraftBlockTypes2["GrayShulkerBox"]="minecraft:gray_shulker_box";MinecraftBlockTypes2["GrayStainedGlass"]="minecraft:gray_stained_glass";MinecraftBlockTypes2["GrayStainedGlassPane"]="minecraft:gray_stained_glass_pane";MinecraftBlockTypes2["GrayTerracotta"]="minecraft:gray_terracotta";MinecraftBlockTypes2["GrayWool"]="minecraft:gray_wool";MinecraftBlockTypes2["GreenCandle"]="minecraft:green_candle";MinecraftBlockTypes2["GreenCandleCake"]="minecraft:green_candle_cake";MinecraftBlockTypes2["GreenCarpet"]="minecraft:green_carpet";MinecraftBlockTypes2["GreenConcrete"]="minecraft:green_concrete";MinecraftBlockTypes2["GreenConcretePowder"]="minecraft:green_concrete_powder";MinecraftBlockTypes2["GreenGlazedTerracotta"]="minecraft:green_glazed_terracotta";MinecraftBlockTypes2["GreenShulkerBox"]="minecraft:green_shulker_box";MinecraftBlockTypes2["GreenStainedGlass"]="minecraft:green_stained_glass";MinecraftBlockTypes2["GreenStainedGlassPane"]="minecraft:green_stained_glass_pane";MinecraftBlockTypes2["GreenTerracotta"]="minecraft:green_terracotta";MinecraftBlockTypes2["GreenWool"]="minecraft:green_wool";MinecraftBlockTypes2["Grindstone"]="minecraft:grindstone";MinecraftBlockTypes2["HangingRoots"]="minecraft:hanging_roots";MinecraftBlockTypes2["HardBlackStainedGlass"]="minecraft:hard_black_stained_glass";MinecraftBlockTypes2["HardBlackStainedGlassPane"]="minecraft:hard_black_stained_glass_pane";MinecraftBlockTypes2["HardBlueStainedGlass"]="minecraft:hard_blue_stained_glass";MinecraftBlockTypes2["HardBlueStainedGlassPane"]="minecraft:hard_blue_stained_glass_pane";MinecraftBlockTypes2["HardBrownStainedGlass"]="minecraft:hard_brown_stained_glass";MinecraftBlockTypes2["HardBrownStainedGlassPane"]="minecraft:hard_brown_stained_glass_pane";MinecraftBlockTypes2["HardCyanStainedGlass"]="minecraft:hard_cyan_stained_glass";MinecraftBlockTypes2["HardCyanStainedGlassPane"]="minecraft:hard_cyan_stained_glass_pane";MinecraftBlockTypes2["HardGlass"]="minecraft:hard_glass";MinecraftBlockTypes2["HardGlassPane"]="minecraft:hard_glass_pane";MinecraftBlockTypes2["HardGrayStainedGlass"]="minecraft:hard_gray_stained_glass";MinecraftBlockTypes2["HardGrayStainedGlassPane"]="minecraft:hard_gray_stained_glass_pane";MinecraftBlockTypes2["HardGreenStainedGlass"]="minecraft:hard_green_stained_glass";MinecraftBlockTypes2["HardGreenStainedGlassPane"]="minecraft:hard_green_stained_glass_pane";MinecraftBlockTypes2["HardLightBlueStainedGlass"]="minecraft:hard_light_blue_stained_glass";MinecraftBlockTypes2["HardLightBlueStainedGlassPane"]="minecraft:hard_light_blue_stained_glass_pane";MinecraftBlockTypes2["HardLightGrayStainedGlass"]="minecraft:hard_light_gray_stained_glass";MinecraftBlockTypes2["HardLightGrayStainedGlassPane"]="minecraft:hard_light_gray_stained_glass_pane";MinecraftBlockTypes2["HardLimeStainedGlass"]="minecraft:hard_lime_stained_glass";MinecraftBlockTypes2["HardLimeStainedGlassPane"]="minecraft:hard_lime_stained_glass_pane";MinecraftBlockTypes2["HardMagentaStainedGlass"]="minecraft:hard_magenta_stained_glass";MinecraftBlockTypes2["HardMagentaStainedGlassPane"]="minecraft:hard_magenta_stained_glass_pane";MinecraftBlockTypes2["HardOrangeStainedGlass"]="minecraft:hard_orange_stained_glass";MinecraftBlockTypes2["HardOrangeStainedGlassPane"]="minecraft:hard_orange_stained_glass_pane";MinecraftBlockTypes2["HardPinkStainedGlass"]="minecraft:hard_pink_stained_glass";MinecraftBlockTypes2["HardPinkStainedGlassPane"]="minecraft:hard_pink_stained_glass_pane";MinecraftBlockTypes2["HardPurpleStainedGlass"]="minecraft:hard_purple_stained_glass";MinecraftBlockTypes2["HardPurpleStainedGlassPane"]="minecraft:hard_purple_stained_glass_pane";MinecraftBlockTypes2["HardRedStainedGlass"]="minecraft:hard_red_stained_glass";MinecraftBlockTypes2["HardRedStainedGlassPane"]="minecraft:hard_red_stained_glass_pane";MinecraftBlockTypes2["HardWhiteStainedGlass"]="minecraft:hard_white_stained_glass";MinecraftBlockTypes2["HardWhiteStainedGlassPane"]="minecraft:hard_white_stained_glass_pane";MinecraftBlockTypes2["HardYellowStainedGlass"]="minecraft:hard_yellow_stained_glass";MinecraftBlockTypes2["HardYellowStainedGlassPane"]="minecraft:hard_yellow_stained_glass_pane";MinecraftBlockTypes2["HardenedClay"]="minecraft:hardened_clay";MinecraftBlockTypes2["HayBlock"]="minecraft:hay_block";MinecraftBlockTypes2["HeavyCore"]="minecraft:heavy_core";MinecraftBlockTypes2["HeavyWeightedPressurePlate"]="minecraft:heavy_weighted_pressure_plate";MinecraftBlockTypes2["HoneyBlock"]="minecraft:honey_block";MinecraftBlockTypes2["HoneycombBlock"]="minecraft:honeycomb_block";MinecraftBlockTypes2["Hopper"]="minecraft:hopper";MinecraftBlockTypes2["HornCoral"]="minecraft:horn_coral";MinecraftBlockTypes2["HornCoralBlock"]="minecraft:horn_coral_block";MinecraftBlockTypes2["HornCoralFan"]="minecraft:horn_coral_fan";MinecraftBlockTypes2["HornCoralWallFan"]="minecraft:horn_coral_wall_fan";MinecraftBlockTypes2["Ice"]="minecraft:ice";MinecraftBlockTypes2["InfestedChiseledStoneBricks"]="minecraft:infested_chiseled_stone_bricks";MinecraftBlockTypes2["InfestedCobblestone"]="minecraft:infested_cobblestone";MinecraftBlockTypes2["InfestedCrackedStoneBricks"]="minecraft:infested_cracked_stone_bricks";MinecraftBlockTypes2["InfestedDeepslate"]="minecraft:infested_deepslate";MinecraftBlockTypes2["InfestedMossyStoneBricks"]="minecraft:infested_mossy_stone_bricks";MinecraftBlockTypes2["InfestedStone"]="minecraft:infested_stone";MinecraftBlockTypes2["InfestedStoneBricks"]="minecraft:infested_stone_bricks";MinecraftBlockTypes2["InfoUpdate"]="minecraft:info_update";MinecraftBlockTypes2["InfoUpdate2"]="minecraft:info_update2";MinecraftBlockTypes2["InvisibleBedrock"]="minecraft:invisible_bedrock";MinecraftBlockTypes2["IronBars"]="minecraft:iron_bars";MinecraftBlockTypes2["IronBlock"]="minecraft:iron_block";MinecraftBlockTypes2["IronDoor"]="minecraft:iron_door";MinecraftBlockTypes2["IronOre"]="minecraft:iron_ore";MinecraftBlockTypes2["IronTrapdoor"]="minecraft:iron_trapdoor";MinecraftBlockTypes2["Jigsaw"]="minecraft:jigsaw";MinecraftBlockTypes2["Jukebox"]="minecraft:jukebox";MinecraftBlockTypes2["JungleButton"]="minecraft:jungle_button";MinecraftBlockTypes2["JungleDoor"]="minecraft:jungle_door";MinecraftBlockTypes2["JungleDoubleSlab"]="minecraft:jungle_double_slab";MinecraftBlockTypes2["JungleFence"]="minecraft:jungle_fence";MinecraftBlockTypes2["JungleFenceGate"]="minecraft:jungle_fence_gate";MinecraftBlockTypes2["JungleHangingSign"]="minecraft:jungle_hanging_sign";MinecraftBlockTypes2["JungleLeaves"]="minecraft:jungle_leaves";MinecraftBlockTypes2["JungleLog"]="minecraft:jungle_log";MinecraftBlockTypes2["JunglePlanks"]="minecraft:jungle_planks";MinecraftBlockTypes2["JunglePressurePlate"]="minecraft:jungle_pressure_plate";MinecraftBlockTypes2["JungleSapling"]="minecraft:jungle_sapling";MinecraftBlockTypes2["JungleSlab"]="minecraft:jungle_slab";MinecraftBlockTypes2["JungleStairs"]="minecraft:jungle_stairs";MinecraftBlockTypes2["JungleStandingSign"]="minecraft:jungle_standing_sign";MinecraftBlockTypes2["JungleTrapdoor"]="minecraft:jungle_trapdoor";MinecraftBlockTypes2["JungleWallSign"]="minecraft:jungle_wall_sign";MinecraftBlockTypes2["JungleWood"]="minecraft:jungle_wood";MinecraftBlockTypes2["Kelp"]="minecraft:kelp";MinecraftBlockTypes2["LabTable"]="minecraft:lab_table";MinecraftBlockTypes2["Ladder"]="minecraft:ladder";MinecraftBlockTypes2["Lantern"]="minecraft:lantern";MinecraftBlockTypes2["LapisBlock"]="minecraft:lapis_block";MinecraftBlockTypes2["LapisOre"]="minecraft:lapis_ore";MinecraftBlockTypes2["LargeAmethystBud"]="minecraft:large_amethyst_bud";MinecraftBlockTypes2["LargeFern"]="minecraft:large_fern";MinecraftBlockTypes2["Lava"]="minecraft:lava";MinecraftBlockTypes2["Lectern"]="minecraft:lectern";MinecraftBlockTypes2["Lever"]="minecraft:lever";MinecraftBlockTypes2["LightBlock0"]="minecraft:light_block_0";MinecraftBlockTypes2["LightBlock1"]="minecraft:light_block_1";MinecraftBlockTypes2["LightBlock10"]="minecraft:light_block_10";MinecraftBlockTypes2["LightBlock11"]="minecraft:light_block_11";MinecraftBlockTypes2["LightBlock12"]="minecraft:light_block_12";MinecraftBlockTypes2["LightBlock13"]="minecraft:light_block_13";MinecraftBlockTypes2["LightBlock14"]="minecraft:light_block_14";MinecraftBlockTypes2["LightBlock15"]="minecraft:light_block_15";MinecraftBlockTypes2["LightBlock2"]="minecraft:light_block_2";MinecraftBlockTypes2["LightBlock3"]="minecraft:light_block_3";MinecraftBlockTypes2["LightBlock4"]="minecraft:light_block_4";MinecraftBlockTypes2["LightBlock5"]="minecraft:light_block_5";MinecraftBlockTypes2["LightBlock6"]="minecraft:light_block_6";MinecraftBlockTypes2["LightBlock7"]="minecraft:light_block_7";MinecraftBlockTypes2["LightBlock8"]="minecraft:light_block_8";MinecraftBlockTypes2["LightBlock9"]="minecraft:light_block_9";MinecraftBlockTypes2["LightBlueCandle"]="minecraft:light_blue_candle";MinecraftBlockTypes2["LightBlueCandleCake"]="minecraft:light_blue_candle_cake";MinecraftBlockTypes2["LightBlueCarpet"]="minecraft:light_blue_carpet";MinecraftBlockTypes2["LightBlueConcrete"]="minecraft:light_blue_concrete";MinecraftBlockTypes2["LightBlueConcretePowder"]="minecraft:light_blue_concrete_powder";MinecraftBlockTypes2["LightBlueGlazedTerracotta"]="minecraft:light_blue_glazed_terracotta";MinecraftBlockTypes2["LightBlueShulkerBox"]="minecraft:light_blue_shulker_box";MinecraftBlockTypes2["LightBlueStainedGlass"]="minecraft:light_blue_stained_glass";MinecraftBlockTypes2["LightBlueStainedGlassPane"]="minecraft:light_blue_stained_glass_pane";MinecraftBlockTypes2["LightBlueTerracotta"]="minecraft:light_blue_terracotta";MinecraftBlockTypes2["LightBlueWool"]="minecraft:light_blue_wool";MinecraftBlockTypes2["LightGrayCandle"]="minecraft:light_gray_candle";MinecraftBlockTypes2["LightGrayCandleCake"]="minecraft:light_gray_candle_cake";MinecraftBlockTypes2["LightGrayCarpet"]="minecraft:light_gray_carpet";MinecraftBlockTypes2["LightGrayConcrete"]="minecraft:light_gray_concrete";MinecraftBlockTypes2["LightGrayConcretePowder"]="minecraft:light_gray_concrete_powder";MinecraftBlockTypes2["LightGrayShulkerBox"]="minecraft:light_gray_shulker_box";MinecraftBlockTypes2["LightGrayStainedGlass"]="minecraft:light_gray_stained_glass";MinecraftBlockTypes2["LightGrayStainedGlassPane"]="minecraft:light_gray_stained_glass_pane";MinecraftBlockTypes2["LightGrayTerracotta"]="minecraft:light_gray_terracotta";MinecraftBlockTypes2["LightGrayWool"]="minecraft:light_gray_wool";MinecraftBlockTypes2["LightWeightedPressurePlate"]="minecraft:light_weighted_pressure_plate";MinecraftBlockTypes2["LightningRod"]="minecraft:lightning_rod";MinecraftBlockTypes2["Lilac"]="minecraft:lilac";MinecraftBlockTypes2["LilyOfTheValley"]="minecraft:lily_of_the_valley";MinecraftBlockTypes2["LimeCandle"]="minecraft:lime_candle";MinecraftBlockTypes2["LimeCandleCake"]="minecraft:lime_candle_cake";MinecraftBlockTypes2["LimeCarpet"]="minecraft:lime_carpet";MinecraftBlockTypes2["LimeConcrete"]="minecraft:lime_concrete";MinecraftBlockTypes2["LimeConcretePowder"]="minecraft:lime_concrete_powder";MinecraftBlockTypes2["LimeGlazedTerracotta"]="minecraft:lime_glazed_terracotta";MinecraftBlockTypes2["LimeShulkerBox"]="minecraft:lime_shulker_box";MinecraftBlockTypes2["LimeStainedGlass"]="minecraft:lime_stained_glass";MinecraftBlockTypes2["LimeStainedGlassPane"]="minecraft:lime_stained_glass_pane";MinecraftBlockTypes2["LimeTerracotta"]="minecraft:lime_terracotta";MinecraftBlockTypes2["LimeWool"]="minecraft:lime_wool";MinecraftBlockTypes2["LitBlastFurnace"]="minecraft:lit_blast_furnace";MinecraftBlockTypes2["LitDeepslateRedstoneOre"]="minecraft:lit_deepslate_redstone_ore";MinecraftBlockTypes2["LitFurnace"]="minecraft:lit_furnace";MinecraftBlockTypes2["LitPumpkin"]="minecraft:lit_pumpkin";MinecraftBlockTypes2["LitRedstoneLamp"]="minecraft:lit_redstone_lamp";MinecraftBlockTypes2["LitRedstoneOre"]="minecraft:lit_redstone_ore";MinecraftBlockTypes2["LitSmoker"]="minecraft:lit_smoker";MinecraftBlockTypes2["Lodestone"]="minecraft:lodestone";MinecraftBlockTypes2["Loom"]="minecraft:loom";MinecraftBlockTypes2["MagentaCandle"]="minecraft:magenta_candle";MinecraftBlockTypes2["MagentaCandleCake"]="minecraft:magenta_candle_cake";MinecraftBlockTypes2["MagentaCarpet"]="minecraft:magenta_carpet";MinecraftBlockTypes2["MagentaConcrete"]="minecraft:magenta_concrete";MinecraftBlockTypes2["MagentaConcretePowder"]="minecraft:magenta_concrete_powder";MinecraftBlockTypes2["MagentaGlazedTerracotta"]="minecraft:magenta_glazed_terracotta";MinecraftBlockTypes2["MagentaShulkerBox"]="minecraft:magenta_shulker_box";MinecraftBlockTypes2["MagentaStainedGlass"]="minecraft:magenta_stained_glass";MinecraftBlockTypes2["MagentaStainedGlassPane"]="minecraft:magenta_stained_glass_pane";MinecraftBlockTypes2["MagentaTerracotta"]="minecraft:magenta_terracotta";MinecraftBlockTypes2["MagentaWool"]="minecraft:magenta_wool";MinecraftBlockTypes2["Magma"]="minecraft:magma";MinecraftBlockTypes2["MangroveButton"]="minecraft:mangrove_button";MinecraftBlockTypes2["MangroveDoor"]="minecraft:mangrove_door";MinecraftBlockTypes2["MangroveDoubleSlab"]="minecraft:mangrove_double_slab";MinecraftBlockTypes2["MangroveFence"]="minecraft:mangrove_fence";MinecraftBlockTypes2["MangroveFenceGate"]="minecraft:mangrove_fence_gate";MinecraftBlockTypes2["MangroveHangingSign"]="minecraft:mangrove_hanging_sign";MinecraftBlockTypes2["MangroveLeaves"]="minecraft:mangrove_leaves";MinecraftBlockTypes2["MangroveLog"]="minecraft:mangrove_log";MinecraftBlockTypes2["MangrovePlanks"]="minecraft:mangrove_planks";MinecraftBlockTypes2["MangrovePressurePlate"]="minecraft:mangrove_pressure_plate";MinecraftBlockTypes2["MangrovePropagule"]="minecraft:mangrove_propagule";MinecraftBlockTypes2["MangroveRoots"]="minecraft:mangrove_roots";MinecraftBlockTypes2["MangroveSlab"]="minecraft:mangrove_slab";MinecraftBlockTypes2["MangroveStairs"]="minecraft:mangrove_stairs";MinecraftBlockTypes2["MangroveStandingSign"]="minecraft:mangrove_standing_sign";MinecraftBlockTypes2["MangroveTrapdoor"]="minecraft:mangrove_trapdoor";MinecraftBlockTypes2["MangroveWallSign"]="minecraft:mangrove_wall_sign";MinecraftBlockTypes2["MangroveWood"]="minecraft:mangrove_wood";MinecraftBlockTypes2["MaterialReducer"]="minecraft:material_reducer";MinecraftBlockTypes2["MediumAmethystBud"]="minecraft:medium_amethyst_bud";MinecraftBlockTypes2["MelonBlock"]="minecraft:melon_block";MinecraftBlockTypes2["MelonStem"]="minecraft:melon_stem";MinecraftBlockTypes2["MobSpawner"]="minecraft:mob_spawner";MinecraftBlockTypes2["MossBlock"]="minecraft:moss_block";MinecraftBlockTypes2["MossCarpet"]="minecraft:moss_carpet";MinecraftBlockTypes2["MossyCobblestone"]="minecraft:mossy_cobblestone";MinecraftBlockTypes2["MossyCobblestoneDoubleSlab"]="minecraft:mossy_cobblestone_double_slab";MinecraftBlockTypes2["MossyCobblestoneSlab"]="minecraft:mossy_cobblestone_slab";MinecraftBlockTypes2["MossyCobblestoneStairs"]="minecraft:mossy_cobblestone_stairs";MinecraftBlockTypes2["MossyCobblestoneWall"]="minecraft:mossy_cobblestone_wall";MinecraftBlockTypes2["MossyStoneBrickDoubleSlab"]="minecraft:mossy_stone_brick_double_slab";MinecraftBlockTypes2["MossyStoneBrickSlab"]="minecraft:mossy_stone_brick_slab";MinecraftBlockTypes2["MossyStoneBrickStairs"]="minecraft:mossy_stone_brick_stairs";MinecraftBlockTypes2["MossyStoneBrickWall"]="minecraft:mossy_stone_brick_wall";MinecraftBlockTypes2["MossyStoneBricks"]="minecraft:mossy_stone_bricks";MinecraftBlockTypes2["MovingBlock"]="minecraft:moving_block";MinecraftBlockTypes2["Mud"]="minecraft:mud";MinecraftBlockTypes2["MudBrickDoubleSlab"]="minecraft:mud_brick_double_slab";MinecraftBlockTypes2["MudBrickSlab"]="minecraft:mud_brick_slab";MinecraftBlockTypes2["MudBrickStairs"]="minecraft:mud_brick_stairs";MinecraftBlockTypes2["MudBrickWall"]="minecraft:mud_brick_wall";MinecraftBlockTypes2["MudBricks"]="minecraft:mud_bricks";MinecraftBlockTypes2["MuddyMangroveRoots"]="minecraft:muddy_mangrove_roots";MinecraftBlockTypes2["Mycelium"]="minecraft:mycelium";MinecraftBlockTypes2["NetherBrick"]="minecraft:nether_brick";MinecraftBlockTypes2["NetherBrickDoubleSlab"]="minecraft:nether_brick_double_slab";MinecraftBlockTypes2["NetherBrickFence"]="minecraft:nether_brick_fence";MinecraftBlockTypes2["NetherBrickSlab"]="minecraft:nether_brick_slab";MinecraftBlockTypes2["NetherBrickStairs"]="minecraft:nether_brick_stairs";MinecraftBlockTypes2["NetherBrickWall"]="minecraft:nether_brick_wall";MinecraftBlockTypes2["NetherGoldOre"]="minecraft:nether_gold_ore";MinecraftBlockTypes2["NetherSprouts"]="minecraft:nether_sprouts";MinecraftBlockTypes2["NetherWart"]="minecraft:nether_wart";MinecraftBlockTypes2["NetherWartBlock"]="minecraft:nether_wart_block";MinecraftBlockTypes2["NetheriteBlock"]="minecraft:netherite_block";MinecraftBlockTypes2["Netherrack"]="minecraft:netherrack";MinecraftBlockTypes2["Netherreactor"]="minecraft:netherreactor";MinecraftBlockTypes2["NormalStoneDoubleSlab"]="minecraft:normal_stone_double_slab";MinecraftBlockTypes2["NormalStoneSlab"]="minecraft:normal_stone_slab";MinecraftBlockTypes2["NormalStoneStairs"]="minecraft:normal_stone_stairs";MinecraftBlockTypes2["Noteblock"]="minecraft:noteblock";MinecraftBlockTypes2["OakDoubleSlab"]="minecraft:oak_double_slab";MinecraftBlockTypes2["OakFence"]="minecraft:oak_fence";MinecraftBlockTypes2["OakHangingSign"]="minecraft:oak_hanging_sign";MinecraftBlockTypes2["OakLeaves"]="minecraft:oak_leaves";MinecraftBlockTypes2["OakLog"]="minecraft:oak_log";MinecraftBlockTypes2["OakPlanks"]="minecraft:oak_planks";MinecraftBlockTypes2["OakSapling"]="minecraft:oak_sapling";MinecraftBlockTypes2["OakSlab"]="minecraft:oak_slab";MinecraftBlockTypes2["OakStairs"]="minecraft:oak_stairs";MinecraftBlockTypes2["OakWood"]="minecraft:oak_wood";MinecraftBlockTypes2["Observer"]="minecraft:observer";MinecraftBlockTypes2["Obsidian"]="minecraft:obsidian";MinecraftBlockTypes2["OchreFroglight"]="minecraft:ochre_froglight";MinecraftBlockTypes2["OrangeCandle"]="minecraft:orange_candle";MinecraftBlockTypes2["OrangeCandleCake"]="minecraft:orange_candle_cake";MinecraftBlockTypes2["OrangeCarpet"]="minecraft:orange_carpet";MinecraftBlockTypes2["OrangeConcrete"]="minecraft:orange_concrete";MinecraftBlockTypes2["OrangeConcretePowder"]="minecraft:orange_concrete_powder";MinecraftBlockTypes2["OrangeGlazedTerracotta"]="minecraft:orange_glazed_terracotta";MinecraftBlockTypes2["OrangeShulkerBox"]="minecraft:orange_shulker_box";MinecraftBlockTypes2["OrangeStainedGlass"]="minecraft:orange_stained_glass";MinecraftBlockTypes2["OrangeStainedGlassPane"]="minecraft:orange_stained_glass_pane";MinecraftBlockTypes2["OrangeTerracotta"]="minecraft:orange_terracotta";MinecraftBlockTypes2["OrangeTulip"]="minecraft:orange_tulip";MinecraftBlockTypes2["OrangeWool"]="minecraft:orange_wool";MinecraftBlockTypes2["OxeyeDaisy"]="minecraft:oxeye_daisy";MinecraftBlockTypes2["OxidizedChiseledCopper"]="minecraft:oxidized_chiseled_copper";MinecraftBlockTypes2["OxidizedCopper"]="minecraft:oxidized_copper";MinecraftBlockTypes2["OxidizedCopperBulb"]="minecraft:oxidized_copper_bulb";MinecraftBlockTypes2["OxidizedCopperDoor"]="minecraft:oxidized_copper_door";MinecraftBlockTypes2["OxidizedCopperGrate"]="minecraft:oxidized_copper_grate";MinecraftBlockTypes2["OxidizedCopperTrapdoor"]="minecraft:oxidized_copper_trapdoor";MinecraftBlockTypes2["OxidizedCutCopper"]="minecraft:oxidized_cut_copper";MinecraftBlockTypes2["OxidizedCutCopperSlab"]="minecraft:oxidized_cut_copper_slab";MinecraftBlockTypes2["OxidizedCutCopperStairs"]="minecraft:oxidized_cut_copper_stairs";MinecraftBlockTypes2["OxidizedDoubleCutCopperSlab"]="minecraft:oxidized_double_cut_copper_slab";MinecraftBlockTypes2["PackedIce"]="minecraft:packed_ice";MinecraftBlockTypes2["PackedMud"]="minecraft:packed_mud";MinecraftBlockTypes2["PearlescentFroglight"]="minecraft:pearlescent_froglight";MinecraftBlockTypes2["Peony"]="minecraft:peony";MinecraftBlockTypes2["PetrifiedOakDoubleSlab"]="minecraft:petrified_oak_double_slab";MinecraftBlockTypes2["PetrifiedOakSlab"]="minecraft:petrified_oak_slab";MinecraftBlockTypes2["PinkCandle"]="minecraft:pink_candle";MinecraftBlockTypes2["PinkCandleCake"]="minecraft:pink_candle_cake";MinecraftBlockTypes2["PinkCarpet"]="minecraft:pink_carpet";MinecraftBlockTypes2["PinkConcrete"]="minecraft:pink_concrete";MinecraftBlockTypes2["PinkConcretePowder"]="minecraft:pink_concrete_powder";MinecraftBlockTypes2["PinkGlazedTerracotta"]="minecraft:pink_glazed_terracotta";MinecraftBlockTypes2["PinkPetals"]="minecraft:pink_petals";MinecraftBlockTypes2["PinkShulkerBox"]="minecraft:pink_shulker_box";MinecraftBlockTypes2["PinkStainedGlass"]="minecraft:pink_stained_glass";MinecraftBlockTypes2["PinkStainedGlassPane"]="minecraft:pink_stained_glass_pane";MinecraftBlockTypes2["PinkTerracotta"]="minecraft:pink_terracotta";MinecraftBlockTypes2["PinkTulip"]="minecraft:pink_tulip";MinecraftBlockTypes2["PinkWool"]="minecraft:pink_wool";MinecraftBlockTypes2["Piston"]="minecraft:piston";MinecraftBlockTypes2["PistonArmCollision"]="minecraft:piston_arm_collision";MinecraftBlockTypes2["PitcherCrop"]="minecraft:pitcher_crop";MinecraftBlockTypes2["PitcherPlant"]="minecraft:pitcher_plant";MinecraftBlockTypes2["Podzol"]="minecraft:podzol";MinecraftBlockTypes2["PointedDripstone"]="minecraft:pointed_dripstone";MinecraftBlockTypes2["PolishedAndesite"]="minecraft:polished_andesite";MinecraftBlockTypes2["PolishedAndesiteDoubleSlab"]="minecraft:polished_andesite_double_slab";MinecraftBlockTypes2["PolishedAndesiteSlab"]="minecraft:polished_andesite_slab";MinecraftBlockTypes2["PolishedAndesiteStairs"]="minecraft:polished_andesite_stairs";MinecraftBlockTypes2["PolishedBasalt"]="minecraft:polished_basalt";MinecraftBlockTypes2["PolishedBlackstone"]="minecraft:polished_blackstone";MinecraftBlockTypes2["PolishedBlackstoneBrickDoubleSlab"]="minecraft:polished_blackstone_brick_double_slab";MinecraftBlockTypes2["PolishedBlackstoneBrickSlab"]="minecraft:polished_blackstone_brick_slab";MinecraftBlockTypes2["PolishedBlackstoneBrickStairs"]="minecraft:polished_blackstone_brick_stairs";MinecraftBlockTypes2["PolishedBlackstoneBrickWall"]="minecraft:polished_blackstone_brick_wall";MinecraftBlockTypes2["PolishedBlackstoneBricks"]="minecraft:polished_blackstone_bricks";MinecraftBlockTypes2["PolishedBlackstoneButton"]="minecraft:polished_blackstone_button";MinecraftBlockTypes2["PolishedBlackstoneDoubleSlab"]="minecraft:polished_blackstone_double_slab";MinecraftBlockTypes2["PolishedBlackstonePressurePlate"]="minecraft:polished_blackstone_pressure_plate";MinecraftBlockTypes2["PolishedBlackstoneSlab"]="minecraft:polished_blackstone_slab";MinecraftBlockTypes2["PolishedBlackstoneStairs"]="minecraft:polished_blackstone_stairs";MinecraftBlockTypes2["PolishedBlackstoneWall"]="minecraft:polished_blackstone_wall";MinecraftBlockTypes2["PolishedDeepslate"]="minecraft:polished_deepslate";MinecraftBlockTypes2["PolishedDeepslateDoubleSlab"]="minecraft:polished_deepslate_double_slab";MinecraftBlockTypes2["PolishedDeepslateSlab"]="minecraft:polished_deepslate_slab";MinecraftBlockTypes2["PolishedDeepslateStairs"]="minecraft:polished_deepslate_stairs";MinecraftBlockTypes2["PolishedDeepslateWall"]="minecraft:polished_deepslate_wall";MinecraftBlockTypes2["PolishedDiorite"]="minecraft:polished_diorite";MinecraftBlockTypes2["PolishedDioriteDoubleSlab"]="minecraft:polished_diorite_double_slab";MinecraftBlockTypes2["PolishedDioriteSlab"]="minecraft:polished_diorite_slab";MinecraftBlockTypes2["PolishedDioriteStairs"]="minecraft:polished_diorite_stairs";MinecraftBlockTypes2["PolishedGranite"]="minecraft:polished_granite";MinecraftBlockTypes2["PolishedGraniteDoubleSlab"]="minecraft:polished_granite_double_slab";MinecraftBlockTypes2["PolishedGraniteSlab"]="minecraft:polished_granite_slab";MinecraftBlockTypes2["PolishedGraniteStairs"]="minecraft:polished_granite_stairs";MinecraftBlockTypes2["PolishedTuff"]="minecraft:polished_tuff";MinecraftBlockTypes2["PolishedTuffDoubleSlab"]="minecraft:polished_tuff_double_slab";MinecraftBlockTypes2["PolishedTuffSlab"]="minecraft:polished_tuff_slab";MinecraftBlockTypes2["PolishedTuffStairs"]="minecraft:polished_tuff_stairs";MinecraftBlockTypes2["PolishedTuffWall"]="minecraft:polished_tuff_wall";MinecraftBlockTypes2["Poppy"]="minecraft:poppy";MinecraftBlockTypes2["Portal"]="minecraft:portal";MinecraftBlockTypes2["Potatoes"]="minecraft:potatoes";MinecraftBlockTypes2["PowderSnow"]="minecraft:powder_snow";MinecraftBlockTypes2["PoweredComparator"]="minecraft:powered_comparator";MinecraftBlockTypes2["PoweredRepeater"]="minecraft:powered_repeater";MinecraftBlockTypes2["Prismarine"]="minecraft:prismarine";MinecraftBlockTypes2["PrismarineBrickDoubleSlab"]="minecraft:prismarine_brick_double_slab";MinecraftBlockTypes2["PrismarineBrickSlab"]="minecraft:prismarine_brick_slab";MinecraftBlockTypes2["PrismarineBricks"]="minecraft:prismarine_bricks";MinecraftBlockTypes2["PrismarineBricksStairs"]="minecraft:prismarine_bricks_stairs";MinecraftBlockTypes2["PrismarineDoubleSlab"]="minecraft:prismarine_double_slab";MinecraftBlockTypes2["PrismarineSlab"]="minecraft:prismarine_slab";MinecraftBlockTypes2["PrismarineStairs"]="minecraft:prismarine_stairs";MinecraftBlockTypes2["PrismarineWall"]="minecraft:prismarine_wall";MinecraftBlockTypes2["Pumpkin"]="minecraft:pumpkin";MinecraftBlockTypes2["PumpkinStem"]="minecraft:pumpkin_stem";MinecraftBlockTypes2["PurpleCandle"]="minecraft:purple_candle";MinecraftBlockTypes2["PurpleCandleCake"]="minecraft:purple_candle_cake";MinecraftBlockTypes2["PurpleCarpet"]="minecraft:purple_carpet";MinecraftBlockTypes2["PurpleConcrete"]="minecraft:purple_concrete";MinecraftBlockTypes2["PurpleConcretePowder"]="minecraft:purple_concrete_powder";MinecraftBlockTypes2["PurpleGlazedTerracotta"]="minecraft:purple_glazed_terracotta";MinecraftBlockTypes2["PurpleShulkerBox"]="minecraft:purple_shulker_box";MinecraftBlockTypes2["PurpleStainedGlass"]="minecraft:purple_stained_glass";MinecraftBlockTypes2["PurpleStainedGlassPane"]="minecraft:purple_stained_glass_pane";MinecraftBlockTypes2["PurpleTerracotta"]="minecraft:purple_terracotta";MinecraftBlockTypes2["PurpleWool"]="minecraft:purple_wool";MinecraftBlockTypes2["PurpurBlock"]="minecraft:purpur_block";MinecraftBlockTypes2["PurpurDoubleSlab"]="minecraft:purpur_double_slab";MinecraftBlockTypes2["PurpurPillar"]="minecraft:purpur_pillar";MinecraftBlockTypes2["PurpurSlab"]="minecraft:purpur_slab";MinecraftBlockTypes2["PurpurStairs"]="minecraft:purpur_stairs";MinecraftBlockTypes2["QuartzBlock"]="minecraft:quartz_block";MinecraftBlockTypes2["QuartzBricks"]="minecraft:quartz_bricks";MinecraftBlockTypes2["QuartzDoubleSlab"]="minecraft:quartz_double_slab";MinecraftBlockTypes2["QuartzOre"]="minecraft:quartz_ore";MinecraftBlockTypes2["QuartzPillar"]="minecraft:quartz_pillar";MinecraftBlockTypes2["QuartzSlab"]="minecraft:quartz_slab";MinecraftBlockTypes2["QuartzStairs"]="minecraft:quartz_stairs";MinecraftBlockTypes2["Rail"]="minecraft:rail";MinecraftBlockTypes2["RawCopperBlock"]="minecraft:raw_copper_block";MinecraftBlockTypes2["RawGoldBlock"]="minecraft:raw_gold_block";MinecraftBlockTypes2["RawIronBlock"]="minecraft:raw_iron_block";MinecraftBlockTypes2["RedCandle"]="minecraft:red_candle";MinecraftBlockTypes2["RedCandleCake"]="minecraft:red_candle_cake";MinecraftBlockTypes2["RedCarpet"]="minecraft:red_carpet";MinecraftBlockTypes2["RedConcrete"]="minecraft:red_concrete";MinecraftBlockTypes2["RedConcretePowder"]="minecraft:red_concrete_powder";MinecraftBlockTypes2["RedGlazedTerracotta"]="minecraft:red_glazed_terracotta";MinecraftBlockTypes2["RedMushroom"]="minecraft:red_mushroom";MinecraftBlockTypes2["RedMushroomBlock"]="minecraft:red_mushroom_block";MinecraftBlockTypes2["RedNetherBrick"]="minecraft:red_nether_brick";MinecraftBlockTypes2["RedNetherBrickDoubleSlab"]="minecraft:red_nether_brick_double_slab";MinecraftBlockTypes2["RedNetherBrickSlab"]="minecraft:red_nether_brick_slab";MinecraftBlockTypes2["RedNetherBrickStairs"]="minecraft:red_nether_brick_stairs";MinecraftBlockTypes2["RedNetherBrickWall"]="minecraft:red_nether_brick_wall";MinecraftBlockTypes2["RedSand"]="minecraft:red_sand";MinecraftBlockTypes2["RedSandstone"]="minecraft:red_sandstone";MinecraftBlockTypes2["RedSandstoneDoubleSlab"]="minecraft:red_sandstone_double_slab";MinecraftBlockTypes2["RedSandstoneSlab"]="minecraft:red_sandstone_slab";MinecraftBlockTypes2["RedSandstoneStairs"]="minecraft:red_sandstone_stairs";MinecraftBlockTypes2["RedSandstoneWall"]="minecraft:red_sandstone_wall";MinecraftBlockTypes2["RedShulkerBox"]="minecraft:red_shulker_box";MinecraftBlockTypes2["RedStainedGlass"]="minecraft:red_stained_glass";MinecraftBlockTypes2["RedStainedGlassPane"]="minecraft:red_stained_glass_pane";MinecraftBlockTypes2["RedTerracotta"]="minecraft:red_terracotta";MinecraftBlockTypes2["RedTulip"]="minecraft:red_tulip";MinecraftBlockTypes2["RedWool"]="minecraft:red_wool";MinecraftBlockTypes2["RedstoneBlock"]="minecraft:redstone_block";MinecraftBlockTypes2["RedstoneLamp"]="minecraft:redstone_lamp";MinecraftBlockTypes2["RedstoneOre"]="minecraft:redstone_ore";MinecraftBlockTypes2["RedstoneTorch"]="minecraft:redstone_torch";MinecraftBlockTypes2["RedstoneWire"]="minecraft:redstone_wire";MinecraftBlockTypes2["Reeds"]="minecraft:reeds";MinecraftBlockTypes2["ReinforcedDeepslate"]="minecraft:reinforced_deepslate";MinecraftBlockTypes2["RepeatingCommandBlock"]="minecraft:repeating_command_block";MinecraftBlockTypes2["Reserved6"]="minecraft:reserved6";MinecraftBlockTypes2["RespawnAnchor"]="minecraft:respawn_anchor";MinecraftBlockTypes2["RoseBush"]="minecraft:rose_bush";MinecraftBlockTypes2["Sand"]="minecraft:sand";MinecraftBlockTypes2["Sandstone"]="minecraft:sandstone";MinecraftBlockTypes2["SandstoneDoubleSlab"]="minecraft:sandstone_double_slab";MinecraftBlockTypes2["SandstoneSlab"]="minecraft:sandstone_slab";MinecraftBlockTypes2["SandstoneStairs"]="minecraft:sandstone_stairs";MinecraftBlockTypes2["SandstoneWall"]="minecraft:sandstone_wall";MinecraftBlockTypes2["Scaffolding"]="minecraft:scaffolding";MinecraftBlockTypes2["Sculk"]="minecraft:sculk";MinecraftBlockTypes2["SculkCatalyst"]="minecraft:sculk_catalyst";MinecraftBlockTypes2["SculkSensor"]="minecraft:sculk_sensor";MinecraftBlockTypes2["SculkShrieker"]="minecraft:sculk_shrieker";MinecraftBlockTypes2["SculkVein"]="minecraft:sculk_vein";MinecraftBlockTypes2["SeaLantern"]="minecraft:sea_lantern";MinecraftBlockTypes2["SeaPickle"]="minecraft:sea_pickle";MinecraftBlockTypes2["Seagrass"]="minecraft:seagrass";MinecraftBlockTypes2["ShortGrass"]="minecraft:short_grass";MinecraftBlockTypes2["Shroomlight"]="minecraft:shroomlight";MinecraftBlockTypes2["SilverGlazedTerracotta"]="minecraft:silver_glazed_terracotta";MinecraftBlockTypes2["Skull"]="minecraft:skull";MinecraftBlockTypes2["Slime"]="minecraft:slime";MinecraftBlockTypes2["SmallAmethystBud"]="minecraft:small_amethyst_bud";MinecraftBlockTypes2["SmallDripleafBlock"]="minecraft:small_dripleaf_block";MinecraftBlockTypes2["SmithingTable"]="minecraft:smithing_table";MinecraftBlockTypes2["Smoker"]="minecraft:smoker";MinecraftBlockTypes2["SmoothBasalt"]="minecraft:smooth_basalt";MinecraftBlockTypes2["SmoothQuartz"]="minecraft:smooth_quartz";MinecraftBlockTypes2["SmoothQuartzDoubleSlab"]="minecraft:smooth_quartz_double_slab";MinecraftBlockTypes2["SmoothQuartzSlab"]="minecraft:smooth_quartz_slab";MinecraftBlockTypes2["SmoothQuartzStairs"]="minecraft:smooth_quartz_stairs";MinecraftBlockTypes2["SmoothRedSandstone"]="minecraft:smooth_red_sandstone";MinecraftBlockTypes2["SmoothRedSandstoneDoubleSlab"]="minecraft:smooth_red_sandstone_double_slab";MinecraftBlockTypes2["SmoothRedSandstoneSlab"]="minecraft:smooth_red_sandstone_slab";MinecraftBlockTypes2["SmoothRedSandstoneStairs"]="minecraft:smooth_red_sandstone_stairs";MinecraftBlockTypes2["SmoothSandstone"]="minecraft:smooth_sandstone";MinecraftBlockTypes2["SmoothSandstoneDoubleSlab"]="minecraft:smooth_sandstone_double_slab";MinecraftBlockTypes2["SmoothSandstoneSlab"]="minecraft:smooth_sandstone_slab";MinecraftBlockTypes2["SmoothSandstoneStairs"]="minecraft:smooth_sandstone_stairs";MinecraftBlockTypes2["SmoothStone"]="minecraft:smooth_stone";MinecraftBlockTypes2["SmoothStoneDoubleSlab"]="minecraft:smooth_stone_double_slab";MinecraftBlockTypes2["SmoothStoneSlab"]="minecraft:smooth_stone_slab";MinecraftBlockTypes2["SnifferEgg"]="minecraft:sniffer_egg";MinecraftBlockTypes2["Snow"]="minecraft:snow";MinecraftBlockTypes2["SnowLayer"]="minecraft:snow_layer";MinecraftBlockTypes2["SoulCampfire"]="minecraft:soul_campfire";MinecraftBlockTypes2["SoulFire"]="minecraft:soul_fire";MinecraftBlockTypes2["SoulLantern"]="minecraft:soul_lantern";MinecraftBlockTypes2["SoulSand"]="minecraft:soul_sand";MinecraftBlockTypes2["SoulSoil"]="minecraft:soul_soil";MinecraftBlockTypes2["SoulTorch"]="minecraft:soul_torch";MinecraftBlockTypes2["Sponge"]="minecraft:sponge";MinecraftBlockTypes2["SporeBlossom"]="minecraft:spore_blossom";MinecraftBlockTypes2["SpruceButton"]="minecraft:spruce_button";MinecraftBlockTypes2["SpruceDoor"]="minecraft:spruce_door";MinecraftBlockTypes2["SpruceDoubleSlab"]="minecraft:spruce_double_slab";MinecraftBlockTypes2["SpruceFence"]="minecraft:spruce_fence";MinecraftBlockTypes2["SpruceFenceGate"]="minecraft:spruce_fence_gate";MinecraftBlockTypes2["SpruceHangingSign"]="minecraft:spruce_hanging_sign";MinecraftBlockTypes2["SpruceLeaves"]="minecraft:spruce_leaves";MinecraftBlockTypes2["SpruceLog"]="minecraft:spruce_log";MinecraftBlockTypes2["SprucePlanks"]="minecraft:spruce_planks";MinecraftBlockTypes2["SprucePressurePlate"]="minecraft:spruce_pressure_plate";MinecraftBlockTypes2["SpruceSapling"]="minecraft:spruce_sapling";MinecraftBlockTypes2["SpruceSlab"]="minecraft:spruce_slab";MinecraftBlockTypes2["SpruceStairs"]="minecraft:spruce_stairs";MinecraftBlockTypes2["SpruceStandingSign"]="minecraft:spruce_standing_sign";MinecraftBlockTypes2["SpruceTrapdoor"]="minecraft:spruce_trapdoor";MinecraftBlockTypes2["SpruceWallSign"]="minecraft:spruce_wall_sign";MinecraftBlockTypes2["SpruceWood"]="minecraft:spruce_wood";MinecraftBlockTypes2["StandingBanner"]="minecraft:standing_banner";MinecraftBlockTypes2["StandingSign"]="minecraft:standing_sign";MinecraftBlockTypes2["StickyPiston"]="minecraft:sticky_piston";MinecraftBlockTypes2["StickyPistonArmCollision"]="minecraft:sticky_piston_arm_collision";MinecraftBlockTypes2["Stone"]="minecraft:stone";MinecraftBlockTypes2["StoneBrickDoubleSlab"]="minecraft:stone_brick_double_slab";MinecraftBlockTypes2["StoneBrickSlab"]="minecraft:stone_brick_slab";MinecraftBlockTypes2["StoneBrickStairs"]="minecraft:stone_brick_stairs";MinecraftBlockTypes2["StoneBrickWall"]="minecraft:stone_brick_wall";MinecraftBlockTypes2["StoneBricks"]="minecraft:stone_bricks";MinecraftBlockTypes2["StoneButton"]="minecraft:stone_button";MinecraftBlockTypes2["StonePressurePlate"]="minecraft:stone_pressure_plate";MinecraftBlockTypes2["StoneStairs"]="minecraft:stone_stairs";MinecraftBlockTypes2["Stonecutter"]="minecraft:stonecutter";MinecraftBlockTypes2["StonecutterBlock"]="minecraft:stonecutter_block";MinecraftBlockTypes2["StrippedAcaciaLog"]="minecraft:stripped_acacia_log";MinecraftBlockTypes2["StrippedAcaciaWood"]="minecraft:stripped_acacia_wood";MinecraftBlockTypes2["StrippedBambooBlock"]="minecraft:stripped_bamboo_block";MinecraftBlockTypes2["StrippedBirchLog"]="minecraft:stripped_birch_log";MinecraftBlockTypes2["StrippedBirchWood"]="minecraft:stripped_birch_wood";MinecraftBlockTypes2["StrippedCherryLog"]="minecraft:stripped_cherry_log";MinecraftBlockTypes2["StrippedCherryWood"]="minecraft:stripped_cherry_wood";MinecraftBlockTypes2["StrippedCrimsonHyphae"]="minecraft:stripped_crimson_hyphae";MinecraftBlockTypes2["StrippedCrimsonStem"]="minecraft:stripped_crimson_stem";MinecraftBlockTypes2["StrippedDarkOakLog"]="minecraft:stripped_dark_oak_log";MinecraftBlockTypes2["StrippedDarkOakWood"]="minecraft:stripped_dark_oak_wood";MinecraftBlockTypes2["StrippedJungleLog"]="minecraft:stripped_jungle_log";MinecraftBlockTypes2["StrippedJungleWood"]="minecraft:stripped_jungle_wood";MinecraftBlockTypes2["StrippedMangroveLog"]="minecraft:stripped_mangrove_log";MinecraftBlockTypes2["StrippedMangroveWood"]="minecraft:stripped_mangrove_wood";MinecraftBlockTypes2["StrippedOakLog"]="minecraft:stripped_oak_log";MinecraftBlockTypes2["StrippedOakWood"]="minecraft:stripped_oak_wood";MinecraftBlockTypes2["StrippedSpruceLog"]="minecraft:stripped_spruce_log";MinecraftBlockTypes2["StrippedSpruceWood"]="minecraft:stripped_spruce_wood";MinecraftBlockTypes2["StrippedWarpedHyphae"]="minecraft:stripped_warped_hyphae";MinecraftBlockTypes2["StrippedWarpedStem"]="minecraft:stripped_warped_stem";MinecraftBlockTypes2["StructureBlock"]="minecraft:structure_block";MinecraftBlockTypes2["StructureVoid"]="minecraft:structure_void";MinecraftBlockTypes2["Sunflower"]="minecraft:sunflower";MinecraftBlockTypes2["SuspiciousGravel"]="minecraft:suspicious_gravel";MinecraftBlockTypes2["SuspiciousSand"]="minecraft:suspicious_sand";MinecraftBlockTypes2["SweetBerryBush"]="minecraft:sweet_berry_bush";MinecraftBlockTypes2["TallGrass"]="minecraft:tall_grass";MinecraftBlockTypes2["Target"]="minecraft:target";MinecraftBlockTypes2["TintedGlass"]="minecraft:tinted_glass";MinecraftBlockTypes2["Tnt"]="minecraft:tnt";MinecraftBlockTypes2["Torch"]="minecraft:torch";MinecraftBlockTypes2["Torchflower"]="minecraft:torchflower";MinecraftBlockTypes2["TorchflowerCrop"]="minecraft:torchflower_crop";MinecraftBlockTypes2["Trapdoor"]="minecraft:trapdoor";MinecraftBlockTypes2["TrappedChest"]="minecraft:trapped_chest";MinecraftBlockTypes2["TrialSpawner"]="minecraft:trial_spawner";MinecraftBlockTypes2["TripWire"]="minecraft:trip_wire";MinecraftBlockTypes2["TripwireHook"]="minecraft:tripwire_hook";MinecraftBlockTypes2["TubeCoral"]="minecraft:tube_coral";MinecraftBlockTypes2["TubeCoralBlock"]="minecraft:tube_coral_block";MinecraftBlockTypes2["TubeCoralFan"]="minecraft:tube_coral_fan";MinecraftBlockTypes2["TubeCoralWallFan"]="minecraft:tube_coral_wall_fan";MinecraftBlockTypes2["Tuff"]="minecraft:tuff";MinecraftBlockTypes2["TuffBrickDoubleSlab"]="minecraft:tuff_brick_double_slab";MinecraftBlockTypes2["TuffBrickSlab"]="minecraft:tuff_brick_slab";MinecraftBlockTypes2["TuffBrickStairs"]="minecraft:tuff_brick_stairs";MinecraftBlockTypes2["TuffBrickWall"]="minecraft:tuff_brick_wall";MinecraftBlockTypes2["TuffBricks"]="minecraft:tuff_bricks";MinecraftBlockTypes2["TuffDoubleSlab"]="minecraft:tuff_double_slab";MinecraftBlockTypes2["TuffSlab"]="minecraft:tuff_slab";MinecraftBlockTypes2["TuffStairs"]="minecraft:tuff_stairs";MinecraftBlockTypes2["TuffWall"]="minecraft:tuff_wall";MinecraftBlockTypes2["TurtleEgg"]="minecraft:turtle_egg";MinecraftBlockTypes2["TwistingVines"]="minecraft:twisting_vines";MinecraftBlockTypes2["UnderwaterTnt"]="minecraft:underwater_tnt";MinecraftBlockTypes2["UnderwaterTorch"]="minecraft:underwater_torch";MinecraftBlockTypes2["UndyedShulkerBox"]="minecraft:undyed_shulker_box";MinecraftBlockTypes2["Unknown"]="minecraft:unknown";MinecraftBlockTypes2["UnlitRedstoneTorch"]="minecraft:unlit_redstone_torch";MinecraftBlockTypes2["UnpoweredComparator"]="minecraft:unpowered_comparator";MinecraftBlockTypes2["UnpoweredRepeater"]="minecraft:unpowered_repeater";MinecraftBlockTypes2["Vault"]="minecraft:vault";MinecraftBlockTypes2["VerdantFroglight"]="minecraft:verdant_froglight";MinecraftBlockTypes2["Vine"]="minecraft:vine";MinecraftBlockTypes2["WallBanner"]="minecraft:wall_banner";MinecraftBlockTypes2["WallSign"]="minecraft:wall_sign";MinecraftBlockTypes2["WarpedButton"]="minecraft:warped_button";MinecraftBlockTypes2["WarpedDoor"]="minecraft:warped_door";MinecraftBlockTypes2["WarpedDoubleSlab"]="minecraft:warped_double_slab";MinecraftBlockTypes2["WarpedFence"]="minecraft:warped_fence";MinecraftBlockTypes2["WarpedFenceGate"]="minecraft:warped_fence_gate";MinecraftBlockTypes2["WarpedFungus"]="minecraft:warped_fungus";MinecraftBlockTypes2["WarpedHangingSign"]="minecraft:warped_hanging_sign";MinecraftBlockTypes2["WarpedHyphae"]="minecraft:warped_hyphae";MinecraftBlockTypes2["WarpedNylium"]="minecraft:warped_nylium";MinecraftBlockTypes2["WarpedPlanks"]="minecraft:warped_planks";MinecraftBlockTypes2["WarpedPressurePlate"]="minecraft:warped_pressure_plate";MinecraftBlockTypes2["WarpedRoots"]="minecraft:warped_roots";MinecraftBlockTypes2["WarpedSlab"]="minecraft:warped_slab";MinecraftBlockTypes2["WarpedStairs"]="minecraft:warped_stairs";MinecraftBlockTypes2["WarpedStandingSign"]="minecraft:warped_standing_sign";MinecraftBlockTypes2["WarpedStem"]="minecraft:warped_stem";MinecraftBlockTypes2["WarpedTrapdoor"]="minecraft:warped_trapdoor";MinecraftBlockTypes2["WarpedWallSign"]="minecraft:warped_wall_sign";MinecraftBlockTypes2["WarpedWartBlock"]="minecraft:warped_wart_block";MinecraftBlockTypes2["Water"]="minecraft:water";MinecraftBlockTypes2["Waterlily"]="minecraft:waterlily";MinecraftBlockTypes2["WaxedChiseledCopper"]="minecraft:waxed_chiseled_copper";MinecraftBlockTypes2["WaxedCopper"]="minecraft:waxed_copper";MinecraftBlockTypes2["WaxedCopperBulb"]="minecraft:waxed_copper_bulb";MinecraftBlockTypes2["WaxedCopperDoor"]="minecraft:waxed_copper_door";MinecraftBlockTypes2["WaxedCopperGrate"]="minecraft:waxed_copper_grate";MinecraftBlockTypes2["WaxedCopperTrapdoor"]="minecraft:waxed_copper_trapdoor";MinecraftBlockTypes2["WaxedCutCopper"]="minecraft:waxed_cut_copper";MinecraftBlockTypes2["WaxedCutCopperSlab"]="minecraft:waxed_cut_copper_slab";MinecraftBlockTypes2["WaxedCutCopperStairs"]="minecraft:waxed_cut_copper_stairs";MinecraftBlockTypes2["WaxedDoubleCutCopperSlab"]="minecraft:waxed_double_cut_copper_slab";MinecraftBlockTypes2["WaxedExposedChiseledCopper"]="minecraft:waxed_exposed_chiseled_copper";MinecraftBlockTypes2["WaxedExposedCopper"]="minecraft:waxed_exposed_copper";MinecraftBlockTypes2["WaxedExposedCopperBulb"]="minecraft:waxed_exposed_copper_bulb";MinecraftBlockTypes2["WaxedExposedCopperDoor"]="minecraft:waxed_exposed_copper_door";MinecraftBlockTypes2["WaxedExposedCopperGrate"]="minecraft:waxed_exposed_copper_grate";MinecraftBlockTypes2["WaxedExposedCopperTrapdoor"]="minecraft:waxed_exposed_copper_trapdoor";MinecraftBlockTypes2["WaxedExposedCutCopper"]="minecraft:waxed_exposed_cut_copper";MinecraftBlockTypes2["WaxedExposedCutCopperSlab"]="minecraft:waxed_exposed_cut_copper_slab";MinecraftBlockTypes2["WaxedExposedCutCopperStairs"]="minecraft:waxed_exposed_cut_copper_stairs";MinecraftBlockTypes2["WaxedExposedDoubleCutCopperSlab"]="minecraft:waxed_exposed_double_cut_copper_slab";MinecraftBlockTypes2["WaxedOxidizedChiseledCopper"]="minecraft:waxed_oxidized_chiseled_copper";MinecraftBlockTypes2["WaxedOxidizedCopper"]="minecraft:waxed_oxidized_copper";MinecraftBlockTypes2["WaxedOxidizedCopperBulb"]="minecraft:waxed_oxidized_copper_bulb";MinecraftBlockTypes2["WaxedOxidizedCopperDoor"]="minecraft:waxed_oxidized_copper_door";MinecraftBlockTypes2["WaxedOxidizedCopperGrate"]="minecraft:waxed_oxidized_copper_grate";MinecraftBlockTypes2["WaxedOxidizedCopperTrapdoor"]="minecraft:waxed_oxidized_copper_trapdoor";MinecraftBlockTypes2["WaxedOxidizedCutCopper"]="minecraft:waxed_oxidized_cut_copper";MinecraftBlockTypes2["WaxedOxidizedCutCopperSlab"]="minecraft:waxed_oxidized_cut_copper_slab";MinecraftBlockTypes2["WaxedOxidizedCutCopperStairs"]="minecraft:waxed_oxidized_cut_copper_stairs";MinecraftBlockTypes2["WaxedOxidizedDoubleCutCopperSlab"]="minecraft:waxed_oxidized_double_cut_copper_slab";MinecraftBlockTypes2["WaxedWeatheredChiseledCopper"]="minecraft:waxed_weathered_chiseled_copper";MinecraftBlockTypes2["WaxedWeatheredCopper"]="minecraft:waxed_weathered_copper";MinecraftBlockTypes2["WaxedWeatheredCopperBulb"]="minecraft:waxed_weathered_copper_bulb";MinecraftBlockTypes2["WaxedWeatheredCopperDoor"]="minecraft:waxed_weathered_copper_door";MinecraftBlockTypes2["WaxedWeatheredCopperGrate"]="minecraft:waxed_weathered_copper_grate";MinecraftBlockTypes2["WaxedWeatheredCopperTrapdoor"]="minecraft:waxed_weathered_copper_trapdoor";MinecraftBlockTypes2["WaxedWeatheredCutCopper"]="minecraft:waxed_weathered_cut_copper";MinecraftBlockTypes2["WaxedWeatheredCutCopperSlab"]="minecraft:waxed_weathered_cut_copper_slab";MinecraftBlockTypes2["WaxedWeatheredCutCopperStairs"]="minecraft:waxed_weathered_cut_copper_stairs";MinecraftBlockTypes2["WaxedWeatheredDoubleCutCopperSlab"]="minecraft:waxed_weathered_double_cut_copper_slab";MinecraftBlockTypes2["WeatheredChiseledCopper"]="minecraft:weathered_chiseled_copper";MinecraftBlockTypes2["WeatheredCopper"]="minecraft:weathered_copper";MinecraftBlockTypes2["WeatheredCopperBulb"]="minecraft:weathered_copper_bulb";MinecraftBlockTypes2["WeatheredCopperDoor"]="minecraft:weathered_copper_door";MinecraftBlockTypes2["WeatheredCopperGrate"]="minecraft:weathered_copper_grate";MinecraftBlockTypes2["WeatheredCopperTrapdoor"]="minecraft:weathered_copper_trapdoor";MinecraftBlockTypes2["WeatheredCutCopper"]="minecraft:weathered_cut_copper";MinecraftBlockTypes2["WeatheredCutCopperSlab"]="minecraft:weathered_cut_copper_slab";MinecraftBlockTypes2["WeatheredCutCopperStairs"]="minecraft:weathered_cut_copper_stairs";MinecraftBlockTypes2["WeatheredDoubleCutCopperSlab"]="minecraft:weathered_double_cut_copper_slab";MinecraftBlockTypes2["Web"]="minecraft:web";MinecraftBlockTypes2["WeepingVines"]="minecraft:weeping_vines";MinecraftBlockTypes2["WetSponge"]="minecraft:wet_sponge";MinecraftBlockTypes2["Wheat"]="minecraft:wheat";MinecraftBlockTypes2["WhiteCandle"]="minecraft:white_candle";MinecraftBlockTypes2["WhiteCandleCake"]="minecraft:white_candle_cake";MinecraftBlockTypes2["WhiteCarpet"]="minecraft:white_carpet";MinecraftBlockTypes2["WhiteConcrete"]="minecraft:white_concrete";MinecraftBlockTypes2["WhiteConcretePowder"]="minecraft:white_concrete_powder";MinecraftBlockTypes2["WhiteGlazedTerracotta"]="minecraft:white_glazed_terracotta";MinecraftBlockTypes2["WhiteShulkerBox"]="minecraft:white_shulker_box";MinecraftBlockTypes2["WhiteStainedGlass"]="minecraft:white_stained_glass";MinecraftBlockTypes2["WhiteStainedGlassPane"]="minecraft:white_stained_glass_pane";MinecraftBlockTypes2["WhiteTerracotta"]="minecraft:white_terracotta";MinecraftBlockTypes2["WhiteTulip"]="minecraft:white_tulip";MinecraftBlockTypes2["WhiteWool"]="minecraft:white_wool";MinecraftBlockTypes2["WitherRose"]="minecraft:wither_rose";MinecraftBlockTypes2["WoodenButton"]="minecraft:wooden_button";MinecraftBlockTypes2["WoodenDoor"]="minecraft:wooden_door";MinecraftBlockTypes2["WoodenPressurePlate"]="minecraft:wooden_pressure_plate";MinecraftBlockTypes2["YellowCandle"]="minecraft:yellow_candle";MinecraftBlockTypes2["YellowCandleCake"]="minecraft:yellow_candle_cake";MinecraftBlockTypes2["YellowCarpet"]="minecraft:yellow_carpet";MinecraftBlockTypes2["YellowConcrete"]="minecraft:yellow_concrete";MinecraftBlockTypes2["YellowConcretePowder"]="minecraft:yellow_concrete_powder";MinecraftBlockTypes2["YellowGlazedTerracotta"]="minecraft:yellow_glazed_terracotta";MinecraftBlockTypes2["YellowShulkerBox"]="minecraft:yellow_shulker_box";MinecraftBlockTypes2["YellowStainedGlass"]="minecraft:yellow_stained_glass";MinecraftBlockTypes2["YellowStainedGlassPane"]="minecraft:yellow_stained_glass_pane";MinecraftBlockTypes2["YellowTerracotta"]="minecraft:yellow_terracotta";MinecraftBlockTypes2["YellowWool"]="minecraft:yellow_wool";return MinecraftBlockTypes2})(MinecraftBlockTypes||{});var MinecraftCameraPresetsTypes=(MinecraftCameraPresetsTypes2=>{MinecraftCameraPresetsTypes2["FirstPerson"]="minecraft:first_person";MinecraftCameraPresetsTypes2["FollowOrbit"]="minecraft:follow_orbit";MinecraftCameraPresetsTypes2["Free"]="minecraft:free";MinecraftCameraPresetsTypes2["ThirdPerson"]="minecraft:third_person";MinecraftCameraPresetsTypes2["ThirdPersonFront"]="minecraft:third_person_front";return MinecraftCameraPresetsTypes2})(MinecraftCameraPresetsTypes||{});var MinecraftCooldownCategoryTypes=(MinecraftCooldownCategoryTypes2=>{MinecraftCooldownCategoryTypes2["Chorusfruit"]="minecraft:chorusfruit";MinecraftCooldownCategoryTypes2["EnderPearl"]="minecraft:ender_pearl";MinecraftCooldownCategoryTypes2["GoatHorn"]="minecraft:goat_horn";MinecraftCooldownCategoryTypes2["Shield"]="minecraft:shield";MinecraftCooldownCategoryTypes2["WindCharge"]="minecraft:wind_charge";return MinecraftCooldownCategoryTypes2})(MinecraftCooldownCategoryTypes||{});var MinecraftDimensionTypes=(MinecraftDimensionTypes2=>{MinecraftDimensionTypes2["Nether"]="minecraft:nether";MinecraftDimensionTypes2["Overworld"]="minecraft:overworld";MinecraftDimensionTypes2["TheEnd"]="minecraft:the_end";return MinecraftDimensionTypes2})(MinecraftDimensionTypes||{});var MinecraftEffectTypes=(MinecraftEffectTypes2=>{MinecraftEffectTypes2["Absorption"]="minecraft:absorption";MinecraftEffectTypes2["BadOmen"]="minecraft:bad_omen";MinecraftEffectTypes2["Blindness"]="minecraft:blindness";MinecraftEffectTypes2["ConduitPower"]="minecraft:conduit_power";MinecraftEffectTypes2["Darkness"]="minecraft:darkness";MinecraftEffectTypes2["FatalPoison"]="minecraft:fatal_poison";MinecraftEffectTypes2["FireResistance"]="minecraft:fire_resistance";MinecraftEffectTypes2["Haste"]="minecraft:haste";MinecraftEffectTypes2["HealthBoost"]="minecraft:health_boost";MinecraftEffectTypes2["Hunger"]="minecraft:hunger";MinecraftEffectTypes2["Infested"]="minecraft:infested";MinecraftEffectTypes2["InstantDamage"]="minecraft:instant_damage";MinecraftEffectTypes2["InstantHealth"]="minecraft:instant_health";MinecraftEffectTypes2["Invisibility"]="minecraft:invisibility";MinecraftEffectTypes2["JumpBoost"]="minecraft:jump_boost";MinecraftEffectTypes2["Levitation"]="minecraft:levitation";MinecraftEffectTypes2["MiningFatigue"]="minecraft:mining_fatigue";MinecraftEffectTypes2["Nausea"]="minecraft:nausea";MinecraftEffectTypes2["NightVision"]="minecraft:night_vision";MinecraftEffectTypes2["Oozing"]="minecraft:oozing";MinecraftEffectTypes2["Poison"]="minecraft:poison";MinecraftEffectTypes2["RaidOmen"]="minecraft:raid_omen";MinecraftEffectTypes2["Regeneration"]="minecraft:regeneration";MinecraftEffectTypes2["Resistance"]="minecraft:resistance";MinecraftEffectTypes2["Saturation"]="minecraft:saturation";MinecraftEffectTypes2["SlowFalling"]="minecraft:slow_falling";MinecraftEffectTypes2["Slowness"]="minecraft:slowness";MinecraftEffectTypes2["Speed"]="minecraft:speed";MinecraftEffectTypes2["Strength"]="minecraft:strength";MinecraftEffectTypes2["TrialOmen"]="minecraft:trial_omen";MinecraftEffectTypes2["VillageHero"]="minecraft:village_hero";MinecraftEffectTypes2["WaterBreathing"]="minecraft:water_breathing";MinecraftEffectTypes2["Weakness"]="minecraft:weakness";MinecraftEffectTypes2["Weaving"]="minecraft:weaving";MinecraftEffectTypes2["WindCharged"]="minecraft:wind_charged";MinecraftEffectTypes2["Wither"]="minecraft:wither";return MinecraftEffectTypes2})(MinecraftEffectTypes||{});var MinecraftEnchantmentTypes=(MinecraftEnchantmentTypes2=>{MinecraftEnchantmentTypes2["AquaAffinity"]="minecraft:aqua_affinity";MinecraftEnchantmentTypes2["BaneOfArthropods"]="minecraft:bane_of_arthropods";MinecraftEnchantmentTypes2["Binding"]="minecraft:binding";MinecraftEnchantmentTypes2["BlastProtection"]="minecraft:blast_protection";MinecraftEnchantmentTypes2["BowInfinity"]="minecraft:infinity";MinecraftEnchantmentTypes2["Breach"]="minecraft:breach";MinecraftEnchantmentTypes2["Channeling"]="minecraft:channeling";MinecraftEnchantmentTypes2["Density"]="minecraft:density";MinecraftEnchantmentTypes2["DepthStrider"]="minecraft:depth_strider";MinecraftEnchantmentTypes2["Efficiency"]="minecraft:efficiency";MinecraftEnchantmentTypes2["FeatherFalling"]="minecraft:feather_falling";MinecraftEnchantmentTypes2["FireAspect"]="minecraft:fire_aspect";MinecraftEnchantmentTypes2["FireProtection"]="minecraft:fire_protection";MinecraftEnchantmentTypes2["Flame"]="minecraft:flame";MinecraftEnchantmentTypes2["Fortune"]="minecraft:fortune";MinecraftEnchantmentTypes2["FrostWalker"]="minecraft:frost_walker";MinecraftEnchantmentTypes2["Impaling"]="minecraft:impaling";MinecraftEnchantmentTypes2["Knockback"]="minecraft:knockback";MinecraftEnchantmentTypes2["Looting"]="minecraft:looting";MinecraftEnchantmentTypes2["Loyalty"]="minecraft:loyalty";MinecraftEnchantmentTypes2["LuckOfTheSea"]="minecraft:luck_of_the_sea";MinecraftEnchantmentTypes2["Lure"]="minecraft:lure";MinecraftEnchantmentTypes2["Mending"]="minecraft:mending";MinecraftEnchantmentTypes2["Multishot"]="minecraft:multishot";MinecraftEnchantmentTypes2["Piercing"]="minecraft:piercing";MinecraftEnchantmentTypes2["Power"]="minecraft:power";MinecraftEnchantmentTypes2["ProjectileProtection"]="minecraft:projectile_protection";MinecraftEnchantmentTypes2["Protection"]="minecraft:protection";MinecraftEnchantmentTypes2["Punch"]="minecraft:punch";MinecraftEnchantmentTypes2["QuickCharge"]="minecraft:quick_charge";MinecraftEnchantmentTypes2["Respiration"]="minecraft:respiration";MinecraftEnchantmentTypes2["Riptide"]="minecraft:riptide";MinecraftEnchantmentTypes2["Sharpness"]="minecraft:sharpness";MinecraftEnchantmentTypes2["SilkTouch"]="minecraft:silk_touch";MinecraftEnchantmentTypes2["Smite"]="minecraft:smite";MinecraftEnchantmentTypes2["SoulSpeed"]="minecraft:soul_speed";MinecraftEnchantmentTypes2["SwiftSneak"]="minecraft:swift_sneak";MinecraftEnchantmentTypes2["Thorns"]="minecraft:thorns";MinecraftEnchantmentTypes2["Unbreaking"]="minecraft:unbreaking";MinecraftEnchantmentTypes2["Vanishing"]="minecraft:vanishing";MinecraftEnchantmentTypes2["WindBurst"]="minecraft:wind_burst";return MinecraftEnchantmentTypes2})(MinecraftEnchantmentTypes||{});var MinecraftEntityTypes=(MinecraftEntityTypes2=>{MinecraftEntityTypes2["Agent"]="minecraft:agent";MinecraftEntityTypes2["Allay"]="minecraft:allay";MinecraftEntityTypes2["AreaEffectCloud"]="minecraft:area_effect_cloud";MinecraftEntityTypes2["Armadillo"]="minecraft:armadillo";MinecraftEntityTypes2["ArmorStand"]="minecraft:armor_stand";MinecraftEntityTypes2["Arrow"]="minecraft:arrow";MinecraftEntityTypes2["Axolotl"]="minecraft:axolotl";MinecraftEntityTypes2["Bat"]="minecraft:bat";MinecraftEntityTypes2["Bee"]="minecraft:bee";MinecraftEntityTypes2["Blaze"]="minecraft:blaze";MinecraftEntityTypes2["Boat"]="minecraft:boat";MinecraftEntityTypes2["Bogged"]="minecraft:bogged";MinecraftEntityTypes2["Breeze"]="minecraft:breeze";MinecraftEntityTypes2["BreezeWindChargeProjectile"]="minecraft:breeze_wind_charge_projectile";MinecraftEntityTypes2["Camel"]="minecraft:camel";MinecraftEntityTypes2["Cat"]="minecraft:cat";MinecraftEntityTypes2["CaveSpider"]="minecraft:cave_spider";MinecraftEntityTypes2["ChestBoat"]="minecraft:chest_boat";MinecraftEntityTypes2["ChestMinecart"]="minecraft:chest_minecart";MinecraftEntityTypes2["Chicken"]="minecraft:chicken";MinecraftEntityTypes2["Cod"]="minecraft:cod";MinecraftEntityTypes2["CommandBlockMinecart"]="minecraft:command_block_minecart";MinecraftEntityTypes2["Cow"]="minecraft:cow";MinecraftEntityTypes2["Creeper"]="minecraft:creeper";MinecraftEntityTypes2["Dolphin"]="minecraft:dolphin";MinecraftEntityTypes2["Donkey"]="minecraft:donkey";MinecraftEntityTypes2["DragonFireball"]="minecraft:dragon_fireball";MinecraftEntityTypes2["Drowned"]="minecraft:drowned";MinecraftEntityTypes2["Egg"]="minecraft:egg";MinecraftEntityTypes2["ElderGuardian"]="minecraft:elder_guardian";MinecraftEntityTypes2["EnderCrystal"]="minecraft:ender_crystal";MinecraftEntityTypes2["EnderDragon"]="minecraft:ender_dragon";MinecraftEntityTypes2["EnderPearl"]="minecraft:ender_pearl";MinecraftEntityTypes2["Enderman"]="minecraft:enderman";MinecraftEntityTypes2["Endermite"]="minecraft:endermite";MinecraftEntityTypes2["EvocationIllager"]="minecraft:evocation_illager";MinecraftEntityTypes2["EyeOfEnderSignal"]="minecraft:eye_of_ender_signal";MinecraftEntityTypes2["Fireball"]="minecraft:fireball";MinecraftEntityTypes2["FireworksRocket"]="minecraft:fireworks_rocket";MinecraftEntityTypes2["FishingHook"]="minecraft:fishing_hook";MinecraftEntityTypes2["Fox"]="minecraft:fox";MinecraftEntityTypes2["Frog"]="minecraft:frog";MinecraftEntityTypes2["Ghast"]="minecraft:ghast";MinecraftEntityTypes2["GlowSquid"]="minecraft:glow_squid";MinecraftEntityTypes2["Goat"]="minecraft:goat";MinecraftEntityTypes2["Guardian"]="minecraft:guardian";MinecraftEntityTypes2["Hoglin"]="minecraft:hoglin";MinecraftEntityTypes2["HopperMinecart"]="minecraft:hopper_minecart";MinecraftEntityTypes2["Horse"]="minecraft:horse";MinecraftEntityTypes2["Husk"]="minecraft:husk";MinecraftEntityTypes2["IronGolem"]="minecraft:iron_golem";MinecraftEntityTypes2["LightningBolt"]="minecraft:lightning_bolt";MinecraftEntityTypes2["LingeringPotion"]="minecraft:lingering_potion";MinecraftEntityTypes2["Llama"]="minecraft:llama";MinecraftEntityTypes2["LlamaSpit"]="minecraft:llama_spit";MinecraftEntityTypes2["MagmaCube"]="minecraft:magma_cube";MinecraftEntityTypes2["Minecart"]="minecraft:minecart";MinecraftEntityTypes2["Mooshroom"]="minecraft:mooshroom";MinecraftEntityTypes2["Mule"]="minecraft:mule";MinecraftEntityTypes2["Npc"]="minecraft:npc";MinecraftEntityTypes2["Ocelot"]="minecraft:ocelot";MinecraftEntityTypes2["OminousItemSpawner"]="minecraft:ominous_item_spawner";MinecraftEntityTypes2["Panda"]="minecraft:panda";MinecraftEntityTypes2["Parrot"]="minecraft:parrot";MinecraftEntityTypes2["Phantom"]="minecraft:phantom";MinecraftEntityTypes2["Pig"]="minecraft:pig";MinecraftEntityTypes2["Piglin"]="minecraft:piglin";MinecraftEntityTypes2["PiglinBrute"]="minecraft:piglin_brute";MinecraftEntityTypes2["Pillager"]="minecraft:pillager";MinecraftEntityTypes2["Player"]="minecraft:player";MinecraftEntityTypes2["PolarBear"]="minecraft:polar_bear";MinecraftEntityTypes2["Pufferfish"]="minecraft:pufferfish";MinecraftEntityTypes2["Rabbit"]="minecraft:rabbit";MinecraftEntityTypes2["Ravager"]="minecraft:ravager";MinecraftEntityTypes2["Salmon"]="minecraft:salmon";MinecraftEntityTypes2["Sheep"]="minecraft:sheep";MinecraftEntityTypes2["Shulker"]="minecraft:shulker";MinecraftEntityTypes2["ShulkerBullet"]="minecraft:shulker_bullet";MinecraftEntityTypes2["Silverfish"]="minecraft:silverfish";MinecraftEntityTypes2["Skeleton"]="minecraft:skeleton";MinecraftEntityTypes2["SkeletonHorse"]="minecraft:skeleton_horse";MinecraftEntityTypes2["Slime"]="minecraft:slime";MinecraftEntityTypes2["SmallFireball"]="minecraft:small_fireball";MinecraftEntityTypes2["Sniffer"]="minecraft:sniffer";MinecraftEntityTypes2["SnowGolem"]="minecraft:snow_golem";MinecraftEntityTypes2["Snowball"]="minecraft:snowball";MinecraftEntityTypes2["Spider"]="minecraft:spider";MinecraftEntityTypes2["SplashPotion"]="minecraft:splash_potion";MinecraftEntityTypes2["Squid"]="minecraft:squid";MinecraftEntityTypes2["Stray"]="minecraft:stray";MinecraftEntityTypes2["Strider"]="minecraft:strider";MinecraftEntityTypes2["Tadpole"]="minecraft:tadpole";MinecraftEntityTypes2["ThrownTrident"]="minecraft:thrown_trident";MinecraftEntityTypes2["Tnt"]="minecraft:tnt";MinecraftEntityTypes2["TntMinecart"]="minecraft:tnt_minecart";MinecraftEntityTypes2["TraderLlama"]="minecraft:trader_llama";MinecraftEntityTypes2["TripodCamera"]="minecraft:tripod_camera";MinecraftEntityTypes2["Tropicalfish"]="minecraft:tropicalfish";MinecraftEntityTypes2["Turtle"]="minecraft:turtle";MinecraftEntityTypes2["Vex"]="minecraft:vex";MinecraftEntityTypes2["Villager"]="minecraft:villager";MinecraftEntityTypes2["VillagerV2"]="minecraft:villager_v2";MinecraftEntityTypes2["Vindicator"]="minecraft:vindicator";MinecraftEntityTypes2["WanderingTrader"]="minecraft:wandering_trader";MinecraftEntityTypes2["Warden"]="minecraft:warden";MinecraftEntityTypes2["WindChargeProjectile"]="minecraft:wind_charge_projectile";MinecraftEntityTypes2["Witch"]="minecraft:witch";MinecraftEntityTypes2["Wither"]="minecraft:wither";MinecraftEntityTypes2["WitherSkeleton"]="minecraft:wither_skeleton";MinecraftEntityTypes2["WitherSkull"]="minecraft:wither_skull";MinecraftEntityTypes2["WitherSkullDangerous"]="minecraft:wither_skull_dangerous";MinecraftEntityTypes2["Wolf"]="minecraft:wolf";MinecraftEntityTypes2["XpBottle"]="minecraft:xp_bottle";MinecraftEntityTypes2["XpOrb"]="minecraft:xp_orb";MinecraftEntityTypes2["Zoglin"]="minecraft:zoglin";MinecraftEntityTypes2["Zombie"]="minecraft:zombie";MinecraftEntityTypes2["ZombieHorse"]="minecraft:zombie_horse";MinecraftEntityTypes2["ZombiePigman"]="minecraft:zombie_pigman";MinecraftEntityTypes2["ZombieVillager"]="minecraft:zombie_villager";MinecraftEntityTypes2["ZombieVillagerV2"]="minecraft:zombie_villager_v2";return MinecraftEntityTypes2})(MinecraftEntityTypes||{});var MinecraftFeatureTypes=(MinecraftFeatureTypes2=>{MinecraftFeatureTypes2["AncientCity"]="minecraft:ancient_city";MinecraftFeatureTypes2["BastionRemnant"]="minecraft:bastion_remnant";MinecraftFeatureTypes2["BuriedTreasure"]="minecraft:buried_treasure";MinecraftFeatureTypes2["EndCity"]="minecraft:end_city";MinecraftFeatureTypes2["Fortress"]="minecraft:fortress";MinecraftFeatureTypes2["Mansion"]="minecraft:mansion";MinecraftFeatureTypes2["Mineshaft"]="minecraft:mineshaft";MinecraftFeatureTypes2["Monument"]="minecraft:monument";MinecraftFeatureTypes2["PillagerOutpost"]="minecraft:pillager_outpost";MinecraftFeatureTypes2["RuinedPortal"]="minecraft:ruined_portal";MinecraftFeatureTypes2["Ruins"]="minecraft:ruins";MinecraftFeatureTypes2["Shipwreck"]="minecraft:shipwreck";MinecraftFeatureTypes2["Stronghold"]="minecraft:stronghold";MinecraftFeatureTypes2["Temple"]="minecraft:temple";MinecraftFeatureTypes2["TrailRuins"]="minecraft:trail_ruins";MinecraftFeatureTypes2["TrialChambers"]="minecraft:trial_chambers";MinecraftFeatureTypes2["Village"]="minecraft:village";return MinecraftFeatureTypes2})(MinecraftFeatureTypes||{});var MinecraftItemTypes=(MinecraftItemTypes2=>{MinecraftItemTypes2["AcaciaBoat"]="minecraft:acacia_boat";MinecraftItemTypes2["AcaciaButton"]="minecraft:acacia_button";MinecraftItemTypes2["AcaciaChestBoat"]="minecraft:acacia_chest_boat";MinecraftItemTypes2["AcaciaDoor"]="minecraft:acacia_door";MinecraftItemTypes2["AcaciaFence"]="minecraft:acacia_fence";MinecraftItemTypes2["AcaciaFenceGate"]="minecraft:acacia_fence_gate";MinecraftItemTypes2["AcaciaHangingSign"]="minecraft:acacia_hanging_sign";MinecraftItemTypes2["AcaciaLeaves"]="minecraft:acacia_leaves";MinecraftItemTypes2["AcaciaLog"]="minecraft:acacia_log";MinecraftItemTypes2["AcaciaPlanks"]="minecraft:acacia_planks";MinecraftItemTypes2["AcaciaPressurePlate"]="minecraft:acacia_pressure_plate";MinecraftItemTypes2["AcaciaSapling"]="minecraft:acacia_sapling";MinecraftItemTypes2["AcaciaSign"]="minecraft:acacia_sign";MinecraftItemTypes2["AcaciaSlab"]="minecraft:acacia_slab";MinecraftItemTypes2["AcaciaStairs"]="minecraft:acacia_stairs";MinecraftItemTypes2["AcaciaTrapdoor"]="minecraft:acacia_trapdoor";MinecraftItemTypes2["AcaciaWood"]="minecraft:acacia_wood";MinecraftItemTypes2["ActivatorRail"]="minecraft:activator_rail";MinecraftItemTypes2["Air"]="minecraft:air";MinecraftItemTypes2["AllaySpawnEgg"]="minecraft:allay_spawn_egg";MinecraftItemTypes2["Allium"]="minecraft:allium";MinecraftItemTypes2["Allow"]="minecraft:allow";MinecraftItemTypes2["AmethystBlock"]="minecraft:amethyst_block";MinecraftItemTypes2["AmethystCluster"]="minecraft:amethyst_cluster";MinecraftItemTypes2["AmethystShard"]="minecraft:amethyst_shard";MinecraftItemTypes2["AncientDebris"]="minecraft:ancient_debris";MinecraftItemTypes2["Andesite"]="minecraft:andesite";MinecraftItemTypes2["AndesiteSlab"]="minecraft:andesite_slab";MinecraftItemTypes2["AndesiteStairs"]="minecraft:andesite_stairs";MinecraftItemTypes2["AndesiteWall"]="minecraft:andesite_wall";MinecraftItemTypes2["AnglerPotterySherd"]="minecraft:angler_pottery_sherd";MinecraftItemTypes2["Anvil"]="minecraft:anvil";MinecraftItemTypes2["Apple"]="minecraft:apple";MinecraftItemTypes2["ArcherPotterySherd"]="minecraft:archer_pottery_sherd";MinecraftItemTypes2["ArmadilloScute"]="minecraft:armadillo_scute";MinecraftItemTypes2["ArmadilloSpawnEgg"]="minecraft:armadillo_spawn_egg";MinecraftItemTypes2["ArmorStand"]="minecraft:armor_stand";MinecraftItemTypes2["ArmsUpPotterySherd"]="minecraft:arms_up_pottery_sherd";MinecraftItemTypes2["Arrow"]="minecraft:arrow";MinecraftItemTypes2["AxolotlBucket"]="minecraft:axolotl_bucket";MinecraftItemTypes2["AxolotlSpawnEgg"]="minecraft:axolotl_spawn_egg";MinecraftItemTypes2["Azalea"]="minecraft:azalea";MinecraftItemTypes2["AzaleaLeaves"]="minecraft:azalea_leaves";MinecraftItemTypes2["AzaleaLeavesFlowered"]="minecraft:azalea_leaves_flowered";MinecraftItemTypes2["AzureBluet"]="minecraft:azure_bluet";MinecraftItemTypes2["BakedPotato"]="minecraft:baked_potato";MinecraftItemTypes2["Bamboo"]="minecraft:bamboo";MinecraftItemTypes2["BambooBlock"]="minecraft:bamboo_block";MinecraftItemTypes2["BambooButton"]="minecraft:bamboo_button";MinecraftItemTypes2["BambooChestRaft"]="minecraft:bamboo_chest_raft";MinecraftItemTypes2["BambooDoor"]="minecraft:bamboo_door";MinecraftItemTypes2["BambooFence"]="minecraft:bamboo_fence";MinecraftItemTypes2["BambooFenceGate"]="minecraft:bamboo_fence_gate";MinecraftItemTypes2["BambooHangingSign"]="minecraft:bamboo_hanging_sign";MinecraftItemTypes2["BambooMosaic"]="minecraft:bamboo_mosaic";MinecraftItemTypes2["BambooMosaicSlab"]="minecraft:bamboo_mosaic_slab";MinecraftItemTypes2["BambooMosaicStairs"]="minecraft:bamboo_mosaic_stairs";MinecraftItemTypes2["BambooPlanks"]="minecraft:bamboo_planks";MinecraftItemTypes2["BambooPressurePlate"]="minecraft:bamboo_pressure_plate";MinecraftItemTypes2["BambooRaft"]="minecraft:bamboo_raft";MinecraftItemTypes2["BambooSign"]="minecraft:bamboo_sign";MinecraftItemTypes2["BambooSlab"]="minecraft:bamboo_slab";MinecraftItemTypes2["BambooStairs"]="minecraft:bamboo_stairs";MinecraftItemTypes2["BambooTrapdoor"]="minecraft:bamboo_trapdoor";MinecraftItemTypes2["Banner"]="minecraft:banner";MinecraftItemTypes2["Barrel"]="minecraft:barrel";MinecraftItemTypes2["Barrier"]="minecraft:barrier";MinecraftItemTypes2["Basalt"]="minecraft:basalt";MinecraftItemTypes2["BatSpawnEgg"]="minecraft:bat_spawn_egg";MinecraftItemTypes2["Beacon"]="minecraft:beacon";MinecraftItemTypes2["Bed"]="minecraft:bed";MinecraftItemTypes2["Bedrock"]="minecraft:bedrock";MinecraftItemTypes2["BeeNest"]="minecraft:bee_nest";MinecraftItemTypes2["BeeSpawnEgg"]="minecraft:bee_spawn_egg";MinecraftItemTypes2["Beef"]="minecraft:beef";MinecraftItemTypes2["Beehive"]="minecraft:beehive";MinecraftItemTypes2["Beetroot"]="minecraft:beetroot";MinecraftItemTypes2["BeetrootSeeds"]="minecraft:beetroot_seeds";MinecraftItemTypes2["BeetrootSoup"]="minecraft:beetroot_soup";MinecraftItemTypes2["Bell"]="minecraft:bell";MinecraftItemTypes2["BigDripleaf"]="minecraft:big_dripleaf";MinecraftItemTypes2["BirchBoat"]="minecraft:birch_boat";MinecraftItemTypes2["BirchButton"]="minecraft:birch_button";MinecraftItemTypes2["BirchChestBoat"]="minecraft:birch_chest_boat";MinecraftItemTypes2["BirchDoor"]="minecraft:birch_door";MinecraftItemTypes2["BirchFence"]="minecraft:birch_fence";MinecraftItemTypes2["BirchFenceGate"]="minecraft:birch_fence_gate";MinecraftItemTypes2["BirchHangingSign"]="minecraft:birch_hanging_sign";MinecraftItemTypes2["BirchLeaves"]="minecraft:birch_leaves";MinecraftItemTypes2["BirchLog"]="minecraft:birch_log";MinecraftItemTypes2["BirchPlanks"]="minecraft:birch_planks";MinecraftItemTypes2["BirchPressurePlate"]="minecraft:birch_pressure_plate";MinecraftItemTypes2["BirchSapling"]="minecraft:birch_sapling";MinecraftItemTypes2["BirchSign"]="minecraft:birch_sign";MinecraftItemTypes2["BirchSlab"]="minecraft:birch_slab";MinecraftItemTypes2["BirchStairs"]="minecraft:birch_stairs";MinecraftItemTypes2["BirchTrapdoor"]="minecraft:birch_trapdoor";MinecraftItemTypes2["BirchWood"]="minecraft:birch_wood";MinecraftItemTypes2["BlackCandle"]="minecraft:black_candle";MinecraftItemTypes2["BlackCarpet"]="minecraft:black_carpet";MinecraftItemTypes2["BlackConcrete"]="minecraft:black_concrete";MinecraftItemTypes2["BlackConcretePowder"]="minecraft:black_concrete_powder";MinecraftItemTypes2["BlackDye"]="minecraft:black_dye";MinecraftItemTypes2["BlackGlazedTerracotta"]="minecraft:black_glazed_terracotta";MinecraftItemTypes2["BlackShulkerBox"]="minecraft:black_shulker_box";MinecraftItemTypes2["BlackStainedGlass"]="minecraft:black_stained_glass";MinecraftItemTypes2["BlackStainedGlassPane"]="minecraft:black_stained_glass_pane";MinecraftItemTypes2["BlackTerracotta"]="minecraft:black_terracotta";MinecraftItemTypes2["BlackWool"]="minecraft:black_wool";MinecraftItemTypes2["Blackstone"]="minecraft:blackstone";MinecraftItemTypes2["BlackstoneSlab"]="minecraft:blackstone_slab";MinecraftItemTypes2["BlackstoneStairs"]="minecraft:blackstone_stairs";MinecraftItemTypes2["BlackstoneWall"]="minecraft:blackstone_wall";MinecraftItemTypes2["BladePotterySherd"]="minecraft:blade_pottery_sherd";MinecraftItemTypes2["BlastFurnace"]="minecraft:blast_furnace";MinecraftItemTypes2["BlazePowder"]="minecraft:blaze_powder";MinecraftItemTypes2["BlazeRod"]="minecraft:blaze_rod";MinecraftItemTypes2["BlazeSpawnEgg"]="minecraft:blaze_spawn_egg";MinecraftItemTypes2["BlueCandle"]="minecraft:blue_candle";MinecraftItemTypes2["BlueCarpet"]="minecraft:blue_carpet";MinecraftItemTypes2["BlueConcrete"]="minecraft:blue_concrete";MinecraftItemTypes2["BlueConcretePowder"]="minecraft:blue_concrete_powder";MinecraftItemTypes2["BlueDye"]="minecraft:blue_dye";MinecraftItemTypes2["BlueGlazedTerracotta"]="minecraft:blue_glazed_terracotta";MinecraftItemTypes2["BlueIce"]="minecraft:blue_ice";MinecraftItemTypes2["BlueOrchid"]="minecraft:blue_orchid";MinecraftItemTypes2["BlueShulkerBox"]="minecraft:blue_shulker_box";MinecraftItemTypes2["BlueStainedGlass"]="minecraft:blue_stained_glass";MinecraftItemTypes2["BlueStainedGlassPane"]="minecraft:blue_stained_glass_pane";MinecraftItemTypes2["BlueTerracotta"]="minecraft:blue_terracotta";MinecraftItemTypes2["BlueWool"]="minecraft:blue_wool";MinecraftItemTypes2["BoggedSpawnEgg"]="minecraft:bogged_spawn_egg";MinecraftItemTypes2["BoltArmorTrimSmithingTemplate"]="minecraft:bolt_armor_trim_smithing_template";MinecraftItemTypes2["Bone"]="minecraft:bone";MinecraftItemTypes2["BoneBlock"]="minecraft:bone_block";MinecraftItemTypes2["BoneMeal"]="minecraft:bone_meal";MinecraftItemTypes2["Book"]="minecraft:book";MinecraftItemTypes2["Bookshelf"]="minecraft:bookshelf";MinecraftItemTypes2["BorderBlock"]="minecraft:border_block";MinecraftItemTypes2["BordureIndentedBannerPattern"]="minecraft:bordure_indented_banner_pattern";MinecraftItemTypes2["Bow"]="minecraft:bow";MinecraftItemTypes2["Bowl"]="minecraft:bowl";MinecraftItemTypes2["BrainCoral"]="minecraft:brain_coral";MinecraftItemTypes2["BrainCoralBlock"]="minecraft:brain_coral_block";MinecraftItemTypes2["BrainCoralFan"]="minecraft:brain_coral_fan";MinecraftItemTypes2["Bread"]="minecraft:bread";MinecraftItemTypes2["BreezeRod"]="minecraft:breeze_rod";MinecraftItemTypes2["BreezeSpawnEgg"]="minecraft:breeze_spawn_egg";MinecraftItemTypes2["BrewerPotterySherd"]="minecraft:brewer_pottery_sherd";MinecraftItemTypes2["BrewingStand"]="minecraft:brewing_stand";MinecraftItemTypes2["Brick"]="minecraft:brick";MinecraftItemTypes2["BrickBlock"]="minecraft:brick_block";MinecraftItemTypes2["BrickSlab"]="minecraft:brick_slab";MinecraftItemTypes2["BrickStairs"]="minecraft:brick_stairs";MinecraftItemTypes2["BrickWall"]="minecraft:brick_wall";MinecraftItemTypes2["BrownCandle"]="minecraft:brown_candle";MinecraftItemTypes2["BrownCarpet"]="minecraft:brown_carpet";MinecraftItemTypes2["BrownConcrete"]="minecraft:brown_concrete";MinecraftItemTypes2["BrownConcretePowder"]="minecraft:brown_concrete_powder";MinecraftItemTypes2["BrownDye"]="minecraft:brown_dye";MinecraftItemTypes2["BrownGlazedTerracotta"]="minecraft:brown_glazed_terracotta";MinecraftItemTypes2["BrownMushroom"]="minecraft:brown_mushroom";MinecraftItemTypes2["BrownMushroomBlock"]="minecraft:brown_mushroom_block";MinecraftItemTypes2["BrownShulkerBox"]="minecraft:brown_shulker_box";MinecraftItemTypes2["BrownStainedGlass"]="minecraft:brown_stained_glass";MinecraftItemTypes2["BrownStainedGlassPane"]="minecraft:brown_stained_glass_pane";MinecraftItemTypes2["BrownTerracotta"]="minecraft:brown_terracotta";MinecraftItemTypes2["BrownWool"]="minecraft:brown_wool";MinecraftItemTypes2["Brush"]="minecraft:brush";MinecraftItemTypes2["BubbleCoral"]="minecraft:bubble_coral";MinecraftItemTypes2["BubbleCoralBlock"]="minecraft:bubble_coral_block";MinecraftItemTypes2["BubbleCoralFan"]="minecraft:bubble_coral_fan";MinecraftItemTypes2["Bucket"]="minecraft:bucket";MinecraftItemTypes2["BuddingAmethyst"]="minecraft:budding_amethyst";MinecraftItemTypes2["Bundle"]="minecraft:bundle";MinecraftItemTypes2["BurnPotterySherd"]="minecraft:burn_pottery_sherd";MinecraftItemTypes2["Cactus"]="minecraft:cactus";MinecraftItemTypes2["Cake"]="minecraft:cake";MinecraftItemTypes2["Calcite"]="minecraft:calcite";MinecraftItemTypes2["CalibratedSculkSensor"]="minecraft:calibrated_sculk_sensor";MinecraftItemTypes2["CamelSpawnEgg"]="minecraft:camel_spawn_egg";MinecraftItemTypes2["Campfire"]="minecraft:campfire";MinecraftItemTypes2["Candle"]="minecraft:candle";MinecraftItemTypes2["Carrot"]="minecraft:carrot";MinecraftItemTypes2["CarrotOnAStick"]="minecraft:carrot_on_a_stick";MinecraftItemTypes2["CartographyTable"]="minecraft:cartography_table";MinecraftItemTypes2["CarvedPumpkin"]="minecraft:carved_pumpkin";MinecraftItemTypes2["CatSpawnEgg"]="minecraft:cat_spawn_egg";MinecraftItemTypes2["Cauldron"]="minecraft:cauldron";MinecraftItemTypes2["CaveSpiderSpawnEgg"]="minecraft:cave_spider_spawn_egg";MinecraftItemTypes2["Chain"]="minecraft:chain";MinecraftItemTypes2["ChainCommandBlock"]="minecraft:chain_command_block";MinecraftItemTypes2["ChainmailBoots"]="minecraft:chainmail_boots";MinecraftItemTypes2["ChainmailChestplate"]="minecraft:chainmail_chestplate";MinecraftItemTypes2["ChainmailHelmet"]="minecraft:chainmail_helmet";MinecraftItemTypes2["ChainmailLeggings"]="minecraft:chainmail_leggings";MinecraftItemTypes2["Charcoal"]="minecraft:charcoal";MinecraftItemTypes2["CherryBoat"]="minecraft:cherry_boat";MinecraftItemTypes2["CherryButton"]="minecraft:cherry_button";MinecraftItemTypes2["CherryChestBoat"]="minecraft:cherry_chest_boat";MinecraftItemTypes2["CherryDoor"]="minecraft:cherry_door";MinecraftItemTypes2["CherryFence"]="minecraft:cherry_fence";MinecraftItemTypes2["CherryFenceGate"]="minecraft:cherry_fence_gate";MinecraftItemTypes2["CherryHangingSign"]="minecraft:cherry_hanging_sign";MinecraftItemTypes2["CherryLeaves"]="minecraft:cherry_leaves";MinecraftItemTypes2["CherryLog"]="minecraft:cherry_log";MinecraftItemTypes2["CherryPlanks"]="minecraft:cherry_planks";MinecraftItemTypes2["CherryPressurePlate"]="minecraft:cherry_pressure_plate";MinecraftItemTypes2["CherrySapling"]="minecraft:cherry_sapling";MinecraftItemTypes2["CherrySign"]="minecraft:cherry_sign";MinecraftItemTypes2["CherrySlab"]="minecraft:cherry_slab";MinecraftItemTypes2["CherryStairs"]="minecraft:cherry_stairs";MinecraftItemTypes2["CherryTrapdoor"]="minecraft:cherry_trapdoor";MinecraftItemTypes2["CherryWood"]="minecraft:cherry_wood";MinecraftItemTypes2["Chest"]="minecraft:chest";MinecraftItemTypes2["ChestMinecart"]="minecraft:chest_minecart";MinecraftItemTypes2["Chicken"]="minecraft:chicken";MinecraftItemTypes2["ChickenSpawnEgg"]="minecraft:chicken_spawn_egg";MinecraftItemTypes2["ChippedAnvil"]="minecraft:chipped_anvil";MinecraftItemTypes2["ChiseledBookshelf"]="minecraft:chiseled_bookshelf";MinecraftItemTypes2["ChiseledCopper"]="minecraft:chiseled_copper";MinecraftItemTypes2["ChiseledDeepslate"]="minecraft:chiseled_deepslate";MinecraftItemTypes2["ChiseledNetherBricks"]="minecraft:chiseled_nether_bricks";MinecraftItemTypes2["ChiseledPolishedBlackstone"]="minecraft:chiseled_polished_blackstone";MinecraftItemTypes2["ChiseledQuartzBlock"]="minecraft:chiseled_quartz_block";MinecraftItemTypes2["ChiseledRedSandstone"]="minecraft:chiseled_red_sandstone";MinecraftItemTypes2["ChiseledSandstone"]="minecraft:chiseled_sandstone";MinecraftItemTypes2["ChiseledStoneBricks"]="minecraft:chiseled_stone_bricks";MinecraftItemTypes2["ChiseledTuff"]="minecraft:chiseled_tuff";MinecraftItemTypes2["ChiseledTuffBricks"]="minecraft:chiseled_tuff_bricks";MinecraftItemTypes2["ChorusFlower"]="minecraft:chorus_flower";MinecraftItemTypes2["ChorusFruit"]="minecraft:chorus_fruit";MinecraftItemTypes2["ChorusPlant"]="minecraft:chorus_plant";MinecraftItemTypes2["Clay"]="minecraft:clay";MinecraftItemTypes2["ClayBall"]="minecraft:clay_ball";MinecraftItemTypes2["Clock"]="minecraft:clock";MinecraftItemTypes2["Coal"]="minecraft:coal";MinecraftItemTypes2["CoalBlock"]="minecraft:coal_block";MinecraftItemTypes2["CoalOre"]="minecraft:coal_ore";MinecraftItemTypes2["CoarseDirt"]="minecraft:coarse_dirt";MinecraftItemTypes2["CoastArmorTrimSmithingTemplate"]="minecraft:coast_armor_trim_smithing_template";MinecraftItemTypes2["CobbledDeepslate"]="minecraft:cobbled_deepslate";MinecraftItemTypes2["CobbledDeepslateSlab"]="minecraft:cobbled_deepslate_slab";MinecraftItemTypes2["CobbledDeepslateStairs"]="minecraft:cobbled_deepslate_stairs";MinecraftItemTypes2["CobbledDeepslateWall"]="minecraft:cobbled_deepslate_wall";MinecraftItemTypes2["Cobblestone"]="minecraft:cobblestone";MinecraftItemTypes2["CobblestoneSlab"]="minecraft:cobblestone_slab";MinecraftItemTypes2["CobblestoneWall"]="minecraft:cobblestone_wall";MinecraftItemTypes2["CocoaBeans"]="minecraft:cocoa_beans";MinecraftItemTypes2["Cod"]="minecraft:cod";MinecraftItemTypes2["CodBucket"]="minecraft:cod_bucket";MinecraftItemTypes2["CodSpawnEgg"]="minecraft:cod_spawn_egg";MinecraftItemTypes2["CommandBlock"]="minecraft:command_block";MinecraftItemTypes2["CommandBlockMinecart"]="minecraft:command_block_minecart";MinecraftItemTypes2["Comparator"]="minecraft:comparator";MinecraftItemTypes2["Compass"]="minecraft:compass";MinecraftItemTypes2["Composter"]="minecraft:composter";MinecraftItemTypes2["Conduit"]="minecraft:conduit";MinecraftItemTypes2["CookedBeef"]="minecraft:cooked_beef";MinecraftItemTypes2["CookedChicken"]="minecraft:cooked_chicken";MinecraftItemTypes2["CookedCod"]="minecraft:cooked_cod";MinecraftItemTypes2["CookedMutton"]="minecraft:cooked_mutton";MinecraftItemTypes2["CookedPorkchop"]="minecraft:cooked_porkchop";MinecraftItemTypes2["CookedRabbit"]="minecraft:cooked_rabbit";MinecraftItemTypes2["CookedSalmon"]="minecraft:cooked_salmon";MinecraftItemTypes2["Cookie"]="minecraft:cookie";MinecraftItemTypes2["CopperBlock"]="minecraft:copper_block";MinecraftItemTypes2["CopperBulb"]="minecraft:copper_bulb";MinecraftItemTypes2["CopperDoor"]="minecraft:copper_door";MinecraftItemTypes2["CopperGrate"]="minecraft:copper_grate";MinecraftItemTypes2["CopperIngot"]="minecraft:copper_ingot";MinecraftItemTypes2["CopperOre"]="minecraft:copper_ore";MinecraftItemTypes2["CopperTrapdoor"]="minecraft:copper_trapdoor";MinecraftItemTypes2["Cornflower"]="minecraft:cornflower";MinecraftItemTypes2["CowSpawnEgg"]="minecraft:cow_spawn_egg";MinecraftItemTypes2["CrackedDeepslateBricks"]="minecraft:cracked_deepslate_bricks";MinecraftItemTypes2["CrackedDeepslateTiles"]="minecraft:cracked_deepslate_tiles";MinecraftItemTypes2["CrackedNetherBricks"]="minecraft:cracked_nether_bricks";MinecraftItemTypes2["CrackedPolishedBlackstoneBricks"]="minecraft:cracked_polished_blackstone_bricks";MinecraftItemTypes2["CrackedStoneBricks"]="minecraft:cracked_stone_bricks";MinecraftItemTypes2["Crafter"]="minecraft:crafter";MinecraftItemTypes2["CraftingTable"]="minecraft:crafting_table";MinecraftItemTypes2["CreeperBannerPattern"]="minecraft:creeper_banner_pattern";MinecraftItemTypes2["CreeperSpawnEgg"]="minecraft:creeper_spawn_egg";MinecraftItemTypes2["CrimsonButton"]="minecraft:crimson_button";MinecraftItemTypes2["CrimsonDoor"]="minecraft:crimson_door";MinecraftItemTypes2["CrimsonFence"]="minecraft:crimson_fence";MinecraftItemTypes2["CrimsonFenceGate"]="minecraft:crimson_fence_gate";MinecraftItemTypes2["CrimsonFungus"]="minecraft:crimson_fungus";MinecraftItemTypes2["CrimsonHangingSign"]="minecraft:crimson_hanging_sign";MinecraftItemTypes2["CrimsonHyphae"]="minecraft:crimson_hyphae";MinecraftItemTypes2["CrimsonNylium"]="minecraft:crimson_nylium";MinecraftItemTypes2["CrimsonPlanks"]="minecraft:crimson_planks";MinecraftItemTypes2["CrimsonPressurePlate"]="minecraft:crimson_pressure_plate";MinecraftItemTypes2["CrimsonRoots"]="minecraft:crimson_roots";MinecraftItemTypes2["CrimsonSign"]="minecraft:crimson_sign";MinecraftItemTypes2["CrimsonSlab"]="minecraft:crimson_slab";MinecraftItemTypes2["CrimsonStairs"]="minecraft:crimson_stairs";MinecraftItemTypes2["CrimsonStem"]="minecraft:crimson_stem";MinecraftItemTypes2["CrimsonTrapdoor"]="minecraft:crimson_trapdoor";MinecraftItemTypes2["Crossbow"]="minecraft:crossbow";MinecraftItemTypes2["CryingObsidian"]="minecraft:crying_obsidian";MinecraftItemTypes2["CutCopper"]="minecraft:cut_copper";MinecraftItemTypes2["CutCopperSlab"]="minecraft:cut_copper_slab";MinecraftItemTypes2["CutCopperStairs"]="minecraft:cut_copper_stairs";MinecraftItemTypes2["CutRedSandstone"]="minecraft:cut_red_sandstone";MinecraftItemTypes2["CutRedSandstoneSlab"]="minecraft:cut_red_sandstone_slab";MinecraftItemTypes2["CutSandstone"]="minecraft:cut_sandstone";MinecraftItemTypes2["CutSandstoneSlab"]="minecraft:cut_sandstone_slab";MinecraftItemTypes2["CyanCandle"]="minecraft:cyan_candle";MinecraftItemTypes2["CyanCarpet"]="minecraft:cyan_carpet";MinecraftItemTypes2["CyanConcrete"]="minecraft:cyan_concrete";MinecraftItemTypes2["CyanConcretePowder"]="minecraft:cyan_concrete_powder";MinecraftItemTypes2["CyanDye"]="minecraft:cyan_dye";MinecraftItemTypes2["CyanGlazedTerracotta"]="minecraft:cyan_glazed_terracotta";MinecraftItemTypes2["CyanShulkerBox"]="minecraft:cyan_shulker_box";MinecraftItemTypes2["CyanStainedGlass"]="minecraft:cyan_stained_glass";MinecraftItemTypes2["CyanStainedGlassPane"]="minecraft:cyan_stained_glass_pane";MinecraftItemTypes2["CyanTerracotta"]="minecraft:cyan_terracotta";MinecraftItemTypes2["CyanWool"]="minecraft:cyan_wool";MinecraftItemTypes2["DamagedAnvil"]="minecraft:damaged_anvil";MinecraftItemTypes2["Dandelion"]="minecraft:dandelion";MinecraftItemTypes2["DangerPotterySherd"]="minecraft:danger_pottery_sherd";MinecraftItemTypes2["DarkOakBoat"]="minecraft:dark_oak_boat";MinecraftItemTypes2["DarkOakButton"]="minecraft:dark_oak_button";MinecraftItemTypes2["DarkOakChestBoat"]="minecraft:dark_oak_chest_boat";MinecraftItemTypes2["DarkOakDoor"]="minecraft:dark_oak_door";MinecraftItemTypes2["DarkOakFence"]="minecraft:dark_oak_fence";MinecraftItemTypes2["DarkOakFenceGate"]="minecraft:dark_oak_fence_gate";MinecraftItemTypes2["DarkOakHangingSign"]="minecraft:dark_oak_hanging_sign";MinecraftItemTypes2["DarkOakLeaves"]="minecraft:dark_oak_leaves";MinecraftItemTypes2["DarkOakLog"]="minecraft:dark_oak_log";MinecraftItemTypes2["DarkOakPlanks"]="minecraft:dark_oak_planks";MinecraftItemTypes2["DarkOakPressurePlate"]="minecraft:dark_oak_pressure_plate";MinecraftItemTypes2["DarkOakSapling"]="minecraft:dark_oak_sapling";MinecraftItemTypes2["DarkOakSign"]="minecraft:dark_oak_sign";MinecraftItemTypes2["DarkOakSlab"]="minecraft:dark_oak_slab";MinecraftItemTypes2["DarkOakStairs"]="minecraft:dark_oak_stairs";MinecraftItemTypes2["DarkOakTrapdoor"]="minecraft:dark_oak_trapdoor";MinecraftItemTypes2["DarkOakWood"]="minecraft:dark_oak_wood";MinecraftItemTypes2["DarkPrismarine"]="minecraft:dark_prismarine";MinecraftItemTypes2["DarkPrismarineSlab"]="minecraft:dark_prismarine_slab";MinecraftItemTypes2["DarkPrismarineStairs"]="minecraft:dark_prismarine_stairs";MinecraftItemTypes2["DaylightDetector"]="minecraft:daylight_detector";MinecraftItemTypes2["DeadBrainCoral"]="minecraft:dead_brain_coral";MinecraftItemTypes2["DeadBrainCoralBlock"]="minecraft:dead_brain_coral_block";MinecraftItemTypes2["DeadBrainCoralFan"]="minecraft:dead_brain_coral_fan";MinecraftItemTypes2["DeadBubbleCoral"]="minecraft:dead_bubble_coral";MinecraftItemTypes2["DeadBubbleCoralBlock"]="minecraft:dead_bubble_coral_block";MinecraftItemTypes2["DeadBubbleCoralFan"]="minecraft:dead_bubble_coral_fan";MinecraftItemTypes2["DeadFireCoral"]="minecraft:dead_fire_coral";MinecraftItemTypes2["DeadFireCoralBlock"]="minecraft:dead_fire_coral_block";MinecraftItemTypes2["DeadFireCoralFan"]="minecraft:dead_fire_coral_fan";MinecraftItemTypes2["DeadHornCoral"]="minecraft:dead_horn_coral";MinecraftItemTypes2["DeadHornCoralBlock"]="minecraft:dead_horn_coral_block";MinecraftItemTypes2["DeadHornCoralFan"]="minecraft:dead_horn_coral_fan";MinecraftItemTypes2["DeadTubeCoral"]="minecraft:dead_tube_coral";MinecraftItemTypes2["DeadTubeCoralBlock"]="minecraft:dead_tube_coral_block";MinecraftItemTypes2["DeadTubeCoralFan"]="minecraft:dead_tube_coral_fan";MinecraftItemTypes2["Deadbush"]="minecraft:deadbush";MinecraftItemTypes2["DecoratedPot"]="minecraft:decorated_pot";MinecraftItemTypes2["Deepslate"]="minecraft:deepslate";MinecraftItemTypes2["DeepslateBrickSlab"]="minecraft:deepslate_brick_slab";MinecraftItemTypes2["DeepslateBrickStairs"]="minecraft:deepslate_brick_stairs";MinecraftItemTypes2["DeepslateBrickWall"]="minecraft:deepslate_brick_wall";MinecraftItemTypes2["DeepslateBricks"]="minecraft:deepslate_bricks";MinecraftItemTypes2["DeepslateCoalOre"]="minecraft:deepslate_coal_ore";MinecraftItemTypes2["DeepslateCopperOre"]="minecraft:deepslate_copper_ore";MinecraftItemTypes2["DeepslateDiamondOre"]="minecraft:deepslate_diamond_ore";MinecraftItemTypes2["DeepslateEmeraldOre"]="minecraft:deepslate_emerald_ore";MinecraftItemTypes2["DeepslateGoldOre"]="minecraft:deepslate_gold_ore";MinecraftItemTypes2["DeepslateIronOre"]="minecraft:deepslate_iron_ore";MinecraftItemTypes2["DeepslateLapisOre"]="minecraft:deepslate_lapis_ore";MinecraftItemTypes2["DeepslateRedstoneOre"]="minecraft:deepslate_redstone_ore";MinecraftItemTypes2["DeepslateTileSlab"]="minecraft:deepslate_tile_slab";MinecraftItemTypes2["DeepslateTileStairs"]="minecraft:deepslate_tile_stairs";MinecraftItemTypes2["DeepslateTileWall"]="minecraft:deepslate_tile_wall";MinecraftItemTypes2["DeepslateTiles"]="minecraft:deepslate_tiles";MinecraftItemTypes2["Deny"]="minecraft:deny";MinecraftItemTypes2["DetectorRail"]="minecraft:detector_rail";MinecraftItemTypes2["Diamond"]="minecraft:diamond";MinecraftItemTypes2["DiamondAxe"]="minecraft:diamond_axe";MinecraftItemTypes2["DiamondBlock"]="minecraft:diamond_block";MinecraftItemTypes2["DiamondBoots"]="minecraft:diamond_boots";MinecraftItemTypes2["DiamondChestplate"]="minecraft:diamond_chestplate";MinecraftItemTypes2["DiamondHelmet"]="minecraft:diamond_helmet";MinecraftItemTypes2["DiamondHoe"]="minecraft:diamond_hoe";MinecraftItemTypes2["DiamondHorseArmor"]="minecraft:diamond_horse_armor";MinecraftItemTypes2["DiamondLeggings"]="minecraft:diamond_leggings";MinecraftItemTypes2["DiamondOre"]="minecraft:diamond_ore";MinecraftItemTypes2["DiamondPickaxe"]="minecraft:diamond_pickaxe";MinecraftItemTypes2["DiamondShovel"]="minecraft:diamond_shovel";MinecraftItemTypes2["DiamondSword"]="minecraft:diamond_sword";MinecraftItemTypes2["Diorite"]="minecraft:diorite";MinecraftItemTypes2["DioriteSlab"]="minecraft:diorite_slab";MinecraftItemTypes2["DioriteStairs"]="minecraft:diorite_stairs";MinecraftItemTypes2["DioriteWall"]="minecraft:diorite_wall";MinecraftItemTypes2["Dirt"]="minecraft:dirt";MinecraftItemTypes2["DirtWithRoots"]="minecraft:dirt_with_roots";MinecraftItemTypes2["DiscFragment5"]="minecraft:disc_fragment_5";MinecraftItemTypes2["Dispenser"]="minecraft:dispenser";MinecraftItemTypes2["DolphinSpawnEgg"]="minecraft:dolphin_spawn_egg";MinecraftItemTypes2["DonkeySpawnEgg"]="minecraft:donkey_spawn_egg";MinecraftItemTypes2["DragonBreath"]="minecraft:dragon_breath";MinecraftItemTypes2["DragonEgg"]="minecraft:dragon_egg";MinecraftItemTypes2["DriedKelp"]="minecraft:dried_kelp";MinecraftItemTypes2["DriedKelpBlock"]="minecraft:dried_kelp_block";MinecraftItemTypes2["DripstoneBlock"]="minecraft:dripstone_block";MinecraftItemTypes2["Dropper"]="minecraft:dropper";MinecraftItemTypes2["DrownedSpawnEgg"]="minecraft:drowned_spawn_egg";MinecraftItemTypes2["DuneArmorTrimSmithingTemplate"]="minecraft:dune_armor_trim_smithing_template";MinecraftItemTypes2["EchoShard"]="minecraft:echo_shard";MinecraftItemTypes2["Egg"]="minecraft:egg";MinecraftItemTypes2["ElderGuardianSpawnEgg"]="minecraft:elder_guardian_spawn_egg";MinecraftItemTypes2["Elytra"]="minecraft:elytra";MinecraftItemTypes2["Emerald"]="minecraft:emerald";MinecraftItemTypes2["EmeraldBlock"]="minecraft:emerald_block";MinecraftItemTypes2["EmeraldOre"]="minecraft:emerald_ore";MinecraftItemTypes2["EmptyMap"]="minecraft:empty_map";MinecraftItemTypes2["EnchantedBook"]="minecraft:enchanted_book";MinecraftItemTypes2["EnchantedGoldenApple"]="minecraft:enchanted_golden_apple";MinecraftItemTypes2["EnchantingTable"]="minecraft:enchanting_table";MinecraftItemTypes2["EndBrickStairs"]="minecraft:end_brick_stairs";MinecraftItemTypes2["EndBricks"]="minecraft:end_bricks";MinecraftItemTypes2["EndCrystal"]="minecraft:end_crystal";MinecraftItemTypes2["EndPortalFrame"]="minecraft:end_portal_frame";MinecraftItemTypes2["EndRod"]="minecraft:end_rod";MinecraftItemTypes2["EndStone"]="minecraft:end_stone";MinecraftItemTypes2["EndStoneBrickSlab"]="minecraft:end_stone_brick_slab";MinecraftItemTypes2["EndStoneBrickWall"]="minecraft:end_stone_brick_wall";MinecraftItemTypes2["EnderChest"]="minecraft:ender_chest";MinecraftItemTypes2["EnderDragonSpawnEgg"]="minecraft:ender_dragon_spawn_egg";MinecraftItemTypes2["EnderEye"]="minecraft:ender_eye";MinecraftItemTypes2["EnderPearl"]="minecraft:ender_pearl";MinecraftItemTypes2["EndermanSpawnEgg"]="minecraft:enderman_spawn_egg";MinecraftItemTypes2["EndermiteSpawnEgg"]="minecraft:endermite_spawn_egg";MinecraftItemTypes2["EvokerSpawnEgg"]="minecraft:evoker_spawn_egg";MinecraftItemTypes2["ExperienceBottle"]="minecraft:experience_bottle";MinecraftItemTypes2["ExplorerPotterySherd"]="minecraft:explorer_pottery_sherd";MinecraftItemTypes2["ExposedChiseledCopper"]="minecraft:exposed_chiseled_copper";MinecraftItemTypes2["ExposedCopper"]="minecraft:exposed_copper";MinecraftItemTypes2["ExposedCopperBulb"]="minecraft:exposed_copper_bulb";MinecraftItemTypes2["ExposedCopperDoor"]="minecraft:exposed_copper_door";MinecraftItemTypes2["ExposedCopperGrate"]="minecraft:exposed_copper_grate";MinecraftItemTypes2["ExposedCopperTrapdoor"]="minecraft:exposed_copper_trapdoor";MinecraftItemTypes2["ExposedCutCopper"]="minecraft:exposed_cut_copper";MinecraftItemTypes2["ExposedCutCopperSlab"]="minecraft:exposed_cut_copper_slab";MinecraftItemTypes2["ExposedCutCopperStairs"]="minecraft:exposed_cut_copper_stairs";MinecraftItemTypes2["EyeArmorTrimSmithingTemplate"]="minecraft:eye_armor_trim_smithing_template";MinecraftItemTypes2["Farmland"]="minecraft:farmland";MinecraftItemTypes2["Feather"]="minecraft:feather";MinecraftItemTypes2["FenceGate"]="minecraft:fence_gate";MinecraftItemTypes2["FermentedSpiderEye"]="minecraft:fermented_spider_eye";MinecraftItemTypes2["Fern"]="minecraft:fern";MinecraftItemTypes2["FieldMasonedBannerPattern"]="minecraft:field_masoned_banner_pattern";MinecraftItemTypes2["FilledMap"]="minecraft:filled_map";MinecraftItemTypes2["FireCharge"]="minecraft:fire_charge";MinecraftItemTypes2["FireCoral"]="minecraft:fire_coral";MinecraftItemTypes2["FireCoralBlock"]="minecraft:fire_coral_block";MinecraftItemTypes2["FireCoralFan"]="minecraft:fire_coral_fan";MinecraftItemTypes2["FireworkRocket"]="minecraft:firework_rocket";MinecraftItemTypes2["FireworkStar"]="minecraft:firework_star";MinecraftItemTypes2["FishingRod"]="minecraft:fishing_rod";MinecraftItemTypes2["FletchingTable"]="minecraft:fletching_table";MinecraftItemTypes2["Flint"]="minecraft:flint";MinecraftItemTypes2["FlintAndSteel"]="minecraft:flint_and_steel";MinecraftItemTypes2["FlowArmorTrimSmithingTemplate"]="minecraft:flow_armor_trim_smithing_template";MinecraftItemTypes2["FlowBannerPattern"]="minecraft:flow_banner_pattern";MinecraftItemTypes2["FlowPotterySherd"]="minecraft:flow_pottery_sherd";MinecraftItemTypes2["FlowerBannerPattern"]="minecraft:flower_banner_pattern";MinecraftItemTypes2["FlowerPot"]="minecraft:flower_pot";MinecraftItemTypes2["FloweringAzalea"]="minecraft:flowering_azalea";MinecraftItemTypes2["FoxSpawnEgg"]="minecraft:fox_spawn_egg";MinecraftItemTypes2["Frame"]="minecraft:frame";MinecraftItemTypes2["FriendPotterySherd"]="minecraft:friend_pottery_sherd";MinecraftItemTypes2["FrogSpawn"]="minecraft:frog_spawn";MinecraftItemTypes2["FrogSpawnEgg"]="minecraft:frog_spawn_egg";MinecraftItemTypes2["FrostedIce"]="minecraft:frosted_ice";MinecraftItemTypes2["Furnace"]="minecraft:furnace";MinecraftItemTypes2["GhastSpawnEgg"]="minecraft:ghast_spawn_egg";MinecraftItemTypes2["GhastTear"]="minecraft:ghast_tear";MinecraftItemTypes2["GildedBlackstone"]="minecraft:gilded_blackstone";MinecraftItemTypes2["Glass"]="minecraft:glass";MinecraftItemTypes2["GlassBottle"]="minecraft:glass_bottle";MinecraftItemTypes2["GlassPane"]="minecraft:glass_pane";MinecraftItemTypes2["GlisteringMelonSlice"]="minecraft:glistering_melon_slice";MinecraftItemTypes2["GlobeBannerPattern"]="minecraft:globe_banner_pattern";MinecraftItemTypes2["GlowBerries"]="minecraft:glow_berries";MinecraftItemTypes2["GlowFrame"]="minecraft:glow_frame";MinecraftItemTypes2["GlowInkSac"]="minecraft:glow_ink_sac";MinecraftItemTypes2["GlowLichen"]="minecraft:glow_lichen";MinecraftItemTypes2["GlowSquidSpawnEgg"]="minecraft:glow_squid_spawn_egg";MinecraftItemTypes2["Glowstone"]="minecraft:glowstone";MinecraftItemTypes2["GlowstoneDust"]="minecraft:glowstone_dust";MinecraftItemTypes2["GoatHorn"]="minecraft:goat_horn";MinecraftItemTypes2["GoatSpawnEgg"]="minecraft:goat_spawn_egg";MinecraftItemTypes2["GoldBlock"]="minecraft:gold_block";MinecraftItemTypes2["GoldIngot"]="minecraft:gold_ingot";MinecraftItemTypes2["GoldNugget"]="minecraft:gold_nugget";MinecraftItemTypes2["GoldOre"]="minecraft:gold_ore";MinecraftItemTypes2["GoldenApple"]="minecraft:golden_apple";MinecraftItemTypes2["GoldenAxe"]="minecraft:golden_axe";MinecraftItemTypes2["GoldenBoots"]="minecraft:golden_boots";MinecraftItemTypes2["GoldenCarrot"]="minecraft:golden_carrot";MinecraftItemTypes2["GoldenChestplate"]="minecraft:golden_chestplate";MinecraftItemTypes2["GoldenHelmet"]="minecraft:golden_helmet";MinecraftItemTypes2["GoldenHoe"]="minecraft:golden_hoe";MinecraftItemTypes2["GoldenHorseArmor"]="minecraft:golden_horse_armor";MinecraftItemTypes2["GoldenLeggings"]="minecraft:golden_leggings";MinecraftItemTypes2["GoldenPickaxe"]="minecraft:golden_pickaxe";MinecraftItemTypes2["GoldenRail"]="minecraft:golden_rail";MinecraftItemTypes2["GoldenShovel"]="minecraft:golden_shovel";MinecraftItemTypes2["GoldenSword"]="minecraft:golden_sword";MinecraftItemTypes2["Granite"]="minecraft:granite";MinecraftItemTypes2["GraniteSlab"]="minecraft:granite_slab";MinecraftItemTypes2["GraniteStairs"]="minecraft:granite_stairs";MinecraftItemTypes2["GraniteWall"]="minecraft:granite_wall";MinecraftItemTypes2["GrassBlock"]="minecraft:grass_block";MinecraftItemTypes2["GrassPath"]="minecraft:grass_path";MinecraftItemTypes2["Gravel"]="minecraft:gravel";MinecraftItemTypes2["GrayCandle"]="minecraft:gray_candle";MinecraftItemTypes2["GrayCarpet"]="minecraft:gray_carpet";MinecraftItemTypes2["GrayConcrete"]="minecraft:gray_concrete";MinecraftItemTypes2["GrayConcretePowder"]="minecraft:gray_concrete_powder";MinecraftItemTypes2["GrayDye"]="minecraft:gray_dye";MinecraftItemTypes2["GrayGlazedTerracotta"]="minecraft:gray_glazed_terracotta";MinecraftItemTypes2["GrayShulkerBox"]="minecraft:gray_shulker_box";MinecraftItemTypes2["GrayStainedGlass"]="minecraft:gray_stained_glass";MinecraftItemTypes2["GrayStainedGlassPane"]="minecraft:gray_stained_glass_pane";MinecraftItemTypes2["GrayTerracotta"]="minecraft:gray_terracotta";MinecraftItemTypes2["GrayWool"]="minecraft:gray_wool";MinecraftItemTypes2["GreenCandle"]="minecraft:green_candle";MinecraftItemTypes2["GreenCarpet"]="minecraft:green_carpet";MinecraftItemTypes2["GreenConcrete"]="minecraft:green_concrete";MinecraftItemTypes2["GreenConcretePowder"]="minecraft:green_concrete_powder";MinecraftItemTypes2["GreenDye"]="minecraft:green_dye";MinecraftItemTypes2["GreenGlazedTerracotta"]="minecraft:green_glazed_terracotta";MinecraftItemTypes2["GreenShulkerBox"]="minecraft:green_shulker_box";MinecraftItemTypes2["GreenStainedGlass"]="minecraft:green_stained_glass";MinecraftItemTypes2["GreenStainedGlassPane"]="minecraft:green_stained_glass_pane";MinecraftItemTypes2["GreenTerracotta"]="minecraft:green_terracotta";MinecraftItemTypes2["GreenWool"]="minecraft:green_wool";MinecraftItemTypes2["Grindstone"]="minecraft:grindstone";MinecraftItemTypes2["GuardianSpawnEgg"]="minecraft:guardian_spawn_egg";MinecraftItemTypes2["Gunpowder"]="minecraft:gunpowder";MinecraftItemTypes2["GusterBannerPattern"]="minecraft:guster_banner_pattern";MinecraftItemTypes2["GusterPotterySherd"]="minecraft:guster_pottery_sherd";MinecraftItemTypes2["HangingRoots"]="minecraft:hanging_roots";MinecraftItemTypes2["HardenedClay"]="minecraft:hardened_clay";MinecraftItemTypes2["HayBlock"]="minecraft:hay_block";MinecraftItemTypes2["HeartOfTheSea"]="minecraft:heart_of_the_sea";MinecraftItemTypes2["HeartPotterySherd"]="minecraft:heart_pottery_sherd";MinecraftItemTypes2["HeartbreakPotterySherd"]="minecraft:heartbreak_pottery_sherd";MinecraftItemTypes2["HeavyCore"]="minecraft:heavy_core";MinecraftItemTypes2["HeavyWeightedPressurePlate"]="minecraft:heavy_weighted_pressure_plate";MinecraftItemTypes2["HoglinSpawnEgg"]="minecraft:hoglin_spawn_egg";MinecraftItemTypes2["HoneyBlock"]="minecraft:honey_block";MinecraftItemTypes2["HoneyBottle"]="minecraft:honey_bottle";MinecraftItemTypes2["Honeycomb"]="minecraft:honeycomb";MinecraftItemTypes2["HoneycombBlock"]="minecraft:honeycomb_block";MinecraftItemTypes2["Hopper"]="minecraft:hopper";MinecraftItemTypes2["HopperMinecart"]="minecraft:hopper_minecart";MinecraftItemTypes2["HornCoral"]="minecraft:horn_coral";MinecraftItemTypes2["HornCoralBlock"]="minecraft:horn_coral_block";MinecraftItemTypes2["HornCoralFan"]="minecraft:horn_coral_fan";MinecraftItemTypes2["HorseSpawnEgg"]="minecraft:horse_spawn_egg";MinecraftItemTypes2["HostArmorTrimSmithingTemplate"]="minecraft:host_armor_trim_smithing_template";MinecraftItemTypes2["HowlPotterySherd"]="minecraft:howl_pottery_sherd";MinecraftItemTypes2["HuskSpawnEgg"]="minecraft:husk_spawn_egg";MinecraftItemTypes2["Ice"]="minecraft:ice";MinecraftItemTypes2["InfestedChiseledStoneBricks"]="minecraft:infested_chiseled_stone_bricks";MinecraftItemTypes2["InfestedCobblestone"]="minecraft:infested_cobblestone";MinecraftItemTypes2["InfestedCrackedStoneBricks"]="minecraft:infested_cracked_stone_bricks";MinecraftItemTypes2["InfestedDeepslate"]="minecraft:infested_deepslate";MinecraftItemTypes2["InfestedMossyStoneBricks"]="minecraft:infested_mossy_stone_bricks";MinecraftItemTypes2["InfestedStone"]="minecraft:infested_stone";MinecraftItemTypes2["InfestedStoneBricks"]="minecraft:infested_stone_bricks";MinecraftItemTypes2["InkSac"]="minecraft:ink_sac";MinecraftItemTypes2["IronAxe"]="minecraft:iron_axe";MinecraftItemTypes2["IronBars"]="minecraft:iron_bars";MinecraftItemTypes2["IronBlock"]="minecraft:iron_block";MinecraftItemTypes2["IronBoots"]="minecraft:iron_boots";MinecraftItemTypes2["IronChestplate"]="minecraft:iron_chestplate";MinecraftItemTypes2["IronDoor"]="minecraft:iron_door";MinecraftItemTypes2["IronGolemSpawnEgg"]="minecraft:iron_golem_spawn_egg";MinecraftItemTypes2["IronHelmet"]="minecraft:iron_helmet";MinecraftItemTypes2["IronHoe"]="minecraft:iron_hoe";MinecraftItemTypes2["IronHorseArmor"]="minecraft:iron_horse_armor";MinecraftItemTypes2["IronIngot"]="minecraft:iron_ingot";MinecraftItemTypes2["IronLeggings"]="minecraft:iron_leggings";MinecraftItemTypes2["IronNugget"]="minecraft:iron_nugget";MinecraftItemTypes2["IronOre"]="minecraft:iron_ore";MinecraftItemTypes2["IronPickaxe"]="minecraft:iron_pickaxe";MinecraftItemTypes2["IronShovel"]="minecraft:iron_shovel";MinecraftItemTypes2["IronSword"]="minecraft:iron_sword";MinecraftItemTypes2["IronTrapdoor"]="minecraft:iron_trapdoor";MinecraftItemTypes2["Jigsaw"]="minecraft:jigsaw";MinecraftItemTypes2["Jukebox"]="minecraft:jukebox";MinecraftItemTypes2["JungleBoat"]="minecraft:jungle_boat";MinecraftItemTypes2["JungleButton"]="minecraft:jungle_button";MinecraftItemTypes2["JungleChestBoat"]="minecraft:jungle_chest_boat";MinecraftItemTypes2["JungleDoor"]="minecraft:jungle_door";MinecraftItemTypes2["JungleFence"]="minecraft:jungle_fence";MinecraftItemTypes2["JungleFenceGate"]="minecraft:jungle_fence_gate";MinecraftItemTypes2["JungleHangingSign"]="minecraft:jungle_hanging_sign";MinecraftItemTypes2["JungleLeaves"]="minecraft:jungle_leaves";MinecraftItemTypes2["JungleLog"]="minecraft:jungle_log";MinecraftItemTypes2["JunglePlanks"]="minecraft:jungle_planks";MinecraftItemTypes2["JunglePressurePlate"]="minecraft:jungle_pressure_plate";MinecraftItemTypes2["JungleSapling"]="minecraft:jungle_sapling";MinecraftItemTypes2["JungleSign"]="minecraft:jungle_sign";MinecraftItemTypes2["JungleSlab"]="minecraft:jungle_slab";MinecraftItemTypes2["JungleStairs"]="minecraft:jungle_stairs";MinecraftItemTypes2["JungleTrapdoor"]="minecraft:jungle_trapdoor";MinecraftItemTypes2["JungleWood"]="minecraft:jungle_wood";MinecraftItemTypes2["Kelp"]="minecraft:kelp";MinecraftItemTypes2["Ladder"]="minecraft:ladder";MinecraftItemTypes2["Lantern"]="minecraft:lantern";MinecraftItemTypes2["LapisBlock"]="minecraft:lapis_block";MinecraftItemTypes2["LapisLazuli"]="minecraft:lapis_lazuli";MinecraftItemTypes2["LapisOre"]="minecraft:lapis_ore";MinecraftItemTypes2["LargeAmethystBud"]="minecraft:large_amethyst_bud";MinecraftItemTypes2["LargeFern"]="minecraft:large_fern";MinecraftItemTypes2["LavaBucket"]="minecraft:lava_bucket";MinecraftItemTypes2["Lead"]="minecraft:lead";MinecraftItemTypes2["Leather"]="minecraft:leather";MinecraftItemTypes2["LeatherBoots"]="minecraft:leather_boots";MinecraftItemTypes2["LeatherChestplate"]="minecraft:leather_chestplate";MinecraftItemTypes2["LeatherHelmet"]="minecraft:leather_helmet";MinecraftItemTypes2["LeatherHorseArmor"]="minecraft:leather_horse_armor";MinecraftItemTypes2["LeatherLeggings"]="minecraft:leather_leggings";MinecraftItemTypes2["Lectern"]="minecraft:lectern";MinecraftItemTypes2["Lever"]="minecraft:lever";MinecraftItemTypes2["LightBlock0"]="minecraft:light_block_0";MinecraftItemTypes2["LightBlock1"]="minecraft:light_block_1";MinecraftItemTypes2["LightBlock10"]="minecraft:light_block_10";MinecraftItemTypes2["LightBlock11"]="minecraft:light_block_11";MinecraftItemTypes2["LightBlock12"]="minecraft:light_block_12";MinecraftItemTypes2["LightBlock13"]="minecraft:light_block_13";MinecraftItemTypes2["LightBlock14"]="minecraft:light_block_14";MinecraftItemTypes2["LightBlock15"]="minecraft:light_block_15";MinecraftItemTypes2["LightBlock2"]="minecraft:light_block_2";MinecraftItemTypes2["LightBlock3"]="minecraft:light_block_3";MinecraftItemTypes2["LightBlock4"]="minecraft:light_block_4";MinecraftItemTypes2["LightBlock5"]="minecraft:light_block_5";MinecraftItemTypes2["LightBlock6"]="minecraft:light_block_6";MinecraftItemTypes2["LightBlock7"]="minecraft:light_block_7";MinecraftItemTypes2["LightBlock8"]="minecraft:light_block_8";MinecraftItemTypes2["LightBlock9"]="minecraft:light_block_9";MinecraftItemTypes2["LightBlueCandle"]="minecraft:light_blue_candle";MinecraftItemTypes2["LightBlueCarpet"]="minecraft:light_blue_carpet";MinecraftItemTypes2["LightBlueConcrete"]="minecraft:light_blue_concrete";MinecraftItemTypes2["LightBlueConcretePowder"]="minecraft:light_blue_concrete_powder";MinecraftItemTypes2["LightBlueDye"]="minecraft:light_blue_dye";MinecraftItemTypes2["LightBlueGlazedTerracotta"]="minecraft:light_blue_glazed_terracotta";MinecraftItemTypes2["LightBlueShulkerBox"]="minecraft:light_blue_shulker_box";MinecraftItemTypes2["LightBlueStainedGlass"]="minecraft:light_blue_stained_glass";MinecraftItemTypes2["LightBlueStainedGlassPane"]="minecraft:light_blue_stained_glass_pane";MinecraftItemTypes2["LightBlueTerracotta"]="minecraft:light_blue_terracotta";MinecraftItemTypes2["LightBlueWool"]="minecraft:light_blue_wool";MinecraftItemTypes2["LightGrayCandle"]="minecraft:light_gray_candle";MinecraftItemTypes2["LightGrayCarpet"]="minecraft:light_gray_carpet";MinecraftItemTypes2["LightGrayConcrete"]="minecraft:light_gray_concrete";MinecraftItemTypes2["LightGrayConcretePowder"]="minecraft:light_gray_concrete_powder";MinecraftItemTypes2["LightGrayDye"]="minecraft:light_gray_dye";MinecraftItemTypes2["LightGrayShulkerBox"]="minecraft:light_gray_shulker_box";MinecraftItemTypes2["LightGrayStainedGlass"]="minecraft:light_gray_stained_glass";MinecraftItemTypes2["LightGrayStainedGlassPane"]="minecraft:light_gray_stained_glass_pane";MinecraftItemTypes2["LightGrayTerracotta"]="minecraft:light_gray_terracotta";MinecraftItemTypes2["LightGrayWool"]="minecraft:light_gray_wool";MinecraftItemTypes2["LightWeightedPressurePlate"]="minecraft:light_weighted_pressure_plate";MinecraftItemTypes2["LightningRod"]="minecraft:lightning_rod";MinecraftItemTypes2["Lilac"]="minecraft:lilac";MinecraftItemTypes2["LilyOfTheValley"]="minecraft:lily_of_the_valley";MinecraftItemTypes2["LimeCandle"]="minecraft:lime_candle";MinecraftItemTypes2["LimeCarpet"]="minecraft:lime_carpet";MinecraftItemTypes2["LimeConcrete"]="minecraft:lime_concrete";MinecraftItemTypes2["LimeConcretePowder"]="minecraft:lime_concrete_powder";MinecraftItemTypes2["LimeDye"]="minecraft:lime_dye";MinecraftItemTypes2["LimeGlazedTerracotta"]="minecraft:lime_glazed_terracotta";MinecraftItemTypes2["LimeShulkerBox"]="minecraft:lime_shulker_box";MinecraftItemTypes2["LimeStainedGlass"]="minecraft:lime_stained_glass";MinecraftItemTypes2["LimeStainedGlassPane"]="minecraft:lime_stained_glass_pane";MinecraftItemTypes2["LimeTerracotta"]="minecraft:lime_terracotta";MinecraftItemTypes2["LimeWool"]="minecraft:lime_wool";MinecraftItemTypes2["LingeringPotion"]="minecraft:lingering_potion";MinecraftItemTypes2["LitPumpkin"]="minecraft:lit_pumpkin";MinecraftItemTypes2["LlamaSpawnEgg"]="minecraft:llama_spawn_egg";MinecraftItemTypes2["Lodestone"]="minecraft:lodestone";MinecraftItemTypes2["LodestoneCompass"]="minecraft:lodestone_compass";MinecraftItemTypes2["Loom"]="minecraft:loom";MinecraftItemTypes2["Mace"]="minecraft:mace";MinecraftItemTypes2["MagentaCandle"]="minecraft:magenta_candle";MinecraftItemTypes2["MagentaCarpet"]="minecraft:magenta_carpet";MinecraftItemTypes2["MagentaConcrete"]="minecraft:magenta_concrete";MinecraftItemTypes2["MagentaConcretePowder"]="minecraft:magenta_concrete_powder";MinecraftItemTypes2["MagentaDye"]="minecraft:magenta_dye";MinecraftItemTypes2["MagentaGlazedTerracotta"]="minecraft:magenta_glazed_terracotta";MinecraftItemTypes2["MagentaShulkerBox"]="minecraft:magenta_shulker_box";MinecraftItemTypes2["MagentaStainedGlass"]="minecraft:magenta_stained_glass";MinecraftItemTypes2["MagentaStainedGlassPane"]="minecraft:magenta_stained_glass_pane";MinecraftItemTypes2["MagentaTerracotta"]="minecraft:magenta_terracotta";MinecraftItemTypes2["MagentaWool"]="minecraft:magenta_wool";MinecraftItemTypes2["Magma"]="minecraft:magma";MinecraftItemTypes2["MagmaCream"]="minecraft:magma_cream";MinecraftItemTypes2["MagmaCubeSpawnEgg"]="minecraft:magma_cube_spawn_egg";MinecraftItemTypes2["MangroveBoat"]="minecraft:mangrove_boat";MinecraftItemTypes2["MangroveButton"]="minecraft:mangrove_button";MinecraftItemTypes2["MangroveChestBoat"]="minecraft:mangrove_chest_boat";MinecraftItemTypes2["MangroveDoor"]="minecraft:mangrove_door";MinecraftItemTypes2["MangroveFence"]="minecraft:mangrove_fence";MinecraftItemTypes2["MangroveFenceGate"]="minecraft:mangrove_fence_gate";MinecraftItemTypes2["MangroveHangingSign"]="minecraft:mangrove_hanging_sign";MinecraftItemTypes2["MangroveLeaves"]="minecraft:mangrove_leaves";MinecraftItemTypes2["MangroveLog"]="minecraft:mangrove_log";MinecraftItemTypes2["MangrovePlanks"]="minecraft:mangrove_planks";MinecraftItemTypes2["MangrovePressurePlate"]="minecraft:mangrove_pressure_plate";MinecraftItemTypes2["MangrovePropagule"]="minecraft:mangrove_propagule";MinecraftItemTypes2["MangroveRoots"]="minecraft:mangrove_roots";MinecraftItemTypes2["MangroveSign"]="minecraft:mangrove_sign";MinecraftItemTypes2["MangroveSlab"]="minecraft:mangrove_slab";MinecraftItemTypes2["MangroveStairs"]="minecraft:mangrove_stairs";MinecraftItemTypes2["MangroveTrapdoor"]="minecraft:mangrove_trapdoor";MinecraftItemTypes2["MangroveWood"]="minecraft:mangrove_wood";MinecraftItemTypes2["MediumAmethystBud"]="minecraft:medium_amethyst_bud";MinecraftItemTypes2["MelonBlock"]="minecraft:melon_block";MinecraftItemTypes2["MelonSeeds"]="minecraft:melon_seeds";MinecraftItemTypes2["MelonSlice"]="minecraft:melon_slice";MinecraftItemTypes2["MilkBucket"]="minecraft:milk_bucket";MinecraftItemTypes2["Minecart"]="minecraft:minecart";MinecraftItemTypes2["MinerPotterySherd"]="minecraft:miner_pottery_sherd";MinecraftItemTypes2["MobSpawner"]="minecraft:mob_spawner";MinecraftItemTypes2["MojangBannerPattern"]="minecraft:mojang_banner_pattern";MinecraftItemTypes2["MooshroomSpawnEgg"]="minecraft:mooshroom_spawn_egg";MinecraftItemTypes2["MossBlock"]="minecraft:moss_block";MinecraftItemTypes2["MossCarpet"]="minecraft:moss_carpet";MinecraftItemTypes2["MossyCobblestone"]="minecraft:mossy_cobblestone";MinecraftItemTypes2["MossyCobblestoneSlab"]="minecraft:mossy_cobblestone_slab";MinecraftItemTypes2["MossyCobblestoneStairs"]="minecraft:mossy_cobblestone_stairs";MinecraftItemTypes2["MossyCobblestoneWall"]="minecraft:mossy_cobblestone_wall";MinecraftItemTypes2["MossyStoneBrickSlab"]="minecraft:mossy_stone_brick_slab";MinecraftItemTypes2["MossyStoneBrickStairs"]="minecraft:mossy_stone_brick_stairs";MinecraftItemTypes2["MossyStoneBrickWall"]="minecraft:mossy_stone_brick_wall";MinecraftItemTypes2["MossyStoneBricks"]="minecraft:mossy_stone_bricks";MinecraftItemTypes2["MournerPotterySherd"]="minecraft:mourner_pottery_sherd";MinecraftItemTypes2["Mud"]="minecraft:mud";MinecraftItemTypes2["MudBrickSlab"]="minecraft:mud_brick_slab";MinecraftItemTypes2["MudBrickStairs"]="minecraft:mud_brick_stairs";MinecraftItemTypes2["MudBrickWall"]="minecraft:mud_brick_wall";MinecraftItemTypes2["MudBricks"]="minecraft:mud_bricks";MinecraftItemTypes2["MuddyMangroveRoots"]="minecraft:muddy_mangrove_roots";MinecraftItemTypes2["MuleSpawnEgg"]="minecraft:mule_spawn_egg";MinecraftItemTypes2["MushroomStew"]="minecraft:mushroom_stew";MinecraftItemTypes2["MusicDisc11"]="minecraft:music_disc_11";MinecraftItemTypes2["MusicDisc13"]="minecraft:music_disc_13";MinecraftItemTypes2["MusicDisc5"]="minecraft:music_disc_5";MinecraftItemTypes2["MusicDiscBlocks"]="minecraft:music_disc_blocks";MinecraftItemTypes2["MusicDiscCat"]="minecraft:music_disc_cat";MinecraftItemTypes2["MusicDiscChirp"]="minecraft:music_disc_chirp";MinecraftItemTypes2["MusicDiscCreator"]="minecraft:music_disc_creator";MinecraftItemTypes2["MusicDiscCreatorMusicBox"]="minecraft:music_disc_creator_music_box";MinecraftItemTypes2["MusicDiscFar"]="minecraft:music_disc_far";MinecraftItemTypes2["MusicDiscMall"]="minecraft:music_disc_mall";MinecraftItemTypes2["MusicDiscMellohi"]="minecraft:music_disc_mellohi";MinecraftItemTypes2["MusicDiscOtherside"]="minecraft:music_disc_otherside";MinecraftItemTypes2["MusicDiscPigstep"]="minecraft:music_disc_pigstep";MinecraftItemTypes2["MusicDiscPrecipice"]="minecraft:music_disc_precipice";MinecraftItemTypes2["MusicDiscRelic"]="minecraft:music_disc_relic";MinecraftItemTypes2["MusicDiscStal"]="minecraft:music_disc_stal";MinecraftItemTypes2["MusicDiscStrad"]="minecraft:music_disc_strad";MinecraftItemTypes2["MusicDiscWait"]="minecraft:music_disc_wait";MinecraftItemTypes2["MusicDiscWard"]="minecraft:music_disc_ward";MinecraftItemTypes2["Mutton"]="minecraft:mutton";MinecraftItemTypes2["Mycelium"]="minecraft:mycelium";MinecraftItemTypes2["NameTag"]="minecraft:name_tag";MinecraftItemTypes2["NautilusShell"]="minecraft:nautilus_shell";MinecraftItemTypes2["NetherBrick"]="minecraft:nether_brick";MinecraftItemTypes2["NetherBrickFence"]="minecraft:nether_brick_fence";MinecraftItemTypes2["NetherBrickSlab"]="minecraft:nether_brick_slab";MinecraftItemTypes2["NetherBrickStairs"]="minecraft:nether_brick_stairs";MinecraftItemTypes2["NetherBrickWall"]="minecraft:nether_brick_wall";MinecraftItemTypes2["NetherGoldOre"]="minecraft:nether_gold_ore";MinecraftItemTypes2["NetherSprouts"]="minecraft:nether_sprouts";MinecraftItemTypes2["NetherStar"]="minecraft:nether_star";MinecraftItemTypes2["NetherWart"]="minecraft:nether_wart";MinecraftItemTypes2["NetherWartBlock"]="minecraft:nether_wart_block";MinecraftItemTypes2["Netherbrick"]="minecraft:netherbrick";MinecraftItemTypes2["NetheriteAxe"]="minecraft:netherite_axe";MinecraftItemTypes2["NetheriteBlock"]="minecraft:netherite_block";MinecraftItemTypes2["NetheriteBoots"]="minecraft:netherite_boots";MinecraftItemTypes2["NetheriteChestplate"]="minecraft:netherite_chestplate";MinecraftItemTypes2["NetheriteHelmet"]="minecraft:netherite_helmet";MinecraftItemTypes2["NetheriteHoe"]="minecraft:netherite_hoe";MinecraftItemTypes2["NetheriteIngot"]="minecraft:netherite_ingot";MinecraftItemTypes2["NetheriteLeggings"]="minecraft:netherite_leggings";MinecraftItemTypes2["NetheritePickaxe"]="minecraft:netherite_pickaxe";MinecraftItemTypes2["NetheriteScrap"]="minecraft:netherite_scrap";MinecraftItemTypes2["NetheriteShovel"]="minecraft:netherite_shovel";MinecraftItemTypes2["NetheriteSword"]="minecraft:netherite_sword";MinecraftItemTypes2["NetheriteUpgradeSmithingTemplate"]="minecraft:netherite_upgrade_smithing_template";MinecraftItemTypes2["Netherrack"]="minecraft:netherrack";MinecraftItemTypes2["NormalStoneSlab"]="minecraft:normal_stone_slab";MinecraftItemTypes2["NormalStoneStairs"]="minecraft:normal_stone_stairs";MinecraftItemTypes2["Noteblock"]="minecraft:noteblock";MinecraftItemTypes2["OakBoat"]="minecraft:oak_boat";MinecraftItemTypes2["OakChestBoat"]="minecraft:oak_chest_boat";MinecraftItemTypes2["OakFence"]="minecraft:oak_fence";MinecraftItemTypes2["OakHangingSign"]="minecraft:oak_hanging_sign";MinecraftItemTypes2["OakLeaves"]="minecraft:oak_leaves";MinecraftItemTypes2["OakLog"]="minecraft:oak_log";MinecraftItemTypes2["OakPlanks"]="minecraft:oak_planks";MinecraftItemTypes2["OakSapling"]="minecraft:oak_sapling";MinecraftItemTypes2["OakSign"]="minecraft:oak_sign";MinecraftItemTypes2["OakSlab"]="minecraft:oak_slab";MinecraftItemTypes2["OakStairs"]="minecraft:oak_stairs";MinecraftItemTypes2["OakWood"]="minecraft:oak_wood";MinecraftItemTypes2["Observer"]="minecraft:observer";MinecraftItemTypes2["Obsidian"]="minecraft:obsidian";MinecraftItemTypes2["OcelotSpawnEgg"]="minecraft:ocelot_spawn_egg";MinecraftItemTypes2["OchreFroglight"]="minecraft:ochre_froglight";MinecraftItemTypes2["OminousBottle"]="minecraft:ominous_bottle";MinecraftItemTypes2["OminousTrialKey"]="minecraft:ominous_trial_key";MinecraftItemTypes2["OrangeCandle"]="minecraft:orange_candle";MinecraftItemTypes2["OrangeCarpet"]="minecraft:orange_carpet";MinecraftItemTypes2["OrangeConcrete"]="minecraft:orange_concrete";MinecraftItemTypes2["OrangeConcretePowder"]="minecraft:orange_concrete_powder";MinecraftItemTypes2["OrangeDye"]="minecraft:orange_dye";MinecraftItemTypes2["OrangeGlazedTerracotta"]="minecraft:orange_glazed_terracotta";MinecraftItemTypes2["OrangeShulkerBox"]="minecraft:orange_shulker_box";MinecraftItemTypes2["OrangeStainedGlass"]="minecraft:orange_stained_glass";MinecraftItemTypes2["OrangeStainedGlassPane"]="minecraft:orange_stained_glass_pane";MinecraftItemTypes2["OrangeTerracotta"]="minecraft:orange_terracotta";MinecraftItemTypes2["OrangeTulip"]="minecraft:orange_tulip";MinecraftItemTypes2["OrangeWool"]="minecraft:orange_wool";MinecraftItemTypes2["OxeyeDaisy"]="minecraft:oxeye_daisy";MinecraftItemTypes2["OxidizedChiseledCopper"]="minecraft:oxidized_chiseled_copper";MinecraftItemTypes2["OxidizedCopper"]="minecraft:oxidized_copper";MinecraftItemTypes2["OxidizedCopperBulb"]="minecraft:oxidized_copper_bulb";MinecraftItemTypes2["OxidizedCopperDoor"]="minecraft:oxidized_copper_door";MinecraftItemTypes2["OxidizedCopperGrate"]="minecraft:oxidized_copper_grate";MinecraftItemTypes2["OxidizedCopperTrapdoor"]="minecraft:oxidized_copper_trapdoor";MinecraftItemTypes2["OxidizedCutCopper"]="minecraft:oxidized_cut_copper";MinecraftItemTypes2["OxidizedCutCopperSlab"]="minecraft:oxidized_cut_copper_slab";MinecraftItemTypes2["OxidizedCutCopperStairs"]="minecraft:oxidized_cut_copper_stairs";MinecraftItemTypes2["PackedIce"]="minecraft:packed_ice";MinecraftItemTypes2["PackedMud"]="minecraft:packed_mud";MinecraftItemTypes2["Painting"]="minecraft:painting";MinecraftItemTypes2["PandaSpawnEgg"]="minecraft:panda_spawn_egg";MinecraftItemTypes2["Paper"]="minecraft:paper";MinecraftItemTypes2["ParrotSpawnEgg"]="minecraft:parrot_spawn_egg";MinecraftItemTypes2["PearlescentFroglight"]="minecraft:pearlescent_froglight";MinecraftItemTypes2["Peony"]="minecraft:peony";MinecraftItemTypes2["PetrifiedOakSlab"]="minecraft:petrified_oak_slab";MinecraftItemTypes2["PhantomMembrane"]="minecraft:phantom_membrane";MinecraftItemTypes2["PhantomSpawnEgg"]="minecraft:phantom_spawn_egg";MinecraftItemTypes2["PigSpawnEgg"]="minecraft:pig_spawn_egg";MinecraftItemTypes2["PiglinBannerPattern"]="minecraft:piglin_banner_pattern";MinecraftItemTypes2["PiglinBruteSpawnEgg"]="minecraft:piglin_brute_spawn_egg";MinecraftItemTypes2["PiglinSpawnEgg"]="minecraft:piglin_spawn_egg";MinecraftItemTypes2["PillagerSpawnEgg"]="minecraft:pillager_spawn_egg";MinecraftItemTypes2["PinkCandle"]="minecraft:pink_candle";MinecraftItemTypes2["PinkCarpet"]="minecraft:pink_carpet";MinecraftItemTypes2["PinkConcrete"]="minecraft:pink_concrete";MinecraftItemTypes2["PinkConcretePowder"]="minecraft:pink_concrete_powder";MinecraftItemTypes2["PinkDye"]="minecraft:pink_dye";MinecraftItemTypes2["PinkGlazedTerracotta"]="minecraft:pink_glazed_terracotta";MinecraftItemTypes2["PinkPetals"]="minecraft:pink_petals";MinecraftItemTypes2["PinkShulkerBox"]="minecraft:pink_shulker_box";MinecraftItemTypes2["PinkStainedGlass"]="minecraft:pink_stained_glass";MinecraftItemTypes2["PinkStainedGlassPane"]="minecraft:pink_stained_glass_pane";MinecraftItemTypes2["PinkTerracotta"]="minecraft:pink_terracotta";MinecraftItemTypes2["PinkTulip"]="minecraft:pink_tulip";MinecraftItemTypes2["PinkWool"]="minecraft:pink_wool";MinecraftItemTypes2["Piston"]="minecraft:piston";MinecraftItemTypes2["PitcherPlant"]="minecraft:pitcher_plant";MinecraftItemTypes2["PitcherPod"]="minecraft:pitcher_pod";MinecraftItemTypes2["PlentyPotterySherd"]="minecraft:plenty_pottery_sherd";MinecraftItemTypes2["Podzol"]="minecraft:podzol";MinecraftItemTypes2["PointedDripstone"]="minecraft:pointed_dripstone";MinecraftItemTypes2["PoisonousPotato"]="minecraft:poisonous_potato";MinecraftItemTypes2["PolarBearSpawnEgg"]="minecraft:polar_bear_spawn_egg";MinecraftItemTypes2["PolishedAndesite"]="minecraft:polished_andesite";MinecraftItemTypes2["PolishedAndesiteSlab"]="minecraft:polished_andesite_slab";MinecraftItemTypes2["PolishedAndesiteStairs"]="minecraft:polished_andesite_stairs";MinecraftItemTypes2["PolishedBasalt"]="minecraft:polished_basalt";MinecraftItemTypes2["PolishedBlackstone"]="minecraft:polished_blackstone";MinecraftItemTypes2["PolishedBlackstoneBrickSlab"]="minecraft:polished_blackstone_brick_slab";MinecraftItemTypes2["PolishedBlackstoneBrickStairs"]="minecraft:polished_blackstone_brick_stairs";MinecraftItemTypes2["PolishedBlackstoneBrickWall"]="minecraft:polished_blackstone_brick_wall";MinecraftItemTypes2["PolishedBlackstoneBricks"]="minecraft:polished_blackstone_bricks";MinecraftItemTypes2["PolishedBlackstoneButton"]="minecraft:polished_blackstone_button";MinecraftItemTypes2["PolishedBlackstonePressurePlate"]="minecraft:polished_blackstone_pressure_plate";MinecraftItemTypes2["PolishedBlackstoneSlab"]="minecraft:polished_blackstone_slab";MinecraftItemTypes2["PolishedBlackstoneStairs"]="minecraft:polished_blackstone_stairs";MinecraftItemTypes2["PolishedBlackstoneWall"]="minecraft:polished_blackstone_wall";MinecraftItemTypes2["PolishedDeepslate"]="minecraft:polished_deepslate";MinecraftItemTypes2["PolishedDeepslateSlab"]="minecraft:polished_deepslate_slab";MinecraftItemTypes2["PolishedDeepslateStairs"]="minecraft:polished_deepslate_stairs";MinecraftItemTypes2["PolishedDeepslateWall"]="minecraft:polished_deepslate_wall";MinecraftItemTypes2["PolishedDiorite"]="minecraft:polished_diorite";MinecraftItemTypes2["PolishedDioriteSlab"]="minecraft:polished_diorite_slab";MinecraftItemTypes2["PolishedDioriteStairs"]="minecraft:polished_diorite_stairs";MinecraftItemTypes2["PolishedGranite"]="minecraft:polished_granite";MinecraftItemTypes2["PolishedGraniteSlab"]="minecraft:polished_granite_slab";MinecraftItemTypes2["PolishedGraniteStairs"]="minecraft:polished_granite_stairs";MinecraftItemTypes2["PolishedTuff"]="minecraft:polished_tuff";MinecraftItemTypes2["PolishedTuffSlab"]="minecraft:polished_tuff_slab";MinecraftItemTypes2["PolishedTuffStairs"]="minecraft:polished_tuff_stairs";MinecraftItemTypes2["PolishedTuffWall"]="minecraft:polished_tuff_wall";MinecraftItemTypes2["PoppedChorusFruit"]="minecraft:popped_chorus_fruit";MinecraftItemTypes2["Poppy"]="minecraft:poppy";MinecraftItemTypes2["Porkchop"]="minecraft:porkchop";MinecraftItemTypes2["Potato"]="minecraft:potato";MinecraftItemTypes2["Potion"]="minecraft:potion";MinecraftItemTypes2["PowderSnowBucket"]="minecraft:powder_snow_bucket";MinecraftItemTypes2["Prismarine"]="minecraft:prismarine";MinecraftItemTypes2["PrismarineBrickSlab"]="minecraft:prismarine_brick_slab";MinecraftItemTypes2["PrismarineBricks"]="minecraft:prismarine_bricks";MinecraftItemTypes2["PrismarineBricksStairs"]="minecraft:prismarine_bricks_stairs";MinecraftItemTypes2["PrismarineCrystals"]="minecraft:prismarine_crystals";MinecraftItemTypes2["PrismarineShard"]="minecraft:prismarine_shard";MinecraftItemTypes2["PrismarineSlab"]="minecraft:prismarine_slab";MinecraftItemTypes2["PrismarineStairs"]="minecraft:prismarine_stairs";MinecraftItemTypes2["PrismarineWall"]="minecraft:prismarine_wall";MinecraftItemTypes2["PrizePotterySherd"]="minecraft:prize_pottery_sherd";MinecraftItemTypes2["Pufferfish"]="minecraft:pufferfish";MinecraftItemTypes2["PufferfishBucket"]="minecraft:pufferfish_bucket";MinecraftItemTypes2["PufferfishSpawnEgg"]="minecraft:pufferfish_spawn_egg";MinecraftItemTypes2["Pumpkin"]="minecraft:pumpkin";MinecraftItemTypes2["PumpkinPie"]="minecraft:pumpkin_pie";MinecraftItemTypes2["PumpkinSeeds"]="minecraft:pumpkin_seeds";MinecraftItemTypes2["PurpleCandle"]="minecraft:purple_candle";MinecraftItemTypes2["PurpleCarpet"]="minecraft:purple_carpet";MinecraftItemTypes2["PurpleConcrete"]="minecraft:purple_concrete";MinecraftItemTypes2["PurpleConcretePowder"]="minecraft:purple_concrete_powder";MinecraftItemTypes2["PurpleDye"]="minecraft:purple_dye";MinecraftItemTypes2["PurpleGlazedTerracotta"]="minecraft:purple_glazed_terracotta";MinecraftItemTypes2["PurpleShulkerBox"]="minecraft:purple_shulker_box";MinecraftItemTypes2["PurpleStainedGlass"]="minecraft:purple_stained_glass";MinecraftItemTypes2["PurpleStainedGlassPane"]="minecraft:purple_stained_glass_pane";MinecraftItemTypes2["PurpleTerracotta"]="minecraft:purple_terracotta";MinecraftItemTypes2["PurpleWool"]="minecraft:purple_wool";MinecraftItemTypes2["PurpurBlock"]="minecraft:purpur_block";MinecraftItemTypes2["PurpurPillar"]="minecraft:purpur_pillar";MinecraftItemTypes2["PurpurSlab"]="minecraft:purpur_slab";MinecraftItemTypes2["PurpurStairs"]="minecraft:purpur_stairs";MinecraftItemTypes2["Quartz"]="minecraft:quartz";MinecraftItemTypes2["QuartzBlock"]="minecraft:quartz_block";MinecraftItemTypes2["QuartzBricks"]="minecraft:quartz_bricks";MinecraftItemTypes2["QuartzOre"]="minecraft:quartz_ore";MinecraftItemTypes2["QuartzPillar"]="minecraft:quartz_pillar";MinecraftItemTypes2["QuartzSlab"]="minecraft:quartz_slab";MinecraftItemTypes2["QuartzStairs"]="minecraft:quartz_stairs";MinecraftItemTypes2["Rabbit"]="minecraft:rabbit";MinecraftItemTypes2["RabbitFoot"]="minecraft:rabbit_foot";MinecraftItemTypes2["RabbitHide"]="minecraft:rabbit_hide";MinecraftItemTypes2["RabbitSpawnEgg"]="minecraft:rabbit_spawn_egg";MinecraftItemTypes2["RabbitStew"]="minecraft:rabbit_stew";MinecraftItemTypes2["Rail"]="minecraft:rail";MinecraftItemTypes2["RaiserArmorTrimSmithingTemplate"]="minecraft:raiser_armor_trim_smithing_template";MinecraftItemTypes2["RavagerSpawnEgg"]="minecraft:ravager_spawn_egg";MinecraftItemTypes2["RawCopper"]="minecraft:raw_copper";MinecraftItemTypes2["RawCopperBlock"]="minecraft:raw_copper_block";MinecraftItemTypes2["RawGold"]="minecraft:raw_gold";MinecraftItemTypes2["RawGoldBlock"]="minecraft:raw_gold_block";MinecraftItemTypes2["RawIron"]="minecraft:raw_iron";MinecraftItemTypes2["RawIronBlock"]="minecraft:raw_iron_block";MinecraftItemTypes2["RecoveryCompass"]="minecraft:recovery_compass";MinecraftItemTypes2["RedCandle"]="minecraft:red_candle";MinecraftItemTypes2["RedCarpet"]="minecraft:red_carpet";MinecraftItemTypes2["RedConcrete"]="minecraft:red_concrete";MinecraftItemTypes2["RedConcretePowder"]="minecraft:red_concrete_powder";MinecraftItemTypes2["RedDye"]="minecraft:red_dye";MinecraftItemTypes2["RedGlazedTerracotta"]="minecraft:red_glazed_terracotta";MinecraftItemTypes2["RedMushroom"]="minecraft:red_mushroom";MinecraftItemTypes2["RedMushroomBlock"]="minecraft:red_mushroom_block";MinecraftItemTypes2["RedNetherBrick"]="minecraft:red_nether_brick";MinecraftItemTypes2["RedNetherBrickSlab"]="minecraft:red_nether_brick_slab";MinecraftItemTypes2["RedNetherBrickStairs"]="minecraft:red_nether_brick_stairs";MinecraftItemTypes2["RedNetherBrickWall"]="minecraft:red_nether_brick_wall";MinecraftItemTypes2["RedSand"]="minecraft:red_sand";MinecraftItemTypes2["RedSandstone"]="minecraft:red_sandstone";MinecraftItemTypes2["RedSandstoneSlab"]="minecraft:red_sandstone_slab";MinecraftItemTypes2["RedSandstoneStairs"]="minecraft:red_sandstone_stairs";MinecraftItemTypes2["RedSandstoneWall"]="minecraft:red_sandstone_wall";MinecraftItemTypes2["RedShulkerBox"]="minecraft:red_shulker_box";MinecraftItemTypes2["RedStainedGlass"]="minecraft:red_stained_glass";MinecraftItemTypes2["RedStainedGlassPane"]="minecraft:red_stained_glass_pane";MinecraftItemTypes2["RedTerracotta"]="minecraft:red_terracotta";MinecraftItemTypes2["RedTulip"]="minecraft:red_tulip";MinecraftItemTypes2["RedWool"]="minecraft:red_wool";MinecraftItemTypes2["Redstone"]="minecraft:redstone";MinecraftItemTypes2["RedstoneBlock"]="minecraft:redstone_block";MinecraftItemTypes2["RedstoneLamp"]="minecraft:redstone_lamp";MinecraftItemTypes2["RedstoneOre"]="minecraft:redstone_ore";MinecraftItemTypes2["RedstoneTorch"]="minecraft:redstone_torch";MinecraftItemTypes2["ReinforcedDeepslate"]="minecraft:reinforced_deepslate";MinecraftItemTypes2["Repeater"]="minecraft:repeater";MinecraftItemTypes2["RepeatingCommandBlock"]="minecraft:repeating_command_block";MinecraftItemTypes2["RespawnAnchor"]="minecraft:respawn_anchor";MinecraftItemTypes2["RibArmorTrimSmithingTemplate"]="minecraft:rib_armor_trim_smithing_template";MinecraftItemTypes2["RoseBush"]="minecraft:rose_bush";MinecraftItemTypes2["RottenFlesh"]="minecraft:rotten_flesh";MinecraftItemTypes2["Saddle"]="minecraft:saddle";MinecraftItemTypes2["Salmon"]="minecraft:salmon";MinecraftItemTypes2["SalmonBucket"]="minecraft:salmon_bucket";MinecraftItemTypes2["SalmonSpawnEgg"]="minecraft:salmon_spawn_egg";MinecraftItemTypes2["Sand"]="minecraft:sand";MinecraftItemTypes2["Sandstone"]="minecraft:sandstone";MinecraftItemTypes2["SandstoneSlab"]="minecraft:sandstone_slab";MinecraftItemTypes2["SandstoneStairs"]="minecraft:sandstone_stairs";MinecraftItemTypes2["SandstoneWall"]="minecraft:sandstone_wall";MinecraftItemTypes2["Scaffolding"]="minecraft:scaffolding";MinecraftItemTypes2["ScrapePotterySherd"]="minecraft:scrape_pottery_sherd";MinecraftItemTypes2["Sculk"]="minecraft:sculk";MinecraftItemTypes2["SculkCatalyst"]="minecraft:sculk_catalyst";MinecraftItemTypes2["SculkSensor"]="minecraft:sculk_sensor";MinecraftItemTypes2["SculkShrieker"]="minecraft:sculk_shrieker";MinecraftItemTypes2["SculkVein"]="minecraft:sculk_vein";MinecraftItemTypes2["SeaLantern"]="minecraft:sea_lantern";MinecraftItemTypes2["SeaPickle"]="minecraft:sea_pickle";MinecraftItemTypes2["Seagrass"]="minecraft:seagrass";MinecraftItemTypes2["SentryArmorTrimSmithingTemplate"]="minecraft:sentry_armor_trim_smithing_template";MinecraftItemTypes2["ShaperArmorTrimSmithingTemplate"]="minecraft:shaper_armor_trim_smithing_template";MinecraftItemTypes2["SheafPotterySherd"]="minecraft:sheaf_pottery_sherd";MinecraftItemTypes2["Shears"]="minecraft:shears";MinecraftItemTypes2["SheepSpawnEgg"]="minecraft:sheep_spawn_egg";MinecraftItemTypes2["ShelterPotterySherd"]="minecraft:shelter_pottery_sherd";MinecraftItemTypes2["Shield"]="minecraft:shield";MinecraftItemTypes2["ShortGrass"]="minecraft:short_grass";MinecraftItemTypes2["Shroomlight"]="minecraft:shroomlight";MinecraftItemTypes2["ShulkerShell"]="minecraft:shulker_shell";MinecraftItemTypes2["ShulkerSpawnEgg"]="minecraft:shulker_spawn_egg";MinecraftItemTypes2["SilenceArmorTrimSmithingTemplate"]="minecraft:silence_armor_trim_smithing_template";MinecraftItemTypes2["SilverGlazedTerracotta"]="minecraft:silver_glazed_terracotta";MinecraftItemTypes2["SilverfishSpawnEgg"]="minecraft:silverfish_spawn_egg";MinecraftItemTypes2["SkeletonHorseSpawnEgg"]="minecraft:skeleton_horse_spawn_egg";MinecraftItemTypes2["SkeletonSpawnEgg"]="minecraft:skeleton_spawn_egg";MinecraftItemTypes2["Skull"]="minecraft:skull";MinecraftItemTypes2["SkullBannerPattern"]="minecraft:skull_banner_pattern";MinecraftItemTypes2["SkullPotterySherd"]="minecraft:skull_pottery_sherd";MinecraftItemTypes2["Slime"]="minecraft:slime";MinecraftItemTypes2["SlimeBall"]="minecraft:slime_ball";MinecraftItemTypes2["SlimeSpawnEgg"]="minecraft:slime_spawn_egg";MinecraftItemTypes2["SmallAmethystBud"]="minecraft:small_amethyst_bud";MinecraftItemTypes2["SmallDripleafBlock"]="minecraft:small_dripleaf_block";MinecraftItemTypes2["SmithingTable"]="minecraft:smithing_table";MinecraftItemTypes2["Smoker"]="minecraft:smoker";MinecraftItemTypes2["SmoothBasalt"]="minecraft:smooth_basalt";MinecraftItemTypes2["SmoothQuartz"]="minecraft:smooth_quartz";MinecraftItemTypes2["SmoothQuartzSlab"]="minecraft:smooth_quartz_slab";MinecraftItemTypes2["SmoothQuartzStairs"]="minecraft:smooth_quartz_stairs";MinecraftItemTypes2["SmoothRedSandstone"]="minecraft:smooth_red_sandstone";MinecraftItemTypes2["SmoothRedSandstoneSlab"]="minecraft:smooth_red_sandstone_slab";MinecraftItemTypes2["SmoothRedSandstoneStairs"]="minecraft:smooth_red_sandstone_stairs";MinecraftItemTypes2["SmoothSandstone"]="minecraft:smooth_sandstone";MinecraftItemTypes2["SmoothSandstoneSlab"]="minecraft:smooth_sandstone_slab";MinecraftItemTypes2["SmoothSandstoneStairs"]="minecraft:smooth_sandstone_stairs";MinecraftItemTypes2["SmoothStone"]="minecraft:smooth_stone";MinecraftItemTypes2["SmoothStoneSlab"]="minecraft:smooth_stone_slab";MinecraftItemTypes2["SnifferEgg"]="minecraft:sniffer_egg";MinecraftItemTypes2["SnifferSpawnEgg"]="minecraft:sniffer_spawn_egg";MinecraftItemTypes2["SnortPotterySherd"]="minecraft:snort_pottery_sherd";MinecraftItemTypes2["SnoutArmorTrimSmithingTemplate"]="minecraft:snout_armor_trim_smithing_template";MinecraftItemTypes2["Snow"]="minecraft:snow";MinecraftItemTypes2["SnowGolemSpawnEgg"]="minecraft:snow_golem_spawn_egg";MinecraftItemTypes2["SnowLayer"]="minecraft:snow_layer";MinecraftItemTypes2["Snowball"]="minecraft:snowball";MinecraftItemTypes2["SoulCampfire"]="minecraft:soul_campfire";MinecraftItemTypes2["SoulLantern"]="minecraft:soul_lantern";MinecraftItemTypes2["SoulSand"]="minecraft:soul_sand";MinecraftItemTypes2["SoulSoil"]="minecraft:soul_soil";MinecraftItemTypes2["SoulTorch"]="minecraft:soul_torch";MinecraftItemTypes2["SpiderEye"]="minecraft:spider_eye";MinecraftItemTypes2["SpiderSpawnEgg"]="minecraft:spider_spawn_egg";MinecraftItemTypes2["SpireArmorTrimSmithingTemplate"]="minecraft:spire_armor_trim_smithing_template";MinecraftItemTypes2["SplashPotion"]="minecraft:splash_potion";MinecraftItemTypes2["Sponge"]="minecraft:sponge";MinecraftItemTypes2["SporeBlossom"]="minecraft:spore_blossom";MinecraftItemTypes2["SpruceBoat"]="minecraft:spruce_boat";MinecraftItemTypes2["SpruceButton"]="minecraft:spruce_button";MinecraftItemTypes2["SpruceChestBoat"]="minecraft:spruce_chest_boat";MinecraftItemTypes2["SpruceDoor"]="minecraft:spruce_door";MinecraftItemTypes2["SpruceFence"]="minecraft:spruce_fence";MinecraftItemTypes2["SpruceFenceGate"]="minecraft:spruce_fence_gate";MinecraftItemTypes2["SpruceHangingSign"]="minecraft:spruce_hanging_sign";MinecraftItemTypes2["SpruceLeaves"]="minecraft:spruce_leaves";MinecraftItemTypes2["SpruceLog"]="minecraft:spruce_log";MinecraftItemTypes2["SprucePlanks"]="minecraft:spruce_planks";MinecraftItemTypes2["SprucePressurePlate"]="minecraft:spruce_pressure_plate";MinecraftItemTypes2["SpruceSapling"]="minecraft:spruce_sapling";MinecraftItemTypes2["SpruceSign"]="minecraft:spruce_sign";MinecraftItemTypes2["SpruceSlab"]="minecraft:spruce_slab";MinecraftItemTypes2["SpruceStairs"]="minecraft:spruce_stairs";MinecraftItemTypes2["SpruceTrapdoor"]="minecraft:spruce_trapdoor";MinecraftItemTypes2["SpruceWood"]="minecraft:spruce_wood";MinecraftItemTypes2["Spyglass"]="minecraft:spyglass";MinecraftItemTypes2["SquidSpawnEgg"]="minecraft:squid_spawn_egg";MinecraftItemTypes2["Stick"]="minecraft:stick";MinecraftItemTypes2["StickyPiston"]="minecraft:sticky_piston";MinecraftItemTypes2["Stone"]="minecraft:stone";MinecraftItemTypes2["StoneAxe"]="minecraft:stone_axe";MinecraftItemTypes2["StoneBrickSlab"]="minecraft:stone_brick_slab";MinecraftItemTypes2["StoneBrickStairs"]="minecraft:stone_brick_stairs";MinecraftItemTypes2["StoneBrickWall"]="minecraft:stone_brick_wall";MinecraftItemTypes2["StoneBricks"]="minecraft:stone_bricks";MinecraftItemTypes2["StoneButton"]="minecraft:stone_button";MinecraftItemTypes2["StoneHoe"]="minecraft:stone_hoe";MinecraftItemTypes2["StonePickaxe"]="minecraft:stone_pickaxe";MinecraftItemTypes2["StonePressurePlate"]="minecraft:stone_pressure_plate";MinecraftItemTypes2["StoneShovel"]="minecraft:stone_shovel";MinecraftItemTypes2["StoneStairs"]="minecraft:stone_stairs";MinecraftItemTypes2["StoneSword"]="minecraft:stone_sword";MinecraftItemTypes2["StonecutterBlock"]="minecraft:stonecutter_block";MinecraftItemTypes2["StraySpawnEgg"]="minecraft:stray_spawn_egg";MinecraftItemTypes2["StriderSpawnEgg"]="minecraft:strider_spawn_egg";MinecraftItemTypes2["String"]="minecraft:string";MinecraftItemTypes2["StrippedAcaciaLog"]="minecraft:stripped_acacia_log";MinecraftItemTypes2["StrippedAcaciaWood"]="minecraft:stripped_acacia_wood";MinecraftItemTypes2["StrippedBambooBlock"]="minecraft:stripped_bamboo_block";MinecraftItemTypes2["StrippedBirchLog"]="minecraft:stripped_birch_log";MinecraftItemTypes2["StrippedBirchWood"]="minecraft:stripped_birch_wood";MinecraftItemTypes2["StrippedCherryLog"]="minecraft:stripped_cherry_log";MinecraftItemTypes2["StrippedCherryWood"]="minecraft:stripped_cherry_wood";MinecraftItemTypes2["StrippedCrimsonHyphae"]="minecraft:stripped_crimson_hyphae";MinecraftItemTypes2["StrippedCrimsonStem"]="minecraft:stripped_crimson_stem";MinecraftItemTypes2["StrippedDarkOakLog"]="minecraft:stripped_dark_oak_log";MinecraftItemTypes2["StrippedDarkOakWood"]="minecraft:stripped_dark_oak_wood";MinecraftItemTypes2["StrippedJungleLog"]="minecraft:stripped_jungle_log";MinecraftItemTypes2["StrippedJungleWood"]="minecraft:stripped_jungle_wood";MinecraftItemTypes2["StrippedMangroveLog"]="minecraft:stripped_mangrove_log";MinecraftItemTypes2["StrippedMangroveWood"]="minecraft:stripped_mangrove_wood";MinecraftItemTypes2["StrippedOakLog"]="minecraft:stripped_oak_log";MinecraftItemTypes2["StrippedOakWood"]="minecraft:stripped_oak_wood";MinecraftItemTypes2["StrippedSpruceLog"]="minecraft:stripped_spruce_log";MinecraftItemTypes2["StrippedSpruceWood"]="minecraft:stripped_spruce_wood";MinecraftItemTypes2["StrippedWarpedHyphae"]="minecraft:stripped_warped_hyphae";MinecraftItemTypes2["StrippedWarpedStem"]="minecraft:stripped_warped_stem";MinecraftItemTypes2["StructureBlock"]="minecraft:structure_block";MinecraftItemTypes2["StructureVoid"]="minecraft:structure_void";MinecraftItemTypes2["Sugar"]="minecraft:sugar";MinecraftItemTypes2["SugarCane"]="minecraft:sugar_cane";MinecraftItemTypes2["Sunflower"]="minecraft:sunflower";MinecraftItemTypes2["SuspiciousGravel"]="minecraft:suspicious_gravel";MinecraftItemTypes2["SuspiciousSand"]="minecraft:suspicious_sand";MinecraftItemTypes2["SuspiciousStew"]="minecraft:suspicious_stew";MinecraftItemTypes2["SweetBerries"]="minecraft:sweet_berries";MinecraftItemTypes2["TadpoleBucket"]="minecraft:tadpole_bucket";MinecraftItemTypes2["TadpoleSpawnEgg"]="minecraft:tadpole_spawn_egg";MinecraftItemTypes2["TallGrass"]="minecraft:tall_grass";MinecraftItemTypes2["Target"]="minecraft:target";MinecraftItemTypes2["TideArmorTrimSmithingTemplate"]="minecraft:tide_armor_trim_smithing_template";MinecraftItemTypes2["TintedGlass"]="minecraft:tinted_glass";MinecraftItemTypes2["Tnt"]="minecraft:tnt";MinecraftItemTypes2["TntMinecart"]="minecraft:tnt_minecart";MinecraftItemTypes2["Torch"]="minecraft:torch";MinecraftItemTypes2["Torchflower"]="minecraft:torchflower";MinecraftItemTypes2["TorchflowerSeeds"]="minecraft:torchflower_seeds";MinecraftItemTypes2["TotemOfUndying"]="minecraft:totem_of_undying";MinecraftItemTypes2["TraderLlamaSpawnEgg"]="minecraft:trader_llama_spawn_egg";MinecraftItemTypes2["Trapdoor"]="minecraft:trapdoor";MinecraftItemTypes2["TrappedChest"]="minecraft:trapped_chest";MinecraftItemTypes2["TrialKey"]="minecraft:trial_key";MinecraftItemTypes2["TrialSpawner"]="minecraft:trial_spawner";MinecraftItemTypes2["Trident"]="minecraft:trident";MinecraftItemTypes2["TripwireHook"]="minecraft:tripwire_hook";MinecraftItemTypes2["TropicalFish"]="minecraft:tropical_fish";MinecraftItemTypes2["TropicalFishBucket"]="minecraft:tropical_fish_bucket";MinecraftItemTypes2["TropicalFishSpawnEgg"]="minecraft:tropical_fish_spawn_egg";MinecraftItemTypes2["TubeCoral"]="minecraft:tube_coral";MinecraftItemTypes2["TubeCoralBlock"]="minecraft:tube_coral_block";MinecraftItemTypes2["TubeCoralFan"]="minecraft:tube_coral_fan";MinecraftItemTypes2["Tuff"]="minecraft:tuff";MinecraftItemTypes2["TuffBrickSlab"]="minecraft:tuff_brick_slab";MinecraftItemTypes2["TuffBrickStairs"]="minecraft:tuff_brick_stairs";MinecraftItemTypes2["TuffBrickWall"]="minecraft:tuff_brick_wall";MinecraftItemTypes2["TuffBricks"]="minecraft:tuff_bricks";MinecraftItemTypes2["TuffSlab"]="minecraft:tuff_slab";MinecraftItemTypes2["TuffStairs"]="minecraft:tuff_stairs";MinecraftItemTypes2["TuffWall"]="minecraft:tuff_wall";MinecraftItemTypes2["TurtleEgg"]="minecraft:turtle_egg";MinecraftItemTypes2["TurtleHelmet"]="minecraft:turtle_helmet";MinecraftItemTypes2["TurtleScute"]="minecraft:turtle_scute";MinecraftItemTypes2["TurtleSpawnEgg"]="minecraft:turtle_spawn_egg";MinecraftItemTypes2["TwistingVines"]="minecraft:twisting_vines";MinecraftItemTypes2["UndyedShulkerBox"]="minecraft:undyed_shulker_box";MinecraftItemTypes2["Vault"]="minecraft:vault";MinecraftItemTypes2["VerdantFroglight"]="minecraft:verdant_froglight";MinecraftItemTypes2["VexArmorTrimSmithingTemplate"]="minecraft:vex_armor_trim_smithing_template";MinecraftItemTypes2["VexSpawnEgg"]="minecraft:vex_spawn_egg";MinecraftItemTypes2["VillagerSpawnEgg"]="minecraft:villager_spawn_egg";MinecraftItemTypes2["VindicatorSpawnEgg"]="minecraft:vindicator_spawn_egg";MinecraftItemTypes2["Vine"]="minecraft:vine";MinecraftItemTypes2["WanderingTraderSpawnEgg"]="minecraft:wandering_trader_spawn_egg";MinecraftItemTypes2["WardArmorTrimSmithingTemplate"]="minecraft:ward_armor_trim_smithing_template";MinecraftItemTypes2["WardenSpawnEgg"]="minecraft:warden_spawn_egg";MinecraftItemTypes2["WarpedButton"]="minecraft:warped_button";MinecraftItemTypes2["WarpedDoor"]="minecraft:warped_door";MinecraftItemTypes2["WarpedFence"]="minecraft:warped_fence";MinecraftItemTypes2["WarpedFenceGate"]="minecraft:warped_fence_gate";MinecraftItemTypes2["WarpedFungus"]="minecraft:warped_fungus";MinecraftItemTypes2["WarpedFungusOnAStick"]="minecraft:warped_fungus_on_a_stick";MinecraftItemTypes2["WarpedHangingSign"]="minecraft:warped_hanging_sign";MinecraftItemTypes2["WarpedHyphae"]="minecraft:warped_hyphae";MinecraftItemTypes2["WarpedNylium"]="minecraft:warped_nylium";MinecraftItemTypes2["WarpedPlanks"]="minecraft:warped_planks";MinecraftItemTypes2["WarpedPressurePlate"]="minecraft:warped_pressure_plate";MinecraftItemTypes2["WarpedRoots"]="minecraft:warped_roots";MinecraftItemTypes2["WarpedSign"]="minecraft:warped_sign";MinecraftItemTypes2["WarpedSlab"]="minecraft:warped_slab";MinecraftItemTypes2["WarpedStairs"]="minecraft:warped_stairs";MinecraftItemTypes2["WarpedStem"]="minecraft:warped_stem";MinecraftItemTypes2["WarpedTrapdoor"]="minecraft:warped_trapdoor";MinecraftItemTypes2["WarpedWartBlock"]="minecraft:warped_wart_block";MinecraftItemTypes2["WaterBucket"]="minecraft:water_bucket";MinecraftItemTypes2["Waterlily"]="minecraft:waterlily";MinecraftItemTypes2["WaxedChiseledCopper"]="minecraft:waxed_chiseled_copper";MinecraftItemTypes2["WaxedCopper"]="minecraft:waxed_copper";MinecraftItemTypes2["WaxedCopperBulb"]="minecraft:waxed_copper_bulb";MinecraftItemTypes2["WaxedCopperDoor"]="minecraft:waxed_copper_door";MinecraftItemTypes2["WaxedCopperGrate"]="minecraft:waxed_copper_grate";MinecraftItemTypes2["WaxedCopperTrapdoor"]="minecraft:waxed_copper_trapdoor";MinecraftItemTypes2["WaxedCutCopper"]="minecraft:waxed_cut_copper";MinecraftItemTypes2["WaxedCutCopperSlab"]="minecraft:waxed_cut_copper_slab";MinecraftItemTypes2["WaxedCutCopperStairs"]="minecraft:waxed_cut_copper_stairs";MinecraftItemTypes2["WaxedExposedChiseledCopper"]="minecraft:waxed_exposed_chiseled_copper";MinecraftItemTypes2["WaxedExposedCopper"]="minecraft:waxed_exposed_copper";MinecraftItemTypes2["WaxedExposedCopperBulb"]="minecraft:waxed_exposed_copper_bulb";MinecraftItemTypes2["WaxedExposedCopperDoor"]="minecraft:waxed_exposed_copper_door";MinecraftItemTypes2["WaxedExposedCopperGrate"]="minecraft:waxed_exposed_copper_grate";MinecraftItemTypes2["WaxedExposedCopperTrapdoor"]="minecraft:waxed_exposed_copper_trapdoor";MinecraftItemTypes2["WaxedExposedCutCopper"]="minecraft:waxed_exposed_cut_copper";MinecraftItemTypes2["WaxedExposedCutCopperSlab"]="minecraft:waxed_exposed_cut_copper_slab";MinecraftItemTypes2["WaxedExposedCutCopperStairs"]="minecraft:waxed_exposed_cut_copper_stairs";MinecraftItemTypes2["WaxedOxidizedChiseledCopper"]="minecraft:waxed_oxidized_chiseled_copper";MinecraftItemTypes2["WaxedOxidizedCopper"]="minecraft:waxed_oxidized_copper";MinecraftItemTypes2["WaxedOxidizedCopperBulb"]="minecraft:waxed_oxidized_copper_bulb";MinecraftItemTypes2["WaxedOxidizedCopperDoor"]="minecraft:waxed_oxidized_copper_door";MinecraftItemTypes2["WaxedOxidizedCopperGrate"]="minecraft:waxed_oxidized_copper_grate";MinecraftItemTypes2["WaxedOxidizedCopperTrapdoor"]="minecraft:waxed_oxidized_copper_trapdoor";MinecraftItemTypes2["WaxedOxidizedCutCopper"]="minecraft:waxed_oxidized_cut_copper";MinecraftItemTypes2["WaxedOxidizedCutCopperSlab"]="minecraft:waxed_oxidized_cut_copper_slab";MinecraftItemTypes2["WaxedOxidizedCutCopperStairs"]="minecraft:waxed_oxidized_cut_copper_stairs";MinecraftItemTypes2["WaxedWeatheredChiseledCopper"]="minecraft:waxed_weathered_chiseled_copper";MinecraftItemTypes2["WaxedWeatheredCopper"]="minecraft:waxed_weathered_copper";MinecraftItemTypes2["WaxedWeatheredCopperBulb"]="minecraft:waxed_weathered_copper_bulb";MinecraftItemTypes2["WaxedWeatheredCopperDoor"]="minecraft:waxed_weathered_copper_door";MinecraftItemTypes2["WaxedWeatheredCopperGrate"]="minecraft:waxed_weathered_copper_grate";MinecraftItemTypes2["WaxedWeatheredCopperTrapdoor"]="minecraft:waxed_weathered_copper_trapdoor";MinecraftItemTypes2["WaxedWeatheredCutCopper"]="minecraft:waxed_weathered_cut_copper";MinecraftItemTypes2["WaxedWeatheredCutCopperSlab"]="minecraft:waxed_weathered_cut_copper_slab";MinecraftItemTypes2["WaxedWeatheredCutCopperStairs"]="minecraft:waxed_weathered_cut_copper_stairs";MinecraftItemTypes2["WayfinderArmorTrimSmithingTemplate"]="minecraft:wayfinder_armor_trim_smithing_template";MinecraftItemTypes2["WeatheredChiseledCopper"]="minecraft:weathered_chiseled_copper";MinecraftItemTypes2["WeatheredCopper"]="minecraft:weathered_copper";MinecraftItemTypes2["WeatheredCopperBulb"]="minecraft:weathered_copper_bulb";MinecraftItemTypes2["WeatheredCopperDoor"]="minecraft:weathered_copper_door";MinecraftItemTypes2["WeatheredCopperGrate"]="minecraft:weathered_copper_grate";MinecraftItemTypes2["WeatheredCopperTrapdoor"]="minecraft:weathered_copper_trapdoor";MinecraftItemTypes2["WeatheredCutCopper"]="minecraft:weathered_cut_copper";MinecraftItemTypes2["WeatheredCutCopperSlab"]="minecraft:weathered_cut_copper_slab";MinecraftItemTypes2["WeatheredCutCopperStairs"]="minecraft:weathered_cut_copper_stairs";MinecraftItemTypes2["Web"]="minecraft:web";MinecraftItemTypes2["WeepingVines"]="minecraft:weeping_vines";MinecraftItemTypes2["WetSponge"]="minecraft:wet_sponge";MinecraftItemTypes2["Wheat"]="minecraft:wheat";MinecraftItemTypes2["WheatSeeds"]="minecraft:wheat_seeds";MinecraftItemTypes2["WhiteCandle"]="minecraft:white_candle";MinecraftItemTypes2["WhiteCarpet"]="minecraft:white_carpet";MinecraftItemTypes2["WhiteConcrete"]="minecraft:white_concrete";MinecraftItemTypes2["WhiteConcretePowder"]="minecraft:white_concrete_powder";MinecraftItemTypes2["WhiteDye"]="minecraft:white_dye";MinecraftItemTypes2["WhiteGlazedTerracotta"]="minecraft:white_glazed_terracotta";MinecraftItemTypes2["WhiteShulkerBox"]="minecraft:white_shulker_box";MinecraftItemTypes2["WhiteStainedGlass"]="minecraft:white_stained_glass";MinecraftItemTypes2["WhiteStainedGlassPane"]="minecraft:white_stained_glass_pane";MinecraftItemTypes2["WhiteTerracotta"]="minecraft:white_terracotta";MinecraftItemTypes2["WhiteTulip"]="minecraft:white_tulip";MinecraftItemTypes2["WhiteWool"]="minecraft:white_wool";MinecraftItemTypes2["WildArmorTrimSmithingTemplate"]="minecraft:wild_armor_trim_smithing_template";MinecraftItemTypes2["WindCharge"]="minecraft:wind_charge";MinecraftItemTypes2["WitchSpawnEgg"]="minecraft:witch_spawn_egg";MinecraftItemTypes2["WitherRose"]="minecraft:wither_rose";MinecraftItemTypes2["WitherSkeletonSpawnEgg"]="minecraft:wither_skeleton_spawn_egg";MinecraftItemTypes2["WitherSpawnEgg"]="minecraft:wither_spawn_egg";MinecraftItemTypes2["WolfArmor"]="minecraft:wolf_armor";MinecraftItemTypes2["WolfSpawnEgg"]="minecraft:wolf_spawn_egg";MinecraftItemTypes2["WoodenAxe"]="minecraft:wooden_axe";MinecraftItemTypes2["WoodenButton"]="minecraft:wooden_button";MinecraftItemTypes2["WoodenDoor"]="minecraft:wooden_door";MinecraftItemTypes2["WoodenHoe"]="minecraft:wooden_hoe";MinecraftItemTypes2["WoodenPickaxe"]="minecraft:wooden_pickaxe";MinecraftItemTypes2["WoodenPressurePlate"]="minecraft:wooden_pressure_plate";MinecraftItemTypes2["WoodenShovel"]="minecraft:wooden_shovel";MinecraftItemTypes2["WoodenSword"]="minecraft:wooden_sword";MinecraftItemTypes2["WritableBook"]="minecraft:writable_book";MinecraftItemTypes2["YellowCandle"]="minecraft:yellow_candle";MinecraftItemTypes2["YellowCarpet"]="minecraft:yellow_carpet";MinecraftItemTypes2["YellowConcrete"]="minecraft:yellow_concrete";MinecraftItemTypes2["YellowConcretePowder"]="minecraft:yellow_concrete_powder";MinecraftItemTypes2["YellowDye"]="minecraft:yellow_dye";MinecraftItemTypes2["YellowGlazedTerracotta"]="minecraft:yellow_glazed_terracotta";MinecraftItemTypes2["YellowShulkerBox"]="minecraft:yellow_shulker_box";MinecraftItemTypes2["YellowStainedGlass"]="minecraft:yellow_stained_glass";MinecraftItemTypes2["YellowStainedGlassPane"]="minecraft:yellow_stained_glass_pane";MinecraftItemTypes2["YellowTerracotta"]="minecraft:yellow_terracotta";MinecraftItemTypes2["YellowWool"]="minecraft:yellow_wool";MinecraftItemTypes2["ZoglinSpawnEgg"]="minecraft:zoglin_spawn_egg";MinecraftItemTypes2["ZombieHorseSpawnEgg"]="minecraft:zombie_horse_spawn_egg";MinecraftItemTypes2["ZombiePigmanSpawnEgg"]="minecraft:zombie_pigman_spawn_egg";MinecraftItemTypes2["ZombieSpawnEgg"]="minecraft:zombie_spawn_egg";MinecraftItemTypes2["ZombieVillagerSpawnEgg"]="minecraft:zombie_villager_spawn_egg";return MinecraftItemTypes2})(MinecraftItemTypes||{});var MinecraftPotionEffectTypes=(MinecraftPotionEffectTypes2=>{MinecraftPotionEffectTypes2["FireResistance"]="FireResistance";MinecraftPotionEffectTypes2["Harming"]="Harming";MinecraftPotionEffectTypes2["Healing"]="Healing";MinecraftPotionEffectTypes2["Infested"]="Infested";MinecraftPotionEffectTypes2["Invisibility"]="Invisibility";MinecraftPotionEffectTypes2["Leaping"]="Leaping";MinecraftPotionEffectTypes2["NightVision"]="NightVision";MinecraftPotionEffectTypes2["None"]="None";MinecraftPotionEffectTypes2["Oozing"]="Oozing";MinecraftPotionEffectTypes2["Poison"]="Poison";MinecraftPotionEffectTypes2["SlowFalling"]="SlowFalling";MinecraftPotionEffectTypes2["Slowing"]="Slowing";MinecraftPotionEffectTypes2["Strength"]="Strength";MinecraftPotionEffectTypes2["Swiftness"]="Swiftness";MinecraftPotionEffectTypes2["TurtleMaster"]="TurtleMaster";MinecraftPotionEffectTypes2["WaterBreath"]="WaterBreath";MinecraftPotionEffectTypes2["Weakness"]="Weakness";MinecraftPotionEffectTypes2["Weaving"]="Weaving";MinecraftPotionEffectTypes2["WindCharged"]="WindCharged";MinecraftPotionEffectTypes2["Wither"]="Wither";return MinecraftPotionEffectTypes2})(MinecraftPotionEffectTypes||{});var MinecraftPotionLiquidTypes=(MinecraftPotionLiquidTypes2=>{MinecraftPotionLiquidTypes2["Lingering"]="Lingering";MinecraftPotionLiquidTypes2["Regular"]="Regular";MinecraftPotionLiquidTypes2["Splash"]="Splash";return MinecraftPotionLiquidTypes2})(MinecraftPotionLiquidTypes||{});var MinecraftPotionModifierTypes=(MinecraftPotionModifierTypes2=>{MinecraftPotionModifierTypes2["Long"]="Long";MinecraftPotionModifierTypes2["Normal"]="Normal";MinecraftPotionModifierTypes2["Strong"]="Strong";return MinecraftPotionModifierTypes2})(MinecraftPotionModifierTypes||{});

const FISH_MAPPINGS = {
    [MinecraftItemTypes.Cod]: MinecraftItemTypes.CookedCod,
    [MinecraftItemTypes.Salmon]: MinecraftItemTypes.CookedSalmon,
};
const fishing_hot_rod_ability = {
    key: "hot_rod",
    unlock_level: 5,
    enableTitle: false,
    description: function (level) {
        return [`${getChance$5(level) * 100}%%`];
    },
};
function handleHotRod(loot, abilityLevel) {
    for (const item of loot) {
        if (getChance$5(abilityLevel) < rand())
            continue;
        const cookedForm = FISH_MAPPINGS[item.item.typeId];
        if (cookedForm && item.entity.isValid()) {
            const newEntity = item.entity.dimension.spawnItem(new ItemStack(cookedForm, item.item.amount), item.entity.location);
            newEntity.clearVelocity();
            newEntity.applyImpulse(item.entity.getVelocity());
            item.entity.remove();
            //TODO: VISUAL & SOUND EFFECT
            spawnParticle(newEntity.dimension, newEntity.location, "minecraft:basic_smoke_particle");
            newEntity.dimension.playSound("random.fizz", newEntity.location, {
                pitch: rand(1.2, 1.4),
            });
        }
    }
}
function getChance$5(level) {
    return 0.25 + level * 0.15;
}

function getItemInSlot(player, slot) {
    const component = player.getComponent(EntityEquippableComponent.componentId);
    return component?.getEquipment(slot);
}
function isHolding(player, item) {
    return getItemInSlot(player, EquipmentSlot.Mainhand)?.typeId === item;
}
function hasItem(player, typeId, amount) {
    const container = player.getComponent(EntityInventoryComponent.componentId)?.container;
    if (!container || container.emptySlotsCount === container.size)
        return false;
    let found = 0;
    for (let i = 0; i < container.size; i++) {
        const item = container.getItem(i);
        if (!item || !item.typeId || !item.amount)
            continue;
        if (item.typeId === typeId) {
            if (item.amount + found >= amount)
                return true;
            found += item.amount;
        }
    }
    return false;
}
function getInventoryContentsWithSlot(player) {
    const container = player.getComponent(EntityInventoryComponent.componentId)?.container;
    if (!container || container.emptySlotsCount === container.size)
        return [];
    const contents = [];
    for (let i = 0; i < container.size; i++) {
        const item = container.getItem(i);
        if (!item)
            continue;
        contents.push({ slotId: i, item });
    }
    return contents;
}
function modifyItemInContainer(container, slot, item) {
    if (container.getItem(slot)?.typeId === item.typeId) {
        container.setItem(slot, item);
    }
}

const sorcery_arcane_shield_ability = {
    key: "arcane_shield",
    unlock_level: 5,
    enableTitle: true,
    description: (level) => {
        return [`${getDuration$i(level)}`];
    },
    cooldown: (level) => getCooldown$o(level),
    onEnable: (data) => {
        const { player, skill, level } = data;
        let i = 0;
        const runId = system.runInterval(async () => {
            if (i % 3 === 0) {
                spawnParticle(player.dimension, player.location, "pod_rpg:arcaneshield");
                displayActionBar(player, {
                    rawtext: [
                        { text: "§p" },
                        ...getAbilityName(sorcery_arcane_shield_ability),
                        {
                            text: ` ${(getDuration$i(level) - i / 20).toFixed(1)}s`,
                        },
                    ],
                }, 2);
                const query = player.dimension.getEntities({
                    location: player.location,
                    maxDistance: 4,
                    families: ["monster"],
                });
                if (query.length > 1)
                    player.dimension.playSound("wind_charge.burst", player.location);
                for (const entity of query) {
                    entity.applyKnockback(entity.location.x - player.location.x, entity.location.z - player.location.z, 2, 0.75);
                }
            }
            if (i === getDuration$i(level) * 20 - 1) {
                displayActionBar(player, "§r", 2);
                system.clearRun(runId);
            }
            i++;
        });
        ABILITY_TIMERS.setPlayer(player, getCooldown$o(level) * 20, skill);
    },
};
const getDuration$i = (level) => {
    let value = 10;
    if (level >= 2)
        value += 5;
    if (level >= 4)
        value += 5;
    return value;
};
const getCooldown$o = (level) => {
    let cooldown = 60;
    if (level >= 1)
        cooldown -= 10;
    if (level >= 3)
        cooldown -= 10;
    if (level >= 5)
        cooldown -= 10;
    return cooldown;
};

/**
 * Checks if an entity has the health component, and if so if it is alive
 * @param entity the entity to be checked
 * @returns whether the entity is alive or not
 */
function isAlive(entity) {
    if (!entity.hasComponent(EntityHealthComponent.componentId) ||
        entity.getComponent(EntityHealthComponent.componentId).currentValue <= 0)
        return false;
    return true;
}

const getCooldown$n = (level) => {
    let value = 90;
    if (level >= 1)
        value -= 15;
    if (level >= 5)
        value -= 15;
    return value;
};
const echoingPowerTimer = new TimerUtil();
const sorcery_echoing_power_ability = {
    key: "echoing_power",
    unlock_level: 15,
    enableTitle: true,
    description: function (level) {
        return [`${getDamageMultiplier(level) * 100}%%`, `${getDuration$h(level)}`];
    },
    cooldown: getCooldown$n,
    onEnable(event) {
        echoingPowerTimer.set(event.player.name, getDuration$h(event.level) * 20);
        echoingPowerTimer.enableDisplay(event.player, () => {
            return {
                rawtext: [
                    { text: "§p" },
                    ...getAbilityName(sorcery_echoing_power_ability),
                    {
                        text: ` ${((echoingPowerTimer.get(event.player.name) - system.currentTick) /
                            20).toFixed(1)}s`,
                    },
                ],
            };
        });
        ABILITY_TIMERS.setPlayer(event.player, getCooldown$n(event.level) * 20, event.skill);
    },
};
world.afterEvents.entityHurt.subscribe((event) => {
    if (event.damageSource.damagingEntity?.typeId !== "minecraft:player" ||
        event.damageSource.cause === EntityDamageCause.magic)
        return;
    if (!echoingPowerTimer.has(event.damageSource.damagingEntity.name))
        return;
    const weapon = getItemInSlot(event.damageSource.damagingEntity, EquipmentSlot.Mainhand);
    if (!weapon)
        return;
    const enchantmentCount = weapon.getComponent(ItemEnchantableComponent.componentId)?.getEnchantments().length || 0;
    if (enchantmentCount === 0)
        return;
    const level = getAbilityLevel(event.damageSource.damagingEntity, sorcery_skill, sorcery_echoing_power_ability);
    let remainingDamage = event.damage * getDamageMultiplier(level);
    for (let i = 0; i < enchantmentCount; i++) {
        system.runTimeout(() => {
            if (!isAlive(event.hurtEntity))
                return;
            spawnParticle(event.hurtEntity.dimension, event.hurtEntity.location, "pod_rpg:echoing_power");
            event.hurtEntity.applyDamage(remainingDamage, {
                cause: EntityDamageCause.magic,
                damagingEntity: event.damageSource.damagingEntity,
                damagingProjectile: event.damageSource.damagingProjectile,
            });
            remainingDamage *= getDamageMultiplier(level);
        }, i * 10);
    }
});
const getDamageMultiplier = (level) => {
    let value = 0.3;
    if (level >= 2)
        value += 0.2;
    if (level >= 4)
        value += 0.2;
    return value;
};
const getDuration$h = (level) => {
    let value = 15;
    if (level >= 3)
        value += 10;
    return value;
};

/**
 * Calculates the distance between two vectors
 * @param vectorA
 * @param vectorB
 * @returns Distance as number
 */
function getDistance(vectorA, vectorB) {
    const x = vectorA.x - vectorB.x;
    const y = vectorA.y - vectorB.y;
    const z = vectorA.z - vectorB.z;
    return Math.sqrt(x * x + y * y + z * z);
}
/**
 * Calculates the magnitude of a vector
 * @param vector
 * @returns Magnitude as number
 */
function getMagnitude(vector) {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
}
/**
 * Calculates the direction from one vector to another
 * @param vectorA
 * @param vectorB
 * @returns Direction as vector
 */
function getDirection(vectorA, vectorB) {
    return {
        x: vectorB.x - vectorA.x,
        y: vectorB.y - vectorA.y,
        z: vectorB.z - vectorA.z,
    };
}
/**
 * Rotates a vector by the specified angle
 * @param vector
 * @param angle
 * @returns Rotated Vector
 */
function rotateVector(vector, angle) {
    angle = -angle * (Math.PI / 180);
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    return {
        x: vector.x * cos - vector.z * sin,
        y: vector.y,
        z: vector.x * sin + vector.z * cos,
    };
}
/**
 * Adds one vector to another
 * @param vectorA
 * @param vectorB
 * @returns Result as Vector
 */
function addVector(vectorA, vectorB) {
    return {
        x: vectorA.x + (vectorB.x || 0),
        y: vectorA.y + (vectorB.y || 0),
        z: vectorA.z + (vectorB.z || 0),
    };
}
/**
 * Converts Vector to string
 * @param vector
 * @param fractionDigits Amount of digits the vector should be rounded to
 * @returns vector as string useable in minecraft commands
 */
function vectorToString(vector, fractionDigits) {
    {
        return `${vector.x} ${vector.y} ${vector.z}`;
    }
}
function compareVectors(a, b) {
    return a.x === b.x && a.y === b.y && a.z === b.z;
}

const chain_strike_timer = new TimerUtil();
const chain_strike_ability = {
    key: "chain_strike",
    unlock_level: 15,
    enableTitle: true,
    description: (level) => {
        return [`${getDamageDecrease(level)}`, `${getDuration$g(level)}`];
    },
    cooldown: (level) => getCooldown$m(level),
    onEnable: (data) => {
        const { player, skill, level } = data;
        chain_strike_timer.set(player.name, getDuration$g(level) * 20);
        chain_strike_timer.enableDisplay(player, () => {
            return {
                rawtext: [
                    { text: "§p" },
                    ...getAbilityName(chain_strike_ability),
                    {
                        text: ` ${((chain_strike_timer.get(player.name) - system.currentTick) /
                            20).toFixed(1)}s`,
                    },
                ],
            };
        });
        ABILITY_TIMERS.setPlayer(player, getCooldown$m(level) * 20, skill);
    },
};
const handleChainStrike = (event, level) => {
    const { damageSource, damage, hurtEntity } = event;
    if (damageSource.cause === "projectile")
        return;
    if (damageSource.cause === EntityDamageCause.magic)
        return;
    let monsters = hurtEntity.dimension
        .getEntities({
        location: hurtEntity.location,
        families: ["monster"],
        maxDistance: 25,
    })
        .filter((v) => v !== hurtEntity);
    if (settings.getValue("abilities_target_players") === true)
        monsters.push(...hurtEntity.dimension.getPlayers({
            location: hurtEntity.location,
            excludeGameModes: [GameMode.creative, GameMode.spectator],
            excludeNames: [damageSource.damagingEntity.name],
            maxDistance: 25,
        }));
    if (monsters.length < 1)
        return;
    let lastDamage = damage;
    let lastEntity = hurtEntity;
    let i = 0;
    const damageNext = () => {
        system.runTimeout(() => {
            i++;
            monsters.sort((a, b) => {
                return getDistance(b.location, lastEntity.location) <
                    getDistance(a.location, lastEntity.location)
                    ? 1
                    : 0;
            });
            if (getDistance(monsters[0].location, lastEntity.location) > 5)
                return;
            //VISUAL
            if (settings.getValue("particles") === true) {
                for (let i1 = 0.1; i1 < 1; i1 += 0.1) {
                    spawnParticle(lastEntity.dimension, nextLocation$1(lastEntity.location, getDirection(lastEntity.location, addVector(monsters[0].location, { x: 0, y: 1, z: 0 })), i1), "pod_rpg:chainstrike");
                }
            }
            lastEntity = monsters.shift();
            world.playSound("dig.chain", lastEntity.location);
            lastDamage *= (100 - getDamageDecrease(level)) / 100;
            lastEntity.applyDamage(lastDamage, {
                cause: EntityDamageCause.magic,
                damagingEntity: damageSource.damagingEntity,
                damagingProjectile: damageSource.damagingProjectile,
            });
            if (monsters.length > 0 && i < 4)
                damageNext();
        }, 5);
    };
    damageNext();
};
const nextLocation$1 = (vec, dir, length) => {
    return {
        x: vec.x + length * dir.x,
        y: vec.y + length * dir.y,
        z: vec.z + length * dir.z,
    };
};
const getCooldown$m = (level) => {
    let cooldown = 60;
    if (level >= 1)
        cooldown -= 5;
    if (level >= 4)
        cooldown -= 10;
    return cooldown;
};
const getDamageDecrease = (level) => {
    let value = 30;
    if (level >= 2)
        value -= 5;
    if (level >= 5)
        value -= 10;
    return value;
};
const getDuration$g = (level) => {
    let duration = 10;
    if (level >= 3)
        duration += 5;
    return duration;
};

const getCooldown$l = (level) => {
    let value = 120;
    if (level >= 1)
        value -= 10;
    if (level >= 3)
        value -= 10;
    if (level >= 5)
        value -= 10;
    return value;
};
const essenceDrainTimer = new TimerUtil();
const sorcery_essence_drain_ability = {
    key: "essence_drain",
    unlock_level: 25,
    enableTitle: true,
    description: function (level) {
        return [`${getDuration$f(level)}`];
    },
    cooldown: getCooldown$l,
    onEnable(event) {
        essenceDrainTimer.set(event.player.name, getDuration$f(event.level) * 20);
        essenceDrainTimer.enableDisplay(event.player, () => {
            return {
                rawtext: [
                    { text: "§p" },
                    ...getAbilityName(sorcery_essence_drain_ability),
                    {
                        text: ` ${((essenceDrainTimer.get(event.player.name) - system.currentTick) /
                            20).toFixed(1)}s`,
                    },
                ],
            };
        });
        ABILITY_TIMERS.setPlayer(event.player, getCooldown$l(event.level) * 20, event.skill);
    },
};
world.afterEvents.entityHurt.subscribe((event) => {
    if (event.damageSource.damagingEntity?.typeId !== "minecraft:player")
        return;
    if (!essenceDrainTimer.has(event.damageSource.damagingEntity.name))
        return;
    const value = rand(0, Math.ceil(event.damage), true);
    if (value === 0)
        return;
    event.damageSource.damagingEntity.addExperience(value);
    if (settings.getValue("particles") === true) {
        for (let i1 = 0.1; i1 < 1; i1 += 0.1) {
            spawnParticle(event.damageSource.damagingEntity.dimension, nextLocation$1(event.damageSource.damagingEntity.location, getDirection(event.damageSource.damagingEntity.location, addVector(event.hurtEntity.location, { y: 1 })), i1), "pod_rpg:essence_drain");
        }
    }
});
const getDuration$f = (level) => {
    let value = 30;
    if (level >= 2)
        value += 10;
    if (level >= 4)
        value += 10;
    return value;
};

const groupedEnchantmentTypes = [
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.AquaAffinity),
        groups: ["helmet"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.BaneOfArthropods),
        groups: ["weapon"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.Binding),
        groups: ["armor"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.BlastProtection),
        groups: ["armor"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.BowInfinity),
        groups: ["bow"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.Breach),
        groups: ["mace"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.Channeling),
        groups: ["trident"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.Density),
        groups: ["mace"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.DepthStrider),
        groups: ["boots"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.Efficiency),
        groups: ["tool"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.FeatherFalling),
        groups: ["boots"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.FireAspect),
        groups: ["weapon"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.FireProtection),
        groups: ["armor"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.Flame),
        groups: ["bow"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.Fortune),
        groups: ["tool"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.FrostWalker),
        groups: ["leggings"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.Impaling),
        groups: ["trident"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.Knockback),
        groups: ["weapon"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.Looting),
        groups: ["weapon"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.Loyalty),
        groups: ["trident"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.LuckOfTheSea),
        groups: ["fishing_rod"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.Lure),
        groups: ["fishing_rod"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.Mending),
        groups: [
            "armor",
            "fishing_rod",
            "trident",
            "tool",
            "bow",
            "mace",
            "crossbow",
        ],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.Multishot),
        groups: ["crossbow"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.Piercing),
        groups: ["crossbow"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.Power),
        groups: ["bow"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.ProjectileProtection),
        groups: ["armor"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.Protection),
        groups: ["armor"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.Punch),
        groups: ["armor"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.QuickCharge),
        groups: ["crossbow"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.Respiration),
        groups: ["helmet"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.Riptide),
        groups: ["trident"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.Sharpness),
        groups: ["weapon"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.SilkTouch),
        groups: ["tool"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.Smite),
        groups: ["weapon"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.SoulSpeed),
        groups: ["boots"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.SwiftSneak),
        groups: ["leggings"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.Thorns),
        groups: ["armor"],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.Unbreaking),
        groups: [
            "armor",
            "tool",
            "mace",
            "fishing_rod",
            "trident",
            "crossbow",
            "bow",
        ],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.Vanishing),
        groups: [
            "armor",
            "tool",
            "mace",
            "fishing_rod",
            "trident",
            "crossbow",
            "bow",
        ],
    },
    {
        enchantment: EnchantmentTypes.get(MinecraftEnchantmentTypes.WindBurst),
        groups: ["mace"],
    },
];
const sorcery_skill = {
    key: "sorcery",
    primary_color: "§5",
    secondary_color: "§u",
    base_exp: 30,
    base_passive_chance: 1,
    playerSneak: {
        onEvent: (event, doubleClick) => {
            if (!event.isSneaking ||
                !isHolding(event.player, "minecraft:book") ||
                !isHolding(event.player, "minecraft:lapis_lazuli"))
                return;
            abilityActionBar$1(event.player, sorcery_skill, doubleClick, "Sneak");
            event.player.playSound("random.click");
            if (doubleClick) {
                triggerAbilityEvent.call({
                    player: event.player,
                    skill: sorcery_skill,
                    eventData: event,
                });
            }
        },
    },
    itemUse: {
        item: {
            typeIds: ["minecraft:lapis_lazuli", "minecraft:book"],
        },
        double_click: {
            useCommon: true,
        },
    },
    abilities: [
        sorcery_arcane_shield_ability,
        sorcery_echoing_power_ability,
        sorcery_essence_drain_ability,
    ],
};
playerEnchantItemEvent.subscribe((event) => {
    const level = getLevel(event.player, sorcery_skill);
    if ((sorcery_skill.base_passive_chance * level) / 100 >= rand()) {
        event.player.addLevels(event.levelsConsumed);
    }
    addExp(event.player, sorcery_skill, event.levelsConsumed * 2);
});

const fishing_treasure_ability = {
    key: "treasure",
    unlock_level: 15,
    enableTitle: false,
    description: function (level) {
        return [`${getChance$4(level) * 100}%%`];
    },
};
function handleTreasure(droppedLoot, abilityLevel) {
    if (getChance$4(abilityLevel) < rand())
        return;
    const droppedItem = droppedLoot.shift();
    if (!droppedItem.entity.isValid())
        return;
    const newEntity = droppedItem.entity.dimension.spawnItem(weightedSelection(T1_DROPS).itemStack(), droppedItem.entity.location);
    newEntity.clearVelocity();
    newEntity.applyImpulse(droppedItem.entity.getVelocity());
    spawnParticle(newEntity.dimension, newEntity.location, "pod_rpg:treasure");
}
function getChance$4(level) {
    let chance = 0.05;
    if (level >= 1)
        chance += 0.05;
    if (level >= 3)
        chance += 0.05;
    if (level >= 5)
        chance += 0.05;
    return chance;
}
const T1_DROPS = [
    {
        itemStack() {
            return new ItemStack(MinecraftItemTypes.GoldIngot, rand(1, 4));
        },
        weight: 50,
    },
    {
        itemStack() {
            return new ItemStack(MinecraftItemTypes.IronIngot, rand(1, 7));
        },
        weight: 60,
    },
    {
        itemStack() {
            return new ItemStack(MinecraftItemTypes.NautilusShell);
        },
        weight: 50,
    },
    {
        itemStack() {
            return new ItemStack(MinecraftItemTypes.TurtleScute);
        },
        weight: 50,
    },
    {
        itemStack() {
            return new ItemStack(MinecraftItemTypes.PhantomMembrane);
        },
        weight: 50,
    },
    {
        itemStack() {
            return new ItemStack(MinecraftItemTypes.ArmadilloScute);
        },
        weight: 50,
    },
    {
        itemStack() {
            return new ItemStack(MinecraftItemTypes.Compass);
        },
        weight: 50,
    },
    {
        itemStack() {
            return new ItemStack(MinecraftItemTypes.RecoveryCompass);
        },
        weight: 50,
    },
    {
        itemStack() {
            return new ItemStack(MinecraftItemTypes.AmethystShard);
        },
        weight: 50,
    },
    {
        itemStack() {
            return new ItemStack(MinecraftItemTypes.TrialKey);
        },
        weight: 50,
    },
    {
        itemStack() {
            return new ItemStack(MinecraftItemTypes.NautilusShell);
        },
        weight: 50,
    },
    {
        itemStack() {
            return new ItemStack(MinecraftItemTypes.ShulkerShell);
        },
        weight: 30,
    },
    {
        itemStack() {
            return new ItemStack(MinecraftItemTypes.Diamond, rand(1, 2));
        },
        weight: 35,
    },
    {
        itemStack() {
            return new ItemStack(MinecraftItemTypes.Emerald, rand(1, 3));
        },
        weight: 35,
    },
    {
        itemStack() {
            return randomDamage(randomEnchantment(new ItemStack(MinecraftItemTypes.DiamondSword), groupedEnchantmentTypes
                .filter((v) => v.groups.includes("weapon"))
                .map((v) => v.enchantment)));
        },
        weight: 10,
    },
    {
        itemStack() {
            return randomDamage(randomEnchantment(new ItemStack(MinecraftItemTypes.Bow), groupedEnchantmentTypes
                .filter((v) => v.groups.includes("bow"))
                .map((v) => v.enchantment)));
        },
        weight: 10,
    },
    {
        itemStack() {
            return randomDamage(randomEnchantment(new ItemStack(MinecraftItemTypes.Crossbow), groupedEnchantmentTypes
                .filter((v) => v.groups.includes("crossbow"))
                .map((v) => v.enchantment)));
        },
        weight: 10,
    },
    {
        itemStack() {
            return randomDamage(randomEnchantment(new ItemStack(randomSelection([
                MinecraftItemTypes.DiamondAxe,
                MinecraftItemTypes.DiamondHoe,
                MinecraftItemTypes.DiamondPickaxe,
                MinecraftItemTypes.DiamondShovel,
            ])), groupedEnchantmentTypes
                .filter((v) => v.groups.includes("tool"))
                .map((v) => v.enchantment)));
        },
        weight: 10,
    },
];
function randomDamage(itemStack) {
    const durability = itemStack.getComponent(ItemDurabilityComponent.componentId);
    if (durability && durability.isValid())
        durability.damage = rand(0, durability.maxDurability - 5, true);
    return itemStack;
}
function randomEnchantment(itemStack, enchantments, enchantmentCount = rand(1, 3, true)) {
    const enchantable = itemStack.getComponent(ItemEnchantableComponent.componentId);
    if (enchantable && enchantable.isValid()) {
        for (let i = 0; i < enchantmentCount; i++) {
            const enchantmentType = randomSelection(enchantments);
            enchantable.addEnchantment({
                type: enchantmentType,
                level: rand(1, enchantmentType.maxLevel, true),
            });
        }
    }
    return itemStack;
}

const overworld = world.getDimension("overworld");
/**
 * Prefix used for the debugging tag (e.g. podcrash.Debug)
 */
const NAMESPACE$1 = "pod_rpg";
/**
 * Parses a JSON Object to a formatted string
 * @param object
 * @returns object parsed to string
 */
function processObject(object) {
    if (!Object.keys(object).length)
        return "§7§oEmpty Object§r";
    let output = "{ ";
    for (const [key, value] of Object.entries(object)) {
        output += `§6${key}§7: §r${process(value)} `;
    }
    return `${output}}`;
}
function process(arg) {
    let output = arg?.toString();
    if (Array.isArray(arg))
        output = `[${arg.map((d) => process(d)).join(", ")}]`;
    else if (arg === null)
        output = `§6null`;
    else
        switch (typeof arg) {
            case "object":
                output = processObject(arg);
                break;
            case "string":
                output = `${arg.startsWith("Error") ? "§c" : '§a"§2'}${arg}§a${arg.startsWith("Error") ? "" : '"'}`;
                break;
            case "number":
                output = isNaN(arg) ? `§5§oNaN` : `§9${arg}`;
                break;
            case "boolean":
                output = `§6${output}`;
                break;
            case "undefined":
                output = `§6undefined`;
                break;
        }
    return `${output}§r`;
}
/**
 * Formats arguments with colour and outputs them to Minecraft chat via tellraw.
 *
 * @param args
 */
function log(...args) {
    overworld
        .runCommandAsync(`tellraw @a[tag=${NAMESPACE$1}.Debug] {"rawtext":[{"text":"${args
        .map((d) => process(d))
        .join(" ")
        .replaceAll('"', '\\"')}"}]}`)
        .then()
        .catch();
}
/**
 * Logs a warning to the Minecraft Content Log
 * @param args
 */
function warn(...args) {
    // eslint-disable-next-line no-undef
    console.warn(...args.map(process));
}

const arrowRegistry = {};
const handleArrowImpact = (event, type) => {
    if (event.projectile.typeId !== "minecraft:arrow")
        return;
    const arrow = arrowRegistry[event.projectile.id];
    if (arrow && arrow.onImpact) {
        try {
            arrow.onImpact(arrow, event, type);
        }
        catch (e) {
            if (e.name !== "LocationInUnloadedChunkError")
                log(`${e.name} on Arrow impact: ${e.message}`);
        }
    }
    arrowRegistry[event.projectile.id] = {};
};

const triple_shot_ability = {
    key: "triple_shot",
    unlock_level: 5,
    enableTitle: false,
    description: () => {
        return [];
    },
    cooldown: (level) => getCooldown$k(level),
    onEnable: (event) => {
        const { player } = event;
        const { arrow } = event.eventData;
        spawnParticle(arrow.dimension, arrow.location, "pod_rpg.tripleshot");
        const level = getAbilityLevel(player, archer_skill, triple_shot_ability);
        const rArrow = arrow.dimension.spawnEntity("minecraft:arrow", arrow.location);
        const lArrow = arrow.dimension.spawnEntity("minecraft:arrow", arrow.location);
        arrowRegistry[rArrow.id] = {
            arrow: rArrow,
            source: player,
            onImpact: handleImpact$2,
        };
        arrowRegistry[lArrow.id] = {
            arrow: lArrow,
            source: player,
            onImpact: handleImpact$2,
        };
        arrowRegistry[arrow.id] = {
            arrow: arrow,
            source: player,
            onImpact: handleImpact$2,
        };
        rArrow.getComponent(EntityProjectileComponent.componentId).owner = player;
        rArrow.applyImpulse(rotateVector(arrow.getVelocity(), 10));
        lArrow.getComponent(EntityProjectileComponent.componentId).owner = player;
        lArrow.applyImpulse(rotateVector(arrow.getVelocity(), -10));
        ABILITY_TIMERS.setPlayer(player, getCooldown$k(level) * 20, archer_skill);
    },
};
const handleImpact$2 = (arrow, event, type) => {
    if (!arrow.source ||
        getAbilityLevel(arrow.source, archer_skill, triple_shot_ability) < 5)
        return;
    arrow.source.dimension.createExplosion(event.location, 0.5, {
        breaksBlocks: settings.getValue("explosion_damage") === true,
        causesFire: false,
        source: arrow.source,
    });
    if (type === "block")
        arrow.arrow?.remove();
};
const getCooldown$k = (level) => {
    let cooldown = 60;
    if (level >= 1)
        cooldown -= 5;
    if (level >= 2)
        cooldown -= 10;
    if (level >= 3)
        cooldown -= 5;
    if (level >= 4)
        cooldown -= 10;
    return cooldown;
};

const explosive_arrow_ability = {
    key: "explosive_arrow",
    unlock_level: 15,
    enableTitle: false,
    description: () => {
        return [];
    },
    cooldown: (level) => getCooldown$j(level),
    onEnable: (event) => {
        const level = getAbilityLevel(event.player, archer_skill, explosive_arrow_ability);
        arrowRegistry[event.eventData.arrow.id] = {
            arrow: event.eventData.arrow,
            source: event.player,
            onImpact: handleImpact$1,
        };
        ABILITY_TIMERS.setPlayer(event.player, getCooldown$j(level) * 20, archer_skill);
        if (settings.getValue("particles") === true) {
            const runId = system.runInterval(() => {
                if (!event.eventData.arrow.isValid()) {
                    system.clearRun(runId);
                    return;
                }
                spawnParticle(event.eventData.arrow.dimension, event.eventData.arrow.location, "pod_rpg:explosivearrow");
            });
        }
    },
};
const handleImpact$1 = (arrow, event, type) => {
    if (!arrow.source)
        return;
    const level = getAbilityLevel(arrow.source, archer_skill, explosive_arrow_ability);
    arrow.source.dimension.createExplosion(event.location, level >= 4 ? 3 : level >= 2 ? 2 : 1, {
        breaksBlocks: settings.getValue("explosion_damage") === true,
        causesFire: false,
        source: arrow.source,
    });
    if (type === "block")
        arrow.arrow?.remove();
};
const getCooldown$j = (level) => {
    let cooldown = 60;
    if (level >= 1)
        cooldown -= 5;
    if (level >= 3)
        cooldown -= 5;
    if (level >= 5)
        cooldown -= 10;
    return cooldown;
};

const arrow_shield_ability = {
    key: "arrow_shield",
    unlock_level: 30,
    enableTitle: true,
    description: (level) => {
        return [`${getDuration$e(level)}`];
    },
    cooldown: (level) => getCooldown$i(level),
    onEnable: (data) => {
        const { player, skill, level } = data;
        player.addTag("pod_rpg.disableMovement");
        player.runCommand("inputpermission set @s movement disabled");
        const baseVector = { x: 0.25, y: 0.3, z: 0 };
        const POINTS = 25;
        let i = 0;
        const runId = system.runInterval(async () => {
            if (i % 3 === 0) {
                displayActionBar(player, {
                    rawtext: [
                        { text: "§p" },
                        ...getAbilityName(arrow_shield_ability),
                        {
                            text: ` ${(getDuration$e(level) - i / 20).toFixed(1)}s`,
                        },
                    ],
                }, 2);
                for (const entity of player.dimension.getEntities({
                    location: player.location,
                    maxDistance: 3,
                    families: ["monster"],
                })) {
                    entity.applyKnockback(entity.location.x - player.location.x, entity.location.z - player.location.z, 1, 0.3);
                }
            }
            if (i === getDuration$e(level) * 20 - 1) {
                displayActionBar(player, "§r", 2);
                if (player.runCommand("inputpermission set @s movement enabled")
                    .successCount !== 0) {
                    player.removeTag("pod_rpg.disableMovement");
                }
                system.clearRun(runId);
            }
            i++;
            player.applyKnockback(0, 0, 0, 0);
            const arrow = player.dimension.spawnEntity("minecraft:arrow", addVector(player.location, { x: 0, y: 2.5, z: 0 }));
            arrow.getComponent(EntityProjectileComponent.componentId).owner = player;
            arrow.applyImpulse(rotateVector(baseVector, (360 / POINTS) * i));
            arrowRegistry[arrow.id] = {
                arrow: arrow,
                source: player,
                onImpact: handleImpact,
            };
        });
        ABILITY_TIMERS.setPlayer(player, getCooldown$i(level) * 20, skill);
    },
};
const handleImpact = (arrow, event, type) => {
    if (type === "block")
        arrow.arrow?.remove();
};
const getDuration$e = (level) => {
    let value = 5;
    if (level >= 1)
        value += 2.5;
    if (level >= 3)
        value += 2.5;
    return value;
};
const getCooldown$i = (level) => {
    let cooldown = 60;
    if (level >= 2)
        cooldown -= 5;
    if (level >= 4)
        cooldown -= 5;
    if (level >= 5)
        cooldown -= 10;
    return cooldown;
};

const life_drain_timer = new TimerUtil();
const life_drain_ability = {
    key: "life_drain",
    unlock_level: 5,
    enableTitle: true,
    description: (level) => {
        return [`${getHealing(level)}`, `${getDuration$d(level)}`];
    },
    cooldown: (level) => getCooldown$h(level),
    onEnable: (data) => {
        const { player, skill, level } = data;
        life_drain_timer.set(player.name, getDuration$d(level) * 20);
        life_drain_timer.enableDisplay(player, () => {
            return {
                rawtext: [
                    { text: "§p" },
                    ...getAbilityName(life_drain_ability),
                    {
                        text: ` ${((life_drain_timer.get(player.name) - system.currentTick) /
                            20).toFixed(1)}s`,
                    },
                ],
            };
        });
        ABILITY_TIMERS.setPlayer(player, getCooldown$h(level) * 20, skill);
    },
};
const handleLifeDrain = (event, level) => {
    const { damageSource, damage } = event;
    if (damageSource.damagingEntity === undefined)
        return;
    const healthComponent = damageSource.damagingEntity.getComponent(EntityHealthComponent.componentId);
    world.playSound("mob.evocation_illager.prepare_summon", damageSource.damagingEntity.location, { volume: 1, pitch: 3.75 + Math.random() / 2 });
    spawnParticle(damageSource.damagingEntity.dimension, addVector(damageSource.damagingEntity.location, { y: 1 }), "pod_rpg:lifedrain");
    healthComponent.setCurrentValue(Math.min(healthComponent.effectiveMax, healthComponent.currentValue + damage * (getHealing(level) / 100)));
};
const getCooldown$h = (level) => {
    let cooldown = 90;
    if (level >= 2)
        cooldown -= 15;
    if (level >= 5)
        cooldown -= 15;
    return cooldown;
};
const getHealing = (level) => {
    let value = 25;
    if (level >= 3)
        value += 5;
    return value;
};
const getDuration$d = (level) => {
    let duration = 10;
    if (level >= 1)
        duration += 5;
    if (level >= 4)
        duration += 5;
    return duration;
};

const horde_crush_ability = {
    key: "horde_crush",
    unlock_level: 30,
    enableTitle: false,
    description: (level) => {
        return [`${getChance$3(level)}%%`, `${getDamageIncrease$1(level)}%%`];
    },
    damageIncrease: (level) => getDamageIncrease$1(level),
    chance: (level) => getChance$3(level),
};
const handleHordeCrush = (event, level) => {
    const { hurtEntity, damageSource, damage } = event;
    if (damageSource.cause === "projectile")
        return;
    const entities = hurtEntity.dimension.getEntities({
        location: hurtEntity.location,
        maxDistance: 5,
        families: ["monster"],
    });
    if (entities.length > 1) {
        let additionalDamage = 0;
        for (let i = 0; i <= entities.length; i++) {
            if (getChance$3(level) >= Math.random() * 100) {
                additionalDamage += (damage * getDamageIncrease$1(level)) / 100;
            }
        }
        spawnParticle(hurtEntity.dimension, hurtEntity.location, "pod_rpg:hordecrush");
        hurtEntity.dimension.playSound("mob.zombie.woodbreak", hurtEntity.location, {
            volume: 0.3,
            pitch: 0.8,
        });
        const component = hurtEntity.getComponent(EntityHealthComponent.componentId);
        component.setCurrentValue(component.currentValue - additionalDamage);
        if (component.currentValue <= 0)
            rewardKill$1(damageSource.damagingEntity, hurtEntity);
    }
};
const getChance$3 = (level) => {
    let chance = 50;
    if (level >= 1)
        chance += 10;
    if (level >= 3)
        chance += 10;
    if (level >= 5)
        chance += 10;
    return chance;
};
const getDamageIncrease$1 = (level) => {
    let value = 5;
    if (level >= 2)
        value += 5;
    if (level >= 4)
        value += 5;
    return value;
};

const fighting_skill = {
    key: "fighting",
    primary_color: "§m",
    secondary_color: "§c",
    base_exp: 40,
    base_passive_chance: 0.5,
    entityHurt: {
        onEvent: async (event) => handleEntityHurt$2(event),
    },
    entityDie: {
        onEvent: async (event) => {
            if (event.damageSource.damagingEntity?.typeId === "minecraft:player")
                if (event.deadEntity.matches({ families: ["monster"] }) ||
                    (settings.getValue("addon_integration") === true &&
                        event.deadEntity.getDynamicProperty("hostile") === true))
                    rewardKill$1(event.damageSource.damagingEntity, event.deadEntity);
        },
    },
    playerSneak: {
        onEvent: (event, doubleClick) => {
            if (!event.isSneaking ||
                !getItemInSlot(event.player, EquipmentSlot.Mainhand)?.hasTag("minecraft:is_sword"))
                return;
            abilityActionBar$1(event.player, fighting_skill, doubleClick, "Sneak");
            event.player.playSound("random.click");
            if (doubleClick) {
                triggerAbilityEvent.call({
                    player: event.player,
                    skill: fighting_skill,
                    eventData: event,
                });
            }
        },
    },
    itemUse: {
        item: {
            tags: ["minecraft:is_sword"],
        },
        double_click: {
            useCommon: true,
        },
    },
    abilities: [life_drain_ability, chain_strike_ability, horde_crush_ability],
};
const handleEntityHurt$2 = async (event) => {
    const { damageSource, hurtEntity } = event;
    if (damageSource.damagingEntity &&
        !damageSource.damagingEntity.typeId.startsWith("minecraft:") &&
        damageSource.damagingEntity.typeId !== "pod_rpg:fireball")
        damageSource.damagingEntity.setDynamicProperty("hostile", true);
    if (!hurtEntity?.isValid())
        return;
    const isPlayer = hurtEntity.matches({ type: "minecraft:player" });
    if ((hurtEntity.matches({ families: ["monster"] }) || isPlayer) &&
        damageSource.damagingEntity?.typeId === "minecraft:player") {
        const player = damageSource.damagingEntity;
        const selectedAbility = getSelectedAbility(player, fighting_skill);
        if (!selectedAbility)
            return;
        const abilityLevel = getAbilityLevel(player, fighting_skill, selectedAbility);
        //HORDE CRUSH
        if (selectedAbility && !isPlayer && selectedAbility.key === "horde_crush") {
            handleHordeCrush(event, abilityLevel);
        }
        //LIFE DRAIN
        if (life_drain_timer.has(player.name)) {
            handleLifeDrain(event, abilityLevel);
        }
        //CHAIN STRIKE
        if (!isPlayer && chain_strike_timer.has(player.name)) {
            handleChainStrike(event, abilityLevel);
        }
    }
};
const rewardKill$1 = (player, entity) => {
    addExp(player, fighting_skill, 5);
    if (fighting_skill.base_passive_chance * getLevel(player, fighting_skill) >=
        Math.random() * 100) {
        if (player.runCommand(`loot spawn ${vectorToString(entity.location)} loot "entities/${entity.typeId.split(":")[1]}" mainhand`).successCount !== 0) {
            spawnParticle(player.dimension, entity.location, "pod_rpg:extra_drop");
            world.playSound("random.pop", entity.location);
        }
    }
};

const abilityCharge = new TimerUtil();
const archer_skill = {
    key: "archer",
    primary_color: "§c",
    secondary_color: "§n",
    base_exp: 30,
    base_passive_chance: 1,
    entityHurt: {
        onEvent: async (event) => {
            const { damageSource, hurtEntity, damage } = event;
            if (event.damageSource.damagingEntity?.typeId === "minecraft:player" &&
                event.damageSource.cause === "projectile") {
                const level = getLevel(event.damageSource.damagingEntity, archer_skill);
                const component = hurtEntity.getComponent(EntityHealthComponent.componentId);
                component.setCurrentValue(component.currentValue -
                    damage * ((archer_skill.base_passive_chance * level) / 100));
                if (hurtEntity.matches({ families: ["monster"] }) &&
                    component.currentValue <= 0)
                    rewardKill$1(damageSource.damagingEntity, hurtEntity);
            }
        },
    },
    projectileHit: {
        block: {
            onEvent: async (event) => handleProjectileHit(event, "block"),
        },
        entity: {
            onEvent: async (event) => handleProjectileHit(event, "entity"),
        },
    },
    playerShootArrow: {
        onEvent: async (event) => handleShootArrow$1(event),
    },
    playerSneak: {
        onEvent: (event, doubleClick) => {
            if (!event.isSneaking ||
                !(isHolding(event.player, "minecraft:bow") ||
                    isHolding(event.player, "minecraft:arrow")))
                return;
            abilityActionBar(event.player, doubleClick, "Sneak");
            event.player.playSound("random.click");
            if (getSelectedAbility(event.player, archer_skill)?.key === "arrow_shield") {
                if (doubleClick)
                    triggerAbilityEvent.call({
                        player: event.player,
                        skill: archer_skill,
                        eventData: event,
                    });
            }
            else {
                if (doubleClick)
                    chargeAbility(event.player);
            }
        },
    },
    itemUse: {
        item: {
            typeIds: ["minecraft:arrow"],
        },
        double_click: {
            useCommon: false,
            sneak: {
                onEvent: (event, doubleClick) => {
                    event.source.playSound("random.click");
                    displayActionBar(event.source, {
                        rawtext: [
                            ...getSkillName(archer_skill, archer_skill.primary_color),
                            {
                                text: ` §8- §aClick §7- ${doubleClick ? "§a" : "§7"}Click §8- `,
                            },
                            { translate: "pod_rpg.common.open_menu" },
                        ],
                    }, 1);
                    if (doubleClick)
                        showSkillInfoPage(event.source, archer_skill);
                },
            },
            normal: {
                onEvent: (event, doubleClick) => {
                    event.source.playSound("random.click");
                    abilityActionBar(event.source, doubleClick, "Click");
                    if (doubleClick)
                        chargeAbility(event.source);
                },
            },
        },
    },
    abilities: [
        triple_shot_ability,
        explosive_arrow_ability,
        arrow_shield_ability,
    ],
};
const handleProjectileHit = async (event, type) => {
    if (event.projectile.typeId !== "minecraft:arrow")
        return;
    const arrow = arrowRegistry[event.projectile.id];
    if (type === "entity") {
        const source = event.source
            ? event.source
            : arrow
                ? arrow.source
                : undefined;
        if (source?.typeId !== "minecraft:player")
            return;
        if (source)
            addExp(source, archer_skill, Math.ceil(getDistance(source.location, event.location) / 4));
    }
};
const handleShootArrow$1 = async (event) => {
    const { player } = event;
    const ability = getSelectedAbility(player, archer_skill);
    const v = event.arrow.getVelocity();
    addExp(player, archer_skill, Math.round(Math.min(5, Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z))));
    if (abilityCharge.has(player.name) &&
        (ability?.key === "triple_shot" || ability?.key === "explosive_arrow")) {
        abilityCharge.set(player.name, 0);
        ability.onEnable({
            player: player,
            skill: archer_skill,
            level: 0,
            eventData: event,
        });
    }
};
const chargeAbility = (player) => {
    const ability = getSelectedAbility(player, archer_skill);
    if (ability === undefined ||
        ABILITY_TIMERS.has(player.id + archer_skill.key + ability.key))
        return;
    if (ability.key === "arrow_shield") {
        triggerAbilityEvent.call({
            player: player,
            skill: archer_skill,
        });
        return;
    }
    const charged = abilityCharge.has(player.name);
    abilityCharge.set(player.name, charged ? 0 : 60 * 20);
    if (!charged)
        abilityCharge.setOnExpire(player.name, () => {
            player.playSound("armor.equip_generic", { pitch: 0.7 });
            displayActionBar(player, {
                rawtext: [
                    ...getAbilityName(ability, archer_skill.secondary_color),
                    { text: " " },
                    { translate: "pod_rpg.skills.archer.charge_expire" },
                ],
            }, 0);
        });
    player.playSound("armor.equip_generic", { pitch: charged ? 0.7 : 1 });
    displayActionBar(player, {
        rawtext: [
            ...getAbilityName(ability, archer_skill.secondary_color),
            { text: " " },
            {
                translate: charged
                    ? "pod_rpg.skills.archer.charge_expire"
                    : "pod_rpg.skills.archer.charge",
            },
        ],
    }, 0);
};
const abilityActionBar = (player, doubleClick, actionKey) => {
    const ability = getSelectedAbility(player, archer_skill);
    displayActionBar(player, {
        rawtext: [
            ...(ability === undefined
                ? getSkillName(archer_skill, archer_skill.primary_color)
                : getAbilityName(ability, archer_skill.secondary_color)),
            {
                text: ` §8- §a${actionKey} §7- ${doubleClick ? "§a" : "§7"}${actionKey} §8- `,
            },
            ...getAbilityStatus(player, ability),
        ],
    }, 1);
};
const getAbilityStatus = (player, ability) => {
    if (ability === undefined)
        return [
            { text: "§c" },
            { translate: "pod_rpg.common.ability.non_selected" },
        ];
    if (ability && !ability.onEnable) {
        return [
            { text: "§p" },
            { translate: "pod_rpg.common.ability.always_active" },
        ];
    }
    if (ABILITY_TIMERS.has(player.id + archer_skill.key + ability.key))
        return [
            { text: `§c` },
            {
                translate: "pod_rpg.common.ability.cooldown",
                with: [
                    ((ABILITY_TIMERS.get(player.id + archer_skill.key + ability.key) -
                        system.currentTick) /
                        20).toFixed(1),
                ],
            },
        ];
    if (ability.key === "arrow_shield") {
        return [{ text: "§a" }, { translate: "pod_rpg.common.ability.ready" }];
    }
    else {
        return abilityCharge.has(player.name)
            ? [{ text: "§a" }, { translate: "pod_rpg.skills.archer.is_charged" }]
            : [{ text: "§c" }, { translate: "pod_rpg.skills.archer.is_not_charged" }];
    }
};

const showMainUi = (player) => {
    const body = new RawtextBuilder();
    const buttons = [];
    body.pushLine({ translate: "pod_rpg.ui.main.body1" });
    body.pushLine();
    body.pushLine({ translate: "pod_rpg.ui.main.body2" });
    buttons.push({
        text: { translate: "pod_rpg.ui.skills_title" },
        icon: "textures/podcrash/rpg/icons/skills",
        action: () => showSkillsUi(player),
    });
    buttons.push({
        text: { translate: "pod_rpg.ui.guide_title" },
        icon: "textures/podcrash/rpg/icons/guide",
        action: () => showGuideMainUi(player),
    });
    if (PlayersInGame.length > 1) {
        buttons.push({
            text: { translate: "pod_rpg.ui.view_players" },
            icon: "textures/podcrash/rpg/icons/view_players",
            action: () => showViewPlayersUi(player),
        });
    }
    buttons.push({
        text: { translate: "pod_rpg.guide.changelog.title" },
        icon: "textures/podcrash/rpg/items/guide.png",
        action: () => {
            const body = new RawtextBuilder();
            body.pushLine({
                translate: "pod_rpg.guide.changelog.body",
                with: [VERSION],
            });
            body.pushLine();
            for (const version of VERSION_HISTORY) {
                body.pushLine({
                    translate: "pod_rpg.guide.changelog.subtitle",
                    with: [version],
                });
                body.pushLine();
                body.pushLine({
                    translate: `pod_rpg.guide.changelog.${version}`,
                    with: ["\n"],
                });
                body.pushLine();
                body.pushLine();
            }
            showPage(player, { translate: "pod_rpg.guide.changelog.title" }, body.build(), [
                {
                    text: { translate: "pod_rpg.common.ui.back_button" },
                    action: () => showMainUi(player),
                },
            ]);
        },
    });
    buttons.push({
        text: { translate: "pod_rpg.settings.title" },
        icon: "textures/podcrash/rpg/icons/settings",
        action: () => showSettingsDisclaimer(player, settings),
    });
    buttons.push({
        text: { translate: "pod_rpg.reset.title2" },
        icon: "textures/podcrash/rpg/icons/reset",
        action: () => showResetUi(player),
    });
    buttons.push({
        text: { translate: "pod_rpg.common.ui.exit_button" },
    });
    showPage(player, { translate: "pod_rpg.ui.addon_name" }, body.build(), buttons);
};
const showViewPlayersUi = (player) => {
    const body = new RawtextBuilder();
    body.pushLine({ translate: "pod_rpg.ui.view_players.choose" });
    const buttons = [];
    for (const otherPlayer of PlayersInGame) {
        buttons.push({
            text: otherPlayer.name,
            action: () => showSkillsUi(player, otherPlayer),
        });
    }
    buttons.push({
        text: { translate: "pod_rpg.common.ui.back_button" },
        action: () => showMainUi(player),
    });
    showPage(player, { translate: "pod_rpg.ui.view_players" }, body.build(), buttons);
};
const showSkillsUi = (player, ofPlayer = undefined) => {
    const body = new RawtextBuilder();
    body.pushLine({ translate: "pod_rpg.ui.skills_page.body" });
    const buttons = [];
    for (const skill of skills) {
        buttons.push({
            text: { translate: `pod_rpg.skills.${skill.key}.name` },
            icon: `textures/podcrash/rpg/icons/skills/${skill.key}`,
            action: () => {
                showSkillInfoPage(player, skill, ofPlayer);
            },
        });
    }
    buttons.push({
        text: { translate: "pod_rpg.common.ui.back_button" },
        action: () => (ofPlayer ? showViewPlayersUi(player) : showMainUi(player)),
    });
    showPage(player, ofPlayer
        ? { text: ofPlayer.name }
        : { translate: "pod_rpg.ui.skills_title" }, body.build(), buttons);
};
const showGuideMainUi = (player) => {
    const body = new RawtextBuilder();
    const buttons = [];
    body.pushLine({ translate: `pod_rpg.ui.guide.body1` });
    body.pushLine();
    body.pushLine({ translate: `pod_rpg.ui.guide.body2` });
    body.pushLine();
    body.pushLine({ translate: `pod_rpg.ui.guide.body3` });
    body.pushLine();
    body.pushLine({ translate: `pod_rpg.ui.guide.body4` });
    body.pushLine();
    buttons.push({
        text: { translate: "pod_rpg.ui.skills_title" },
        action: () => showGuideSkillUi(player),
    });
    buttons.push({
        text: { translate: "pod_rpg.ui.abilities_title" },
        action: () => showGuideAbilityUi(player),
    });
    buttons.push({
        text: { translate: "pod_rpg.common.ui.back_button" },
        action: () => showMainUi(player),
    });
    showPage(player, { translate: "pod_rpg.ui.guide_title" }, body.build(), buttons);
};
const showGuideSkillUi = (player) => {
    const body = new RawtextBuilder();
    const buttons = [];
    for (const skill of skills) {
        body.pushLine(...getSkillName(skill, "§l"));
        body.pushLine();
        body.pushLine({ translate: `pod_rpg.skills.${skill.key}.description` });
        body.pushLine();
    }
    buttons.push({
        text: { translate: "pod_rpg.common.ui.back_button" },
        action: () => showGuideMainUi(player),
    });
    showPage(player, { translate: "pod_rpg.ui.skills_title" }, body.build(), buttons);
};
const showGuideAbilityUi = (player) => {
    const body = new RawtextBuilder();
    const buttons = [];
    for (const skill of skills) {
        for (const ability of skill.abilities) {
            body.pushLine(...getAbilityName(ability, "§l"));
            body.pushLine();
            body.pushLine({
                translate: `pod_rpg.abilities.${ability.key}.description`,
                with: ability.description(0),
            });
            body.pushLine();
        }
    }
    buttons.push({
        text: { translate: "pod_rpg.common.ui.back_button" },
        action: () => showGuideMainUi(player),
    });
    showPage(player, { translate: "pod_rpg.ui.abilities_title" }, body.build(), buttons);
};
const showSkillInfoPage = (toPlayer, skill, ofPlayer = undefined) => {
    const body = new RawtextBuilder();
    const buttons = [];
    const player = ofPlayer ? ofPlayer : toPlayer;
    const exp = player.getDynamicProperty(`pod_rpg_${skill.key}_exp`) || 0;
    const level = getLevelFromExp(skill, exp);
    const expRequiredForThislevel = getExpRequiredForLevel(skill, level);
    const levelExp = exp - expRequiredForThislevel;
    const expRequired = getExpRequiredForLevel(skill, level + 1) - expRequiredForThislevel;
    body.pushLine({ text: "\n§l" }, ...getSkillName(skill, skill.primary_color));
    body.pushLine({ text: "§7" }, { translate: "pod_rpg.common.ui.level_text", with: [`${level}`] });
    body.pushLine({
        text: `\n§7[${getRenderableExpBar(level === MAX_LEVEL ? 100 : levelExp, level === MAX_LEVEL ? 100 : expRequired, 50)}§7]`,
    });
    body.pushLine(level === MAX_LEVEL
        ? { translate: "pod_rpg.common.ui.max_level" }
        : {
            text: `§8${((levelExp / expRequired) * 100).toFixed(1)}%% (${levelExp}/${expRequired})`,
        });
    const selectedAbility = getSelectedAbility(player, skill);
    if (!ofPlayer) {
        if (selectedAbility &&
            !ABILITY_TIMERS.has(player.id + skill.key + selectedAbility.key)) {
            buttons.push({
                text: { translate: "pod_rpg.common.ui.enable_ability" },
                action: () => {
                    if (skill.key === "archer" &&
                        selectedAbility.key !== "arrow_shield") {
                        chargeAbility(player);
                        return;
                    }
                    triggerAbilityEvent.call({
                        player: player,
                        skill: skill,
                    });
                },
            });
        }
        body.pushLine();
        body.pushLine({ translate: `pod_rpg.skills.${skill.key}.description` });
        body.pushLine({ text: "\n§l" }, { translate: "pod_rpg.common.ui.passive_title" });
        body.pushLine({
            translate: `pod_rpg.skills.${skill.key}.passive.description`,
            with: [skill.base_passive_chance * level + "%%"],
        });
        body.pushLine({ text: "\n§l" }, { translate: "pod_rpg.ui.abilities_title" });
        body.pushLine({ translate: "pod_rpg.common.ui.ability.description" }, { text: "\n" });
        body.pushLine({ translate: `pod_rpg.skills.${skill.key}.abilities.description` }, { text: "\n" });
        for (const ability of skill.abilities) {
            buttons.push({
                text: { translate: `pod_rpg.abilities.${ability.key}.name` },
                icon: `textures/podcrash/rpg/icons/abilities/${ability.unlock_level <= level ? "" : "gray/"}${ability.key}.png`,
                action: () => {
                    showAbilityPage(player, skill, ability);
                },
            });
            const abilityText = ability.unlock_level <= level
                ? [
                    {
                        translate: "pod_rpg.common.ui.ability.unlocked",
                    },
                ]
                : [
                    { text: `§8[§c` },
                    {
                        translate: "pod_rpg.common.ui.level_text",
                        with: [`${ability.unlock_level}`],
                    },
                    { text: `§8] §r` },
                ];
            body.pushLine(...abilityText, ...getAbilityName(ability, skill.secondary_color));
        }
    }
    else {
        body.pushLine({ text: "\n§l" }, { translate: "pod_rpg.ui.abilities_title" });
        body.pushLine();
        for (const ability of skill.abilities) {
            body.push(...getAbilityName(ability, skill.secondary_color));
            if (ability.unlock_level <= level)
                body.pushLine({ text: ` §7- §a` }, {
                    translate: "pod_rpg.common.ui.level_text",
                    with: [`${getAbilityLevel(player, skill, ability)}`],
                });
            else
                body.pushLine({ text: ` §7- §c` }, {
                    translate: "pod_rpg.common.ui.ability.not_unlocked_short",
                });
        }
    }
    const selectedAbilityText = selectedAbility
        ? getAbilityName(selectedAbility, skill.secondary_color)
        : [{ translate: "pod_rpg.common.ui.ability.non_selected" }];
    body.pushLine({ text: "\n§f" }, { translate: "pod_rpg.common.ui.ability.selected" }, ...selectedAbilityText);
    buttons.push({
        text: { translate: "pod_rpg.common.ui.back_button" },
        action: () => showSkillsUi(toPlayer, ofPlayer),
    });
    showPage(toPlayer, {
        rawtext: [
            ofPlayer
                ? { text: ofPlayer.name }
                : { translate: `pod_rpg.skills.${skill.key}.name` },
        ],
    }, body.build(), buttons);
};
const showAbilityPage = (player, skill, ability) => {
    const body = new RawtextBuilder();
    const buttons = [];
    const level = getLevel(player, skill);
    const abilityLevel = player.getDynamicProperty(`pod_rpg_${skill.key}_${ability.key}`) || 0;
    body.pushLine({ text: "\n§l" }, ...getAbilityName(ability, skill.secondary_color));
    body.pushLine({ text: "§7" }, { translate: "pod_rpg.common.ui.level_text", with: [`${abilityLevel}`] });
    body.pushLine();
    body.pushLine({
        translate: `pod_rpg.abilities.${ability.key}.description`,
        with: ability.description(abilityLevel),
    });
    if (ability.cooldown) {
        const cooldown = ability.cooldown(abilityLevel);
        const reducedCooldown = handlePatience(player, cooldown, fishing_skill);
        body.pushLine({
            translate: "pod_rpg.common.ui.ability.cooldown",
            with: [
                `${reducedCooldown === cooldown
                    ? cooldown
                    : `§s${reducedCooldown} (Reduced)§r`}`,
            ],
        });
    }
    body.pushLine();
    if (abilityLevel < 5) {
        body.pushLine({
            translate: "pod_rpg.common.ui.ability.level",
            with: [
                `${abilityLevel + 1}`,
                `${5 + abilityLevel * 5}`,
                `${player.level}`,
            ],
        });
    }
    body.pushLine();
    for (let i = 1; i < 6; i++) {
        const unlocked = abilityLevel >= i;
        body.pushLine({ text: unlocked ? "§7[§a" : "§8[§c" }, { translate: "pod_rpg.common.ui.level_text", with: [`${i}`] }, { text: unlocked ? "§7] §r" : "§8] §r" }, { translate: `pod_rpg.abilities.${ability.key}.level${i}` });
    }
    body.pushLine();
    if (level >= ability.unlock_level) {
        const selected = getSelectedAbility(player, skill)?.key === ability.key;
        buttons.push({
            text: {
                translate: `pod_rpg.common.ui.ability.${selected ? "disable_button" : "enable_button"}`,
            },
            icon: `textures/podcrash/rpg/icons/abilities/${selected ? "gray/" : ""}${ability.key}.png`,
            action: () => {
                setSelectedAbility(player, skill, selected ? -1 : skill.abilities.indexOf(ability));
                showSkillInfoPage(player, skill);
            },
        });
        if (abilityLevel < 5 && player.level >= 5 + abilityLevel * 5) {
            buttons.push({
                text: {
                    translate: "pod_rpg.common.ui.ability.level_button",
                },
                action: () => {
                    player.addLevels(-(5 + abilityLevel * 5));
                    player.playSound("random.levelup");
                    player.setDynamicProperty(`pod_rpg_${skill.key}_${ability.key}`, abilityLevel + 1);
                    showAbilityPage(player, skill, ability);
                },
            });
        }
    }
    else {
        body.pushLine({ text: "§c" }, { translate: "pod_rpg.common.ui.ability.not_unlocked" });
    }
    buttons.push({
        text: { translate: "pod_rpg.common.ui.back_button" },
        action: () => {
            showSkillInfoPage(player, skill);
        },
    });
    showPage(player, { rawtext: [{ translate: `pod_rpg.abilities.${ability.key}.name` }] }, body.build(), buttons);
};

const FISH_TYPES = [
    MinecraftEntityTypes.Pufferfish,
    MinecraftEntityTypes.Salmon,
    MinecraftEntityTypes.Cod,
    MinecraftEntityTypes.Tropicalfish,
    MinecraftEntityTypes.Squid,
    MinecraftEntityTypes.GlowSquid,
];
const FISH_ITEMS_RAW = [
    MinecraftItemTypes.Cod,
    MinecraftItemTypes.Salmon,
    MinecraftItemTypes.TropicalFish,
    MinecraftItemTypes.Pufferfish,
];
const FISH_ITEMS_COOKED = [
    MinecraftItemTypes.CookedCod,
    MinecraftItemTypes.CookedSalmon,
];
const fishing_skill = {
    key: "fishing",
    primary_color: "§s",
    secondary_color: "§3",
    base_exp: 50,
    base_passive_chance: 0.5,
    abilities: [
        fishing_hot_rod_ability,
        fishing_treasure_ability,
        fishing_patience_ability,
    ],
    entityDie: {
        onEvent(event) {
            if (event.damageSource.damagingEntity?.typeId !== "minecraft:player")
                return;
            if (FISH_TYPES.includes(event.deadEntity.typeId)) {
                addExp(event.damageSource.damagingEntity, fishing_skill, 3);
            }
        },
    },
    playerSneak: {
        onEvent: (event, doubleClick) => {
            if (!event.isSneaking ||
                !isHolding(event.player, MinecraftItemTypes.FishingRod))
                return;
            displayActionBar(event.player, {
                rawtext: [
                    ...getSkillName(fishing_skill, fishing_skill.primary_color),
                    {
                        text: ` §8- §aClick §7- ${doubleClick ? "§a" : "§7"}Click §8- `,
                    },
                    { translate: "pod_rpg.common.open_menu" },
                ],
            }, 1);
            event.player.playSound("random.click");
            if (doubleClick) {
                showSkillInfoPage(event.player, fishing_skill);
            }
        },
    },
    itemUse: {
        item: {
            typeIds: [...FISH_ITEMS_RAW, ...FISH_ITEMS_COOKED],
        },
        double_click: {
            useCommon: true,
        },
    },
    itemCompleteUse: {
        onEvent(event) {
            if (FISH_ITEMS_RAW.includes(event.itemStack.typeId))
                addExp(event.source, fishing_skill, 1);
            if (FISH_ITEMS_COOKED.includes(event.itemStack.typeId))
                addExp(event.source, fishing_skill, 2);
        },
    },
};
playerFishSuccessfulEvent.subscribe((event) => {
    system.runTimeout(() => {
        addExp(event.player, fishing_skill, 8);
        const skillLevel = getLevel(event.player, fishing_skill);
        if ((skillLevel * fishing_skill.base_passive_chance) / 100 >= rand()) {
            const itemStack = new ItemStack(weightedSelection(PASSIVE_ITEMS).item, 1);
            const newEntity = event.loot[0].entity.dimension.spawnItem(itemStack, event.loot[0].entity.location);
            newEntity.clearVelocity();
            newEntity.applyImpulse(event.loot[0].entity.getVelocity());
            spawnParticle(newEntity.dimension, newEntity.location, "pod_rpg:extra_drop");
            world.playSound("random.pop", newEntity.location);
            event.loot.push({ item: itemStack, entity: newEntity });
        }
        const ability = getSelectedAbility(event.player, fishing_skill);
        if (!ability)
            return;
        const abilityLevel = getAbilityLevel(event.player, fishing_skill, ability);
        if (ability.key === "hot_rod")
            handleHotRod(event.loot, abilityLevel);
        if (ability.key === "treasure")
            handleTreasure(event.loot, abilityLevel);
    });
});
const PASSIVE_ITEMS = [
    {
        item: MinecraftItemTypes.Cod,
        weight: 20,
    },
    {
        item: MinecraftItemTypes.Salmon,
        weight: 15,
    },
    {
        item: MinecraftItemTypes.TropicalFish,
        weight: 5,
    },
    {
        item: MinecraftItemTypes.Pufferfish,
        weight: 5,
    },
    {
        item: MinecraftItemTypes.NameTag,
        weight: 2,
    },
    {
        item: MinecraftItemTypes.Saddle,
        weight: 2,
    },
    {
        item: MinecraftItemTypes.NautilusShell,
        weight: 1,
    },
];

const kaboom_ability = {
    key: "kaboom",
    unlock_level: 5,
    enableTitle: false,
    description: () => {
        return [];
    },
    cooldown: (level) => getCooldown$g(level),
    onEnable: (data) => {
        const { player, skill, level } = data;
        let entities = player
            .getEntitiesFromViewDirection({ maxDistance: 30 })
            .filter((v) => v.entity.matches({ families: ["mob"] }));
        if (entities.length !== 0) {
            entities[0].entity.applyDamage(1, {
                cause: EntityDamageCause.blockExplosion,
            });
            player.dimension.createExplosion(entities[0].entity.location, getSize(level), {
                breaksBlocks: settings.getValue("explosion_damage") === true,
                causesFire: false,
                source: player,
            });
            ABILITY_TIMERS.setPlayer(player, getCooldown$g(level) * 20, skill);
        }
        else {
            displayActionBar(player, {
                rawtext: [{ translate: "pod_rpg.abilities.kaboom.no_entity" }],
            }, 0);
        }
    },
};
const getCooldown$g = (level) => {
    let cooldown = 60;
    if (level >= 1)
        cooldown -= 5;
    if (level >= 3)
        cooldown -= 5;
    if (level >= 5)
        cooldown -= 5;
    return cooldown;
};
const getSize = (level) => {
    let value = 2;
    if (level >= 2)
        value += 1;
    if (level >= 4)
        value += 1;
    return value;
};

const blast_shield_ability = {
    key: "blast_shield",
    unlock_level: 15,
    enableTitle: true,
    description: () => {
        return [];
    },
    cooldown: (level) => getCooldown$f(level),
    onEnable: (data) => {
        const { player, skill, level } = data;
        const entities = player.dimension.getEntities({
            location: player.location,
            maxDistance: 5,
            excludeTypes: ["item", "xp_orb"],
        });
        for (const entity of entities) {
            if (!entity?.location || entity === player || !entity.isValid())
                continue;
            entity.applyKnockback(entity.location.x - player.location.x, entity.location.z - player.location.z, getKnockbackStrength(level), getKnockbackStrength(level) / 5);
        }
        spawnParticle(player.dimension, player.location, "pod_rpg:blastshield");
        world.playSound("random.explode", player.location);
        ABILITY_TIMERS.setPlayer(player, getCooldown$f(level) * 20, skill);
    },
};
const getKnockbackStrength = (level) => {
    let value = 2;
    if (level >= 2)
        value += 1;
    if (level >= 4)
        value += 1;
    return value;
};
const getCooldown$f = (level) => {
    let cooldown = 60;
    if (level >= 1)
        cooldown -= 10;
    if (level >= 3)
        cooldown -= 10;
    if (level >= 5)
        cooldown -= 10;
    return cooldown;
};

const DELAY = 80;
const tnt_boost_ability = {
    key: "tnt_boost",
    unlock_level: 30,
    enableTitle: true,
    description: () => {
        return [];
    },
    cooldown: (level) => getCooldown$e(level),
    onEnable: (data) => {
        const { player, skill, level } = data;
        const barrel = player.dimension.spawnEntity("pod_rpg:tnt_barrel", player.location);
        barrel.runCommand(`ride "${player.name}" start_riding @s teleport_rider`);
        player.addTag("pod_rpg.disableMovement");
        player.addTag("pod_rpg.customCamera");
        player.runCommand("inputpermission set @s movement disabled");
        player.runCommand("camera @s set minecraft:third_person");
        player.runCommand(`camerashake add @s 0.75 ${DELAY / 20} positional`);
        world.playSound("fire.ignite", barrel.location);
        world.playSound("random.fuse", barrel.location);
        let ticks = 0;
        const runId = system.runInterval(() => {
            ticks++;
            if (0.3 >= Math.random() && barrel.isValid()) {
                world.playSound("mob.zombie.wood", barrel.location, {
                    volume: Math.max(Math.random(), 0.3),
                    pitch: Math.max(Math.random(), 0.5),
                });
            }
            switch (ticks) {
                case DELAY:
                    world.playSound("random.explode", barrel.location);
                    spawnParticle(player.dimension, barrel.location, "minecraft:huge_explosion_emitter");
                    barrel.remove();
                    if (player.runCommand("inputpermission set @s movement enabled")
                        .successCount !== 0) {
                        player.removeTag("pod_rpg.disableMovement");
                    }
                    if (player.runCommand("camera @s clear").successCount !== 0) {
                        player.removeTag("pod_rpg.customCamera");
                    }
                    break;
                case DELAY + 2:
                    player.applyKnockback(0, 0, 0, level >= 4 ? 8 : level >= 2 ? 6 : 4);
                    player.addTag("pod_rpg.slowFalling");
                    player.addEffect("slow_falling", 20000000, {
                        showParticles: false,
                        amplifier: 2,
                    });
                    system.clearRun(runId);
                    break;
            }
        });
        ABILITY_TIMERS.setPlayer(player, getCooldown$e(level) * 20, skill);
    },
};
const getCooldown$e = (level) => {
    let cooldown = 120;
    if (level >= 1)
        cooldown -= 10;
    if (level >= 3)
        cooldown -= 10;
    if (level >= 5)
        cooldown -= 10;
    return cooldown;
};

const blastmaster_skill = {
    key: "blastmaster",
    primary_color: "§m",
    secondary_color: "§c",
    base_exp: 30,
    base_passive_chance: 1,
    entityHurt: {
        onEvent: async (event) => handleEntityHurt$1(event),
    },
    playerSneak: {
        onEvent: (event, doubleClick) => {
            if (!event.isSneaking ||
                !(isHolding(event.player, "minecraft:gunpowder") ||
                    isHolding(event.player, "minecraft:tnt")))
                return;
            abilityActionBar$1(event.player, blastmaster_skill, doubleClick, "Sneak");
            event.player.playSound("random.click");
            if (doubleClick) {
                triggerAbilityEvent.call({
                    player: event.player,
                    skill: blastmaster_skill,
                    eventData: event,
                });
            }
        },
    },
    entityDie: {
        onEvent: async (event) => {
            if (event.damageSource.damagingEntity?.typeId === "minecraft:player" &&
                event.deadEntity.matches({ families: ["creeper"] })) {
                addExp(event.damageSource.damagingEntity, blastmaster_skill, 5);
            }
        },
    },
    itemUseOn: {
        before: {
            onEvent: async (event) => {
                const typeBefore = event.block.typeId;
                system.runTimeout(() => {
                    if (typeBefore === MinecraftBlockTypes.Tnt &&
                        event.block.typeId === MinecraftBlockTypes.Air &&
                        event.itemStack.typeId === MinecraftItemTypes.FlintAndSteel) {
                        system.runTimeout(() => addExp(event.source, blastmaster_skill, 10));
                    }
                });
            },
        },
    },
    itemUse: {
        item: {
            typeIds: ["minecraft:gunpowder"],
        },
        double_click: {
            useCommon: true,
        },
    },
    abilities: [kaboom_ability, blast_shield_ability, tnt_boost_ability],
};
const handleEntityHurt$1 = async (event) => {
    const { hurtEntity, damageSource, damage } = event;
    if (hurtEntity.typeId === "minecraft:player") {
        if (damageSource.cause === EntityDamageCause.blockExplosion ||
            damageSource.cause === EntityDamageCause.entityExplosion) {
            addExp(hurtEntity, blastmaster_skill, Math.round(damage));
            const level = getLevel(hurtEntity, blastmaster_skill);
            if (level * blastmaster_skill.base_passive_chance >=
                Math.random() * 100) {
                const healthComponent = hurtEntity.getComponent(EntityHealthComponent.componentId);
                if (healthComponent.currentValue > 0) {
                    healthComponent.setCurrentValue(healthComponent.currentValue + damage);
                    world.playSound("block.grindstone.use", hurtEntity.location);
                    //PLAY PARTICLE/SOUND
                }
            }
        }
    }
};

const swift_step_ability = {
    key: "swift_step",
    unlock_level: 5,
    enableTitle: true,
    description: (level) => {
        return [`${getAmplifier(level)}`, `${getDuration$c(level)}`];
    },
    cooldown: (level) => getCooldown$d(level),
    onEnable: (data) => {
        const { player, skill, level } = data;
        player.addEffect("speed", getDuration$c(level) * 20, {
            showParticles: false,
            amplifier: getAmplifier(level),
        });
        player.addEffect("jump_boost", getDuration$c(level) * 20, {
            showParticles: false,
            amplifier: getAmplifier(level),
        });
        ABILITY_TIMERS.setPlayer(player, getCooldown$d(level) * 20, skill);
    },
};
const getAmplifier = (level) => {
    let value = 1;
    if (level >= 2)
        value += 1;
    if (level >= 4)
        value += 1;
    return value;
};
const getDuration$c = (level) => {
    let value = 10;
    if (level >= 3)
        value += 5;
    return value;
};
const getCooldown$d = (level) => {
    let cooldown = 60;
    if (level >= 1)
        cooldown -= 5;
    if (level >= 5)
        cooldown -= 10;
    return cooldown;
};

const mount_ability = {
    key: "mount",
    unlock_level: 20,
    enableTitle: false,
    description: () => {
        return [];
    },
    onEnable: (data) => {
        const { player, level } = data;
        if (player.dimension.getEntities({
            tags: [`pod_rpg_owner:${player.id}`],
            location: player.location,
            maxDistance: 5,
        }).length !== 0)
            return;
        const mount = player.dimension.spawnEntity("pod_rpg:mount", player.location);
        if (!mount || !mount.isValid())
            return;
        world.playSound("mob.endermen.portal", mount.location);
        spawnParticle(mount.dimension, mount.location, "pod_rpg:mountcall");
        spawnParticle(mount.dimension, addVector(mount.location, { x: 0, y: 1, z: 0 }), "pod_rpg:mountcall");
        spawnParticle(mount.dimension, addVector(mount.location, { x: 0, y: 2, z: 0 }), "pod_rpg:mountcall");
        mount.addTag(`pod_rpg_owner:${player.id}`);
        mount.triggerEvent(`pod_rpg:speed${getSpeed(level)}`);
        mount.triggerEvent(`pod_rpg:jump${getJumpHeight(level)}`);
        mount.runCommand(`ride "${player.name}" start_riding @s teleport_ride`);
    },
};
const getSpeed = (level) => {
    let value = 0;
    if (level >= 1)
        value += 1;
    if (level >= 3)
        value += 1;
    if (level >= 5)
        value += 1;
    return value;
};
const getJumpHeight = (level) => {
    let value = 0;
    if (level >= 2)
        value += 1;
    if (level >= 4)
        value += 1;
    return value;
};

const homecoming_ability = {
    key: "homecoming",
    unlock_level: 30,
    enableTitle: false,
    description: (level) => {
        return [`${getCost(level)}`, `${getDuration$b(level)}`];
    },
    onEnable: (data) => {
        const { player, skill, level } = data;
        if (hasPearls(player, getCost(level))) {
            const DELAY = 20 * 15;
            ABILITY_TIMERS.setPlayer(player, DELAY, skill, true);
            let ticksPassed = 0;
            player.runCommand("fog @s push pod_rpg:homecoming pod_rpg_homecoming");
            const runId = system.runInterval(() => {
                const v = player.getVelocity();
                if (ticksPassed > 10 &&
                    Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2) !== 0) {
                    player.sendMessage({
                        rawtext: [
                            { translate: "pod_rpg.abilities.homecoming.cancel.move" },
                        ],
                    });
                    player.runCommand("fog @s remove pod_rpg_homecoming");
                    ABILITY_TIMERS.setPlayer(player, 0, skill, true);
                    system.clearRun(runId);
                    return;
                }
                if (ticksPassed % Math.floor(10 + Math.random() * 10) === 0) {
                    player.playSound("ambient.weather.thunder", {
                        volume: ticksPassed / DELAY,
                        pitch: 1.3 - ticksPassed / DELAY,
                    });
                }
                if (ticksPassed % 10 === 0)
                    spawnParticle(player.dimension, player.location, "pod_rpg:homecoming");
                let spawnpoint;
                switch (ticksPassed) {
                    case DELAY - 80:
                        player.playSound("portal.trigger");
                        break;
                    case DELAY - 20:
                        player.addEffect("blindness", 40, {
                            amplifier: 10,
                            showParticles: false,
                        });
                        break;
                    case DELAY:
                        system.clearRun(runId);
                        player.runCommand("fog @s pop pod_rpg_homecoming");
                        spawnpoint = player.getSpawnPoint();
                        if (!spawnpoint)
                            spawnpoint = {
                                dimension: world.getDimension("overworld"),
                                ...world.getDefaultSpawnLocation(),
                            };
                        if (!spawnpoint) {
                            player.sendMessage({
                                rawtext: [
                                    {
                                        translate: "pod_rpg.abilities.homecoming.cancel.spawnpoint",
                                    },
                                ],
                            });
                            return;
                        }
                        if (!hasPearls(player, getCost(level)))
                            return;
                        player.addEffect("slowness", getDuration$b(level) * 20, {
                            amplifier: 1,
                            showParticles: false,
                        });
                        player.teleport(spawnpoint, {
                            dimension: spawnpoint.dimension,
                        });
                        player.runCommand(`clear @s ender_pearl 0 ${getCost(level)}`);
                        displayActionBar(player, "§r", 0);
                        return;
                }
                displayActionBar(player, {
                    rawtext: [
                        {
                            translate: "pod_rpg.abilities.homecoming.teleportation_in",
                            with: [`${((DELAY - ticksPassed) / 20).toFixed(1)}`],
                        },
                    ],
                }, 0);
                ticksPassed++;
            });
        }
    },
};
const hasPearls = (player, amount) => {
    const result = hasItem(player, "minecraft:ender_pearl", amount);
    if (!result)
        player.sendMessage({
            rawtext: [{ translate: "pod_rpg.abilities.homecoming.cancel.pearls" }],
        });
    return result;
};
const getCost = (level) => {
    let value = 5;
    if (level >= 3)
        value -= 1;
    if (level >= 5)
        value -= 1;
    return value;
};
const getDuration$b = (level) => {
    let value = 60;
    if (level >= 1)
        value -= 10;
    if (level >= 2)
        value -= 10;
    if (level >= 4)
        value -= 10;
    return value;
};

const explorer_skill = {
    key: "explorer",
    primary_color: "§s",
    secondary_color: "§b",
    base_exp: 50,
    base_passive_chance: 0.01,
    tick: {
        interval: 20,
        onTick: async () => handleTick$1(),
    },
    playerSneak: {
        onEvent: (event, doubleClick) => {
            if (!event.isSneaking ||
                !(isHolding(event.player, "minecraft:saddle") ||
                    getItemInSlot(event.player, EquipmentSlot.Mainhand)?.hasTag("minecraft:boat")))
                return;
            abilityActionBar$1(event.player, explorer_skill, doubleClick, "Sneak");
            event.player.playSound("random.click");
            if (doubleClick) {
                triggerAbilityEvent.call({
                    player: event.player,
                    skill: explorer_skill,
                    eventData: event,
                });
            }
        },
    },
    playerJump: {
        onEvent: async (event) => handlePlayerJump(event),
    },
    itemUse: {
        item: {
            typeIds: ["minecraft:saddle"],
            tags: ["minecraft:boat"],
        },
        double_click: {
            useCommon: true,
        },
    },
    abilities: [swift_step_ability, mount_ability, homecoming_ability],
};
const lastPos = {};
let ticks = 0;
const handleTick$1 = async () => {
    ticks++;
    const allPlayers = PlayersInGame;
    for (const dimension of dimensions) {
        for (const entity of dimension.getEntities({
            type: "pod_rpg:mount",
        })) {
            if (entity.getComponent(EntityRideableComponent.componentId)?.getRiders()?.length === 0) {
                entity.triggerEvent("pod_rpg:despawn");
            }
        }
    }
    const interval = settings.getValue("reduce_validations") === true ? 5 : 1;
    if (ticks % interval === 0) {
        for (const player of allPlayers) {
            if (lastPos[player.name]) {
                const distance = getDistance(player.location, lastPos[player.name]);
                if (distance < 15 * (interval * 2) && !player.isFlying)
                    addExp(player, explorer_skill, Math.round(distance / 5), 6);
            }
            lastPos[player.name] = player.location;
        }
    }
};
let onGround = [];
const handlePlayerJump = async (event) => {
    const { player, isJumping, lastJump } = event;
    if (settings.getValue("double_jump") === false || player.isFlying)
        return;
    if (lastJump !== undefined && !onGround.includes(player.name) && isJumping) {
        const sinceLastJump = system.currentTick - lastJump;
        if (sinceLastJump <
            (settings.getValue("slower_double_click") === true ? 15 : 10) &&
            sinceLastJump > 1) {
            const level = getLevel(player, explorer_skill);
            if (level < 5)
                return;
            player.applyKnockback(player.getViewDirection().x, player.getViewDirection().z, 0.75 + 2.35 * explorer_skill.base_passive_chance * level, 0.35 + 0.2 * explorer_skill.base_passive_chance * level);
            player.playSound("mob.enderdragon.flap", {
                location: player.location,
                volume: 0.5,
                pitch: 1.1,
            });
            onGround.push(player.name);
            const runId = system.runInterval(() => {
                if (player.isOnGround) {
                    onGround = onGround.filter((v) => v !== player.name);
                    system.clearRun(runId);
                }
            }, settings.getValue("reduce_validations") === true ? 8 : 2);
        }
    }
};

const farm_exp_ability = {
    key: "farm_exp",
    unlock_level: 5,
    enableTitle: false,
    description: (level) => {
        return [`${getChance$2(level)}%%`];
    },
    chance: (level) => getChance$2(level),
};
const getChance$2 = (level) => {
    let chance = 50;
    if (level >= 1)
        chance += 10;
    if (level >= 2)
        chance += 10;
    if (level >= 3)
        chance += 10;
    if (level >= 5)
        chance += 20;
    return chance;
};

/**
 * Checks if the permutation of a block is included in a list of permutations
 * @param permutation
 * @param permutationList
 * @returns true if permutation is included in the list
 */
function permutationMatches(permutation, permutationList) {
    return indexOfPermutationMatched(permutation, permutationList) !== -1;
}
/**
 * Checks if the permutation of a block is included in a list of permutations
 * @param permutation
 * @param permutationList
 * @returns index of the permutation matched if any is found or -1
 */
function indexOfPermutationMatched(permutation, permutationList) {
    for (const toCheck of permutationList) {
        if (permutation?.matches(toCheck.block, toCheck.states) ?? true) {
            return permutationList.indexOf(toCheck);
        }
    }
    return -1;
}

const harvest_timer = new TimerUtil();
const harvest_ability = {
    key: "harvest",
    unlock_level: 15,
    enableTitle: true,
    description: (level) => {
        return [`${getDuration$a(level)}`];
    },
    cooldown: (level) => getCooldown$c(level),
    onEnable: (data) => {
        const { player, skill, level } = data;
        harvest_timer.set(player.name, getDuration$a(level) * 20);
        harvest_timer.enableDisplay(player, () => {
            return {
                rawtext: [
                    { text: "§p" },
                    ...getAbilityName(harvest_ability),
                    {
                        text: ` ${((harvest_timer.get(player.name) - system.currentTick) /
                            20).toFixed(1)}s`,
                    },
                ],
            };
        });
        ABILITY_TIMERS.setPlayer(player, getCooldown$c(level) * 20, skill);
    },
};
const handleHarvestAbility = async (dimension, location) => {
    const promises = [];
    for (let x = -2; x < 3; x++) {
        for (let z = -2; z < 3; z++) {
            promises.push((async () => {
                if (x !== 0 && z !== 0) {
                    const coords = addVector(location, { x: x, y: 0, z: z });
                    const blockAtCoords = dimension.getBlock(coords);
                    if (!blockAtCoords)
                        return;
                    if (permutationMatches(blockAtCoords.permutation, getRewardArray().map((v) => v.blocks[0])))
                        dimension.runCommandAsync(`setblock ${vectorToString(coords)} air destroy`);
                }
            })());
        }
    }
};
const getCooldown$c = (level) => {
    let cooldown = 90;
    if (level >= 1)
        cooldown -= 5;
    if (level >= 3)
        cooldown -= 5;
    if (level >= 5)
        cooldown -= 10;
    return cooldown;
};
const getDuration$a = (level) => {
    let duration = 5;
    if (level >= 2)
        duration += 5;
    if (level >= 4)
        duration += 5;
    return duration;
};

const fertiliser_timer = new TimerUtil();
const fertiliser_ability = {
    key: "fertiliser",
    unlock_level: 30,
    enableTitle: true,
    description: (level) => {
        return [`${getDuration$9(level)}`];
    },
    cooldown: (level) => getCooldown$b(level),
    onEnable: (data) => {
        const { player, skill, level } = data;
        fertiliser_timer.set(player.name, getDuration$9(level) * 20);
        fertiliser_timer.enableDisplay(player, () => {
            return {
                rawtext: [
                    { text: "§p" },
                    ...getAbilityName(fertiliser_ability),
                    {
                        text: ` ${((fertiliser_timer.get(player.name) - system.currentTick) /
                            20).toFixed(1)}s`,
                    },
                ],
            };
        });
        ABILITY_TIMERS.setPlayer(player, getCooldown$b(level) * 20, skill);
    },
};
const handleFertiliserAbility = async (dimension, location) => {
    let promises = [];
    for (let x = -1; x < 2; x++) {
        for (let z = -1; z < 2; z++) {
            promises.push((async () => {
                const affectedBlock = dimension.getBlock(addVector(location, { x: x, y: 0, z: z }));
                if (!affectedBlock)
                    return;
                for (const entry of getRewardArray()) {
                    const i = indexOfPermutationMatched(affectedBlock.permutation, entry.blocks);
                    if (i !== -1) {
                        affectedBlock.setPermutation(BlockPermutation.resolve(entry.blocks[i].block, entry.blocks[i].states));
                        break;
                    }
                }
            })());
        }
    }
    await Promise.all(promises);
    spawnParticle(dimension, location, "pod_rpg:superfertilizer");
};
const getCooldown$b = (level) => {
    let cooldown = 90;
    if (level >= 1)
        cooldown -= 5;
    if (level >= 3)
        cooldown -= 5;
    if (level >= 5)
        cooldown -= 10;
    return cooldown;
};
const getDuration$9 = (level) => {
    let duration = 5;
    if (level >= 2)
        duration += 5;
    if (level >= 4)
        duration += 5;
    return duration;
};

const pod_farm_animal_definitions = [
    {
        id: "pod_farm:bison",
        exp: 15,
        icon_id: 12,
        loot: "pod_farm_animals/bison",
    },
    {
        id: "pod_farm:deer",
        exp: 10,
        icon_id: 13,
        loot: "pod_farm_animals/deer",
    },
    {
        id: "pod_farm:duck",
        exp: 4,
        icon_id: 14,
        loot: "pod_farm_animals/duck",
    },
    {
        id: "pod_farm:goose",
        exp: 5,
        icon_id: 15,
        loot: "pod_farm_animals/goose",
    },
    {
        id: "pod_farm:peacock",
        exp: 7,
        icon_id: 16,
        loot: "pod_farm_animals/peacock",
    },
    {
        id: "pod_farm:quail",
        exp: 3,
        icon_id: 17,
        loot: "pod_farm_animals/quail",
    },
    {
        id: "pod_farm:turkey",
        exp: 5,
        icon_id: 18,
        loot: "pod_farm_animals/turkey",
    },
    {
        id: "pod_farm:yak",
        exp: 15,
        icon_id: 19,
        loot: "pod_farm_animals/yak",
    },
    {
        id: "pod_farm:crow",
        exp: 5,
        loot: "pod_farm_animals/crow",
    },
];
const pod_farm_crop_definitions = [
    {
        blocks: [
            { block: "pod_farm:blackberry_bush", states: { "pod_farm:growth": 2 } },
        ],
        item: "pod_farm:blackberry",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:blueberry_bush", states: { "pod_farm:growth": 2 } },
        ],
        item: "pod_farm:blueberry",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:cranberry_bush", states: { "pod_farm:growth": 2 } },
        ],
        item: "pod_farm:cranberry",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:raspberry_bush", states: { "pod_farm:growth": 2 } },
        ],
        item: "pod_farm:raspberry",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:strawberry_bush", states: { "pod_farm:growth": 2 } },
        ],
        item: "pod_farm:strawberry",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:coffee_plant", states: { "pod_farm:growth": 4 } },
        ],
        item: "pod_farm:coffee_plant_seeds",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:broccoli_plant", states: { "pod_farm:growth": 6 } },
        ],
        item: "pod_farm:broccoli",
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:cauliflower_plant", states: { "pod_farm:growth": 6 } },
        ],
        item: "pod_farm:cauliflower",
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:kohlrabi_plant", states: { "pod_farm:growth": 6 } },
        ],
        item: "pod_farm:kohlrabi",
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:cotton_plant", states: { "pod_farm:growth": 6 } },
        ],
        item: "pod_farm:cotton",
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:ginger_plant", states: { "pod_farm:growth": 6 } },
        ],
        item: "pod_farm:ginger",
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:lettuce_plant", states: { "pod_farm:growth": 6 } },
        ],
        item: "pod_farm:lettuce",
        exp: 5,
    },
    {
        blocks: [{ block: "pod_farm:oat_plant", states: { "pod_farm:growth": 6 } }],
        item: "pod_farm:oat",
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:onion_plant", states: { "pod_farm:growth": 6 } },
        ],
        item: "pod_farm:onion",
        exp: 5,
    },
    {
        blocks: [{ block: "pod_farm:pea_plant", states: { "pod_farm:growth": 6 } }],
        item: "pod_farm:pea",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:peanut_plant", states: { "pod_farm:growth": 6 } },
        ],
        item: "pod_farm:peanut",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:rhubarb_plant", states: { "pod_farm:growth": 6 } },
        ],
        item: "pod_farm:rhubarb",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:rice_plant", states: { "pod_farm:growth": 6 } },
        ],
        item: "pod_farm:rice",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:spinach_plant", states: { "pod_farm:growth": 6 } },
        ],
        item: "pod_farm:spinach",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [
            {
                block: "pod_farm:sweet_potato_plant",
                states: { "pod_farm:growth": 6 },
            },
        ],
        item: "pod_farm:sweet_potato",
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:bean_plant", states: { "pod_farm:growth": 6 } },
        ],
        item: "pod_farm:bean",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:bell_pepper_plant", states: { "pod_farm:growth": 6 } },
        ],
        item: "pod_farm:bell_pepper",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:chili_plant", states: { "pod_farm:growth": 6 } },
        ],
        item: "pod_farm:chili",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:cucumber_plant", states: { "pod_farm:growth": 6 } },
        ],
        item: "pod_farm:cucumber",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:tomato_plant", states: { "pod_farm:growth": 6 } },
        ],
        item: "pod_farm:tomato",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:vanilla_plant", states: { "pod_farm:growth": 6 } },
        ],
        item: "pod_farm:vanilla",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:corn_plant", states: { "pod_farm:growth": 6 } },
        ],
        item: "pod_farm:corn",
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:grape_vine", states: { "pod_farm:growth": 6 } },
        ],
        item: "pod_farm:grape",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:pineapple_plant", states: { "pod_farm:growth": 4 } },
        ],
        item: "pod_farm:pineapple",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [{ block: "pod_farm:tea_plant", states: { "pod_farm:growth": 4 } }],
        item: "pod_farm:tea",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:banana_cluster", states: { "pod_farm:growth": 3 } },
        ],
        item: "pod_farm:banana",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:apple_leaves", states: { "pod_farm:growth": 3 } },
        ],
        item: "minecraft:apple",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:pear_leaves", states: { "pod_farm:growth": 3 } },
        ],
        item: "pod_farm:pear",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:peach_leaves", states: { "pod_farm:growth": 3 } },
        ],
        item: "pod_farm:peach",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:lemon_leaves", states: { "pod_farm:growth": 3 } },
        ],
        item: "pod_farm:lemon",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:orange_leaves", states: { "pod_farm:growth": 3 } },
        ],
        item: "pod_farm:orange",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [
            { block: "pod_farm:avocado_leaves", states: { "pod_farm:growth": 3 } },
        ],
        item: "pod_farm:avocado",
        pickable: true,
        exp: 5,
    },
];

/**
 * @author Podcrash
 */
const NAMESPACE = "pod_rpg"; // The namespace of your add-on
const integratedAddons = {
    pod_farm: { installed: false },
}; //Object including the namespaces of all add-ons that you want integrate with. So if you wanted to integrate with Podcrash FARMING you'd add pod_farm: {installed: false} to here
/**
 * Checks if a specific add-on is installed
 * @param key add-on namespace to check for
 * @returns true if the add-on is installed, false if the add-on is not registered or not installed
 */
function isInstalled(key) {
    return integratedAddons[key]?.installed;
}
function isAddonInstalled(addon_id) {
    if (settings.getValue("addon_integration") === false)
        return false;
    return isInstalled(addon_id);
}
/**
 * Pings all add-ons registered. If they are installed and set up properly, they should return a pong scriptevent
 */
function pingAll() {
    for (const addon of Object.keys(integratedAddons)) {
        world
            .getDimension("overworld")
            .runCommand(`scriptevent ${addon}:ping ${NAMESPACE}@${VERSION}`);
    }
}
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id === NAMESPACE + ":ping") {
        const data = getDataFromMessage(event.message);
        world
            .getDimension("overworld")
            .runCommand(`scriptevent ${data.namespace}:pong ${NAMESPACE}@${VERSION}`);
    }
    if (event.id === NAMESPACE + ":pong") {
        const data = getDataFromMessage(event.message);
        if (integratedAddons[data.namespace] !== undefined) {
            //Do stuff on Add-On install here (recommended to call a custom event).
            integratedAddons[data.namespace] = {
                installed: true,
                version: data.version,
            };
            addonInstallEvent.call(data);
        }
    }
});
function getDataFromMessage(message) {
    if (message.includes("@")) {
        return { namespace: message.split("@")[0], version: message.split("@")[1] };
    }
    else {
        return { namespace: message };
    }
}

const farming_skill = {
    key: "farming",
    primary_color: "§g",
    secondary_color: "§p",
    base_exp: 30,
    base_passive_chance: 0.5,
    playerBreakBlock: {
        disallowPlayerPlacedBlocks: false,
        onEvent: (event) => handleBlockBreak(event),
    },
    playerSneak: {
        onEvent: (event, doubleClick) => {
            if (!event.isSneaking ||
                !getItemInSlot(event.player, EquipmentSlot.Mainhand)?.hasTag("minecraft:is_hoe"))
                return;
            abilityActionBar$1(event.player, farming_skill, doubleClick, "Sneak");
            event.player.playSound("random.click");
            if (doubleClick) {
                triggerAbilityEvent.call({
                    player: event.player,
                    skill: farming_skill,
                    eventData: event,
                });
            }
        },
    },
    itemUseOn: {
        after: {
            onEvent: async (event) => handleItemUseOnAfter(event),
        },
        before: {
            onEvent: async (event) => {
                const reward = getRewardArray().find((v) => v.pickable === true &&
                    permutationMatches(event.block.permutation, v.blocks));
                if (reward !== undefined)
                    system.runTimeout(() => {
                        const newBlock = event.block.dimension.getBlock(event.block.location);
                        if (!newBlock ||
                            !permutationMatches(newBlock.permutation, reward.blocks))
                            rewardCrop(event.source, event.block, reward);
                    }, 5);
            },
        },
    },
    itemUse: {
        item: {
            tags: ["minecraft:is_hoe"],
        },
        double_click: {
            useCommon: true,
        },
    },
    abilities: [farm_exp_ability, harvest_ability, fertiliser_ability],
};
const handleItemUseOnAfter = async (event) => {
    const { itemStack, block } = event;
    if (itemStack.typeId === "minecraft:bone_meal" &&
        fertiliser_timer.has(event.source.name)) {
        handleFertiliserAbility(block.dimension, addVector(block.location, { x: 0.5, y: 0.5, z: 0.5 }));
    }
};
const handleBlockBreak = (event) => {
    const { brokenBlockPermutation, player, block } = event;
    //HARVEST ABILITY
    if (harvest_timer.has(player.name)) {
        handleHarvestAbility(block.dimension, addVector(block.location, { x: 0.5, y: 0.5, z: 0.5 }));
    }
    for (const reward of getRewardArray()) {
        if (permutationMatches(brokenBlockPermutation, reward.blocks)) {
            rewardCrop(player, addVector(block.location, { x: 0.5, y: 0.5, z: 0.5 }), reward);
            break;
        }
    }
};
const rewardCrop = (player, location, reward) => {
    //EXP REWARD
    addExp(player, farming_skill, reward.exp);
    //EXPERIENCE ABILITY
    const selectedAbility = getSelectedAbility(player, farming_skill);
    if (selectedAbility && selectedAbility.key === "farm_exp") {
        const abilityLevel = getAbilityLevel(player, farming_skill, selectedAbility);
        if (selectedAbility.chance(abilityLevel) >= Math.random() * 100) {
            for (let i = 0; i < (abilityLevel >= 4 ? 2 : 1); i++) {
                player.dimension.spawnEntity("minecraft:xp_orb", location);
            }
        }
    }
    //ITEM DROP
    if (!reward.item)
        return;
    const chance = getLevel(player, farming_skill) * farming_skill.base_passive_chance;
    dropAdditionalItem(location, player.dimension, chance, reward.item, reward.item_count || 1);
};
function getRewardArray() {
    const array = Array.from(farming_rewards);
    if (isAddonInstalled("pod_farm"))
        array.push(...pod_farm_crop_definitions);
    return array;
}
const farming_rewards = [
    {
        blocks: [{ block: "sweet_berry_bush", states: { growth: 3 } }],
        item: "minecraft:sweet_berries",
        pickable: true,
        exp: 5,
    },
    {
        blocks: [{ block: "wheat", states: { growth: 7 } }],
        item: "minecraft:wheat",
        exp: 5,
    },
    {
        blocks: [{ block: "potatoes", states: { growth: 7 } }],
        item: "minecraft:potato",
        exp: 5,
    },
    {
        blocks: [{ block: "carrots", states: { growth: 7 } }],
        item: "minecraft:carrot",
        exp: 5,
    },
    {
        blocks: [{ block: "melon_block", states: {} }],
        item: "minecraft:melon_slice",
        item_count: 5,
        exp: 5,
    },
    {
        blocks: [{ block: "pumpkin", states: {} }],
        item: "minecraft:pumpkin",
        exp: 5,
    },
    {
        blocks: [{ block: "cocoa", states: { age: 2 } }],
        item: "minecraft:cocoa_beans",
        exp: 5,
    },
    {
        blocks: [{ block: "nether_wart", states: { age: 3 } }],
        item: "minecraft:nether_wart",
        exp: 5,
    },
    {
        blocks: [{ block: "beetroot", states: { growth: 7 } }],
        item: "minecraft:beetroot",
        exp: 5,
    },
];

const saturation_ability = {
    key: "saturation",
    unlock_level: 5,
    enableTitle: true,
    description: (level) => {
        return [`${getSaturation(level)}`, `${getDuration$8(level)}`];
    },
    cooldown: (level) => getCooldown$a(level),
    onEnable: (data) => {
        const { player, skill, level } = data;
        player.addEffect("saturation", getDuration$8(level) * 20, {
            amplifier: getSaturation(level) - 1,
            showParticles: false,
        });
        ABILITY_TIMERS.setPlayer(player, getCooldown$a(level) * 20, skill);
    },
};
const getSaturation = (level) => {
    let value = 1;
    if (level >= 3)
        value += 1;
    if (level >= 5)
        value += 1;
    return value;
};
const getCooldown$a = (level) => {
    let cooldown = 60;
    if (level >= 2)
        cooldown -= 10;
    if (level >= 4)
        cooldown -= 10;
    return cooldown;
};
const getDuration$8 = (level) => {
    let duration = 5;
    if (level >= 1)
        duration += 5;
    return duration;
};

const aim_assist_timer = new TimerUtil();
const aim_assist_ability = {
    key: "aim_assist",
    unlock_level: 30,
    description: (level) => {
        return [`${getRadius(level)}`, `${getDuration$7(level)}`];
    },
    cooldown: (level) => getCooldown$9(level),
    enableTitle: true,
    onEnable: (data) => {
        const { player, skill, level } = data;
        aim_assist_timer.set(player.name, getDuration$7(level) * 20);
        aim_assist_timer.enableDisplay(player, () => {
            return {
                rawtext: [
                    { text: "§p" },
                    ...getAbilityName(aim_assist_ability),
                    {
                        text: ` ${((aim_assist_timer.get(player.name) - system.currentTick) /
                            20).toFixed(1)}s`,
                    },
                ],
            };
        });
        ABILITY_TIMERS.setPlayer(player, getCooldown$9(level) * 20, skill);
    },
};
const targets = {};
const handleAimAssist = (event) => {
    const { arrow, player } = event;
    const level = getAbilityLevel(player, hunting_skill, aim_assist_ability);
    const runId = system.runInterval(() => {
        if (!arrow.isValid())
            return;
        let target = targets[arrow.id];
        if (target === undefined || !target.isValid() || !isAlive(target)) {
            const mobs = arrow.dimension.getEntities({
                location: arrow.location,
                families: ["mob"],
                maxDistance: getRadius(level),
            });
            if (settings.getValue("abilities_target_players") === true)
                mobs.push(...arrow.dimension.getPlayers({
                    location: arrow.location,
                    excludeGameModes: [GameMode.creative, GameMode.spectator],
                    excludeNames: [player.name],
                    maxDistance: getRadius(level),
                }));
            if (mobs.length === 0)
                return;
            mobs.sort((v) => getDistance(v.location, arrow.location)).reverse();
            targets[arrow.id] = mobs[0];
        }
        const direction = getDirection(arrow.location, targets[arrow.id].getHeadLocation());
        let speed = getMagnitude(arrow.getVelocity()) / getMagnitude(direction);
        speed = Math.min(0.2, speed);
        arrow.clearVelocity();
        arrow.applyImpulse({
            x: direction.x * speed,
            y: direction.y * speed,
            z: direction.z * speed,
        });
        spawnParticle(arrow.dimension, arrow.location, "pod_rpg:aimassist");
    });
    arrowRegistry[event.arrow.id] = {
        arrow: arrow,
        source: player,
        onImpact: () => {
            system.clearRun(runId);
        },
    };
};
const getCooldown$9 = (level) => {
    let value = 90;
    if (level >= 2)
        value -= 15;
    if (level >= 4)
        value -= 15;
    return value;
};
const getDuration$7 = (level) => {
    let value = 10;
    if (level >= 1)
        value += 5;
    if (level >= 3)
        value += 5;
    return value;
};
const getRadius = (level) => {
    let value = 5;
    if (level >= 5)
        value += 5;
    return value;
};

const animal_radar_ability = {
    key: "animal_radar",
    unlock_level: 15,
    enableTitle: true,
    description: () => {
        return [];
    },
    cooldown: (level) => getCooldown$8(level),
    onEnable: async (data) => {
        const { player, skill, level } = data;
        const entities = player.dimension.getEntities({
            location: player.location,
            maxDistance: 100,
        });
        const promises = [];
        const spawnedDisplays = [];
        for (const entity of entities) {
            promises.push((async () => {
                const animalData = animals.find((v) => v.id === entity.typeId);
                if (!animalData || animalData.icon_id === undefined)
                    return;
                const d = getDirection(player.location, entity.location);
                const m = getMagnitude(d);
                const displayLocation = {
                    x: player.location.x + d.x * (2.5 / m),
                    y: player.getHeadLocation().y,
                    z: player.location.z + d.z * (2.5 / m),
                };
                //Merging multiple animals in one direction
                const foundDisplay = spawnedDisplays.find((v) => getDistance(v.location, displayLocation) <= 0.25 &&
                    v.type === animalData.id);
                if (foundDisplay !== undefined) {
                    foundDisplay.amount += 1;
                    foundDisplay.displayEntity.nameTag =
                        foundDisplay.displayEntity.nameTag.split("\n")[0] +
                            "\n§7+" +
                            foundDisplay.amount;
                }
                else {
                    const display = player.dimension.spawnEntity("pod_rpg:animal_radar", displayLocation);
                    //Register spawned display
                    spawnedDisplays.push({
                        location: displayLocation,
                        type: animalData.id,
                        displayEntity: display,
                        amount: 0,
                    });
                    //Setting icon for texture
                    display.setProperty("pod_rpg:icon_id", animalData.icon_id);
                    //Adding name
                    display.nameTag =
                        getDistance(player.location, entity.location).toFixed(0) + "m";
                }
            })());
        }
        await Promise.all(promises);
        if (spawnedDisplays.length === 0) {
            displayActionBar(player, {
                translate: "pod_rpg.abilities.animal_radar.no_animals",
            }, 0);
            return;
        }
        world.playSound("beacon.power", player.location);
        ABILITY_TIMERS.setPlayer(player, getCooldown$8(level) * 20, skill);
        //Removing Entities
        system.runTimeout(async () => {
            for (const display of spawnedDisplays) {
                if (display.displayEntity && display.displayEntity.isValid())
                    display.displayEntity.remove();
            }
        }, 20 * 60);
    },
};
const getCooldown$8 = (level) => {
    return 100 - level * 10;
};

const flame_burst_ability = {
    key: "flame_burst",
    unlock_level: 5,
    enableTitle: true,
    description: (level) => {
        return [`${getDuration$6(level)}`];
    },
    cooldown: (level) => getCooldown$7(level),
    onEnable: async (data) => {
        const { player, skill, level } = data;
        const promises = [];
        const projectiles = [];
        for (let i = -180; i < 180; i += 15) {
            promises.push((async () => {
                const projectile = player.dimension.spawnEntity("pod_rpg:fire_projectile", player.location);
                projectiles.push({
                    projectile: projectile,
                    rotation: { x: 0, y: i },
                });
                projectile.setRotation({ x: 0, y: i });
                projectile.runCommand("tp ^ ^ ^0.5");
            })());
        }
        await Promise.all(promises);
        let ticks = 0;
        const runId = system.runInterval(() => {
            ticks += 2;
            if (ticks >= getDuration$6(level) * 20) {
                system.clearRun(runId);
                for (const projectile of projectiles)
                    projectile.projectile.remove();
                return;
            }
            const promises2 = [];
            for (const projectile of projectiles) {
                promises2.push((async () => {
                    if (ticks === 2)
                        projectile.projectile.triggerEvent("pod_rpg:activate");
                    projectile.projectile.setRotation(projectile.rotation);
                    projectile.projectile.runCommand("tp ^ ^ ^0.25");
                    spawnParticle(projectile.projectile.dimension, projectile.projectile.location, "minecraft:basic_flame_particle");
                })());
                Promise.all(promises2);
            }
        }, 2);
        world.playSound("mob.ghast.fireball", player.location);
        spawnParticle(player.dimension, player.location, "pod_rpg:flameburst");
        ABILITY_TIMERS.setPlayer(player, getCooldown$7(level) * 20, skill);
    },
};
const getCooldown$7 = (level) => {
    let cooldown = 60;
    if (level >= 1)
        cooldown -= 5;
    if (level >= 3)
        cooldown -= 5;
    if (level >= 5)
        cooldown -= 5;
    return cooldown;
};
const getDuration$6 = (level) => {
    let value = 2;
    if (level >= 2)
        value += 2;
    if (level >= 4)
        value += 2;
    return value;
};

const fire_rain_ability = {
    key: "fire_rain",
    unlock_level: 15,
    enableTitle: true,
    description: (level) => {
        return [`${getDuration$5(level)}`];
    },
    cooldown: (level) => getCooldown$6(level),
    onEnable: (data) => {
        const { player, skill, level } = data;
        let ticks = 0;
        const runId = system.runInterval(() => {
            ticks++;
            if (ticks >= getDuration$5(level) * 20) {
                system.clearRun(runId);
                return;
            }
            for (const entity of player.dimension.getEntities({
                location: player.location,
                maxDistance: 1,
                type: "pod_rpg:fireball",
            }))
                entity.remove();
            const fireball = player.dimension.spawnEntity("pod_rpg:fireball", addVector(player.location, {
                x: -10 + Math.random() * 20,
                y: 15 + Math.random() * 10,
                z: -10 + Math.random() * 20,
            }));
            world.playSound("mob.ghast.fireball", fireball.location);
            fireball.setOnFire(500, false);
            if (settings.getValue("fire_damage")?.valueOf() === true)
                fireball.triggerEvent("pod_rpg:fire_damage");
        });
        ABILITY_TIMERS.setPlayer(player, getCooldown$6(level) * 20, skill);
    },
};
const getCooldown$6 = (level) => {
    let cooldown = 120;
    if (level >= 1)
        cooldown -= 15;
    if (level >= 3)
        cooldown -= 15;
    if (level >= 5)
        cooldown -= 15;
    return cooldown;
};
const getDuration$5 = (level) => {
    let value = 5;
    if (level >= 2)
        value += 5;
    if (level >= 4)
        value += 5;
    return value;
};

const magma_walker_ability = {
    key: "magma_walker",
    unlock_level: 30,
    enableTitle: false,
    description: (level) => {
        return [`${getDuration$4(level)}%%`];
    },
};
const handleMagmaWalker = async (player) => {
    const level = getAbilityLevel(player, pyromaniac_skill, magma_walker_ability);
    const playerBlock = player.dimension.getBlock(player.location);
    if (!playerBlock)
        return;
    if (["minecraft:lava", "minecraft:flowing_lava", "minecraft:magma"].includes(playerBlock.typeId)) {
        player.teleport(addVector(player.location, { x: 0, y: 1, z: 0 }));
        return;
    }
    const blocks = [playerBlock.below()];
    blocks.push(blocks[0].north(), blocks[0].east(), blocks[0].south(), blocks[0].west());
    if (level >= 3) {
        blocks.push(blocks[1].east(), blocks[2].south(), blocks[3].west(), blocks[4].north());
    }
    for (const block of blocks) {
        if (!block.isLiquid)
            continue;
        if (["minecraft:lava", "minecraft:flowing_lava"].includes(block.typeId)) {
            if (level >= 5 && !player.hasTag("pod_rpg.fireResistance")) {
                player.addEffect("fire_resistance", 10000000, {
                    showParticles: false,
                });
                player.addTag("pod_rpg.fireResistance");
            }
            block.setPermutation(BlockPermutation.resolve("magma"));
            system.runTimeout(async () => {
                if (block.typeId !== "minecraft:magma" ||
                    block.dimension.getPlayers({
                        location: block.location,
                        maxDistance: 1,
                    }).length !== 0) {
                    return;
                }
                block.setPermutation(BlockPermutation.resolve("lava"));
            }, getDuration$4(level) * 20);
        }
    }
};
const getDuration$4 = (level) => {
    let chance = 2;
    if (level >= 1)
        chance += 1;
    if (level >= 2)
        chance += 1;
    if (level >= 4)
        chance += 1;
    return chance;
};

const pyromaniac_skill = {
    key: "pyromaniac",
    primary_color: "§m",
    secondary_color: "§c",
    base_exp: 30,
    base_passive_chance: 1,
    entityHurt: {
        onEvent: async (event) => handleEntityHurt(event),
    },
    entityDie: {
        onEvent: async (event) => {
            if (event.damageSource.damagingEntity?.typeId === "minecraft:player" &&
                event.deadEntity &&
                (event.deadEntity.matches({ families: ["blaze"] }) ||
                    event.deadEntity.matches({ families: ["magma_cube"] }))) {
                addExp(event.damageSource.damagingEntity, pyromaniac_skill, 7);
            }
        },
    },
    playerSneak: {
        onEvent: (event, doubleClick) => {
            if (!event.isSneaking ||
                !(isHolding(event.player, "minecraft:flint_and_steel") ||
                    isHolding(event.player, "minecraft:flint")))
                return;
            abilityActionBar$1(event.player, pyromaniac_skill, doubleClick, "Sneak");
            event.player.playSound("random.click");
            if (doubleClick) {
                triggerAbilityEvent.call({
                    player: event.player,
                    skill: pyromaniac_skill,
                    eventData: event,
                });
            }
        },
    },
    tick: {
        onTick: async () => handleTick(),
    },
    itemUseOn: {
        after: {
            onEvent: (event) => {
                if (event.itemStack.typeId === "minecraft:flint_and_steel") {
                    system.runTimeout(() => addExp(event.source, pyromaniac_skill, 5));
                }
            },
        },
    },
    itemUse: {
        item: {
            typeIds: ["minecraft:flint"],
        },
        double_click: {
            useCommon: true,
        },
    },
    abilities: [flame_burst_ability, fire_rain_ability, magma_walker_ability],
};
const handleTick = async () => {
    const promises = [];
    for (const player of PlayersInGame) {
        if (getSelectedAbility(player, pyromaniac_skill)?.key === "magma_walker")
            promises.push(handleMagmaWalker(player));
    }
    await Promise.all(promises);
};
const handleEntityHurt = async (event) => {
    const { hurtEntity, damageSource, damage } = event;
    if (hurtEntity.typeId === "minecraft:player") {
        if (damageSource.cause === EntityDamageCause.fire ||
            damageSource.cause === EntityDamageCause.fireTick ||
            damageSource.cause === EntityDamageCause.lava) {
            addExp(hurtEntity, pyromaniac_skill, Math.round(damage));
            const level = getLevel(hurtEntity, pyromaniac_skill);
            if (level * pyromaniac_skill.base_passive_chance >= Math.random() * 100) {
                const healthComponent = hurtEntity.getComponent(EntityHealthComponent.componentId);
                if (healthComponent.currentValue > 0) {
                    healthComponent.setCurrentValue(healthComponent.currentValue + damage);
                    world.playSound("block.grindstone.use", hurtEntity.location);
                }
            }
        }
    }
};

const hunting_skill = {
    key: "hunting",
    primary_color: "§2",
    secondary_color: "§q",
    base_exp: 30,
    base_passive_chance: 1,
    playerShootArrow: {
        onEvent: async (event) => handleShootArrow(event),
    },
    entityDie: {
        onEvent: async (event) => {
            if (event.damageSource.damagingEntity?.typeId === "minecraft:player") {
                const animalData = animals.find((v) => v.id === event.deadEntity.typeId);
                if (animalData ||
                    (settings.getValue("addon_integration") === true &&
                        (event.deadEntity.typeId.startsWith("sf_nba:") ||
                            event.deadEntity.hasComponent(EntityLeashableComponent.componentId))))
                    rewardKill(event.damageSource.damagingEntity, event.deadEntity, animalData);
            }
        },
    },
    playerSneak: {
        onEvent: (event, doubleClick) => {
            if (!event.isSneaking ||
                !(isHolding(event.player, "minecraft:shears") ||
                    isHolding(event.player, "minecraft:leather") ||
                    isHolding(event.player, "minecraft:feather")))
                return;
            abilityActionBar$1(event.player, hunting_skill, doubleClick, "Sneak");
            event.player.playSound("random.click");
            if (doubleClick) {
                triggerAbilityEvent.call({
                    player: event.player,
                    skill: pyromaniac_skill,
                    eventData: event,
                });
            }
        },
    },
    itemUse: {
        item: {
            typeIds: ["minecraft:shears", "minecraft:feather", "minecraft:leather"],
        },
        double_click: {
            useCommon: true,
        },
    },
    abilities: [saturation_ability, animal_radar_ability, aim_assist_ability],
};
const handleShootArrow = async (event) => {
    const { player } = event;
    if (aim_assist_timer.has(player.name))
        handleAimAssist(event);
};
const rewardKill = (player, entity, animalData) => {
    addExp(player, hunting_skill, animalData?.exp || 5);
    if (animalData === undefined)
        return;
    if (hunting_skill.base_passive_chance * getLevel(player, hunting_skill) >=
        Math.random() * 100) {
        if (player.runCommand(`loot spawn ${vectorToString(entity.location)} loot "${animalData.loot
            ? animalData.loot
            : `entities/${entity.typeId.split(":")[1]}`}" mainhand`).successCount !== 0) {
            spawnParticle(player.dimension, entity.location, "pod_rpg:extra_drop");
            world.playSound("random.pop", entity.location);
        }
    }
};
const animals = [
    {
        id: "minecraft:chicken",
        icon_id: 1,
        exp: 3,
    },
    {
        id: "minecraft:cow",
        icon_id: 2,
        exp: 7,
    },
    {
        id: "minecraft:sheep",
        icon_id: 3,
        exp: 6,
    },
    {
        id: "minecraft:pig",
        icon_id: 4,
        exp: 5,
    },
    {
        id: "minecraft:cod",
        loot: "entities/fish",
        exp: 3,
    },
    {
        id: "minecraft:salmon",
        loot: "entities/salmon_normal",
        exp: 3,
    },
    {
        id: "minecraft:pufferfish",
        icon_id: 5,
        exp: 5,
    },
    {
        id: "minecraft:tropicalfish",
        icon_id: 6,
        exp: 4,
    },
    {
        id: "minecraft:frog",
        icon_id: 7,
        exp: 5,
    },
    {
        id: "minecraft:squid",
        icon_id: 8,
        exp: 5,
    },
    {
        id: "minecraft:glow_squid",
        icon_id: 9,
        exp: 7,
    },
    {
        id: "minecraft:mooshroom",
        icon_id: 10,
        exp: 10,
    },
    {
        id: "minecraft:rabbit",
        icon_id: 11,
        exp: 5,
    },
];

const ore_radar_ability = {
    key: "ore_radar",
    unlock_level: 15,
    enableTitle: true,
    description: () => {
        return [];
    },
    cooldown: (level) => getCooldown$5(level),
    onEnable: async (data) => {
        const { player, skill, level } = data;
        ABILITY_TIMERS.setPlayer(player, getCooldown$5(level) * 20, skill);
        const traced_blocks = [
            "minecraft:coal_ore",
            "minecraft:deepslate_coal_ore",
            "minecraft:iron_ore",
            "minecraft:deepslate_iron_ore",
            "minecraft:redstone_ore",
            "minecraft:deepslate_redstone_ore",
            "minecraft:lit_redstone_ore",
            "minecraft:lit_deepslate_redstone_ore",
            "minecraft:lapis_ore",
            "minecraft:deepslate_lapis_ore",
            "minecraft:gold_ore",
            "minecraft:deepslate_gold_ore",
            "minecraft:emerald_ore",
            "minecraft:deepslate_emerald_ore",
            "minecraft:copper_ore",
            "minecraft:deepslate_copper_ore",
            "minecraft:quartz_ore",
            "minecraft:nether_gold_ore",
        ];
        if (level >= 2)
            traced_blocks.push("minecraft:diamond_ore", "minecraft:deepslate_diamond_ore");
        if (level >= 4)
            traced_blocks.push("minecraft:ancient_debris");
        const blocks = [];
        const playerLocationFloored = {
            x: Math.floor(player.location.x),
            y: Math.floor(player.location.y),
            z: Math.floor(player.location.z),
        };
        let highestMatch = -1;
        const promises = [];
        for (let x = -4; x < 5; x++) {
            for (let y = -4; y < 5; y++) {
                for (let z = -4; z < 5; z++) {
                    const location = addVector(playerLocationFloored, {
                        x: x,
                        y: y,
                        z: z,
                    });
                    promises.push((async () => {
                        const tracedIndex = traced_blocks.indexOf(player.dimension.getBlock(location)?.typeId || "");
                        if (tracedIndex !== -1) {
                            blocks.push({ type: tracedIndex, location: location });
                            if (highestMatch < tracedIndex)
                                highestMatch = tracedIndex;
                        }
                    })());
                }
            }
        }
        await Promise.all(promises);
        if (blocks.length === 0) {
            displayActionBar(player, {
                translate: "pod_rpg.abilities.ore_radar.no_ore_found",
            }, 0);
            return;
        }
        const closest = blocks
            .filter((v) => v.type === highestMatch)
            .sort((v) => getDistance(player.location, v.location))
            .reverse();
        player.teleport(player.location, {
            facingLocation: addVector(closest[0].location, {
                x: 0.5,
                y: -1,
                z: 0.5,
            }),
        });
        world.playSound("beacon.power", player.location);
        //VISUAL
        if (settings.getValue("particles") === true) {
            for (let i = 0; i < 1.05; i += 0.05) {
                spawnParticle(player.dimension, nextLocation(addVector(player.location, { x: 0, y: 1.4, z: 0 }), getDirection(addVector(player.location, { x: 0, y: 1.4, z: 0 }), addVector(closest[0].location, { x: 0.5, y: 0.5, z: 0.5 })), i), "pod_rpg:oreradar");
            }
        }
        displayActionBar(player, {
            rawtext: [
                { text: "§a" },
                { translate: "pod_rpg.abilities.ore_radar.traced" },
                { text: " " },
                {
                    translate: `tile.${traced_blocks[closest[0].type].replace("lit_", "")}.name`,
                },
            ],
        }, 1);
    },
};
const nextLocation = (vec, dir, length) => {
    return {
        x: vec.x + length * dir.x,
        y: vec.y + length * dir.y,
        z: vec.z + length * dir.z,
    };
};
const getCooldown$5 = (level) => {
    let cooldown = 30;
    if (level >= 1)
        cooldown -= 5;
    if (level >= 3)
        cooldown -= 5;
    if (level >= 5)
        cooldown -= 10;
    return cooldown;
};

const haste_ability = {
    key: "haste",
    unlock_level: 5,
    enableTitle: true,
    description: (level) => {
        const hasteLevel = level >= 2 ? 3 : 2;
        return [`${hasteLevel}`, `${getDuration$3(level)}`];
    },
    cooldown: (level) => getCooldown$4(level),
    onEnable: (data) => {
        const { player, skill, level } = data;
        player.addEffect("haste", getDuration$3(level) * 20, {
            amplifier: level >= 2 ? 2 : 1,
            showParticles: false,
        });
        ABILITY_TIMERS.setPlayer(player, getCooldown$4(level) * 20, skill);
    },
};
const getCooldown$4 = (level) => {
    let cooldown = 60;
    if (level >= 3)
        cooldown -= 15;
    return cooldown;
};
const getDuration$3 = (level) => {
    let duration = 10;
    if (level >= 1)
        duration += 5;
    if (level >= 4)
        duration += 5;
    if (level >= 5)
        duration += 10;
    return duration;
};

const super_break_timer = new TimerUtil();
const super_break_ability = {
    key: "super_break",
    unlock_level: 30,
    enableTitle: true,
    description: (level) => {
        return [`${getDuration$2(level)}`];
    },
    cooldown: (level) => getCooldown$3(level),
    onEnable: (data) => {
        const { player, skill, level } = data;
        super_break_timer.set(player.name, getDuration$2(level) * 20);
        super_break_timer.enableDisplay(player, () => {
            return {
                rawtext: [
                    { text: "§p" },
                    ...getAbilityName(super_break_ability),
                    {
                        text: ` ${((super_break_timer.get(player.name) - system.currentTick) /
                            20).toFixed(1)}s`,
                    },
                ],
            };
        });
        ABILITY_TIMERS.setPlayer(player, getCooldown$3(level) * 20, skill);
    },
};
const getCooldown$3 = (level) => {
    let cooldown = 120;
    if (level >= 2)
        cooldown -= 10;
    if (level >= 4)
        cooldown -= 10;
    return cooldown;
};
const getDuration$2 = (level) => {
    let duration = 5;
    if (level >= 1)
        duration += 5;
    if (level >= 3)
        duration += 5;
    if (level >= 5)
        duration += 5;
    return duration;
};

const mining_skill = {
    key: "mining",
    primary_color: "§e",
    secondary_color: "§6",
    base_exp: 50,
    base_passive_chance: 0.5,
    playerBreakBlock: {
        disallowPlayerPlacedBlocks: true,
        //item: {
        //tags: ["minecraft:is_pickaxe"],
        //},
        onEvent: (event) => rewardBlockBreak$1(event),
    },
    playerSneak: {
        onEvent: (event, doubleClick) => {
            if (!event.isSneaking ||
                !getItemInSlot(event.player, EquipmentSlot.Mainhand)?.hasTag("minecraft:is_pickaxe"))
                return;
            abilityActionBar$1(event.player, mining_skill, doubleClick, "Sneak");
            event.player.playSound("random.click");
            if (doubleClick) {
                triggerAbilityEvent.call({
                    player: event.player,
                    skill: mining_skill,
                    eventData: event,
                });
            }
        },
    },
    itemUse: {
        item: {
            //typeIds: ["minecraft:diamond_pickaxe"],
            tags: ["minecraft:is_pickaxe"],
        },
        double_click: {
            useCommon: true,
        },
    },
    abilities: [haste_ability, ore_radar_ability, super_break_ability],
};
const rewardBlockBreak$1 = (event) => {
    const { brokenBlockPermutation, player, block } = event;
    const reward = mining_rewards.find((v) => v.blocks.includes(brokenBlockPermutation.type.id));
    if (!reward && !isOre(brokenBlockPermutation, false))
        return;
    //EXP REWARD
    addExp(player, mining_skill, reward?.exp || 5);
    //SUPER BREAK ABILITY
    if (super_break_timer.has(player.name)) {
        const skip = (player.dimension.id === "minecraft:overworld" &&
            block.location.y < -58) ||
            (player.dimension.id === "minecraft:nether" &&
                (121 < block.location.y || block.location.y < 6)) ||
            player.dimension.id === "minecraft:the_end";
        if (!skip)
            player.runCommandAsync(`execute positioned ${block.location.x} ${block.location.y} ${block.location.z} run fill ~-1 ~-1 ~-1 ~1 ~1 ~1 air destroy`);
    }
    //ITEM DROP
    if (!reward.item)
        return;
    const chance = getLevel(player, mining_skill) * mining_skill.base_passive_chance;
    dropAdditionalItem(addVector(block.location, { x: 0.5, y: 0.5, z: 0.5 }), player.dimension, chance, reward.item, reward.item_count || 1);
};
function isOre(permutation, checkRewards = true) {
    if (checkRewards &&
        mining_rewards.some((v) => v.blocks.includes(permutation.type.id)))
        return true;
    if (permutation.type.id.match("^(?!minecraft:).*_ore$"))
        return true;
    return false;
}
const mining_rewards = [
    {
        blocks: [
            "minecraft:stone",
            "minecraft:andesite",
            "minecraft:diorite",
            "minecraft:granite",
            "minecraft:deepslate",
            "minecraft:tuff",
            "minecraft:blackstone",
            "minecraft:basalt",
            "minecraft:polished_basalt",
            "minecraft:netherrack",
            "minecraft:dripstone_block",
        ],
        exp: 1,
    },
    {
        blocks: ["minecraft:coal_ore", "deepslate_coal_ore"],
        item: "minecraft:coal",
        exp: 3,
    },
    {
        blocks: ["minecraft:quartz_ore"],
        item: "minecraft:quartz",
        item_count: 2,
        exp: 3,
    },
    {
        blocks: ["minecraft:nether_gold_ore"],
        item: "minecraft:gold_nugget",
        item_count: 4,
        exp: 3,
    },
    {
        blocks: ["minecraft:sculk"],
        exp: 3,
    },
    {
        blocks: ["minecraft:iron_ore", "minecraft:deepslate_iron_ore"],
        item: "minecraft:raw_iron",
        exp: 5,
    },
    {
        blocks: ["minecraft:copper_ore", "minecraft:deepslate_copper_ore"],
        item: "minecraft:raw_copper",
        exp: 5,
    },
    {
        blocks: [
            "minecraft:redstone_ore",
            "minecraft:deepslate_redstone_ore",
            "minecraft:lit_redstone_ore",
            "minecraft:lit_deepslate_redstone_ore",
        ],
        item: "minecraft:redstone",
        item_count: 3,
        exp: 7,
    },
    {
        blocks: ["minecraft:lapis_ore", "minecraft:deepslate_lapis_ore"],
        item: "minecraft:lapis_lazuli",
        item_count: 5,
        exp: 7,
    },
    {
        blocks: ["minecraft:gold_ore", "minecraft:deepslate_gold_ore"],
        item: "minecraft:raw_gold",
        exp: 10,
    },
    {
        blocks: ["minecraft:emerald_ore", "minecraft:deepslate_emerald_ore"],
        item: "minecraft:emerald",
        exp: 15,
    },
    {
        blocks: ["minecraft:diamond_ore", "minecraft:deepslate_diamond_ore"],
        item: "minecraft:diamond",
        exp: 20,
    },
    {
        blocks: ["minecraft:ancient_debris"],
        item: "minecraft:ancient_debris",
        exp: 50,
    },
];

const tree_exp_ability = {
    key: "tree_exp",
    enableTitle: false,
    unlock_level: 15,
    description: (level) => {
        return [`${getChance$1(level)}%%`];
    },
    chance: (level) => getChance$1(level),
};
const getChance$1 = (level) => {
    let chance = 50;
    if (level >= 1)
        chance += 10;
    if (level >= 2)
        chance += 10;
    if (level >= 3)
        chance += 10;
    if (level >= 5)
        chance += 20;
    return chance;
};

const fell_tree_timer = new TimerUtil();
const fell_tree_ability = {
    key: "fell_tree",
    unlock_level: 30,
    enableTitle: true,
    description: (level) => {
        return [`${getDuration$1(level)}`];
    },
    cooldown: (level) => getCooldown$2(level),
    onEnable: (data) => {
        const { player, skill, level } = data;
        fell_tree_timer.set(player.name, getDuration$1(level) * 20);
        fell_tree_timer.enableDisplay(player, () => {
            return {
                rawtext: [
                    { text: "§p" },
                    ...getAbilityName(fell_tree_ability),
                    {
                        text: ` ${((fell_tree_timer.get(player.name) - system.currentTick) /
                            20).toFixed(1)}s`,
                    },
                ],
            };
        });
        ABILITY_TIMERS.setPlayer(player, getCooldown$2(level) * 20, skill);
    },
};
const getDuration$1 = (level) => {
    let value = 5;
    if (level >= 2)
        value += 5;
    if (level >= 4)
        value += 5;
    return value;
};
const getCooldown$2 = (level) => {
    let cooldown = 90;
    if (level >= 1)
        cooldown -= 5;
    if (level >= 3)
        cooldown -= 5;
    if (level >= 5)
        cooldown -= 10;
    return cooldown;
};
function* fellTree(rootBlock) {
    const queue = [rootBlock];
    const visited = new Set();
    while (queue.length > 0) {
        const currentBlock = queue.shift();
        const locationKey = vectorToString(currentBlock.location);
        if (visited.has(locationKey))
            continue;
        visited.add(locationKey);
        queue.push(...getAdjacentLogs(currentBlock, visited));
        rootBlock.dimension.runCommand(`execute if block ${locationKey} ${currentBlock.typeId} run setblock ${locationKey} air destroy`);
        yield;
    }
}
function getAdjacentLogs(currentBlock, visited) {
    const result = [];
    for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
            for (let z = -1; z < 2; z++) {
                const block = currentBlock.dimension.getBlock(addVector(currentBlock.location, { x, y, z }));
                if (!block ||
                    visited.has(vectorToString(block)) ||
                    block.isAir ||
                    !isLog(block.permutation))
                    continue;
                result.push(block);
            }
        }
    }
    return result;
}
async function handleFellTree(sourceBlock) {
    system.runJob(fellTree(sourceBlock));
    world.playSound("mob.zombie.woodbreak", sourceBlock.location);
}

const regrowth_ability = {
    key: "regrowth",
    unlock_level: 5,
    enableTitle: false,
    description: (level) => {
        return [`${getChance(level)}%%`];
    },
};
const blocks = [
    "minecraft:dirt",
    "minecraft:grass",
    "minecraft:dirt_with_roots",
    "minecraft:podzol",
    "minecraft:mud",
    "minecraft:mycelium",
    "minecraft:moss_block",
];
const handleRegrowth = (block, sapling, level) => {
    if (block.isAir && blocks.includes(block.below()?.typeId || "")) {
        world.playSound("item.bone_meal.use", block.location, { volume: 3 });
        spawnParticle(block.dimension, block.center(), "pod_rpg:regrowth");
        system.runTimeout(() => {
            block.setPermutation(BlockPermutation.resolve(sapling.blockName, sapling.states));
            for (let i = 0; i < (level >= 4 ? 3 : level >= 2 ? 2 : 1); i++) {
                if (getChance(level) >= Math.random() * 100) {
                    block.dimension.spawnItem(new ItemStack("bone_meal", 1), block.location);
                }
            }
        }, 5);
    }
};
const getChance = (level) => {
    let value = 30;
    if (level >= 1)
        value += 10;
    if (level >= 3)
        value += 10;
    if (level >= 5)
        value += 10;
    return value;
};

const tree_cutting_skill = {
    key: "tree_cutting",
    primary_color: "§2",
    secondary_color: "§q",
    base_exp: 50,
    base_passive_chance: 1,
    playerBreakBlock: {
        disallowPlayerPlacedBlocks: true,
        //  item: {
        //     tags: ["minecraft:is_axe"],
        //   },
        onEvent: (event) => rewardBlockBreak(event),
    },
    playerSneak: {
        onEvent: (event, doubleClick) => {
            if (!event.isSneaking ||
                !getItemInSlot(event.player, EquipmentSlot.Mainhand)?.hasTag("minecraft:is_axe"))
                return;
            abilityActionBar$1(event.player, tree_cutting_skill, doubleClick, "Sneak");
            event.player.playSound("random.click");
            if (doubleClick) {
                triggerAbilityEvent.call({
                    player: event.player,
                    skill: tree_cutting_skill,
                    eventData: event,
                });
            }
        },
    },
    itemUse: {
        item: {
            tags: ["minecraft:is_axe"],
        },
        double_click: {
            useCommon: true,
        },
    },
    abilities: [regrowth_ability, tree_exp_ability, fell_tree_ability],
};
const rewardBlockBreak = (event) => {
    const { brokenBlockPermutation, player, block } = event;
    const reward = tree_cutting_rewards.find((v) => v.blocks.includes(brokenBlockPermutation.type.id));
    if (reward === undefined && !isLog(brokenBlockPermutation, false))
        return;
    //EXP REWARD
    addExp(player, tree_cutting_skill, reward?.exp || 5);
    //TREE FELLER ABILITY
    if (fell_tree_timer.has(player.name))
        handleFellTree(block);
    //EXPERIENCE ABILITY
    const selectedAbility = getSelectedAbility(player, tree_cutting_skill);
    if (selectedAbility) {
        const abilityLevel = getAbilityLevel(player, tree_cutting_skill, selectedAbility);
        switch (selectedAbility.key) {
            case "regrowth":
                if (!reward) {
                    if (brokenBlockPermutation.hasTag("pod_farm:wood")) {
                        const saplingId = brokenBlockPermutation.type.id
                            .replace("stripped_", "")
                            .replace("log", "tree_sapling")
                            .replace("wood", "tree_sapling");
                        let found = false;
                        for (let x = -1; x < 2; x++) {
                            for (let z = -1; z < 2; z++) {
                                const worldBlock = block.dimension.getBlock(addVector(block.location, { x, z }));
                                if (worldBlock === undefined)
                                    continue;
                                if (worldBlock.typeId === brokenBlockPermutation.type.id ||
                                    worldBlock.typeId === saplingId) {
                                    found = true;
                                    break;
                                }
                            }
                        }
                        if (!found)
                            handleRegrowth(block, {
                                blockName: saplingId,
                                states: {},
                            }, abilityLevel);
                    }
                    break;
                }
                if (reward.sapling)
                    handleRegrowth(block, reward.sapling, abilityLevel);
                break;
            case "tree_exp":
                if (selectedAbility.chance(abilityLevel) >= Math.random() * 100) {
                    for (let i = 0; i < (abilityLevel >= 4 ? 2 : 1); i++) {
                        player.dimension.spawnEntity("minecraft:xp_orb", addVector(block.location, { x: 0.5, y: 0.5, z: 0.5 }));
                    }
                }
                break;
        }
    }
    let item = reward?.item;
    //ITEM DROP
    if (!item) {
        item = brokenBlockPermutation.getItemStack()?.typeId;
    }
    if (!item)
        return;
    const chance = getLevel(player, tree_cutting_skill) *
        tree_cutting_skill.base_passive_chance;
    dropAdditionalItem(addVector(block.location, { x: 0.5, y: 0.5, z: 0.5 }), player.dimension, chance, item, 1);
};
function isLog(permutation, checkRewards = true) {
    if (checkRewards &&
        tree_cutting_rewards.some((v) => v.blocks.includes(permutation.type.id)))
        return true;
    if (settings.getValue("addon_integration") === false)
        return false;
    if (permutation.hasTag("pod_farm:wood"))
        return true;
    if (permutation.type.id.match("^(?!minecraft:).*_log$"))
        return true;
    return false;
}
const tree_cutting_rewards = [
    {
        blocks: ["minecraft:oak_log", "minecraft:stripped_oak_log"],
        item: "minecraft:oak_log",
        sapling: { blockName: "sapling", states: { sapling_type: "oak" } },
        exp: 5,
    },
    {
        blocks: ["minecraft:spruce_log", "minecraft:stripped_spruce_log"],
        item: "minecraft:spruce_log",
        sapling: { blockName: "sapling", states: { sapling_type: "spruce" } },
        exp: 5,
    },
    {
        blocks: ["minecraft:birch_log", "minecraft:stripped_birch_log"],
        item: "minecraft:birch_log",
        sapling: { blockName: "sapling", states: { sapling_type: "birch" } },
        exp: 5,
    },
    {
        blocks: ["minecraft:jungle_log", "minecraft:stripped_jungle_log"],
        item: "minecraft:jungle_log",
        sapling: { blockName: "sapling", states: { sapling_type: "jungle" } },
        exp: 5,
    },
    {
        blocks: ["minecraft:acacia_log", "minecraft:stripped_acacia_log"],
        item: "minecraft:acacia_log",
        sapling: { blockName: "sapling", states: { sapling_type: "acacia" } },
        exp: 5,
    },
    {
        blocks: ["minecraft:dark_oak_log", "minecraft:stripped_dark_oak_log"],
        item: "minecraft:dark_oak_log",
        sapling: { blockName: "sapling", states: { sapling_type: "dark_oak" } },
        exp: 5,
    },
    {
        blocks: ["minecraft:mangrove_log", "minecraft:stripped_mangrove_log"],
        item: "minecraft:mangrove_log",
        sapling: { blockName: "mangrove_propagule", states: {} },
        exp: 5,
    },
    {
        blocks: ["minecraft:mangrove_wood", "minecraft:stripped_mangrove_wood"],
        item: "minecraft:mangrove_wood",
        sapling: { blockName: "mangrove_propagule", states: {} },
        exp: 5,
    },
    {
        blocks: ["minecraft:cherry_log", "minecraft:stripped_cherry_log"],
        item: "minecraft:cherry_log",
        sapling: { blockName: "cherry_sapling", states: {} },
        exp: 5,
    },
    {
        blocks: ["minecraft:cherry_wood", "minecraft:stripped_cherry_wood"],
        item: "minecraft:cherry_wood",
        sapling: { blockName: "cherry_sapling", states: {} },
        exp: 5,
    },
    {
        blocks: ["minecraft:crimson_stem"],
        item: "minecraft:crimson_stem",
        exp: 5,
    },
    {
        blocks: ["minecraft:warped_stem"],
        item: "minecraft:warped_stem",
        exp: 5,
    },
];

const alchemy_absorption_ability = {
    key: "absorption",
    unlock_level: 15,
    enableTitle: false,
    description: function (level) {
        return [`${getCooldown$1(level)}`, `${getEffectCount(level)}`];
    },
};
const absorptionData = {};
world.afterEvents.effectAdd.subscribe((event) => {
    if (event.entity.typeId !== "minecraft:player")
        return;
    const selectedAbility = getSelectedAbility(event.entity, alchemy_skill);
    const typeId = event.effect.typeId.includes(":")
        ? event.effect.typeId
        : "minecraft:" + event.effect.typeId;
    if (selectedAbility?.key !== "absorption" ||
        !NEGATIVE_EFFECTS.includes(typeId))
        return;
    const level = getAbilityLevel(event.entity, alchemy_skill, selectedAbility);
    const recentlyAbsorbed = absorptionData[event.entity.id] || 0;
    if (recentlyAbsorbed >= getEffectCount(level))
        return;
    absorptionData[event.entity.id] = recentlyAbsorbed + 1;
    system.runTimeout(() => {
        event.entity.removeEffect(typeId);
    }, 3);
    system.runTimeout(() => (absorptionData[event.entity.id] = recentlyAbsorbed - 1), getCooldown$1(level) * 20);
    spawnParticle(event.entity.dimension, event.entity.location, "pod_rpg:absorption");
    event.entity.playSound("bucket.fill_powder_snow");
});
const getCooldown$1 = (level) => {
    let cooldown = 90;
    if (level >= 1)
        cooldown -= 10;
    if (level >= 3)
        cooldown -= 10;
    if (level >= 5)
        cooldown -= 10;
    return cooldown;
};
const getEffectCount = (level) => {
    let count = 1;
    if (level >= 2)
        count++;
    if (level >= 4)
        count++;
    return count;
};

const getCooldown = (level) => {
    let value = 90;
    if (level >= 1)
        value -= 15;
    if (level >= 3)
        value -= 15;
    return value;
};
const poisonAuraTimer = new TimerUtil();
const alchemy_poison_aura_ability = {
    key: "poison_aura",
    unlock_level: 5,
    enableTitle: true,
    cooldown: getCooldown,
    description: function (level) {
        return [
            `${getPoisonLevel(level) + 1}`,
            `${getPoisonDuration(level)}`,
            `${getDuration(level)}`,
        ];
    },
    onEnable(event) {
        poisonAuraTimer.set(event.player.name, getDuration(event.level) * 20);
        poisonAuraTimer.enableDisplay(event.player, () => {
            spawnParticle(event.player.dimension, event.player.location, "pod_rpg:poison_aura");
            return {
                rawtext: [
                    { text: "§p" },
                    ...getAbilityName(alchemy_poison_aura_ability),
                    {
                        text: ` ${((poisonAuraTimer.get(event.player.name) - system.currentTick) /
                            20).toFixed(1)}s`,
                    },
                ],
            };
        });
        ABILITY_TIMERS.setPlayer(event.player, getCooldown(event.level) * 20, event.skill);
    },
};
world.afterEvents.entityHurt.subscribe((event) => {
    if (event.hurtEntity.typeId === "minecraft:player" &&
        event.damageSource.damagingEntity &&
        poisonAuraTimer.has(event.hurtEntity.name)) {
        const level = getAbilityLevel(event.hurtEntity, alchemy_skill, alchemy_poison_aura_ability);
        event.damageSource.damagingEntity.addEffect(MinecraftEffectTypes.FatalPoison, getPoisonDuration(level) * 20, { amplifier: getPoisonLevel(level) });
    }
});
const getPoisonLevel = (level) => {
    let value = 0;
    if (level >= 2)
        value += 1;
    return value;
};
const getPoisonDuration = (level) => {
    let value = 15;
    if (level >= 4)
        value += 5;
    return value;
};
const getDuration = (level) => {
    let value = 20;
    if (level >= 5)
        value += 10;
    return value;
};

const POTION_ITEM_TYPES = [
    MinecraftItemTypes.Potion,
    MinecraftItemTypes.SplashPotion,
    MinecraftItemTypes.LingeringPotion,
];

const alchemy_iron_will_ability = {
    key: "iron_will",
    unlock_level: 30,
    enableTitle: false,
    description: function (level) {
        return [`${getDamageIncrease(level)}%%`];
    },
};
world.afterEvents.entityHurt.subscribe((event) => {
    const { hurtEntity, damageSource, damage } = event;
    if (damageSource.damagingEntity?.typeId !== "minecraft:player")
        return;
    const selectedAbility = getSelectedAbility(event.damageSource.damagingEntity, alchemy_skill);
    if (!selectedAbility || selectedAbility.key !== "iron_will")
        return;
    const level = getAbilityLevel(event.damageSource.damagingEntity, alchemy_skill, selectedAbility);
    const effects = event.damageSource
        .damagingEntity.getEffects()
        .filter((v) => NEGATIVE_EFFECTS.includes(v.typeId.includes(":") ? v.typeId : "minecraft:" + v.typeId));
    if (effects.length === 0)
        return;
    event.hurtEntity.dimension.playSound("armor.equip_chain", event.hurtEntity.location);
    spawnParticle(event.hurtEntity.dimension, event.hurtEntity.location, "pod_rpg:iron_will");
    const component = hurtEntity.getComponent(EntityHealthComponent.componentId);
    component.setCurrentValue(component.currentValue -
        damage * (getDamageIncrease(level) / 100) * effects.length);
    if (component.currentValue <= 0)
        rewardKill$1(damageSource.damagingEntity, hurtEntity);
});
const getDamageIncrease = (level) => {
    return 10 + level * 5;
};

const POSITIVE_EFFECTS = [
    MinecraftEffectTypes.Absorption,
    MinecraftEffectTypes.ConduitPower,
    MinecraftEffectTypes.FireResistance,
    MinecraftEffectTypes.Haste,
    MinecraftEffectTypes.HealthBoost,
    MinecraftEffectTypes.InstantHealth,
    MinecraftEffectTypes.Invisibility,
    MinecraftEffectTypes.JumpBoost,
    MinecraftEffectTypes.NightVision,
    MinecraftEffectTypes.Regeneration,
    MinecraftEffectTypes.Resistance,
    MinecraftEffectTypes.Saturation,
    MinecraftEffectTypes.SlowFalling,
    MinecraftEffectTypes.Speed,
    MinecraftEffectTypes.Strength,
    MinecraftEffectTypes.VillageHero,
    MinecraftEffectTypes.WaterBreathing,
];
const NEGATIVE_EFFECTS = [
    MinecraftEffectTypes.BadOmen,
    MinecraftEffectTypes.Blindness,
    MinecraftEffectTypes.Darkness,
    MinecraftEffectTypes.FatalPoison,
    MinecraftEffectTypes.Hunger,
    MinecraftEffectTypes.Infested,
    MinecraftEffectTypes.InstantDamage,
    MinecraftEffectTypes.Levitation,
    MinecraftEffectTypes.MiningFatigue,
    MinecraftEffectTypes.Nausea,
    MinecraftEffectTypes.Oozing,
    MinecraftEffectTypes.Poison,
    MinecraftEffectTypes.RaidOmen,
    MinecraftEffectTypes.Slowness,
    MinecraftEffectTypes.TrialOmen,
    MinecraftEffectTypes.Weakness,
    MinecraftEffectTypes.Weaving,
    MinecraftEffectTypes.WindCharged,
    MinecraftEffectTypes.Wither,
];
const alchemy_skill = {
    key: "alchemy",
    primary_color: "§m",
    secondary_color: "§n",
    base_exp: 50,
    base_passive_chance: 0.5,
    abilities: [
        alchemy_poison_aura_ability,
        alchemy_absorption_ability,
        alchemy_iron_will_ability,
    ],
    playerSneak: {
        onEvent: (event, doubleClick) => {
            if (!event.isSneaking ||
                !POTION_ITEM_TYPES.includes(getItemInSlot(event.player, EquipmentSlot.Mainhand)?.typeId || ""))
                return;
            abilityActionBar$1(event.player, alchemy_skill, doubleClick, "Sneak");
            event.player.playSound("random.click");
            if (doubleClick) {
                triggerAbilityEvent.call({
                    player: event.player,
                    skill: alchemy_skill,
                    eventData: event,
                });
            }
        },
    },
    itemUse: {
        item: { typeIds: ["minecraft:blaze_powder"] },
        double_click: {
            useCommon: true,
        },
    },
};
const noEvent = {};
world.afterEvents.effectAdd.subscribe((event) => {
    if (event.entity.typeId !== "minecraft:player")
        return;
    const typeId = event.effect.typeId.includes(":")
        ? event.effect.typeId
        : "minecraft:" + event.effect.typeId;
    const level = getLevel(event.entity, alchemy_skill);
    if (NEGATIVE_EFFECTS.includes(typeId)) {
        const newDuration = Math.max(event.effect.duration *
            (1 - (level * alchemy_skill.base_passive_chance) / 100), 1);
        const amplifier = event.effect.amplifier;
        const noEventArray = noEvent[event.entity.id] || [];
        if (noEventArray.includes(typeId)) {
            noEvent[event.entity.id] = noEventArray.filter((v) => v !== typeId);
            return;
        }
        noEvent[event.entity.id] = [...noEventArray, typeId];
        event.entity.removeEffect(typeId);
        event.entity.addEffect(typeId, newDuration, { amplifier: amplifier });
    }
    else if (POSITIVE_EFFECTS.includes(typeId)) {
        event.entity.addEffect(typeId, event.effect.duration *
            (1 + (level * alchemy_skill.base_passive_chance) / 100), { amplifier: event.effect.amplifier });
    }
    else {
        warn(`Couldn't determine if "${event.effect.typeId}" is a positive or negative effect.`);
    }
});

const VERSION = "2.0.2";
const VERSION_HISTORY = ["2.0.2", "2.0.1", "2.0.0", "1.0.8", "1.0.7"];
const skills = [
    alchemy_skill,
    archer_skill,
    blastmaster_skill,
    explorer_skill,
    farming_skill,
    fighting_skill,
    fishing_skill,
    hunting_skill,
    tree_cutting_skill,
    mining_skill,
    sorcery_skill,
    pyromaniac_skill,
];
const dimensions = [
    world.getDimension("overworld"),
    world.getDimension("nether"),
    world.getDimension("the_end"),
];

const chunks = [];
const isPlayerPlacedBlock = (location, permutation) => {
    if (settings.getValue("reduce_validations") === true)
        return false;
    const { x, y, z } = location;
    const chunkX = chunks[Math.floor(x / 50)];
    const chunkZ = chunkX?.[Math.floor(z / 50)];
    const layerY = chunkZ?.[y];
    const layerX = layerY?.[x];
    const registeredPermutation = layerX?.[z];
    if (registeredPermutation) {
        if (registeredPermutation === permutation)
            return true;
    }
    return false;
};
const setPlayerPlacedBlock = (block) => {
    if (settings.getValue("reduce_validations") === true)
        return;
    const { x, y, z } = block.location;
    chunks[Math.floor(x / 50)] ??= [];
    const chunkX = chunks[Math.floor(x / 50)];
    chunkX[Math.floor(z / 50)] ??= [];
    const chunkZ = chunkX[Math.floor(z / 50)];
    chunkZ[y] ??= [];
    const layerY = chunkZ[y];
    layerY[x] ??= [];
    const layerX = layerY[x];
    layerX[z] = block.permutation;
};

world.afterEvents.playerBreakBlock.subscribe((event) => {
    const { itemStackBeforeBreak } = event;
    const filteredSkills = skills.filter((skill) => skill.playerBreakBlock !== undefined);
    if (filteredSkills.length === 0)
        return;
    const isPlayerPlaced = isPlayerPlacedBlock(event.block.location, event.brokenBlockPermutation);
    for (const skill of filteredSkills) {
        if (!skill.playerBreakBlock.onEvent)
            continue;
        if (skill.playerBreakBlock.disallowPlayerPlacedBlocks && isPlayerPlaced)
            continue;
        if (!skill.playerBreakBlock.item) {
            skill.playerBreakBlock.onEvent(event);
            continue;
        }
        if (skill.playerBreakBlock.item && !itemStackBeforeBreak)
            continue;
        if ((skill.playerBreakBlock.item.tags &&
            skill.playerBreakBlock.item.tags.every((tag) => itemStackBeforeBreak.hasTag(tag))) ||
            (skill.playerBreakBlock.item.typeIds &&
                skill.playerBreakBlock.item.typeIds.includes(itemStackBeforeBreak.typeId))) {
            skill.playerBreakBlock.onEvent(event);
        }
    }
});

world.afterEvents.playerSpawn.subscribe((event) => {
    const { player, initialSpawn } = event;
    if (initialSpawn) {
        const version = player.getDynamicProperty("pod_rpg_version");
        if (version === undefined) {
            player.setDynamicProperty("pod_rpg_version", VERSION);
            if (player.hasTag("pod_rpg.receivedGuide")) {
                player.removeTag("pod_rpg.receivedGuide");
                player.sendMessage({
                    translate: "pod_rpg.announce_update",
                    with: [VERSION],
                });
                return;
            }
            player.dimension.spawnItem(new ItemStack("pod_rpg:guide"), player.location);
        }
        else if (version !== VERSION) {
            player.setDynamicProperty("pod_rpg_version", VERSION);
            player.sendMessage({
                translate: "pod_rpg.announce_update",
                with: [VERSION],
            });
        }
        if (player.hasTag("pod_rpg.disableMovement") &&
            player.runCommand("inputpermission set @s movement enabled")
                .successCount !== 0)
            player.removeTag("pod_rpg.disableMovement");
        if (player.hasTag("pod_rpg.customCamera") &&
            player.runCommand("camera @s clear").successCount !== 0)
            player.removeTag("pod_rpg.customCamera");
    }
});

const clicks = {};
world.afterEvents.itemUse.subscribe((event) => {
    const { itemStack, source } = event;
    if (itemStack.typeId === "pod_rpg:guide") {
        showMainUi(event.source);
        return;
    }
    const isDoubleClick = clicks[source.name] &&
        system.currentTick - clicks[source.name].tick <
            (settings.getValue("slower_double_click") === true ? 41 : 21) &&
        itemStack.typeId === clicks[source.name].item &&
        source.isSneaking === clicks[source.name].sneak;
    for (const skill of skills.filter((skill) => skill.itemUse !== undefined)) {
        if (!skill.itemUse.item ||
            (skill.itemUse.item.tags &&
                skill.itemUse.item.tags.every((tag) => itemStack.hasTag(tag))) ||
            (skill.itemUse.item.typeIds &&
                skill.itemUse.item.typeIds.includes(itemStack.typeId))) {
            const doubleClick = skill.itemUse.double_click?.useCommon
                ? common(skill)
                : skill.itemUse?.double_click;
            const action = source.isSneaking
                ? doubleClick?.sneak
                : doubleClick?.normal;
            if (action && action.onEvent)
                action.onEvent(event, isDoubleClick);
        }
    }
    clicks[source.name] = {
        tick: system.currentTick,
        item: itemStack.typeId,
        sneak: source.isSneaking,
    };
});
const common = (skill) => {
    return {
        sneak: {
            onEvent: (event, doubleClick) => {
                event.source.playSound("random.click");
                displayActionBar(event.source, {
                    rawtext: [
                        ...getSkillName(skill, skill.primary_color),
                        {
                            text: ` §8- §aClick §7- ${doubleClick ? "§a" : "§7"}Click §8- `,
                        },
                        { translate: "pod_rpg.common.open_menu" },
                    ],
                }, 1);
                if (doubleClick)
                    showSkillInfoPage(event.source, skill);
            },
        },
        normal: {
            onEvent: (event, doubleClick) => {
                //Check so player doesn't accidently use ability while trying to create farmland
                if (skill.key === "farming" && clicked_grass.has(event.source.id)) {
                    system.runTimeout(() => {
                        if (clicks[event.source.name])
                            clicks[event.source.name].item = undefined;
                    });
                    return;
                }
                event.source.playSound("random.click");
                abilityActionBar$1(event.source, skill, doubleClick, "Click");
                if (doubleClick) {
                    triggerAbilityEvent.call({
                        player: event.source,
                        skill: skill,
                        eventData: event,
                    });
                }
            },
        },
    };
};
//Check so player doesn't accidently use ability while trying to create farmland
const clicked_grass = new TimerUtil();
world.beforeEvents.itemUseOn.subscribe((event) => {
    if (["grass_block", "dirt", "dirt_with_roots", "grass_path"].includes(event.block.typeId))
        clicked_grass.set(event.source.id, 5);
});

system.afterEvents.scriptEventReceive.subscribe((event) => {
    const { sourceEntity } = event;
    switch (event.id.replace("pod_rpg:", "")) {
        //Functions for debugging
        case "clear_cooldown":
            ABILITY_TIMERS.cooldowns.clear();
            break;
        case "value":
            if (!sourceEntity)
                return;
            if (event.message === "max_out_all") {
                for (const skill of skills) {
                    sourceEntity.setDynamicProperty(`pod_rpg_${skill.key}_exp`, getExpRequiredForLevel(skill, 100));
                    for (const ability of skill.abilities) {
                        sourceEntity.setDynamicProperty(`pod_rpg_${skill.key}_${ability.key}`, 5);
                    }
                }
                return;
            }
            sourceEntity.setDynamicProperty("pod_rpg_" + event.message.split("=")[0], parseInt(event.message.split("=")[1]));
    }
});

world.afterEvents.playerPlaceBlock.subscribe((event) => {
    setPlayerPlacedBlock(event.block);
});

world.afterEvents.entitySpawn.subscribe((event) => {
    if (event.entity.isValid() && event.entity.typeId === "minecraft:arrow") {
        const entityResult = event.entity.dimension.getEntities({
            location: event.entity.location,
            maxDistance: 10,
            type: "minecraft:player",
        });
        if (entityResult.length !== 0) {
            entityResult
                .sort((p) => getDistance(p.location, event.entity.location))
                .reverse();
            if (event.entity.hasComponent(EntityProjectileComponent.componentId)) {
                const projectileComponent = event.entity.getComponent(EntityProjectileComponent.componentId);
                if (projectileComponent.owner?.typeId === "minecraft:player") {
                    playerShootArrowEvent.call({
                        player: projectileComponent.owner,
                        arrow: event.entity,
                    });
                }
            }
        }
    }
});

world.afterEvents.projectileHitBlock.subscribe((event) => {
    handleArrowImpact(event, "block"); //unregisters arrows from arrowRegistry
});

world.afterEvents.projectileHitEntity.subscribe((event) => {
    handleArrowImpact(event, "entity"); //unregisters arrows from arrowRegistry
});

const lastSneakData = {};
playerSneakEvent.subscribe((event) => {
    const doubleSneak = event.isSneaking &&
        lastSneakData[event.player.name] !== undefined &&
        event.tick - lastSneakData[event.player.name] <
            (settings.getValue("slower_double_click") === true ? 30 : 15);
    if (event.isSneaking)
        lastSneakData[event.player.name] = event.tick;
    for (const skill of skills.filter((skill) => skill.playerSneak?.onEvent !== undefined)) {
        skill.playerSneak.onEvent(event, doubleSneak);
    }
});

triggerAbilityEvent.subscribe((event) => {
    const { player, skill, eventData } = event;
    const ability = getSelectedAbility(player, skill);
    if (!ability || !ability.onEnable)
        return;
    if (ABILITY_TIMERS.has(player.id + skill.key + ability.key))
        return;
    if (ability.enableTitle)
        enableAbilityTitle(player, ability, skill.primary_color);
    ability.onEnable({
        player,
        skill,
        eventData,
        level: getAbilityLevel(player, skill, ability),
    });
});

const fishingHookRegistry = {};
let itemUsedLog = [];
world.beforeEvents.itemUse.subscribe((event) => {
    if (event.itemStack.typeId === MinecraftItemTypes.FishingRod) {
        itemUsedLog.push({ player: event.source, tick: system.currentTick });
    }
});
world.afterEvents.entitySpawn.subscribe((event) => {
    if (event.entity.typeId === MinecraftEntityTypes.FishingHook) {
        const tick = system.currentTick;
        let data;
        itemUsedLog = itemUsedLog.filter((v) => v.tick === tick);
        if (itemUsedLog.length === 0)
            return;
        data = itemUsedLog
            .sort((a, b) => getDistance(a.player.location, event.entity.location) -
            getDistance(b.player.location, event.entity.location))
            .shift();
        if (data) {
            data = {
                hook: event.entity,
                tickCasted: tick,
                player: data.player,
            };
            fishingHookRegistry[event.entity.id] = data;
            playerCastFishingHookEvent.call(data);
        }
    }
});
world.beforeEvents.entityRemove.subscribe((event) => {
    if (event.removedEntity.typeId === MinecraftEntityTypes.FishingHook) {
        const data = fishingHookRegistry[event.removedEntity.id];
        if (!data)
            return;
        if (!data.player.isValid())
            return;
        playerUncastFishingHookEvent.call(data);
        const items = event.removedEntity.dimension.getEntities({
            type: "minecraft:item",
            location: event.removedEntity.location,
            maxDistance: 2,
        });
        if (items.length === 0)
            return;
        const loot = [];
        for (const itemEntity of items) {
            const component = itemEntity.getComponent(EntityItemComponent.componentId);
            if (component === undefined ||
                !component.isValid() ||
                !compareVectors(event.removedEntity.location, itemEntity.location))
                continue;
            loot.push({
                entity: itemEntity,
                item: component.itemStack,
            });
        }
        if (loot.length > 0)
            playerFishSuccessfulEvent.call({ ...data, loot });
        delete fishingHookRegistry[event.removedEntity.id];
    }
});

const lookedAtBlocks = {};
system.runInterval(async () => {
    for (const player of PlayersInGame) {
        let previousBlock = lookedAtBlocks[player.id];
        if (previousBlock && !previousBlock.isValid()) {
            delete lookedAtBlocks[player.id];
            previousBlock = undefined;
        }
        const block = player.getBlockFromViewDirection({ maxDistance: 7 })?.block;
        if (previousBlock?.typeId !== block?.typeId ||
            (previousBlock && block && !compareVectors(previousBlock, block))) {
            playerBlockLookedAtChangeEvent.call({ block, previousBlock, player });
        }
        lookedAtBlocks[player.id] = block;
    }
}, 3);

const processStorage$1 = {};
playerBlockLookedAtChangeEvent.subscribe((event) => {
    if (processStorage$1[event.player.id])
        system.clearRun(processStorage$1[event.player.id]);
    if (event.block?.typeId !== MinecraftBlockTypes.EnchantingTable)
        return;
    let lapisLeftInventory = false;
    let enchantablesLeftInventory = [];
    let previousLevel = event.player.level;
    let lastContents = [];
    const runId = system.runInterval(() => {
        const contents = getInventoryContentsWithSlot(event.player);
        //Check for items that have left the inventory
        const missingItems = [];
        for (const previousItem of lastContents) {
            const currentItem = contents.find((v) => v.slotId === previousItem.slotId);
            if (currentItem === undefined) {
                missingItems.push(previousItem.item);
                continue;
            }
            if (previousItem.item.amount > currentItem.item.amount) {
                const missingItem = currentItem.item.clone();
                missingItem.amount = previousItem.item.amount - currentItem.item.amount;
                missingItems.push(missingItem);
            }
        }
        for (const item of missingItems) {
            if (!lapisLeftInventory && item.typeId === MinecraftItemTypes.LapisLazuli)
                lapisLeftInventory = true;
            const enchantable = item.getComponent(ItemEnchantableComponent.componentId);
            if (enchantable && enchantable.getEnchantments().length === 0)
                enchantablesLeftInventory.push(item);
        }
        //Check for exp changed
        if (lapisLeftInventory && enchantablesLeftInventory.length !== 0) {
            const levelDiff = event.player.level - previousLevel;
            if (levelDiff < 0 && levelDiff > -4) {
                playerEnchantItemEvent.call({
                    player: event.player,
                    enchantmentTable: event.block,
                    levelsConsumed: Math.abs(levelDiff),
                });
                log(`Player used ${Math.abs(levelDiff)} levels to enchant.`);
                enchantablesLeftInventory = [];
            }
        }
        previousLevel = event.player.level;
        lastContents = contents;
    }, 2);
    processStorage$1[event.player.id] = runId;
});

const processStorage = {};
playerBlockLookedAtChangeEvent.subscribe((event) => {
    const storedId = processStorage[event.player.id];
    if (processStorage[storedId]) {
        system.clearRun(storedId);
        delete processStorage[event.player.id];
    }
    if (event.block?.typeId === MinecraftBlockTypes.BrewingStand) {
        const blockInventory = event.block.getComponent(BlockInventoryComponent.componentId);
        const container = blockInventory.container;
        if (!container)
            return;
        const runId = system.runInterval(() => {
            for (let i = 1; i < 4; i++) {
                const item = container.getItem(i);
                if (!item ||
                    !POTION_ITEM_TYPES.includes(item.typeId) ||
                    item.getDynamicProperty("from_player") ||
                    item.getDynamicProperty("brewed"))
                    continue;
                item.setDynamicProperty("brewed", true);
                modifyItemInContainer(container, i, item);
            }
        }, 3);
        processStorage[event.player.id] = runId;
    }
});
system.runInterval(() => {
    for (const player of PlayersInGame) {
        const playerContainer = player.getComponent(EntityInventoryComponent.componentId).container;
        if (!playerContainer)
            return;
        for (const item of getInventoryContentsWithSlot(player)) {
            if (!POTION_ITEM_TYPES.includes(item.item.typeId))
                continue;
            if (item.item.getDynamicProperty("brewed")) {
                item.item.setDynamicProperty("brewed");
                addExp(player, alchemy_skill, 15);
            }
            item.item.setDynamicProperty("from_player", true);
            modifyItemInContainer(playerContainer, item.slotId, item.item);
        }
    }
}, 20);
world.afterEvents.itemCompleteUse.subscribe((event) => {
    if (event.itemStack.typeId === "minecraft:potion") {
        addExp(event.source, alchemy_skill, 3);
    }
});

const component = {
    onUse: (event) => {
        showCheatsMenu(event.source);
    },
};
function showCheatsMenu(player, ofPlayer = player) {
    const body = new RawtextBuilder();
    body.pushLine({ translate: "pod_rpg.ui.skills_cheat.body" });
    const buttons = [];
    buttons.push({
        text: { translate: `pod_rpg.ui.skills_cheat.reset_cooldowns` },
        action: () => {
            for (const skill of skills) {
                ABILITY_TIMERS.cooldowns.clear();
            }
            player.sendMessage({ translate: `pod_rpg.skills_cheat.reset_cooldowns` });
        },
    });
    for (const skill of skills) {
        buttons.push({
            text: { translate: `pod_rpg.skills.${skill.key}.name` },
            icon: `textures/podcrash/rpg/icons/skills/${skill.key}`,
            action: () => {
                showSkillSettingsPage(player, skill, ofPlayer);
            },
        });
    }
    //TODO possibly add player button
    showPage(player, ofPlayer
        ? { text: ofPlayer.name }
        : { translate: "pod_rpg.ui.skills_title" }, body.build(), buttons);
}
async function showSkillSettingsPage(player, skill, ofPlayer = player) {
    const form = new ModalFormData();
    form.title({
        translate: "pod_rpg.ui.skills_cheat.title",
        with: { rawtext: [{ translate: `pod_rpg.skills.${skill.key}.name` }] },
    });
    form.slider({
        translate: "pod_rpg.ui.skills_cheat.level",
        with: { rawtext: [{ translate: `pod_rpg.skills.${skill.key}.name` }] },
    }, 0, 100, 1, getLevel(ofPlayer, skill));
    for (const ability of skill.abilities) {
        form.slider({
            translate: "pod_rpg.ui.skills_cheat.level",
            with: {
                rawtext: [{ translate: `pod_rpg.abilities.${ability.key}.name` }],
            },
        }, 0, 5, 1, getAbilityLevel(ofPlayer, skill, ability));
    }
    form.submitButton({ translate: "pod_rpg.ui.skills_cheat.submit_button" });
    const response = await form.show(player);
    if (response.formValues === undefined) {
        player.sendMessage({ translate: `pod_rpg.skills_cheat.cancel` });
    }
    else {
        ofPlayer.setDynamicProperty(`pod_rpg_${skill.key}_exp`, getExpRequiredForLevel(skill, response.formValues[0]));
        for (let i = 0; i < skill.abilities.length; i++) {
            player.setDynamicProperty(`pod_rpg_${skill.key}_${skill.abilities[i].key}`, response.formValues[i + 1]);
        }
        player.sendMessage({ translate: `pod_rpg.skills_cheat.confirm` });
    }
}

world.beforeEvents.worldInitialize.subscribe((event) => {
    event.itemComponentRegistry.registerCustomComponent("pod_rpg:skills_cheat", component);
});

const playerSneakData = {};
const playerJumpData = {};
addonInstallEvent.subscribe((event) => {
    if (event.namespace === "pod_farm") {
        animals.push(...pod_farm_animal_definitions);
    }
});
async function eventHandler() {
    for (const player of PlayersInGame) {
        if (playerSneakData[player.name] === undefined ||
            playerSneakData[player.name] !== player.isSneaking) {
            playerSneakEvent.call({
                player: player,
                isSneaking: player.isSneaking,
                tick: system.currentTick,
            });
            playerSneakData[player.name] = player.isSneaking;
        }
        if (system.currentTick % 1 === 0) {
            const jumpData = playerJumpData[player.name];
            if (!jumpData || jumpData.jumping !== player.isJumping) {
                playerJumpEvent.call({
                    player: player,
                    isJumping: player.isJumping,
                    lastJump: jumpData?.lastJump,
                    tick: system.currentTick,
                });
                playerJumpData[player.name] = {
                    jumping: player.isJumping,
                    lastJump: player.isJumping
                        ? system.currentTick
                        : jumpData?.lastJump || 0,
                };
            }
        }
    }
}
//SETUP
system.runTimeout(async () => {
    await setup();
    system.runInterval(async () => eventHandler());
    system.runInterval(async () => removeAnimalRadar(), 20);
    system.runInterval(async () => handlePlayerEffects(), 10);
}, 100);
const removeAnimalRadar = async () => {
    for (const entity of world
        .getDimension("overworld")
        .getEntities({ type: "pod_rpg:animal_radar" })) {
        if (entity.dimension.getPlayers({
            location: entity.location,
            maxDistance: 30,
        }).length === 0)
            entity.remove();
    }
};
const handlePlayerEffects = async () => {
    for (const player of world.getPlayers({ tags: ["pod_rpg.slowFalling"] })) {
        if (player.isOnGround || player.isGliding) {
            player.removeEffect("slow_falling");
            player.removeTag("pod_rpg.slowFalling");
        }
    }
    for (const player of world.getPlayers({
        tags: ["pod_rpg.fireResistance"],
    })) {
        if (!["minecraft:magma", "minecraft:lava", "minecraft:flowing_lava"].includes(player.dimension.getBlock(player.location)?.below()?.typeId || "")) {
            player.removeEffect("fire_resistance");
            player.removeTag("pod_rpg.fireResistance");
        }
    }
};
const setup = async () => {
    log("Setup");
    pingAll();
    //Skill Events
    for (const skill of skills) {
        if (skill.tick && skill.tick.onTick) {
            system.runInterval(skill.tick.onTick, skill.tick.interval);
        }
        if (skill.playerJump && skill.playerJump.onEvent) {
            playerJumpEvent.subscribe(skill.playerJump.onEvent);
        }
        if (skill.playerShootArrow && skill.playerShootArrow.onEvent) {
            playerShootArrowEvent.subscribe(skill.playerShootArrow.onEvent);
        }
        if (skill.entityDie && skill.entityDie.onEvent) {
            world.afterEvents.entityDie.subscribe(skill.entityDie.onEvent);
        }
        if (skill.entityHurt && skill.entityHurt.onEvent) {
            world.afterEvents.entityHurt.subscribe(skill.entityHurt.onEvent);
        }
        if (skill.itemUseOn?.after && skill.itemUseOn?.after.onEvent) {
            world.afterEvents.itemUseOn.subscribe(skill.itemUseOn.after.onEvent);
        }
        if (skill.itemUseOn?.before && skill.itemUseOn?.before.onEvent) {
            world.beforeEvents.itemUseOn.subscribe(skill.itemUseOn.before.onEvent);
        }
        if (skill.itemCompleteUse && skill.itemCompleteUse.onEvent) {
            world.afterEvents.itemCompleteUse.subscribe(skill.itemCompleteUse.onEvent);
        }
        if (skill.projectileHit?.block && skill.projectileHit.block.onEvent) {
            world.afterEvents.projectileHitBlock.subscribe(skill.projectileHit.block.onEvent);
        }
        if (skill.projectileHit?.entity && skill.projectileHit.entity.onEvent) {
            world.afterEvents.projectileHitEntity.subscribe(skill.projectileHit.entity.onEvent);
        }
    }
};

world.afterEvents.entityDie.subscribe((event) => {
    if (event.deadEntity.typeId === "minecraft:player") {
        const player = event.deadEntity;
       
        system.run(() => {
            player.clearDynamicProperties();
        });
    }
});

// // Função para verificar o nível de combate do jogador e aplicar o efeito de velocidade
// function checkCombatLevelAndApplySpeed(player) {
//     const combatLevel = getLevel(player, fighting_skill);
//     if (combatLevel >= 1) {
//         player.addEffect(MinecraftEffectTypes.Speed, 999999, {
//             amplifier: 200, // Nível 1 de velocidade
//             showParticles: false
//         });
//     } else {
//         player.removeEffect(MinecraftEffectTypes.Speed);
//     }
// }

// // Verificar o nível de combate e aplicar o efeito de velocidade quando o jogador entrar no jogo
// world.afterEvents.playerSpawn.subscribe((event) => {
//     const { player, initialSpawn } = event;
//     if (initialSpawn) {
//         checkCombatLevelAndApplySpeed(player);
//     }
// });

// // Verificar o nível de combate e aplicar o efeito de velocidade periodicamente
// system.runInterval(() => {
//     for (const player of PlayersInGame) {
//         checkCombatLevelAndApplySpeed(player);
//     }
// }, 100); // Verificar a cada 5 segundos (100 ticks)


export { eventHandler };
