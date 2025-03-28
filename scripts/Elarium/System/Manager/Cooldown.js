export class CooldownManager {
    static #cooldowns = new Map(); // Estrutura: Map<playerId, Map<abilityName, endTime>>
    
    static #weaponCooldown = new Map(); // Estrutura: Map<playerId, Map<abilityName, endTime>>

    /**
     * Define um cooldown para uma habilidade específica do jogador
     * @param {number} atkspeed - Nome da habilidade
     * @param {number} haste - Tempo de cooldown em milissegundos
     * @param {number} miningFatigue - Tempo de cooldown em milisseg
     */
    static getCooldownWeapon(atkspeed, haste, miningFatigue) {
        const key = this.#buildKey(atkspeed, haste, miningFatigue);
        return this.#weaponCooldown.get(key)|| new Map();
    }

    /**
     * Define um cooldown para uma habilidade específica do jogador
     * @param {number} atkspeed - Nome da habilidade
     * @param {number} haste - Tempo de cooldown em milissegundos
     * @param {number} miningFatigue - Tempo de cooldown em milisseg
     * @param {object} cooldown Chave única para o cooldown
     */
     static setCooldownWeapon(atkspeed, haste, miningFatigue, cooldown) {
        const key = this.#buildKey(atkspeed, haste, miningFatigue);

        this.#weaponCooldown.set(key, cooldown);
    }

    static #buildKey(atkspeed, haste, miningFatigue) {
        return `${atkspeed}-${haste}-${miningFatigue}`;
    }

    /**
     * Define um cooldown para uma habilidade específica do jogador
     * @param {string} playerId - ID do jogador

     * @param {string} abilityName - Nome da habilidade
     * @param {number} cooldownMs - Tempo de cooldown em milissegundos
     */
    static setCooldown(playerId, abilityName, cooldownMs) {
        const playerCooldowns = this.#cooldowns.get(playerId) || new Map();
        playerCooldowns.set(abilityName, Date.now() + cooldownMs);
        this.#cooldowns.set(playerId, playerCooldowns);
    }

    /**
     * Verifica se uma habilidade está em cooldown
     * @param {string} playerId - ID do jogador
     * @param {string} abilityName - Nome da habilidade
     * @returns {boolean} True se a habilidade estiver em cooldown, False caso contrário
     */
    static isOnCooldown(playerId, abilityName) {
        const playerCooldowns = this.#cooldowns.get(playerId);
        if (!playerCooldowns) return false;
        
        const endTime = playerCooldowns.get(abilityName);
        return endTime ? endTime > Date.now() : false;
    }

    /**
     * Tenta usar uma habilidade, verificando e aplicando o cooldown automaticamente
     * @param {string} playerId - ID do jogador
     * @param {string} abilityName - Nome da habilidade
     * @param {number} cooldownMs - Tempo de cooldown em milissegundos
     * @returns {boolean} True se a habilidade pode ser usada, False se estiver em cooldown
     */
    static tryUseAbility(playerId, abilityName, cooldownMs) {
        if (this.isOnCooldown(playerId, abilityName)) {
            return false;
        }
        
        this.setCooldown(playerId, abilityName, cooldownMs);
        return true;
    }
}