import { BaseCache } from "../Core/Cache.js";
import { Logger } from "../Helper/Log.js";

/**
 * Gerenciador de Tags com cache LRU
 * @extends BaseCache<string, Set<string>>
 */
export class TagManager extends BaseCache {
  /**
   * Cria uma instância de TagManager
   * @param {number} [maxSize=800] - Número máximo de entidades armazenadas no cache
   */
  constructor(maxSize = 800) {
    super(maxSize);
  }

  /**
   * Adiciona uma tag a uma entidade
   * @param {string} entityId - ID da entidade
   * @param {string} tag - Tag a ser adicionada
   */
  addTag(entityId, tag) {
    if (!this.#validateTag(tag)) return;

    const tags = this.getSync(entityId) || new Set();
    if (!tags.has(tag)) {
      tags.add(tag);
      this.set(entityId, tags);
    //   Logger.info(`Tag "${tag}" adicionada a ${entityId}`);
    }
  }

  /**
   * Remove uma tag de uma entidade
   * @param {string} entityId - ID da entidade
   * @param {string} tag - Tag a ser removida
   */
  removeTag(entityId, tag) {
    const tags = this.getSync(entityId);
    if (!tags || !tags.has(tag)) return;

    tags.delete(tag);
    if (tags.size === 0) {
      this.remove(entityId); // Remove do cache se não houver mais tags
    } else {
      this.set(entityId, tags);
    }
    // Logger.info(`Tag "${tag}" removida de ${entityId}`);
  }

  /**
   * Verifica se uma entidade possui uma tag específica
   * @param {string} entityId - ID da entidade
   * @param {string} tag - Tag a ser verificada
   * @returns {boolean} True se a entidade possui a tag
   */
  hasTag(entityId, tag) {
    const tags = this.getSync(entityId);
    return tags ? tags.has(tag) : false;
  }

  /**
   * Obtém todas as tags de uma entidade
   * @param {string} entityId - ID da entidade
   * @returns {Set<string>} Conjunto de tags da entidade ou um conjunto vazio
   */
  returnTags(entityId) {
    return this.getSync(entityId) || new Set();
  }

  /**
   * Valida uma tag antes de adicioná-la
   * @private
   * @param {string} tag - Tag a ser validada
   * @returns {boolean} True se a tag for válida
   */
  #validateTag(tag) {
    if (typeof tag !== "string" || tag.length === 0 || tag.length > 32) {
      Logger.error(`Tag inválida: "${tag}". Deve ter entre 1 e 32 caracteres.`);
      return false;
    }
    return true;
  }
}
