import { Logger } from "../Helper/Log.js";

export class Analisys {
  constructor() {
    throw new Error(
      "Analisys é uma classe estática e não pode ser instanciada."
    );
  }

  static ClonePlayer100x(cachePlayers) {
    if (cachePlayers.length === 0) return cachePlayers;

    const firstPlayer = cachePlayers[0];

    for (let i = 0; i < 100; i++) {
      cachePlayers.push(firstPlayer);
    }

    return cachePlayers;
  }

  static Init() {
    this.#StartedDate = Date();
    this.#EndDate = Date();
    this.#StartedMS = Date.now();
    this.#EndMS = Date.now();
    this.#ms = 0;
    this.#name = "Teste";
  }

  static #StartedMS;
  static #EndMS;
  static #StartedDate;
  static #EndDate;
  static #ms;
  static #name;

  static StartBenchmark(name) {
    this.#name = name;
    this.#StartedMS = Date.now();
    this.#StartedDate = Date();
  }

  static EndBenchmark() {
    this.#EndDate = Date();
    this.#EndMS = Date.now();
    this.#ms = this.#EndMS - this.#StartedMS;

    Logger.bench(`----- ${this.#name} -----`);
    Logger.bench(`> Rodou em: ${this.#ms}ms`);
    // Logger.bench(`> Iniciou em: ${this.#StartedDate.toISOString()}`);
    // Logger.bench(`> Terminou em: ${this.#EndDate.toISOString()}`);
  }
}

Analisys.Init();


// const allPlayers = world.getPlayers();

// if (allPlayers.length !== cachePlayers.length) {
//   Logger.error(`Desincronização detectada em Players!
//     Reais: ${allPlayers.length}
//     Rastreados: ${cachePlayers.length}`);
// }

// var entitiesCache = EntityManager.countEntities();

// let EntitiesNoCache = 0;

// // Lista de dimensões disponíveis
// const dimensions = ["overworld", "nether", "the_end"];

// for (const dimensionId of dimensions) {
//   const dimension = world.getDimension(dimensionId);
//   if (dimension) {
//     EntitiesNoCache += dimension.getEntities({
//       excludeFamilies: ["ignore"],
//     }).length;
//   }
// }

// if (EntitiesNoCache !== entitiesCache) {
//   Logger.error(`Desincronização detectada em Entidades!
//     Reais: ${EntitiesNoCache}
//     Rastreadas: ${entitiesCache}`);
// }