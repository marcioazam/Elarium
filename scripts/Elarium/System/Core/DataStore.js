import { DimensionWrapper, DimensionTypeEnum } from "../Class/Dimension.js";

export class DataStore {
    static savePlayerData(playerId, data) {
        const player = [...world.getPlayers()].find(p => p.id === playerId);
        if (player) {
            player.setDynamicProperty("playerData", JSON.stringify(data));
        }
    }

    static loadPlayerData(playerId) {
        const player = [...world.getPlayers()].find(p => p.id === playerId);
        return player ? JSON.parse(player.getDynamicProperty("playerData") || "{}") : {};
    }

    static async saveToFile(filename, data) {
        // Requer suporte a filesystem (ex: em add-ons)
        const fs = require('fs');
        fs.writeFileSync(filename, JSON.stringify(data));
    }
}

// Uso:
// DataStore.savePlayerData("player123", { level: 5, coins: 100 });