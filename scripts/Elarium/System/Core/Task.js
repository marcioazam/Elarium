import { Logger } from "../Helper/Log.js";
import { SafeHandler } from "./Handler.js";

export const Priority = Object.freeze({
    High: "high",
    Normal: "normal",
    Low: "low",
    Default: "normal" // Valor padrão
});

export class TaskScheduler {
  static #tasks = [];
  static #isRunning = false;

  /**
   * Adiciona uma tarefa ao agendador.
   * @param {Function} task - A tarefa a ser executada.
   * @param {Priority} priority - Prioridade da tarefa ("high", "normal", "low").
   * @returns {Promise} Uma Promise que resolve quando a tarefa é concluída.
   */
  static addTask(task, priority = "normal") {
    return new Promise((resolve, reject) => {
        const priorityLevel = {
            [Priority.High]: 0,
            [Priority.Normal]: 1,
            [Priority.Low]: 2
        }[priority] || 1;
      this.#tasks.push({ task, priority: priorityLevel, resolve, reject });
      this.#tasks.sort((a, b) => a.priority - b.priority); // Ordena por prioridade
      if (!this.#isRunning) this.#processTasks();
    });
  }

  /**
   * Processa as tarefas na fila.
   */
  static async #processTasks() {
    this.#isRunning = true;
    while (this.#tasks.length > 0) {
      const { task, resolve, reject } = this.#tasks.shift();
      try {
        const result = await task(); // Executa a tarefa e aguarda sua conclusão
        resolve(result); // Resolve a Promise com o resultado da tarefa
      } catch (error) {
        reject(error); // Rejeita a Promise em caso de erro
      }
      await new Promise((resolve) => setTimeout(resolve, 10)); // Delay para liberar a thread
    }
    this.#isRunning = false;
  }

  schedulePeriodicTask(task, intervalMs,  priority = Priority.Default) {
    let isCancelled = false;
    let timeoutId = null; // Armazena o ID do timeout para cancelamento

    const runTask = async () => {
      if (isCancelled) return;

      try {
        await task();
      } catch (error) {
        Logger.error(`Erro em tarefa periódica: ${error}`);
      }

      if (!isCancelled) {
        // Armazena o ID do timeout para controle
        timeoutId = system.runTimeout(() => {
          this.addTask(runTask, priority);
        }, intervalMs / 50);
      }
    };

    this.addTask(runTask, priority);

    return {
      cancel: () => {
        if (isCancelled) {
          Logger.warn("Tarefa já foi cancelada anteriormente!");
          return;
        }
        isCancelled = true;
        if (timeoutId !== null) {
          system.clearRun(timeoutId); // Cancela o próximo agendamento
          Logger.info("Tarefa periódica cancelada com sucesso!");
        }
      },
      get status() {
        return isCancelled ? "cancelled" : "active";
      },
    };
  }
  //  // Iniciar tarefa
  // const task = TaskScheduler.schedulePeriodicTask(
  //     () => world.getDimension("overworld").runCommandAsync("say Tick!"),
  //     1000 // 1 segundo
  // );

  // // Cancelar após 5 segundos
  // system.runTimeout(() => {
  //     if (task.status === "active") {
  //         task.cancel();
  //     }
  // }, 100); // 100 ticks = 5 segundos

  /**
   * Executa uma tarefa longa em etapas para evitar bloqueio da thread principal.
   * @param {Function} task - Função geradora que divide a tarefa em etapas (yield).
   * @param {Priority} priority - Prioridade das etapas.
   */
  async longRunningTask(task, steps,  priority = Priority.Default) {
    let currentStep = 0;

    const runStep = async () => {
      if (currentStep < steps) {
        await task(currentStep); // Executa a etapa atual
        currentStep++;
        this.addTask(runStep, priority); // Agenda a próxima etapa
      }
    };

    this.addTask(runStep, priority);
  }

  //   // Tarefa que gera 100 blocos em etapas
  // const generateBlocks = async (step) => {
  //     const dimension = world.getDimension("overworld");
  //     for (let i = 0; i < 10; i++) {
  //         dimension.getBlock({ x: step * 10 + i, y: 0, z: 0 }).setType("stone");
  //     }
  // };

  static async runParallelTasks(tasks) {
    await Promise.all(tasks.map(TaskScheduler.addTask));
  }
  //  // Definindo as tarefas separadamente
  // const tarefas = [
  //     () => world.getDimension("overworld").runCommandAsync("say Tarefa 1 concluída!"),
  //     () => world.getDimension("overworld").runCommandAsync("say Tarefa 2 concluída!"),
  //     () => world.getDimension("overworld").runCommandAsync("say Tarefa 3 concluída!")
  // ];

  // // Chamando a função
  // runParallelTasks(tarefas);
}
