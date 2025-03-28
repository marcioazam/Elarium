import { world, system, Entity, Dimension, Player } from "@minecraft/server";
import { EntityWrapper } from "../Class/Entity";
import { WorldWrapper } from "../Class/World";
import { Analisys } from "../Core/Analisy.js";
import { DimensionTypeEnum, DimensionWrapper } from "../Class/Dimension.js";
import { Logger } from "../Helper/Log.js";

/**
 * Mapa global para armazenamento de entidades rastreadas
 * @type {Map<String, EntityWrapper>}
 */
const EntitiesInGame = new Map();

const TagIndex = new Map(); // {tag: Set<entityId>}
const DimensionTagIndex = new Map(); // {dimensionId: {tag: Set<entityId>}}
const DimensionTypeIndex = new Map();

/**
 * Classe estática para gerenciamento centralizado de entidades no jogo.
 * @class
 */
export class EntityManager {
  constructor() {
    throw new Error(
      "EntityManager é uma classe estática e não pode ser instanciada."
    );
  }

  /**
   * Filtra entidades de forma segura, garantindo validade e aplicando um predicado.
   * @private
   * @param {function(EntityWrapper): boolean} predicate - Função de filtragem.
   * @returns {EntityWrapper[]} Lista de entidades que atendem ao predicado.
   */
  static #filterEntities(predicate) {
    return [...EntitiesInGame.values()]
      .filter((wrapper) => wrapper?.isValid?.() && predicate(wrapper))
      .map((wrapper) => wrapper);
  }

  /**
   * Retorna o número total de entidades rastreadas.
   * @returns {number} Quantidade de entidades no cache.
   */
  static countEntities() {
    return EntitiesInGame.size;
  }

  /**
   * Retorna todos os jogadores rastreados.
   * @returns {EntityWrapper[]} Lista de wrappers de jogadores válidos.
   */
  static getPlayers() {
    return this.#filterEntities((wrapper) => wrapper.isPlayer);
  }

  /**
   * Retorna todos os animais rastreados.
   * @returns {EntityWrapper[]} Lista de wrappers de animais válidos.
   */
  static getAnimals() {
    return this.#filterEntities((wrapper) => wrapper.isAnimal);
  }

  /**
   * Retorna todos os mobs hostis rastreados.
   * @returns {EntityWrapper[]} Lista de wrappers de mobs válidos.
   */
  static getMobs() {
    return this.#filterEntities((wrapper) => wrapper.isMob);
  }

  /**
   * Busca entidades com base em critérios avançados.
   * @param {Object} [filters={}] - Filtros de busca.
   * @param {import("@minecraft/server").Vector3} [filters.location] - Localização central.
   * @param {number} [filters.maxDistance] - Raio máximo de busca.
   * @param {string[]} [filters.families] - Tipos de entidades (player, mob, animal).
   * @param {DimensionTypeEnum} [filters.dimensionId] - Dimensão alvo.
   * @returns {EntityWrapper[]} Lista de entidades que atendem aos critérios.
   */
  static getEntities(filters = {}) {
    const {
      location,
      maxDistance,
      families = [],
      dimensionId = DimensionTypeEnum.OVERWORLD,
    } = filters;

    return this.#filterEntities((wrapper) => {
      // Filtro de dimensão
      if (dimensionId && wrapper.dimensionId !== dimensionId) return false;

      // Filtro de família
      if (families.length > 0) {
        const familyMatch = families.some((family) => {
          switch (family.toLowerCase()) {
            case "player":
              return wrapper.isPlayer;
            case "mob":
              return wrapper.isMob;
            case "animal":
              return wrapper.isAnimal;
            default:
              return false;
          }
        });
        if (!familyMatch) return false;
      }

      // Filtro de distância
      if (location && maxDistance > 0) {
        const dx = wrapper.entity.location.x - location.x;
        const dy = wrapper.entity.location.y - location.y;
        const dz = wrapper.entity.location.z - location.z;

        return dx * dx + dy * dy + dz * dz <= maxDistance * maxDistance;
      }

      return true;
    });
  }

  /**
   * Retorna todas as entidades de uma dimensão específica.
   * @param {Dimension} dimension - Dimensão alvo.
   * @returns {EntityWrapper[]} Lista de entidades na dimensão.
   */
  static getByDimension(dimension) {
    return this.#filterEntities(
      (wrapper) => dimension?.id === wrapper.dimensionId
    );
  }

  /**
   * Atualiza índices de tags com debug detalhado
   * @param {EntityWrapper} wrapper - Entidade a ser indexada
   * @param {string[]} oldTags - Tags anteriores (para remoção)
   */
  static UpdateIndexes(wrapper, oldTags = []) {
    if (!wrapper) {
      return;
    }

    if (!wrapper.isValid()) {
      return;
    }

    if(WorldWrapper.BloodMoon == true){
      wrapper.entity.addTag("blood_moon");
    }
    else{
      wrapper.entity.removeTag("blood_moon");
    }

    const tagsAtualizadas = wrapper.entity.getTags();

    const entityId = wrapper.entity.id;
    const dimensionId = wrapper.dimensionId;

    // Verifica e converte tags antigas
    const oldTagsSet = new Set(Array.isArray(oldTags) ? oldTags : []);

    // Remoção dos índices antigos
    let removedFromGlobal = 0;
    let removedFromDimension = 0;

    oldTagsSet.forEach((tag) => {
      // Remoção do índice global
      if (TagIndex.get(tag)?.delete(entityId)) {
        removedFromGlobal++;
      }

      // Remoção do índice por dimensão
      const dimTags = DimensionTagIndex.get(dimensionId);
      if (dimTags?.get(tag)?.delete(entityId)) {
        removedFromDimension++;
      }
    });

    // Atualização com novas tags
    let addedToGlobal = 0;
    let addedToDimension = 0;

    tagsAtualizadas.forEach((tag) => {
      // Índice global
      if (!TagIndex.has(tag)) {
        TagIndex.set(tag, new Set());
      }
      TagIndex.get(tag).add(entityId);
      addedToGlobal++;

      // Índice por dimensão
      if (!DimensionTagIndex.has(dimensionId)) {
        DimensionTagIndex.set(dimensionId, new Map());
      }

      const dimTags = DimensionTagIndex.get(dimensionId);
      if (!dimTags.has(tag)) {
        dimTags.set(tag, new Set());
      }

      dimTags.get(tag).add(entityId);
      addedToDimension++;
    });

    wrapper.tags = new Set(tagsAtualizadas);
  }


/**
 * Retorna entidades que possuem pelo menos uma das tags especificadas.
 * @return {EntityWrapper[]}  - Lista de entidades que possuem qualquer das tags
 */
static getEntitiesByTags(dimension, tags) {
  if (!dimension || !tags?.length) {
    return [];
  }

  const dimensionId = dimension.id;
  const results = new Set(); // Agora armazenará entidades que têm pelo menos uma das tags

  // Consulta indexada
  for (const tag of tags) {
    const dimensionTags = DimensionTagIndex.get(dimensionId);
    if (!dimensionTags) {
      continue; // Apenas pula a tag se não existir, não cancela a busca
    }

    const entityIds = dimensionTags.get(tag);
    if (!entityIds) {
      continue;
    }

    // Adiciona todas as entidades desse conjunto ao resultado (união)
    entityIds.forEach((id) => results.add(id));
  }

  // Converte para wrappers
  const matchingEntities = [];

  results.forEach((id) => {
    const wrapper = EntitiesInGame.get(id);
    if (wrapper?.isValid()) {
      matchingEntities.push(wrapper);
    }
  });

  return matchingEntities;
}

/**
 * Retorna entidades que possuem um determinado typeId dentro de uma dimensão.
 * @param {Dimension} dimension - Dimensão onde buscar.
 * @param {string} typeId - O `typeId` da entidade que estamos procurando.
 * @returns {EntityWrapper[]} - Lista de entidades encontradas.
 */
static getEntitiesByType(dimension, typeId) {
  if (!dimension || !typeId) {
    return [];
  }

  const dimensionId = dimension.id;
  const results = new Set();

  // Verifica se existe um índice de entidades para essa dimensão
  const dimensionEntities = DimensionTypeIndex.get(dimensionId);
  if (!dimensionEntities) {
    return [];
  }

  // Obtém a lista de entidades desse tipo na dimensão
  const entityIds = dimensionEntities.get(typeId);
  if (!entityIds) {
    return [];
  }

  // Adiciona todas as entidades encontradas ao resultado
  entityIds.forEach((id) => results.add(id));

  // Converte IDs em EntityWrapper
  const matchingEntities = [];
  results.forEach((id) => {
    const wrapper = EntitiesInGame.get(id);
    if (wrapper?.isValid()) {
      matchingEntities.push(wrapper);
    }
  });

  return matchingEntities;
}


}

/**
 * Atualiza o registro de uma entidade no mapa
 * @param {Map<string, EntityWrapper>} entityMap - Mapa de entidades
 * @param {Entity} entity - Entidade Minecraft
 * @param {Dimension} dimension - Dimensão da entidade
 * @param {boolean} isPlayer - Indica se é um jogador
 */
function UpdateEntityMap(entityMap, entity, dimension, isPlayer) {
  try {
    if (!entity?.isValid()) {
      entityMap.delete(entity.id);
      return;
    }

    const existing = entityMap.get(entity.id);

    if (existing) {
      // Atualização segura de entidade existente
      if (existing.isValid()) {
        existing.entity = entity; // Mantém a mesma instância do wrapper
        existing.dimension = dimension; // Atualiza dimensão
        existing.dimensionId = dimension.id; // Atualiza ID da dimensão
        existing.isPlayer = isPlayer; // Atualiza status de jogador
        existing.tags = new Set(entity.getTags()); // Atualiza tags
        EntityManager.UpdateIndexes(existing, existing.tags);
      } else {
        entityMap.delete(entity.id); // Limpeza de entidades inválidas
      }
    } else {
      // Criação de novo wrapper com verificação de tipo
      var entityWrapper = new EntityWrapper(entity, dimension, isPlayer);
      entityMap.set(entity.id, entityWrapper);

      // 🟡 Atualiza o índice de entidades por `typeId` na dimensão
    const dimensionId = dimension.id;
    if (!DimensionTypeIndex.has(dimensionId)) {
      DimensionTypeIndex.set(dimensionId, new Map());
    }

    const typeIndex = DimensionTypeIndex.get(dimensionId);
    if (!typeIndex.has(entity.typeId)) {
      typeIndex.set(entity.typeId, new Set());
    }

    typeIndex.get(entity.typeId).add(entity.id);
    }
  } catch (error) {
    Logger.error(`Erro na atualização: ${error} - ${error.stack}`);
  }
}

/**
 * Adiciona/atualiza entidade com verificações de segurança
 * @param {Entity} entity - Entidade a ser processada
 */
function verifyAndAdd(entity) {
  try {
    if (!entity?.isValid()) return;

    // Verificação redundante de tipo
    const isPlayer =
      entity instanceof Player && entity.typeId === "minecraft:player";

    UpdateEntityMap(EntitiesInGame, entity, entity.dimension, isPlayer);
  } catch (error) {
    Logger.error(`Falha crítica: ${error}`);
  }
}

// Sistema de eventos otimizado
world.afterEvents.entitySpawn.subscribe(({ entity }) => {
  system.runTimeout(() => {
    verifyAndAdd(entity);
  }, 3); // Delay para inicialização completa
});

world.afterEvents.playerSpawn.subscribe(({ player }) => {
  system.runTimeout(() => {
    verifyAndAdd(player);
  }, 3); // Prioridade para jogadores
});

world.afterEvents.playerLeave.subscribe(({ playerId }) => {
  const wrapper = EntitiesInGame.get(playerId);

  if (wrapper) {
    EntityManager.UpdateIndexes(wrapper, [...wrapper.tags]);
  }

  EntitiesInGame.delete(playerId); // Remoção imediata
});

world.afterEvents.entityRemove.subscribe(({ removedEntityId }) => {
  const wrapper = EntitiesInGame.get(removedEntityId);
  if (wrapper) {
    EntityManager.UpdateIndexes(wrapper, [...wrapper.tags]);
  }

  EntitiesInGame.delete(removedEntityId); // Resposta instantânea
});

// Sistema de sincronização principal
system.runInterval( () => {
  const activeEntities = new Set();

  DimensionWrapper.getDimensions().forEach((dimension) => {
    dimension.getEntities({ excludeFamilies: ["ignore"] }).forEach((entity) => {
      if (entity?.isValid()) {
        activeEntities.add(entity.id);
        UpdateEntityMap(EntitiesInGame, entity, dimension, false);
      }
    });
  });

  world.getAllPlayers().forEach((player) => {
    if (player.isValid()) {
      activeEntities.add(player.id);
      UpdateEntityMap(EntitiesInGame, player, player.dimension, true);
    }
  });

  // Limpa entidades obsoletas depois

  LimpaEntities(activeEntities);

  // Analisys.EndBenchmark();
}, 5); // Intervalo de 250ms (5 ticks)

function LimpaEntities(activeEntities) {
  EntitiesInGame.forEach((id) => {
    if (!activeEntities.has(id)) {
      EntitiesInGame.delete(id);
    }
  });
}

// export class EntityManager {
//     static #gridSize = 16;
//     static #cells = new Map();

//     /**
//      * Atualiza a posição da entidade no grid espacial.
//      * @param {Entity} entity - Entidade a ser rastreada.
//      */
//     static updateEntity(entity) {
//         const pos = entity.location;
//         const x = Math.floor(pos.x / this.#gridSize);
//         const z = Math.floor(pos.z / this.#gridSize);
//         const key = `${x},${z}`;

//         // Remove a entidade de células antigas
//         this.#cells.forEach((entities, cellKey) => {
//             this.#cells.set(cellKey, entities.filter(e => e.id !== entity.id));
//         });

//         // Adiciona à nova célula
//         this.#cells.set(key, [...(this.#cells.get(key) || []), entity]);
//     }

//     /**
//      * Retorna entidades próximas a uma posição.
//      * @param {Vector3} position - Posição de referência.
//      * @param {number} radius - Raio em células (ex: 1 = 3x3 células).
//      * @returns {Entity[]} Lista de entidades próximas.
//      */
//     static getNearbyEntities(position, radius = 1) {
//         const centerX = Math.floor(position.x / this.#gridSize);
//         const centerZ = Math.floor(position.z / this.#gridSize);
//         const nearby = [];

//         for (let dx = -radius; dx <= radius; dx++) {
//             for (let dz = -radius; dz <= radius; dz++) {
//                 const key = `${centerX + dx},${centerZ + dz}`;
//                 nearby.push(...(this.#cells.get(key) || []));
//             }
//         }

//         return nearby;
//     }

//     /**
//      * Remove uma entidade do grid.
//      * @param {Entity} entity - Entidade a ser removida.
//      */
//     static removeEntity(entity) {
//         this.#cells.forEach((entities, key) => {
//             this.#cells.set(key, entities.filter(e => e.id !== entity.id));
//         });
//     }
// }
