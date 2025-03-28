export const EffectType = Object.freeze({
    SPEED: "speed",
    SLOWNESS: "slowness",
    HASTE: "haste",
    MINING_FATIGUE: "mining_fatigue",
    STRENGTH: "strength",
    INSTANT_HEALTH: "instant_health",
    INSTANT_DAMAGE: "instant_damage",
    JUMP_BOOST: "jump_boost",
    NAUSEA: "nausea",
    REGENERATION: "regeneration",
    RESISTANCE: "resistance",
    FIRE_RESISTANCE: "fire_resistance",
    WATER_BREATHING: "water_breathing",
    INVISIBILITY: "invisibility",
    BLINDNESS: "blindness",
    NIGHT_VISION: "night_vision",
    HUNGER: "hunger",
    WEAKNESS: "weakness",
    POISON: "poison",
    WITHER: "wither",
    HEALTH_BOOST: "health_boost",
    ABSORPTION: "absorption",
    SATURATION: "saturation",
    LEVITATION: "levitation",
    FATAL_POISON: "fatal_poison",
    CONDUIT_POWER: "conduit_power",
    SLOW_FALLING: "slow_falling",
    BAD_OMEN: "bad_omen",
    HERO_OF_THE_VILLAGE: "hero_of_the_village",
    DARKNESS: "darkness"
});


export class EffectWrapper {
    constructor(effect, amplifier, duration) {
        /** @type {EffectType} */
        this.effect = effect;
        /** @type {number} */
        this.amplifier = amplifier;
        /** @type {number} */
        this.duration = duration;
        /** @type {Date} */
        this.initDate = new Date();
    }
}