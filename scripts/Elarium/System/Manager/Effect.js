import { BaseCache } from "../Core/Cache.js";
import { EffectType, EffectWrapper } from "../Class/Effect.js";
import { Logger } from "../Helper/Log.js";

/**
 * Gerenciador de efeitos com cache LRU
 * @extends BaseCache<string, EffectWrapper>
 */
export class EffectManager extends BaseCache {
  /**
   * Cria uma instância de EffectManager
   * @param {number} [maxSize=250] - Número máximo de efeitos armazenados
   */
  constructor(maxSize = 250) {
    super(maxSize);
  }

  /**
   * Verifica se um efeito expirou e o remove do cache se necessário
   * @private
   * @param {EffectWrapper} effect - Efeito a ser verificado
   * @param {string} key - Chave do efeito no cache
   * @returns {boolean} True se o efeito expirou e foi removido
   */
  #expirationEffect(effect, key) {
    if (effect.initDate + effect.duration < Date.now()) {
      this.remove(key);
        Logger.info(`Efeito ${effect.effect} expirado e removido`);
      return true;
    }
    return false;
  }

  /**
   * Verifica se uma entidade possui um efeito específico
   * @param {string} entityId - ID da entidade
   * @param {EffectWrapper} effect - Efeito a ser verificado
   * @returns {boolean} True se o efeito está ativo e válido
   */
  getSetEffectInCache(entityId, effect) {
    if (!this.#validateEffect(effect.effect, effect.amplifier, effect.duration)) {
      return false;
    }

    const key = this.#buildKey(entityId, effect);
    const value = this.getSync(key);

    if (value == null) {
      this.#setEffect(key, effect);
      return false;
    } else {
      if (this.#expirationEffect(effect, key)) {
        this.#setEffect(key, effect);
        return false;
      } else {
        return true;
      }
    }
  }

  /**
   * Constrói uma chave única para o cache
   * @private
   * @param {string} entityId - ID da entidade
   * @param {EffectWrapper} effect - Efeito a ser armazenado
   * @returns {string} Chave única para o cache
   */
  #buildKey(entityId, effect) {
    return `${entityId}:${effect.effect}_${effect.amplifier}_${effect.duration}`;
  }

  /**
   * Adiciona um efeito ao cache
   * @private
   * @param {string} key - Chave do efeito
   * @param {EffectWrapper} effect - Efeito a ser armazenado
   */
  #setEffect(key, effect) {
    const expirationDate = effect.initDate + effect.duration;
    this.set(key, effect, expirationDate);

    Logger.info(`Efeito ${effect.effect} aplicado em uma entidade com sucesso`);
  }

  /**
   * Valida os parâmetros de um efeito
   * @private
   * @param {EffectType} effectType - Tipo do efeito
   * @param {number} amplifier - Amplificador
   * @param {number} duration - Duração
   * @returns {boolean} True se os parâmetros são válidos
   */
  #validateEffect(effectType, amplifier, duration) {
    if (!Object.values(EffectType).includes(effectType)) {
      Logger.error(`Tipo de efeito inválido: ${effectType}`);
      return false;
    }

    if (amplifier < 0 || amplifier > 255) {
      Logger.error(`Amplificador fora do intervalo (0-255): ${amplifier}`);
      return false;
    }

    if (duration <= 0) {
      Logger.error(`Duração deve ser positiva: ${duration}`);
      return false;
    }

    return true;
  }
}