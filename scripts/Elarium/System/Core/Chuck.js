import { world } from "@minecraft/server";
import { Logger } from "../Helper/Log.js";
import { DimensionWrapper, DimensionTypeEnum } from "../Class/Dimension.js";

export class ChunkPool {
    // Mapa para armazenar chunks carregados
    static #pool = new Map();

    // Tempo máximo de inatividade para descarregar chunks (em milissegundos)
    static #MAX_INACTIVE_TIME = 900_000; // 15 minutos

    /**
     * Carrega um chunk ou retorna o chunk já carregado.
     * @param {number} x - Coordenada X do chunk.
     * @param {number} z - Coordenada Z do chunk.
     * @param {DimensionWrapper} dimension - Objeto da dimensão.
     * @returns {Block} O bloco de referência do chunk.
     */
    static loadChunk(x, z, dimension = DimensionWrapper.getDimension()) {
        try {
            // Validação de inputs
            if (typeof x !== "number" || typeof z !== "number") {
                throw new TypeError("Coordenadas do chunk devem ser números.");
            }
            if (!dimension || !dimension.id) {
                throw new TypeError("Dimensão inválida.");
            }

            const key = `${x},${z},${dimension.id}`;

            // Verifica se o chunk já está carregado
            if (!this.#pool.has(key)) {
                const dimensionObj = world.getDimension(dimension.id);
                if (!dimensionObj) {
                    throw new Error(`Dimensão ${dimension.id} não encontrada.`);
                }

                const block = dimensionObj.getBlock({ x: x * 16, y: 0, z: z * 16 });
                if (!block) {
                    throw new Error(`Falha ao carregar chunk [${x}, ${z}].`);
                }

                this.#pool.set(key, {
                    block,
                    lastAccess: Date.now()
                });

                Logger.info(`Chunk [${x}, ${z}] carregado na dimensão ${dimension.id}.`);
            } else {
                // Atualiza o tempo de acesso
                this.#pool.get(key).lastAccess = Date.now();
            }

            return this.#pool.get(key).block;
        } catch (error) {
            Logger.error(`Erro ao carregar chunk [${x}, ${z}]: ${error.message}`);
            throw error;
        }
    }

    /**
     * Remove um chunk do pool.
     * @param {number} x - Coordenada X do chunk.
     * @param {number} z - Coordenada Z do chunk.
     * @param {DimensionWrapper} dimension - Objeto da dimensão.
     */
    static unloadChunk(x, z, dimension = DimensionWrapper.getDimension()) {
        const key = `${x},${z},${dimension.id}`;
        if (this.#pool.has(key)) {
            this.#pool.delete(key);
            Logger.info(`Chunk [${x}, ${z}] descarregado da dimensão ${dimension.id}.`);
        }
    }

    /**
     * Limpa todos os chunks do pool.
     */
    static clearPool() {
        this.#pool.clear();
        Logger.info("Pool de chunks limpo.");
    }

    /**
     * Verifica se um chunk está carregado.
     * @param {number} x - Coordenada X do chunk.
     * @param {number} z - Coordenada Z do chunk.
     * @param {DimensionWrapper} dimension - Objeto da dimensão.
     * @returns {boolean} True se o chunk estiver carregado, caso contrário, false.
     */
    static isChunkLoaded(x, z, dimension = DimensionWrapper.getDimension()) {
        const key = `${x},${z},${dimension.id}`;
        return this.#pool.has(key);
    }

    /**
     * Lista todos os chunks atualmente carregados.
     * @returns {Array<{ x: number, z: number, dimension: string }>} Lista de chunks carregados.
     */
    static listLoadedChunks() {
        return Array.from(this.#pool.keys()).map(key => {
            const [x, z, dimension] = key.split(",");
            return { x: parseInt(x), z: parseInt(z), dimension };
        });
    }

    /**
     * Descarrega chunks inativos automaticamente.
     */
    static cleanupInactiveChunks() {
        const now = Date.now();
        for (const [key, { lastAccess }] of this.#pool.entries()) {
            if (now - lastAccess > this.#MAX_INACTIVE_TIME) {
                const [x, z, dimension] = key.split(",");
                this.unloadChunk(parseInt(x), parseInt(z), DimensionWrapper.getDimension(dimension));
            }
        }
    }
}