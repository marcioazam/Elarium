import { Logger } from "../Helper/Log.js";

/**
 * Classe de cache genérico com estratégia LRU e TTL opcional
 * @template KeyType - Tipo das chaves do cache
 * @template T - Tipo dos valores armazenados
 */
export class BaseCache {
  /**
   * @param {number} [maxSize=500] - Tamanho máximo do cache
   * @param {number} [defaultTTL=0] - TTL padrão em milissegundos (0 = sem TTL)
   */
  constructor(maxSize = 500, defaultTTL = 0) {
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
    /** @type {Map<KeyType, T>} */
    this.cache = new Map();
    /** @type {Map<KeyType, NodeJS.Timeout>} */
    this.timers = new Map();
  }

  /**
   * Mantém o cache dentro do limite de tamanho usando LRU
   * @private
   */
  #ensureCacheSize() {
    while (this.cache.size > this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.#removeItem(oldestKey);
    }
  }

  /**
   * Remove um item do cache e limpa seu timer
   * @private
   * @param {KeyType} key - Chave do item
   */
  #removeItem(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    this.cache.delete(key);
  }

  /**
   * Configura o TTL para um item
   * @private
   * @param {KeyType} key - Chave do item
   * @param {number} ttl - Tempo de vida em milissegundos
   */
  #setTTL(key, ttl) {
    if (ttl > 0) {
      if (this.timers.has(key)) {
        clearTimeout(this.timers.get(key));
      }
      this.timers.set(key, setTimeout(() => {
        this.#removeItem(key);
      }, ttl));
    }
  }

  /**
   * Obtém um item do cache e atualiza sua posição (LRU)
   * @param {KeyType} key - Chave do item
   * @param {() => T} [fallbackFn] - Função de fallback para criar o valor se não existir
   * @param {number} [ttl] - Tempo de vida em milissegundos (opcional)
   * @returns {T | null | undefined} Valor armazenado ou resultado do fallback
   */
  get(key, fallbackFn, ttl) {
    if (key === undefined || key === null) {
      Logger.error("Chave inválida!", "get");
      return null;
    }

    if (this.cache.has(key)) {
      Logger.debug(`Cache hit: ${key}`);
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }

    Logger.debug(`Cache miss: ${key}`);
    const value = fallbackFn?.();
    if (value !== undefined) this.set(key, value, ttl);
    return value;
  }

  /**
   * Adiciona ou atualiza um item no cache
   * @param {KeyType} key - Chave do item
   * @param {T} value - Valor a ser armazenado
   * @param {number} [ttl] - Tempo de vida em milissegundos (opcional)
   * @returns {boolean} True se o valor foi armazenado com sucesso
   */
  set(key, value, ttl = this.defaultTTL) {
    if (value === undefined || value === null) {
      Logger.error("Valor inválido!", "set");
      return false;
    }

    if (this.cache.has(key)) {
      this.#removeItem(key);
    }

    this.cache.set(key, value);
    this.#setTTL(key, ttl);
    this.#ensureCacheSize();
    return true;
  }

  /**
   * Verifica se uma chave existe no cache
   * @param {KeyType} key - Chave a ser verificada
   * @returns {boolean} True se a chave existe
   */
  has(key) { return this.cache.has(key); }

  /**
   * Remove um item do cache
   * @param {KeyType} key - Chave do item a ser removido
   * @returns {boolean} True se o item foi removido
   */
  remove(key) {
    this.#removeItem(key);
    return true;
  }

  /**
   * Limpa todo o conteúdo do cache
   * @returns {void}
   */
  clear() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this.cache.clear();
  }

  /**
   * Retorna o número de itens no cache
   * @returns {number} Quantidade de itens armazenados
   */
  size() { return this.cache.size; }

  /**
   * Versão síncrona de alta performance para obtenção de valores
   * @param {KeyType} key - Chave do item
   * @returns {T | null} Valor armazenado ou null
   */
  getSync(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return null;
  }

  /**
   * Adiciona múltiplos itens ao cache de forma otimizada
   * @param {Iterable<[KeyType, T]>} items - Array de pares [chave, valor]
   * @param {number} [ttl] - Tempo de vida em milissegundos (opcional)
   * @returns {void}
   */
  batchSet(items, ttl = this.defaultTTL) {
    for (const [key, value] of items) {
      this.set(key, value, ttl);
    }
  }

  /**
   * Retorna estatísticas do cache
   * @returns {{
   *  size: number,
   *  maxSize: number,
   *  hitRate: string,
   *  ttlEnabled: boolean
   * }} Objeto com estatísticas
   */
  stats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: this.#calculateHitRate(),
      ttlEnabled: this.defaultTTL > 0
    };
  }

  /**
   * Calcula a taxa de acertos do cache
   * @private
   * @returns {string} Taxa de acertos formatada
   */
  #calculateHitRate() {
    return this.cache.size > 0 
      ? (this.hits / (this.hits + this.misses)).toFixed(2)
      : "0.00";
  }
}