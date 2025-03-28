import { world, system, Entity, Dimension, Player, BlockRecordPlayerComponent } from "@minecraft/server";
import { DimensionTypeEnum, DimensionWrapper } from "./Dimension.js";
import { EntityManager } from "../Manager/Entity.js";
import { TagManager } from "../Manager/Tag.js";
import { Logger } from "../Helper/Log.js";

/**
 * Classe para representar entidades com a dimensão
 */
export class EntityWrapper {
  /**
   * Cria uma instância de EntityWrapper
   * @param {Entity} entity - A entidade em si
   * @param {Dimension} dimension - A dimensão onde a entidade está
   * @param {Boolean} isPlayer - A entidade em si
   */
  constructor(entity, dimension, isPlayer) {
    if (!entity?.isValid()) {
    }

    /** @type {Entity} */
    this.entity = entity; // A entidade em si
    
    /** @type {String} */
    this.dimensionId = dimension.id; // Nome da dimensão
    /** @type {Dimension} */
    this.dimension = dimension; // A dimensão em si
    /** @type {boolean} */
    this.isPlayer = isPlayer; // Verifica se é jogador
    this.isAnimal = this.#checkIfAnimal(entity.typeId); // Verifica se é animal
    this.isMob = this.#checkIfMob(entity.typeId); // Verifica se é mob hostil


    this.tags = entity.getTags?.() || new Set(); // Tags da entidade
    this.updateTags();
  }

  addTag(tag) {
    if (!this.tags.has(tag)) {
      this.entity.addTag(tag);
      this.updateTags();
    }
  }

  updateTags() {
    const oldTags = new Set(this.tags);
    try {
      this.tags = new Set(this.entity.getTags?.() || []);
      EntityManager.UpdateIndexes(this, oldTags);
    } catch (e) {
      this.tags = new Set();
    }
  }

  removeTag(tag) {
    if (this.tags.has(tag)) {
      this.entity.removeTag(tag);
      this.updateTags();
    }
  }

  /**
   * Verifica se a entidade é um animal
   * @param {string} typeId - Tipo da entidade
   * @returns {boolean} True se a entidade é um animal
   */
  #checkIfAnimal(typeId) {
    const animalTypes = [
      "minecraft:cow",
      "minecraft:sheep",
      "minecraft:pig",
      "minecraft:chicken",
      "minecraft:horse",
      "minecraft:llama",
      "minecraft:rabbit",
      "minecraft:turtle",
      "minecraft:fox",
      "minecraft:bee",
      "minecraft:cat",
      "minecraft:wolf",
    ];
    return animalTypes.includes(typeId);
  }

  /**
   * Verifica se uma entidade possui um efeito específico
   * @param {EffectWrapper} effect - Efeito a ser verificado
   * @returns {boolean} True se o efeito está ativo e válido
   */
  hasEffect(effectWrapper) {
    const cachedEffect = this.effectManager.getSetEffectInCache(
      this.entity.id,
      effectWrapper
    );

    if (cachedEffect == true) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Verifica se a entidade é um mob hostil
   * @param {string} typeId - Tipo da entidade
   * @returns {boolean} True se a entidade é um mob hostil
   */
  #checkIfMob(typeId) {
    const mobTypes = [
      "minecraft:zombie",
      "minecraft:skeleton",
      "minecraft:creeper",
      "minecraft:enderman",
      "minecraft:witch",
      "minecraft:spider",
      "minecraft:husk",
      "minecraft:slime",
      "minecraft:blaze",
      "minecraft:ghast",
      "minecraft:pillage",
      "minecraft:monster",
      "minecraft:mob",
    ];
    return mobTypes.includes(typeId);
  }

  /**
   * Spawna partículas na localização da entidade
   * @param {string[]} particlesId - IDs das partículas a serem spawnadas
   * @param {number} [count=1] - Quantidade de partículas
   */
  spawnParticles(particlesId, count = 1) {
    const loc = this.entity.location;
    particlesId.forEach((particleId) => {
      this.dimension.spawnParticle(particleId, loc, {
        amount: count,
        horizontalSpread: 0.2,
        verticalSpread: 0.1,
      });
    });
  }

  /**
   * Verifica se a entidade é válida
   * @returns {boolean} True se a entidade e a dimensão são válidas
   */
  isValid() {
    return (
      this.entity?.isValid?.() &&
      this.entity?.isValid
    );
  }

  /**
   * Retorna o número de entidades no cache
   * @returns {Player} Quantidade de entidades armazenadas
   */
  getPlayerObj() {
    return this.entity;
  }

  /**
   * Obtém todas as tags de uma entidade
   * @returns {Set<string>} Conjunto de tags da entidade ou um conjunto vazio
   */
  staticgetTags() {
    return this.tagManager.returnTags(this.entity.id);
  }

  /**
   * Aplica efeitos à entidade sem repetição
   * @param {EffectWrapper[]} effects - Lista de efeitos a serem aplicados
   * @param {boolean} [particleShow=false] - Mostrar partículas ao aplicar efeitos
   */
  applyEffectNoRepeat(effects, particleShow = false) {
    effects.forEach((effect) => {
      if (!this.effectManager.hasEffect(this.entity.id, effect)) {
        this.entity.addEffect(effect.id, effect.duration, {
          amplifier: effect.amplifier,
          showParticles: particleShow,
        });
      }
    });
  }
}
