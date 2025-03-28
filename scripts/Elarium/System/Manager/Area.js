import { world } from "@minecraft/server";

export class AreaMonitor {
    static #regions = new Map();
    static #playerStates = new WeakMap();
    static #checkInterval = 20; // Ticks entre verificações (1 segundo)
    static #reusableVector = { x: 0, y: 0, z: 0 };

    /**
     * Adiciona uma região para monitoramento
     * @param {string} name - Nome único da região
     * @param {Object} area - { minX, maxX, minZ, maxZ, dimension? }
     * @param {Function} onEnter - Callback quando jogador entra
     * @param {Function} onExit - Callback quando jogador sai
     */
    static addRegion(name, area, onEnter, onExit) {
        this.#regions.set(name, {
            area: {
                ...area,
                dimension: area.dimension || "overworld"
            },
            onEnter,
            onExit
        });
    }

    /**
     * Inicia o monitoramento de áreas
     */
    static init() {
        let tickCount = 0;
        
        world.events.tick.subscribe(() => {
            if (tickCount++ % this.#checkInterval !== 0) return;

            const players = world.getPlayers();
            for (const player of players) {
                this.#checkPlayerRegions(player);
            }
        });
    }

    static #checkPlayerRegions(player) {
        const currentRegions = new Set();
        const position = Object.assign(this.#reusableVector, player.location);
        
        for (const [name, region] of this.#regions) {
            if (this.#isInRegion(position, region.area)) {
                currentRegions.add(name);
                this.#handleRegionEvent(player, name, region.onEnter, 'enter');
            }
        }

        const previousRegions = this.#playerStates.get(player) || new Set();
        this.#handleExitedRegions(player, previousRegions, currentRegions);
        this.#playerStates.set(player, currentRegions);
    }

    static #isInRegion(pos, area) {
        return pos.dimension.id === area.dimension &&
               pos.x >= area.minX && pos.x <= area.maxX &&
               pos.z >= area.minZ && pos.z <= area.maxZ;
    }

    static #handleRegionEvent(player, regionName, callback, type) {
        const lastState = this.#playerStates.get(player);
        if (!lastState || !lastState.has(regionName)) {
            callback(player, regionName);
            // Logger.debug(`${player.name} ${type} ${regionName}`);
        }
    }

    static #handleExitedRegions(player, previous, current) {
        for (const regionName of previous) {
            if (!current.has(regionName)) {
                const region = this.#regions.get(regionName);
                region.onExit(player, regionName);
                // Logger.debug(`${player.name} exit ${regionName}`);
            }
        }
    }
}

// // Uso:
// AreaMonitor.addRegion(
//     'spawn',
//     {
//         minX: -10,
//         maxX: 10,
//         minZ: -10,
//         maxZ: 10,
//         dimension: 'overworld'
//     },
//     (player) => player.sendMessage("Bem-vindo ao spawn!"),
//     (player) => player.sendMessage("Você saiu do spawn!")
// );

// AreaMonitor.addRegion(
//     'arena',
//     {
//         minX: 100,
//         maxX: 200,
//         minZ: -50,
//         maxZ: 50
//     },
//     (player) => player.addEffect("strength", 10),
//     (player) => player.removeEffect("strength")
// );

// // Inicializa o sistema
// AreaMonitor.init();